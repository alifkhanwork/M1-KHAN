CREATE PROCEDURE [dbo].[spItems_Delete]
    @id int
AS
begin
    DELETE FROM dbo.Items WHERE Id = @id
end