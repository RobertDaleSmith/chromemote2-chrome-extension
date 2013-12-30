
//MoteServer API-------------------------------------
var moteServerAddress = null,
    moteServerActive  = false,
    moteServerPaired  = false;
if(localStorage.getItem("mote_server_ip")!= null) moteServerAddress = localStorage.getItem("mote_server_ip");

var initMoteServer = function() {
    $("#mote_server_ip_input").val(moteServerAddress);
}
var setMoteServer = function (address) {
    moteServerAddress = address;
    localStorage.setItem("mote_server_ip", moteServerAddress);
    // discoverDevices();
    initMoteServer();
    console.log("Mote Server set to " + address + ".");
}
var sendMoteCommand = function (key, value, callback, ip) {
    if( value == "keycode_all_power"){ sendMacro("TV_POWER,AVR_POWER,STB_POWER"); return; }

    var    serverAddress = moteServerAddress;
    if(ip) serverAddress = ip;

    if (serverAddress) {
        var url = 'http://' + serverAddress + ':8085/mote?' + key + '=' + value + '&time=' + new Date().getTime();
        $.getJSON(url, function (data) {
            console.log(JSON.stringify(data));
            if (callback) callback(JSON.stringify(data));
            moteServerActive = true;
        }).fail(function () {
            console.log("No response.");
            moteServerActive = false;
        });
    } else { 
        console.log("Mote Server not set.");
    }

}

var discoverDevices = function (callback) {
    sendMoteCommand("discoverDevices", true, callback);
}
var isDiscovering = function (callback) {
    sendMoteCommand("isDiscovering", true, callback);    
}
var getDeviceList = function (callback) {
    sendMoteCommand("getDeviceList", true, callback);
}
var connectDevice = function (deviceIP, callback) {
    sendMoteCommand("connectDevice", deviceIP, callback);
}
var isAwaitingPin = function (callback) {
    sendMoteCommand("isAwaitingPin", true, callback);
}
var cancelPairCode = function (callback) {
    sendMoteCommand("cancelPairCode", true, callback);
}
var sendPairCode = function (pinCode, callback) {
    sendMoteCommand("sendPairCode", pinCode, callback);
}
var isConnectingNow = function (callback) {
    sendMoteCommand("isConnectingNow", true, callback);
}
var connectSuccessOrFail = function (callback) {
    sendMoteCommand("connectSuccessOrFail", true, callback);
}
var sendMBridgeFling = function (flingUrl, callback) {
    //url = url.replace("#", "%23");
    //sendMoteCommand("fling", flingUrl, callback);

    var url = "http://"+ moteServerAddress +":8085/mote?fling=" + flingUrl.replaceAll("#","%23") + "&time=" + new Date().getTime();
    $.getJSON(url, function (data) {
        console.log(JSON.stringify(data));
        if(callback) callback(JSON.stringify(data));
    }).fail(function () {
        console.log("No response.");
        moteServerActive = false;
    });
}
var sendMacro = function (macro, callback) {
    console.log(macro);
    var macroKeyListObj = JSON.parse('["' + macro.replaceAll(',', '","') + '"]');


    var qty = macroKeyListObj.length;
    var counter = -1;

    function next() {
        counter++
        if (counter < qty) {           
            if (macroKeyListObj[counter].indexOf("DELAY_SEC_") != -1) {
                var seconds = parseInt(macroKeyListObj[counter].replace("DELAY_SEC_", "")) * 1000;
                setTimeout(next, seconds);
            } else {
                sendKeyCode("KEYCODE_" + macroKeyListObj[counter]);
                setTimeout(next, 250);
            }
        }
    }
    next();



}
var prevSendMovementTime = 0;
var sendMovement = function (deltaX, deltaY, callback) {

    if(deltaX == 0.0 && deltaY == 0.0) return;

    deltaX = deltaX * 10;
    deltaY = deltaY * 10;


    var time = new Date().getTime();
    if (time - prevSendMovementTime > 15) {
        //console.log(time - prevSendMovementTime);
        prevSendMovementTime = time;
        
        var url = "http://" + moteServerAddress + ":8085/mote?sendMovement=true&deltaX=" + deltaX + "&deltaY=" + deltaY + "&time=" + new Date().getTime();
        $.getJSON(url, function (data) {
            console.log(JSON.stringify(data));
            if (callback) callback(JSON.stringify(data));
        }).fail(function () {
            console.log("No response.");
            moteServerActive = false;
        });
    }
}
var getInstalledApps = function (callback) {
    sendMoteCommand("getInstalledApps", true, callback);
}

var getChannelListing = function (callback) {
    sendMoteCommand("getChannelListing", true, callback);
}


var sendScroll = function (scrollX, scrollY, callback) {

    if( (scrollX < 1  && scrollX > 0) ) scrollX =  2;
    if( (scrollY < 1  && scrollY > 0) ) scrollY =  2;
    if( (scrollX > -1 && scrollX < 0) ) scrollX = -2;
    if( (scrollY > -1 && scrollY < 0) ) scrollY = -2;

    scrollX = scrollX * -1;
    scrollY = scrollY * -1;
    
    var url = "http://" + moteServerAddress + ":8085/mote?sendScroll=true&scrollX=" + scrollX + "&scrollY=" + scrollY + "&time=" + new Date().getTime();
    $.getJSON(url, function (data) {
        console.log(JSON.stringify(data));
        if (callback) callback(JSON.stringify(data));
    }).fail(function () {
        console.log("No response.");
        moteServerActive = false;
    });
}