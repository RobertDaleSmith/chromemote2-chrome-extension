/** Anymote session object that this controller manages. */
var anymoteSession = backgroundPageWindow.anymoteSession;

/** Array of ip addresses loaded from localStorage that have already paired. */
var pairedDevices = backgroundPageWindow.pairedDevices;

/** Index used when traversing through the list of paired devices. */
var deviceIndex = backgroundPageWindow.deviceIndex;


/**
 * Start an Anymote session to communicate with Google TV. Before starting an
 * Anymote session, the Google TV at this ip address must already be paired.
 */
var anymoteStartSession = function(gtvDevice, response) {
  // DONE: Set a timeout that will trigger if there is no reply from the TV.
  var anymoteSessionTimeout = window.setTimeout(function() {
    console.log('Timeout starting Anymote session with ' + gtvDevice.name + ' at ' + gtvDevice.address);
    //document.body.className = '';
    response({type: googletvremote.anymote.EventType.ERROR});
  }, 2000);

  // DONE: Stop the old session if one is already running.
  anymoteSession.stopSession();  // No harm if there is no active connection.

  // DONE: Start an Anymote session.
  //sendGAEvent("Connection", "AnymoteSession");

  //var deviceName    = "test";
  //var deviceAddress = googleTvIpAddress;

  if(gtvDevice.address) {
	  deviceName  	= gtvDevice.name;
	  deviceAddress = gtvDevice.address;
  }
 
  
  anymoteSession.startSession('Chromemote', 1, deviceAddress, 9551, // Note, assuming the Anymote port is 9551, but in a real app you
      // should use the servicePort returned by the discovery client.
      function(e) {
        switch (e.type) {
          case googletvremote.anymote.EventType.INVALID:
            backgroundPageWindow.console.log('Received Anymote session event... INVALID');
            break;
          case googletvremote.anymote.EventType.CONNECTED:
        	
        	//enableKeyBoardEvents();
        	//setIndicatorConnected();
            backgroundPageWindow.console.log('Received Anymote session event... CONNECTED');
            backgroundPageWindow.anymoteSessionActive = true;
            
            window.clearTimeout(anymoteSessionTimeout);
            
            var shortDeviceName = deviceName;
            var maxNameLength = 20;
            
        		if(deviceName.length > maxNameLength)
        		{
        			shortDeviceName = deviceName.substring(0, maxNameLength) + "...";
        		}
    			
            
            addDeviceFound(gtvDevice.name, gtvDevice.address, true, true);
            console.log('Successful connection to ' + shortDeviceName + ' at ' + deviceAddress);
    		    console.log('Connected');
            
            backgroundPageWindow.connectedDevice = deviceAddress;

		  	    //moveDeviceToFront(deviceAddress);
  		  	
            chrome.browserAction.setIcon({path:"images/icons/icon19.png"});
            
            console.log(deviceName);
            // Make sure this device is at the top of the paired device list.
            // pairedDevices = [];


            // if(localStorage.getItem(STORAGE_KEY_PAIRED_DEVICES)) devicesInStorage = localStorage.getItem(STORAGE_KEY_PAIRED_DEVICES);
            // else devicesInStorage = "[]";

            
            // pairedDevices = JSON.parse( devicesInStorage );
            
            // //console.dir(pairedDevices);
            // //console.dir(gtvDevice);

            // var indexOfDevice = pairedDevices.indexOf( gtvDevice );
            // if (indexOfDevice == -1) {
            //   // Somehow this device was missing.  Add it to the list.
            //   //pairedDevices.unshift( gtvDevice );  // Adds to beginning.
            //   //localStorage.setItem(STORAGE_KEY_PAIRED_DEVICES, JSON.stringify(pairedDevices));
            //   //updatePairedDevicesList();
            // } else if (indexOfDevice != 0) {
            //   // Move this device into the first slot.
            //   //pairedDevices.splice(indexOfDevice, 1); // Remove.
            //   //pairedDevices.unshift( gtvDevice ); // Add to beginning.
            //   //localStorage.setItem(STORAGE_KEY_PAIRED_DEVICES, JSON.stringify(pairedDevices));
            //   //updatePairedDevicesList();
            // }
            response({type: googletvremote.anymote.EventType.CONNECTED});
            
            break;
          case googletvremote.anymote.EventType.ACK:
            backgroundPageWindow.console.log('Received Anymote session event... ACK');
            backgroundPageWindow.anymoteSessionActive = true;
            backgroundPageWindow.pingAck = true;
            console.log('Ping ACK.'); // Response to sendPing.
            break;
          case googletvremote.anymote.EventType.DATA:
            backgroundPageWindow.console.log('Received Anymote session event... DATA');
            break;
          case googletvremote.anymote.EventType.DATALIST:
            backgroundPageWindow.console.log('Received Anymote session event... DATALIST');
            break;
          case googletvremote.anymote.EventType.FLINGRESULT:
            backgroundPageWindow.console.log('Received Anymote session event... FLINGRESULT');
            if (e.success) {
              backgroundPageWindow.console.log('Successful fling for sequence = ' + e.sequence);
              console.log('Fling result successful');
            }
            break;
          case googletvremote.anymote.EventType.ERROR:
            backgroundPageWindow.console.log('Received Anymote session event... ERROR');
//            console.log('Anymote error ' +
//                googletvremote.anymote.ErrorCodeStrings[e.errorCode] +
//                ' with ' + gtvDevice);
            backgroundPageWindow.console.log('Anymote error ' +
                googletvremote.anymote.ErrorCodeStrings[e.errorCode] +
                ' with ' + gtvDevice.name + ' at ' + gtvDevice.address);
            if (e.errorCode == googletvremote.anymote.ErrorCode.NOTPAIRED) {
              // Note, often you don't get an ERROR just a timeout.
              window.clearTimeout(anymoteSessionTimeout);
              //document.body.className = '';
              response({type: googletvremote.anymote.EventType.ERROR});
            }
            break;
        }
      });
};

