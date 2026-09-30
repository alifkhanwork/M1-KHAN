using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ItemDataLibrary;
using ItemDataLibrary.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace ItemAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ISqlData _db;

        public LoginController(IConfiguration config, ISqlData db)
        {
            _config = config;
            _db = db;
        }

        private string GenerateToken(UserModel user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName)
            };
            var token = new JwtSecurityToken(_config["Jwt:Issuer"], _config["Jwt:Audience"],
                claims, expires: DateTime.Now.AddMinutes(15), signingCredentials: credentials);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public ActionResult Login([FromBody] UserLogin login)
        {
            UserModel? user = _db.Authenticate(login.UserName, login.Password);
            if (user == null) return NotFound("User not found");

            return Ok(new { id_token = GenerateToken(user), id = user.Id, userName = user.UserName });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public ActionResult Register([FromBody] UserModel user)
        {
            try
            {
                _db.Register(user.UserName, user.FirstName, user.LastName, user.Password);
                return Ok("User registered.");
            }
            catch (Exception)
            {
                return Conflict("Username already taken.");
            }
        }
    }
}