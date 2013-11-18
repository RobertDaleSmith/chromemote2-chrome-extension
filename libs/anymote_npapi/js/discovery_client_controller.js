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
 * Controls the discoveryClient object.  The discoveryClient object is created
 * by the googletvremote plugin during initialization.
 *
 * The discovery client searches for Anymote sessions on the local network.
 * This is the recommended way to find Google TV devices.  However some networks
 * may block the Discovery Client.  If that occurs you can attempt to pair with
 * a device by manually entering an IP address and assuming the Anymote port is
 * 9551.  Ideally the discovery client would determine the Anymote port, but all
 * existing Google TV's use port 9551, so that is a good guess if the discovery
 * client fails.  The discovery client functions include:
 *     startDiscovery(advertisedDeviceCallback, errorCallback)
 *     stopDiscovery()
 */


/** Discovery client object that this controller manages. */
var discoveryClient = backgroundPageWindow.discoveryClient;


/** Id of a timer that is used to automatically stop discovery. */
var stopDiscoveryClientTimerId;


/** Start searching for Anymote services advertised on the local network. */
var startDiscoveryClient = function() {
	
  backgroundPageWindow.console.log('Discovery session started.');
  discoveryClient.startDiscovery(function(advertisedDevice) {
	  
	  //window.addDevice(advertisedDevice.instanceName, advertisedDevice.address, true);
	  backgroundPageWindow.console.log('Device named ' + advertisedDevice.instanceName + ' at ' + advertisedDevice.address + ' discovered and added to device list.');
    
  }, function() {
	  
	  backgroundPageWindow.console.log('Error trying to start Discovery Session.');
	  
  });
  
  document.getElementById('start-discovery').style.display = 'none';
  
  //Set a timer to stop discover after a short time interval.
  stopDiscoveryClientTimerId = window.setTimeout(function() {
      stopDiscoveryClient();
      //document.getElementById('start-discovery').style.display = 'inline-block';
      backgroundPageWindow.console.log('Discovery session timed out.');
  }, 5000);  // Auto stop discovery after 5 seconds.
};


/** Stop searching for Anymote services advertised on the local network. */
var stopDiscoveryClient = function() {
 discoveryClient.stopDiscovery();
  window.clearTimeout(stopDiscoveryClientTimerId);
  
  document.getElementById('start-discovery').style.display = 'inline-block';
  backgroundPageWindow.console.log('Discovery session stopped.');
  //setDiscoveryLabel('');
};
