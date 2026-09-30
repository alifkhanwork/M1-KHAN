CREATE PROCEDURE [dbo].[spItems_Update]
    @id int, @name nvarchar(100), @code nvarchar(50), @brand nvarchar(50), @unitPrice decimal(10,2)
AS
begin
    UPDATE dbo.Items SET Name=@name, Code=@code, Brand=@brand, UnitPrice=@unitPrice WHERE Id=@id
end