
var appVersion = "", //chrome.i18n.getMessage("version"),
	connectedDeviceCount = 0,
	TvPluginLoaded = false,
	gTvPluginLoaded = false;

window.onload = function() {

	chrome.browserAction.setIcon({path:"images/icons/icon19_grey.png"});

	googletvremoteInitializePlugin();
	
	loadGoogleTVConstants();
	
    window.anymoteConnectToExistingDevice();
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
	
	try
	{
		googletvremote = pluginEl.gtvremote.plugin.object.GTVRemote();
		
		googletvremote.init('');
		
		gTvPluginLoaded = true;

		console.log("NPAPI Plugin Loaded");
	}
	catch(err)
	{
		gTvPluginLoaded = false;
		
		
		
		console.log("ERROR:: GTVRemote Plugin is not detected.");
		
		if (osDetected == 'CrOS')
		{
			console.log("Chrome OS does not support the GTVRemote Plugin. Chromemote is not compatible with Google ChromeOS.");
		}
		else if (osDetected == 'Windows8')
		{
			console.log("ALERT:: Windows 8 app mode does not support the GTVRemote Plugin used by Chromemote.");
			console.log("ALERT:: Chromemote is only compatible with the desktop mode.");
			console.log("ALERT:: Relaunch Chrome on the desktop for GTVRemote Plugin support.");
		}
		else if (osDetected == 'Linux')
		{
			console.log("ALERT:: The GTVRemote Plugin for Linux currently only supports Chrome extensions on Ubuntu 12. Contact developer for details.");
		}
		else 
		{
			console.log("ALERT:: Chromemote is compatible with WindowsXP/Vista/7/8, Mac OS X 10.6+, and Linux Ubuntu 12.");
			console.log("ALERT:: Chromemote is not currently compatible with ChromeOS, Windows 8 app mode, or other versions of Linux besides Ubuntu 12.");
			console.log("ALERT:: If you see this message and your operating system is compatible, then please contact the developer. Visit www.chromemote.com");
		}
	}
	
	
	var cert = localStorage.getItem('cert');
    if (!cert || !googletvremote.loadCert(cert, 'password')) {
      // Change the 'password' to a unique string for your app.
      console.log('First launch.  Made a new certificate.');
      var uid = (((1 + Math.random()) * 0x10000000) | 0).toString(16);
      cert = googletvremote.generateSelfSignedCert('chrome-gtv-' + uid, 'password');
      localStorage.setItem('cert', cert);
      localStorage.removeItem(STORAGE_KEY_PAIRED_DEVICES);
    }
    
    window.discoveryClient = googletvremote.createDiscoveryClient();
    window.pairingSession  = googletvremote.createPairingSession();
    window.anymoteSession  = googletvremote.createAnymoteSession();
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