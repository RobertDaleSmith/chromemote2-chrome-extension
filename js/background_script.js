var appVersion = chrome.i18n.getMessage("version"),
	connectedDeviceCount = 0,
	connectedDevice = "",
	gTvPluginLoaded = false,
    notConnectedMessage = "You are not connected to any Google TV devices. Please click the Chromemote icon at the top right to connect to a Google TV device on your network.",
    noMoteServerMessage = "Anymote Bridge IP ha not been set yet. Install the Anymote Bridge on your Google TV and then set the IP in Chromemote's settings menu.";

var osDetected = "Unknown OS", 
    gTvPluginLoaded = false, 
    userAgent,
    anyMotePluginActive = true;

if(localStorage.getItem("npapi_enabled")!= null) {
	if(localStorage.getItem("npapi_enabled") == "true") anyMotePluginActive = true;
	else anyMotePluginActive = false;
}



var firstInstallAck = false;
var installAck = localStorage.getItem('install-ack');
if (installAck != null) {
	if (installAck == 'false') 		firstInstallAck = false;
	else if (installAck == 'true') 	firstInstallAck = true;	
	console.log('Restored Acknowledgement Status to ' + firstInstallAck);
}
var firstInstall = function() {
	firstInstallAck = false;
	localStorage.setItem('install-ack', firstInstallAck);
	console.log("New Install / Update detected ... Showing whats new dialog until acknowledgment received.");
}
try { chrome.runtime.onInstalled.addListener(firstInstall); }
catch(err) { console.log("Update Chrome to 23+ for best support."); }
var newInstallUpdateMsg = "Welcome to Chromemote&nbsp;2. <br>"+
	"<p class='whats_new_message'>"+
	"<br><b>What's new:</b>"+
	"<br>- ChromeOS support through new Anymote Bridge app for Google TV."+
	"<br>- New User Interface with custom color themes."+
	"<br>- Rearrangeable, draggable remote buttons."+
	"<br>- Sync installed apps list with Google TV's."+
	"<br>- Add custom links and Android intents to apps tab."+
	"<br>- Sync channel list with Google TV's."+
	"<br>- Create button macros in channels tab."+
	"<br>- Full mode has larger touch-pad and has all buttons."+
	"<br>- New pop-out window mode."+
	"<br>- Donor activation with ability to disable ads."+
	"<br><br>"+
	"<b>Existing features renewed:</b>"+
	"<br>- Customizable Google TV remote control."+
	"<br>- Keyboard and mouse control of Google TV."+
	"<br>- Right click and fling web links to TV."+
	"<br>- YouTube video page embedded fling button."+
	"<br>- Rename connected GTV devices."+
	"<br><br>"+
	"Chromemote is honor-ware so you pay what you want. Love it and find it useful? Then show us some <a href='http://chromemote.com/support-us/' target='_blank'><b> love</b></a> in any way you can. Your help keeps us fine tuning and adding new features."+
	"</p>";



window.onload = function() {

	userAgent = window.navigator.appVersion;
	//console.log( userAgent ); //Display Version Information in the console.	
	if (userAgent.indexOf("Win")		   !=-1)  osDetected="WindowsOS";
	if (userAgent.indexOf("Windows NT 6.3")!=-1)  osDetected="Windows8.1";
	if (userAgent.indexOf("Windows NT 6.2")!=-1)  osDetected="Windows8";
	if (userAgent.indexOf("Windows NT 6.1")!=-1)  osDetected="Windows7";
	if (userAgent.indexOf("Windows NT 6.0")!=-1)  osDetected="WindowsVi";
	if (userAgent.indexOf("Windows NT 5.1")!=-1)  osDetected="WindowsXP";
	if (userAgent.indexOf("Mac OS X")	   !=-1)  osDetected="MacOSX";
	if (userAgent.indexOf("Mac OS X 10_9") !=-1)  osDetected="MacOSX9";
	if (userAgent.indexOf("Mac OS X 10_8") !=-1)  osDetected="MacOSX8";
	if (userAgent.indexOf("Mac OS X 10_7") !=-1)  osDetected="MacOSX7";
	if (userAgent.indexOf("Mac OS X 10_6") !=-1)  osDetected="MacOSX6";
	if (userAgent.indexOf("CrOS")		   !=-1)  osDetected="CrOS";
	if (userAgent.indexOf("Linux")		   !=-1)  osDetected="Linux";	
	console.log( "Operating System Detected::" + osDetected );

	chrome.browserAction.setIcon({path:"images/icons/icon19_grey.png"});

	googletvremoteInitializePlugin();
	
	loadGoogleTVConstants();
	
    anymoteConnectToExistingDevice();

    initContextMenus();
}

