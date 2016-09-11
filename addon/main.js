//Requirements
var contextMenu = require("sdk/context-menu"); //for access to context menu
var self = require("sdk/self"); //for access to local data
var Request = require('sdk/request').Request; //for request to server
var clipboard = require("sdk/clipboard"); //for access to clipboard
var notifications = require('sdk/notifications'); //for show notifications
var panels = require("sdk/panel"); //create panel

// ╔═════════════════╗
// ║    main code    ║
// ╚═════════════════╝

var menuItem = contextMenu.Item({ //create context menu
  label: "Download From Twitter Video", //name for show in menu
  context: contextMenu.SelectorContext("a.tweet-timestamp, time.tweet-timestamp a, .txt-small a"), //chek element for show in context menu
  contentScript: 'self.on("click", function (node, data) {' + //get href attr valu
    '  self.postMessage(node.href);' +
    '});',
  image: self.data.url("images/twitter-video-downloader.png"), //set icon for context menu item
  onMessage: function (link) {
    downloadFromTwitter(link); //send link to func
  }
});

var panel = panels.Panel({ //create panel for show view
  width: 300, //set width
  height: 220, //set height
  contentURL: self.data.url("popup.html"), //set view
  contentScriptFile: self.data.url("js/process.js") //set process script
});

//func for generate link
function downloadFromTwitter(twittUrl){

  var TWITT_URL = twittUrl; //twitt link
  var API_URL ="http://server6.youtubebyclick.com/online/PreDownload.php?url=";
  var API_VIDEO_SETTINGS = "&format=MP4&quality=hd&force=0";

  var req =  Request({ //send request to server
    url: API_URL + TWITT_URL + API_VIDEO_SETTINGS, //set url
    onComplete: function (response) { //onComplete func
      var obj = JSON.parse(response.text); //convert response to object

      if(obj.Result === "OK"){ //chek request true
        clipboard.set(obj.FlvUrl); //copy download link to clipboard
        showNotification("Great!!!", "Download Link Copy To Clipboard."); //show notification
        panel.port.emit("videoUrl", obj.FlvUrl); //send video url to process.js for show in view
        panel.port.emit("videoImage", obj.Image); //send video-image url to process.js for show in view
        panel.show(); //show view in center
      }else{
        showNotification("We Are Sorry...", "Download Link Failed. \n" + "Invalid Input, Try Again.");
      }
     }
    }).get();
}

//show notification func
function showNotification(notifiTitle, notifiText){
  notifications.notify({
      title: notifiTitle,
      text: notifiText
  });
}
