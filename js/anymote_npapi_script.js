//Chrome AnyMote API Stuff---------------------------




/** Key used by localStorage to store ip addresses of paired Google TVs. */
var STORAGE_KEY_PAIRED_DEVICES = 'paired_devices';

function checkIfConnectionIsActive() {
    console.log('Checking if Anymote session is still connected.');

    if(backgroundPageWindow.anymoteSessionActive)
    {
        backgroundPageWindow.pingAck = false;
        anymoteSession.sendPing();
        var timer = window.setTimeout(function() {
            if(anyMotePluginActive)
                anymoteConnectToExistingDevice();
        }, 500); 
    }
}

function initAnyMoteNPAPI(){
    /* GTV NPAPI PLUMBING */
    googletvremoteInitializePlugin();

    if(localStorage.getItem(STORAGE_KEY_PAIRED_DEVICES)) devicesInStorage = localStorage.getItem(STORAGE_KEY_PAIRED_DEVICES);
    else devicesInStorage = "[]";
    var devicesInStorageJSON = JSON.parse( devicesInStorage );
    for(var i = 0; i < devicesInStorageJSON.length; i++) { addDeviceFound(devicesInStorageJSON[i].name, devicesInStorageJSON[i].address, false, true); }

    setTimeout(function() {
        if(!backgroundPageWindow.anymoteSessionActive) {
            console.log('Discovering...');
            runDiscovery();
            if (!devices_options_active && anyMotePluginActive) $("#options_button_devices").click();

            //setIndicatorDisconnected();            
        } else {
            
            //enableKeyBoardEvents();
            //setIndicatorConnected();
        }        
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

window.onerror = function(e) {
    backgroundPageWindow.console.log('JavaScript error found.' + e);
    console.log(e);
    //sendGAEvent("Error", "JavaScript");
    try {
        backgroundPageWindow.console.log('Checking if embed object has crashed.');
        anymoteSession.sendPing();
    }
    catch(e) {
         //catch and just suppress error
        //sendGAEvent("Error", "JavaScript", "Message", e.message);
        backgroundPageWindow.console.log('GTV plumbing embed plugin may have crashed. Error message was: ' + e.message);
        backgroundPageWindow.console.log('Restarting GTV plumbing.');
        backgroundPageWindow.googletvremoteInitializePlugin();
        googletvremoteInitializePlugin();
        backgroundPageWindow.anymoteSessionActive = false;
        anymoteConnectToExistingDevice();
    }
    
}



var sendKeyEvent = function(keyCode, keyDown) {
    
    keyCode = keyCode.toUpperCase().replaceAll("KEYCODE_","");

    if(backgroundPageWindow.anymoteSessionActive)
    {
        //console.log(keyCode);
        switch (keyCode)
        {
            case 'SOFT_LEFT': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.SOFT_LEFT, keyDown);
                break;
            case 'SOFT_RIGHT': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.SOFT_RIGHT, keyDown);
                break;
            case 'HOME': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.HOME, keyDown);
                break;
            case 'BACK': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.BACK, keyDown);
                break;
            case 'CALL': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.CALL, keyDown);
                break;
            case 'NUM0': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUM0, keyDown);
                break;
            case 'NUM1': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUM1, keyDown);
                break;
            case 'NUM2': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUM2, keyDown);
                break;
            case 'NUM3': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUM3, keyDown);
                break;
            case 'NUM4': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUM4, keyDown);
                break;
            case 'NUM5': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUM5, keyDown);
                break;
            case 'NUM6': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUM6, keyDown);
                break;
            case 'NUM7': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUM7, keyDown);
                break;
            case 'NUM8': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUM8, keyDown);
                break;
            case 'NUM9': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUM9, keyDown);
                break;
            case 'STAR': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.STAR, keyDown);
                break;
            case 'POUND': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.POUND, keyDown);
                break;
            case 'DPAD_UP': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.DPAD_UP, keyDown);
                break;
            case 'DPAD_DOWN': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.DPAD_DOWN, keyDown);
                break;
            case 'DPAD_LEFT': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.DPAD_LEFT, keyDown);
                break;
            case 'DPAD_RIGHT': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.DPAD_RIGHT, keyDown);
                break;
            case 'DPAD_CENTER': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.DPAD_CENTER, keyDown);
                break;
            case 'VOLUME_UP': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.VOLUME_UP, keyDown);
                break;
            case 'VOLUME_DOWN': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.VOLUME_DOWN, keyDown);
                break;
            case 'POWER': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.POWER, keyDown);
                break;
            case 'CAMERA': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.CAMERA, keyDown);
                break;
            case 'A': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.A, keyDown);
                break;
            case 'B': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.B, keyDown);
                break;
            case 'C': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.C, keyDown);
                break;
            case 'D': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.D, keyDown);
                break;
            case 'E': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.E, keyDown);
                break;
            case 'F': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.F, keyDown);
                break;
            case 'G': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.G, keyDown);
                break;
            case 'H': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.H, keyDown);
                break;
            case 'I': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.I, keyDown);
                break;
            case 'J': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.J, keyDown);
                break;
            case 'K': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.K, keyDown);
                break;
            case 'L': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.L, keyDown);
                break;
            case 'M': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.M, keyDown);
                break;
            case 'N': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.N, keyDown);
                break;
            case 'O': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.O, keyDown);
                break;
            case 'P': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.P, keyDown);
                break;
            case 'Q': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.Q, keyDown);
                break;
            case 'R': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.R, keyDown);
                break;
            case 'S': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.S, keyDown);
                break;
            case 'T': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.T, keyDown);
                break;
            case 'U': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.U, keyDown);
                break;
            case 'V': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.V, keyDown);
                break;
            case 'W': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.W, keyDown);
                break;
            case 'X': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.X, keyDown);
                break;
            case 'Y': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.Y, keyDown);
                break;
            case 'Z': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.Z, keyDown);
                break;
            case 'COMMA': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.COMMA, keyDown);
                break;
            case 'PERIOD': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.PERIOD, keyDown);
                break;
            case 'ALT_LEFT': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.ALT_LEFT, keyDown);
                break;
            case 'ALT_RIGHT': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.ALT_RIGHT, keyDown);
                break;
            case 'SHIFT_LEFT': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.SHIFT_LEFT, keyDown);
                break;
            case 'SHIFT_RIGHT': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.SHIFT_RIGHT, keyDown);
                break;
            case 'TAB': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.TAB, keyDown);
                break;
            case 'SPACE': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.SPACE, keyDown);
                break;
            case 'EXPLORER': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.EXPLORER, keyDown);
                break;
            case 'ENTER': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.ENTER, keyDown);
                break;
            case 'DEL': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.DEL, keyDown);
                break;
            case 'GRAVE': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.GRAVE, keyDown);
                break;
            case 'MINUS': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.MINUS, keyDown);
                break;
            case 'EQUALS': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.EQUALS, keyDown);
                break;
            case 'LEFT_BRACKET': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.LEFT_BRACKET, keyDown);
                break;
            case 'RIGHT_BRACKET': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.RIGHT_BRACKET, keyDown);
                break;
            case 'BACKSLASH': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.BACKSLASH, keyDown);
                break;
            case 'SEMICOLON': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.SEMICOLON, keyDown);
                break;
            case 'APOSTROPHE': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.APOSTROPHE, keyDown);
                break;
            case 'SLASH': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.SLASH, keyDown);
                break;
            case 'AT': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.AT, keyDown);
                break;
            case 'FOCUS': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.FOCUS, keyDown);
                break;
            case 'PLUS': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.PLUS, keyDown);
                break;
            case 'MENU': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.MENU, keyDown);
                break;
            case 'SEARCH': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.SEARCH, keyDown);
                break;
            case 'MEDIA_PLAY_PAUSE': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.MEDIA_PLAY_PAUSE, keyDown);
                break;
            case 'MEDIA_STOP': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.MEDIA_STOP, keyDown);
                break;
            case 'MEDIA_NEXT': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.MEDIA_NEXT, keyDown);
                break;
            case 'MEDIA_PREVIOUS': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.MEDIA_PREVIOUS, keyDown);
                break;
            case 'MEDIA_REWIND': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.MEDIA_REWIND, keyDown);
                break;
            case 'MEDIA_FAST_FORWARD': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.MEDIA_FAST_FORWARD, keyDown);
                break;
            case 'MUTE': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.MUTE, keyDown);
                break;
            case 'CTRL_LEFT': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.CTRL_LEFT, keyDown);
                break;
            case 'CTRL_RIGHT': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.CTRL_RIGHT, keyDown);
                break;
            case 'INSERT': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.INSERT, keyDown);
                break;
            case 'PAUSE': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.PAUSE, keyDown);
                break;
            case 'PAGE_UP': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.PAGE_UP, keyDown);
                break;
            case 'PAGE_DOWN': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.PAGE_DOWN, keyDown);
                break;
            case 'PRINT_SCREEN': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.PRINT_SCREEN, keyDown);
                break;
            case 'INFO': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.INFO, keyDown);
                break;
            case 'WINDOW': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.WINDOW, keyDown);
                break;
            case 'BOOKMARK': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.BOOKMARK, keyDown);
                break;
            case 'CAPS_LOCK': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.CAPS_LOCK, keyDown);
                break;
            case 'ESCAPE': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.ESCAPE, keyDown);
                break;
            case 'META_LEFT': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.META_LEFT, keyDown);
                break;
            case 'ZOOM_IN': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.ZOOM_IN, keyDown);
                break;
            case 'ZOOM_OUT': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.ZOOM_OUT, keyDown);
                break;  
            case 'CHANNEL_UP': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.CHANNEL_UP, keyDown);
                break;
            case 'CHANNEL_DOWN': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.CHANNEL_DOWN, keyDown);
                break;
            case 'LIVE': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.LIVE, keyDown);
                break;
            case 'DVR': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.DVR, keyDown);
                break;
            case 'GUIDE': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.GUIDE, keyDown);
                break;
            case 'MEDIA_SKIP_BACK': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.MEDIA_SKIP_BACK, keyDown);
                break;
            case 'MEDIA_SKIP_FORWARD': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.MEDIA_SKIP_FORWARD, keyDown);
                break;
            case 'MEDIA_RECORD': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.MEDIA_RECORD, keyDown);
                break;
            case 'MEDIA_PLAY': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.MEDIA_PLAY, keyDown);
                break;
            case 'PROG_RED': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.PROG_RED, keyDown);
                break;
            case 'PROG_GREEN': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.PROG_GREEN, keyDown);
                break;
            case 'PROG_YELLOW': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.PROG_YELLOW, keyDown);
                break;
            case 'PROG_BLUE': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.PROG_BLUE, keyDown);
                break;
            case 'BD_POWER': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.BD_POWER, keyDown);
                break;
            case 'BD_INPUT': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.BD_INPUT, keyDown);
                break;
            case 'STB_POWER': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.STB_POWER, keyDown);
                break;
            case 'STB_INPUT': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.STB_INPUT, keyDown);
                break;
            case 'STB_MENU': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.STB_MENU, keyDown);
                break;
            case 'TV_POWER': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.TV_POWER, keyDown);
                break;
            case 'TV_INPUT': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.TV_INPUT, keyDown);
                break;
            case 'AVR_POWER': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.AVR_POWER, keyDown);
                break;
            case 'AVR_INPUT': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.AVR_INPUT, keyDown);
                break;
            case 'AUDIO': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.AUDIO, keyDown);
                break;
            case 'EJECT': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.EJECT, keyDown);
                break;
            case 'BD_POPUP_MENU': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.BD_POPUP_MENU, keyDown);
                break;
            case 'BD_TOP_MENU': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.BD_TOP_MENU, keyDown);
                break;
            case 'SETTINGS': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.SETTINGS, keyDown);
                break;
            case 'SETUP': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.SETUP, keyDown);
                break;
            case 'ALL_POWER': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.TV_POWER, keyDown);
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.AVR_POWER, keyDown);
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.STB_POWER, keyDown);
                break;      

            case 'BTN_FORWARD': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.BTN_FORWARD, keyDown);
                break;
            case 'BTN_BACK': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.BTN_BACK, keyDown);
                break;
            case 'META_RIGHT': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.META_RIGHT, keyDown);
                break;
            case 'META_LEFT': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.META_LEFT, keyDown);
                break;
            
            case 'CTRL_ALT_DEL': 
                //backgroundPageWindow.sendCtrlAltDelAnymoteKeyEvent();
                //sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.POWER);
                sendAnymoteFling('intent:#Intent;' +
                          'action=android.intent.action/.MAIN;' +
                          'category=android.intent.category/.REBOOT;' + 
                          'end');
                break;      
                
            
                
                
            case 'PICTSYMBOLS': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.PICTSYMBOLS, keyDown);
                break;  
            case 'SWITCH_CHARSET': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.SWITCH_CHARSET, keyDown);
                break;  
            case 'FORWARD_DEL': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.FORWARD_DEL, keyDown);
                break;  
            case 'SCROLL_LOCK': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.SCROLL_LOCK, keyDown);
                break;  
            case 'FUNCTION': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.FUNCTION, keyDown);
                break;  
            case 'SYSRQ': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.SYSRQ, keyDown);
                break;  
            case 'BREAK': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.BREAK, keyDown);
                break;  
            case 'MOVE_HOME': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.MOVE_HOME, keyDown);
                break;  
            case 'MOVE_END': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.MOVE_END, keyDown);
                break;  
            case 'FORWARD': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.FORWARD, keyDown);
                break;  
            case 'MEDIA_CLOSE': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.MEDIA_CLOSE, keyDown);
                break;  
            case 'F1': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.F1, keyDown);
                break;  
            case 'F2': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.F2, keyDown);
                break;  
            case 'F3': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.F3, keyDown);
                break;  
            case 'F4': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.F4, keyDown);
                break;  
            case 'F5': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.F5, keyDown);
                break;  
            case 'F6': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.F6, keyDown);
                break;  
            case 'F7': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.F7, keyDown);
                break;  
            case 'F8': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.F8, keyDown);
                break;  
            case 'F9': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.F9, keyDown);
                break;  
            case 'F10': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.F10, keyDown);
                break;  
            case 'F11': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.F11, keyDown);
                break;  
            case 'F12': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.F12, keyDown);
                break;  
            case 'NUM_LOCK': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUM_LOCK, keyDown);
                break;  
            case 'NUMPAD_0': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUMPAD_0, keyDown);
                break;  
            case 'NUMPAD_1': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUMPAD_1, keyDown);
                break;  
            case 'NUMPAD_2': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUMPAD_2, keyDown);
                break;  
            case 'NUMPAD_3': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUMPAD_3, keyDown);
                break;  
            case 'NUMPAD_4': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUMPAD_4, keyDown);
                break;  
            case 'NUMPAD_5': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUMPAD_5, keyDown);
                break;  
            case 'NUMPAD_6': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUMPAD_6, keyDown);
                break;  
            case 'NUMPAD_7': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUMPAD_7, keyDown);
                break;  
            case 'NUMPAD_8': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUMPAD_8, keyDown);
                break;  
            case 'NUMPAD_9': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUMPAD_9, keyDown);
                break;  
            case 'NUMPAD_DIVIDE': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUMPAD_DIVIDE, keyDown);
                break;  
            case 'NUMPAD_MULTIPLY': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUMPAD_MULTIPLY, keyDown);
                break;  
            case 'NUMPAD_SUBTRACT': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUMPAD_SUBTRACT, keyDown);
                break;  
            case 'NUMPAD_ADD': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUMPAD_ADD, keyDown);
                break;  
            case 'NUMPAD_DOT': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUMPAD_DOT, keyDown);
                break;  
            case 'NUMPAD_COMMA': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUMPAD_COMMA, keyDown);
                break;  
            case 'NUMPAD_ENTER': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUMPAD_ENTER, keyDown);
                break;  
            case 'NUMPAD_EQUALS': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUMPAD_EQUALS, keyDown);
                break;  
            case 'NUMPAD_LEFT_PAREN': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUMPAD_LEFT_PAREN, keyDown);
                break;  
            case 'NUMPAD_RIGHT_PAREN': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.NUMPAD_RIGHT_PAREN, keyDown);
                break;  
            case 'APP_SWITCH"': 
                sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.APP_SWITCH, keyDown);
                break;  
            
        }
        
        if( keyDown )
        {
            switch ( keyCode )
            {           
                case 'FLING_TAB': 
                    if(!isInPopUpMode) chrome.tabs.get(backgroundPageWindow.previousTab, function(tab) {  sendFling(tab.url);  });
                    else chrome.tabs.getSelected(null, function(tab) {  sendFling(tab.url);  });
                    break;
                case 'APP_CHROME':
                    sendAnymoteFling('chrome://');
                    break;  
                case 'APP_CLOCK': 
                    sendAnymoteFling('intent:#Intent;' + 'component=' + 'com.android.deskclock/.DeskClock;' + 'end');
                    break;  
                case 'APP_CNBC': 
                    sendAnymoteFling('intent:#Intent;' + 'component=' + 'com.nbc.cnbc.android.googletv/.ui.Splash;' + 'end');
                    break;  
                case 'APP_DOWNLOADS': 
                    sendAnymoteFling('intent:#Intent;' + 'component=' + 'com.android.providers.downloads.ui/.DownloadList;' + 'end');
                    break;  
                case 'APP_NBA': 
                    sendAnymoteFling('intent:#Intent;' + 'component=' + 'com.nbadigital.gametimegtv/.ActivityManager;' + 'end');
                    break;  
                case 'APP_NETFLIX': 
                    sendAnymoteFling('intent:#Intent;' + 'component=' + 'com.google.tv.netflix/.NetflixActivity;' + 'end');
                    break;  
                case 'APP_ONLIVE': 
                    sendAnymoteFling('intent:#Intent;' + 'component=' + 'com.onlive.clientgtv/.OnLiveClientGTVActivity;' + 'end');
                    break;  
                case 'APP_PANDORA': 
                    sendAnymoteFling('intent:#Intent;' + 'component=' + 'com.pandora.android.gtv/com.pandora.android.Main;' + 'end');
                    break;  
                case 'APP_PICTURES': 
                    sendAnymoteFling('intent:#Intent;' + 'component=' + 'com.google.tv.mediabrowser/.newui.MainActivity;' + 'end');
                    break;  
                case 'APP_PLAYMOVIES': 
                    sendAnymoteFling('intent:#Intent;' + 'component=' + 'com.google.android.videos/com.google.android.youtube.videos.EntryPoint;' + 'end');
                    break;  
                case 'APP_PLAYMUSIC': 
                    sendAnymoteFling('intent:#Intent;' + 'component=' + 'com.google.android.music/.activitymanagement.TopLevelActivity;' + 'end');
                    break;  
                case 'APP_PLAYSTORE': 
                    sendAnymoteFling('market://search?id=' + '');
                    break;                  
                case 'APP_PODCASTS': 
                    sendAnymoteFling('intent:#Intent;' + 'component=' + 'com.google.android.apps.listen/.WelcomeActivity;' + 'end');
                    break;  
                case 'APP_PRIMETIME': 
                    sendAnymoteFling('intent:#Intent;' + 'component=' + 'com.google.tv.alf/.ui.MainActivity;' + 'end');
                    break;  
                case 'APP_SEARCH': 
                    sendAnymoteFling('intent:#Intent;' + 'component=' + 'com.android.quicksearchbox/.SearchActivity;' + 'end');
                    break;              
                case 'APP_SETTINGS': 
                    sendAnymoteFling('intent:#Intent;' + 'component=' + 'com.google.tv.settings/.Settings;' + 'end');
                    break;                  
                case 'APP_SPOTLIGHT': 
                    sendAnymoteFling('http://www.google.com/tv/spotlight-gallery.html');
                    break;  
                case 'APP_TV': 
                    sendAnymoteFling('tv://');
                    break;  
                case 'APP_TWITTER': 
                    sendAnymoteFling('intent:#Intent;' + 'component=' + 'com.twitter.android.tv/com.twitter.android.LoginActivity;' + 'end');
                    break;  
                case 'APP_YOUTUBE': 
                    sendAnymoteFling('intent:#Intent;' + 'component=' + 'com.google.android.youtube.googletv/.MainActivity;' + 'end');
                    break;  
    //          case 'APP_NETFLIX': 
    //              sendAnymoteFling('nflx://');
    //              break;  
    //          case 'APP_CHROME_BLANK':    //loads chrome with blank page
    //              sendAnymoteFling('intent:#Intent;' + 'component=com.google.tv.chrome/.HubActivity;' + 'end');
    //              break;  
    //          case 'APP_TEST': 
    //              sendAnymoteFling('chrome://www.google.com/');
    //              break;              
            }
        }
        //sendGAEvent("KeyCode", keyCode);
    }
    else
    {
        backgroundPageWindow.console.log('Remote Keycode not sent because no anymote session is active.');
        console.log("No Google TV's are connected.");
        showToast("Not Connected");
    }
    //indicatorFlash();
};


