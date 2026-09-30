using ItemDataLibrary;
using ItemDataLibrary.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ItemAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemController : ControllerBase
    {
        private readonly ISqlData _db;
        public ItemController(ISqlData db) => _db = db;

        [HttpGet]
        public ActionResult ListItems() => Ok(_db.ListItems());

        [HttpGet("{id}")]
        public ActionResult GetItem(int id)
        {
            var item = _db.GetItem(id);
            return item == null ? NotFound() : Ok(item);
        }

        [Authorize]
        [HttpPost]
        public ActionResult AddItem([FromBody] ItemModel item)
        {
            try { _db.AddItem(item); return Ok("Item created."); }
            catch (Exception) { return Conflict("Item code already exists."); }
        }

        [Authorize]
        [HttpPut("{id}")]
        public ActionResult UpdateItem(int id, [FromBody] ItemModel item)
        {
            item.Id = id;
            _db.UpdateItem(item);
            return Ok("Item updated.");
        }


        [Authorize]
        [HttpDelete("{id}")]
        public ActionResult DeleteItem(int id)
        {
            _db.DeleteItem(id);
            return Ok("Item deleted.");
        }
    }
}