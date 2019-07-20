<?php
$id = $_REQUEST["id"]; # songID to query in db
$qtype = $_REQUEST["qtype"]; # Type of query 1 = song row 2 = min/max SongID
$qupdate = $_REQUEST["edit"]; # JSON data to update song
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

if ($qtype == 3)
{
    # Update button server-side code
    $basesql = "EXEC usp_UpdateSongList";
    $jsonarr = json_decode($qupdate, true);
    $songid = print_r($jsonarr['songid'], true);
    $artist = print_r($jsonarr['artist'], true);
    $title = print_r($jsonarr['title'], true);
    $year = print_r($jsonarr['year'], true);
    $peak = print_r($jsonarr['peak'], true);
    $tsql = $basesql." ".$songid.", '".$artist."', '".$title."', '".$year."', ".$peak;
    $stmt = sqlsrv_query( $conn, $tsql);
    if( $stmt === false)
    {
        echo "Error in executing query.</br>";
        die( print_r( sqlsrv_errors(), true));
    }
/*         $row = sqlsrv_fetch_array($stmt);
    echo json_encode($row); */
}

if ($qtype == 4)
{
    # Search button
    $tsql = "";
    $jsonarr = json_decode($qupdate, true);
    $artist = print_r($jsonarr['artist'], true);
    $title = print_r($jsonarr['title'], true);
    if($artist != "" && $title == "")
    {
        $basesql = "SELECT * FROM vw_ListSongs WHERE Artist LIKE '%";
        $tsql    = $basesql.$artist."%'";
    }
    if($artist == "" && $title != "")
    {
        $basesql = "SELECT * FROM vw_ListSongs WHERE Title LIKE '%";
        $tsql    = $basesql.$title."%'";
    }
    if($artist != "" && $title != "")
    {
        $basesql = "SELECT * FROM vw_ListSongs WHERE Artist LIKE '%";
        $tsql    = $basesql.$artist."%' AND Title LIKE '%".$title."%'";
    }
    $stmt = sqlsrv_query( $conn, $tsql);
    if( $stmt === false)
    {
        echo "Error in executing query.</br>";
        die( print_r( sqlsrv_errors(), true));
    }
    $row = sqlsrv_fetch_array($stmt);
    echo json_encode($row);
}

if ($qtype == 5)
{
    # Add button
    $jsonarr = json_decode($qupdate, true);
    $artist = print_r($jsonarr['artist'], true);
    $title = print_r($jsonarr['title'], true);
    $year = print_r($jsonarr['year'], true);
    $peak = print_r($jsonarr['peak'], true);
    $tsql = "EXEC usp_AddSongWeb '".$artist."', '".$title."', '".$year."', ".$peak.";";
    $stmt = sqlsrv_query( $conn, $tsql);
    if( $stmt === false)
    {
        echo "Error in executing query.</br>";
        die( print_r( sqlsrv_errors(), true));
    }
    sqlsrv_next_result($stmt);
    sqlsrv_next_result($stmt); // move forward to third result
    $row = sqlsrv_fetch_array($stmt);
    echo $row[0];
}

if ($qtype == 6)
{
    # Delete button
    // $jsonarr = json_decode($qupdate, true);
    $tsql = "DELETE FROM Songs WHERE SongID = ".$id;
    $stmt = sqlsrv_query( $conn, $tsql);
    if( $stmt === false)
    {
        echo "Error in executing query.</br>";
        die( print_r( sqlsrv_errors(), true));
    }
}

/* Free statement and connection resources. */
sqlsrv_free_stmt( $stmt);
sqlsrv_close( $conn);
?>