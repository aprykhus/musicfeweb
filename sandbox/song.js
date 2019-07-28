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
   else if (qryType == 7)
      var params = "id=" + idx + "&qtype=7&edit=";
   else if (qryType == 8)
      var params = "id=" + idx + "&qtype=8&edit=";
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
               // document.getElementsByTagName("tr")[findGridIndex(curec)].style.color = "red"; // highlight row
               if (curec == minSongID)
               {
                  document.getElementsByTagName("tr")[findGridIndex(curec)].scrollIntoView(false);
               }
               else
               {
                  document.getElementsByTagName("tr")[findGridIndex(curec)-1].scrollIntoView(true);
               }
            }
         }
         else if (qryType == 2)
         {
            minSongID = jsonObj.minSongID;
            maxSongID = jsonObj.maxSongID;
         }
         else if (qryType == 3)
         {
            populateGrid(); // update grid on update record
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
               populateGrid();
               document.getElementsByTagName("tr")[findGridIndex(curec)].style.color = "red";
            }
         }
         else if (qryType == 7 || qryType == 8)
         {
            document.getElementById("tblDataGrid").innerHTML = http_request.responseText;
         }
      }
   }
   // handle gaps in SongIDs, i.e.: if no 953, jump to 954, etc...
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
            initSong();
         }
      }
      if (direction == 4) // onload in body tag uses firstSong
      {
         // initSong();
         setTimeout(scrollGrid, 100);
         document.getElementsByTagName("tr")[findGridIndex(curec)].style.color = "red";
      }
      if (direction == 5)
      {
         setTimeout(scrollGrid, 1000);
      }
      if (direction == 6)
      {
         populateGrid(); // update grid after song is deleted
         document.getElementsByTagName("tr")[findGridIndex(curec)-1].scrollIntoView(true);
      }
      if (direction == 8)
      {
         document.getElementsByTagName("tr")[findGridIndex(curec)].style.color = "red";
      }
   }

   // Next/Prev is 1, min/max is 2, Delete button is 6, Populate Grid is 7
   if (qryType == 1 || qryType == 2 || qryType == 6 || qryType == 7 || qryType == 8)
   {
      http_request.addEventListener("load", reqListener); // handling null SongIDs
      http_request.open("POST", data_file, true);
      http_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // req'd for POST with XHR
      http_request.send(params);
      /* If record deleted jump to next record except when deleting last ID or
      first ID, in those cases update min/max IDs */
      if (qryType == 6)
      {
         if (curec != maxSongID)
         {
            nextSong();
         }
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
   if (qryType == 4 || qryType == 8)
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
      http_request.addEventListener("load", reqListener); // scroll to new song
      http_request.open("POST", data_file, true);
      http_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // req'd for POST with XHR
      params+=JSON.stringify({artist: szArtist, title: szTitle, year: szYear, peak: szPeak});
      http_request.send(params);
   }
}

/* Search for the SongID in the grid and return the grid index */
function findGridIndex(searchStr) {
   for (var i = 1; i < document.getElementsByTagName('tr').length; i++) {
      if (document.getElementsByTagName('tr')[i].getElementsByTagName('td')[0].innerHTML.search("^" + searchStr + "$") !== -1) {
         return i;
      }
   }
}

loadJSON(curec, 2); // set min/max variables on page load

// Button functions
function nextSong() {
   if (curec < maxSongID)
   {
      // loadJSON(++curec, 1, 1);
      curec = document.getElementsByTagName('tr')[findGridIndex(curec) + 1].getElementsByTagName('td')[0].innerHTML;
      loadJSON(curec, 1, 1);
      document.getElementsByTagName("tr")[findGridIndex(curec)].style.color = "red";
      document.getElementsByTagName("tr")[findGridIndex(curec)-1].removeAttribute("style");
      document.getElementsByTagName("tr")[findGridIndex(curec)-1].scrollIntoView(true);
   }
}
function prevSong() {
   if (curec > minSongID)
   {
      // loadJSON(--curec, 1, 2);
      curec = document.getElementsByTagName('tr')[findGridIndex(curec) - 1].getElementsByTagName('td')[0].innerHTML;
      loadJSON(curec, 1, 2);
      document.getElementsByTagName("tr")[findGridIndex(curec)].style.color = "red";
      document.getElementsByTagName("tr")[findGridIndex(curec)+1].removeAttribute("style");
      if (curec == minSongID)
      {
         document.getElementsByTagName("tr")[findGridIndex(curec)-1].scrollIntoView(false);
      }
      else
      {
         document.getElementsByTagName("tr")[findGridIndex(curec)-1].scrollIntoView(true);
      }
   }
}
function goSong() {
   if (curec > 0)
   {
      document.getElementsByTagName("tr")[findGridIndex(curec)].removeAttribute("style"); // remove highlighting from last row
   }

   lastCurec = curec; // store last record visited to revert if bad SongID
   curec = document.getElementById("txtSongID").value;
   loadJSON(curec, 1, 3);
   document.getElementsByTagName("tr")[findGridIndex(curec)].style.color = "red";
   if (curec == minSongID)
   {
      document.getElementsByTagName("tr")[findGridIndex(curec)].scrollIntoView(false);
   }
   else
   {
      document.getElementsByTagName("tr")[findGridIndex(curec)-1].scrollIntoView(true);
   }
}

