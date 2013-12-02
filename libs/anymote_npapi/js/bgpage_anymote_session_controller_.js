var STORAGE_KEY_PAIRED_DEVICES = 'paired_devices';

var anymoteSessionActive = false;

var pingAck = false;

/** Array of ip addresses loaded from localStorage that have already paired. */
var pairedDevices = [];

/** Index used when traversing through the list of paired devices. */
var deviceIndex = 0;

/**
 * Start an Anymote session to communicate with Google TV. Before starting an
 * Anymote session, the Google TV at this ip address must already be paired.
 */
var anymoteStartSession = function(gtvDevice, response) {
  // DONE: Set a timeout that will trigger if there is no reply from the TV.
  var anymoteSessionTimeout = window.setTimeout(function() {
    //Window.alert('Timeout starting Anymote session with ' + googleTvIpAddress);
    document.body.className = '';
    response({type: googletvremote.anymote.EventType.ERROR});
  }, 2000);

  // DONE: Stop the old session if one is already running.
  anymoteSession.stopSession();  // No harm if there is no active connection.

  // DONE: Start an Anymote session.
  

  // var deviceName    = "test";
  // var deviceAddress = googleTvIpAddress;

  if(gtvDevice.address) {
    deviceName    = gtvDevice.name;
    deviceAddress = gtvDevice.address;
  }
    
  
  anymoteSession.startSession('Chromemote', 1, deviceAddress, 9551, // Note, assuming the Anymote port is 9551, but in a real app you
      // should use the servicePort returned by the discovery client.
      function(e) {
        switch (e.type) {
          case googletvremote.anymote.EventType.INVALID:
            console.log('Received Anymote session event... INVALID');
            break;
          case googletvremote.anymote.EventType.CONNECTED:
        	  //enableKeyBoardEvents();
        	  
            console.log('Received Anymote session event... CONNECTED');
            anymoteSessionActive = true;
            //addOneToBadge();
            
            window.clearTimeout(anymoteSessionTimeout);
            //alert('Successful connection to <br>' + deviceName + ' at ' + deviceAddress);
            
            connectedDevice = deviceAddress;
            
            chrome.browserAction.setIcon({path:"images/icons/icon19.png"});
            // Make sure this device is at the top of the paired device list.
            pairedDevices = [];
            var devicesInStorage = localStorage.getItem(STORAGE_KEY_PAIRED_DEVICES);
            if (devicesInStorage) pairedDevices = JSON.parse(devicesInStorage);
            
            var indexOfDevice = pairedDevices.indexOf( gtvDevice );
            if (indexOfDevice == -1) {
              // Somehow this device was missing.  Add it to the list.
              //pairedDevices.unshift(gtvDevice);  // Adds to beginning.
              //localStorage.setItem(STORAGE_KEY_PAIRED_DEVICES, JSON.stringify(pairedDevices));
              //updatePairedDevicesList();
            } else if (indexOfDevice != 0) {
              // Move this device into the first slot.
              //pairedDevices.splice(indexOfDevice, 1); // Remove.
              //pairedDevices.unshift(gtvDevice); // Add to beginning.
              //localStorage.setItem(STORAGE_KEY_PAIRED_DEVICES, JSON.stringify(pairedDevices));
              //updatePairedDevicesList();
            }
            response({type: googletvremote.anymote.EventType.CONNECTED});
            
            break;
          case googletvremote.anymote.EventType.ACK:
            console.log('Received Anymote session event... ACK');
            anymoteSessionActive = true;
            pingAck = true;
            //alert('Ping ACK.'); // Response to sendPing.
            break;
          case googletvremote.anymote.EventType.DATA:
            console.log('Received Anymote session event... DATA');
            break;
          case googletvremote.anymote.EventType.DATALIST:
            console.log('Received Anymote session event... DATALIST');
            break;
          case googletvremote.anymote.EventType.FLINGRESULT:
            console.log('Received Anymote session event... FLINGRESULT');
            if (e.success) {
              console.log('Successful fling for sequence = ' + e.sequence);
              //alert('Fling result successful');
            }
            break;
          case googletvremote.anymote.EventType.ERROR:
            console.log('Received Anymote session event... ERROR');
//            alert('Anymote error ' +
//                googletvremote.anymote.ErrorCodeStrings[e.errorCode] +
//                ' with ' + gtvDevice);
            console.log('Anymote error ' +
                googletvremote.anymote.ErrorCodeStrings[e.errorCode] +
                ' with ' + gtvDevice.name + " at " + gtvDevice.address);
            if (e.errorCode == googletvremote.anymote.ErrorCode.NOTPAIRED) {
              // Note, often you don't get an ERROR just a timeout.
              window.clearTimeout(anymoteSessionTimeout);
              document.body.className = '';
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
    //stopDiscoveryClient();
    return;
  } else {
    // Try the next device in the list if there are more.
    deviceIndex++;
    if (deviceIndex < pairedDevices.length) {
      console.log('Device ' + pairedDevices[deviceIndex - 1] + ' failed. ' +
          'Attempting to connect to device ' + pairedDevices[deviceIndex]);
      anymoteStartSession(pairedDevices[deviceIndex],
          anymoteExistingDeviceResponseHandler);
    } else {
      //alert('Unable to establish an existing connection');
    }
  }
};



