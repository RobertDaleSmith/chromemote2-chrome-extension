//Chrome AnyMote API Stuff---------------------------
var anyMotePluginActive = false;

//MoteServer API-------------------------------------
var moteServerAddress = null,
    moteServerActive  = false;
if(localStorage.getItem("mote_server_ip")!= null) moteServerAddress = localStorage.getItem("mote_server_ip");

var initMoteServer = function() {
    $("#mote_server_ip_input_box").val(moteServerAddress);
}
var setMoteServer = function (address) {
    moteServerAddress = address;
    localStorage.setItem("mote_server_ip", moteServerAddress);
    discoverDevices();
    initMoteServer();
    console.log("Mote Server set to " + address + ".");
}
var sendMoteCommand = function (key, value, callback) {

    if (moteServerAddress) {
        var url = 'http://' + moteServerAddress + ':8085/mote?' + key + '=' + value + '&time=' + new Date().getTime();
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
var sendKeyCode = function (keyCode, callback) {
    sendMoteCommand("keycode", keyCode, callback);
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
var fling = function (flingUrl, callback) {
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



//App UI Logic--------------------------------------------------

var devices_options_active = false,
    apps_options_active = false,
    channels_options_active = false;

var installAppsList = JSON.parse("[]");
if(localStorage.getItem("apps_installed_list")){
    installAppsList = JSON.parse( localStorage.getItem("apps_installed_list") );    
}

var channelsList = JSON.parse("[]");
if(localStorage.getItem("system_channels_list")){
    channelsList = JSON.parse( localStorage.getItem("system_channels_list") );    
}

var savedDeviceList = JSON.parse("[]");
if(localStorage.getItem("saved_device_list")){
    savedDeviceList = JSON.parse( localStorage.getItem("saved_device_list") );    
}

document.onselectstart = function(){ return false; }
window.onload = function () {

    initMoteServer();

    initColorPicker();

    initAppIntents();

    initTouchPadEvents();

    enableKeyBoardEvents();

    refreshCustomIntentListUI();

    refreshCustomMacroListUI();

    updateChannelsListUI();

    updateAppsListUI();

    
    $(".keycode").on('mousedown', function () {
          var thisButton = $(this);
          setTimeout(function () {
              console.log('down');
              //console.log(thisButton.attr('class'));
              if (thisButton.is('.dragging') || $("#" + thisButton.attr('id')).parent().is('.dragging')) {
                  return;
              }
              //sendKeyCode(thisButton.attr('id'));

          }, 200);
    });
    $(".keycode").on('mouseup', function () {
          var thisButton = $(this);
          console.log('up');
          //console.log(thisButton.attr('class'));
          if (thisButton.is('.dragging') || $("#" + thisButton.attr('id')).parent().is('.dragging')) {
              return;
          }
          sendKeyCode(thisButton.attr('id'));
    });



    //$( ".keycode" ).draggable({
    //  connectToSortable: "#remote_button_panel_main",
    //  grid: [ 64, 48 ], 
    //  snap: ".keycode", 
    //  snapMode: "outer"
    //});

    //$('#remote_button_panel_main').sortable();

    //$("#remote_button_panel_main").sortable({
    //    placeholder: "ui-state-highlight"
    //        
    //});
    //$("#sortable").disableSelection();
    


    $("#alt_panel_button").click(function () {
        showAltPanel();
    });

    $("#touch_pad_open_button").click(function () {
        showTouchPad();
    });

    $("#lock_mouse_button").click(function () {
        toggleMouseLock();
    });

    var optAniSpeed = 724;
    var animationActive = false;

    $("#options_button_devices").click(function () {
        if (optionsActive && !devices_options_active) {
            if (apps_options_active) {
                console.log("SLIDE CONTENT TO THE LEFT");
                
                $("#options_panel_apps").animate({ left: "0" }, 0, function () {  /*Animation complete.*/  });
                $("#options_panel_apps").css("z-index", "1");
                animationActive = true;
                $("#options_panel_apps").animate({
                    left: "320"
                }, optAniSpeed, function () {
                    // Animation complete.
                    // $("#options_panel_apps").css("display", "none");
                    // $("#options_panel_apps").css("left", "0");
                    animationActive = false;
                });

                $("#options_panel_devices").animate({ left: "-320" }, 0, function () {  /*Animation complete.*/  });
                $("#options_panel_devices").css("display", "block");
                $("#options_panel_devices").css("z-index", "2");
                $("#options_panel_devices").animate({ left: "0" }, optAniSpeed/2, function () {  /*Animation complete.*/  });

                $("#options_panel_channels").css("display", "none");
            } 
            if (channels_options_active) {
                console.log("SLIDE CONTENT TO THE RIGHT");

                $("#options_panel_channels").animate({ left: "0" }, 0, function () {  /*Animation complete.*/  });
                $("#options_panel_channels").css("z-index", "1");
                animationActive = true;
                $("#options_panel_channels").animate({
                    left: "320"
                }, optAniSpeed, function () {
                    // Animation complete.
                    // $("#options_panel_channels").css("display", "none");
                    // $("#options_panel_channels").css("left", "0");
                    animationActive = false;
                });

                $("#options_panel_devices").animate({ left: "-320" }, 0, function () {  /*Animation complete.*/  });
                $("#options_panel_devices").css("display", "block");
                $("#options_panel_devices").css("z-index", "2");
                $("#options_panel_devices").animate({ left: "0" }, optAniSpeed/2, function () {  /*Animation complete.*/  });

                $("#options_panel_apps").css("display", "none");
            }
        } else if (!optionsActive || devices_options_active){
            showOptionsPanel();

            $("#options_panel_devices").css("display", "block");
            $("#options_panel_apps").css("display", "none");
            $("#options_panel_channels").css("display", "none");            
        } 

        $("#device_selected").css("display", "block");
        $("#apps_selected").css("display", "none");
        $("#channels_selected").css("display", "none");
        
        apps_options_active = false;
        devices_options_active = true;
        channels_options_active = false;
    });

    $("#options_button_apps").click(function () {
        if (optionsActive && !apps_options_active) {
            if (devices_options_active) {
                console.log("SLIDE CONTENT TO THE LEFT");

                $("#options_panel_devices").animate({ left: "0" }, 0, function () {  /*Animation complete.*/  });
                $("#options_panel_devices").css("z-index", "1");
                animationActive = true;
                $("#options_panel_devices").animate({
                    left: "-320"
                }, optAniSpeed, function () {
                    // Animation complete.
                    // $("#options_panel_devices").css("display", "none");
                    // $("#options_panel_devices").css("left", "0");
                    animationActive = false;
                });

                $("#options_panel_apps").animate({ left: "320" }, 0, function () {  /*Animation complete.*/  });
                $("#options_panel_apps").css("display", "block");
                $("#options_panel_apps").css("z-index", "2");
                $("#options_panel_apps").animate({ left: "0" }, optAniSpeed/2, function () {  /*Animation complete.*/  });

                $("#options_panel_channels").css("display", "none");
            } 
            if (channels_options_active) {
                console.log("SLIDE CONTENT TO THE RIGHT");

                $("#options_panel_channels").animate({ left: "0" }, 0, function () {  /*Animation complete.*/  });
                $("#options_panel_channels").css("z-index", "1");
                animationActive = true;
                $("#options_panel_channels").animate({
                    left: "320"
                }, optAniSpeed, function () {
                    // Animation complete.
                    // $("#options_panel_channels").css("display", "none");
                    // $("#options_panel_channels").css("left", "0");
                    animationActive = false;
                });

                $("#options_panel_apps").animate({ left: "-320" }, 0, function () {  /*Animation complete.*/  });
                $("#options_panel_apps").css("display", "block");
                $("#options_panel_apps").css("z-index", "2");
                $("#options_panel_apps").animate({ left: "0" }, optAniSpeed/2, function () {  /*Animation complete.*/  });

                $("#options_panel_devices").css("display", "none");
            }
        } else if (!optionsActive || apps_options_active){
            showOptionsPanel();

            $("#options_panel_devices").css("display", "none");
            $("#options_panel_apps").css("display", "block");
            $("#options_panel_channels").css("display", "none");
            
        } 

        $("#device_selected").css("display", "none");
        $("#apps_selected").css("display", "block");
        $("#channels_selected").css("display", "none");

        apps_options_active = true;
        devices_options_active = false;
        channels_options_active = false;
    });

    $("#options_button_channels").click(function () {

        if (optionsActive && !channels_options_active) {
            if (apps_options_active) {
                console.log("SLIDE CONTENT TO THE RIGHT");
                
                $("#options_panel_apps").animate({ left: "0" }, 0, function () {  /*Animation complete.*/  });
                $("#options_panel_apps").css("z-index", "1");
                animationActive = true;
                $("#options_panel_apps").animate({
                    left: "-320"
                }, optAniSpeed, function () {
                    // Animation complete.
                    // $("#options_panel_apps").css("display", "none");
                    // $("#options_panel_apps").css("left", "0");
                    animationActive = false;
                });

                $("#options_panel_channels").animate({ left: "320" }, 0, function () {  /*Animation complete.*/  });
                $("#options_panel_channels").css("display", "block");
                $("#options_panel_channels").css("z-index", "2");
                $("#options_panel_channels").animate({ left: "0" }, optAniSpeed/2, function () {  /*Animation complete.*/  });

                $("#options_panel_devices").css("display", "none");
            } 
            if (devices_options_active) {
                console.log("SLIDE CONTENT TO THE RIGHT");

                $("#options_panel_devices").animate({ left: "0" }, 0, function () {  /*Animation complete.*/  });
                $("#options_panel_devices").css("z-index", "1");
                animationActive = true;
                $("#options_panel_devices").animate({
                    left: "-320"
                }, optAniSpeed, function () {
                    // Animation complete.
                    // $("#options_panel_devices").css("display", "none");
                    // $("#options_panel_devices").css("left", "0");
                    animationActive = false;
                });

                $("#options_panel_channels").animate({ left: "320" }, 0, function () {  /*Animation complete.*/  });
                $("#options_panel_channels").css("display", "block");
                $("#options_panel_channels").css("z-index", "2");
                $("#options_panel_channels").animate({ left: "0" }, optAniSpeed/2, function () {  /*Animation complete.*/  });

                $("#options_panel_apps").css("display", "none");
            }
        } else if (!optionsActive || channels_options_active){
            showOptionsPanel();

            $("#options_panel_devices").css("display", "none");
            $("#options_panel_apps").css("display", "none");
            $("#options_panel_channels").css("display", "block");
            
        } 

        $("#device_selected").css("display", "none");
        $("#apps_selected").css("display", "none");
        $("#channels_selected").css("display", "block");

        apps_options_active = false;
        devices_options_active = false;
        channels_options_active = true;
    });

    $("#options_close_button").click(function () {
        showOptionsPanel();
    });

    $("#devices_refresh_button").click(function () {
        runDiscovery();
    });

    $("#devices_add_button").click(function () {
        showAddNewDeviceBox();
    });

    $("#intent_add_button").click(function () {
        showAddNewFlingBox();
    });

    $("#macro_add_button").click(function () {
        showAddNewMacroBox();
    });

    var getAppsLoop, getAppsTimeOut, clearMsgTimeOut;

    $("#apps_sync_button").click(function () {

        $("#loaderImage2").css("display", "block");
        $("#apps_sync_button").css("display", "none");
        clearTimeout(clearMsgTimeOut);
        document.getElementById("apps_status_label").textContent = "Updating apps list";
        appsListUpdated = false;
        getAppsLoop = setInterval(function () {
            if (appsListUpdated) {
                $("#loaderImage2").css("display", "none");
                $("#apps_sync_button").css("display", "block");
                clearTimeout(clearMsgTimeOut);
                document.getElementById("apps_status_label").textContent = "Apps list updated";
                clearMsgTimeOut = setTimeout(function () { document.getElementById("apps_status_label").textContent = ""; }, 10000);
                clearInterval(getAppsLoop);
            }


        }, 1000);

        getAppsTimeOut = setTimeout(function () {
            if (!appsListUpdated) {
                $("#loaderImage2").css("display", "none");
                $("#apps_sync_button").css("display", "block");
                clearTimeout(clearMsgTimeOut);
                document.getElementById("apps_status_label").textContent = "Unable to get apps list";
                clearInterval(getAppsLoop);
            }
        }, 15000);

        getInstalledApps(function (res) {

            installAppsList = JSON.parse(res);

            installAppsList.sort(function (a, b) {
                if (a.name < b.name) {
                    return -1;
                }
                else if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });

            localStorage.setItem("apps_installed_list", JSON.stringify(installAppsList));

            updateAppsListUI();

            appsListUpdated = true;
        });
    });

    var getChannelsLoop, getChannelsTimeOut, clearChMsgTimeOut;

    $("#update_channels_button").click(function () {


        $("#loaderImage3").css("display", "block");
        $("#update_channels_button").css("display", "none");
        clearTimeout(clearChMsgTimeOut);
        document.getElementById("channels_status_label").textContent = "Updating channels list";
        channelsListUpdated = false;
        getChannelsLoop = setInterval(function () {
            if (channelsListUpdated) {
                $("#loaderImage3").css("display", "none");
                $("#update_channels_button").css("display", "block");
                clearTimeout(clearChMsgTimeOut);
                document.getElementById("channels_status_label").textContent = "Channels list updated";
                clearChMsgTimeOut = setTimeout(function () { document.getElementById("channels_status_label").textContent = ""; }, 10000);
                clearInterval(getChannelsLoop);
            }
        }, 1000);

        getChannelsTimeOut = setTimeout(function () {
            if (!channelsListUpdated) {
                $("#loaderImage3").css("display", "none");
                $("#update_channels_button").css("display", "block");
                clearTimeout(clearChMsgTimeOut);
                document.getElementById("channels_status_label").textContent = "Unable to get channels list";
                clearInterval(getChannelsLoop);
            }
        }, 15000);

        getChannelListing(function (res) {
            console.log(res);

            channelsList = JSON.parse(res);
            localStorage.setItem("system_channels_list", JSON.stringify(channelsList));

            updateChannelsListUI();

            channelsListUpdated = true;
        });
    });

};   //END ONLOAD


//DISABLES right-click globally.
document.oncontextmenu = function() {
    //return false;
}

var updateChannelsListUI = function() {
    document.getElementById("system_channels_list").textContent = "";

    for (var i = 0; i < channelsList.length; i++) {

        var newAppEl = document.createElement("div");
        newAppEl.className = "system_channels_list_item";
        newAppEl.innerHTML =   "<div class='channels_list_item_callsign'>" + channelsList[i].callsign + "</div>" + 
                               "<div class='channels_list_item_number'>" + channelsList[i].channel_number + "</div>" + 
                               "<div class='channels_list_item_name'>" + channelsList[i].channel_name + "</div>";

        newAppEl.id = channelsList[i].channel_uri;

        $(newAppEl).click(function() {
            fling(this.id);
            showOptionsPanel();
        });

        document.getElementById("system_channels_list").appendChild(newAppEl);
    }
}

var updateAppsListUI = function() {
    document.getElementById("apps_installed_list").textContent = "";

    for (var i = 0; i < installAppsList.length; i++) {

        var newAppEl = document.createElement("div");
        newAppEl.className = "installed_app_item";
        newAppEl.textContent = installAppsList[i].name;
        newAppEl.id = 'intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=' + installAppsList[i].packageName + '/' + installAppsList[i].activityName + ';end';

        $(newAppEl).click(function() {
            fling(this.id);
            showOptionsPanel();
        });

        document.getElementById("apps_installed_list").appendChild(newAppEl);
    }
}

var showAddPinInputBox = function() {

    if (document.getElementsByClassName("new_device_ip_input").length > 0) {
        $("#add_new_device").remove();
    }

    if (document.getElementsByClassName("pair_code_input").length == 0) {

        var newDeviceInputEl = document.createElement("div");
        newDeviceInputEl.id = "enter_pin_code_container";
        newDeviceInputEl.innerHTML = "<div id='cancel_pair_button'>cancel</div><input class='pair_code_input' type='text' placeholder='enter pin' maxlength='4'/><div id='send_pair_code_button'>connect</div>";

        $("#devices_list").prepend(newDeviceInputEl);

        $("#send_pair_code_button").click( sendPairCodeButtonEvent );

        $("#cancel_pair_button").click(function () {
            cancelPairCode(function () {
                $("#enter_pin_code_container").remove();

                document.getElementById("devices_status_label").textContent = "Pairing canceled";
                $("#loaderImage").css("display", "none");
                $("#devices_refresh_button").css("display", "block");
            });
        });

        $(function () {
            $('.new_device_ip_input').ipaddress({ cidr: true });
        });

        clearInterval(discoveryLoop);
        $("#loaderImage").css("display", "none");
        $("#devices_refresh_button").css("display", "block");
        //discoverDevices();
        $('.pair_code_input').alphanumeric();
        $('.pair_code_input').focus();
        $(".pair_code_input").select();

        $(".pair_code_input").keypress(function (e) {
            if (e.which == 13) { //Enter Press
                sendPairCodeButtonEvent();
            }
        });
    }

}

var sendPairCodeButtonEvent = function () {
    var secretEntered = document.getElementsByClassName("pair_code_input")[0].value;

    if (secretEntered.length == 4) {

        document.getElementById("devices_status_label").textContent = "Pairing";
        $("#loaderImage").css("display", "block");
        $("#devices_refresh_button").css("display", "none");

        sendPairCode(secretEntered, function (response) {

            var pairSuccessLoop = setInterval(function () {

                connectSuccessOrFail(function (response) {

                    if (JSON.parse(response).connectionSuccess && !JSON.parse(response).connectionFailed) {
                        //success, no fail
                        clearInterval(pairSuccessLoop);
                        clearInterval(pairSuccessTimeout);
                        document.getElementById("devices_status_label").textContent = "Connected to " + pairingTo.replaceAll('_','.');
                        $("#loaderImage").css("display", "none");
                        $("#devices_refresh_button").css("display", "block");

                        if (document.getElementById(pairingTo) != null) document.getElementById(pairingTo).className = "device_found_active";

                        if (document.getElementsByClassName("new_device_ip_input").length > 0) {
                            $("#add_new_device").remove();
                        }

                        $("#enter_pin_code_container").remove();

                        discoverDevices();

                        showOptionsPanel();

                    } else if (!JSON.parse(response).connectionSuccess && JSON.parse(response).connectionFailed) {
                        //no success, fail
                        clearInterval(pairSuccessLoop);
                        clearInterval(pairSuccessTimeout);
                        document.getElementById("devices_status_label").textContent = "Pairing failed";
                        $("#loaderImage").css("display", "none");
                        $("#devices_refresh_button").css("display", "block");

                        if (document.getElementById(pairingTo) != null) document.getElementById(pairingTo).className = "device_found";

                        runPairing(pairingTo);

                        $(".new_device_ip_input").css("border-color", "#f00");
                        setTimeout(function () {
                            $(".new_device_ip_input").css("border-color", "#e8e9e9");
                            setTimeout(function () {
                                $(".new_device_ip_input").css("border-color", "#f00");
                                setTimeout(function () {
                                    $(".new_device_ip_input").css("border-color", "");
                                    setTimeout(function () {
                                        $(".pair_code_input").val('');
                                        $(".pair_code_input").focus();
                                        $(".pair_code_input").select();
                                    }, 150);
                                }, 150);
                            }, 150);
                        }, 150);


                    } else if (!JSON.parse(response).connectionSuccess && !JSON.parse(response).connectionFailed) {
                        //no success, no fail
                        
                    }

                });

            }, 1000);


            var pairSuccessTimeout = setTimeout(function () {
                clearInterval(pairSuccessLoop);
                document.getElementById("devices_status_label").textContent = address.replaceAll('_','.') + " did not respond";
                $("#loaderImage").css("display", "none");
                $("#devices_refresh_button").css("display", "block");
            }, 15000);

        });

    } else {
        $(".pair_code_input").css("border-color", "#f00");
        setTimeout(function () {
            $(".pair_code_input").css("border-color", "#e8e9e9");
            setTimeout(function () {
                $(".pair_code_input").css("border-color", "#f00");
                setTimeout(function () {
                    $(".pair_code_input").css("border-color", "");
                    setTimeout(function () {
                        $(".pair_code_input").focus();
                    }, 150);
                }, 150);
            }, 150);
        }, 150);
    }
}

var showAddNewDeviceBox = function () {

    document.getElementById('devices_list').scrollTop = 0;

    if (document.getElementsByClassName("new_device_ip_input").length == 0) {
        
        var newDeviceInputEl = document.createElement("div");
        newDeviceInputEl.id = "add_new_device";
        newDeviceInputEl.innerHTML = "<input name='ipaddress[abcd][]' class='new_device_ip_input' type='text' placeholder='xxx.xxx.xxx.xxx' /><div id='connect_new_button'>connect</div>";

        $("#devices_list").prepend(newDeviceInputEl);
                
        $("#connect_new_button").click(addNewDeviceButtonEvent);

        $(function () {
            $('.new_device_ip_input').ipaddress({ cidr: true });
        });

        clearInterval(discoveryLoop);
        $("#loaderImage").css("display", "none");
        $("#devices_refresh_button").css("display", "block");
        //discoverDevices();

        $("#ipaddress_abcd__octet_1").focus();
        $("#ipaddress_abcd__octet_1").select();

        $(".ip_octet").keypress(function (e) {
            if (e.which == 13) {
                addNewDeviceButtonEvent();
            }
        });
    }

}

var showAddNewFlingBox = function (oldName, oldUrl) {

    document.getElementById('apps_lists').scrollTop = 0;

    if (!document.getElementById("add_new_fling")) {
        
        var newFlingInputEl = document.createElement("div");
        newFlingInputEl.id = "add_new_fling";
        newFlingInputEl.innerHTML = "<div id='custom_intent_cancel_button'>cancel</div><input id='custom_intent_name_input' placeholder='name'><input id='custom_intent_uri_input' placeholder='uri ex: http:// '><div id='custom_intent_save_button'>save</div>";

        $("#apps_lists").prepend(newFlingInputEl);

        $("#custom_intent_save_button").click(function () {

            var name = document.getElementById("custom_intent_name_input").value,
                uri = document.getElementById("custom_intent_uri_input").value;

            name = name.replaceAll('"',"&quot;").stripHTML();
            uri  = uri.replaceAll('"',"%22").stripHTML();

            if (name != "" && uri != "") {
                removeCustomIntent(oldName, oldUrl);
                addNewCustomIntent(name, uri);
                $("#add_new_fling").remove();
            }

            if (name == "") {
                $("#custom_intent_name_input").css("border-color", "#f00");
                setTimeout(function () {
                    $("#custom_intent_name_input").css("border-color", "#e8e9e9");
                    setTimeout(function () {
                        $("#custom_intent_name_input").css("border-color", "#f00");
                        setTimeout(function () {
                            $("#custom_intent_name_input").css("border-color", "");
                            setTimeout(function () {
                                $("#custom_intent_name_input").focus();
                                $("#custom_intent_name_input").select();
                            }, 150);
                        }, 150);
                    }, 150);
                }, 150);
            }
            if (uri == "") {
                $("#custom_intent_uri_input").css("border-color", "#f00");
                setTimeout(function () {
                    $("#custom_intent_uri_input").css("border-color", "#e8e9e9");
                    setTimeout(function () {
                        $("#custom_intent_uri_input").css("border-color", "#f00");
                        setTimeout(function () {
                            $("#custom_intent_uri_input").css("border-color", "");
                            setTimeout(function () {
                                if (name != "") {
                                    $("#custom_intent_uri_input").focus();
                                    $("#custom_intent_uri_input").select();
                                }
                            }, 150);
                        }, 150);
                    }, 150);
                }, 150);
            }


        });
        $("#custom_intent_cancel_button").click(function () {
            if (document.getElementById("add_new_fling")) {
                if (oldUrl != null && oldName != null)
                    refreshCustomIntentListUI();
                $("#add_new_fling").remove();
            }
        });

        if (oldName != null)
            document.getElementById("custom_intent_name_input").value = oldName;
        if (oldUrl != null)
            document.getElementById("custom_intent_uri_input").value = oldUrl;

        $("#custom_intent_name_input").keyup(function (e) {
            if (e.keyCode == 13) {
                $("#custom_intent_uri_input").focus();
            }
        });
        $("#custom_intent_uri_input").keyup(function (e) {
            if (e.keyCode == 13) {
                $("#custom_intent_save_button").click();
            }
        });

    }

}

var preloadingTags = true;
var showAddNewMacroBox = function (oldName, oldMacro) {

    document.getElementById('channels_list').scrollTop = 0;

    if (!document.getElementById("add_new_macro")) {

        var newMacroInputEl = document.createElement("div");
        newMacroInputEl.id = "add_new_macro";
        newMacroInputEl.innerHTML = "<div id='custom_macro_textarea_holder'><textarea id='custom_macro_textarea' rows='1'></textarea></div><div id='custom_macro_textarea_overflow_hider_holder'><div id='custom_macro_textarea_overflow_hider'>d</div></div><div id='custom_macro_save_button_wrapper'><div id='custom_macro_save_button'>save</div></div><div id='custom_macro_cancel_button'>cancel</div><input id='custom_macro_name_input' placeholder='macro name'>";

        $("#channels_list").prepend(newMacroInputEl);

        $('#custom_macro_textarea').textext({
            plugins: 'tags prompt focus autocomplete ajax arrow filter',
            tagsItems: [],
            prompt: 'add keycodes...',
            ajax: {
                url: 'libs/textext/textext_filter_macro_keys.json',
                dataType: 'json',
                cacheResults: true
            },
            filter: { enabled: true }
        });

        
        if (oldMacro != null) {

            preloadingTags = true;

            var macroObject = JSON.parse('["' + oldMacro.replaceAll(',', '","') + '"]');

            for (var i = 0; i < macroObject.length; i++)
                $('#custom_macro_textarea').textext()[0].tags().addTags([macroObject[i]]);

            preloadingTags = false;
        }



        $("#custom_macro_save_button").click(function () {

            var name = document.getElementById("custom_macro_name_input").value,
            keyCodes = document.getElementById("keycode_value_holder").value;
            //console.log(keyCodes);

            name = name.replaceAll('"',"&quot;").stripHTML();
            //keyCodes  = keyCodes.replaceAll('"',"");

            if (name != "" && keyCodes != "[]") { //Valid Input
                removeCustomMacro(oldName, oldMacro);

                addNewCustomMacro(name, keyCodes);

                $("#add_new_macro").remove();
            }

            if (name == "") {
                $("#custom_macro_name_input").css("border-color", "#f00");
                setTimeout(function () {
                    $("#custom_macro_name_input").css("border-color", "#e8e9e9");
                    setTimeout(function () {
                        $("#custom_macro_name_input").css("border-color", "#f00");
                        setTimeout(function () {
                            $("#custom_macro_name_input").css("border-color", "");
                            setTimeout(function () {
                                $("#custom_macro_name_input").focus();
                                $("#custom_macro_name_input").select();
                            }, 150);
                        }, 150);
                    }, 150);
                }, 150);
            }

            if (keyCodes == "[]") {
                $("#custom_macro_textarea").css("border-color", "#f00");
                setTimeout(function () {
                    $("#custom_macro_textarea").css("border-color", "#e8e9e9");
                    setTimeout(function () {
                        $("#custom_macro_textarea").css("border-color", "#f00");
                        setTimeout(function () {
                            $("#custom_macro_textarea").css("border-color", "");
                            setTimeout(function () {
                                $("#custom_macro_textarea").focus();
                                $("#custom_macro_textarea").select();
                            }, 150);
                        }, 150);
                    }, 150);
                }, 150);
            }

        });

    }

    $("#custom_macro_cancel_button").click(function () {
        if (document.getElementById("add_new_macro")) {
            if (oldMacro != null && oldName != null)
                refreshCustomMacroListUI();
            $("#add_new_macro").remove();
        }
    });

    $("#custom_macro_name_input").keyup(function (e) {
        if (e.keyCode == 13) {
            $("#custom_macro_textarea").focus();
        }
    });

    if (oldName != null)
        document.getElementById("custom_macro_name_input").value = oldName.replaceAll("&quot;",'"');


}



var customIntentList = JSON.parse("[]");
if(localStorage.getItem("custom_intent_list")){
    customIntentList = JSON.parse( localStorage.getItem("custom_intent_list") );    
}

var addNewCustomIntent = function (name, uri) {
    
    var jsonObjectString = '{ "name" : "' + name + '", "uri" : "' + uri + '"}';
    var jsonObject = JSON.parse(jsonObjectString);

    customIntentList.push(jsonObject);
    customIntentList.sort(function (a, b) {
        if (a.name < b.name) {
            return -1;
        }
        else if (a.name > b.name) {
            return 1;
        }
        return 0;
    });
    localStorage.setItem("custom_intent_list", JSON.stringify(customIntentList));

    refreshCustomIntentListUI();

}

var refreshCustomIntentListUI = function () {
    document.getElementById("custom_intent_list").textContent = "";

    for (var i = 0; i < customIntentList.length; i++) {
        var newAppEl = document.createElement("div");
        newAppEl.className = "custom_intent_item";
        newAppEl.innerHTML = customIntentList[i].name;
        newAppEl.id = customIntentList[i].uri;
        newAppEl.setAttribute("name", customIntentList[i].name);
        newAppEl.setAttribute("oncontextmenu", "return false;");


        //$(newAppEl).click(function (event) {
        //fling(this.id);
        //console.log(event.button);
        //});

        $(newAppEl).mouseup(function (e) {
            if (e.button == 2) { //Right mouse button
                //console.log("Right Click");
                showContextMenu(event.x, event.y, this.id, this.textContent, "intent");
                return false;
            } else {
                fling(this.id);
                showOptionsPanel();
            }
            return true;
        });

        document.getElementById("custom_intent_list").appendChild(newAppEl);
    }
}



//Custom Macro Stuff
var customMacroList = JSON.parse("[]");
if(localStorage.getItem("custom_macro_list")){
    customMacroList = JSON.parse( localStorage.getItem("custom_macro_list") );    
}

var addNewCustomMacro = function (name, macro) {
    
    var jsonObjectString = '{ "name" : "' + name + '", "macro" : ' + macro + ' }';
    var jsonObject = JSON.parse(jsonObjectString);

    customMacroList.push(jsonObject);
    customMacroList.sort(function (a, b) {
        if (a.name < b.name) {
            return -1;
        }
        else if (a.name > b.name) {
            return 1;
        }
        return 0;
    });
    localStorage.setItem("custom_macro_list", JSON.stringify(customMacroList));

    refreshCustomMacroListUI();

}

var refreshCustomMacroListUI = function () {
    document.getElementById("custom_macro_list").textContent = "";

    for (var i = 0; i < customMacroList.length; i++) {
        var macroStr = "" + customMacroList[i].macro;
        var newMacroEl = document.createElement("div");
        newMacroEl.className = "custom_macro_item";
        $(newMacroEl).attr("name", customMacroList[i].name);
        newMacroEl.innerHTML = "<div>" + customMacroList[i].name + "</div>" + "<div class='custom_macro_item_details'>" + macroStr.replaceAll(",",", ") + "</div>";
        newMacroEl.id = macroStr;

        newMacroEl.setAttribute("oncontextmenu", "return false;");
        
        
        $(newMacroEl).mouseup(function (e) {
            if (e.button == 2) { //Right mouse button
                //console.log("Right Click");
                showContextMenu(event.x, event.y, this.id, $(this).attr("name"), "macro");
                return false;
            } else {
                //console.log(this.id);
                sendMacro(this.id);
                showOptionsPanel();
            }
            return true;
        });

        document.getElementById("custom_macro_list").appendChild(newMacroEl);
    }
}





var showContextMenu = function (x, y, id, name, type) {

    if (x > 205) x = 205;
    if (y > 398) y = 398;

    $("#apps_context_menu").css("display", "block");
    $("#apps_context_menu").css("left", x);
    $("#apps_context_menu").css("top", y);

    $("#apps_context_menu").unbind("blur");

    $("#apps_context_menu").blur(function () { hideContextMenu(); });

    $("#apps_context_menu").focus();

    $("#apps_context_menu_edit").unbind("mouseup");
    $("#apps_context_menu_delete").unbind("mouseup");

    $("#apps_context_menu_edit").mouseup(function (event) {
        hideContextMenu();
        //console.log("Edit " + id);

        if (type == "intent") {
            if (document.getElementById("add_new_fling")) $("#custom_intent_cancel_button").click();
            showAddNewFlingBox(name, id);
            document.getElementById(id).remove();
        } else if (type == "macro") {
            if (document.getElementById("add_new_macro")) $("#custom_macro_cancel_button").click();
            showAddNewMacroBox(name, id);
            document.getElementById(id).remove();
        } else if (type == "device") {
            //Enable rename device inner textbox and save button.
            $(document.getElementById(id).getElementsByClassName("device_found_name_input")).removeAttr('disabled');
            $(document.getElementById(id).getElementsByClassName("device_found_name_input")).focus();
            $(document.getElementById(id).getElementsByClassName("device_found_rename_save_button")).css("display","block");
            document.getElementById(id).className += " device_renaming";
        }
    });
    $("#apps_context_menu_delete").mouseup(function (event) {
        hideContextMenu();
        console.log("Deleting " + id);

        for(var i = 0; i < document.getElementsByName(name).length ; i++){
            if( $(document.getElementsByName(name)[i]).attr("name") == name )
                if(document.getElementsByName(name)[i].id == id)
                    document.getElementsByName(name)[i].remove();
        }        
        if (type == "intent") {
            removeCustomIntent(name, id);
        } else if (type == "macro") {
            removeCustomMacro(name, id);
        } else if (type == "device") {
            delSavedDevice(name, id.replaceAll("_","."));
        }

    });

}
var hideContextMenu = function (x, y, id) {
    $("#apps_context_menu").css("display", "none");
}

var removeCustomIntent = function(name, uri){
    
    for (var i = 0; i < customIntentList.length; i++) {
        //console.log(customIntentList[i].uri);
        if (customIntentList[i].uri == uri && customIntentList[i].name == name) {
            customIntentList.splice(i, 1);
            localStorage.setItem("custom_intent_list", JSON.stringify(customIntentList));
            break;
        }
    }

}

var removeCustomMacro = function(name, macro){
    
    for (var i = 0; i < customMacroList.length; i++) {
        //console.log(customMacroList[i].uri);
        if (customMacroList[i].macro == macro && customMacroList[i].name == name) {
            customMacroList.splice(i, 1);
            localStorage.setItem("custom_macro_list", JSON.stringify(customMacroList));
            break;
        }
    }

}

var addNewDeviceButtonEvent = function () {

    var ipEntered = document.getElementsByClassName("new_device_ip_input")[0].value;

    if (ipAddressIsValid(ipEntered)) {

        if (!moteServerActive || moteServerAddress == null) {
            setMoteServer(ipEntered);
        }

        document.getElementById("devices_status_label").textContent = "Connecting to " + ipEntered;
        runPairing(ipEntered);
    } else {
        $(".ip_container").css("border-color", "#f00");
        setTimeout(function () {
            $(".ip_container").css("border-color", "#e8e9e9");
            setTimeout(function () {
                $(".ip_container").css("border-color", "#f00");
                setTimeout(function () {
                    $(".ip_container").css("border-color", "");
                    setTimeout(function () {
                        $("#ipaddress_abcd__octet_1").focus();
                        $("#ipaddress_abcd__octet_1").select();
                    }, 150);
                }, 150);
            }, 150);
        }, 150);
    }

    

};

var ipAddressIsValid = function (ip) {
    
    RegE = /^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/
    if (ip.match(RegE))
        return true;
    else
        return false;
    
}


var mainActive = true,
     altActive = false,
   touchActive = false,
 optionsActive = false,
   mouseLocked = false;

var showAltPanel = function () {

    if (!altActive) {

        $("#remote_button_panel_alt").animate({
            left: "0"
        }, 320, function () {
            // Animation complete.
            $("#alt_panel_button").toggleClass('title_open_alt_button title_close_alt_button');
        });
        $("#remote_button_panel_main").animate({
            left: "-320"
        }, 320, function () {
            // Animation complete.
        });

        altActive = true;
        mainActive = false;

    } else { 
        
        $("#remote_button_panel_alt").animate({
            left: "320"
        }, 320, function () {
            // Animation complete.
            $("#alt_panel_button").toggleClass('title_close_alt_button title_open_alt_button');
        });
        $("#remote_button_panel_main").animate({
            left: "0"
        }, 320, function () {
            // Animation complete.
        });

        altActive = false;
        mainActive = true;
    
    }


}

var showTouchPad = function () {

    if (!touchActive) {
                

        $("#remote_button_panel_touch").animate({
            left: "0"
        }, 320, function () {
            // Animation complete.
            document.getElementById("title_bar_title").textContent = "touch pad";

            $("#lock_mouse_button").css("display", "block");
            $("#alt_panel_button").css("display", "none");
            $("#touch_pad_open_button").toggleClass('title_open_touch_button title_close_alt_button');
        });


        if (!altActive) {
            $("#remote_button_panel_touch").css("background-image","url('images/bg_alt.png')");
            $("#remote_button_panel_main").animate({
                left: "-320"
            }, 320, function () {
                // Animation complete.                
            });
        } else {
            $("#remote_button_panel_touch").css("background-image","url('images/bg_touch.png')");
            $("#remote_button_panel_alt").animate({
                left: "-320"
            }, 320, function () {
                // Animation complete.
            });
        }

        touchActive = true;
    } else {

        $("#remote_button_panel_touch").animate({
            left: "320"
        }, 320, function () {
            // Animation complete.
            document.getElementById("title_bar_title").textContent = "remote";

            $("#lock_mouse_button").css("display", "none");
            $("#alt_panel_button").css("display", "block");
            $("#touch_pad_open_button").toggleClass('title_close_alt_button title_open_touch_button');
        });

        if (!altActive) {
            $("#remote_button_panel_main").animate({
                left: "0"
            }, 320, function () {
                // Animation complete.
            });
        } else {
            $("#remote_button_panel_alt").animate({
                left: "0"
            }, 320, function () {
                // Animation complete.
            });
        }

        touchActive = false;
    }

}

var toggleMouseLock = function () {

    if (!mouseLocked) {
        $("#lock_mouse_button").toggleClass('title_mouse_unlocked_button title_mouse_locked_button');
        mouseLocked = true;
    } else {
        $("#lock_mouse_button").toggleClass('title_mouse_locked_button title_mouse_unlocked_button');
        mouseLocked = false;
    }

}

var showOptionsPanel = function (enable) {

    if (enable != null) {
        optionsActive = !enable;
    }

    if (!optionsActive) { //Open Options

        $("#options_panel_container").animate({
            bottom: "50"
        }, 320, function () {
            // Animation complete.

            document.getElementById("title_bar_title").textContent = "options";
            $("#title_bar_title").css("width", "192");
            $("#options_close_button").css("display", "block");

            if (touchActive) {
                $("#lock_mouse_button").css("display", "none");
                $("#touch_pad_open_button").css("display", "none");
            } else {
                $("#touch_pad_open_button").css("display", "none");
                $("#alt_panel_button").css("display", "none");
            }

        });

        optionsActive = true;
        disableKeyBoardEvents();

    } else { //Close Options

        $("#options_panel_container").animate({
            bottom: "-286"
        }, 320, function () {
            // Animation complete.    

            $("#options_close_button").css("display", "none");
            $("#title_bar_title").css("width", "128");

            if (touchActive) {
                document.getElementById("title_bar_title").textContent = "touch pad";

                $("#lock_mouse_button").css("display", "block");
                $("#touch_pad_open_button").css("display", "block");
            } else {
                document.getElementById("title_bar_title").textContent = "remote";

                $("#lock_mouse_button").css("display", "none");
                $("#touch_pad_open_button").css("display", "block");
                $("#alt_panel_button").css("display", "block");

            }

            $("#options_panel_devices").css("display", "none");
            $("#options_panel_apps").css("display", "none");
            $("#options_panel_channels").css("display", "none");

            $("#device_selected").css("display", "none");
            $("#apps_selected").css("display", "none");
            $("#channels_selected").css("display", "none");

        });

        optionsActive = false;
        devices_options_active = false; apps_options_active = false; channels_options_active = false;
        enableKeyBoardEvents();
    }

}

var addDeviceFound = function (name, ip, current) {

    var deviceListEl = document.getElementById("devices_list");
    var deviceFoundID = ip.replaceAll('.','_');

    var newDeviceEl = document.createElement("div");
    if (!current) newDeviceEl.className = "device_found"; else newDeviceEl.className = "device_found_active";
    newDeviceEl.id = "" + deviceFoundID;
    $(newDeviceEl).attr("name",name);
                            
    newDeviceEl.innerHTML = "<div class='device_found_ip'>" + ip + "</div><input class='device_found_name_input' value='" + getSavedName(name, ip) + "' disabled></input><div class='device_found_rename_save_button' id='rename_" + deviceFoundID + "'>save</div>";

    newDeviceEl.addEventListener("click", function () {
        if( !hasClass(document.getElementById(deviceFoundID),"device_renaming") ){
            var ipAddress = this.id.replaceAll('_','.');
            document.getElementById("devices_status_label").textContent = "Connecting to "+ ipAddress;
            runPairing(ipAddress);            
        }        
    });
    
    $(newDeviceEl).mouseup(function (e) {
        if( !hasClass(document.getElementById(deviceFoundID),"device_renaming") )
            if (e.button == 2) { //Right mouse button
                //console.log("Right Click");
                showContextMenu(event.x, event.y, this.id, $(this).attr("name"), "device");
                return false;
            } else {
                
            }
        return true;
    });

    deviceListEl.appendChild(newDeviceEl);

    //KeyPress Listener for Enter press on rename text input.
    $(document.getElementById(deviceFoundID).getElementsByClassName("device_found_name_input")).keypress(function (e) {
        if (e.which == 13) { //Enter Press
            $(document.getElementById(deviceFoundID).getElementsByClassName("device_found_rename_save_button")).click();
        }
    });
    
    //Click Listener for saving changes to device name.
    document.getElementById( 'rename_' + deviceFoundID ).addEventListener("click", function () {

        var newName = document.getElementById(deviceFoundID).getElementsByClassName("device_found_name_input")[0].value;
        if( newName != "" ){
            console.log("Renamed "+ deviceFoundID.replaceAll("_","."));

            $(document.getElementById(deviceFoundID).getElementsByClassName("device_found_name_input")).attr({'disabled':'disabled'});
            $(document.getElementById(deviceFoundID).getElementsByClassName("device_found_rename_save_button")).css("display","none");
            setTimeout(function(){ document.getElementById(deviceFoundID).className = document.getElementById(deviceFoundID).className.replace(" device_renaming",""); },"50");
                        
            if(newName == name) newName = "";
            addNewSavedDevice(name, ip, newName);            
        } else {
            $(document.getElementById(deviceFoundID).getElementsByClassName("device_found_name_input")).css("border-color", "#f00");
            setTimeout(function () {
                $(document.getElementById(deviceFoundID).getElementsByClassName("device_found_name_input")).css("border-color", "#e8e9e9");
                setTimeout(function () {
                    $(document.getElementById(deviceFoundID).getElementsByClassName("device_found_name_input")).css("border-color", "#f00");
                    setTimeout(function () {
                        $(document.getElementById(deviceFoundID).getElementsByClassName("device_found_name_input")).css("border-color", "");
                        setTimeout(function () {                            
                            $(document.getElementById(deviceFoundID).getElementsByClassName("device_found_name_input")).focus();
                            $(document.getElementById(deviceFoundID).getElementsByClassName("device_found_name_input")).select();
                        }, 150);
                    }, 150);
                }, 150);
            }, 150);

        }

        

    });
}


var addNewSavedDevice = function(originalName, ip, newName){

    var existingFound = false;
    if(!newName) newName = "";

    if(newName != ""){

        //FIND EXISTING DEVICE IN THE LIST
        for(var i=0 ; i < savedDeviceList.length ; i++){
            //UPDATE IF ELEMENT FOUND WITH MATCHING ORIGINALNAME AND IP
            if(savedDeviceList[i].originalName == originalName && savedDeviceList[i].ip == ip){
                if( savedDeviceList[i].name != newName)
                    savedDeviceList[i].name  = newName;
                existingFound = true;
                break;
            }
        }

        //IF NOT FOUND AND NEW NAME FOUND, THEN ADD TO SAVEDDEVICES JSON ARRAY 
        if(!existingFound){
            var jsonObjectString = '{ "originalName" : "' + originalName + '", "ip" : "' + ip + '", "name" : "' + newName + '" }';
            var jsonObject = JSON.parse(jsonObjectString);
            savedDeviceList.push(jsonObject);    
        }

        savedDeviceList.sort(function (a, b) {
            if (a.name < b.name) {
                return -1;
            }
            else if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
        localStorage.setItem("saved_device_list", JSON.stringify(savedDeviceList));
        
    }
        
}

var delSavedDevice = function(originalName, ip){

    //FIND AND REMOVE DEVICE WITH ORIGINAL NAME AND IP
    console.log(originalName);
    console.log(ip);

    for(var i=0 ; i < savedDeviceList.length ; i++){        
        if(savedDeviceList[i].originalName == originalName && savedDeviceList[i].ip == ip){
            savedDeviceList.splice(i, 1);
            localStorage.setItem("saved_device_list", JSON.stringify(savedDeviceList));
            break;
        }
    }

}

var getSavedName = function(name, ip){    
    for(var i=0 ; i < savedDeviceList.length ; i++)
        if(savedDeviceList[i].originalName == name && savedDeviceList[i].ip == ip)
            return savedDeviceList[i].name;
    return name;
}


var pairingTo = "";
var runPairing = function (address) {
    pairingTo = address;
    connectDevice(address);
    var deviceFoundID = pairingTo.replaceAll('.','_');

    $("#loaderImage").css("display", "block");
    $("#devices_refresh_button").css("display", "none");

    var timeoutCount = 0;

    var pinWaitLoop = setInterval(function () {

        isAwaitingPin(function (response) {
            if (JSON.parse(response).isAwaitingPin) {
                showAddPinInputBox();
                clearInterval(pinWaitLoop);
                clearTimeout(pinWaitTimeout);
            } else {
                connectSuccessOrFail(function (response) {

                    if (JSON.parse(response).connectionSuccess && !JSON.parse(response).connectionFailed) {
                        //success, no fail
                        clearInterval(pinWaitLoop);
                        clearTimeout(pinWaitTimeout);
                        document.getElementById("devices_status_label").textContent = "Connected to " + pairingTo;
                        console.log("pairingTo "+pairingTo);
                        $("#loaderImage").css("display", "none");
                        $("#devices_refresh_button").css("display", "block");

                        
                        if (document.getElementById(deviceFoundID) != null) 
                            document.getElementById(deviceFoundID).className = "device_found_active";
                        else
                            addDeviceFound("Google TV Device", address, true);

                        if (document.getElementsByClassName("new_device_ip_input").length > 0)
                            $("#add_new_device").remove();

                        $("#enter_pin_code_container").remove();

                        discoverDevices();

                        showOptionsPanel();

                    } else if (!JSON.parse(response).connectionSuccess && JSON.parse(response).connectionFailed) {
                        //no success, fail
                        clearInterval(pinWaitLoop);
                        clearTimeout(pinWaitTimeout);
                        document.getElementById("devices_status_label").textContent = "Pairing failed";
                        $("#loaderImage").css("display", "none");
                        $("#devices_refresh_button").css("display", "block");

                        if (document.getElementById(deviceFoundID) != null) 
                            document.getElementById(deviceFoundID).className = "device_found";

                        //runPairing(pairingTo);

                    } else if (!JSON.parse(response).connectionSuccess && !JSON.parse(response).connectionFailed) {
                        //no success, no fail
                                            

                    }

                });


            }

        });

    }, 1000);

    var pinWaitTimeout = setTimeout(function () {
        clearInterval(pinWaitLoop);
        document.getElementById("devices_status_label").textContent = address.replaceAll('_','.') + " did not respond";
        $("#loaderImage").css("display", "none");
        $("#devices_refresh_button").css("display", "block");
    }, 15000);

}


var discoveryLoop = null;
var runDiscovery = function () {

    clearInterval(discoveryLoop);
    discoverDevices();

    document.getElementById("devices_status_label").textContent = "Discovering devices";
    $("#loaderImage").css("display", "block");
    $("#devices_refresh_button").css("display", "none");

    discoveryLoop = setInterval(function () {



        if (document.getElementById("devices_status_label").textContent.indexOf("Discovering devices") >= 0)
            document.getElementById("devices_status_label").textContent = document.getElementById("devices_status_label").textContent + ".";

        isDiscovering(function (response) {

            if (!JSON.parse(response).isDiscovering) {
                clearInterval(discoveryLoop);
                $("#loaderImage").css("display", "none");
                $("#devices_refresh_button").css("display", "block");
            }
            getDeviceList(function (responseText) {
                try {
                    var tvDevices = JSON.parse(responseText);
                    //document.getElementById('ip_address_box').value = tvDevices[0].address;

                    //console.log(responseText);

                    //Clear UI List and update it with new results.
                    document.getElementById("devices_list").innerHTML = "";

                    var updatedDeviceList = JSON.parse(responseText);
                    for (var i = 0; i < updatedDeviceList.length; i++)
                        addDeviceFound(updatedDeviceList[i].name, updatedDeviceList[i].address, updatedDeviceList[i].current);

                    var statusMsg = "";
                    if (updatedDeviceList.length == 1)
                        statusMsg = updatedDeviceList.length + " Google TV found";
                    else
                        statusMsg = updatedDeviceList.length + " Google TVs found";


                    document.getElementById("devices_status_label").textContent = statusMsg;

                } catch (e) { console.log('No devices found.'); }
            });

        });


    }, 1000);


    setTimeout(function(){
        clearInterval(discoveryLoop);
        $("#loaderImage").css("display", "none");
        $("#devices_refresh_button").css("display", "block");
        if (document.getElementById("devices_status_label").textContent.indexOf("Discovering devices") >= 0)
            document.getElementById("devices_status_label").textContent = "Discovery timed out";
    },15000);

}


borderColorsEnabled = true;


var initAppIntents = function(){
    
    //$("#app_AAAAAA").click(     function () { fling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA;end');     });

    //$("#app_amazon").click(      function () { fling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.amazon.avod/.MainActivity;end');  showOptionsPanel();   });

    $("#app_chrome").click(      function () { fling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.google.tv.chrome/com.google.tv.chrome.HubActivity;end');  showOptionsPanel();   });

    $("#app_clock").click(       function () { fling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.android.deskclock/.DeskClock;end');  showOptionsPanel();   });

    //$("#app_cnbc").click(        function () { fling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.nbc.cnbc.android.googletv/.ui.Splash;end');  showOptionsPanel();   });

    $("#app_downloads").click(   function () { fling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.android.providers.downloads.ui/.DownloadList;end');  showOptionsPanel();   });

    $("#app_search").click(      function () { fling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.android.quicksearchbox/.SearchActivity;end');  showOptionsPanel();   });

    //$("#app_mgo").click(         function () { fling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.technicolor.navi.mgo.gtv/com.technicolor.navi.mgo.gtv.MainActivity;end');  showOptionsPanel();   });
    
    $("#app_movies").click(      function () { fling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.google.android.videos/com.google.android.youtube.videos.EntryPoint;end');  showOptionsPanel();   });

    $("#app_music").click(       function () { fling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.google.android.music/com.android.music.activitymanagement.TopLevelActivity;end');  showOptionsPanel();   });

    //$("#app_nba").click(         function () { fling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.nbadigital.gametimegtv/.ActivityManager;end');  showOptionsPanel();   });
    
    $("#app_netflix").click(     function () { fling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.google.tv.netflix/com.google.tv.netflix.NetflixActivity;end');  showOptionsPanel();   });

    //$("#app_onlive").click(      function () { fling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.onlive.clientgtv/.OnLiveClientGTVActivity;end');  showOptionsPanel();   });
    
    $("#app_pandora").click(     function () { fling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.pandora.android.gtv/com.pandora.android.Main;end');  showOptionsPanel();   });

    $("#app_photos").click(      function () { fling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.google.tv.mediabrowser/com.google.tv.mediabrowser.newui.MainActivity;end');  showOptionsPanel();   });

    //$("#app_plex").click(        function () { fling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.plexapp.gtv/com.plexapp.gtv.activities.MyPlexActivity;end');  showOptionsPanel();   });

    $("#app_primetime").click(   function () { fling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.google.tv.alf/com.google.tv.alf.ui.MainActivity;end');  showOptionsPanel();   });

    $("#app_store").click(       function () { fling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.android.vending/com.android.vending.AssetBrowserActivity;end');  showOptionsPanel();   });

    $("#app_tv").click(          function () { fling('tv://');  showOptionsPanel();   });

    $("#app_twitter").click(     function () { fling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.twitter.android.tv/com.twitter.android.LoginActivity;end');  showOptionsPanel();   });

    $("#app_youtube").click(     function () { fling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.google.android.youtube.googletv/com.google.android.youtube.googletv.MainActivity;end');  showOptionsPanel();   });

    $("#app_settings").click(     function () { fling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.google.tv.settings/com.google.tv.settings.Settings;end');  showOptionsPanel();   });
}

var gridster = null;
var draggableButtonsEnabled = false;
//Init drag/drop sorting.
$(function () { //DOM Ready
    
    gridster = $(".gridster ul").gridster({
        widget_margins: [0, 0],
        widget_base_dimensions: [64, 48],
        shift_larger_widgets_down: false,
        max_rows: 7,
        max_cols: 5,
        min_rows: 7,
        min_cols: 5,
        max_size_x: 5,
        max_size_y: 7
    }).data('gridster');

    //console.log(gridster.serialize());
    //gridster.disable();

});
var enableDraggableButtons = function () { 
    draggableButtonsEnabled = true;
    gridster.enable();
}
var disableDraggableButtons = function () { 
    draggableButtonsEnabled = false;
    gridster.disable();
}

var touchPadMouseDown = false;
var mouseDownX = 0;
var mouseDownY = 0;
var currentY = 0;
var mouseMoved = false;

var initTouchPadEvents = function () {

    $("#remote_touch_pad").on('mousedown', function (e) {

        $("#remote_touch_pad").css("height", "431");
        $("#remote_button_panels").css("z-index", "3");

        touchPadMouseDown = true;

        mouseMoved = false;

    });

    $("#remote_touch_pad").on('mouseup', function (e) {

        $("#remote_touch_pad").css("height", "239");
        $("#remote_button_panels").css("z-index", "1");

        touchPadMouseDown = false;

        if (!mouseMoved) {
            //send click
            sendKeyCode("BTN_MOUSE");
        }
        mouseMoved = false;
    });

    $("#remote_touch_pad").on('mouseout', function () {

        $("#remote_touch_pad").css("height", "239");
        $("#remote_button_panels").css("z-index", "1");

    });

    var prevX = -1;
    var prevY = -1;

    $("#remote_touch_pad").on('mousemove', function (e) {

        var currentX = e.clientX;
        var currentY = e.clientY;

        var deltaX = e.clientX - prevX;
        var deltaY = e.clientY - prevY;



        if (touchPadMouseDown) {

            //console.log(e);
            sendMovement(deltaX, deltaY);
            //console.log(deltaX + "  " + deltaY);
        }


        if (mouseDownX != e.clientX && mouseDownY != e.clientY && !mouseMoved)
            mouseMoved = true;
        prevX = e.clientX;
        prevY = e.clientY;
    });

    //$('#remote_touch_pad').bind('mousewheel', function(event, delta) {

    //this.scrollLeft -= (delta * 30);

    //event.preventDefault();

    //console.log(event);

    //sendScroll(scrollX, scrollY);

    //});

    //adding the event listerner for Mozilla
    if (window.addEventListener)
        document.getElementById("remote_touch_pad").addEventListener('DOMMouseScroll', moveObject, false);

    //for IE/OPERA etc
    document.getElementById("remote_touch_pad").onmousewheel = moveObject;

    function moveObject(event) {

        var delta = 0;

        if (!event) event = window.event;

        // normalize the delta
        if (event.wheelDelta) {

            // IE and Opera
            delta = event.wheelDelta / 60;

        } else if (event.detail) {

            // W3C
            delta = -event.detail / 2;
        }

        //var currPos=document.getElementById('scroll').offsetTop;

        //calculating the next position of the object
        var currPos = (delta);
        console.log(currPos);

        sendScroll(0, currPos);
        //moving the position of the object
        //document.getElementById('scroll').style.top = currPos+"px";
        //document.getElementById('scroll').innerHTML = event.wheelDelta + ":" + event.detail;

    }


}




var enableKeyBoardEvents = function() {
	
	document.body.addEventListener('keydown', keyBoardEvents,false);
	console.log('Enabled keyboard mode.');
	//showKeyboardIcon();
	
}

var disableKeyBoardEvents = function() {
	
	document.body.removeEventListener('keydown', keyBoardEvents, false);
	console.log('Disabled keyboard mode.');
	//hideKeyboardIcon();
}

var keyBoardEvents = function(e) {
	
	if(true)//check if connected.
	{	
		var keyCodeSent = false;
	    switch (e.keyCode) {
	    case 36:            
	  	  	sendKeyCode("KEYCODE_HOME");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 46:                         //Delete key is made to act as Back commmand.
	  	  	sendKeyCode("KEYCODE_BACK"); //User  about this but I like it. :( Custom keys later. :)
	    	//sendKeyCode("KEYCODE_DEL");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 48:
	  	  	sendKeyCode("KEYCODE_NUM0");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 49:
	  	  	sendKeyCode("KEYCODE_NUM1");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 50:
	  	  	sendKeyCode("KEYCODE_NUM2");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 51:
	  	  	sendKeyCode("KEYCODE_NUM3");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 52:
	  	  	sendKeyCode("KEYCODE_NUM4");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 53:
	  	  	sendKeyCode("KEYCODE_NUM5");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 54:
	  	  	sendKeyCode("KEYCODE_NUM6");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 55:
	  	  	sendKeyCode("KEYCODE_NUM7");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 56:
	  	  	sendKeyCode("KEYCODE_NUM8");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 57:
	  	  	sendKeyCode("KEYCODE_NUM9");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 106:
	    	sendKeyCode("KEYCODE_STAR");
	    	keyCodeSent = true;
	  	  	break;
	    case 37:
	        sendKeyCode("KEYCODE_DPAD_LEFT");
	        keyCodeSent = true;
	  	  	break;
	    case 38:
	        sendKeyCode("KEYCODE_DPAD_UP");
	        keyCodeSent = true;
	  	  	break;
	    case 39:
	        sendKeyCode("KEYCODE_DPAD_RIGHT");
	        keyCodeSent = true;
	  	  	break;
	    case 40:
	        sendKeyCode("KEYCODE_DPAD_DOWN");
	        keyCodeSent = true;
	  	  	break;
	    case 123:
	        sendKeyCode("KEYCODE_VOLUME_UP");
	        keyCodeSent = true;
	  	  	break;
	    case 122:
	        sendKeyCode("KEYCODE_VOLUME_DOWN");
	        keyCodeSent = true;
	  	  	break;
	    case 65:
	  	  	sendKeyCode("KEYCODE_A");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 66:
	  	  	sendKeyCode("KEYCODE_B");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 67:
	  	  	sendKeyCode("KEYCODE_C");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 68:
	  	  	sendKeyCode("KEYCODE_D");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 69:
	  	  	sendKeyCode("KEYCODE_E");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 70:
	  	  	sendKeyCode("KEYCODE_F");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 71:
	  	  	sendKeyCode("KEYCODE_G");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 72:
	  	  	sendKeyCode("KEYCODE_H");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 73:
	  	  	sendKeyCode("KEYCODE_I");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 74:
	  	  	sendKeyCode("KEYCODE_J");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 75:
	  	  	sendKeyCode("KEYCODE_K");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 76:
	  	  	sendKeyCode("KEYCODE_L");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 77:
	  	  	sendKeyCode("KEYCODE_M");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 78:
	  	  	sendKeyCode("KEYCODE_N");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 79:
	  	  	sendKeyCode("KEYCODE_O");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 80:
	  	  	sendKeyCode("KEYCODE_P");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 81:
	  	  	sendKeyCode("KEYCODE_Q");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 82:
	  	  	sendKeyCode("KEYCODE_R");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 83:
	  	  	sendKeyCode("KEYCODE_S");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 84:
	  	  	sendKeyCode("KEYCODE_T");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 85:
	  	  	sendKeyCode("KEYCODE_U");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 86:
	  	  	sendKeyCode("KEYCODE_V");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 87:
	  	  	sendKeyCode("KEYCODE_W");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 88:
	  	  	sendKeyCode("KEYCODE_X");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 89:
	  	  	sendKeyCode("KEYCODE_Y");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 90:
	  	  	sendKeyCode("KEYCODE_Z");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 188:
	    	sendKeyCode("KEYCODE_COMMA");
	    	keyCodeSent = true;
	  	  	break;
	    case 190:
	  	  	sendKeyCode("KEYCODE_PERIOD");
	  	  	keyCodeSent = true;
	  	  	break;
	    case 9:
	        sendKeyCode("KEYCODE_TAB");
	        keyCodeSent = true;
	  	  	break;
	    case 32:
	        sendKeyCode("KEYCODE_SPACE");
	        keyCodeSent = true;
	  	  	break;    
	    case 13:
	        sendKeyCode("KEYCODE_ENTER");
	        keyCodeSent = true;
	  	  	break; 
	    case 8:
	        sendKeyCode("KEYCODE_DEL");
	        keyCodeSent = true;
	  	  	break; 
	    case 192:
	        sendKeyCode("KEYCODE_GRAVE");
	        keyCodeSent = true;
	  	  	break; 
	    case 189:
	        sendKeyCode("KEYCODE_MINUS");
	        keyCodeSent = true;
	  	  	break; 
	    case 186:
	        sendKeyCode("KEYCODE_SEMICOLON");
	        keyCodeSent = true;
	  	  	break; 
	    case 187:
	        sendKeyCode("KEYCODE_EQUALS");
	        keyCodeSent = true;
	  	  	break; 
	    case 219:
	        sendKeyCode("KEYCODE_LEFT_BRACKET");
	        keyCodeSent = true;
	  	  	break;  
	    case 221:
	        sendKeyCode("KEYCODE_RIGHT_BRACKET");
	        keyCodeSent = true;
	  	  	break;  
	    case 220:
	        sendKeyCode("KEYCODE_BACKSLASH");
	        keyCodeSent = true;
	  	  	break;    
	    case 222:
	        sendKeyCode("KEYCODE_APOSTROPHE");
	        keyCodeSent = true;
	  	  	break;    
	    case 191:
	        sendKeyCode("KEYCODE_SLASH");
	        keyCodeSent = true;
	  	  	break;    
	    case 107:
	        sendKeyCode("KEYCODE_PLUS");
	        keyCodeSent = true;
	  	  	break;    
	    case 35:
	        sendKeyCode("KEYCODE_SEARCH");
	        keyCodeSent = true;
	  	  	break;   
	    case 119:
	        sendKeyCode("KEYCODE_MEDIA_PLAY");
	        keyCodeSent = true;
	  	  	break;    
	    case 120:
	        sendKeyCode("KEYCODE_MEDIA_NEXT");
	        keyCodeSent = true;
	  	  	break;    
	    case 118:
	        sendKeyCode("KEYCODE_MEDIA_PREVIOUS");
	        keyCodeSent = true;
	  	  	break; 
	    case 121:
	        sendKeyCode("KEYCODE_MUTE");
	        keyCodeSent = true;
	  	  	break;
	    case 16:
	        sendKeyCode("KEYCODE_SHIFT_LEFT");
	        keyCodeSent = true;
	  	  	break;
	    case 17:
	    	//sendKeyCode("KEYCODE_SEARCH");
	    	sendKeyCode("KEYCODE_CTRL_LEFT");
	        keyCodeSent = true;
	  	  	break;
	    case 18:
	        //sendKeyCode("KEYCODE_MENU");
	        sendKeyCode("KEYCODE_ALT_LEFT");
	        keyCodeSent = true;
	  	  	break;
	    case 45:
	        sendKeyCode("KEYCODE_INSERT");
	        keyCodeSent = true;
	  	  	break;
	    case 19:
	        sendKeyCode("KEYCODE_PAUSE");
	        keyCodeSent = true;
	  	  	break;  
	    case 33:
	        sendKeyCode("KEYCODE_PAGE_UP");
	        keyCodeSent = true;
	  	  	break;   
	    case 34:
	        sendKeyCode("KEYCODE_PAGE_DOWN");
	        keyCodeSent = true;
	  	  	break;     
	    case 124:
	        sendKeyCode("KEYCODE_PRINT_SCREEN");
	        keyCodeSent = true;
	  	  	break;
	    case 20:
	        sendKeyCode("KEYCODE_CAPS_LOCK");
	        keyCodeSent = true;
	  	  	break;   
	    case 27:
	        sendKeyCode("KEYCODE_ESCAPE");
	        keyCodeSent = true;
	  	  	break;
	    case 113:
	        sendKeyCode("KEYCODE_BTN_FORWARD");
	        keyCodeSent = true;
	  	  	break;
	    case 112:
	        sendKeyCode("KEYCODE_BTN_BACK");
	        keyCodeSent = true;
	  	  	break;
	    case 114:
	        sendKeyCode("KEYCODE_INFO");
	        keyCodeSent = true;
	  	  	break;
	    case 115:
	        sendKeyCode("KEYCODE_WINDOW");
	        keyCodeSent = true;
	  	  	break;
	    case 116:
	        sendKeyCode("KEYCODE_MENU");
	        keyCodeSent = true;
	  	  	break;
	    case 117:
	        sendKeyCode("KEYCODE_BOOKMARK");
	        keyCodeSent = true;
	  	  	break;
	    }	       
	    if(keyCodeSent)
	    {
	    	//backgroundPageWindow.console.log('Keyboard code \'' + e.keyCode +'\' was sent to connected device.'); //For Debug use only. Disable for security reasons. 
	    	//console.log('Keyboard code \'' + 'SECURED' +'\' was sent to connected device.');	    	
	    }	    
	}
	else
	{
		//backgroundPageWindow.console.log('Keyboard code \'' + e.keyCode +'\' was not sent because no anymote session is active.'); //For Debug use only. Disable for security reasons.
		//console.log('Keyboard code \'' + 'SECURED' +'\' was not sent because no anymote session is active.');
	}
	//indicatorFlash();	
};


//Replaces an occurance of a substring within a string with another substring.
String.prototype.replaceAll = function( token, newToken, ignoreCase ) {
    var _token;
    var str = this + "";
    var i = -1;

    if ( typeof token === "string" ) {

        if ( ignoreCase ) {

            _token = token.toLowerCase();

            while( (
                i = str.toLowerCase().indexOf(
                    token, i >= 0 ? i + newToken.length : 0
                ) ) !== -1
            ) {
                str = str.substring( 0, i ) +
                    newToken +
                    str.substring( i + token.length );
            }

        } else {
            return this.split( token ).join( newToken );
        }

    }
    return str;
};

String.prototype.stripHTML = function() {
    var str = this + "";
    var strippedText = $("<div/>").html(str).text();
    return strippedText;
};

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}