window.onerror = function() {
	console.log('JS Error found!');
};

var discoveryClient, pairingSession, anymoteSession;

var googletvremoteInitializePlugin = function() {

	var pluginEl = document.getElementById('pluginId');
    if (pluginEl) pluginEl.parentNode.removeChild(pluginEl);
    pluginEl = document.createElement('embed');
    pluginEl.type = 'application/x-gtvremote';
    pluginEl.id = 'pluginId';
    document.body.appendChild(pluginEl);
	
	try	{
		// googletvremote.poop();
		googletvremote = pluginEl.gtvremote.plugin.object.GTVRemote();
		googletvremote.init('');
		gTvPluginLoaded = true;
		anyMotePluginActive = true;
		console.log("NPAPI Plugin Loaded");
	} catch(err) {
		gTvPluginLoaded = false;
		anyMotePluginActive = false;
		console.log("ERROR:: GTVRemote Plugin is not detected.");
		
		if (osDetected == 'CrOS') {
			console.log("Chrome OS does not support the GTVRemote Plugin. Chromemote is not compatible with Google ChromeOS without the Chromemote Bridge.");
		} else if (osDetected == 'Windows8' || osDetected == 'Windows8.1') {
			console.log("ALERT:: Windows 8 app mode does not support the GTVRemote Plugin used by Chromemote.");
			console.log("ALERT:: Chromemote is only compatible with the desktop mode.");
			console.log("ALERT:: Relaunch Chrome on the desktop for GTVRemote Plugin support.");
		} else if (osDetected == 'Linux') {
			console.log("ALERT:: The GTVRemote Plugin for Linux currently only supports Chrome extensions on Ubuntu 12. Contact developer for details.");
		} else {
			console.log("ALERT:: Chromemote is compatible with WindowsXP/Vista/7/8, Mac OS X 10.6+, and Linux Ubuntu 12.");
			console.log("ALERT:: Chromemote is not currently compatible with ChromeOS, Windows 8 app mode, or other versions of Linux besides Ubuntu 12.");
			console.log("ALERT:: If you see this message and your operating system is compatible, then please contact the developer. Visit www.chromemote.com");
		}
	}
	
	try{
		var cert = localStorage.getItem('cert');
	    if (!cert || !googletvremote.loadCert(cert, 'chromemote')) {
			console.log('First launch.  Made a new certificate.');
			var uid = (((1 + Math.random()) * 0x10000000) | 0).toString(16);
			cert = googletvremote.generateSelfSignedCert('chrome-gtv-' + uid, 'chromemote');
			localStorage.setItem('cert', cert);
			localStorage.removeItem(STORAGE_KEY_PAIRED_DEVICES);
	    }
	    
	    window.discoveryClient = googletvremote.createDiscoveryClient();
	    window.pairingSession  = googletvremote.createPairingSession();
	    window.anymoteSession  = googletvremote.createAnymoteSession();
	} catch(e){}
	

    if(localStorage.getItem("npapi_enabled")!= null) {
		if(localStorage.getItem("npapi_enabled") == "true") anyMotePluginActive = true;
		else anyMotePluginActive = false;
	}
};

/**
 * Sends an Anymote key event to Google TV.  See the googletvremote_constants
 * for a complete list of keycode values.
 */
var sendAnymoteKeyEvent = function(keycode) {
	anymoteSession.sendKeyEvent(keycode, googletvremote.anymote.Action.DOWN);
	anymoteSession.sendKeyEvent(keycode, googletvremote.anymote.Action.UP);
};

/**
 * Sends a data message of type STRING.
 */
var sendAnymoteStringMessage = function(message) {
	anymoteSession.sendData(googletvremote.anymote.DataType.STRING, message);
};

/**
 * Flings a uri to the Google TV.
 */
var sendAnymoteFling = function(uri, sequenceNumber) {
	sequenceNumber = sequenceNumber || 42; // Sequence number default if not given
	anymoteSession.sendFling(uri, sequenceNumber);
};

/**
 * GA Event Tracking
 */
