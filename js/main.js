//To do fetch episode information for Tag 1 and above - this will show the show image at the start of the tag.

// http://127.0.0.1:5500/web_tests/AdoriPlayer1/index.html?adoriid=1017
//http://127.0.0.1:5500/WebPlayerBlocks/index.html?adoriid=589
/*jshint esversion: 6 */
/* eslint no-eval: 0 */
/*jshint multistr: true */

/*
parameters supported: adoriid, mute, background, hidecarouselcontrols hideaddtohomescreen minimal playatstart showlogo removeSelectButton hideprogressbar kenburns 
removesharebutton nodragcaption dev beta
https://adori.ai?adoriid=1017 or
https://adori.ai?id=1017 or 
https://adori.ai?uid=IwQxNMQSPt0Obeco
https://adori.ai?adoriid=1017&mute=true&background=white
https://adori.ai?adoriid=1017&mute=true&background=white&hidecarouselcontrols=true&hideaddtohomescreen=false
https://adori.ai?adoriid=1017&mute=true&background=rgba(0,0,0,0.5)
Support fpr dev/beta
adoriids for testing dev : 991, 1315, 1114, 1342
adoriids for testing  beta : 1154, 1218
https://adori.ai?id=991&dev
https://adori.ai?id=1154&beta
*/

var audioPlayer;
var timeLine = document.querySelector("#timeline");
var prevTime = 0;
var W;
var WIDTH;
var HEIGHT;
var ORIENTATION;
var loadIntervalId;
var jQueryDocument = $(document);

var timeCurrent = $(".audioplayer-time-current");
var timeDuration = $(".audioplayer-time-duration");
var theBar = $(".audioplayer-bar");
var barPlayed = $(".audioplayer-bar-played");
var barLoaded = $(".audioplayer-bar-loaded");
var table;
var isTouch = false; // used in adjustcurrentTime fuction
var playatstart = false;
var hidecarouselcontrols = false;
var showlogo = false;
var readytoplay = false;
var share_open = false;
var mobile_device = false;
var current_index = 0;
var nodragcaption = false;
var multitagsfetched = 0;
const RemoteDecodeURL =
  "https://64m5nj20u1.execute-api.us-east-1.amazonaws.com/api/";

var dataSet = [
  ["Stephanie Poetri", "1216"],
  ["AD/DC - Highway to Hell 40th Aniversary Trailer", "1237"],
  ["AD/DC - Highway to Hell 40th Aniversary ", "1259"],
  ["Bully - From Criminal interactive Version", "1209"],
  ["I am not a Robot - From Planet Money", "1213"],
  ["The International Pizza Consultant", "1214"],
  ["COLD Podcast - Prelude Susan Powell Disappearance", "1172"],
  ["Cadence13 - Introducing Broken Records:Season 2", "1154"],
  ["Cadence13 - Origins: Sex and the City", "1151"],
  ["Sports Byline USA with Ron Barr ", "1149"],
  ["Maureen Langan with Kaushik Shivakumar", "1148"],
  [
    "Inspire Cafe-Ep 69 With Bill Monroe: Life After a Stroke and Why He Feels Lucky",
    "1138",
  ],
  ["Adoriginal FoodPlating with Christine Johanson", "1135"],
  ["Adoriginal Consumer Research Podcast", "1134"],
  ["Adoriginal Photography Podcast", "1133"],
  ["Wine Podcast", "1116"],
  ["Photography", "1117"],
  ["Technology", "1119"],
  ["Travel", "1120"],
  ["Fashion ", "1126"],
  ["Wrongfull Conviction ", "643"],
  ["Sorry-Justin Bieber", "589"],
  ["L Train Podcast", "563"],
  ["Metal Wrekage", "562"],
  ["Columbia Records", "515"],
  ["Masters Of Scale-Merrisa Mayer", "991"],
  ["Masters Of Scale-Big Pivot", "1017"],
  ["The Grill Team Catch Up 1", "293"],
  ["The Grill Team Catch Up 2", "301"],
  ["The Grill Team Catch Up 3", "303"],
  ["The Grill Team Catch Up 4", "304"],
  ["The Grill Team Catch Up 5", "305"],
  ["The Grill Team Catch Up 6", "306"],
  ["The Grill Team Catch Up 7", "307"],
  ["The Grill Team Catch Up 8", "308"],
  ["The Grill Team Catch Up 9", "309"],
  ["The Grill Team Catch Up 10", "310"],
  ["The Grill Team Catch Up 11", "317"],
  ["The Grill Team Catch Up 12", "319"],
  ["The Grill Team Catch Up 13", "320"],
  ["The Grill Team Catch Up 14", "321"],
  ["The Grill Team Catch Up 15", "328"],
  ["The Grill Team Catch Up 16", "332"],
  ["The Grill Team Catch Up 17", "333"],
  ["The Grill Team Catch Up 18", "335"],
  ["The Grill Team Catch Up 19", "337"],
];

window.helloworld = function () {
  console.log(" hello world");
};

function openAdori() {
  console.log(" open adori webpage");
}

//Script for mobile devices, it automatically shows an overlaying message encouraging to add the web app to the homescreen.
// Compatible with iOS 6+ and Chrome for Android (soon WinPhone).
//addToHomescreen(); // moved it to ready so that iframe can turn it off

theBar
  .on("mousedown", function (e) {
    adjustCurrentTime(e);
    theBar.on("mousemove", function (e) {
      adjustCurrentTime(e);
    });
  })
  .on("mouseup", function () {
    theBar.unbind("mousemove");
  });

function setuptouch() {
  theBar
    .on("touchstart", function (e) {
      adjustCurrentTime(e);
      theBar.on("touchmove", function (e) {
        adjustCurrentTime(e);
      });
    })
    .on("touchcancel", function () {
      theBar.unbind("touchmove");
    });
}
// add touchstart/mousedown event , e returns touch postiion.
// this is the default but when first touch is discovered then unbind mousedown and enable touchstart
window.addEventListener(
  "touchstart",
  function onFirstTouch() {
    //alert("Hello! I was touched");
    // or set some global variable
    isTouch = true;
    console.log("This was the first touch event");
    // Does not work ??
    //https://www.creativebloq.com/html5/12-html5-tricks-mobile-81412803
    // console.log("Requesting full screen UI");
    // var body = document.documentElement;
    // if (body.requestFullscreen) {
    //   body.requestFullscreen();
    // } else if (body.webkitrequestFullscreen) {
    //   body.webkitrequestFullscreen();
    // } else if (body.mozrequestFullscreen) {
    //   body.mozrequestFullscreen();
    // } else if (body.msrequestFullscreen) {
    //   body.msrequestFullscreen();
    // }

    theBar.unbind("mousedown");
    setuptouch(); // add touch support for the bar.

    // we only need to know once that a human touched the screen, so we can stop listening now
    window.removeEventListener("touchstart", onFirstTouch, false);
  },
  false
);

function getUrlVars() {
  var vars = {};
  var lowercaseurl = window.location.href.toLowerCase();
  var parts = lowercaseurl.replace(
    /[?&]+([^=&]+)=([^&]*)/gi,
    function (m, key, value) {
      vars[key] = value;
    }
  );
  return vars;
}
// if the URL parameter is undefined then it adds a defualt value
// usage var mytext = getUrlParam('text','Empty');
function getUrlVars1() {
  var vars = {};
  var lowercaseurl = window.location.href;
  var parts = lowercaseurl.replace(
    /[?&]+([^=&]+)=([^&]*)/gi,
    function (m, key, value) {
      vars[key] = value;
    }
  );
  return vars;
}

function getUrlParam1(parameter, defaultvalue) {
  var urlparameter = defaultvalue;
  var url1 = window.location.href;
  if (url1.indexOf(parameter) > -1) {
    urlparameter = getUrlVars1()[parameter];
  }
  return urlparameter;
}

function getUrlParam(parameter, defaultvalue) {
  var urlparameter = defaultvalue;
  var lowercaseurl = window.location.href.toLowerCase();
  if (lowercaseurl.indexOf(parameter) > -1) {
    urlparameter = getUrlVars()[parameter];
  }
  return urlparameter;
}

function isUrlParam(parameter) {
  var ret = false;
  var lowercaseurl = window.location.href.toLowerCase();
  if (lowercaseurl.indexOf(parameter) > -1) {
    ret = true;
  }
  return ret;
}
// var TAGOBJECT = {
//   nooftags: 0,
//   tagOffsets: [],
//   tagImages: [],
//   tagThumbImages:[],
//   tagImagesWidth: [],
//   tagImagesHeight: [],
//   tagUrls: [],
//   canIframe:[],
//   tagCaptions: [],
//   tagActions: [],
//   tagSharable: [],
//   tagDisplayTimeOffset: [],
//   tagContact:[],
//   tagChoices:[],
//   tagNotetext: [],
//   tagLocation:[],
//   tagTopMarginPercentage:[],
//   tagImageOpacity:[],
//   tagFontStyle:[],
//   tagStyle:[]
// }

//589 1017
var adoriPlayer = {
  adoriID: 1116,
  uid: "IU6cRTTxsJxKmKgC",
  collection_uid: null,
  audioStartTime: 0,
  audioDuration: 0,
  audioName: "",
  audioImageId: "",
  audioDescription: "",
  audioURL: "",
  nooftags: 0,
  tagOffsets: [],
  tagImages: [],
  tagThumbImages: [],
  tagImagesWidth: [],
  tagImagesHeight: [],
  tagUrls: [],
  canIframe: [],
  tagCaptions: [],
  tagActions: [],
  tagDisplayAd: [],
  adSource: [],
  tagSharable: [],
  tagDisplayTimeOffset: [],
  tagContact: [],
  tagChoices: [],
  tagNotetext: [],
  tagLocation: [],
  tagTopMarginPercentage: [],
  tagImageOpacity: [],
  tagFontStyle: [],
  tagStyle: [],
  arrayofTagObjects: [],
  defaultVolume: 10,
  defaultSong: "example.mp3",
  defaultTitle: "AdoriPlayer",
  defaultImage: "cover.png",
  defaultLink: "https://www.google.com",
  serverurl: "https://prod.adorilabs.com/service/v5.1",
  fetchDone: "false",
  userActive: false,
  transcriptStatus: "FINISHED",
  transcriptId: "",
  multiAdoriID: false,
  multiTimeArray: [],
  multiAdoriIDArray: [],
  multiAudioURL: 0,
  multiAudioDuration: 0,
  fetchTags: function () {
    fetchTags(this);
  },
  fetchMultiTags: function () {
    fetchMultiTags(this);
  },
  buildCarousal: function () {
    buildCarousal(this);
  },
  updateIframe: function () {
    updateIframe(this);
  },
  initPlayer: function () {
    initPlayer(this);
  },
  play: function () {
    play(this);
  },
  pause: function () {
    pause(this);
  },
  stop: function () {
    stop(this);
  },
  rewind: function () {
    rewind(this);
  },
  forward: function () {
    forward(this);
  },

  update_userActiveState: function (val) {
    this.userActive = val;
    console.log("this.ActiveState = " + this.userActive);
  },
};

var inactivityTimeout;
var userActivity, activityCheck;

$("#container").on("mousemove", function () {
  userActivity = true;
});

