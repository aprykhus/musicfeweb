/* JavaScript and jQuery sends ajax queries over http to song.php that in turn 
performs SQL queries and stored procs and returns JSON or html to client 
depending on the query type (qtype) that's send as parameter in HTTP POST*/

// global variables
var curec = 0; // current record (SongID) on webpage. In other words, the cursor.
var minSongID = 0;
var maxSongID = 0;
var lastCurec = 0;

/* *****************************************************************************
***************************JAVASCRIPT FUNCTIONS*********************************
 **************************************************************************** */

function encode(strVal)
{
// using a regular expression search for the & and encode it with %26.
    if (strVal.indexOf('&') > -1)
    {
        var searchStr = "&";
        var replaceStr = "%26";
        var re = new RegExp(searchStr, "g");
        var result = strVal.replace(re, replaceStr);
    }else{
        var result = strVal;
    }
    return result;
}

// function to escape single quotes
function chkSnglQut(field) {
   var escquote = "''";
   return field.replace(/'/g, escquote);
}



curec = 1;

/* ****************************************************************************
********  ******     *******  ******  ***         ***       ****  ******  *****
********  ****   ***   *****  ******  ***  **********  ****  ****   **   ******
********  ***  *******  ****  ******  ***      ******  **   *******    ********
**  ****  ****   ***   *****   ****   ***  **********  ***  ********  *********
****    ********    **  *****        ****         ***  ****  *******  *********
 *************************************************************************** */

// jQuery code

/* Function that searches for the SongID in the table and returns the grid 
index. Using jQuery selectors */
function findGridIndex(searchStr) {
    var rowCount = $("#tblDataGrid tr").length;
    for (var i = 1; i < rowCount; i++) {
       if ($("tr").eq(i).find("td").eq(0).text().search("^" + searchStr + "$") !== -1) {
          return i;
       }
    }
 }

 var nextSong = function(result){
    var jsonObj = JSON.parse(result);
    // skip missing songIDs (e.g. songs that were deleted)
    if (jsonObj == null)
    {
        curec++;
        $.post("song.php", {"id": curec, "qtype": "1"}, nextSong);
    }
    else
    {
        $("#txtSongID").val(jsonObj.SongID);
        $("#txtArtist").val(jsonObj.Artist);
        $("#txtTitle").val(jsonObj.Title);
        $("#txtYear").val(jsonObj.Year);
        $("#txtPeak").val(jsonObj.Peak);
    }
 }

 var prevSong = function(result){
    var jsonObj = JSON.parse(result);
    // skip missing songIDs (e.g. songs that were deleted)
    if (jsonObj == null)
    {
        curec--;
        $.post("song.php", {"id": curec, "qtype": "1"}, prevSong);
    }
    else
    {
        $("#txtSongID").val(jsonObj.SongID);
        $("#txtArtist").val(jsonObj.Artist);
        $("#txtTitle").val(jsonObj.Title);
        $("#txtYear").val(jsonObj.Year);
        $("#txtPeak").val(jsonObj.Peak);
    }
 }

$(document).ready(function(){
    $.post("song.php", {"id": curec, "qtype": "2"}, function(result){
        var jsonObj = JSON.parse(result);
        minSongID = jsonObj.minSongID;
        maxSongID = jsonObj.maxSongID;
        curec = minSongID;
    });
    $.post("song.php", {"id": curec, "qtype": "1"}, function(result){
        var jsonObj = JSON.parse(result);
        $("#txtSongID").val(jsonObj.SongID);
        $("#txtArtist").val(jsonObj.Artist);
        $("#txtTitle").val(jsonObj.Title);
        $("#txtYear").val(jsonObj.Year);
        $("#txtPeak").val(jsonObj.Peak);
    });
    $.post("song.php", {"id": curec, "qtype": "7"}, function(result){
        $("#tblDataGrid").html(result);
    });
    $("#btnNext").click(function(){
        if (curec < maxSongID)
        {
            $.post("song.php", {"id": ++curec, "qtype": "1"}, nextSong);
        }
    });
    $("#btnPrevious").click(function(){
        if (curec > minSongID)
        {
            $.post("song.php", {"id": --curec, "qtype": "1"}, prevSong);
        }
    });
    $("#btnFirst").click(function(){
        curec = minSongID;
        $.post("song.php", {"id": curec, "qtype": "1"}, function(result){
            var jsonObj = JSON.parse(result);
            $("#txtSongID").val(jsonObj.SongID);
            $("#txtArtist").val(jsonObj.Artist);
            $("#txtTitle").val(jsonObj.Title);
            $("#txtYear").val(jsonObj.Year);
            $("#txtPeak").val(jsonObj.Peak);
        });
    });
    $("#btnLast").click(function(){
        curec = maxSongID;
        $.post("song.php", {"id": curec, "qtype": "1"}, function(result){
            var jsonObj = JSON.parse(result);
            $("#txtSongID").val(jsonObj.SongID);
            $("#txtArtist").val(jsonObj.Artist);
            $("#txtTitle").val(jsonObj.Title);
            $("#txtYear").val(jsonObj.Year);
            $("#txtPeak").val(jsonObj.Peak);
        });
    });
    $("#btnGo").click(function(){
        lastCurec = curec;
        curec = $("#txtSongID").val();
        if (curec == "" || curec < minSongID || curec > maxSongID)
        {
            alert("Invalid SongID. Try again.");
            curec = lastCurec;
        }
        $.post("song.php", {"id": curec, "qtype": "1"}, function(result){
            var jsonObj = JSON.parse(result);
            if (jsonObj == null) {
                alert("Sorry, that SongID doesn't exist.");
                curec = lastCurec;
                $("#txtSongID").val(curec);
            }
            else
            {
                $("#txtSongID").val(jsonObj.SongID);
                $("#txtArtist").val(jsonObj.Artist);
                $("#txtTitle").val(jsonObj.Title);
                $("#txtYear").val(jsonObj.Year);
                $("#txtPeak").val(jsonObj.Peak);
            }
        });
    });
    $("#btnClear").click(function(){
        $("#txtSongID").val("");
        $("#txtArtist").val("");
        $("#txtTitle").val("");
        $("#txtYear").val("");
        $("#txtPeak").val("");
    });
    $("#btnUpdate").click(function(){
        var szSongID = "", szArtist = "", szTitle = "", szYear = "", szPeak = "";
        szSongID = $("#txtSongID").val();
        szArtist = encode(chkSnglQut($("#txtArtist").val()));
        szTitle = encode(chkSnglQut($("#txtTitle").val()));
        szYear = $("#txtYear").val();
        szPeak = $("#txtPeak").val();
        if (szPeak == "")
        {
           szPeak = "NULL";
        }
        var params = JSON.stringify({songid: szSongID, artist: szArtist, title: szTitle, year: szYear, peak: szPeak});
        $.ajax({
            url: "song.php",
            method: "POST",
            data: "id=" + curec + "&qtype=3&edit=" + params
        });
    });
    $("#btnAddSong").click(function(){
        var szArtist = "", szTitle = "", szYear = "", szPeak = "";
        szArtist = encode(chkSnglQut($("#txtArtist").val()));
        szTitle = encode(chkSnglQut($("#txtTitle").val()));
        szYear = $("#txtYear").val();
        szPeak = $("#txtPeak").val();
        if (szPeak == "")
        {
           szPeak = "NULL";
        }
        var params = JSON.stringify({artist: szArtist, title: szTitle, year: szYear, peak: szPeak});
        var request = $.ajax({
            url: "song.php",
            method: "POST",
            data: "id=" + curec + "&qtype=5&edit=" + params
        });
        request.done(function(msg){
            if (msg == -1)
            {
                alert("Song already exists by this artist.");
            }
            else
            {
                maxSongID = msg;
                curec = maxSongID;
                $("#txtSongID").val(curec);
            }
        });
    });
    $("#btnDelete").click(function(){
        $.ajax({
            url: "song.php",
            method: "POST",
            data: "id=" + curec + "&qtype=6"
        });
    });
});