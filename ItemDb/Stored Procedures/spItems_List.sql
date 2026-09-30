CREATE PROCEDURE [dbo].[spItems_List]
AS
begin
    set nocount on;
    SELECT [Id], [Name], [Code], [Brand], [UnitPrice] FROM dbo.Items;
end