activityCheck = setInterval(function () {
  // console.log("setinterval");
  // Check to see if the mouse has been moved
  if (readytoplay == false) return; // wait till we are ready to play, this helps during low data rates
  if (userActivity) {
    // Reset the activity tracker
    userActivity = false;

    // If the user state was inactive, set the state to active
    if (adoriPlayer.userActive == false) {
      adoriPlayer.userActive = true;
      // enable mouse click events for the controls
      $("#buttons").css("pointer-events", "auto");
      $("#tracker").css("pointer-events", "auto");
      $("#audio-player").removeClass("player-fade-out");
      // console.log("removeFade_out");
    }

    // Clear any existing inactivity timeout to start the timer over
    clearTimeout(inactivityTimeout);

    // In X seconds, if no more activity has occurred
    // the user will be considered inactive
    inactivityTimeout = setTimeout(function () {
      // Protect against the case where the inactivity timeout can trigger
      // before the next user activity is picked up  by the
      // activityCheck loop.
      if (!userActivity) {
        adoriPlayer.userActive = false;
        // disable mouse click events for the controls
        $("#buttons").css("pointer-events", "none");
        $("#tracker").css("pointer-events", "none");
        $("#audio-player").addClass("player-fade-out");
        //console.log("addFade_out");
      }
    }, 3000);
  }
}, 300);

function adjust_container_size() {
  W.getViewportWidth(true);
  W.getViewportHeight(true);
  WIDTH = W.getViewportWidth();
  //console.log("Current viewport Width = " + WIDTH);
  if (WIDTH > 413) WIDTH = 414;
  HEIGHT = W.getViewportHeight();
  var original_height = HEIGHT;
  //console.log("Current viewport Height = " + original_height);
  if (HEIGHT > 735) HEIGHT = 736;
  console.log("Adjusted viewport Width = " + WIDTH);
  console.log("Adjusted viewport Height = " + HEIGHT);
  document.documentElement.style.setProperty("--width", WIDTH + "px");
  document.documentElement.style.setProperty("--height", HEIGHT + "px");
  // var n = (original_height - HEIGHT) / 2;
  // $("#container").css("margin", n + "px auto");
}

var share = new ShareButton({
  //   networks: {
  //   facebook: {
  //     image: "http://carrot.is/img/fb-share.jpg",
  //     loadSdk: true
  //   }
  // }
}); // Grabs all share-button elements on page;

// config = {
//   networks: {
//       facebook: {
//           appId: '12345'
//       }
//   }
// };

