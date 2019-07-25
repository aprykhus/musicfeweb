# MusicFEweb
## Getting Started
Clone repository to your local machine
1. Open command prompt as Administrator
2. Choose a directory to clone to. For example C:\test.
3. Type the following:
    * git clone https://github.com/aprykhus/musicfeweb.git
    * press Enter
4. This will create the folder C:\test\musicfeweb

### Prerequisites
* Windows 10
* SQL Server Express 2016 with Windows Authentication
* IIS
* PHP for IIS -- https://php.iis.net/

### Installing
* Create a directory called **musicfe** under the IIS directory, by default it's %SystemDrive%\inetpub\wwwroot (e.g. C:\inetpub\wwwroot).
    * You should now have a folder C:\inetpub\wwwroot\musicfe
* Copy **C:\test\musicfeweb\sandbox** directory to C:\inetpub\wwwroot\musicfe directory
* Restore **music.bak** to SQL Server. This can be done using SQL Server Management Studio (SSMS):
    * From the Object Explorer pane right-click Databases and click **Restore Database...**
    * Click the **Device** option and click the ellipsis (...) button to the right, click Add and browse to the repo you cloned in Getting Started. For example: C:\test\musicfeweb\Music.bak, select Music.bak and click OK. Click OK again.
    * From the Database drop-down select Music
    * On the left click the **Options** page, check the box **Overwrite the existing database (WITH REPLACE)** and click OK
        * You should receive a message saying "Database 'Music' restored successfully".
    * Alternatively you could run this SQL script:

            CREATE DATABASE Music;
            GO

            RESTORE DATABASE Music
            FROM DISK = 'C:\test\musicfeweb\Music.bak'
            WITH REPLACE, RECOVERY;

* Run the script C:\test\musicfeweb\SQLPermissions.sql.
    * This adds the IIS anonymous authentication account: NT AUTHORITY\IUSR as a Login in SQL Server and grants IUSR permissions to objects in the Music database. This is required for PHP to run SQL to pull data into the webpage.

## Running the tests
* Navigate to http://localhost/musicfe/sandbox/song.html
* Verify the form and table populate the data from SQL.
* If they don't verify IIS and SQL Server services are running:
    * From Command Prompt (Administrator) run:
        * sc query w3svc 
        * sc query mssql$sqlexpress 
    * If STATE is not RUNNING for these services, start them:
        * sc start w3svc
        * sc start mssql$sqlexpress
    * NOTE: You can also use the 'net use' command to start services.
* Refresh song.html in your browser. Once you see the data populate the form and table you can test navigation.

### Navigation
1. Click on the Next and Previous buttons and verify the record updates in the form and the record is highlighted on the table below.
2. Enter a number (e.g. 315) in SongID text box and click the Go button. Verify the record is updated on form and scrolled to and highlighted on the table.
3. Click the Last button and click the First button. Ensure the last and first records are selected.

### Search
1. Click the Clear button and click in the Artist field. Type the word Beatles and click the Search button. A song by The Beatles should appear.
2. Click the Clear button and click in the Title field. Type the word USSR and click the Search button. The song Back in the USSR by The Beatles should appear.
\* Only the Artist and Title fields are searchable

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