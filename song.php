<?php
$id = $_REQUEST["id"]; # songID to query in db
$qtype = $_REQUEST["qtype"]; # Type of query 1 = song row 2 = min/max SongID
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

if ($qtype == 1)
{
    /* Query Music db for song */
    $tsql = "SELECT * FROM vw_ListSongs WHERE SongID = ".$id;
    $stmt = sqlsrv_query($conn, $tsql);
    if( $stmt === false)
    {
        echo "Error in executing query.</br>";
        die( print_r( sqlsrv_errors(), true));
    }

    /* Retreive and display the results of the query. */
    $row = sqlsrv_fetch_array($stmt);
    $space = " ";
    echo json_encode($row);
}

if ($qtype == 2)
{
    /* Fetch min/max songIDs */

    $tsql = "Select MIN(SongID) AS minSongID, MAX(SongID) AS maxSongID FROM vw_ListSongs";
    $stmt = sqlsrv_query( $conn, $tsql);
    if( $stmt === false)
    {
        echo "Error in executing query.</br>";
        die( print_r( sqlsrv_errors(), true));
    }
    $row = sqlsrv_fetch_array($stmt);
    echo json_encode($row);
}

/* Free statement and connection resources. */
sqlsrv_free_stmt( $stmt);
sqlsrv_close( $conn);
?>