// var share = new ShareButton(document.getElementsByClassName('share-button'), config);
Array.prototype.remove = function () {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

//this sync function decoded URL and determines its a multi adoriid URL or a single AdoriID Der,
async function decodeURL(decodeinfo) {
  let json = "null";
  try {
    let response = await fetch(decodeinfo);
    json = await response.json();
    console.log(json);
    console.log(json.time_offsets_ms + " " + json.AdoriIds);
    json.AdoriIds.remove(0); // remove all zeros
    // find if we have one adoriid or multiple adoriids
    var allEqual = json.AdoriIds.every((val, i, arr) => val === arr[0]);
    adoriPlayer.multiAdoriID = !allEqual;
    console.log("MultiAdoriId = " + adoriPlayer.multiAdoriID);
    if (adoriPlayer.multiAdoriID == false)
      adoriPlayer.adoriID = json.AdoriIds[0];
  } catch (e) {
    console.log("Error!", e);
  }
  //alert(JSON.stringify(json));
}

// function getJson1(decodeinfo) {
//     $.ajaxSetup({
//       async: false
//   });
//   var jsonData= (function() {
//       var result;
//       $.getJSON(decodeinfo, {}, function(data){
//         result = data;
//       });
//       return result;
//   })();
//   //alert(JSON.stringify(jsonData));
//   $.ajaxSetup({
//     async: true
//   });
// }

$(document).ready(function () {
  console.clear();
  console.log("ready!");
  adoriPlayer.update_userActiveState("false");
  adjust_container_size();

  //adoriPlayer.adoriID = getUrlParam("adoriid", adoriPlayer.adoriID); // if adoriID is not found on the URL then it will use the adoriPlayer default one
  audioPlayer = new Audio();
  audioPlayer.addEventListener("ended", endPlay, false);
  audioPlayer.addEventListener("timeupdate", timeUpdate, false);
  audioPlayer.addEventListener("loadeddata", loadedData, false);
  audioPlayer.addEventListener("canplay", onCanPlay, false);

  if (isUrlParam("beta"))
    adoriPlayer.serverurl = "https://beta.adorilabs.com/service/v5.1";
  if (isUrlParam("dev"))
    adoriPlayer.serverurl = "https://dev.adorilabs.com/service/v5.1";

  var episodeinfo;
  if (isUrlParam("url")) {
    //var adoriid = adoriPlayer.adoriID ;
    var url = getUrlParam("url", adoriid);
    decodeinfo = RemoteDecodeURL + "decode?URL=" + decodeURI(url);
    console.log("Decodeinfo = " + decodeinfo);

    //decodeURL(decodeinfo);
    //let json = "null"
    $.ajaxSetup({ async: false });
    try {
      $.ajax({
        url: decodeinfo,
        success: function (json) {
          console.log(json);
          console.log(json.time_offsets_ms + " " + json.AdoriIds);
          json.AdoriIds.remove(0); // remove all zeros
          // find if we have one adoriid or multiple adoriids
          var allEqual = json.AdoriIds.every((val, i, arr) => val === arr[0]);
          adoriPlayer.multiAdoriID = !allEqual;
          console.log("MultiAdoriId = " + adoriPlayer.multiAdoriID);
          if (adoriPlayer.multiAdoriID == false) {
            adoriPlayer.adoriID = json.AdoriIds[0];
            var adoriid = adoriPlayer.adoriID;
            console.log("ADORID FOUND = " + adoriid);
            episodeinfo = adoriPlayer.serverurl + "/episodes/" + adoriid;
          } else {
            // multiAdoriIds
            adoriPlayer.adoriID = json.AdoriIds[0];
            // filter out the starting adoriids ( remove duplicates) and it's correspoinding times
            //json.AdoriIds.forEach(function (item, index) {console.log(index, item);});
            const time_offsets = [];
            const adoriIDS = [];
            time_offsets.push(json.time_offsets_ms[0]);
            adoriIDS.push(json.AdoriIds[0]);
            for (let i = 1; i < json.AdoriIds.length; i++) {
              if (json.AdoriIds[i] != json.AdoriIds[i - 1]) {
                adoriIDS.push(json.AdoriIds[i]);
                time_offsets.push(json.time_offsets_ms[i]);
                //console.log("i =" , i);
              }
            }
            console.log(json);
            adoriPlayer.multiAudioDuration = json.duration_msecs;
            adoriPlayer.audioStartTime = 0;
            adoriPlayer.multiTimeArray = time_offsets;
            adoriPlayer.multiAdoriIDArray = adoriIDS;
            adoriPlayer.multiAudioURL = decodeURI(url);
            console.log(
              "adoriPlayer.multiAudioURL set to = " + adoriPlayer.multiAudioURL
            );
            //audioPlayer.multiAudioURL
            console.log("MULTIPLE ADORIIDs FOUND");
            var adoriid = adoriPlayer.multiAdoriIDArray[0];
            console.log(
              "PARAMETER FIRST ADORID  OF THE MULTIADORIIDs = " + adoriid
            );
            episodeinfo = adoriPlayer.serverurl + "/episodes/" + adoriid;
          }
        },
      });
    } catch (e) {
      console.log("Error!", e);
    }
    $.ajaxSetup({ async: true });
  } else if (isUrlParam("adoriid")) {
    var adoriid = adoriPlayer.adoriID;
    adoriid = getUrlParam("adoriid", adoriid);
    console.log("PARAMETER ADORID FOUND = " + adoriid);
    //var episodeinfo = "https://prod.adorilabs.com/service/v5/episodes/" + adoriid;
    var episodeinfo = adoriPlayer.serverurl + "/episodes/" + adoriid;
  } else if (isUrlParam("uid")) {
    var uid = adoriPlayer.uid;
    uid = getUrlParam1("uid", uid); // needs to be case sensitive hence getUrlParam1
    console.log("PARAMETER UID FOUND= " + uid);
    var episodeinfo = adoriPlayer.serverurl + "/episodes/" + uid;
  } else if (isUrlParam("id")) {
    var uid = adoriPlayer.uid;
    uid = getUrlParam1("id", uid); // needs to be case sensitive hence getUrlParam1
    console.log("PARAMETER UID FOUND= " + uid);
    var episodeinfo = adoriPlayer.serverurl + "/episodes/" + uid;
  } else {
    var adoriid = adoriPlayer.adoriID;
    console.log("PARAMETER DEFAULT ADORID  = " + adoriid);
    //var episodeinfo = "https://prod.adorilabs.com/service/v5/episodes/" + adoriid;
    var episodeinfo = adoriPlayer.serverurl + "/episodes/" + adoriid;
  }

  fetchAll(episodeinfo);

  var volumeTestDefault = audioPlayer.volume,
    volumeTestValue = (audioPlayer.volume = 0.111);
  if (Math.round(audioPlayer.volume * 1000) / 1000 == volumeTestValue)
    audioPlayer.volume = volumeTestDefault;
  else $("#vol").css("display", "none");
  // check if mute is sent in the parameter
  if (getUrlParam("mute", "false") == "true") audioPlayer.muted = true;
  else audioPlayer.muted = false;
  var backgroundColor;
  backgroundColor = getUrlParam("background", "black");
  if (backgroundColor != "black") {
    $("body").css("background", backgroundColor);
    $("#container").css("background", backgroundColor);
    //  $("#myCarousel").css("border-color", backgroundColor);
  }
  // var hidecarouselcontrols ; // made it global
  hidecarouselcontrols = getUrlParam("hidecarouselcontrols", "false");
  if (hidecarouselcontrols == "true") {
    $("#myCarousel").children(".carousel .carousel-control").hide();
    // $('#right-carousel').hide();$('#left-carousel').hide();
  }

  var hideaddtohomescreen;
  hideaddtohomescreen = getUrlParam("hideaddtohomescreen", "true");
  if (hideaddtohomescreen == "false") {
    addToHomescreen();
    console.log("enabled AddtoHomeScreen");
  }

  var removeselectbutton;
  removeselectbutton = getUrlParam("removeselectbutton", "true");
  if (removeselectbutton == "true") {
    $("#settings").hide();
    console.log("removeselectbutton hidden");
  }

  var removesharebutton;
  removesharebutton = getUrlParam("removesharebutton", "true");
  if (removesharebutton == "true") {
    $("#tag").hide();
    console.log("removesharebutton hidden");
  }

  var minimal;
  minimal = getUrlParam("minimal", "false");
  if (minimal == "true") {
    $("#tracker").hide();
    $("#settings").hide();
    $("#tag").hide();
    $("#prev").hide();
    $("#next").hide();
    $("#play").addClass("btn_large");
    $("#pause").addClass("btn_large");
  }

  var hideprogressbar;
  hideprogressbar = getUrlParam("hideprogressbar", "false");
  if (hideprogressbar == "true") {
    $("#tracker").hide();
  }

  var nodragcaption_local = getUrlParam("nodragcaption", "false");
  if (nodragcaption_local == "true") nodragcaption = true;
  else nodragcaption = false;
  console.log("nodragcaption = " + nodragcaption);

  //var playatstart ; made global
  var playatstart_local = getUrlParam("playatstart", "false");
  if (playatstart_local == "true") playatstart = true;
  else playatstart = false;

  var showlogo_local = getUrlParam("showlogo", "false");
  if (showlogo_local == "true") showlogo = true;
  else showlogo = false;
  if (showlogo == true) $(".logo").show();
  else $(".logo").hide();

  var kenburns = getUrlParam("kenburns", "false");
  if (kenburns == "true") $("#myCarousel").addClass("ken-burns");
  else $("#myCarousel").removeClass("ken-burns");

  timeDuration.html("&hellip;");
  timeCurrent.text(secondsToTime(0));

  if ("ontouchstart" in window) {
    console.log(" CAN RUN TOUCH");
  }

  table = $("#featured_table").DataTable({
    data: dataSet,
    columns: [{ title: "Name" }, { title: "AdoriId" }],
    iDisplayLength: 10,
    aLengthMenu: [
      [10, 20, -1],
      [10, 20, "All"],
    ],
    bLengthChange: false, //hide 'show entries dropdown
    responsive: true,
    sort: false,
    scrollY: "300px",
    scrollCollapse: true,
    paging: false,
  });

  //table = $('#featured_table').DataTable();
  // copy the clicked adoriid on to the input text box above the table
  table.on("click", "tr", function () {
    var data_row = table.row($(this).closest("tr")).data();
    $("#inputsm").val(data_row[1]);
    form_submit(); // submit the form no need to make user wait to hit fetch
  });

  mobile_device = isMobile();
  showPlayerControls();
  // url = "https://www.jwine.com";
  // $.getJSON(url, function(data) { alert(data); });
  // $.getJSON('http://www.whateverorigin.org/get?url=' + encodeURIComponent('http://google.com') + '&callback=?', function(data){
  //   alert(data.contents);
  //   $('#container').html(data);
  // });
}); // end ready function

function onCanPlay() {
  console.log("ON CAN PLAY");
  readytoplay = true;
  if (playatstart) {
    adoriPlayer.play();
    console.log("playstart detected");
    fireEvent(document.getElementById("play"), "click");
  }
  playatstart = false; // use only once
}

function initPlayer(context) {
  // alredy loaded in fetch all
  audioPlayer.preload = "auto";
  $("#audio-player .title").text(context.defaultTitle);
  barPlayed.width(0);
  barLoaded.width(0);
  audioPlayer.volume = parseFloat(context.defaultVolume / 10);
  $("#volume").val(context.defaultVolume);
  loadIntervalId = setInterval(updateLoadBar, 100);
}

$(window).resize(function () {
  adjust_container_size();
});

function test(context) {
  console.log(context.adoriID);
}

// choose audio modal form
function form_submit() {
  var adoriid = $("#inputsm").val();
  if (adoriid == parseInt(adoriid, 10)) {
    console.log("ADoriID = " + adoriid);
    adoriPlayer.adoriID = adoriid;
    $("#inputsm").val(""); // clear text to return back to placeholder
    stop(adoriPlayer);
    initPlayer(adoriPlayer);
    timeDuration.html("&hellip;");
    timeCurrent.text(secondsToTime(0));
    playatstart = true;
    var episodeinfo = adoriPlayer.serverurl + "/episodes/" + adoriid;
    fetchAll(episodeinfo); // this function also builds the carousal
    showPlayerControls();
    table // clear search box
      .search("")
      .columns()
      .search("")
      .draw();
    $("#classModal").modal("hide");
  }
}

function showPlayerControls() {
  $("#buttons").css("pointer-events", "auto");
  $("#tracker").css("pointer-events", "auto");
  $("#audio-player").removeClass("player-fade-out");
}

function fetchAll(episodeinfo) {
  var promise = $.getJSON(episodeinfo);
  //console.log("episodeinfo URL = " + episodeinfo );
  var ret = 0;

  promise.done(function (episodeinfo) {
    console.log("episodeinfo = " + JSON.stringify(episodeinfo));
    //we are moving away from adoriid to uid, do if adoriid is not found then use uid instead
    if (isNaN(episodeinfo.id) || episodeinfo.id == null)
      adoriPlayer.adoriID = episodeinfo.uid;
    else adoriPlayer.adoriID = episodeinfo.id;
    adoriPlayer.uid = episodeinfo.uid;
    if (adoriPlayer.multiAdoriID == false) {
      adoriPlayer.audioDuration = episodeinfo.durationMillis;
      audioPlayer.src = episodeinfo.audioUrl;
      adoriPlayer.audioURL = episodeinfo.audioUrl;
    } // multipart
    else {
      adoriPlayer.audioDuration = adoriPlayer.multiAudioDuration;
      console.log("multiAudioURL: " + adoriPlayer.multiAudioURL);
      audioPlayer.src = adoriPlayer.multiAudioURL;
      adoriPlayer.audioURL = adoriPlayer.multiAudioURL;
    }
    adoriPlayer.audioName = episodeinfo.name;
    adoriPlayer.audioImageId = episodeinfo.imageId;
    adoriPlayer.audioDescription = episodeinfo.description;
    adoriPlayer.transcriptId = episodeinfo.transcriptId;

    adoriPlayer.tagSharable[0] = true;
    adoriPlayer.tagCaptions[0] = adoriPlayer.audioName;
    adoriPlayer.tagDisplayTimeOffset[0] = adoriPlayer.audioDuration; // not sure about this now, check again
    //adoriPlayer.tagImages[0] =adoriPlayer.serverurl + "/images/" + adoriPlayer.audioImageId;
    adoriPlayer.tagImages[0] = episodeinfo.imageUrl;
    adoriPlayer.tagActions[0] = "click";
    adoriPlayer.tagUrls[0] = null;
    adoriPlayer.tagThumbImages[0] = episodeinfo.thumbnail;
    adoriPlayer.tagTopMarginPercentage[0] = 1;
    adoriPlayer.tagImageOpacity[0] = 1;
    adoriPlayer.tagFontStyle[0] = 1;
    adoriPlayer.tagContact[0] = null;
    adoriPlayer.tagNotetext[0] = null;
    adoriPlayer.tagChoices[0] = null;
    adoriPlayer.tagLocation[0] = null;
    adoriPlayer.tagStyle[0] = {
      fontStyle: 1,
      imageOpacity: 0,
      topMarginPercentage: 0.75,
    };
    console.log("AdoriID = " + adoriPlayer.adoriID);
    console.log("uid = " + adoriPlayer.uid);
    $("#adoriid").text(adoriPlayer.adoriID); // write it in the featured playlist dialog
    $("#uid").text(adoriPlayer.uid); // write it in the featured playlist dialog
    if (isUrlParam("uid")) {
      var href = new URL(window.location.href);
      href.searchParams.set("uid", adoriPlayer.adoriID);
      str_temp = href.toString();
      console.log("uid =" + str_temp);
      res = str_temp.replace("uid", "id");
      history.replaceState(null, null, res);
    } else if (isUrlParam("adoriid")) {
      var href = new URL(window.location.href);
      href.searchParams.set("adoriid", adoriPlayer.adoriID);
      str_temp = href.toString();
      console.log("adoriid =" + str_temp);
      res = str_temp.replace("adoriid", "id");
      history.replaceState(null, null, res);
    } else if (isUrlParam("id")) {
      var href = new URL(window.location.href);
      href.searchParams.set("id", adoriPlayer.adoriID);
      console.log("id =" + href.toString());
      history.replaceState(null, null, href.toString());
    }

    if (adoriPlayer.multiAdoriID == false)
      adoriPlayer.fetchTags(); // this function also builds the default carousal
    else {
      multitagsfetched = 0;
      chain_FetchMultiTags(0);
    }
  });
  //if we fail then we may have a bad adoriid.
  promise.fail(function () {
    console.log("episodeinfo error with adoriid");
    ret = -1;
    return ret;
  });
}

//if the first tag does not show, then check the AudioMetaData Promise, sometimes it comes late and  since it is not chained well it may not show
// Solution find a good way to chain the promisies
function fetchTags(context) {
  //var AudioMetaData = context.serverurl + "/audiotracks/" + context.adoriID;
  // var promise = $.getJSON(AudioMetaData);
  var ret = 0;
  readytoplay = false; // reset readytoplay;
  var promises = [];
  // fetch collection episodes
  //https://prod.adorilabs.com/service/v5/shows/colection_id/episodes?next=0

  var AdoriTags = context.serverurl + "/episodes/" + context.adoriID + "/tags";
  var AdoriTagDetails;
  if (ret == -1) return -1;
  var promise1 = $.getJSON(AdoriTags);
  var tagId = [];
  context.tagOffsets[0] = 0; // for the showimage
  promise1.done(function (tagJSON) {
    context.nooftags = tagJSON.length + 1; // since we are adding the show details as the first tag
    console.log("Number of Tags + show detail tag= " + context.nooftags);

    for (var i = 0, len = tagJSON.length; i < len; i++) {
      tagId[i] = tagJSON[i].tagId;
      context.tagOffsets[i + 1] = tagJSON[i].offsetMillis;
      AdoriTagDetails = context.serverurl + "/tags/" + tagId[i];
      var promise2 = $.getJSON(AdoriTagDetails);
      let index = i + 1;

      promise2.done(function (tagDetails) {
        console.log("TagIndex = " + index);
        console.log("TagDetails = " + JSON.stringify(tagDetails));
        context.tagSharable[index] = tagDetails.sharable;
        context.tagCaptions[index] = tagDetails.caption;
        context.tagDisplayTimeOffset[index] = tagDetails.displayTimeOffset;
        //- for leagacy if image field has http then seperate out the last part and concat that with prod.adorilabs.com./v4/images

        //console.log("tagDetails.image = " + tagDetails.imageId);
        //var imagefield=  tagDetails.imageId.substr( tagDetails.imageId.lastIndexOf('/') + 1);
        //var imglink = context.serverurl + "/images/" + imagefield;
        var currentAction = tagDetails.actions;
        //context.tagImages[index] =imglink;
        context.tagImages[index] = tagDetails.imageInfo.url;
        context.tagThumbImages[index] = tagDetails.imageInfo.thumbnailURL;
        context.tagActions[index] = tagDetails.actions;
        context.tagUrls[index] = tagDetails.url;
        context.tagContact[index] = tagDetails.contact; // check this
        context.tagChoices[index] = tagDetails.choices;
        if (currentAction == "create_note")
          context.tagNotetext[index] = tagDetails.notetext;
        else context.tagNotetext[index] = null; // actions 'create_note'
        if (currentAction == "navigate")
          context.tagLocation[index] = tagDetails.locationInfo.location;
        else context.tagLocation[index] = null;
        context.tagTopMarginPercentage[index] =
          tagDetails.style.topMarginPercentage;
        context.tagImageOpacity[index] = tagDetails.style.imageOpacity;
        context.tagFontStyle[index] = tagDetails.style.fontStyle;
        context.tagStyle[index] = tagDetails.style;
        context.tagDisplayAd[index] = tagDetails.displayAd;
        context.adSource[index] = tagDetails.adSource;

        // TagDetails = {"style":{"fontStyle":1,"imageOpacity":0,"topMarginPercentage":0.75},
        // "fontStyle":1,
        // "imageOpacity":0,
        // "topMarginPercentage":0.75,
        // "actions":"navigate",
        // "image":"ea6e05aa-74ca-41c1-a4e3-7ddcd7be3d0f",
        // "shareable":true,
        // "saveable":true,
        // "caption":"Could this be where you find your next favorite wine?",
        // "location":"geo:37.1235743,25.238722000000053","id":"f06d4976-0c30-494f-819d-7370051fff46",
        // "userId":"bb4deb21-962c-42ba-934c-4d772cae4736","creationTime":1544579383000}
      });
      promises.push(promise2);
    }
    Promise.all(promises).then(() => {
      adoriPlayer.initPlayer();
      context.buildCarousal();
      context.updateIframe();
      // $(".iframe").colorbox({iframe:true, width:"100%", height:"100%"});
      //$('.bg-image-blur').css('background-image', 'url('+adoriPlayer.tagThumbImages[getCurrent_tagIndex()]+')');
      context.fetchDone = "true";
      console.log("context.fetchDone =" + context.fetchDone);
      console.log(JSON.stringify(context));
    });
  });

  promise1.fail(function () {
    console.log("error with adoriid-tag");
    alert("adoriid not found");
    window.location = window.location.pathname;
    ret = -1;
    return ret;
  });
}
// call this fuction after fetching multitags to take all the multtagobjects and add it to the main tagobject and change the offsets
// after this is done we should be good to call  buildCarousal
function mergeMultiTags() {
  adoriPlayer.tagOffsets[0] = 0;
  for (i = 0; i < adoriPlayer.arrayofTagObjects.length; i++) {
    adoriPlayer.nooftags += adoriPlayer.arrayofTagObjects[i].numberoftags;
    adoriPlayer.tagOffsets = adoriPlayer.tagOffsets.concat(
      adoriPlayer.arrayofTagObjects[i].tagOffsets
    );
    adoriPlayer.tagThumbImages = adoriPlayer.tagThumbImages.concat(
      adoriPlayer.arrayofTagObjects[i].tagThumbImages
    );
    adoriPlayer.tagImages = adoriPlayer.tagImages.concat(
      adoriPlayer.arrayofTagObjects[i].tagImages
    );
    adoriPlayer.tagImagesWidth = adoriPlayer.tagImagesWidth.concat(
      adoriPlayer.arrayofTagObjects[i].tagImagesWidth
    );
    adoriPlayer.tagImagesHeight = adoriPlayer.tagImagesHeight.concat(
      adoriPlayer.arrayofTagObjects[i].tagImagesHeight
    );
    adoriPlayer.tagUrls = adoriPlayer.tagImagesHeight.concat(
      adoriPlayer.arrayofTagObjects[i].tagUrls
    );
    adoriPlayer.canIframe = adoriPlayer.canIframe.concat(
      adoriPlayer.arrayofTagObjects[i].canIframe
    );
    adoriPlayer.tagCaptions = adoriPlayer.tagCaptions.concat(
      adoriPlayer.arrayofTagObjects[i].tagCaptions
    );
    adoriPlayer.tagActions = adoriPlayer.tagActions.concat(
      adoriPlayer.arrayofTagObjects[i].tagActions
    );
    adoriPlayer.tagSharable = adoriPlayer.tagSharable.concat(
      adoriPlayer.arrayofTagObjects[i].tagSharable
    );
    adoriPlayer.tagDisplayTimeOffset = adoriPlayer.tagDisplayTimeOffset.concat(
      adoriPlayer.arrayofTagObjects[i].tagDisplayTimeOffset
    );
    adoriPlayer.tagContact = adoriPlayer.tagContact.concat(
      adoriPlayer.arrayofTagObjects[i].tagContact
    );
    adoriPlayer.tagChoices = adoriPlayer.tagChoices.concat(
      adoriPlayer.arrayofTagObjects[i].tagChoices
    );
    adoriPlayer.tagNotetext = adoriPlayer.tagNotetext.concat(
      adoriPlayer.arrayofTagObjects[i].tagNotetext
    );
    adoriPlayer.tagLocation = adoriPlayer.tagLocation.concat(
      adoriPlayer.arrayofTagObjects[i].tagLocation
    );
    adoriPlayer.tagTopMarginPercentage =
      adoriPlayer.tagTopMarginPercentage.concat(
        adoriPlayer.arrayofTagObjects[i].tagTopMarginPercentage
      );
    adoriPlayer.tagImageOpacity = adoriPlayer.tagImageOpacity.concat(
      adoriPlayer.arrayofTagObjects[i].tagImageOpacity
    );
    adoriPlayer.tagFontStyle = adoriPlayer.tagFontStyle.concat(
      adoriPlayer.arrayofTagObjects[i].tagFontStyle
    );
    adoriPlayer.tagStyle = adoriPlayer.tagStyle.concat(
      adoriPlayer.arrayofTagObjects[i].tagStyle
    );
  }
  adoriPlayer.nooftags = adoriPlayer.nooftags + 1; // add one for the episode tag
  //adoriPlayer.tagOffsets.flat();
}

//numberoftags is the number of tags that falls in the duration
function fetchMultiTags(adoriid) {
  var ret = 0;
  var TagObject = {
    adoriId: 0,
    totalnooftags: 0,
    startTime_mills: 0,
    stopTime_mills: 0,
    duration_mills: 0,
    numberoftags: 0,
    tagOffsets: [],
    tagImages: [],
    tagThumbImages: [],
    tagImagesWidth: [],
    tagImagesHeight: [],
    tagUrls: [],
    canIframe: [],
    tagCaptions: [],
    tagActions: [],
    tagDisplayAd: [],
    adSource: [],
    tagSharable: [],
    tagDisplayTimeOffset: [],
    tagContact: [],
    tagChoices: [],
    tagNotetext: [],
    tagLocation: [],
    tagTopMarginPercentage: [],
    tagImageOpacity: [],
    tagFontStyle: [],
    tagStyle: [],
  };
  readytoplay = false; // reset readytoplay;
  var promises = [];
  var AdoriTags = adoriPlayer.serverurl + "/episodes/" + adoriid + "/tags";
  var AdoriTagDetails;
  console.log(" Getting JSON1: " + AdoriTags);
  var promise1 = $.getJSON(AdoriTags);
  var tagId = [];
  // context.tagOffsets[0] = 0; // for the showimage

  promise1.done(function (tagJSON) {
    TagObject.totalnooftags = tagJSON.length;
    TagObject.adoriId = adoriid;
    var index1 = adoriPlayer.multiAdoriIDArray.indexOf(adoriid);
    console.log(
      "Number of Tags " + TagObject.totalnooftags + " Current Index " + index1
    );
    if (index1 == 0) TagObject.startTime_mills = 0;
    else TagObject.startTime_mills = adoriPlayer.multiTimeArray[index1];
    if (index1 < adoriPlayer.multiTimeArray.length - 1) {
      TagObject.stopTime_mills = adoriPlayer.multiTimeArray[index1 + 1];
    } else {
      TagObject.stopTime_mills = adoriPlayer.multiAudioDuration;
    }

    // round stoptime to nearest 1000
    TagObject.stopTime_mills =
      Math.round(TagObject.stopTime_mills / 1000) * 1000;
    TagObject.startTime_mills =
      Math.round(TagObject.startTime_mills / 1000) * 1000;
    console.log(" TagObject.stopTime_mills = " + TagObject.stopTime_mills);
    TagObject.duration_mills =
      TagObject.stopTime_mills - TagObject.startTime_mills;

    //console.log("tagJSON = " + JSON.stringify(tagJSON));
    for (var i = 0, len = tagJSON.length; i < len; i++) {
      if (tagJSON[i].offsetMillis <= TagObject.duration_mills) {
        tagId[i] = tagJSON[i].tagId;
        TagObject.tagOffsets[i] =
          TagObject.startTime_mills + tagJSON[i].offsetMillis;

        AdoriTagDetails = adoriPlayer.serverurl + "/tags/" + tagId[i];
        console.log(" Getting JSON2: " + AdoriTagDetails);
        var promise2 = $.getJSON(AdoriTagDetails);
        let index = i;

        promise2.done(function (tagDetails) {
          console.log("TagIndex = " + index);
          //console.log("TagDetails = " + JSON.stringify(tagDetails) );
          TagObject.tagSharable[index] = tagDetails.sharable;
          TagObject.tagCaptions[index] = tagDetails.caption;
          TagObject.tagDisplayTimeOffset[index] = tagDetails.displayTimeOffset;
          var currentAction = tagDetails.actions;
          TagObject.tagImages[index] = tagDetails.imageInfo.url;
          TagObject.tagThumbImages[index] = tagDetails.imageInfo.thumbnailURL;
          TagObject.tagActions[index] = tagDetails.actions;
          TagObject.tagUrls[index] = tagDetails.url;
          TagObject.tagContact[index] = tagDetails.contact; // check this
          TagObject.tagChoices[index] = tagDetails.choices;
          if (currentAction == "create_note")
            TagObject.tagNotetext[index] = tagDetails.notetext;
          else TagObject.tagNotetext[index] = null; // actions 'create_note'
          if (currentAction == "navigate")
            TagObject.tagLocation[index] = tagDetails.locationInfo.location;
          else TagObject.tagLocation[index] = null;
          TagObject.tagTopMarginPercentage[index] =
            tagDetails.style.topMarginPercentage;
          TagObject.tagImageOpacity[index] = tagDetails.style.imageOpacity;
          TagObject.tagFontStyle[index] = tagDetails.style.fontStyle;
          TagObject.tagStyle[index] = tagDetails.style;
          TagObject.tagDisplayAd[index] = tagDetails.displayAd;
          TagObject.adSource[index] = tagDetails.adSource;
        });
        TagObject.numberoftags = index + 1;
        promises.push(promise2);
      }
    }
    return Promise.all(promises).then(() => {
      console.log("Tag Details Fetched for " + adoriid);
      console.log("TagObject = " + JSON.stringify(TagObject));
      multitagsfetched = multitagsfetched + 1;
      adoriPlayer.arrayofTagObjects.push(TagObject);
      if (multitagsfetched < adoriPlayer.multiAdoriIDArray.length)
        chain_FetchMultiTags(multitagsfetched);
      else {
        mergeMultiTags();
        adoriPlayer.initPlayer();
        console.log(JSON.stringify(adoriPlayer));
        adoriPlayer.buildCarousal();
        adoriPlayer.updateIframe();
        adoriPlayer.fetchDone = "true";
        console.log("context.fetchDone =" + adoriPlayer.fetchDone);
        console.log("WE ARE DONE");
        console.log(JSON.stringify(adoriPlayer));
      }
    });
  });

  promise1.fail(function () {
    console.log("error with adoriid-tag");
    alert("adoriid not found");
    //window.location = window.location.pathname;
    ret = -1;
    return ret;
  });
}

function chain_FetchMultiTags(index) {
  fetchMultiTags(adoriPlayer.multiAdoriIDArray[index]);
  console.log("Fetch Called");
}

//static { fontStyle.put(1, R.font.rubik);
//fontStyle.put(2, R.font.unica_one);
//fontStyle.put(3, R.font.permanent_marker);
//fontStyle.put(4, R.font.marck_script);
//fontStyle.put(5, R.font.concert_one); } This the font style values
//concert_one has changed to dosis
//The imageOpacity ranges from 0.0-1.0 (0.0 being background layer at 0.0 alpha).
//The topMarginPercentage ranges from 0.0-1.0 (1.0 being the highest margin from top).

function create_poll(poll_object, item) {
  /* Example poll_object
    poll_object = {
    "id":"7e57e77e-78a8-48ac-81c0-b2b4d8cb7531",
    "createdOn":1547696314000,
    "updatedOn":1547696314000,
    "expiresAt":null,
    "topic":"What other varietals do you like other than cabernet?",
    "choice1":"Pinot Noir",
    "choice2":"Sangiovese ",
    "choice3":"Zinfandel ",
    "choice4":"Chardonnay"}
  */
  console.log(" poll_object = " + JSON.stringify(poll_object));
  //console.log(" Poll Topic = " + poll_object.topic);
  var length = Object.keys(poll_object).length - 5; // 5 to adjust for the new poll format
  var $poll_section = $(
    '<div class="carousel-caption poll_topic panel-transparent"><div class="panel-heading "> \
  <h4>"' +
      poll_object.topic +
      '" </h4></div>'
  );
  var itemid = "item" + item;
  console.log("item ====" + itemid);
  var poll_name = "poll_name" + item;
  var s1 =
    '<div class="panel-body"><ul class="list-group poll_options" id="' +
    poll_name +
    '">';

  var s4 = "";
  for (var k = 1; k < length; k++) {
    var pollChoice = eval("poll_object.choice" + k);
    //console.log(" Choice" + k + " = " + pollChoice);
    var checked1;
    //if(k==1) checked1 =  "checked" ; else  checked1 ="";
    checked1 = "";
    var s5 =
      '<li class="list-group-item  transparent" >\
                  <input class="radio_class" type="radio" id="a' +
      itemid +
      k +
      '" value="' +
      k +
      '" name="' +
      itemid +
      '" ' +
      checked1 +
      ' />\
                  <label for="a' +
      itemid +
      k +
      '"><h5>' +
      pollChoice +
      "</h5></label>\
              </li>";
    s4 = s4 + s5;
  }

  var s2 =
    '</ul></div>\
      <div class="panel-footer transparent">\
        <button type="button" id="poll_submit' +
    item +
    '" onclick="poll_submit(' +
    item +
    ')" class="btn btn-lg submit-outline"><span class="glyphicon glyphicon-ok"></span><strong>Submit</strong></button>\
        <div class="alert" style="display:none" id="submit-alert' +
    item +
    '">\
          <h5> <strong>Thank You.</strong> Your response has been recorded.</h5>\
        </div>\
      </div>\
    </div>\
  </div>';
  // last div for item div
  return $poll_section.append(s1 + s4 + s2);
}

//<input type="radio" id="a'+k+'" name="choice" '+checked1+' >\
//style="display:none"
function showAlerts(item) {
  $("#poll_submit" + item + "").hide();
  $("#submit-alert" + item + "").show();
}

function poll_submit(item) {
  console.log("itemnum=" + item);
  console.log("Poll_info=" + JSON.stringify(adoriPlayer.tagChoices[item]));
  console.log("Poll_id=" + adoriPlayer.tagChoices[item].id);
  /*
POST https://dev.adorilabs.com/service/v5/listeners/{listenerId}/polls/{pollId}
{
  "choice": "choice1",
  "tagId": "9211fc92-ad17-4d97-9e5b-5407ec1e237c"
}

result
{
  "status": {
    "choice": "choice1",
    "createdOn": 15245778545,
    "tagId": "9211fc92-ad17-4d97-9e5b-5407ec1e237c",
    "pollId": "9211fc92-ad17-4d97-9e5b-5407ec1e237c",
    "listenerId": "9211fc92-ad17-4d97-9e5b-5407ec1e237c"
  },
  "result": {
    "choice1": 27,
    "choice2": 34,
    "choice3": 12,
    "choice4": 65
  }
}
*/
  var itemid = "item" + item;
  var myRadio = $("input[name=" + itemid + "]");
  var checkedValue = myRadio.filter(":checked").val();
  console.log("checkedValue =" + checkedValue);
  if (checkedValue !== undefined) {
    window.setTimeout(function () {
      showAlerts(item);
    }, 500);
  }
}
// ImageOpacity, font-weight, color fixed in css see .create_note, position also fixed
function setFontParam_forNote(context, index) {
  var i = index;
  var fontStyle = context.tagFontStyle[i];

  if (!isNaN(fontStyle)) {
    switch (fontStyle) {
      case 1:
        $("#note" + i + "").css("font-family", "rubic");
        break;
      case 2:
        $("#note" + i + "").css("font-family", "unica_one");
        break;
      case 3:
        $("#note" + i + "").css("font-family", "permanent_marker");
        break;
      case 4:
        $("#note" + i + "").css("font-family", "marck_script");
        break;
      case 5:
        $("#note" + i + "").css("font-family", "dosis");
        break;
      default:
        $("#note" + i + "").css("font-family", "rubic");
    }
  }
}

//scale min-max to a-b
function scale_pos(min, max, a, b, y) {
  if (min - max == 0) return 1;
  var x = ((b - a) * (y - min)) / (max - min) + a;
  return x;
}

function setFontParam(context) {
  for (var i = 0; i < context.nooftags; i++) {
    var fontStyle = context.tagFontStyle[i];
    var TopMarginPercentage = context.tagTopMarginPercentage[i];
    var ImageOpacity = context.tagImageOpacity[i];
    var BottomMarginPercentage;
    // scale 0-1 to 20-90
    //min=0 max =1 ; a=20 b =90
    //       (b-a)(x - min)
    // f(x) = --------------  + a
    //        max - min
    if (!isNaN(TopMarginPercentage)) {
      //      min-max a-b
      //scale 0-1 to 20-90
      //TopMarginPercentage = 1; // we are forcing all CAPTIONS TO BE AT THE BOTTOM.
      //console.log("topMarginPercentage = " + TopMarginPercentage );
      TopMarginPercentage = scale_pos(0, 1, 16, 90, TopMarginPercentage);
      //TopMarginPercentage = (((70*(TopMarginPercentage-0))/1) + 20);
      //console.log("topMarginPercentage after conversion = " + TopMarginPercentage );
      // scale 20-90 to 90-20
      // BottomMarginPercentage = ((((-70)*(TopMarginPercentage-20))/70)+90)-4+'%';
      BottomMarginPercentage =
        scale_pos(16, 90, 90, 16, TopMarginPercentage) + "%";
      // BottomMarginPercentage = (100-TopMarginPercentage)*1+'%';
      var str = '"' + BottomMarginPercentage + '"';
      $("#cap" + i + "").css("bottom", BottomMarginPercentage);
    }
    //console.log("context.tagFontStyle = " + fontStyle);
    //console.log("context.tagTopMarginPercentage = " + TopMarginPercentage);
    //console.log("context.tagImageOpacity = " + ImageOpacity);
    //console.log(" BottomMarginPercentage = " + str);
    //if(!isNaN(TopMarginPercentage)) $('#cap'+i+'').css('bottom','"'+ BottomMarginPercentage+'"');  //(1.0-TopMarginPercentage)*100
    if (!isNaN(fontStyle)) {
      switch (fontStyle) {
        case 1:
          $("#cap" + i + "").css("font-family", "rubic");
          break;
        case 2:
          $("#cap" + i + "").css("font-family", "unica_one");
          break;
        case 3:
          $("#cap" + i + "").css("font-family", "permanent_marker");
          break;
        case 4:
          $("#cap" + i + "").css("font-family", "marck_script");
          break;
        case 5:
          $("#cap" + i + "").css("font-family", "dosis");
          break;
        default:
          $("#cap" + i + "").css("font-family", "rubic");
      }
    }
    // if there is no caption, a bar is shown- let's remove that
    if (context.tagCaptions[i] == "" || context.tagCaptions[i] == null) {
      $("#cap" + i + "").css("background", "rgba(0, 0, 0, 0)");
    }
  }
}

function isURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name and extension
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?" + // port
      "(\\/[-a-z\\d%@_.~+&:]*)*" + // path
      "(\\?[;&a-z\\d%@_.,~+&:=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  if (!pattern.test(str)) return false;
  else return true;
}