function initSong() {
   curec = Number(getCookie("curec")); // get record from last browser session
   if (curec == 0 || curec == null)
   {
      curec = minSongID;
   }
   if (curec == 0 || curec == null || curec == NaN)
   {
      curec = 1;
   }
   loadJSON(curec, 1, 4);
}
function firstSong() {
   document.getElementsByTagName("tr")[findGridIndex(curec)].removeAttribute("style");
   curec = document.getElementsByTagName('tr')[1].getElementsByTagName('td')[0].innerHTML;
   // curec = minSongID;
   loadJSON(curec, 1, 4);
   document.getElementsByTagName("tr")[findGridIndex(curec)].style.color = "red";
   document.getElementsByTagName("tr")[findGridIndex(curec)].scrollIntoView(false);
}
function lastSong() {
   document.getElementsByTagName("tr")[findGridIndex(curec)].removeAttribute("style");
   curec = document.getElementById("tblDataGrid").lastChild.lastChild.lastChild.getElementsByTagName("td")[0].innerHTML;
   // curec = maxSongID;
   loadJSON(curec, 1, 5);
   document.getElementsByTagName("tr")[findGridIndex(curec)].style.color = "red";
   document.getElementsByTagName("tr")[findGridIndex(curec)-1].scrollIntoView(true);
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
   if (document.getElementById("txtArtist").value == "" && document.getElementById("txtTitle").value  == "")
   {
      document.getElementsByClassName("lblValidate")[0].style.display = "inline";
      document.getElementsByClassName("lblValidate")[1].style.display = "inline";
      setTimeout(function() {
         document.getElementsByClassName("lblValidate")[0].style.display = "none";
         document.getElementsByClassName("lblValidate")[1].style.display = "none";
      }, 5000);
   }
   else
   {
      loadJSON(0, 4, 9);
      searchGrid();
   }
}
function addSong() {
   document.getElementsByTagName("tr")[findGridIndex(curec)].removeAttribute("style");
   loadJSON(curec, 5, 5); // add song
}
function deleteSong() {
   loadJSON(curec, 6, 6); // delete song
}
function populateGrid() {
   loadJSON(curec, 7, 7);
}
function scrollGrid() {
   document.getElementsByTagName("tr")[findGridIndex(curec)-1].scrollIntoView(true);
}
function searchGrid() {
   loadJSON(curec, 8, 8);
}
function resetGrid() {
      setTimeout(function() { loadJSON(curec, 1, 4); }, 100);
      populateGrid();
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

// Select record by clicking on grid row
document.getElementById("tblDataGrid").onclick = function () { getGridSpot(event) };

function getGridSpot(event) {
   var oldcurec = curec;
   // get parentNode = tr (row), then firstElementChild = td (column) SongID
   var ocSongID = event.target.parentNode.firstElementChild.innerHTML;
   curec = ocSongID;
   // Handle scenario where user clicks outside the grid but in the div element
   if (curec >= minSongID || curec <= maxSongID)
   {
      document.getElementsByTagName("tr")[findGridIndex(oldcurec)].removeAttribute("style");
      loadJSON(curec, 1, 3);
      document.getElementsByTagName("tr")[findGridIndex(curec)].style.color = "red";
   }
   else
   {
      curec = oldcurec;
      setTimeout(scrollGrid, 100);
   }
}