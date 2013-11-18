/*
 * Copyright (C) 2012 Google Inc.  All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Controls the pairingSession object.  The pairingSession object is created by
 * the googletvremote plugin during initialization.  The Pairing session is
 * used to make a secure connection with a Google TV.  This client program has
 * a 512 byte certificate that is sent to the Google TV and the Google TV issues
 * a 4 character challenge to this client.  If the client issues the correct
 * response the Google TV will consider the client with this certificate paired.
 * Once paired an Anymote session can be started for communication.
 * Pairing session functions include:
 *     pair(name, host, port, callback)
 *     setChallengeResponse(response)
 *     cancel()
 */


/** Pairing session object that this controller manages. */
var pairingSession = backgroundPageWindow.pairingSession;


var challengeAccepted = false;
var challengeResponseAccepted = false;


/**
 * Attempts to pair with a Google TV at this ip address.  Upon sending a pair
 * request the session should receive events for SESSION_CREATED then
 * PERFORM_INPUT.  Once in the PERFORM_INPUT start the client should send a
 * challenge response.  If the challenge is correct a pairing will be made.
 * After a pairing is made a client must start an Anymote session to begin
 * actual communication.  The pairing session is only for pairing.
 * @param {string} googleTvIpAddress Ip address of the Google TV.
 */
var pairingSessionPair = function(googleTvName, googleTvIpAddress) {
	
    challengeAccepted = false;
    challengeResponseAccepted = false;
  
  pairingSession.pair('Chromemote', googleTvIpAddress, 9551 + 1,
    function(e) {
  switch (e.type) {
    case googletvremote.pairing.EventType.NETWORK_ERROR:
	  challengeResponseAccepted = false;
	  console.log('Received Pairing session event... INVALID');
      backgroundPageWindow.console.log('Received Pairing session event... INVALID');
      break;
    case googletvremote.pairing.EventType.SESSION_CREATED:
      backgroundPageWindow.console.log('Received Pairing session event... SESSION_CREATED');

      break;
    case googletvremote.pairing.EventType.SESSION_ENDED:
      backgroundPageWindow.console.log('Received Pairing session event... SESSION_ENDED');
      console.log('Received Pairing session event... SESSION_ENDED');
      //window.closePinDialogBox();
      break;
    case googletvremote.pairing.EventType.PERFORM_INPUT:
      backgroundPageWindow.console.log('Received Pairing session event... PERFORM_INPUT');
      console.log('Google TV issued a pairing challenge.');
      challengeAccepted = true;
            
      break;
    case googletvremote.pairing.EventType.SUCCESS:
      
      challengeResponseAccepted = true;
      //closePinDialogBox();
      // DONE: Save paired device here.
      var pairedDevices = [];
      var devicesInStorage = localStorage.getItem(STORAGE_KEY_PAIRED_DEVICES);
      if (devicesInStorage) {
          pairedDevices = JSON.parse(devicesInStorage);
      }
      
      for (var i=0; i < pairedDevices.length; i++)
      {
    	  var fields        	  = pairedDevices[i].split('~');
    	  var deviceName    	  = fields[0];
    	  var deviceAddress 	  = fields[1];
    	  if(deviceAddress == googleTvIpAddress)
    	  {
    		  pairedDevices[i] = googleTvName + '~' + googleTvIpAddress;
    		  localStorage.setItem(STORAGE_KEY_PAIRED_DEVICES, JSON.stringify(pairedDevices));
          //updatePairedDevicesList();  // Updates the UI in this demo page
    	  }    	  
    	  
      }
      
      if (pairedDevices.indexOf(googleTvName + '~' + googleTvIpAddress) == -1) {
          pairedDevices.unshift(googleTvName + '~' + googleTvIpAddress);  // Add to beginning of array
          localStorage.setItem(STORAGE_KEY_PAIRED_DEVICES, JSON.stringify(pairedDevices));
          //updatePairedDevicesList();  // Updates the UI in this demo page
      }

      
      stopDiscoveryClientTimerId = window.setTimeout(function() {
          
          anymoteStartSession(googleTvName + '~' + googleTvIpAddress,
                  function(e) {
                    if (e.type == googletvremote.anymote.EventType.CONNECTED) {
                      backgroundPageWindow.console.log('Successful Anymote session connection.');

                    } else {
                      backgroundPageWindow.console.log('Unsuccessful Anymote session connection.');
                    }
                  });
          //enableKeyBoardEvents();
          //window.addDevice(googleTvName, googleTvIpAddress, false);
          //closeConnectMan();
          
      }, 1000);  // Auto stop discovery after 5-10 seconds.
      
      
      
   	  break;
    case googletvremote.pairing.EventType.CANCELLED:
      backgroundPageWindow.console.log('Received Pairing session event... CANCELLED');
      //window.closePinDialogBox();
      break;
    case googletvremote.pairing.EventType.ERROR:
      backgroundPageWindow.console.log('Received Pairing session event... ERROR');
      console.log('Pairing error ' +
      googletvremote.pairing.ErrorCodeStrings[e.errorCode] +
      ' with ' + googleTvIpAddress);
      break;      
    
      
    }
  });
  

  
  
};


/**
 * Send a response to the Google TV's challenge.  The 4 character pin should be
 * displaying on the Google TV when this message is sent.
 * @param {string} challengeValue The 4 character challenge value (hexidecimal)
 *     to send to the Google TV to complete pairing.
 */
var sendChallengeResponse = function(challengeValue) {
	
	pairingSession.setChallengeResponse(challengeValue)


};

var wasChallengeResponseAccepted = function(){
	
	return challengeResponseAccepted;
};

var wasChallengeAccepted = function(){
	
	return challengeAccepted;
};

var cancelChallengeResponse = function() {
	
	pairingSession.cancel();
	
};

