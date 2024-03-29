USE Music;
GO

CREATE LOGIN [NT AUTHORITY\IUSR] FROM WINDOWS;
GO

GRANT SELECT ON OBJECT::dbo.vw_ListSongs TO [NT AUTHORITY\IUSR];
GRANT EXECUTE ON OBJECT::dbo.usp_AddSong TO [NT AUTHORITY\IUSR];
GRANT EXECUTE ON OBJECT::dbo.usp_AddSongWeb TO [NT AUTHORITY\IUSR];
GRANT EXECUTE ON OBJECT::dbo.usp_UpdateSongList TO [NT AUTHORITY\IUSR];
GRANT SELECT ON OBJECT::dbo.Songs TO [NT AUTHORITY\IUSR];
GRANT DELETE ON OBJECT::dbo.Songs TO [NT AUTHORITY\IUSR];