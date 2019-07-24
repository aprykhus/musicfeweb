# MusicwWebFE
## Getting Started
Clone repo to local machine

### Prerquisites
Windows 10
SQL Server Express 2016 w/ Windows Authentication
IIS
PHP for IIS https://php.iis.net/

### Installing
Create directory called musicwebfe under inetpub\wwwroot
Copy sandbox directory to inetpub\wwwroot\musicwebfe directory
Restore music.bak to SQL Server

## Running the tests
Navigate to http://localhost/musicfe/sandbox/song.html
Verify the form and data grid populate data.
If they don't verify SQL Server db service is running. From command line run sc query mssql$sqlexpress.