if(chrome.extension.getURL("/").indexOf("bhcjclaangpnjgfllaoodflclpdfcegb") >= 0)
{
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-34201638-1']);
	_gaq.push(['_trackPageview']);
	(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = 'https://ssl.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
	   console.log("__CWS_MODE__");
}
else { console.log("__DEV_MODE__"); }

function sendGAEvent(category, action) {
	if(chrome.extension.getURL("/").indexOf("bhcjclaangpnjgfllaoodflclpdfcegb") >= 0)
		_gaq.push(['_trackEvent', category, action]);
};
function sendGAEvent(category, action, optLabel, optValue) {
	if(chrome.extension.getURL("/").indexOf("bhcjclaangpnjgfllaoodflclpdfcegb") >= 0)
		_gaq.push(['_trackEvent', category, action, optLabel, optValue]);
};

function openOptionsPage() {
    var isTab = "false";
    chrome.tabs.getAllInWindow(undefined, function(tabs) {
        for (var i = 0, tab; tab = tabs[i]; i++) {
            isTab = "false";
            if(tab.url == chrome.extension.getURL('chromemote.html?tab') ){ isTab = "true"; }
            if(tab.url && isTab == "true") {
                chrome.tabs.update(tab.id, {selected: true});
                console.log("Full Tab Mode was detected. Selected Full Mode Tab.");
                isTab = "true";                    
                break;
            }   
        }
        if(isTab == "false") {
            chrome.tabs.create( {
                index: 0,
                url: chrome.extension.getURL('chromemote.html?tab'),
                pinned: true
            } );
            console.log("Full Tab Mode was not detected. Enabling Full Tab Mode.");
        }
    });
}

function initContextMenus() {
  	// A link onclick callback function.
	var linkOnClick = function(info, tab) {
		console.log("item " + info.menuItemId + " was clicked");
		console.log("info: " + JSON.stringify(info));
		//console.log("tab: " + JSON.stringify(tab));
		sendFling(info.linkUrl);
		sendGAEvent("Fling", "Link");
	};
	var linkId = chrome.contextMenus.create({"title": "Fling Link to Google TV", "contexts":["link"], "onclick": linkOnClick});
	console.log("'" + "link" + "' item:" + linkId);

  	// A page onclick callback function.
	var pageOnClick = function(info, tab) {
		console.log("item " + info.menuItemId + " was clicked");
		console.log("info: " + JSON.stringify(info));
		//console.log("tab: " + JSON.stringify(tab));
		sendFling(tab.url);
		sendGAEvent("Fling", "Page");
	};
	var pageId = chrome.contextMenus.create({"title": "Fling Page to Google TV", "contexts":["page"], "onclick": pageOnClick});
	console.log("'" + "page" + "' item:" + pageId);

  	// A selection on click callback function.
	var selectionOnClick = function(info, tab) {
		console.log("item " + info.menuItemId + " was clicked");
		console.log("info: " + JSON.stringify(info));
		//console.log("tab: " + JSON.stringify(tab));
		///sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.SEARCH);		
		sendFling(info.selectionText);
		sendGAEvent("Fling", "Selection");
		
	};
	var selectId = chrome.contextMenus.create({"title": "Search Selected Text on Google TV", "contexts":["selection"], "onclick": selectionOnClick});
	console.log("'" + "selection" + "' item:" + selectId);
		
  	// A video onclick callback function.
	var videoOnClick = function(info, tab) {
		console.log("item " + info.menuItemId + " was clicked");
		console.log("info: " + JSON.stringify(info));
		//console.log("tab: " + JSON.stringify(tab));
		sendFling(info.srcUrl);
		sendGAEvent("Fling", "HTML5_VIDEO");
	};
	var videoId = chrome.contextMenus.create({"title": "Fling video to Google TV", "contexts":["video"], "onclick": videoOnClick});
	console.log("'" + "video" + "' item:" + videoId);
	
  	// A selection onclick callback function.
	var audioOnClick = function(info, tab) {
		console.log("item " + info.menuItemId + " was clicked");
		console.log("info: " + JSON.stringify(info));
		//console.log("tab: " + JSON.stringify(tab));		
		sendFling(info.srcUrl);
		sendGAEvent("Fling", "AUDIO");
	};
	var audioId = chrome.contextMenus.create({"title": "Fling audio to Google TV", "contexts":["audio"], "onclick": audioOnClick});
	console.log("'" + "audio" + "' item:" + audioId);
	
  	// A image onclick callback function.
	var imageOnClick = function(info, tab) {
		console.log("item " + info.menuItemId + " was clicked");
		console.log("info: " + JSON.stringify(info));
		//console.log("tab: " + JSON.stringify(tab));		
		sendFling(info.srcUrl);
		sendGAEvent("Fling", "Image");
	};
	var id = chrome.contextMenus.create({"title": "Fling Image to Google TV", "contexts":["image"], "onclick": imageOnClick});
	console.log("'" + "image" + "' item:" + id);

};

function flashBadge() {	
	var textString = " ";
	chrome.browserAction.setBadgeText({text:textString});
	chrome.browserAction.setBadgeBackgroundColor({color:[0, 200, 0, 100]});
	
	chrome.browserAction.setBadgeBackgroundColor({color:[255, 255, 0, 100]});
	setTimeout(function()
	{
		chrome.browserAction.setBadgeBackgroundColor({color:[0, 200, 0, 100]});
	}, 140);
	setTimeout(function()
	{
		chrome.browserAction.setBadgeBackgroundColor({color:[255, 255, 0, 100]});
	}, 280);
	setTimeout(function()
	{
		chrome.browserAction.setBadgeBackgroundColor({color:[0, 200, 0, 100]});
		textString = "";
		chrome.browserAction.setBadgeText({text:textString});
	}, 420);	
};

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {	
	if(request.flingurl) {		
		console.log('Fling Success: ' + request.flingurl);
		chrome.tabs.getSelected(null, function(tab) { sendFling(request.flingurl); });
		
		// if a callback is given:
		sendResponse && sendResponse('Fling Success: ' + request.flingurl);
	}
	if(request.getVersion) sendResponse && sendResponse(appVersion);
});

