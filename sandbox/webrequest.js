// global variables
var curec = 0;
var minSongID = 0;
var maxSongID = 0;
var jsonNull = 0;
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
      var params = "id=" + idx + "&qtype=3" + "&edit=";
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
         // Javascript function JSON.parse to parse JSON data
         if (qryType == 1 || qryType == 2)
         var jsonObj = JSON.parse(http_request.responseText);

         // jsonObj variable now contains the data structure and can
         // be accessed as jsonObj.name and jsonObj.country.
         if (qryType == 1)
         {
         document.getElementById("txtSongID").value = jsonObj.SongID;
         document.getElementById("txtArtist").value = jsonObj.Artist;
         document.getElementById("txtTitle").value  = jsonObj.Title;
         document.getElementById("txtYear").value   = jsonObj.Year;
         document.getElementById("txtPeak").value   = jsonObj.Peak;
         }
         else if (qryType == 2)
         {
            minSongID = jsonObj.minSongID;
            maxSongID = jsonObj.maxSongID;
         }
      }
   }

   function reqListener () {
      if (http_request.response == "null")
      {
         if (direction == 1) // next button is 1
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
      }
   }

   // Next/Prev is 1, min/max is 2
   if (qryType == 1 || qryType == 2)
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
      szArtist = encode(document.getElementById("txtArtist").value);
      szTitle  = encode(document.getElementById("txtTitle").value);
      szYear   = document.getElementById("txtYear").value;
      szPeak   = document.getElementById("txtPeak").value;
      http_request.open("POST", data_file, true);
      http_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // req'd for POST with XHR
      params+=JSON.stringify({songid: szSongID, artist: szArtist, title: szTitle, year: szYear, peak: szPeak});
      http_request.send(params);
   }

}

 loadJSON(curec, 2); // set min/max variables
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