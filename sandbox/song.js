/* JavaScript and jQuery sends ajax queries over http to song.php that in turn 
performs SQL queries and stored procs and returns JSON or html to client 
depending on the query type (qtype) that's sent as parameter in HTTP POST*/

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

// Cache the current record (curec) in cookie
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
 }
 function setCurecCookie() {
    document.cookie = "curec=" + curec;
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
    var domRow = document.getElementsByTagName('tr');
    var rowCount = domRow.length;
    for (var i = 1; i < rowCount; i++) {
       if (domRow[i].getElementsByTagName('td')[0].innerHTML.search("^" + searchStr + "$") !== -1) {
          return i;
       }
    }
 }

 var nextSong = function(result){
    var jsonObj = JSON.parse(result);
    // skip missing songIDs (e.g. songs that were deleted)
    // if response is null (empty) re-run query (recursively)
    if (jsonObj == null)
    {
        $.post("song.php", {"id": ++curec, "qtype": "1"}, nextSong);
    }
    else
    {
        $("#txtSongID").val(jsonObj.SongID);
        $("#txtArtist").val(jsonObj.Artist);
        $("#txtTitle").val(jsonObj.Title);
        $("#txtYear").val(jsonObj.Year);
        $("#txtPeak").val(jsonObj.Peak);
        var domRow = document.getElementsByTagName("tr");
        domRow[findGridIndex(curec)-1].removeAttribute("style");
        domRow[findGridIndex(curec)].style.color = "red";
        domRow[findGridIndex(curec)-1].scrollIntoView(true);
    }
 }

 var prevSong = function(result){
    var jsonObj = JSON.parse(result);
    // skip missing songIDs (e.g. songs that were deleted)
    // if response is null (empty) re-run query (recursively)
    if (jsonObj == null)
    {
        $.post("song.php", {"id": --curec, "qtype": "1"}, prevSong);
    }
    else
    {
        $("#txtSongID").val(jsonObj.SongID);
        $("#txtArtist").val(jsonObj.Artist);
        $("#txtTitle").val(jsonObj.Title);
        $("#txtYear").val(jsonObj.Year);
        $("#txtPeak").val(jsonObj.Peak);
        var domRow = document.getElementsByTagName("tr");
        var minGridID = Number(domRow[1].getElementsByTagName("td")[0].innerHTML);
        domRow[findGridIndex(curec)+1].removeAttribute("style");
        domRow[findGridIndex(curec)].style.color = "red";
        if (curec == minGridID)
        {
            domRow[findGridIndex(curec)-1].scrollIntoView(false);
        }
        else
        {
            domRow[findGridIndex(curec)-1].scrollIntoView(true);
        }
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
    }).done(function(){
        var domRow = document.getElementsByTagName("tr");
        domRow[findGridIndex(curec)].style.color = "red";
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
        var domRow = document.getElementsByTagName("tr");
        domRow[findGridIndex(curec)].removeAttribute("style");
        curec = minSongID;
        $.post("song.php", {"id": curec, "qtype": "1"}, function(result){
            var jsonObj = JSON.parse(result);
            $("#txtSongID").val(jsonObj.SongID);
            $("#txtArtist").val(jsonObj.Artist);
            $("#txtTitle").val(jsonObj.Title);
            $("#txtYear").val(jsonObj.Year);
            $("#txtPeak").val(jsonObj.Peak);
        }).done(function(){
            domRow[findGridIndex(curec)].style.color = "red";
            domRow[findGridIndex(curec)].scrollIntoView(false);
        });
    });
    $("#btnLast").click(function(){
        var domRow = document.getElementsByTagName("tr");
        domRow[findGridIndex(curec)].removeAttribute("style");
        curec = maxSongID;
        $.post("song.php", {"id": curec, "qtype": "1"}, function(result){
            var jsonObj = JSON.parse(result);
            $("#txtSongID").val(jsonObj.SongID);
            $("#txtArtist").val(jsonObj.Artist);
            $("#txtTitle").val(jsonObj.Title);
            $("#txtYear").val(jsonObj.Year);
            $("#txtPeak").val(jsonObj.Peak);
        }).done(function(){
            domRow[findGridIndex(curec)].style.color = "red";
            domRow[findGridIndex(curec)-1].scrollIntoView(true);
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
                var domRow = document.getElementsByTagName("tr");
                domRow[findGridIndex(lastCurec)].removeAttribute("style");
                domRow[findGridIndex(curec)].style.color = "red";
                domRow[findGridIndex(curec)-1].scrollIntoView(true);
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
        }).done(function(){
            $.post("song.php", {"id": curec, "qtype": "7"}, function(result){
                $("#tblDataGrid").html(result);
            }).done(function(){
                var domRow = document.getElementsByTagName("tr");
                domRow[findGridIndex(curec)].style.color = "red";
            });
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
                var domRow = document.getElementsByTagName("tr");
                domRow[findGridIndex(curec)].removeAttribute("style");
                /* Handle scenario found in testing, if reponse is blank get
                the max songID and assign to curec */
                if (msg == "")
                {
                    $.post("song.php", {"id": curec, "qtype": "2"}, function(result){
                        var jsonObj = JSON.parse(result);
                        minSongID = jsonObj.minSongID;
                        maxSongID = jsonObj.maxSongID;
                        curec = maxSongID;
                    });
                }
                else
                {
                    maxSongID = msg;
                    curec = maxSongID;
                }
                $("#txtSongID").val(curec);
                var result = $.post("song.php", {"id": curec, "qtype": "7"}, function(result){
                    $("#tblDataGrid").html(result);
                });
                result.done(function(){
                    domRow[findGridIndex(curec)].style.color = "red";
                    domRow[findGridIndex(curec)-1].scrollIntoView(true);
                });
            }
        });
    });
    $("#btnDelete").click(function(){
        $.ajax({
            url: "song.php",
            method: "POST",
            data: "id=" + curec + "&qtype=6"
        }).done(function(){
            var domRow = document.getElementsByTagName("tr");
            domRow[findGridIndex(curec)].removeAttribute("style");
            if (curec == maxSongID)
            {
                $.post("song.php", {"id": --curec, "qtype": "1"}, prevSong);
                $.post("song.php", {"id": curec, "qtype": "2"}, function(result){
                    var jsonObj = JSON.parse(result);
                    minSongID = jsonObj.minSongID;
                    maxSongID = jsonObj.maxSongID;
                    curec = maxSongID;
                });
            }
            else if (curec == minSongID)
            {
                $.post("song.php", {"id": ++curec, "qtype": "1"}, nextSong);
                $.post("song.php", {"id": curec, "qtype": "2"}, function(result){
                    var jsonObj = JSON.parse(result);
                    minSongID = jsonObj.minSongID;
                    maxSongID = jsonObj.maxSongID;
                    curec = minSongID;
                });
            }
            else if (curec != maxSongID)
            {
                $.post("song.php", {"id": ++curec, "qtype": "1"}, nextSong);
            }
            $.post("song.php", {"id": curec, "qtype": "7"}, function(result){
                $("#tblDataGrid").html(result);
            }).done(function(){
                var domRow = document.getElementsByTagName("tr");
                domRow[findGridIndex(curec)].style.color = "red";
                domRow[findGridIndex(curec)-1].scrollIntoView(true);
            });
        });
    });
    // Select record by clicking on grid row
    function getGridSpot(event) {
        var oldcurec = curec;
        // get parentNode = tr (row), then firstElementChild = td (column) SongID
        var ocSongID = event.target.parentNode.firstElementChild.innerHTML;
        curec = ocSongID;
        // Handle scenario where user clicks outside the grid but in the div element
        if (curec >= minSongID || curec <= maxSongID)
        {
            var domRow = document.getElementsByTagName("tr");
            domRow[findGridIndex(oldcurec)].removeAttribute("style");
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
                    var domRow = document.getElementsByTagName("tr");
                    domRow[findGridIndex(curec)].style.color = "red";
                }
            });
            domRow[findGridIndex(curec)].style.color = "red";
        }
        else
        {
            curec = oldcurec;
            domRow[findGridIndex(curec)-1].scrollIntoView(true);
        }
    }
    $("#tblDataGrid").click(getGridSpot); // fire function clicking data grid

    // Search Filter
    $("#txtSearch").on("keyup", function(){
        var value = $(this).val().toLowerCase();
        $("#tblDataGrid tr").filter(function(){
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    })
});