function validUrl(url) {
  if (url.indexOf("https://") == -1 && url.indexOf("http://") == -1)
    return false;
  else return true;
  // var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  //   '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name and extension
  //   '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  //   '(\\:\\d+)?'+ // port
  //   '(\\/[-a-z\\d%@_.~+&:]*)*'+ // path
  //   '(\\?[;&a-z\\d%@_.,~+&:=-]*)?'+ // query string
  //   '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  // if(!pattern.test(url)) {
  //     console.log('Invalid LAUNCH button URL: ' + url);
  // } else {
  //     return url;
  // }
}
var hammertouch;
function buildCarousal(context) {
  //build the carousal
  $("#myCarousel").carousel("pause").removeData(); // needed to clear carousel data when reloading a new id else does not slide
  $(".carousel-inner").empty(); // clear it
  $(".audioplayer-bar-inner").empty(); // clear tags
  $("#myCarousel").carousel({ interval: false }); // to stop auto playing carousel

  for (var i = 0; i < context.nooftags; i++) {
    console.log("Index = " + i + "  Tag type: " + context.tagActions[i]);
    //- for leagacy if image field has http then seperate out the last part and concat that with prod.adorilabs.com./v4/images
    //console.log(context.tagImages[i].substr(context.tagImages[i].lastIndexOf('/') + 1));
    // var imagefield= context.tagImages[i].substr(context.tagImages[i].lastIndexOf('/') + 1);
    // var imglink = context.serverurl + "/images/" + imagefield;
    var imglink = null;
    if (i < 3)
      imglink =
        context.tagImages[i]; // load images for the first three tags only
    else imglink = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="; // rest of them load zero pixel giff

    // here we are moving the location tag to url by removing the geo: substring and then appending it to the google/maps/place url
    if (context.tagActions[i] == "navigate") {
      //http://www.google.com/maps/place/49.46800006494457,17.11514008755796
      //console.log(" tagLocation="  + context.tagLocation[i].replace('geo:','') );
      console.log(
        "Result of testing navigate valid URL = " +
          validUrl(context.tagLocation[i])
      );
      if (validUrl(context.tagLocation[i]) == true)
        context.tagUrls[i] = context.tagLocation[i];
      else
        context.tagUrls[i] =
          "http://www.google.com/maps/place/" +
          context.tagLocation[i].replace("geo:", "");
      //console.log("I= ", + i + " context.tagUrls[i] = " + context.tagUrls[i] );
    }

    var caption = "" + context.tagCaptions[i] + "";

    if (context.tagCaptions[i] == null) caption = "";

    var href = context.tagUrls[i] == null ? false : true;
    //console.log("href= ", href);
    if (i == 0) {
      $(
        '<div class="item"> <div id="bg-image' +
          i +
          '" class = "bg-image-blur1"></div> <a ><div id="item' +
          i +
          '"><div><img id="img-id1" class="" src="' +
          imglink +
          '"></div><div id="cap' +
          i +
          '" class=" carousel-caption caption2">' +
          caption +
          " </div> </div> </a>  </div>"
      ).appendTo(".carousel-inner");
    } else {
      if (context.tagActions[i] == "display_ad") {
        if (context.tagDisplayAd[i].adServiceSource == "SELF") {
          $(
            '<div class="item"><div id="bg-image' +
              i +
              '" class = "bg-image-blur1"></div><a  id="href-item' +
              i +
              '" href= "' +
              context.tagUrls[i] +
              '" target="_blank"> <div id="item' +
              i +
              '"> <img id="img-id" class="img-responsive center-block" src="' +
              imglink +
              '"><div id="cap' +
              i +
              '" class="carousel-caption caption1"> ' +
              caption +
              " </div> </div> </a> </div>"
          ).appendTo(".carousel-inner");
        } else if (context.tagDisplayAd[i].adServiceSource == "THIRD_PARTY") {
          console.log("SAMAR: ADTAG encountered");
          var keywords = "";
          var geoTarget = "";
          var sizes = ""; //Sizes to be filled by client as per device
          for (
            var j = 0;
            j < context.tagDisplayAd[i].defaultCampaign.keywords.length;
            j++
          ) {
            var [key, value] =
              context.tagDisplayAd[i].defaultCampaign.keywords[j].split(":");
            keywords +=
              'googletag.pubads().setTargeting("' +
              key.trim() +
              '", ["' +
              value.trim() +
              '"]);';
          }
          for (
            var j = 0;
            j < context.tagDisplayAd[i].defaultCampaign.geoTargets.length;
            j++
          ) {
            geoTarget +=
              'googletag.pubads().setLocation("' +
              context.tagDisplayAd[i].defaultCampaign.geoTargets[j] +
              '");';
          }
          sizes =
            "let mapping = googletag.sizeMapping().addSize([320, 400], [300, 600]).build();google_ad_slot.defineSizeMapping(mapping);";

          $(
            '<div class="item"><div id="div-google-ad-1"><script>googletag.cmd.push(function() { ' +
              keywords +
              geoTarget +
              sizes +
              'googletag.display("div-google-ad-1"); });' +
              "</script></div></div>"
          ).appendTo(".carousel-inner");
        }
      } else {
        if (href) {
          $(
            '<div class="item"><div id="bg-image' +
              i +
              '" class = "bg-image-blur1"></div><a  id="href-item' +
              i +
              '" href= "' +
              context.tagUrls[i] +
              '" target="_blank"> <div id="item' +
              i +
              '"> <img id="img-id" class="img-responsive center-block" src="' +
              imglink +
              '"><div id="cap' +
              i +
              '" class="carousel-caption caption1"> ' +
              caption +
              " </div> </div> </a> </div>"
          ).appendTo(".carousel-inner");
          //$('<div class="item"><a class="iframe" href= "'+ context.tagUrls[i] +'" target="_blank" ><div id="item'+i+'"> <img id="img-id" class="img-responsive center-block" src="'+imglink+'"><div id="cap'+i+'" class="carousel-caption caption1"> '+caption+' </div> </div> </a> </div>').appendTo('.carousel-inner');
        } else {
          $(
            '<div class="item"> <div id="bg-image' +
              i +
              '" class = "bg-image-blur1"></div><a ><div id="item' +
              i +
              '"><img id="img-id" class="img-responsive center-block" src="' +
              imglink +
              '"><div id="cap' +
              i +
              '" class="carousel-caption caption1">' +
              caption +
              " </div> </div> </a>  </div>"
          ).appendTo(".carousel-inner");
        }
      }
    }
    //$('#bg-image'+i+'').css('background-image', 'url('+adoriPlayer.tagThumbImages[i]+')');

    var tagNotetext = "" + context.tagNotetext[i] + "";
    // if this is a text tag
    if (context.tagActions[i] == "create_note" && tagNotetext != null) {
      $(
        '<div id="note' +
          i +
          '" class="carousel-caption create_note">' +
          tagNotetext +
          "</div>"
      ).appendTo("#item" + i);
      setFontParam_forNote(context, i);
      console.log("create_note");
    }
    // if this is poll tag
    if (context.tagActions[i] == "choose") {
      var choices = context.tagChoices[i];
      var item = i;
      var form = create_poll(choices, item);
      form.appendTo("#item" + i);
    }

    // ADD TAGS TO THE PROGRESS BAR
    if (i > 0) {
      //var bot= Math.floor(Math.random() * 60) + "%";
      var bot = "21.5%";
      //var left1= (context.tagOffsets[i]/ audioPlayer.duration)/10;
      var left1 = (context.tagOffsets[i] / context.audioDuration) * 100;
      var left = left1 * 0.9925 + "%"; // 0.75 is width /2
      console.log("Adding dots to progress bar %" + left);
      $(
        '<div class="audioplayer-tag" id="tag' +
          i +
          '" style="bottom:' +
          bot +
          "; left: " +
          left +
          ';"> </div>'
      ).appendTo(".audioplayer-bar-inner");
    }
    // setup_dragcaption();
    // allow caption to be dragged
    if (isMobile() && nodragcaption == false) {
      var el = document.getElementById("cap" + i);
      hammertouch = Hammer(el);
      // this will block the vertical scrolling on a touch-device while on the element
      hammertouch.get("pan").set({ direction: Hammer.DIRECTION_VERTICAL });
      hammertouch.on("  press pressup pan ", handleDrag);
    }
  } // end for

  var lastPosY = 0;
  var isDragging = false;
  function handleDrag(ev) {
    ev.preventDefault();
    var id = "cap" + getCurrent_tagIndex();
    var el = document.getElementById(id);
    PreventGhostClick(el);
    // for convience, let's get a reference to our object
    var elem = ev.target;

    // DRAG STARTED
    // here, let's snag the current position
    // and keep track of the fact that we're dragging
    if (!isDragging) {
      isDragging = true;
      // lastPosX = elem.offsetLeft;
      lastPosY = elem.offsetTop;
      console.log("You, sir, are dragging me... lastPosY = " + lastPosY);
      // $('#'+id+'').css('padding', '20px');
    }

    // we simply need to determine where the x,y of this
    // object is relative to where it's "last" known position is
    // NOTE:
    //    deltaX and deltaY are cumulative
    // Thus we need to always calculate 'real x and y' relative
    // to the "lastPosX/Y"
    // var posX = ev.deltaX + lastPosX;
    var posY = ev.deltaY + lastPosY;

    // move our element to that position
    // elem.style.left = posX + "px";
    // elem.style.top = posY + "px";
    //var BottomMarginPercentage = (70- (posY/HEIGHT)*100)+'%';
    var TopMarginPercentage = (posY / HEIGHT) * 100;
    console.log("TopMarginPercentage = " + TopMarginPercentage);
    if (TopMarginPercentage > 77) TopMarginPercentage = 77;
    if (TopMarginPercentage < 0) TopMarginPercentage = 0;
    elem.style.top = TopMarginPercentage + "%";
    elem.style.bottom = "auto";
    //elem.style.font-size = '220%' ;
    $("#" + id + "").css("font-weight", "bold");
    //elem.style.padding = '20px';
    if (ev.type == "pressup" || ev.isFinal) {
      isDragging = false;
      console.log(
        "Much better. It's nice here. PosY = " + (posY / HEIGHT) * 100
      );
      // $('#'+id+'').css('padding', '5px');
      $("#" + id + "").css("font-weight", "normal");
      //  var BottomMarginPercentage = (100- (posY/HEIGHT)*100)+'%';
      // $('#'+id+'').css('bottom', BottomMarginPercentage);
    }
  }

  $(".item").first().addClass("active");
  $(".left.carousel-control").hide();
  audioPlayer.title = context.defaultTitle + ": " + context.audioName; // add title to lock screen
  setFontParam(context);
} // end buildCarousal

