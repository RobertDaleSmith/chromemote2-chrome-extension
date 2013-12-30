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
 * Creates the embed element and calls the one and only function on the plugin
 *   <plugin element>.gtvremote.plugin.object.GTVRemote();
 * That returns an googletvremote object which has 6 functions:
 *   init(localAddress)
 *   loadCert(pemKeyCertificate, privateKeyPassword)
 *   generateSelfSignedCert(privateKeyPassword)
 *   createDiscoveryClient()
 *   createPairingSession()
 *   createAnymoteSession()
 * Using the created objects is handled by an associated controller.
 *   discovery_client_controller.js
 *   pairing_session_controller.js
 *   anymote_session_controller.js
 */

/**
 * Creates the plugin embed, calls the one plugin method to create the
 * googletvremote. Initialize and load the 512 byte certificate, then
 * creates the three controls used for communication.
 *   Discovery client - Used to find Google TV's on the local network.
 *   Pairing session - Used to securely pair with a Google TV.
 *   Anymote session - Used to communicate with a paired Google TV.
 */
 
 var googletvremoteInitializePlugin = function() {
	var googletvremote = backgroundPageWindow.googletvremote;
	discoveryClient= backgroundPageWindow.discoveryClient;
	pairingSession = backgroundPageWindow.pairingSession;
	anymoteSession = backgroundPageWindow.anymoteSession;
	//backgroundPageWindow.console.log('Pop up connected to Google TV Remote Plumbing Plugin on the Background Page.');
}