var sendTpadMouseMoveEvent = function(xDelta,yDelta) {
    if(backgroundPageWindow.anymoteSessionActive) {
        sendAnymoteMouseMove(xDelta,yDelta);        
    } else {
        backgroundPageWindow.console.log('Mouse cursor movement not sent because no anymote session is active.');
        console.log("No Google TV's are connected.");
        showToast("Not Connected");
    }
    //indicatorFlash();
};

var sendTpadMouseWheelEvent = function(xDelta,yDelta) {
    if(backgroundPageWindow.anymoteSessionActive) {
        sendAnymoteMouseWheel(xDelta,yDelta);       
    } else {
        backgroundPageWindow.console.log('Mouse scroll movement not sent because no anymote session is active.');
        console.log("No Google TV's are connected.");
        showToast("Not Connected");
    }
    //indicatorFlash();
};

var sendTpadKeyEvent = function(button, keyDown) {    
    if(backgroundPageWindow.anymoteSessionActive) {
        switch (button) {
            case 1:  sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.BTN_LEFT,   keyDown); break;
            case 2:  sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.BTN_MIDDLE,  keyDown); break;
            case 3:  sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.BTN_RIGHT, keyDown); break;  
            default: sendAnymoteKeyEvent(googletvremote.anymote.KeyCode.BTN_LEFT,   keyDown);
        }        
    } else {
        backgroundPageWindow.console.log('Touchpad click not sent because no anymote session is active.');
        console.log("No Google TV's are connected.");
        showToast("Not Connected");
    }
    //sendGAEvent("KeyCode", "BTN_LEFT");
    //indicatorFlash();
};