//Previous page open url listener for Fling_url button.
var previousTab, currentTab;
chrome.tabs.getSelected(null, function(tab) { previousTab = tab.id; currentTab = null; });
chrome.tabs.onSelectionChanged.addListener(function(tab) {
	if (previousTab == null) { previousTab = tab; }
	if (currentTab  == null) { currentTab  = tab; } 
	else { previousTab = currentTab; currentTab = tab; }
});


//Replaces an occurance of a substring within a string with another substring.
String.prototype.replaceAll = function( token, newToken, ignoreCase ) {
    var _token;
    var str = this + "";
    var i = -1;

    if ( typeof token === "string" ) {

        if ( ignoreCase ) {

            _token = token.toLowerCase();

            while( (
                i = str.toLowerCase().indexOf(
                    token, i >= 0 ? i + newToken.length : 0
                ) ) !== -1
            ) {
                str = str.substring( 0, i ) +
                    newToken +
                    str.substring( i + token.length );
            }

        } else {
            return this.split( token ).join( newToken );
        }

    }
    return str;
};

//MoteServer API (Background Stuff) -------------------------------------
var moteServerAddress = null,
    moteServerActive  = false;
if(localStorage.getItem("mote_server_ip")!= null) moteServerAddress = localStorage.getItem("mote_server_ip");

var sendMBridgeFling = function (flingUrl, callback) {
	if(localStorage.getItem("mote_server_ip")!= null) moteServerAddress = localStorage.getItem("mote_server_ip");

	if(moteServerAddress != null){
		var url = "http://"+ moteServerAddress +":8085/mote?fling=" + flingUrl.replaceAll("#","%23") + "&time=" + new Date().getTime();
	    //console.log(url);
	    sendToBridge(url, callback, moteServerAddress);
	} else {		
		console.log("Fling not sent because no anymote bridge IP is set.");
		window.alert(noMoteServerMessage);
		openOptionsPage();
	}    
}

function sendToBridge(url, callback, ip){
    //console.log(url);
    $.getJSON(url, function (data) {
        console.log(JSON.stringify(data));
        if (callback) callback(JSON.stringify(data));
        moteServerActive = true;

    }).fail(function () {            
        console.log("No response.");
        if (callback) callback("error");
        moteServerActive = false;

    }).error(function() {            
        console.log("Error.");
        if (callback) callback("error");
        moteServerActive = false;

    });
}

function sendFling(uri){
    if(!anyMotePluginActive) { //MoteBridge
        sendMBridgeFling(uri, function(res){
        	if(res == "error") window.alert("Fling not sent because Anymote bridge didn't respond.");
        });
    } else {                   //AnyMote
    	if(anymoteSessionActive) {
			sendAnymoteFling(uri);
			flashBadge();
		} else {
			console.log("Fling not sent because no anymote session is active.");
			window.alert(notConnectedMessage);
			openOptionsPage();
		}
        
    }    
}

var adsJson = [{"url":"http://chromemote.com/support-us/", "img":"../ads/ad_1.png"}];
if( localStorage.getItem("ad_list")!= null ) {
	adsJson = localStorage.getItem("ad_list");
}