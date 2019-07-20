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

function chkSnglQut(field) {
   // var squote = "'";
   var escquote = "''";
   return field.replace(/'/g, escquote);
}

function loadJSON(idx, qryType, direction) {
   var szSongID;
   var szArtist;
   var szTitle;
   var szYear;
   var szPeak;
   var data_file = "song.php";
   if (qryType == 1)
      var params = "id=" + idx + "&qtype=1&edit=";
   else if (qryType == 2)
      var params = "id=" + idx + "&qtype=2&edit=";
   else if (qryType == 3)
      var params = "id=" + idx + "&qtype=3&edit=";
   else if (qryType == 4)
      var params = "id=" + idx + "&qtype=4&edit=";
   else if (qryType == 5)
      var params = "id=" + idx + "&qtype=5&edit=";
   else if (qryType == 6)
      var params = "id=" + idx + "&qtype=6&edit=";
   var http_request = new XMLHttpRequest();
   try{
      // Opera 8.0+, Firefox, Chrome, Safari
      http_request = new XMLHttpRequest();
   }catch (e) {
      // Internet Explorer Browsers
      try{
         http_request = new ActiveXObject("Msxml2.XMLHTTP");
      }catch (e) {
         try{
            http_request = new ActiveXObject("Microsoft.XMLHTTP");
         }catch (e) {
            // Something went wrong
            alert("Web Service request failed!");
            return false;
         }
      }
   }

   http_request.onreadystatechange = function() {
      if (http_request.readyState == 4  ) {
         // branch by query type
         if (qryType == 1 || qryType == 2 || qryType == 4)
         {
            // Javascript function JSON.parse to parse JSON data
            var jsonObj = JSON.parse(http_request.responseText);
         }

         if (qryType == 1 || qryType == 4)
         {
            // jsonObj variable now contains the data structure and can
            // be accessed as jsonObj.SongID and jsonObj.Artist, etc...
            document.getElementById("txtSongID").value = jsonObj.SongID;
            document.getElementById("txtArtist").value = jsonObj.Artist;
            document.getElementById("txtTitle").value  = jsonObj.Title;
            document.getElementById("txtYear").value   = jsonObj.Year;
            document.getElementById("txtPeak").value   = jsonObj.Peak;
            if (qryType == 4)
            {
               curec = jsonObj.SongID; // set search result SongID to curec
            }
         }
         else if (qryType == 2)
         {
            minSongID = jsonObj.minSongID;
            maxSongID = jsonObj.maxSongID;
         }
         else if (qryType == 5)
         {
            if (http_request.responseText == -1)
            {
               alert("Song already exists by this artist");
            }
            else
            {
               document.getElementById("txtSongID").value = http_request.responseText; // populate new SongID
               maxSongID = http_request.responseText; // update maxSongID;
               curec = maxSongID; // update current record
            }
         }
      }
   }
   // handle gaps in SongIDs, i.e.: if no 953, jump to 954, etc...
   function reqListener () {
      if (http_request.response == "null")
      {
         if (direction == 1 || (direction == 6 && curec != maxSongID && curec != minSongID)) // next button is 1, Delete button is 6
         {
            nextSong();
         }
         if (direction == 2) // prev button is 2
         {
            prevSong();
         }
         if (direction == 3) // go button is 3
         {
            alert("No song found");
            curec = lastCurec;
            document.getElementById("txtSongID").value = curec;
         }
         if (direction == 4) // onload in body tag uses firstSong
         {
            firstSong();
         }
         if (direction == 6) // Delete button
         {
            if (curec == maxSongID)
            {
               prevSong();
               loadJSON(curec, 2); // update maxSongID
            }
            if (curec == minSongID)
            {
               nextSong();
               loadJSON(curec, 2); // update minSongID
            }
         }
      }
   }

   // Next/Prev is 1, min/max is 2, Delete button is 6
   if (qryType == 1 || qryType == 2 || qryType == 6)
   {
      http_request.addEventListener("load", reqListener); // handling null SongIDs
      http_request.open("POST", data_file, true);
      http_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // req'd for POST with XHR
      http_request.send(params);
   }
   // Update button is 3
   if (qryType == 3)
   {
      szSongID = document.getElementById("txtSongID").value;
      szArtist = encode(chkSnglQut(document.getElementById("txtArtist").value)); // encode ampersand and escape single quotes for SQL
      szTitle  = encode(chkSnglQut(document.getElementById("txtTitle").value)); // encode ampersand and escape single quotes for SQL
      szYear   = document.getElementById("txtYear").value;
      szPeak   = document.getElementById("txtPeak").value;
      if (szPeak == "")
      {
         szPeak = "NULL";
      }
      http_request.open("POST", data_file, true);
      http_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // req'd for POST with XHR
      params+=JSON.stringify({songid: szSongID, artist: szArtist, title: szTitle, year: szYear, peak: szPeak});
      http_request.send(params);
   }
   // Search button
   if (qryType == 4)
   {
      szArtist = encode(chkSnglQut(document.getElementById("txtArtist").value)); // encode ampersand and escape single quotes for SQL
      szTitle  = encode(chkSnglQut(document.getElementById("txtTitle").value)); // encode ampersand and escape single quotes for SQL
      http_request.open("POST", data_file, true);
      http_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // req'd for POST with XHR
      params+=JSON.stringify({artist: szArtist, title: szTitle});
      http_request.send(params);
   }
   // Add button
   if (qryType == 5)
   {
      szArtist = encode(chkSnglQut(document.getElementById("txtArtist").value)); // encode ampersand and escape single quotes for SQL
      szTitle  = encode(chkSnglQut(document.getElementById("txtTitle").value)); // encode ampersand and escape single quotes for SQL
      szYear   = document.getElementById("txtYear").value;
      szPeak   = document.getElementById("txtPeak").value;
      if (szPeak == "")
      {
         szPeak = "NULL";
      }
      http_request.open("POST", data_file, true);
      http_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // req'd for POST with XHR
      params+=JSON.stringify({artist: szArtist, title: szTitle, year: szYear, peak: szPeak});
      http_request.send(params);
   }
}

loadJSON(curec, 2); // set min/max variables on page load
 // Button functions
function nextSong() {
   if (curec < maxSongID)
   {
      loadJSON(++curec, 1, 1);
   }
}
function prevSong() {
   if (curec > minSongID)
   {
      loadJSON(--curec, 1, 2);
   }
}
function goSong() {
   lastCurec = curec;
   curec = document.getElementById("txtSongID").value;
   loadJSON(curec, 1, 3);
}
function firstSong() {
   curec = minSongID;
   loadJSON(curec, 1, 4);
}
function lastSong() {
   curec = maxSongID;
   loadJSON(curec, 1, 5);
}
function updateSong() {
   loadJSON(curec, 3, 0);
}
function clearSong() {
   document.getElementById("txtSongID").value = "";
   document.getElementById("txtArtist").value = "";
   document.getElementById("txtTitle").value  = "";
   document.getElementById("txtYear").value   = "";
   document.getElementById("txtPeak").value   = "";
}
function searchSong() {
   loadJSON(0, 4, 0);
}
function addSong() {
   loadJSON(curec, 5, 5); // add song
}

function deleteSong() {
   loadJSON(curec, 6, 6); // delete song
}