// global variables
var curec = 0; // current record (SongID) on webpage. In other words, the cursor.
var minSongID = 0;
var maxSongID = 0;
var lastCurec = 0;

// functions

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

// jQuery code
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
    $("#btnNext").click(function(){
        $.post("song.php", {"id": ++curec, "qtype": "1"}, function(result){
            var jsonObj = JSON.parse(result);
            $("#txtSongID").val(jsonObj.SongID);
            $("#txtArtist").val(jsonObj.Artist);
            $("#txtTitle").val(jsonObj.Title);
            $("#txtYear").val(jsonObj.Year);
            $("#txtPeak").val(jsonObj.Peak);
        });
    });
    $("#btnPrevious").click(function(){
        $.post("song.php", {"id": --curec, "qtype": "1"}, function(result){
            var jsonObj = JSON.parse(result);
            $("#txtSongID").val(jsonObj.SongID);
            $("#txtArtist").val(jsonObj.Artist);
            $("#txtTitle").val(jsonObj.Title);
            $("#txtYear").val(jsonObj.Year);
            $("#txtPeak").val(jsonObj.Peak);
        });
    });
    $("#btnClear").click(function(){
        $("#txtSongID").val("");
        $("#txtArtist").val("");
        $("#txtTitle").val("");
        $("#txtYear").val("");
        $("#txtPeak").val("");
    });
});