var isInstalledNode = document.createElement('div');
isInstalledNode.id = 'extension-is-installed';
document.body.appendChild(isInstalledNode);
var appVersion = '0';

//connect to the background script
var port = chrome.extension.connect();
var sendMessage = function() {	
	var notification = { getVersion: 'appVersion' };		
	chrome.extension.sendMessage(notification, function(responseMessage) {
		// message coming back from content script
		console.log(responseMessage);
		appVersion = responseMessage;
				
		document.getElementById('extension-is-installed').innerHTML = appVersion;
		document.getElementById('extension-is-installed').style.visibility = 'hidden';
		
		if ( document.getElementById('installed-version') )	{
			document.getElementById('installed-version').innerHTML = appVersion;			
			var latestVersion = document.getElementById('latest-version').innerHTML;
			if(latestVersion > appVersion) document.getElementById('installed-version').style.color='red';
			else document.getElementById('installed-version').style.color='green';
		}
	});
};
sendMessage();