// incase the image is missing replace it with a message
$("img").on("error", function () {
  $(this).attr("src", "images/covers/error.png");
  console.log("image src error");
});

function play(context) {
  if (context.fetchDone != "true") {
    console.log("Data fetch from the server was not completed");
    return;
  }
  const playPromise = audioPlayer.play();
  // if (playPromise !== null){
  //     playPromise.catch(() => { audioPlayer.play(); });
  // }

  if (playPromise !== undefined) {
    playPromise
      .then((_) => {
        console.log("Play or AutoPlay started");
        $("#play").hide();
        $("#pause").show();
        animate_start(); // audio bars
      })
      .catch((error) => {
        console.log("Auto Play was prevented by the browser");
        // Show a "Play" button so that user can start playback.
        $("#play").show();
        $("#pause").hide();
      });
  }
}

function pause(context) {
  audioPlayer.pause();
  $("#pause").hide();
  $("#play").show();
  animate_stop();
}

function stop(context) {
  $("#myCarousel").carousel(0);
  audioPlayer.pause();
  audioPlayer.currentTime = 0.0;
  $("#pause").hide();
  $("#play").show();
  //$('#duration1').fadeOut(400);
  animate_stop();
  timeUpdate();
}

//Hide Pause Initially
$("#pause").hide();

