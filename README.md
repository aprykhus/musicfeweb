# MusicFEweb
## Getting Started
Clone repository to your local machine

### Prerequisites
Windows 10
SQL Server Express 2016 with Windows Authentication
IIS
PHP for IIS https://php.iis.net/

### Installing
Create directory called musicfe under IIS directory, by default it's %SystemDrive%\inetpub\wwwroot (e.g. C:\inetpub\wwwroot)
Copy sandbox directory to inetpub\wwwroot\musicfe directory
Restore music.bak to SQL Server. This can be done using SQL Server Management Studio (SSMS)
The database needs to be called Music for the web application to work.
IUSR account needs access to the Music database. You'll need to add NT AUTHORITY\IUSR as an account on SQL Server. This can be done in SSMS by right-clicking the Security/Logins node and chosing New Login...
You can either grant IUSR db_owner to the entire Music database. If you choose to grant by object.

Database role membership to Music database: db_datareader

Objects to grant NT AUTHORITY\IUSR execute permission to:
dbo.usp_AddSongWeb
dbo.usp_UpdateSongList


## Running the tests
Navigate to http://localhost/musicfe/sandbox/song.html
Verify the form and table populate the data from SQL.
If they don't verify IIS and SQL Server are running.
From Command Prompt (Administrator) run:
sc query w3svc
sc query mssql$sqlexpress

If STATE is not RUNNING for these services, start them:

sc start w3svc
sc start mssql$sqlexpress

NOTE: You can also use the 'net use' command to start services.
Refresh song.html in your browser. Once you see the data populate the form and table you can test navigation.

### Navigation
1. Click on the Next and Previous buttons and verify the record updates in the form and the record is highlighted on the table below.
2. Enter a number (e.g. 315) in SongID text box and click the Go button. Verify the record is updated on form and scrolled to and highlighted on the table.
3. Click the Last button and click the First button. Ensure the last and first records are selected.

### Search
1. Click the Clear button and click in the Artist field. Type the word Beatles and click the Search button. A song by The Beatles should appear.
2. Click the Clear button and click in the Title field. Type the word USSR and click the Search button. The song Back in the USSR by The Beatles should appear.
*Only the Artist and Title fields are searchable

### Update
1. On the song Back in the USSR by The Beatles, change USSR to USA, and click the Update button. Verify the song title updates in the table, click the Previous button and the Next button to refresh the form. Verify the song now reads Back in the USA. Change USA back to USSR and click the Update button.
2. Click on the Clear button and in the Artist field type Alan Parson's Project and click the Search button. Remove the apostrophe so it reads Alan Parsons Project and click the Update button. This will update all entries for that Aritst in the database.

### Add Song
1. Click the Clear button to clear all fields. In the Artist field type Guns N' Roses. In the Title field type Welcome to the Jungle. In the Year field type 1988. In the Peak field type 7. Click the Add Song button. The table should update and the SongID should populate the form.
2. Repeat step 1 for Add Song. You will get prompted with an alert box with the words 'Song already exists by this artist'.

### Delete
1. Click the Clear button. In the Artist field type Guns N' Roses. In the Title filed type Welcome to the Jungle and click the Search button. Now click the Delete button. The form should move to the next record and update the table.

### Table Navigation
1. Click on a song in the data grid (table). The song selected should now appear on the form.