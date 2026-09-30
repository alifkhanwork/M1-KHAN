CREATE PROCEDURE [dbo].[spItems_Insert]
    @name nvarchar(100), @code nvarchar(50), @brand nvarchar(50), @unitPrice decimal(10,2)
AS
begin
    INSERT INTO dbo.Items (Name, Code, Brand, UnitPrice)
    VALUES (@name, @code, @brand, @unitPrice)
end