function animate_start() {
  document.querySelector("#list-icon").classList.add("playing");
}

function animate_stop() {
  document.querySelector("#list-icon").classList.remove("playing");
}

//Play Button
$("#play").click(function () {
  adoriPlayer.play();
});

//Pause Button
$("#pause").click(function () {
  adoriPlayer.pause();
});

//Stop Button stop button was removed
// $("#stop").click(function() {
//   adoriPlayer.stop();
// });

// array = sorted array of integers
// val = pivot element
// dir = boolean, if true, returns the previous value

function getVal(array, val, dir) {
  for (var i = 0; i < array.length; i++) {
    if (dir == true) {
      if (array[i] > val) {
        return array[i - 1] || 0;
      }
    } else {
      if (array[i] >= val) {
        return array[i];
      }
    }
  }
}

function load_tag(currentTime) {
  // The slides need to updated to the neares lowest when fast forwarded or rewinded
  // First using the current time find the new tag index that is previous with respect to this new current time
  // if the image of this new index and the next index is not loaded then load it.
  // Then slide the caousal to that value
  var tagtime = getVal(
    adoriPlayer.tagOffsets,
    parseInt(currentTime * 1000),
    true
  );
  var tagindex = adoriPlayer.tagOffsets.indexOf(tagtime);
  //var tagindex = findIndexClosestNumber(adoriPlayer.tagOffsets,currentTime * 1000);
  console.log("TAGTIME = " + tagtime + "  TAGINDEX = " + tagindex);

  var isURL1 = isURL(
    $("#item" + tagindex + "")
      .find("#img-id")
      .attr("src")
  );
  if (isURL1 == false) {
    $("#item" + tagindex + "")
      .find("#img-id")
      .attr("src", adoriPlayer.tagImages[tagindex]);
    // $('#bg-image'+tagindex+'').css('background-image', 'url('+adoriPlayer.tagThumbImages[tagindex]+')');
    //$('#img-idb'+tagindex+'').attr('src',adoriPlayer.tagThumbImages[tagindex]);
    console.log("CURRENT INDEX= " + tagindex + " LOADING IMAGE= " + tagindex);
  } else {
    console.log(
      "CURRENT INDEX= " + tagindex + " IMAGE ALREADY LOADED - SKIPPING LOAD"
    );
  }
  isURL1 = isURL(
    $("#item" + (tagindex + 1) + "")
      .find("#img-id")
      .attr("src")
  );
  if (isURL1 == false) {
    $("#item" + (tagindex + 1) + "")
      .find("#img-id")
      .attr("src", adoriPlayer.tagImages[tagindex + 1]);
    // $('#bg-image'+(tagindex+1)+'').css('background-image', 'url('+adoriPlayer.tagThumbImages[(tagindex+1)]+')');
    console.log(
      "CURRENT INDEX= " + (tagindex + 1) + " LOADING IMAGE= " + (tagindex + 1)
    );
  } else {
    console.log(
      "CURRENT INDEX= " +
        (tagindex + 1) +
        " IMAGE ALREADY LOADED - SKIPPING LOAD"
    );
  }

  $("#myCarousel").carousel(tagindex);
  console.log("Load_tag Tag index updated to " + tagindex);
  // console.log("Background Image " + adoriPlayer.tagThumbImages[tagindex]);
  //$('.bg-image-blur').css('background-image', 'url('+adoriPlayer.tagThumbImages[tagindex]+')');
}

