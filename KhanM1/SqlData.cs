using ItemDataLibrary.Db;
using ItemDataLibrary.Models;

namespace ItemDataLibrary
{
    public interface ISqlData
    {
        List<ItemModel> ListItems();
        ItemModel? GetItem(int id);
        void AddItem(ItemModel item);
        void UpdateItem(ItemModel item);
        void DeleteItem(int id);
        UserModel? Authenticate(string username, string password);
        void Register(string username, string firstName, string lastName, string password);
    }

    public class SqlData : ISqlData
    {
        private const string connectionStringName = "SqlDb";
        private readonly ISqlDataAccess _db;
        public SqlData(ISqlDataAccess db) => _db = db;

        public List<ItemModel> ListItems() =>
            _db.LoadData<ItemModel, dynamic>("dbo.spItems_List", new { }, connectionStringName, true);

        public ItemModel? GetItem(int id) =>
            _db.LoadData<ItemModel, dynamic>("dbo.spItems_Details", new { id }, connectionStringName, true).FirstOrDefault();

        public void AddItem(ItemModel i) =>
            _db.SaveData<dynamic>("dbo.spItems_Insert", new { i.Name, i.Code, i.Brand, i.UnitPrice }, connectionStringName, true);

        public void UpdateItem(ItemModel i) =>
            _db.SaveData<dynamic>("dbo.spItems_Update", new { i.Id, i.Name, i.Code, i.Brand, i.UnitPrice }, connectionStringName, true);

        public void DeleteItem(int id) =>
            _db.SaveData<dynamic>("dbo.spItems_Delete", new { id }, connectionStringName, true);

        public UserModel? Authenticate(string username, string password) =>
    _db.LoadData<UserModel, dynamic>("dbo.spUsers_Authenticate",
        new { username, password }, connectionStringName, true).FirstOrDefault();

        public void Register(string username, string firstName, string lastName, string password) =>
            _db.SaveData<dynamic>("dbo.spUsers_Register",
                new { username, firstName, lastName, password }, connectionStringName, true);
    }
}