/** Go through the paired device list and attempt to start Anymote sessions. */
var anymoteConnectToExistingDevice = function() {
  // DONE: Pull the paired device list from localStorage

  if(localStorage.getItem(STORAGE_KEY_PAIRED_DEVICES)) devicesInStorage = localStorage.getItem(STORAGE_KEY_PAIRED_DEVICES);
  else devicesInStorage = "[]";
  
  if (devicesInStorage != "[]") {
    deviceIndex = 0; // Try the first paired device then move through the list.
    pairedDevices = JSON.parse(devicesInStorage);
    var gtvDevice = pairedDevices[deviceIndex];
    // DONE: Attempt to pair with the device in index 0
    // DONE: Set a callback that will try the next device if this one fails.
    anymoteStartSession(gtvDevice, anymoteExistingDeviceResponseHandler);
    console.log('Paring to ' + gtvDevice.name + ' at ' + gtvDevice.address);
    
  } else {
     console.log('No devices have been paired yet');
  }
};

/**
 * Calls the next device in the list if this device failed.
 */
var anymoteExistingDeviceResponseHandler = function(e) {
  // If the type is googletvremote.anymote.EventType.CONNECTED you are done.
  // DONE: Otherwise attempt to connect using the next device in the array.
  if (e.type == googletvremote.anymote.EventType.CONNECTED) {
    deviceIndex = -1; // Reset index. Well done on your successful connection.
    //closeConnectMan();
    stopDiscoveryClient();
    return;
  } else {
    // Try the next device in the list if there are more.
    deviceIndex++;
    if (deviceIndex < pairedDevices.length) {
      backgroundPageWindow.console.log('Device ' + pairedDevices[deviceIndex - 1] + ' failed. ' +
          'Attempting to connect to device ' + pairedDevices[deviceIndex]);
      anymoteStartSession(pairedDevices[deviceIndex], anymoteExistingDeviceResponseHandler);
    } else {
      console.log('Unable to establish an existing connection');
    }
  }
};

/**
 * Sends an Anymote key event to Google TV.  See the googletvremote_constants
 * for a complete list of keycode values.
 */
var sendAnymoteKeyBoardEvent = function(keycode) {
  anymoteSession.sendKeyEvent(keycode, googletvremote.anymote.Action.DOWN);
  anymoteSession.sendKeyEvent(keycode, googletvremote.anymote.Action.UP);
  
};

var sendAnymoteKeyEvent = function(keycode, keyDown) {
	
	if (keyDown)
		anymoteSession.sendKeyEvent(keycode, googletvremote.anymote.Action.DOWN);
	else
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

/** Sends a ping to the Google TV. Used to test connection status. */
var sendAnymotePing = function() {
  anymoteSession.sendPing();
};

var sendAnymoteMouseMove = function(xDelta,yDelta) {
  anymoteSession.sendMouseMove(xDelta,yDelta);
};

var sendAnymoteMouseWheel = function(xScroll,yScroll) {
  anymoteSession.sendMouseWheel(xScroll,yScroll);
};

var recentIpConnectedTo = "";
var devicesInStorage = "[]";
if( localStorage.getItem(STORAGE_KEY_PAIRED_DEVICES) ) devicesInStorage = localStorage.getItem(STORAGE_KEY_PAIRED_DEVICES);

var anymoteConnectToExistingSingleDevice = function(ipAddress) {

  recentIpConnectedTo = ipAddress;
	// DONE: Pull the paired device list from localStorage
    if(localStorage.getItem(STORAGE_KEY_PAIRED_DEVICES)) devicesInStorage = localStorage.getItem(STORAGE_KEY_PAIRED_DEVICES);
    else devicesInStorage = "[]";
    
    if (localStorage.getItem(STORAGE_KEY_PAIRED_DEVICES)) {
	    //deviceIndex = 0; // Try the first paired device then move through the list.
	    
		  for(deviceIndex = 0; deviceIndex < pairedDevices.length-1; deviceIndex++) {
  			deviceName    	  = pairedDevices[deviceIndex].name;
  			deviceAddress 	  = pairedDevices[deviceIndex].address;
	    	if (deviceAddress == ipAddress) {
	    		console.log(deviceAddress + ' ' + ipAddress);
	    		break;
	    	}
	    }
      		
	    pairedDevices = JSON.parse(devicesInStorage);
	    var gtvDevice = pairedDevices[deviceIndex];
	    // DONE: Attempt to pair with the device in index 0
	    // DONE: Set a callback that will try the next device if this one fails.
	    anymoteStartSession(pairedDevices[deviceIndex], anymoteExistingSingleDeviceResponseHandler);
	  } else {
		  console.log('No devices have been paired yet');
	  }
};

var anymoteExistingSingleDeviceResponseHandler = function(e) {
  // If the type is googletvremote.anymote.EventType.CONNECTED you are done.
  // DONE: Otherwise attempt to connect using the next device in the array.
  if (e.type == googletvremote.anymote.EventType.CONNECTED) {		
    console.log('Established an existing connection to ' + recentIpConnectedTo);
    setDevicesStatusLabel("Connected to " + recentIpConnectedTo, true);
    showOptionsPanel(false);
    stopDiscoveryClient();
  } else {
    setDevicesStatusLabel("Unable to connect", true);
    console.log('Unable to establish an existing connection');
  }
};