//Next Button
$("#next").click(function () {
  if (audioPlayer.readyState != 0)
    audioPlayer.currentTime = audioPlayer.currentTime + 30;
  load_tag(audioPlayer.currentTime);
});

//Prev Button
$("#prev").click(function () {
  if (audioPlayer.readyState != 0)
    audioPlayer.currentTime = audioPlayer.currentTime - 30;
  load_tag(audioPlayer.currentTime);
});

function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("Async: Copying to clipboard was successful!");
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}

var copy = function (elementId) {
  //console.log("Copy: " + elementId );
  var input = document.getElementById(elementId);
  var isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);
  //console.log("Input: " + input.value );

  if (isiOSDevice) {
    //alert('iosDevice');
    var editable = input.contentEditable;
    var readOnly = input.readOnly;

    input.contentEditable = true;
    input.readOnly = false;

    var range = document.createRange();
    range.selectNodeContents(input);

    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    input.setSelectionRange(0, 999999);
    input.contentEditable = editable;
    input.readOnly = readOnly;
  } else {
    input.select();
    //console.log("Select: " + $("#foo").value );
    //document.execCommand('copy');
    //$("#foo").select();
    // copyTextToClipboard( $("#foo").val());
  }
  document.execCommand("copy");
};

function show_copy_dialog() {
  bootbox.dialog({
    title: "<span style='color: black;'>Share Adorified Audio</span>",
    message:
      '<div class="form-group">' +
      '<input id="foo" style="color: black; background: transparent;  border: none;" type="text" class="form-control" \
                    value="https://adori.ai?adoriid=' +
      adoriPlayer.adoriID +
      '" autocomplete="off"></div>',
    buttons: {
      confirm: {
        //label: 'Copy',
        label: '<i class="fa fa-check"></i> Copy to Clipboard',
        className: "btn btn-outline-black",
        callback: function () {
          $("#foo").select();
          copy("foo");
          //alert('copied ' + $("#foo").val() + ' to clipboard');
          bootbox.alert(
            '<h5>Copied <b>"' + $("#foo").val() + '"</b> to clipboard</h5>'
          );
          window.setTimeout(function () {
            bootbox.hideAll();
          }, 2000);
        },
      },
      cancel: {
        label: "Cancel",
        className: "btn btn-outline-black",
        callback: function () {},
      },
    },
  });
}
// "<iframe src=''"https://adori.ai?adoriid='+adoriPlayer.adoriID+'"'
//   width='"300"' height='"400"'></iframe>""

function show_embed_dialog() {
  var a = "https://adori.ai?adoriid=";
  var b = adoriPlayer.adoriID;
  var c = ' width="400px"';
  var d = ' height="700px"';
  var x = "<iframe src=" + '"' + a + b + '"' + c + d + " > </iframe>";
  bootbox.dialog({
    title:
      "<span style='color: black;'>Embed Adorified Audio into your website</span>",
    message:
      '<div class="form-group">' +
      '<input id="foo" style="color: black; background: transparent;  border: none;" type="text" class="form-control" \
                       value="<iframe src=https://adori.ai?adoriid=' +
      adoriPlayer.adoriID +
      '> </iframe>" autocomplete="off"></div>',
    buttons: {
      confirm: {
        //label: 'Copy',
        label: '<i class="fa fa-check"></i> Copy to Clipboard',
        className: "btn btn-outline-black",
        callback: function () {
          $("#foo").select();
          copy("foo");
          //alert('copied ' + $("#foo").val() + ' to clipboard');
          bootbox.alert("<h5>Copied iframe snippet to the clipboard</h5>");
          window.setTimeout(function () {
            bootbox.hideAll();
          }, 2000);
        },
      },
      cancel: {
        label: "Cancel",
        className: "btn btn-outline-black",
        callback: function () {},
      },
    },
  });
}

//share button
$("#tag").click(function () {
  if (share_open == false) {
    share.open();
    share_open = true;
  } else {
    share.close();
    share_open = false;
  }
});

// Setting button
$("#settings").click(function () {
  $("#classModal").modal("show");
  //to fix the bug when scroll is enabled the column headers is not centered correctly
  setTimeout(function () {
    $("#featured_table").DataTable().columns.adjust().draw();
  }, 200);
});

//Volume Control
$("#volume").change(function () {
  audioPlayer.volume = parseFloat(this.value / 10);
});

function getCurrent_tagIndex() {
  var index1 = parseInt(
    $("#myCarousel .active").index("#myCarousel .item"),
    10
  );
  return index1;
}

//onslide
//this event is triggered right after a manual or automatic slide event

var manual_slide = false;
$("#myCarousel").on("slid.bs.carousel", "", function () {
  var index1 = getCurrent_tagIndex();

  //$('.bg-image-blur').css('background-image', 'url('+adoriPlayer.tagThumbImages[index1]+')');
  current_index = index1;
  console.log("Sliding Carousel Manually= " + manual_slide);
  var $this = $(this);
  $this.children(".carousel-control").show();
  //var index1 = parseInt($('#myCarousel .active').index('#myCarousel .item'),10);
  //load the next  image - lazy loading of image in order to conserve download bytes
  var max_index = adoriPlayer.nooftags;
  var i;
  if (index1 + 2 < max_index) i = index1 + 2;
  else i = max_index - 1;
  var isURL1 = isURL(
    $("#item" + i + "")
      .find("#img-id")
      .attr("src")
  );
  console.log(
    "current image:" +
      $("#item" + i + "")
        .find("#img-id")
        .attr("src") +
      " isURL= " +
      isURL1
  );

  if (isURL1 == false) {
    $("#item" + i + "")
      .find("#img-id")
      .attr("src", adoriPlayer.tagImages[i]);
    //$('#img-idb'+i+'').attr('src', adoriPlayer.tagThumbImages[i]);
    //$('#bg-image'+i+'').css('background-image', 'url('+adoriPlayer.tagThumbImages[i]+')');
    console.log("CURRENT INDEX= " + index1 + " LOADING IMAGE= " + i);
  } else {
    console.log(
      "CURRENT INDEX= " + index1 + " IMAGE ALREADY LOADED - SKIPPING LOAD"
    );
  }

  // load background blur image
  //var curr_imgSrc = adoriPlayer.tagImages[getCurrent_tagIndex()];

  //  document.getElementById("img_blur").style.backgroundImage = 'url("' + curr_imgSrc + '")';
  // console.log("CURRENT INDEX= "+index1 + " LOADING IMAGE= " + curr_imgSrc);

  if ($(".carousel-inner .item:first").hasClass("active")) {
    $this.children(".left.carousel-control").hide();
  } else if ($(".carousel-inner .item:last").hasClass("active")) {
    $this.children(".right.carousel-control").hide();
  }

  if (manual_slide == true) {
    // Manual slide
    audioPlayer.currentTime = parseInt(
      adoriPlayer.tagOffsets[index1] / 1000 + 0
    );
    manual_slide = false;
  }
  // make the active tag white
  // first remove the current active tag if any
  $(".audioplayer-bar-inner > .audioplayer-tag").each(function (index) {
    if ($(this).hasClass("audioplayer-tag-active"))
      $(this).removeClass("audioplayer-tag-active");
    // then add the active tag since we are not counting from show tag we added a 1
    if (index1 == index + 1) $(this).addClass("audioplayer-tag-active");
  });

  if (hidecarouselcontrols == "true") {
    $("#myCarousel").children(".carousel .carousel-control").hide();
    // $('#right-carousel').hide();$('#left-carousel').hide();
  }
  if (showlogo == true) {
    if (index1 == 0) $(".logo").show();
    else $(".logo").hide();
  }
});

//hammer_swipe.js takes care of this
// $('#left-carousel').click(function() {
// 	$("#myCarousel").carousel("prev");
// 	manual_slide = true;
// });

// $('#right-carousel').click(function() {
//   $("#myCarousel").carousel("next");
//   //console.log("manual_slide=true");
// 	manual_slide = true;
// });

function endPlay() {
  console.log("End");
  adoriPlayer.stop();
}

function findIndexClosestNumber(arrayToSearch, compareNumber) {
  "use strict";
  let closest = compareNumber;
  let indexClosest = 0;

  arrayToSearch.forEach((currentNumber, index) => {
    let currentDistance = Math.abs(compareNumber - currentNumber);

    if (currentDistance < closest) {
      indexClosest = index;
      closest = currentDistance;
    }
  });

  return indexClosest;
}

function timeUpdate() {
  timeCurrent.text(secondsToTime(audioPlayer.currentTime));
  barPlayed.width((audioPlayer.currentTime / audioPlayer.duration) * 100 + "%");
  var index = 0;
  var currTime = parseInt(audioPlayer.currentTime);
  if (currTime != prevTime) {
    console.log("timeupdate = " + currTime + " secs");

    index = adoriPlayer.tagOffsets.indexOf(currTime * 1000);

    //index = findIndexClosestNumber(adoriPlayer.tagOffsets,currTime * 1000);

    // why index was increased by one- because index 0 has the show details so tag 0 is really index 1 of the array
    if (index !== -1) {
      console.log("index = " + index.valueOf());
      $("#myCarousel").carousel(index.valueOf());
      console.log("Tag index updated to " + index.valueOf());
    }
    prevTime = currTime;
  }
}

function updateLoadBar() {
  if (
    isNaN(audioPlayer.duration) ||
    audioPlayer.duration == "" ||
    typeof audioPlayer.duration != "number"
  )
    return;
  barLoaded.width(
    (audioPlayer.buffered.end(0) / audioPlayer.duration) * 100 + "%"
  );
  if (audioPlayer.buffered.end(0) >= audioPlayer.duration)
    clearInterval(loadIntervalId);
  //console.log("updateLoadBar" +  audioPlayer.buffered.end( 0 ) + " Duration "+audioPlayer.duration);
}

function loadedData() {
  timeDuration.text(secondsToTime(audioPlayer.duration));
  console.log("DATA LOADED");
}

function adjustCurrentTime(e) {
  theRealEvent = isTouch ? e.originalEvent.touches[0] : e;
  audioPlayer.currentTime = Math.round(
    (audioPlayer.duration * (theRealEvent.pageX - theBar.offset().left)) /
      theBar.width()
  );
  console.log(
    "Current time adjusted to via progress bar " + audioPlayer.currentTime
  );
  load_tag(audioPlayer.currentTime);
}

//var tme = secondsToTime(audioPlayer.currentTime);
secondsToTime = function (secs) {
  if (isNaN(secs) || secs == "" || typeof secs != "number") return "00:00";
  var hours = Math.floor(secs / 3600),
    minutes = Math.floor((secs % 3600) / 60),
    seconds = Math.ceil((secs % 3600) % 60);
  return (
    (hours == 0
      ? ""
      : hours > 0 && hours.toString().length < 2
      ? "0" + hours + ":"
      : hours + ":") +
    (minutes.toString().length < 2 ? "0" + minutes : minutes) +
    ":" +
    (seconds.toString().length < 2 ? "0" + seconds : seconds)
  );
};

