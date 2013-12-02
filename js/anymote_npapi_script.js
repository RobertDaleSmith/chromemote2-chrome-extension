//Chrome AnyMote API Stuff---------------------------
var anyMotePluginActive = true;

/** Key used by localStorage to store ip addresses of paired Google TVs. */
var STORAGE_KEY_PAIRED_DEVICES = 'paired_devices';

function checkIfConnectionIsActive() {
    console.log('Checking if Anymote session is still connected.');

    if(backgroundPageWindow.anymoteSessionActive)
    {
        backgroundPageWindow.pingAck = false;
        anymoteSession.sendPing();
        var timer = window.setTimeout(function() {
            //if(!backgroundPageWindow.pingAck)
                anymoteConnectToExistingDevice();
        }, 500); 
    }
}

function initAnyMoteNPAPI(){
    /* GTV NPAPI PLUMBING */
    googletvremoteInitializePlugin();

    setTimeout(function() {
        if(!backgroundPageWindow.anymoteSessionActive) {
            console.log('Discovering...');
            startDiscoveryClient();
            if (!devices_options_active) $("#options_button_devices").click();

            //setIndicatorDisconnected();            
        } else {
            
            //enableKeyBoardEvents();
            //setIndicatorConnected();
        }

        if(localStorage.getItem(STORAGE_KEY_PAIRED_DEVICES)) devicesInStorage = localStorage.getItem(STORAGE_KEY_PAIRED_DEVICES);
        else devicesInStorage = "[]";
        var devicesInStorageJSON = JSON.parse( devicesInStorage );
        for(var i = 0; i < devicesInStorageJSON.length; i++) { addDeviceFound(devicesInStorageJSON[i].name, devicesInStorageJSON[i].address, false, true); }
    }, 500);
    
    
    

    checkIfConnectionIsActive();

    if (backgroundPageWindow.gTvPluginLoaded == false) console.log('Plug-in Not Detected');
}
    


window.onunload = function() {
    if(!isInPopUpMode) backgroundPageWindow.console.log('Chromemote Full Tab Mode closed.');
    else backgroundPageWindow.console.log('Chromemote Pop-up Mode closed.');
    stopDiscoveryClient();
    cancelChallengeResponse();
}

window.onerror = function() {
    backgroundPageWindow.console.log('JavaScript error found.');
    //sendGAEvent("Error", "JavaScript");
    // try {
    //     backgroundPageWindow.console.log('Checking if embed object has crashed.');
    //     anymoteSession.sendPing();
    // }
    // catch(e) {
    //      //catch and just suppress error
    //     //sendGAEvent("Error", "JavaScript", "Message", e.message);
    //     backgroundPageWindow.console.log('GTV plumbing embed plugin may have crashed. Error message was: ' + e.message);
    //     backgroundPageWindow.console.log('Restarting GTV plumbing.');
    //     backgroundPageWindow.googletvremoteInitializePlugin();
    //     googletvremoteInitializePlugin();
    //     backgroundPageWindow.anymoteSessionActive = false;
    //     anymoteConnectToExistingDevice();
    // }
    
}