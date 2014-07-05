var currentTime = document.createElement('div');
currentTime.setAttribute('id', 'currentTimeHolder');
currentTime.setAttribute('time', '0');
document.body.appendChild(currentTime);

//connect to the background script
var port = chrome.extension.connect();
var host = document.location.host,
 urlpath = document.location.pathname,
     url = document.location.origin + '/watch' + document.location.search;

var flingIconPath = document.createElement('div');
flingIconPath.setAttribute('id', 'flingIconPathHolder');
flingIconPath.setAttribute('flingIconPath', chrome.extension.getURL('images/yt_fling_icon.png'));
document.body.appendChild(flingIconPath);
			
var mainInject = function() {
//---
	cmf = {
		vars: function() {		
			cmf.player = null;		
			cmf.setEventloaded = false;		
		},
		setOnload: function () {
			if(document.getElementById('watch7-container')) {			
				//console.log('[Chromemote Flinger] YouTube in new style');
			}
			try {	
				cmf.player = cmf.get('player');
			} catch (e) {
			
			} finally {
				cmf.getReady();
				//console.log('getReady()');
			}
		},
		check: function (c) {
			switch (c) {
				case 'playlistExist': return ( !isNaN(Number(yt.config_.PLAYLIST_BAR_PLAYING_INDEX)) && Number(yt.config_.PLAYLIST_BAR_PLAYING_INDEX) != -1 );
				case 'playlistAutoPlay': return (yt.config_.LIST_AUTO_PLAY_ON == true);		
			}
		},
		get: function (c) {
			switch (c) {
				case 'player': return cmf.player = window.yt.config_.PLAYER_REFERENCE;
				case 'currenttime': return  (cmf.player.getCurrentTime != undefined) ? cmf.player.getCurrentTime() : false;
				case 'duration': return (cmf.player.getDuration != undefined) ? cmf.player.getDuration() : false;
				case 'playerstate': return (cmf.player.getPlayerState != undefined) ? cmf.player.getPlayerState() : false;
			}
		},	
		setBtn: function() {

			var iconUrl = document.getElementById('flingIconPathHolder').getAttribute('flingIconPath');
			var injectedHTML = '<span><button onclick=";return false;" id="watch-fling" eventSet="false" type="button" title="Fling this with Chromemote" class="yt-uix-button yt-uix-button-text yt-uix-button-size-default yt-uix-button-has-icon yt-uix-tooltip yt-uix-button-empty" data-orientation="vertical" data-force-position="true" data-button-toggle="true" data-position="bottomright" role="button" data-tooltip-text="Fling this with Chromemote"><span class="yt-uix-button-icon-wrapper"><img class="yt-uix-button-icon yt-uix-button-icon-watch-fling" src="' + iconUrl + '" alt="Fling this with Chromemote" title="" style="margin-top:-1px; margin-right: 8px;"></span><span class="yt-uix-button-content">Fling </span></button></span>';
			document.getElementById("watch-like-dislike-buttons").insertAdjacentHTML('beforeend', injectedHTML);
			
			document.getElementById("watch-fling").addEventListener ('click', cmf.btnAction);
			cmf.btn = document.getElementById('watch-fling');

		},
		btnClick: function (s) { 
			//console.log('[flinger] Button Click - Done'); return cmf.btn.click(); 
		},
		btnDisplay: function () {
			
		},
		btnAction: function () {		
			playerState = cmf.get('playerstate');
			currentTime = cmf.get('currenttime');
			//console.log(playerState);
			if ( playerState == 1 ) { cmf.player.pauseVideo(); }//Pause Video if it is playing.
			if ( playerState == 0 ) { currentTime = 0; }//Reset the current time if Video has ended.
					
			document.getElementById('currentTimeHolder').setAttribute( 'time', currentTime );
			
			return;		
		},		
		onStateChange: function () {
			cmf.player = cmf.get('player');
		},
		setEvent: function () {
			cmf.player = cmf.get('player');
			try {
				cmf.setEventloaded = true;
				cmf.player.addEventListener('onStateChange', cmf.onStateChange);			
			} catch (e) {
				setTimeout(cmf.setEvent, 500);
			}
		},		
		getReady: function () {
			try {
				if (cmf.player==null) cmf.player = cmf.get('player');
				//&&
				if (cmf.btn==null) {
					cmf.setBtn();

					setInterval(function(){
						if(document.getElementById("watch-fling")) {
							//console.log("FOUND");
						} else {
							//console.log("NOT FOUND");  
							cmf.setBtn();
						}
					},1000);
				}
				//console.log('getReady() inside');
			} catch (e) {
				console.debug('[Flinger] getReady - Error: '+e.message);
			} finally {
				if(cmf.setEventloaded == false) cmf.setEvent();
			}
			return;	
		},

	};
	cmf.vars(); 
	cmf.setOnload();
//---
};

function inject(func) {
	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.appendChild(document.createTextNode("var chromePage = \""+chrome.extension.getURL('')+"\";\n var inIncognito = "+chrome.extension.inIncognitoContext+";\n(" + func + ")();"));
	document.body.appendChild(script);
};

if (host.substr(host.length - 11) == 'youtube.com' && host != 'm.youtube.com'){ inject(mainInject); }

setInterval(function(){
	if(document.getElementById("watch-fling")) {
		if(document.getElementById("watch-fling").getAttribute("eventSet") == "true") {
			//console.log("event is already set");
		} else {
			//console.log("setting event");  
			initFlingBtnEvent();
			document.getElementById("watch-fling").setAttribute("eventSet","true");
		}
	}
},1000);

console.log('Chrome is in Incognito mode: '+chrome.extension.inIncognitoContext);

function initFlingBtnEvent() {
	host    = document.location.host,
 	urlpath = document.location.pathname,
    url 	= document.location.origin + '/watch' + document.location.search;

	document.getElementById("watch-fling").addEventListener('click',function() {
		sendMessage();
		//console.log("FLING BUTTON PRESSED!");
		setTimeout(function(){ document.getElementById("watch-fling").blur(); },500);		
	});
};

function sendMessage() {	
	var currentTimeSeconds = document.getElementById('currentTimeHolder').getAttribute('time');	
	currentTimeSeconds = currentTimeSeconds - (currentTimeSeconds % 1);
	var notification = { flingurl: url + '#t=' + currentTimeSeconds + 's' };	
	chrome.extension.sendMessage(notification, function(responseMessage) {
		// message coming back from content script
		// console.log(responseMessage);
	});	
};