/**
 * Fire an event handler to the specified node. Event handlers can detect that the event was fired programatically
 * by testing for a 'synthetic=true' property on the event object
 * @param {HTMLNode} node The node to fire the event handler on.
 * @param {String} eventName The name of the event without the "on" (e.g., "focus")
 */
function fireEvent(node, eventName) {
  // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
  var doc;
  if (node.ownerDocument) {
    doc = node.ownerDocument;
  } else if (node.nodeType == 9) {
    // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
    doc = node;
  } else {
    throw new Error("Invalid node passed to fireEvent: " + node.id);
  }

  if (node.dispatchEvent) {
    // Gecko-style approach (now the standard) takes more work
    var eventClass = "";

    // Different events have different event classes.
    // If this switch statement can't map an eventName to an eventClass,
    // the event firing is going to fail.
    switch (eventName) {
      case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
      case "mousedown":
      case "mouseup":
        eventClass = "MouseEvents";
        break;

      case "focus":
      case "change":
      case "blur":
      case "select":
        eventClass = "HTMLEvents";
        break;

      default:
        throw (
          "fireEvent: Couldn't find an event class for event '" +
          eventName +
          "'."
        );
    }
    var event = doc.createEvent(eventClass);
    event.initEvent(eventName, true, true); // All events created as bubbling and cancelable.

    event.synthetic = true; // allow detection of synthetic events
    // The second parameter says go ahead with the default action
    node.dispatchEvent(event, true);
  } else if (node.fireEvent) {
    // IE-old school style, you can drop this if you don't need to support IE8 and lower
    var event1 = doc.createEventObject();
    event1.synthetic = true; // allow detection of synthetic events
    node.fireEvent("on" + eventName, event1);
  }
}

function updateIframe(context) {
  var promises = [];
  var is_http;
  tagUrls = context.tagUrls;
  //out1 = context.canIframe;
  for (let i = 0, len = tagUrls.length; i < len; i++) {
    context.canIframe[i] = false;
    is_http = false;
    if (tagUrls[i] != null)
      if (tagUrls[i].indexOf("http://") == 0) is_http = true;
    console.log("index= " + i + " ISHTTP = " + is_http);
    if (
      tagUrls[i] != null &&
      context.tagActions[i] == "click" &&
      is_http == false
    ) {
      var promise2 = getXhr(tagUrls[i], i);
      //console.log( "created promise num " , i)
      promise2
        .then(function (result) {
          // var res = JSON.stringify(result);
          //console.log("res = "+res);
          context.canIframe[i] = result.iframe;
          if (result.iframe) $("#href-item" + i + "").addClass("iframe");
        })
        .catch(function (err) {
          //var res = JSON.stringify(err);
        });
      promises.push(promise2);
    }
    //console.log('i= '+i)
  }
  Promise.all(promises.map((p) => p.catch(() => undefined)))
    .then(() => {
      console.log("context.canIframe =" + context.canIframe);
      $(".iframe").colorbox({ iframe: true, width: "98%", height: "98%" });
    })
    .catch(function (err) {
      promises.splice(10, 1);
      console.log(`Error in promises ` + JSON.stringify(err));
    });
}

function getXhr(url, i) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    var cors_api_host = "https://iframeok.herokuapp.com/";
    var cors_api_url = cors_api_host + url;
    console.log("index= " + i + " TESTING URL = " + cors_api_url);
    xhr.open("GET", cors_api_url);
    xhr.timeout = 3000; // time in milliseconds
    xhr.onload = function () {
      //console.log("status = " + this.status);
      if (this.status == 400) {
        reject({
          //status: this.status,
          //statusText: xhr.statusText
          index: i,
          iframe: false,
          timeout: false,
          error: true,
        });
      }
      if (this.status >= 200 && this.status < 300) {
        var final_url = xhr.getResponseHeader("x-final-url");
        if (final_url != url)
          console.log("index= " + i + "  final_url Test FAILED  " + final_url);
        //console.log("final_url = " + final_url);
        var headers = xhr.getAllResponseHeaders().toLowerCase();
        let so = /x-frame-options: (.*)/.exec(headers);
        //console.log("headers = " + headers);
        console.log("index= " + i + "  so= " + so);
        //if (so != null && (so[1] === "sameorigin" || so[1] === "deny"))
        if (so != null || final_url != url) {
          resolve({
            index: i,
            iframe: false,
            timeout: false,
            errror: true,
          });
        } else {
          //console.log("headers = " + headers);
          //console.log("so= " + so);
          resolve({
            index: i,
            iframe: true,
            timeout: false,
            errror: false,
          });
        }
      } else {
        reject({
          index: i,
          iframe: false,
          timeout: false,
          error: true,
        });
      }
    };
    xhr.ontimeout = function () {
      console.log("ontimeout");
      reject(
        {
          index: i,
          iframe: false,
          timeout: true,
          error: true,
        },
        Error("Network Error")
      );
    };
    xhr.onerror = function () {
      console.log("onerror");
      reject(
        {
          //status: this.status,
          //statusText: xhr.statusText
          index: i,
          iframe: false,
          timeout: false,
          errror: true,
        },
        Error("ONERROR Error")
      );
    };
    xhr.send(null);
  });
}

function isMobile() {
  if (
    navigator.userAgent.match(/Android|iPhone|PhantomJS/i) &&
    !navigator.userAgent.match(/iPod|iPad/i)
  )
    return true;
  return false;
}
// var convertTime = function (time) {

// 	if (isNaN(time) || time == "" || typeof time != 'number') return "00:00";

// 	var hours   = parseInt( time / 3600 ) % 24,
// 		minutes = parseInt( time / 60 ) % 60,
// 		seconds = parseInt( time % 60);
//     var result;
// 	if (hours > 0) {
// 		 result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
// 	} else {
// 		 result = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
// 	}

// 	return result;

// };

// function adjustViewPort1(elements) {
//   child = elements[0];
//   var width = $(child).carousel("width");
//   var height = $(child).carousel("height");

//   console.log("Elements = " + child);
//   console.log("width = " + width + "height = " + height);
// }

// $('#share-bar').share();

/*
function detectswipe(el,func) {
  swipe_det = new Object();
  swipe_det.sX = 0; swipe_det.sY = 0; swipe_det.eX = 0; swipe_det.eY = 0;
  var min_x = 30;  //min x swipe for horizontal swipe
  var max_x = 30;  //max x difference for vertical swipe
  var min_y = 50;  //min y swipe for vertical swipe
  var max_y = 60;  //max y difference for horizontal swipe
  var direc = "";
  ele = document.getElementById(el);
  ele.addEventListener('touchstart',function(e){
    var t = e.touches[0];
    swipe_det.sX = t.screenX; 
    swipe_det.sY = t.screenY;
  },false);
  ele.addEventListener('touchmove',function(e){
    e.preventDefault();
    var t = e.touches[0];
    swipe_det.eX = t.screenX; 
    swipe_det.eY = t.screenY;    
  },false);
  ele.addEventListener('touchend',function(e){
    //horizontal detection
    if ((((swipe_det.eX - min_x > swipe_det.sX) || (swipe_det.eX + min_x < swipe_det.sX)) && ((swipe_det.eY < swipe_det.sY + max_y) && (swipe_det.sY > swipe_det.eY - max_y) && (swipe_det.eX > 0)))) {
      if(swipe_det.eX > swipe_det.sX) direc = "r";
      else direc = "l";
    }
    //vertical detection
    else if ((((swipe_det.eY - min_y > swipe_det.sY) || (swipe_det.eY + min_y < swipe_det.sY)) && ((swipe_det.eX < swipe_det.sX + max_x) && (swipe_det.sX > swipe_det.eX - max_x) && (swipe_det.eY > 0)))) {
      if(swipe_det.eY > swipe_det.sY) direc = "d";
      else direc = "u";
    }

    if (direc != "") {
      if(typeof func == 'function') func(el,direc);
    }
    direc = "";
    swipe_det.sX = 0; swipe_det.sY = 0; swipe_det.eX = 0; swipe_det.eY = 0;
  },false);  
}

function myfunction(el,d) {
  // alert("you swiped on element with id '"+el+"' to "+d+" direction");

  if($('.carousel-inner .item:first').hasClass('active')) // first tag only allow left slide
  {
    if(d=='r')d='x';
    // alert(" FIRST TAG you swiped on element with id '"+el+"' to "+d+" direction");
  } 
  else if($('.carousel-inner .item:last').hasClass('active')) // last tag  only right slide
  {
    if(d=='l')d='x';
    // alert(" LAST TAG you swiped on element with id '"+el+"' to "+d+" direction");
  }

  // if(d=='r') fireEvent(document.getElementById("left-carousel"), "click"); 
  // else if(d=='l') fireEvent(document.getElementById("right-carousel"), "click"); 
}

// detectswipe('myCarousel',myfunction);
*/

/**
 * Prevent click events after a touchend.
 *
 * Inspired/copy-paste from this article of Google by Ryan Fioravanti
 * https://developers.google.com/mobile/articles/fast_buttons#ghost
 *
 * USAGE:
 * Prevent the click event for an certain element
 * ````
 *  PreventGhostClick(myElement);
 * ````
 *
 * Prevent clicks on the whole document (not recommended!!) *
 * ````
 *  PreventGhostClick(document);
 * ````
 *
 */
(function (window, document, exportName) {
  var coordinates = [];
  var threshold = 25;
  var timeout = 2500;

  // no touch support
  if (!("ontouchstart" in window)) {
    window[exportName] = function () {};
    return;
  }

  /**
   * prevent clicks if they're in a registered XY region
   * @param {MouseEvent} ev
   */
  function preventGhostClick(ev) {
    for (var i = 0; i < coordinates.length; i++) {
      var x = coordinates[i][0];
      var y = coordinates[i][1];

      // within the range, so prevent the click
      if (
        Math.abs(ev.clientX - x) < threshold &&
        Math.abs(ev.clientY - y) < threshold
      ) {
        ev.stopPropagation();
        ev.preventDefault();
        break;
      }
    }
  }

  /**
   * reset the coordinates array
   */
  function resetCoordinates() {
    coordinates = [];
  }

  /**
   * remove the first coordinates set from the array
   */
  function popCoordinates() {
    coordinates.splice(0, 1);
  }

  /**
   * if it is an final touchend, we want to register it's place
   * @param {TouchEvent} ev
   */
  function registerCoordinates(ev) {
    // touchend is triggered on every releasing finger
    // changed touches always contain the removed touches on a touchend
    // the touches object might contain these also at some browsers (firefox os)
    // so touches - changedTouches will be 0 or lower, like -1, on the final touchend
    if (ev.touches.length - ev.changedTouches.length <= 0) {
      var touch = ev.changedTouches[0];
      coordinates.push([touch.clientX, touch.clientY]);

      setTimeout(popCoordinates, timeout);
    }
  }

  /**
   * prevent click events for the given element
   * @param {EventTarget} el
   */
  window[exportName] = function (el) {
    el.addEventListener("touchstart", resetCoordinates, true);
    el.addEventListener("touchend", registerCoordinates, true);
  };

  document.addEventListener("click", preventGhostClick, true);
})(window, document, "PreventGhostClick");
