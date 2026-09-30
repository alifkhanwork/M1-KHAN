using System;
using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace ItemDataLibrary.Db
{
    public interface ISqlDataAccess
    {
        List<T> LoadData<T, U>(string sql, U parameters, string connectionStringName, bool isStoredProcedure);
        void SaveData<T>(string sql, T parameters, string connectionStringName, bool isStoredProcedure);
    }

    public class SqlDataAccess : ISqlDataAccess
    {
        private readonly IConfiguration _config;
        public SqlDataAccess(IConfiguration config) => _config = config ?? throw new ArgumentNullException(nameof(config));

        public List<T> LoadData<T, U>(string sql, U parameters, string connectionStringName, bool isStoredProcedure)
        {
            if (string.IsNullOrWhiteSpace(connectionStringName))
                throw new ArgumentException("connectionStringName is required", nameof(connectionStringName));

            var connStr = _config.GetConnectionString(connectionStringName);
            if (string.IsNullOrWhiteSpace(connStr))
                throw new InvalidOperationException($"Connection string '{connectionStringName}' is missing or empty. Check appsettings and DI.");

            using IDbConnection conn = new SqlConnection(connStr);
            var type = isStoredProcedure ? CommandType.StoredProcedure : CommandType.Text;
            return conn.Query<T>(sql, parameters, commandType: type).ToList();
        }

        public void SaveData<T>(string sql, T parameters, string connectionStringName, bool isStoredProcedure)
        {
            if (string.IsNullOrWhiteSpace(connectionStringName))
                throw new ArgumentException("connectionStringName is required", nameof(connectionStringName));

            var connStr = _config.GetConnectionString(connectionStringName);
            if (string.IsNullOrWhiteSpace(connStr))
                throw new InvalidOperationException($"Connection string '{connectionStringName}' is missing or empty. Check appsettings and DI.");

            using IDbConnection conn = new SqlConnection(connStr);
            var type = isStoredProcedure ? CommandType.StoredProcedure : CommandType.Text;

            try
            {
                conn.Execute(sql, parameters, commandType: type);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed executing SQL '{sql}' using connection '{connectionStringName}'.", ex);
            }
        }
    }
}