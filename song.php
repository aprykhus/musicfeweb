<?php
$id = $_REQUEST["id"];
/* Specify the server and connection string attributes. */
$serverName = "(local)\SQLEXPRESS";
$connectionInfo = array( "Database"=>"Music");

/* Connect using Windows Authentication. */
$conn = sqlsrv_connect( $serverName, $connectionInfo);
if( $conn === false )
{
    echo "Unable to connect.</br>";
    die( print_r( sqlsrv_errors(), true));
}

/* Query Music db for song */
$tsql = "SELECT * FROM vw_ListSongs WHERE SongID = ".$id;
$stmt = sqlsrv_query( $conn, $tsql);
if( $stmt === false)
{
    echo "Error in executing query.</br>";
    dir( print_r( sqlsrv_errors(), true));
}

/* Retreive and display the results of the query. */
$row = sqlsrv_fetch_array($stmt);
$space = " ";
echo json_encode($row);

/* Free statement and connection resources. */
sqlsrv_free_stmt( $stmt);
sqlsrv_close( $conn);
?>