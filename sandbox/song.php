<?php
$id = $_REQUEST["id"]; # songID to query in db
$qtype = $_REQUEST["qtype"]; # Type of query 1 = song row 2 = min/max SongID
$qupdate = $_REQUEST["edit"]; # JSON data to update song
/* Specify the server and connection string attributes. */
$serverName = "(local)\SQLEXPRESS";
$connectionInfo = array( "Database"=>"Music");

// FUNCTIONS
function validateSongID($num)
{
    # if zero rows returned on query return false, else return true.
    global $conn;
    $tsql = "SELECT * FROM vw_ListSongs WHERE SongID = ".$num;
    $stmt = sqlsrv_query($conn, $tsql);
    if( $stmt === false)
    {
        echo "Error in executing query.</br>";
        die( print_r( sqlsrv_errors(), true));
    }
    /* Retreive and display the results of the query. */
    $row = sqlsrv_fetch_array($stmt);
    if (is_null($row))
    {
        return false;
    }
    else
    {
        return true;
    }
}

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
    $row = array_map('utf8_encode',$row); // accent character fix, aka Eres tú fix
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
    $tsql = "DELETE FROM Songs WHERE SongID = ".$id;
    $stmt = sqlsrv_query( $conn, $tsql);
    if( $stmt === false)
    {
        echo "Error in executing query.</br>";
        die( print_r( sqlsrv_errors(), true));
    }
}

if ($qtype == 7 || $qtype == 8)
{
    # build populate table query string
    if ($qtype == 7)
    {
        $tsql = "SELECT * FROM vw_ListSongs ORDER BY SongID";
    }
    # build search results query string
    if ($qtype == 8)
    {
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
    }

    $stmt = sqlsrv_query($conn, $tsql);
    if( $stmt === false)
    {
        echo "Error in executing query.</br>";
        die( print_r( sqlsrv_errors(), true));
    }
    echo "<table>";
    echo "<thead>
    <tr>
        <th>SongID</th>
        <th>Artist</th>
        <th>Title</th>
        <th>Year</th>
        <th>Peak</th>
    </tr>
    </thead>
    <tbody>
    ";
 
    while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC)){
        echo "<tr><td>".$row['SongID']."</td><td>".utf8_encode($row['Artist'])
        ."</td><td>".utf8_encode($row['Title'])."</td><td>".$row['Year']
        ."</td><td>".$row['Peak']."</td></tr>";
    }
    echo "</tbody>";
    echo "</table>";
}

# generate playlist
if ($qtype == 9)
{
    # Fetch max songID to generate random int for invalid songIDs
    $tsql = "Select MIN(SongID) AS minSongID, MAX(SongID) AS maxSongID FROM vw_ListSongs";
    $stmt = sqlsrv_query( $conn, $tsql);
    if( $stmt === false)
    {
        echo "Error in executing query.</br>";
        die( print_r( sqlsrv_errors(), true));
    }
    $row = sqlsrv_fetch_array($stmt);
    $minSongID = $row[0];
    $maxSongID = $row[1];

    # Fetch playlist
    $tsql = "SELECT * FROM vw_ListSongs WHERE SongID = ";
    $jsonarr = json_decode($qupdate, true);
    $songarr = $jsonarr['songid'];
    echo "<table>";
    echo "<thead>
    <tr>
        <th>SongID</th>
        <th>Artist</th>
        <th>Title</th>
        <th>Year</th>
        <th>Peak</th>
    </tr>
    </thead>
    <tbody>
    ";
    for ($i = 0; $i < sizeof($songarr); $i++)
    {
        $tsql = "SELECT * FROM vw_ListSongs WHERE SongID = ".$songarr[$i];
        $stmt = sqlsrv_query($conn, $tsql);
        if( $stmt === false)
        {
            echo "Error in executing query.</br>";
            die( print_r( sqlsrv_errors(), true));
        }
        $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
        #handle null results
        if (is_null($row))
        {
            while (is_null($row))
            {
            /* echo "No song for this SongID: ".$songarr[$i];
            continue; */
            $tsql = "SELECT * FROM vw_ListSongs WHERE SongID = ".rand($minSongID, $maxSongID);
            $stmt = sqlsrv_query($conn, $tsql);
            if( $stmt === false)
            {
                echo "Error in executing query.</br>";
                die( print_r( sqlsrv_errors(), true));
            }
            $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
            }
        }
        echo "<tr><td>".$row['SongID']."</td><td>".utf8_encode($row['Artist'])
        ."</td><td>".utf8_encode($row['Title'])."</td><td>".$row['Year']
        ."</td><td>".$row['Peak']."</td></tr>";
    }
}

/* Free statement and connection resources. */
sqlsrv_free_stmt( $stmt);
sqlsrv_close( $conn);
?>