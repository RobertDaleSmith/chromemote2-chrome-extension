//Event Tracking Init--------------------------------------------------
if(chrome.extension.getURL("/").indexOf("bhcjclaangpnjgfllaoodflclpdfcegb") >= 0)
{
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-34201638-1']);
    _gaq.push(['_trackPageview']);
    (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = 'https://ssl.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
    console.log("__CWS_MODE__");
}
else
    console.log("__DEV_MODE__");

var backgroundPageWindow = chrome.extension.getBackgroundPage(),
     anyMotePluginActive = backgroundPageWindow.anyMotePluginActive,
         gTvPluginLoaded = backgroundPageWindow.gTvPluginLoaded;

//App UI Logic--------------------------------------------------

var isInPopUpMode   = false; if(document.URL.indexOf("?pop") != -1)    isInPopUpMode   = true;
var isInPopOutMode  = false; if(document.URL.indexOf("?popout") != -1) isInPopOutMode  = true;
var isInFullTabMode = false; if(document.URL.indexOf("?tab") != -1)    isInFullTabMode = true;
if( isInFullTabMode )     { console.log("Full Tab Mode Starting...");
} else if (isInPopUpMode) { console.log("Popup Mode Starting..."   );
} else                    { console.log("Misc Mode Starting..."    ); }

var devices_options_active  = false,
    apps_options_active     = false,
    channels_options_active = false;

var installAppsList = [];
if(localStorage.getItem("apps_installed_list")){
    installAppsList = JSON.parse( localStorage.getItem("apps_installed_list") );    
}

var channelsList = [];
if(localStorage.getItem("system_channels_list")){
    channelsList = JSON.parse( localStorage.getItem("system_channels_list") );    
}

var savedDeviceList = [];
if(localStorage.getItem("saved_device_list")){
    savedDeviceList = JSON.parse( localStorage.getItem("saved_device_list") );    
}

var borderColorsEnabled = false, themeHexColor = "#000000";
if(localStorage.getItem("theme_colors")!= null) {
    borderColorsEnabled = JSON.parse(localStorage.getItem("theme_colors")).borders;
          themeHexColor = JSON.parse(localStorage.getItem("theme_colors")).baseColor;
}

var undoCountDownInterval = null;
var buttonLayoutJson = [];                      //Load saved button layout if exist.
var touchButtonLayoutJson = [];
var undoButtonLayoutJSON = [];  var undoLayoutFound = false;
function initUndoDefaults() {
    if( localStorage.getItem("button_layout_undo") ){
        var date      = new Date(), 
            timeThen  = JSON.parse( localStorage.getItem("button_layout_undo") ).time,            
            timeNow   = date.getTime(),
            timeSince = timeNow - timeThen,
            timeLeft  = 60000 - timeSince;
        if( timeSince <= 60000 ) {
            undoButtonLayoutJSON = JSON.parse( localStorage.getItem("button_layout_undo") ).layout;
            $("#undo_default_reset").css("display","block");
            undoLayoutFound = true;
            setTimeout(function(){ undoTimeout(); }, timeLeft);
            undoCountDownInterval = setInterval(function(){ 
                var date      = new Date(), 
                    timeThen  = JSON.parse( localStorage.getItem("button_layout_undo") ).time,            
                    timeNow   = date.getTime(),
                    timeSince = timeNow - timeThen,
                    timeLeft  = 60000 - timeSince,
                  percentLeft = (timeLeft / 60000) * 100;
                   pixelWidth = Math.round($("#undo_default_timeleft_holder").width() * percentLeft / 100);
                $("#undo_default_timeleft").css("width", Math.round(percentLeft)+"%");
                //$("#undo_default_timeleft").css("width", pixelWidth+"px");
            }, 500);
        } else undoTimeout();
    }
}
function undoTimeout(){
    if(undoLayoutFound){
        $("#undo_default_reset").css("display","none");
        undoLayoutFound = false;
        if(localStorage.getItem("button_layout_undo")) localStorage.removeItem("button_layout_undo");
        if(undoCountDownInterval) window.clearInterval(undoCountDownInterval);
    }
}

var gridster = [];
var draggableButtonsEnabled = false, darkBackEnabled = false;
var defaultButtonLayoutStr = '[{"col":1,"row":1,"size_x":1,"size_y":1,"swap":false},{"col":2,"row":1,"size_x":1,"size_y":1,"swap":false},{"col":3,"row":1,"size_x":1,"size_y":1,"swap":false},{"col":4,"row":1,"size_x":1,"size_y":1,"swap":false},{"col":5,"row":1,"size_x":1,"size_y":1,"swap":false},{"col":1,"row":2,"size_x":1,"size_y":1,"swap":false},{"col":2,"row":2,"size_x":1,"size_y":1,"swap":false},{"col":3,"row":2,"size_x":1,"size_y":1,"swap":false},{"col":4,"row":2,"size_x":1,"size_y":1,"swap":false},{"col":5,"row":2,"size_x":1,"size_y":1,"swap":false},{"col":1,"row":3,"size_x":1,"size_y":2,"swap":false},{"col":2,"row":3,"size_x":1,"size_y":1,"swap":false},{"col":3,"row":3,"size_x":1,"size_y":1,"swap":false},{"col":4,"row":3,"size_x":1,"size_y":1,"swap":false},{"col":5,"row":3,"size_x":1,"size_y":2,"swap":false},{"col":2,"row":4,"size_x":1,"size_y":1,"swap":false},{"col":3,"row":4,"size_x":1,"size_y":1,"swap":false},{"col":4,"row":4,"size_x":1,"size_y":1,"swap":false},{"col":1,"row":5,"size_x":1,"size_y":2,"swap":false},{"col":2,"row":5,"size_x":1,"size_y":1,"swap":false},{"col":3,"row":5,"size_x":1,"size_y":1,"swap":false},{"col":4,"row":5,"size_x":1,"size_y":1,"swap":false},{"col":5,"row":5,"size_x":1,"size_y":1,"swap":false},{"col":2,"row":6,"size_x":1,"size_y":1,"swap":false},{"col":3,"row":6,"size_x":1,"size_y":1,"swap":false},{"col":4,"row":6,"size_x":1,"size_y":1,"swap":false},{"col":5,"row":6,"size_x":1,"size_y":1,"swap":false},{"col":1,"row":7,"size_x":1,"size_y":1,"swap":false},{"col":2,"row":7,"size_x":1,"size_y":1,"swap":false},{"col":3,"row":7,"size_x":1,"size_y":1,"swap":false},{"col":4,"row":7,"size_x":1,"size_y":1,"swap":false},{"col":5,"row":7,"size_x":1,"size_y":1,"swap":false},{"col":1,"row":1,"size_x":1,"size_y":1,"swap":false},{"col":2,"row":1,"size_x":1,"size_y":1,"swap":false},{"col":3,"row":1,"size_x":1,"size_y":1,"swap":false},{"col":4,"row":1,"size_x":1,"size_y":1,"swap":false},{"col":5,"row":1,"size_x":1,"size_y":1,"swap":false},{"col":1,"row":2,"size_x":1,"size_y":1,"swap":false},{"col":2,"row":2,"size_x":1,"size_y":1,"swap":false},{"col":3,"row":2,"size_x":1,"size_y":1,"swap":false},{"col":4,"row":2,"size_x":1,"size_y":1,"swap":false},{"col":5,"row":2,"size_x":1,"size_y":1,"swap":false},{"col":1,"row":3,"size_x":1,"size_y":1,"swap":false},{"col":2,"row":3,"size_x":1,"size_y":1,"swap":false},{"col":3,"row":3,"size_x":1,"size_y":1,"swap":false},{"col":4,"row":3,"size_x":1,"size_y":1,"swap":false},{"col":5,"row":3,"size_x":1,"size_y":1,"swap":false},{"col":1,"row":4,"size_x":1,"size_y":1,"swap":false},{"col":2,"row":4,"size_x":1,"size_y":1,"swap":false},{"col":3,"row":4,"size_x":1,"size_y":1,"swap":false},{"col":4,"row":4,"size_x":1,"size_y":1,"swap":false},{"col":5,"row":4,"size_x":1,"size_y":1,"swap":false},{"col":1,"row":5,"size_x":1,"size_y":1,"swap":false},{"col":2,"row":5,"size_x":1,"size_y":1,"swap":false},{"col":3,"row":5,"size_x":1,"size_y":1,"swap":false},{"col":4,"row":5,"size_x":1,"size_y":1,"swap":false},{"col":5,"row":5,"size_x":1,"size_y":1,"swap":false},{"col":1,"row":6,"size_x":1,"size_y":2,"swap":false},{"col":2,"row":6,"size_x":1,"size_y":1,"swap":false},{"col":3,"row":6,"size_x":1,"size_y":1,"swap":false},{"col":4,"row":6,"size_x":1,"size_y":1,"swap":false},{"col":5,"row":6,"size_x":1,"size_y":1,"swap":false},{"col":2,"row":7,"size_x":1,"size_y":1,"swap":false},{"col":3,"row":7,"size_x":1,"size_y":1,"swap":false},{"col":4,"row":7,"size_x":1,"size_y":1,"swap":false},{"col":5,"row":7,"size_x":1,"size_y":1,"swap":false},{"col":1,"row":6,"size_x":1,"size_y":1},{"col":2,"row":6,"size_x":1,"size_y":1},{"col":3,"row":6,"size_x":1,"size_y":2},{"col":4,"row":6,"size_x":1,"size_y":2},{"col":5,"row":6,"size_x":1,"size_y":2},{"col":1,"row":7,"size_x":1,"size_y":1},{"col":2,"row":7,"size_x":1,"size_y":1}]';


document.onselectstart = function(){ return false; }
$(window).bind("load", function() { //Not after DOM, but after everything is loaded.
    
    initMoteServer();

    initAnyMoteNPAPI();

    if(!isInFullTabMode) initGridster();

    initUndoDefaults();   

    initMenuItemEvents();

    initAppIntents();

    initTouchPadEvents();

    initColorPicker();

    initLocalesTexts();

    initMoteServerIPSettings();
    
    initAdCarousel();
    
    enableKeyBoardEvents();
  
    setTimeout(function(){
        refreshCustomIntentListUI();
        refreshCustomMacroListUI();
        updateChannelsListUI();
        updateAppsListUI();
    },10);   

    $(".keycode").on('mousedown', function () {
        var thisButton = $(this);
        setTimeout(function () {             

            if (thisButton.is('.dragging') || $("#" + thisButton.attr('id')).parent().is('.dragging')) { return; }
            //console.log('down');
            sendKeyCode(thisButton.attr('id').replaceAll("_b2",""), true);

        }, 100);
    });

    $(".keycode").on('mouseup', function () {
        var thisButton = $(this);
        setTimeout(function () {      
            
            if (thisButton.is('.dragging') || $("#" + thisButton.attr('id')).parent().is('.dragging')) { return; }
            //console.log('up');
            sendKeyCode(thisButton.attr('id').replaceAll("_b2",""), false);

        }, 100);
    });
    
    $("#menu_button").click(function () {
        showSettingsMenuPanel();
    });

    $("#popout_mode_button").click(function () {
        chrome.windows.getAll({"populate":true}, function(windows){
            var found = false;
            for(var i=0; i<windows.length; i++)
                for(var n=0; n<windows[i].tabs.length; n++)
                    if(windows[i].tabs[n].url.indexOf("chromemote.html?popout") != -1){                        
                        chrome.windows.update(windows[i].tabs[n].windowId, {"focused":true, "state": "normal"});
                        found = true;
                        break;
                    }
            var titleBarHeight = 36;
            if (backgroundPageWindow.osDetected == 'CrOS') titleBarHeight = 28;
            if(!found) chrome.windows.create({'url': 'chromemote.html?popout', 'type': 'panel', 'width': 320, 'height': 480 + titleBarHeight, 'focused': true}, function(window) {  });
            window.close();
        });
    });

    $("#full_mode_button").click(function () {
        openCrxOptionsPage();
    });

    $("#alt_panel_button").click(function () {
        showAltPanel();
    });

    $("#touch_pad_open_button").click(function () {
        showTouchPad();
    });

    $("#lock_mouse_button").click(function () {
        toggleMouseLock();
    });

    var optAniSpeed = 600;
    var animationActive = false;

    $("#options_button_devices").click(function () {
        if (optionsActive && !devices_options_active) {
            if (apps_options_active) {
                //console.log("SLIDE CONTENT TO THE LEFT");
                
                //$("#options_panel_apps").stop().animate({ left: "0" }, 0, function () {  /*Animation complete.*/  });
                $("#options_panel_apps").css("z-index", "1");
                animationActive = true;
                $("#options_panel_apps").stop().animate({
                    left: "320"
                }, optAniSpeed, function () {
                    // Animation complete.
                    // $("#options_panel_apps").css("display", "none");
                    // $("#options_panel_apps").css("left", "0");
                    animationActive = false;
                });

                $("#options_panel_devices").stop().animate({ left: "-320" }, 0, function () {  /*Animation complete.*/  });
                $("#options_panel_devices").css("display", "block");
                $("#options_panel_devices").css("z-index", "2");
                $("#options_panel_devices").stop().animate({ left: "0" }, optAniSpeed*0.6, function () {  /*Animation complete.*/  });

                $("#options_panel_channels").css("display", "none");
            } 
            if (channels_options_active) {
                //console.log("SLIDE CONTENT TO THE RIGHT");

                //$("#options_panel_channels").stop().animate({ left: "0" }, 0, function () {  /*Animation complete.*/  });
                $("#options_panel_channels").css("z-index", "1");
                animationActive = true;
                $("#options_panel_channels").stop().animate({
                    left: "320"
                }, optAniSpeed, function () {
                    // Animation complete.
                    // $("#options_panel_channels").css("display", "none");
                    // $("#options_panel_channels").css("left", "0");
                    animationActive = false;
                });

                $("#options_panel_devices").stop().animate({ left: "-320" }, 0, function () {  /*Animation complete.*/  });
                $("#options_panel_devices").css("display", "block");
                $("#options_panel_devices").css("z-index", "2");
                $("#options_panel_devices").stop().animate({ left: "0" }, optAniSpeed*0.6, function () {  /*Animation complete.*/  });

                $("#options_panel_apps").css("display", "none");
            }
        } else if (!optionsActive || devices_options_active){
            showOptionsPanel();

            $("#options_panel_devices").css("left", "0");

            $("#options_panel_devices").css("display", "block");
            $("#options_panel_apps").css("display", "none");
            $("#options_panel_channels").css("display", "none");            
        } 

        $("#device_selected").css("display", "block");
        $("#apps_selected").css("display", "none");
        $("#channels_selected").css("display", "none");

        $("#options_button_devices").css("color", balanceSaturation(themeHexColor,"#dcdee0"));
        $("#options_button_apps").css("color", "#7a7b7d");
        $("#options_button_channels").css("color", "#7a7b7d");
        
        apps_options_active = false;
        devices_options_active = true;
        channels_options_active = false;
    });

    //Hide/shows menu button seperator when next to a clicked button...
    $("#options_button_devices").mousedown( function () { $(".options_button_seperator_left").css("border-color","#c6c7c9"); });
    $("#options_button_devices").mouseup(   function () { $(".options_button_seperator_left").css("border-color","#dcdee0"); });
    $("#options_button_devices").mouseleave(function () { $(".options_button_seperator_left").css("border-color","#dcdee0"); });

    $("#options_button_channels").mousedown( function () { $(".options_button_seperator_right").css("border-color","#c6c7c9"); });
    $("#options_button_channels").mouseup(   function () { $(".options_button_seperator_right").css("border-color","#dcdee0"); });
    $("#options_button_channels").mouseleave(function () { $(".options_button_seperator_right").css("border-color","#dcdee0"); });

    $("#options_button_apps").mousedown( function () { $(".options_button_seperator_left" ).css("border-color","#c6c7c9");
                                                       $(".options_button_seperator_right").css("border-color","#c6c7c9"); });
    $("#options_button_apps").mouseup(   function () { $(".options_button_seperator_left" ).css("border-color","#dcdee0");
                                                       $(".options_button_seperator_right").css("border-color","#dcdee0"); });
    $("#options_button_apps").mouseleave(function () { $(".options_button_seperator_left" ).css("border-color","#dcdee0");
                                                       $(".options_button_seperator_right").css("border-color","#dcdee0"); });

    $("#options_button_apps").click(function () {
        if (optionsActive && !apps_options_active) {
            if (devices_options_active) {
                //console.log("SLIDE CONTENT TO THE LEFT");

                //$("#options_panel_devices").stop().animate({ left: "0" }, 0, function () {  /*Animation complete.*/  });
                $("#options_panel_devices").css("z-index", "1");
                animationActive = true;
                $("#options_panel_devices").stop().animate({
                    left: "-320"
                }, optAniSpeed, function () {
                    // Animation complete.
                    // $("#options_panel_devices").css("display", "none");
                    // $("#options_panel_devices").css("left", "0");
                    animationActive = false;
                });

                $("#options_panel_apps").stop().animate({ left: "320" }, 0, function () {  /*Animation complete.*/  });
                $("#options_panel_apps").css("display", "block");
                $("#options_panel_apps").css("z-index", "2");
                $("#options_panel_apps").stop().animate({ left: "0" }, optAniSpeed*0.6, function () {  /*Animation complete.*/  });

                $("#options_panel_channels").css("display", "none");
            } 
            if (channels_options_active) {
                //console.log("SLIDE CONTENT TO THE RIGHT");

                //$("#options_panel_channels").stop().animate({ left: "0" }, 0, function () {  /*Animation complete.*/  });
                $("#options_panel_channels").css("z-index", "1");
                animationActive = true;
                $("#options_panel_channels").stop().animate({
                    left: "320"
                }, optAniSpeed, function () {
                    // Animation complete.
                    // $("#options_panel_channels").css("display", "none");
                    // $("#options_panel_channels").css("left", "0");
                    animationActive = false;
                });

                $("#options_panel_apps").stop().animate({ left: "-320" }, 0, function () {  /*Animation complete.*/  });
                $("#options_panel_apps").css("display", "block");
                $("#options_panel_apps").css("z-index", "2");
                $("#options_panel_apps").stop().animate({ left: "0" }, optAniSpeed*0.6, function () {  /*Animation complete.*/  });

                $("#options_panel_devices").css("display", "none");
            }
        } else if (!optionsActive || apps_options_active){
            showOptionsPanel();

            $("#options_panel_apps").css("left", "0");

            $("#options_panel_devices").css("display", "none");
            $("#options_panel_apps").css("display", "block");
            $("#options_panel_channels").css("display", "none");
            
        } 

        $("#device_selected").css("display", "none");
        $("#apps_selected").css("display", "block");
        $("#channels_selected").css("display", "none");

        $("#options_button_devices").css("color", "#7a7b7d");
        $("#options_button_apps").css("color", balanceSaturation(themeHexColor,"#dcdee0"));
        $("#options_button_channels").css("color", "#7a7b7d");        

        apps_options_active = true;
        devices_options_active = false;
        channels_options_active = false;
    });

    $("#options_button_channels").click(function () {

        if (optionsActive && !channels_options_active) {
            if (apps_options_active) {
                //console.log("SLIDE CONTENT TO THE RIGHT");
                
                //$("#options_panel_apps").stop().animate({ left: "0" }, 0, function () {  /*Animation complete.*/  });
                $("#options_panel_apps").css("z-index", "1");
                animationActive = true;
                $("#options_panel_apps").stop().animate({
                    left: "-320"
                }, optAniSpeed, function () {
                    // Animation complete.
                    // $("#options_panel_apps").css("display", "none");
                    // $("#options_panel_apps").css("left", "0");
                    animationActive = false;
                });

                $("#options_panel_channels").stop().animate({ left: "320" }, 0, function () {  /*Animation complete.*/  });
                $("#options_panel_channels").css("display", "block");
                $("#options_panel_channels").css("z-index", "2");
                $("#options_panel_channels").stop().animate({ left: "0" }, optAniSpeed*0.6, function () {  /*Animation complete.*/  });

                $("#options_panel_devices").css("display", "none");
            } 
            if (devices_options_active) {
                //console.log("SLIDE CONTENT TO THE RIGHT");

                //$("#options_panel_devices").stop().animate({ left: "0" }, 0, function () {  /*Animation complete.*/  });
                $("#options_panel_devices").css("z-index", "1");
                animationActive = true;
                $("#options_panel_devices").stop().animate({
                    left: "-320"
                }, optAniSpeed, function () {
                    // Animation complete.
                    // $("#options_panel_devices").css("display", "none");
                    // $("#options_panel_devices").css("left", "0");
                    animationActive = false;
                });

                $("#options_panel_channels").stop().animate({ left: "320" }, 0, function () {  /*Animation complete.*/  });
                $("#options_panel_channels").css("display", "block");
                $("#options_panel_channels").css("z-index", "2");
                $("#options_panel_channels").stop().animate({ left: "0" }, optAniSpeed*0.6, function () {  /*Animation complete.*/  });

                $("#options_panel_apps").css("display", "none");
            }
        } else if (!optionsActive || channels_options_active){
            showOptionsPanel();

            $("#options_panel_channels").css("left", "0");

            $("#options_panel_devices").css("display", "none");
            $("#options_panel_apps").css("display", "none");
            $("#options_panel_channels").css("display", "block");
            
        } 

        $("#device_selected").css("display", "none");
        $("#apps_selected").css("display", "none");
        $("#channels_selected").css("display", "block");

        $("#options_button_devices").css("color", "#7a7b7d");
        $("#options_button_apps").css("color", "#7a7b7d");
        $("#options_button_channels").css("color", balanceSaturation(themeHexColor,"#dcdee0"));

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

        if(backgroundPageWindow.anymoteSessionActive || !anyMotePluginActive){

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

                if(res != 'error'){

                    installAppsList = JSON.parse(res);
                    installAppsList.sort(function (a, b) {
                        if (a.name < b.name) { return -1; } else if (a.name > b.name) { return 1; }
                        return 0;
                    });
                    localStorage.setItem("apps_installed_list", JSON.stringify(installAppsList));
                    updateAppsListUI();
                    appsListUpdated = true;

                } else {

                    clearInterval(getAppsTimeOut);
                    $("#loaderImage2").css("display", "none");
                    $("#apps_sync_button").css("display", "block");
                    clearTimeout(clearMsgTimeOut);
                    document.getElementById("apps_status_label").textContent = "Unable to get apps list";
                    clearInterval(getAppsLoop);

                    var getAppsFailMsg = "Anymote Bridge not detected on the currently connected device.<br><br>Install or enable it on this Google&nbsp;TV device, then try again.<br><br><a href='http://chromemote.com/faq/anymote-bridge' target='_blank'>learn more..</a>";
                    buildDialogBox("Bridge Required", getAppsFailMsg, "Install", null, function(){
                        window.open("https://play.google.com/store/apps/details?id=com.motelabs.chromemote.bridge","_blank");
                        sendFling("market://details?id=com.motelabs.chromemote.bridge");
                    });
                    
                }           

            });

        } else {
            console.log("No Google TV's are connected.");
            showToast("Not Connected");
        }

    });

    var getChannelsLoop, getChannelsTimeOut, clearChMsgTimeOut;

    $("#update_channels_button").click(function () {

        if(backgroundPageWindow.anymoteSessionActive || !anyMotePluginActive){
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

                if(res != 'error'){

                    console.log(res);
                    channelsList = JSON.parse(res);
                    localStorage.setItem("system_channels_list", JSON.stringify(channelsList));
                    updateChannelsListUI();
                    channelsListUpdated = true;

                } else {

                    clearInterval(getChannelsTimeOut);
                    $("#loaderImage3").css("display", "none");
                    $("#update_channels_button").css("display", "block");
                    clearTimeout(clearChMsgTimeOut);
                    document.getElementById("channels_status_label").textContent = "Unable to get channels list";
                    clearInterval(getChannelsLoop);

                    var getChannelsFailMsg = "Anymote Bridge not detected on the currently connected device.<br><br>Install or enable it on this Google&nbsp;TV device, then try again.<br><br><a href='http://chromemote.com/faq/anymote-bridge' target='_blank'>learn more..</a>";
                    buildDialogBox("Bridge Required", getChannelsFailMsg, "Install", null, function(){
                        window.open("https://play.google.com/store/apps/details?id=com.motelabs.chromemote.bridge","_blank");
                        sendFling("market://details?id=com.motelabs.chromemote.bridge");                        
                    });
                    
                }    
                
            });
        } else {
            console.log("No Google TV's are connected.");
            showToast("Not Connected");
        }


    });

});   //END ONLOAD


//DISABLES right click globally.
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
            sendFling(this.id);
            showOptionsPanel();
        });

        document.getElementById("system_channels_list").appendChild(newAppEl);
    }
}


function initLocalesTexts(){
    document.getElementById("menu_panel_about_version_number").innerHTML = chrome.i18n.getMessage("version");    
}

var updateAppsListUI = function() {
    document.getElementById("apps_installed_list").textContent = "";

    for (var i = 0; i < installAppsList.length; i++) {

        var newAppEl = document.createElement("div");
        newAppEl.className = "installed_app_item";
        newAppEl.textContent = installAppsList[i].name;
        newAppEl.id = 'intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=' + installAppsList[i].packageName + '/' + installAppsList[i].activityName + ';end';

        $(newAppEl).click(function() {
            sendFling(this.id);
            showOptionsPanel();
        });

        document.getElementById("apps_installed_list").appendChild(newAppEl);
    }
}

var showAddPinInputBox = function(address) {

    //address = address.replaceAll(".","_");

    if (document.getElementsByClassName("new_device_ip_input").length > 0) {
        $("#add_new_device").remove();
    }

    if (document.getElementsByClassName("pair_code_input").length == 0) {

        var newDeviceInputEl = document.createElement("div");
        newDeviceInputEl.id = "enter_pin_code_container";
        newDeviceInputEl.setAttribute("ip", address);
        newDeviceInputEl.innerHTML = "<div id='cancel_pair_button'>cancel</div><input id='pair_code_input_box' class='pair_code_input' type='text' placeholder='enter pin' maxlength='4' /><div id='send_pair_code_button'>connect</div>";

        $("#devices_list").prepend(newDeviceInputEl);

        $("#send_pair_code_button").click( sendPairCodeButtonEvent );

        $("#cancel_pair_button").click(function () {

            if(anyMotePluginActive) {       //AnyMote                
                cancelChallengeResponse();
            } else {                        //MoteBridge                
                cancelPairCode(function () {});
            }

            $("#enter_pin_code_container").remove();            
            $("#loaderImage").css("display", "none");
            $("#devices_refresh_button").css("display", "block");
            setDevicesStatusLabel("Pairing canceled", true);
            
        });

        $(function () {
            $('.new_device_ip_input').ipaddress({ cidr: true });
        });

        clearInterval(discoveryLoop);
        $("#loaderImage").css("display", "none");
        $("#devices_refresh_button").css("display", "block");
        //discoverDevices();
        //$('.pair_code_input').alphanumeric();
        $('.pair_code_input').focus();
        $(".pair_code_input").select();

        $("#pair_code_input_box").bind('keydown', function (event) {
            //Block non-alphanumeric keycode input.
            if ( ( event.which >  90 && !(event.which >= 96 && event.which <= 105) && event.which != 13) || 
                 ((event.which >= 48 && event.which <= 57) && event.shiftKey   )    ) {
                event.preventDefault();
                return false;
            }
            //Enter Press detected, then send pin in input box.
            if (event.which == 13) { sendPairCodeButtonEvent(); }  
        });
    }

}

var sendPairCodeButtonEvent = function () {
    var secretEntered = document.getElementsByClassName("pair_code_input")[0].value;

    if (secretEntered.length == 4) {

        setDevicesStatusLabel("Pairing", false);
        $("#loaderImage").css("display", "block");
        $("#devices_refresh_button").css("display", "none");

        if( !anyMotePluginActive ) {       //MoteBridge
            sendPairCode(secretEntered, function (response) {

                var pairSuccessLoop = setInterval(function () {

                    connectSuccessOrFail(function (response) {

                        if (JSON.parse(response).connectionSuccess && !JSON.parse(response).connectionFailed) {
                            //success, no fail
                            clearInterval(pairSuccessLoop);
                            clearInterval(pairSuccessTimeout);

                            setDevicesStatusLabel("Connected to " + pairingTo.replaceAll('_','.'), true);
                            showToast('Connected', 2000);
                            $("#loaderImage").css("display", "none");
                            $("#devices_refresh_button").css("display", "block");

                            if (document.getElementById(pairingTo) != null) document.getElementById(pairingTo).className = "device_found_active";

                            if (document.getElementsByClassName("new_device_ip_input").length > 0) {
                                $("#add_new_device").remove();
                            }

                            $("#enter_pin_code_container").remove();

                            discoverDevices();
                            if (devices_options_active) $("#options_button_devices").click();

                        } else if (!JSON.parse(response).connectionSuccess && JSON.parse(response).connectionFailed) {
                            //no success, fail
                            clearInterval(pairSuccessLoop);
                            clearInterval(pairSuccessTimeout);

                            setDevicesStatusLabel("Pairing failed", true);
                            
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
                    setDevicesStatusLabel(address.replaceAll('_','.') + " did not respond", true);
                    $("#loaderImage").css("display", "none");
                    $("#devices_refresh_button").css("display", "block");
                }, 15000);

            });

        } else {                        //AnyMote


            pairingTo = document.getElementById("enter_pin_code_container").getAttribute("ip").replaceAll(".","_");
            deviceName = $("#"+pairingTo).attr("name"); 


            sendChallengeResponse(secretEntered);

            var pairSuccessLoop = setInterval(function () {

                if ( wasChallengeResponseAccepted() ) {
                    //success, no fail
                    clearInterval(pairSuccessLoop);
                    clearInterval(pairSuccessTimeout);

                    setDevicesStatusLabel("Connected to " + pairingTo.replaceAll('_','.'), true);
                    showToast('Connected', 2000);
                    $("#loaderImage").css("display", "none");
                    $("#devices_refresh_button").css("display", "block");

                    if (document.getElementById(pairingTo) != null) document.getElementById(pairingTo).className = "device_found_active";

                    if (document.getElementsByClassName("new_device_ip_input").length > 0) {
                        $("#add_new_device").remove();
                    }

                    $("#"+pairingTo).remove();
                    $("#enter_pin_code_container").remove();

                    addDeviceFound(deviceName, pairingTo.replaceAll('_','.'), true, true);

                    //discoverDevices();

                    showOptionsPanel(); //Closes options panel when open.

                } else {
                    //no success, fail
                    clearInterval(pairSuccessLoop);
                    clearInterval(pairSuccessTimeout);

                    setDevicesStatusLabel("Incorrect PIN", true);
                    
                    $("#loaderImage").css("display", "none");
                    $("#devices_refresh_button").css("display", "block");

                    if (document.getElementById(pairingTo) != null) document.getElementById(pairingTo).className = "device_found";

                    //runPairing(pairingTo);

                    $(".pair_code_input").css("border-color", "#f00");
                    setTimeout(function () {
                        $(".pair_code_input").css("border-color", "#e8e9e9");
                        setTimeout(function () {
                            $(".pair_code_input").css("border-color", "#f00");
                            setTimeout(function () {
                                $(".pair_code_input").css("border-color", "");
                                setTimeout(function () {
                                    $(".pair_code_input").val('');
                                    $(".pair_code_input").focus();
                                    $(".pair_code_input").select();
                                }, 150);
                            }, 150);
                        }, 150);
                    }, 150);

                }               

            }, 500);


            var pairSuccessTimeout = setTimeout(function () {
                clearInterval(pairSuccessLoop);

                setDevicesStatusLabel(address.replaceAll('_','.') + " did not respond", true);
                $("#loaderImage").css("display", "none");
                $("#devices_refresh_button").css("display", "block");
            }, 15000);

        }


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

        $("#add_new_device #ipaddress_abcd__octet_1").focus();
        $("#add_new_device #ipaddress_abcd__octet_1").select();

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



        $(newAppEl).mouseup(function (e) {
            if (e.button == 2) { //Right mouse button
                //console.log("Right Click");
                showContextMenu(event.x, event.y, this.id, this.textContent, "intent");
                return false;
            } else {                
                sendFling(this.id);
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

    x = x - $("#main_container").offset().left;
    if(isInFullTabMode) {  
        if (x > 846) x = x - 110;
        if (y > 448) y = y - 78;
    } else {
        if (x > 205) x = x - 110;
        if (y > 398) y = y - 78;
    }


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
        //if (!moteServerActive || moteServerAddress == null) setMoteServer(ipEntered);
        
        setDevicesStatusLabel("Connecting to " + ipEntered, false);

        if(!anyMotePluginActive) {  //MoteBridge
            runPairing(ipEntered);
        } else {                    //AnyMote
            var deviceName = "Google TV Device";
            var saved = false;

            if(localStorage.getItem(STORAGE_KEY_PAIRED_DEVICES)) devicesInStorage = localStorage.getItem(STORAGE_KEY_PAIRED_DEVICES);
            var devicesInStorageJSON = JSON.parse(devicesInStorage);
            for(var i=0 ; i < devicesInStorageJSON.length ; i++){
                if(devicesInStorageJSON[i].address == ipEntered) {
                    saved = true;
                    break;
                }
            }

            console.log("Connect to: " + deviceName + " at " + ipEntered);

            if(saved) {
                stopDiscoveryClient();
                anymoteConnectToExistingSingleDevice(ipEntered);                    
            } else {  
                stopDiscoveryClient();
                pairingSessionPair(deviceName, ipEntered);
            } 
        }

    } else {
        $(".ip_container").css("border-color", "#f00");
        setTimeout(function () {
            $(".ip_container").css("border-color", "#e8e9e9");
            setTimeout(function () {
                $(".ip_container").css("border-color", "#f00");
                setTimeout(function () {
                    $(".ip_container").css("border-color", "");
                    setTimeout(function () {
                        $("#add_new_device #ipaddress_abcd__octet_1").focus();
                        $("#add_new_device #ipaddress_abcd__octet_1").select();
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

var isAnimated = false;

var showSettingsMenuPanel = function() {
    if(optionsActive) showOptionsPanel();

    if (!settingsActive && !isAnimated) {
        isAnimated = true;
        disableKeyBoardEvents();

        if(isInFullTabMode){            
            $("#remote_button_panel_touch").stop().animate({ width:"320", left: "640" }, 320, function () { });
            $("#remote_touch_pad").stop().animate({ width:"320" }, 320, function () { });
            $(".touch_pad_filler").stop().animate({ 'background-position-x': "0px" }, 320, function () { });
        }

        $("#settings_menu_panel").stop().animate({ left: "0" }, 320, function () {
                // Animation complete.
                //$("#settings_menu_panel").toggleClass('title_open_alt_button title_close_alt_button');
                isAnimated = false;

                $("#menu_button").toggleClass('title_open_menu_button title_close_menu_button');
                $("#touch_pad_open_button").css("display","none");
                document.getElementById("title_bar_title").textContent = "menu";
                if(!isInFullTabMode) {                    
                    $("#full_mode_button").css("display","block");
                    $("#title_bar_title").css("width","192px");
                } else {
                    // $(".title_close_menu_button").css("float","left");
                    $("#lock_mouse_button").css("display","none");
                }
                if(!isInPopOutMode) {                    
                    $("#popout_mode_button").css("display","block");
                    if(isInPopUpMode)  $("#title_bar_title").css("width","128px");
                    //if(isInFullTabMode)$("#title_bar_title").css("width","704px");
                }
        });
        if(altActive && !touchActive){    

            if(!isInFullTabMode) $("#settings_menu_panel").css("background-image","url('images/bg_main.png')");

            $("#remote_button_panel_alt").stop().animate({ left: "320" }, 320, function () {
                // Animation complete.
                $("#alt_panel_button").css("display","none");
            });

        } else if(touchActive){    

            if(!isInFullTabMode) {
                if(altActive) $("#settings_menu_panel").css("background-image","url('images/bg_alt.png')");
                else          $("#settings_menu_panel").css("background-image","url('images/bg_main.png')");
            }
            

            $("#remote_button_panel_touch").stop().animate({ left: "320" }, 320, function () {
                // Animation complete.
                $("#lock_mouse_button").css("display","none");
            });

        } else {

            if(!isInFullTabMode) $("#settings_menu_panel").css("background-image","url('images/bg_settings.png')");
            
            $("#remote_button_panel_main").stop().animate({ left: "320" }, 320, function () {
                // Animation complete.
                $("#alt_panel_button").css("display","none");
            });    
        }

        settingsActive = true;
    } else if (!isAnimated) {
        isAnimated = true;
        enableKeyBoardEvents();

        if(isInFullTabMode){
            $("#remote_button_panel_touch").stop().animate({ width:"640", left: "320" }, 320, function () { });
            $("#remote_touch_pad").stop().animate({ width:"640" }, 320, function () { });
            $(".touch_pad_filler").stop().animate({ 'background-position-x': "160px" }, 320, function () { });
        }

        $("#settings_menu_panel").stop().animate({ left: "-320" }, 320, function () {
            // Animation complete.
            //$("#settings_menu_panel").toggleClass('title_close_alt_button title_open_alt_button');
            isAnimated = false;

            $("#menu_button").toggleClass('title_close_menu_button title_open_menu_button');
            if(!isInFullTabMode) $("#touch_pad_open_button").css("display","block");            
            
            if(!isInFullTabMode) {
                $("#full_mode_button").css("display","none");
            } else {
                document.getElementById("title_bar_title").textContent = "full remote";
                $("#lock_mouse_button").css("display","block");
            }
            if(!isInPopOutMode) {
                $("#popout_mode_button").css("display","none");
                if(isInPopUpMode)  $("#title_bar_title").css("width","128px");
                //if(isInFullTabMode)$("#title_bar_title").css("width","704px");
            }
            

        });

        if(altActive && !touchActive){  

            $("#remote_button_panel_alt").stop().animate( { left: "0" }, 320, function () {
                // Animation complete.
                $("#alt_panel_button").css("display","block");

                if(!isInFullTabMode) {
                    document.getElementById("title_bar_title").textContent = "remote";
                    $("#title_bar_title").css("width","128px");
                }
                else document.getElementById("title_bar_title").textContent = "full remote";
                
            });

        } else if(touchActive){    

            $("#remote_button_panel_touch").stop().animate( { left: "0" }, 320, function () {
                // Animation complete.
                if(!isInPopUpMode) $("#lock_mouse_button").css("display","block");

                if(!isInFullTabMode) {
                    document.getElementById("title_bar_title").textContent = "touch pad";
                    $("#title_bar_title").css("width","192px");
                }
                else document.getElementById("title_bar_title").textContent = "full remote";
            });

        } else {

            $("#remote_button_panel_main").stop().animate( { left: "0" }, 320, function () {
                // Animation complete.
                if(!isInFullTabMode) {
                    $("#alt_panel_button").css("display","block");
                    $("#title_bar_title").css("width","128px");
                    document.getElementById("title_bar_title").textContent = "remote";
                }
                else document.getElementById("title_bar_title").textContent = "full remote";

            });

        }

        if(menuPanelAboutEnabled){
            $( "#menu_panel_about" ).stop().slideToggle( 250, function() {});
            menuPanelAboutEnabled = false;
        }
        if(menuPanelSettingsEnabled){
            $( "#menu_panel_settings" ).stop().slideToggle( 250, function() {});
            menuPanelSettingsEnabled = false;
        }

        closeAllOpenSettingsSubCats();

        settingsActive = false;
    }


}


function closeAllOpenSettingsSubCats(){
    if(menuPanelSettingsCustomThemeEnabled){            
        $( "#menu_panel_settings_custom_theme" ).stop().slideToggle( 250, function() {});
        menuPanelSettingsCustomThemeEnabled = false;
    }
    if(menuPanelSettingsSelectThemeEnabled){            
        $( "#menu_panel_settings_select_theme" ).stop().slideToggle( 250, function() {});
        menuPanelSettingsSelectThemeEnabled = false;
    }
    if(menuPanelSettingsMoteIpEnabled){            
        $( "#menu_panel_settings_mote_ip" ).stop().slideToggle( 250, function() {});
        menuPanelSettingsMoteIpEnabled = false;
    }
}


var mainActive = true,
     altActive = false,
   touchActive = false,
 optionsActive = false,
   mouseLocked = false,
settingsActive = false;

var showAltPanel = function () {

    if (!altActive && !isAnimated) {
        isAnimated = true;

        $("#remote_button_panel_alt").stop().animate({
            left: "0"
        }, 320, function () {
            // Animation complete.
            isAnimated = false;
            $("#alt_panel_button").toggleClass('title_open_alt_button title_close_alt_button');
        });
        $("#remote_button_panel_main").stop().animate({
            left: "-320"
        }, 320, function () {
            // Animation complete.
        });

        altActive = true;
        mainActive = false;

    } else if (!isAnimated) { 
        isAnimated = true;
        
        $("#remote_button_panel_alt").stop().animate({
            left: "320"
        }, 320, function () {
            // Animation complete.
            isAnimated = false;
            $("#alt_panel_button").toggleClass('title_close_alt_button title_open_alt_button');
        });
        $("#remote_button_panel_main").stop().animate({
            left: "0"
        }, 320, function () {
            // Animation complete.
        });

        altActive = false;
        mainActive = true;
    
    }


}

var showTouchPad = function () {

    if (!touchActive && !isAnimated) {
        isAnimated = true;
        $("#remote_button_panel_touch").stop().animate({
            left: "0"
        }, 320, function () {
            // Animation complete.
            isAnimated = false;
            document.getElementById("title_bar_title").textContent = "touch pad";
            if(!isInPopUpMode) $("#lock_mouse_button").css("display", "block");
            if(isInPopUpMode) $("#title_bar_title").css("width", "192px");
            $("#alt_panel_button").css("display", "none");
            $("#touch_pad_open_button").toggleClass('title_open_touch_button title_close_alt_button');
        });


        if (!altActive) {
            $("#remote_button_panel_touch").css("background-image","url('images/bg_alt.png')");
            $("#remote_button_panel_main").stop().animate({
                left: "-320"
            }, 320, function () {
                // Animation complete.                
            });
        } else {
            $("#remote_button_panel_touch").css("background-image","url('images/bg_touch.png')");
            $("#remote_button_panel_alt").stop().animate({
                left: "-320"
            }, 320, function () {
                // Animation complete.
            });
        }

        touchActive = true;
    } else if (!isAnimated){
        isAnimated = true;
        $("#remote_button_panel_touch").stop().animate({
            left: "320"
        }, 320, function () {
            // Animation complete.
            isAnimated = false;
            document.getElementById("title_bar_title").textContent = "remote";
            $("#lock_mouse_button").css("display", "none");
            if(isInPopUpMode) $("#title_bar_title").css("width", "128px");
            $("#alt_panel_button").css("display", "block");
            $("#touch_pad_open_button").toggleClass('title_close_alt_button title_open_touch_button');
        });

        if (!altActive) {
            $("#remote_button_panel_main").stop().animate({
                left: "0"
            }, 320, function () {
                // Animation complete.
            });
        } else {
            $("#remote_button_panel_alt").stop().animate({
                left: "0"
            }, 320, function () {
                // Animation complete.
            });
        }

        touchActive = false;
    }

}

var toggleMouseLock = function () {

    if(!isInPopUpMode){
        var havePointerLock = 'pointerLockElement' in document ||
                           'mozPointerLockElement' in document ||
                        'webkitPointerLockElement' in document;
        var element = document.getElementById("remote_touch_pad");

        if(havePointerLock){
            element.requestPointerLock = element.requestPointerLock ||
                                      element.mozRequestPointerLock ||
                                   element.webkitRequestPointerLock;
            // Ask the browser to lock the pointer
            element.requestPointerLock();

            // Hook pointer lock state change events
            document.addEventListener('pointerlockchange', mouseLockChange, false);
            document.addEventListener('mozpointerlockchange', mouseLockChange, false);
            document.addEventListener('webkitpointerlockchange', mouseLockChange, false);

            // Hook mouse move events
            element.addEventListener("mousemove", mouseLockMove, false);
        }
    } else { //IS POPUP MODE
        //TODO: Open Options and auto start mouse lock.
    }
    
}

var toggleMouseLockUI = function () {
    if (!mouseLocked) {
        $("#lock_mouse_button").toggleClass('title_mouse_unlocked_button title_mouse_locked_button');
        $("#mouse_lock_cover").css("display","block");
        mouseLocked = true;
    } else {
        $("#lock_mouse_button").toggleClass('title_mouse_locked_button title_mouse_unlocked_button');
        $("#mouse_lock_cover").css("display","none");
        mouseLocked = false; firstMoveDone = false;
    }
}

var firstMoveDone = false;

function mouseLockChange(e){
    toggleMouseLockUI();
}

function mouseLockMove(e) {
    if(mouseLocked && firstMoveDone) {
        var deltaX = e.movementX || e.mozMovementX || e.webkitMovementX || 0,
            deltaY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

        if(!anyMotePluginActive) { //MoteBridge
            sendMovement(deltaX, deltaY); 
        } else {                   //AnyMote
            sendTpadMouseMoveEvent(deltaX, deltaY);
        }  
        //console.log("(" + deltaX + ", " + deltaY + ")");
    } else if(mouseLocked && !firstMoveDone) {
        firstMoveDone = true;
    }
}



var showOptionsPanel = function (enable) {
    if(settingsActive) showSettingsMenuPanel();

    if (enable != null) {
        optionsActive = !enable;
    }

    if (!optionsActive) { //Open Options

        if(isInFullTabMode){
            $("#remote_button_panel_touch").stop().animate({ width:"320", left: "320" }, 320, function () { });
            $("#remote_touch_pad").stop().animate({ width:"320" }, 320, function () { });
            $(".touch_pad_filler").stop().animate({ 'background-position-x': "0px" }, 320, function () { });
        }

        var closeOffset = 50;
        if(isInFullTabMode) closeOffset = 0;

        $("#options_panel_container").stop().animate({
            bottom: closeOffset
        }, 320, function () {
            // Animation complete.
            if(!isInFullTabMode) $("#title_bar_title").css("width", "192px");
            else                 $("#title_bar_title").css("width", "832px");
            document.getElementById("title_bar_title").textContent = "options";
            
            $("#options_close_button").css("display", "block");

            if (touchActive || isInFullTabMode) {
                $("#lock_mouse_button").css("display", "none");
                $("#touch_pad_open_button").css("display", "none");
            } else {
                $("#touch_pad_open_button").css("display", "none");
                $("#alt_panel_button").css("display", "none");
            }

        });

        optionsActive = true;
        disableKeyBoardEvents();
        if(isInFullTabMode){
            $("#options_panel_container").css("z-index","11");
            $('.options_tabs_bottom_filler').css("z-index","12");

        } 

    } else { //Close Options

        if(isInFullTabMode){
            $("#remote_button_panel_touch").stop().animate({ width:"640", left: "320" }, 320, function () { });
            $("#remote_touch_pad").stop().animate({ width:"640" }, 320, function () { });
            $(".touch_pad_filler").stop().animate({ 'background-position-x': "160px" }, 320, function () { });
        }

        var closeOffset = -286;
        if(isInFullTabMode) closeOffset = -432;

        $("#options_panel_container").stop().animate({
            bottom: closeOffset
        }, 320, function () {
            // Animation complete.    

            $("#options_close_button").css("display", "none");
            if(!isInFullTabMode) $("#title_bar_title").css("width", "128px");
            else                 $("#title_bar_title").css("width", "832px");

            if (touchActive) {
                document.getElementById("title_bar_title").textContent = "touch pad";

                $("#lock_mouse_button").css("display", "block");
                $("#touch_pad_open_button").css("display", "block");
            } else {
                if(!isInFullTabMode) {
                    document.getElementById("title_bar_title").textContent = "remote";
                    $("#lock_mouse_button").css("display", "none");
                    $("#touch_pad_open_button").css("display", "block");
                    $("#alt_panel_button").css("display", "block");

                }
                else {
                    document.getElementById("title_bar_title").textContent = "full remote";
                    $("#lock_mouse_button").css("display", "block");
                }
                

            }

            $("#options_panel_devices").css("display", "none");
            $("#options_panel_apps").css("display", "none");
            $("#options_panel_channels").css("display", "none");

            $("#device_selected").css("display", "none");
            $("#apps_selected").css("display", "none");
            $("#channels_selected").css("display", "none");

            $("#options_button_devices").css("color", "#7a7b7d");
            $("#options_button_apps").css("color", "#7a7b7d");
            $("#options_button_channels").css("color", "#7a7b7d");

        });

        

        optionsActive = false;
        devices_options_active = false; apps_options_active = false; channels_options_active = false;
        enableKeyBoardEvents();
        if(isInFullTabMode){
            $("#options_panel_container").css("z-index","11");
            $('.options_tabs_bottom_filler').css("z-index","12");
        } 
    }

}

var addDeviceFound = function (name, ip, current, saved) {

    var deviceListEl = document.getElementById("devices_list_discovered");
    if(saved) deviceListEl = document.getElementById("devices_list_saved");
    var deviceFoundID = ip.replaceAll('.','_');

    //Don't continue to add if device ip is present in saved device list.
    if(  !saved && $("#devices_list_saved #"+deviceFoundID).length > 0 ) return false;

    if(   saved && $("#devices_list_saved #"+deviceFoundID).length > 0 ) $("#devices_list_saved #"+deviceFoundID).remove();

    if( current && $("#devices_list_discovered #"+deviceFoundID).length > 0 ) $("#devices_list_discovered #"+deviceFoundID).remove();

    if( current ) for(var i=0; i < $("#devices_list_saved .device_found_active").length; i++) {
        $("#devices_list_saved .device_found_active")[i].className = 'device_found';
        i--;
    }
    
    var newDeviceEl = document.createElement("div");
    if (!current) newDeviceEl.className = "device_found"; else newDeviceEl.className = "device_found_active";
    newDeviceEl.id = "" + deviceFoundID;
    $(newDeviceEl).attr("name",name);
                            
    newDeviceEl.innerHTML = "<div class='device_found_ip'>" + ip + "</div><input class='device_found_name_input' value='" + getSavedName(name, ip) + "' disabled></input><div class='device_found_rename_save_button' id='rename_" + deviceFoundID + "'>save</div>";

    newDeviceEl.addEventListener("click", function () {
        if( !hasClass(document.getElementById(deviceFoundID),"device_renaming") ){
            var ipAddress = this.id.replaceAll('_','.'),
                deviceName = $(this).attr("name");

            setDevicesStatusLabel("Connecting to "+ ipAddress, false);
            
            if(!anyMotePluginActive) {
                runPairing(ipAddress);
            } else {
                console.log("Connect to: " + deviceName);
                if(saved) {
                    stopDiscoveryClient();
                    anymoteConnectToExistingSingleDevice(ipAddress);                    
                } else {  
                    stopDiscoveryClient();
                    pairingSessionPair(deviceName, ipAddress);
                } 
            }
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

    if(!current) deviceListEl.appendChild(newDeviceEl);
    else        $(deviceListEl).prepend(newDeviceEl);

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
    //console.log(originalName);
    //console.log(ip);

    if(ip.indexOf( backgroundPageWindow.connectedDevice ) != -1) stopAnymoteSession();
    showToast("Disconnected");

    for(var i=0 ; i < savedDeviceList.length ; i++){        
        if(savedDeviceList[i].originalName == originalName && savedDeviceList[i].ip == ip){
            savedDeviceList.splice(i, 1);
            localStorage.setItem("saved_device_list", JSON.stringify(savedDeviceList));
            break;
        }
    }

    if(localStorage.getItem(STORAGE_KEY_PAIRED_DEVICES)){
        devicesInStorage = localStorage.getItem(STORAGE_KEY_PAIRED_DEVICES);
        var devicesInStorageJSON = JSON.parse(devicesInStorage);
        for(var i=0 ; i < devicesInStorageJSON.length ; i++){        
            if(devicesInStorageJSON[i].name == originalName && devicesInStorageJSON[i].address == ip){
                devicesInStorageJSON.splice(i, 1);
                localStorage.setItem(STORAGE_KEY_PAIRED_DEVICES, JSON.stringify(devicesInStorageJSON));
                break;
            }
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
                showAddPinInputBox(address);
                clearInterval(pinWaitLoop);
                clearTimeout(pinWaitTimeout);
            } else {
                connectSuccessOrFail(function (response) {

                    if (JSON.parse(response).connectionSuccess && !JSON.parse(response).connectionFailed) {
                        //success, no fail
                        clearInterval(pinWaitLoop);
                        clearTimeout(pinWaitTimeout);

                        setDevicesStatusLabel("Connected to " + pairingTo, true);
                        showToast('Connected', 2000);

                        console.log("pairingTo "+pairingTo);
                        $("#loaderImage").css("display", "none");
                        $("#devices_refresh_button").css("display", "block");

                        
                        if (document.getElementById(deviceFoundID) != null) 
                            document.getElementById(deviceFoundID).className = "device_found_active";
                        else
                            addDeviceFound("Google TV Device", address, true, true);

                        if (document.getElementsByClassName("new_device_ip_input").length > 0)
                            $("#add_new_device").remove();

                        $("#enter_pin_code_container").remove();

                        discoverDevices();
                        if (devices_options_active) $("#options_button_devices").click();

                    } else if (!JSON.parse(response).connectionSuccess && JSON.parse(response).connectionFailed) {
                        //no success, fail
                        clearInterval(pinWaitLoop);
                        clearTimeout(pinWaitTimeout);

                        setDevicesStatusLabel("Pairing failed", true);

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

        setDevicesStatusLabel(address.replaceAll('_','.') + " did not respond", true);
        $("#loaderImage").css("display", "none");
        $("#devices_refresh_button").css("display", "block");
    }, 15000);

}


var discoveryLoop = null;
var runDiscovery = function() {

    clearInterval(discoveryLoop);

    if(!anyMotePluginActive) {                      //MoteBridge
        discoverDevices();

        setDevicesStatusLabel("Discovering devices", false);

        $("#loaderImage").css("display", "block");
        $("#devices_refresh_button").css("display", "none");

        moteServerPaired = false;
        discoveryLoop = setInterval(function () {

            if (document.getElementById("devices_status_label").textContent.indexOf("Discovering devices") >= 0)
                setDevicesStatusLabel(document.getElementById("devices_status_label").textContent + ".", false);

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
                        document.getElementById("devices_list_discovered").innerHTML = "";
                        if (document.getElementsByClassName("new_device_ip_input").length > 0) { $("#add_new_device").remove(); }

                        var updatedDeviceList = JSON.parse(responseText);
                        for (var i = 0; i < updatedDeviceList.length; i++){
                            addDeviceFound(updatedDeviceList[i].name, updatedDeviceList[i].address, updatedDeviceList[i].current, true);
                            if(updatedDeviceList[i].current) moteServerPaired = true;
                        }

                        if(moteServerPaired){
                            //console.log("Mote Server is Paired");
                            chrome.browserAction.setIcon({path:"images/icons/icon19.png"});
                        } else {
                            //console.log("Mote Server is not Paired");
                            chrome.browserAction.setIcon({path:"images/icons/icon19_grey.png"});            
                            if (!devices_options_active) $("#options_button_devices").click();
                        }

                        var statusMsg = "";
                        if (updatedDeviceList.length == 1)
                            statusMsg = updatedDeviceList.length + " Google TV found";
                        else
                            statusMsg = updatedDeviceList.length + " Google TVs found";

                        setDevicesStatusLabel(statusMsg, false);

                    } catch (e) { console.log('No devices found.'); }
                });

            });


        }, 1000);


        setTimeout(function(){
            clearInterval(discoveryLoop);
            $("#loaderImage").css("display", "none");
            $("#devices_refresh_button").css("display", "block");
            if (document.getElementById("devices_status_label").textContent.indexOf("Discovering devices") >= 0)
                setDevicesStatusLabel("Discovery timed out", true);
        },15000);

    } else {                                //AnyMote

        document.getElementById("devices_list_discovered").innerHTML = "";
        if (document.getElementsByClassName("new_device_ip_input").length > 0) { $("#add_new_device").remove(); }
        startDiscoveryClient();


    }





}






var menuPanelSettingsEnabled = false,
    menuPanelAboutEnabled = false,
    menuPanelSettingsCustomThemeEnabled = false,
    menuPanelSettingsSelectThemeEnabled = false,
    menuPanelSettingsMoteIpEnabled = false,
    menuPanelSettingsActivateEnabled = false;

function toggleMenuItemSettings(){
    if(!menuPanelSettingsEnabled){            
        $( "#menu_panel_settings" ).stop().slideToggle( 250, function() {});
        $( '#menu_items' ).animate({ scrollTop: 0 }, 250);
        menuPanelSettingsEnabled = true;
    } else{            
        $( "#menu_panel_settings" ).stop().slideToggle( 250, function() {});
        menuPanelSettingsEnabled = false;
    }

    if(menuPanelAboutEnabled){
        $( "#menu_panel_about" ).stop().slideToggle( 250, function() {});
        menuPanelAboutEnabled = false;
    }    
}

function toggleMenuItemSettingsMoteIp(){
    if(!menuPanelSettingsMoteIpEnabled){
        closeAllOpenSettingsSubCats(); 
        $( "#menu_panel_settings_mote_ip" ).stop().slideToggle( 250, function() {});
        $( '#menu_items' ).animate({ scrollTop: 326 }, 250);
        menuPanelSettingsMoteIpEnabled = true;

        $("#menu_panel_settings_mote_ip #ipaddress_abcd__octet_1").focus();
        $("#menu_panel_settings_mote_ip #ipaddress_abcd__octet_1").select();
    } else{            
        $( "#menu_panel_settings_mote_ip" ).stop().slideToggle( 250, function() {});
        $( '#menu_items' ).animate({ scrollTop: 0 }, 250);
        menuPanelSettingsMoteIpEnabled = false;
    }
}


function toggleMenuItemSettingsActivate(){
    if(!menuPanelSettingsActivateEnabled){
        closeAllOpenSettingsSubCats(); 
        $( "#menu_panel_settings_activate" ).stop().slideToggle( 250, function() {});
        $( '#menu_items' ).animate({ scrollTop: 262 }, 250);
        menuPanelSettingsActivateEnabled = true;

        
    } else{            
        $( "#menu_panel_settings_activate" ).stop().slideToggle( 250, function() {});
        $( '#menu_items' ).animate({ scrollTop: 0 }, 250);
        menuPanelSettingsActivateEnabled = false;
    }
}
var initMenuItemEvents = function(){

    $("#menu_item_settings").click( function () { 
        //TODO: EXPAND SETTINGS MENU
        toggleMenuItemSettings();
    });

    $("#menu_item_about").click( function () {         
        if(!menuPanelAboutEnabled){            
            $( "#menu_panel_about" ).stop().slideToggle( 250, function() {});
            $( '#menu_items' ).animate({ scrollTop: 35 }, 250);
            menuPanelAboutEnabled = true;
        } else{            
            $( "#menu_panel_about" ).stop().slideToggle( 250, function() {});
            menuPanelAboutEnabled = false;
        }   

        if(menuPanelSettingsEnabled){
            $( "#menu_panel_settings" ).stop().slideToggle( 250, function() {});
            menuPanelSettingsEnabled = false;
        }   
    }); 

    $("#menu_item_settings_custom_theme").click( function () {
        if(!menuPanelSettingsCustomThemeEnabled){      
            closeAllOpenSettingsSubCats();       
            $( "#menu_panel_settings_custom_theme" ).stop().slideToggle( 250, function() {});
            $( '#menu_items' ).animate({ scrollTop: 198 }, 250);
            menuPanelSettingsCustomThemeEnabled = true;
        } else{            
            $( "#menu_panel_settings_custom_theme" ).stop().slideToggle( 250, function() {});
            $( '#menu_items' ).animate({ scrollTop: 0 }, 250);
            menuPanelSettingsCustomThemeEnabled = false;
        }
    });

    $("#menu_item_settings_select_theme").click( function () {         
        if(!menuPanelSettingsSelectThemeEnabled){
            closeAllOpenSettingsSubCats(); 
            $( "#menu_panel_settings_select_theme" ).stop().slideToggle( 250, function() {});
            $( '#menu_items' ).animate({ scrollTop: 163 }, 250);
            menuPanelSettingsSelectThemeEnabled = true;
        } else{            
            $( "#menu_panel_settings_select_theme" ).stop().slideToggle( 250, function() {});
            $( '#menu_items' ).animate({ scrollTop: 0 }, 250);
            menuPanelSettingsSelectThemeEnabled = false;
        }
    });    

    $("#menu_item_settings_mote_ip").click( function () {         
        toggleMenuItemSettingsMoteIp();
    });

    $("#menu_item_settings_activate").click( function () {         
        toggleMenuItemSettingsActivate();
    });

    $("#menu_item_settings_toggle_btn_lock").click( function () {         
        if(!draggableButtonsEnabled) enableDraggableButtons();            
        else                        disableDraggableButtons();
    });

    $("#menu_item_settings_toggle_dark_back").click( function () {         
        if(!darkBackEnabled) enableDarkBack(true);            
        else                 enableDarkBack(false);
    });

    $("#menu_item_settings_toggle_npapi_enabled").click( function () {
        if (backgroundPageWindow.osDetected == 'CrOS') {
            buildDialogBox("NPAPI Not Supported","Google decided to not support NPAPI plugins on Chrome OS. So we built the Anymote Bridge to enable Chromemote to work on Chrome OS.","Install Bridge",null, function(){
                window.open("https://play.google.com/store/apps/details?id=com.motelabs.chromemote.bridge","_blank");
            });
        } else {
            if(!anyMotePluginActive) {
                enableNPAPIPlugin();
                if(gTvPluginLoaded){
                    //backgroundPageWindow.googletvremoteInitializePlugin();
                    googletvremoteInitializePlugin();
                    anymoteConnectToExistingDevice();
                }
            } else {
                disableNPAPIPlugin();

            }
            document.getElementById("devices_list_saved").innerHTML = "";
            document.getElementById("devices_list_discovered").innerHTML = "";    
        }
        
    });

    $("#menu_item_settings_reset_default_layout").click( function () {
        if(!undoLayoutFound){
            var date = new Date(), time = date.getTime();
            undoButtonLayoutStr = '{"time": "' + time + '", "layout": ' + JSON.stringify(buttonLayoutJson) + ' }';
            localStorage.setItem("button_layout_undo", undoButtonLayoutStr);
            localStorage.setItem("button_layout", defaultButtonLayoutStr);
            location.reload();
        } else {
            $("#undo_default_reset").css("display","none");
            undoLayoutFound = false;
            localStorage.removeItem("button_layout_undo");
            localStorage.setItem("button_layout", JSON.stringify(undoButtonLayoutJSON));
            location.reload();
        }        
    });

    $("#menu_item_settings_install_bridge").click( function () {         
        window.open("https://play.google.com/store/apps/details?id=com.motelabs.chromemote.bridge","_blank");
        if(backgroundPageWindow.anymoteSessionActive) sendFling("market://details?id=com.motelabs.chromemote.bridge");
    });


    $("#menu_item_help").click( function () { 
        window.open('https://chrome.google.com/webstore/support/bhcjclaangpnjgfllaoodflclpdfcegb?hl=en&gl=US#question','_blank');
    });  
    $("#menu_item_support").click( function () { 
        window.open('http://chromemote.com/support-us/','_blank')
    });
    $("#menu_item_bugs").click( function () { 
        window.open('https://chrome.google.com/webstore/support/bhcjclaangpnjgfllaoodflclpdfcegb?hl=en&gl=US#bug','_blank');
    });
    $("#menu_item_suggest").click( function () { 
        window.open('https://chrome.google.com/webstore/support/bhcjclaangpnjgfllaoodflclpdfcegb?hl=en&gl=US#feature','_blank');
    });
    $("#menu_item_updates").click( function () { 
        window.open('http://chromemote.com/update/','_blank');
    });
    $("#menu_item_blog").click( function () { 
        window.open('http://chromemote.com/blog/','_blank');
    });


    $("#get_key_button").click( function () { 
        window.open('http://api.chromemote.com/get_key/','_blank');
    });


    $("#check_activation_button").click( function () { 
        var data = {};
            data.email = $('.user_email_address_input').val(),
            data.key = $('.product_key_input').val();

            $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: 'http://localhost:8008/get_key/activate',                                                
                success: function(result) {
                    //console.log('success');
                    console.log(result.status);
                    if(result.status == 0){
                        //show email not found                        

                    } else if(result.status == 1){
                        //show success
                        
                    } else if(result.status == 2){
                        //show key does not match
                        
                    } else if(result.status == -1){
                        //show error
                        
                    }
                    
                    
                }
            });
    });

}

var initAppIntents = function(){

    //$("#app_amazon").click(    function () { sendFling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.amazon.avod/.MainActivity;end');  showOptionsPanel();   });

    $("#app_chrome").click(      function () { sendFling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.google.tv.chrome/com.google.tv.chrome.HubActivity;end');  showOptionsPanel();   });

    $("#app_clock").click(       function () { sendFling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.android.deskclock/.DeskClock;end');  showOptionsPanel();   });

    //$("#app_cnbc").click(      function () { sendFling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.nbc.cnbc.android.googletv/.ui.Splash;end');  showOptionsPanel();   });

    $("#app_downloads").click(   function () { sendFling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.android.providers.downloads.ui/.DownloadList;end');  showOptionsPanel();   });

    $("#app_search").click(      function () { sendFling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.android.quicksearchbox/.SearchActivity;end');  showOptionsPanel();   });

    //$("#app_mgo").click(       function () { sendFling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.technicolor.navi.mgo.gtv/com.technicolor.navi.mgo.gtv.MainActivity;end');  showOptionsPanel();   });
    
    $("#app_movies").click(      function () { sendFling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.google.android.videos/com.google.android.youtube.videos.EntryPoint;end');  showOptionsPanel();   });

    $("#app_music").click(       function () { sendFling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.google.android.music/com.android.music.activitymanagement.TopLevelActivity;end');  showOptionsPanel();   });

    //$("#app_nba").click(       function () { sendFling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.nbadigital.gametimegtv/.ActivityManager;end');  showOptionsPanel();   });
    
    $("#app_netflix").click(     function () { sendFling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.google.tv.netflix/com.google.tv.netflix.NetflixActivity;end');  showOptionsPanel();   });

    //$("#app_onlive").click(    function () { sendFling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.onlive.clientgtv/.OnLiveClientGTVActivity;end');  showOptionsPanel();   });
    
    $("#app_pandora").click(     function () { sendFling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.pandora.android.gtv/com.pandora.android.Main;end');  showOptionsPanel();   });

    $("#app_photos").click(      function () { sendFling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.google.tv.mediabrowser/com.google.tv.mediabrowser.newui.MainActivity;end');  showOptionsPanel();   });

    //$("#app_plex").click(      function () { sendFling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.plexapp.gtv/com.plexapp.gtv.activities.MyPlexActivity;end');  showOptionsPanel();   });

    $("#app_primetime").click(   function () { sendFling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.google.tv.alf/com.google.tv.alf.ui.MainActivity;end');  showOptionsPanel();   });

    $("#app_store").click(       function () { sendFling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.android.vending/com.android.vending.AssetBrowserActivity;end');  showOptionsPanel();   });

    $("#app_tv").click(          function () { sendFling('tv://');  showOptionsPanel();   });

    $("#app_twitter").click(     function () { sendFling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.twitter.android.tv/com.twitter.android.LoginActivity;end');  showOptionsPanel();   });

    $("#app_youtube").click(     function () { sendFling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.google.android.youtube.googletv/com.google.android.youtube.googletv.MainActivity;end');  showOptionsPanel();   });

    $("#app_settings").click(    function () { sendFling('intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10200000;component=com.google.tv.settings/com.google.tv.settings.Settings;end');  showOptionsPanel();   });
}


function enableDarkBack(bool) {
    if(bool == null) bool = true;
    darkBackEnabled = bool;
    $("#dark_back_checkbox").prop("checked", bool);
    localStorage.setItem("dark_back_full_mode", bool);

    if(bool) $("#background_container").css("-webkit-filter","invert(100%)");
    else     $("#background_container").css("-webkit-filter","");
}
function initDarkBackSetting() {
    if(localStorage.getItem("dark_back_full_mode")){
        var isDarkBackString = localStorage.getItem("dark_back_full_mode")+"";
        //console.log(isDarkBackString);
        if(isDarkBackString === "true") enableDarkBack(true);
        else enableDarkBack(false);
    }
}

function saveButtonLayoutSettings(){
    if(!isInFullTabMode){
        buttonLayoutJson = [];
        var buttonElements = document.getElementById("main_button_list").getElementsByClassName("drag_btn");
        for(var i=0; i<buttonsList.length; i++) {
            var jsonString = '{"col":'    + $("#"+buttonsList[i].keycode).attr("data-col")   + 
                             ',"row":'    + $("#"+buttonsList[i].keycode).attr("data-row")   + 
                             ',"size_x":' + $("#"+buttonsList[i].keycode).attr("data-sizex") + 
                             ',"size_y":' + $("#"+buttonsList[i].keycode).attr("data-sizey");
            if(i<=65) jsonString = jsonString + ',"swap":'   + $("#"+buttonsList[i].keycode).attr("swap");
            jsonString = jsonString + '}';
            var jsonObj = JSON.parse(jsonString);
            buttonLayoutJson.push(jsonObj);
        }
        //console.dir(buttonLayoutJson);

        //buttonLayoutJson = JSON.parse("[" + JSON.stringify( gridster[0].serialize() ).replaceAll("[","").replaceAll("]","") + "," + JSON.stringify( gridster[1].serialize() ).replaceAll("[","").replaceAll("]","") + "," + JSON.stringify( gridster[2].serialize() ).replaceAll("[","").replaceAll("]","") + "]" );
        //buttonLayoutJson.splice(73, 1);
    } else {
        buttonLayoutJson = gridster[0].serialize();
        buttonLayoutJson.splice(66, 3);

        
        var buttonElements = document.getElementById("main_button_list").getElementsByClassName("drag_btn");
        
        for(var i=0; i <= 65 ; i++){

            buttonLayoutJson[i].swap = false;
            if( i < 32 && !(buttonLayoutJson[i].row <= 7 && buttonLayoutJson[i].col <= 5) ) {
                //MAIN Panel Buttons moved to ALT
                console.log(  buttonElements[i].id + " was moved to ALT panel." );
                buttonLayoutJson[i].swap = true;

                if(buttonLayoutJson[i].col >= 1 && buttonLayoutJson[i].col <= 5) {
                    buttonLayoutJson[i].row = buttonLayoutJson[i].row - 7;
                } else if(buttonLayoutJson[i].col >= 6 && buttonLayoutJson[i].col <= 10) {
                    buttonLayoutJson[i].row = buttonLayoutJson[i].row - 5;
                    buttonLayoutJson[i].col = buttonLayoutJson[i].col - 5;
                } else if(buttonLayoutJson[i].col >= 11 && buttonLayoutJson[i].col <= 15) {
                    buttonLayoutJson[i].row = buttonLayoutJson[i].row - 2;
                    buttonLayoutJson[i].col = buttonLayoutJson[i].col - 10;
                }


            } else if( i >= 32 && !(buttonLayoutJson[i].row >= 8) ) {
                //ALT Panel Buttons moved to MAIN
                console.log(  buttonElements[i].id + " was moved to MAIN panel." );
                buttonLayoutJson[i].swap = true;

            } else if( i >= 32 && i <= 65) { 
                //ALT Panel Buttons Non-Swapped
                if(buttonLayoutJson[i].col >= 1 && buttonLayoutJson[i].col <= 5) {
                    buttonLayoutJson[i].row = buttonLayoutJson[i].row - 7;
                } else if(buttonLayoutJson[i].col >= 6 && buttonLayoutJson[i].col <= 10) {
                    buttonLayoutJson[i].row = buttonLayoutJson[i].row - 5;
                    buttonLayoutJson[i].col = buttonLayoutJson[i].col - 5;
                } else if(buttonLayoutJson[i].col >= 11 && buttonLayoutJson[i].col <= 15) {
                    buttonLayoutJson[i].row = buttonLayoutJson[i].row - 2;
                    buttonLayoutJson[i].col = buttonLayoutJson[i].col - 10;
                }

            }

        }   
        //Reinclude saved touchpad layout.

        //console.log(touchButtonLayoutJson);

        for(var i=0; i < touchButtonLayoutJson.length; i++) {
            buttonLayoutJson.push(touchButtonLayoutJson[i]);
        }  
    }  //console.dir(buttonLayoutJson);
    localStorage.setItem("button_layout", JSON.stringify(buttonLayoutJson) );
    if(undoLayoutFound) undoTimeout();
}
function disableDraggableButtons(){  
    for(var i=0;i<gridster.length;i++) gridster[i].disable(); 
    $("#btn_lock_checkbox").prop("checked", false);
    draggableButtonsEnabled = false; 
    localStorage.setItem("buttons_draggable", false);
}
function enableDraggableButtons() {  
    for(var i=0;i<gridster.length;i++) gridster[i].enable(); 
    $("#btn_lock_checkbox").prop("checked", true); 
    draggableButtonsEnabled = true;  
    localStorage.setItem("buttons_draggable", true);
}
 
function disableNPAPIPlugin(){
    $("#npapi_enabled_checkbox").prop("checked", false);
    anyMotePluginActive = false; 
    localStorage.setItem("npapi_enabled", false);
    backgroundPageWindow.stopAnymoteSession();

}
function enableNPAPIPlugin() {
    if(gTvPluginLoaded){
        $("#npapi_enabled_checkbox").prop("checked", true); 
        anyMotePluginActive = true;  
        localStorage.setItem("npapi_enabled", true);
    }    
}



//Init drag/drop sorting.
function initGridster() {
    
    

    //Init gridster on all three button panels.
    if( isInFullTabMode ){
        gridster[0] = $("#remote_button_panel_main ul").gridster({
            namespace: '#remote_button_panel_main',
            widget_margins: [0, 0],
            widget_base_dimensions: [64, 48],
            shift_larger_widgets_down: false,
            max_rows: 10,
            max_cols: 15,
            min_rows: 10,
            min_cols: 15,
            max_size_x: 15,
            max_size_y: 10,
            draggable: {
                start:function(e, ui, $widget) {},
                drag: function(e, ui, $widget) {},
                stop: function(e, ui, $widget) { saveButtonLayoutSettings(); }
              }
        }).data('gridster');
    } else {
        gridster[0] = $("#remote_button_panel_main ul").gridster({
            namespace: '#remote_button_panel_main',
            widget_margins: [0, 0],
            widget_base_dimensions: [64, 48],
            shift_larger_widgets_down: false,
            max_rows: 7,
            max_cols: 5,
            min_rows: 7,
            min_cols: 5,
            max_size_x: 5,
            max_size_y: 7,
            draggable: {
                start:function(e, ui, $widget) {},
                drag: function(e, ui, $widget) {},
                stop: function(e, ui, $widget) { saveButtonLayoutSettings(); }
              }
        }).data('gridster');    
        gridster[1] = $("#remote_button_panel_alt ul").gridster({
            namespace: '#remote_button_panel_alt',
            widget_margins: [0, 0],
            widget_base_dimensions: [64, 48],
            shift_larger_widgets_down: false,
            max_rows: 7,
            max_cols: 5,
            min_rows: 7,
            min_cols: 5,
            max_size_x: 5,
            max_size_y: 7,
            draggable: {
                start:function(e, ui, $widget) {},
                drag: function(e, ui, $widget) {},
                stop: function(e, ui, $widget) { saveButtonLayoutSettings(); }
              }
        }).data('gridster');
        gridster[2] = $("#remote_button_panel_touch ul").gridster({
            namespace: '#remote_button_panel_touch',
            widget_margins: [0, 0],
            widget_base_dimensions: [64, 48],
            shift_larger_widgets_down: false,
            max_rows: 7,
            max_cols: 5,
            min_rows: 7,
            min_cols: 5,
            max_size_x: 5,
            max_size_y: 7,
            draggable: {
                start:function(e, ui, $widget) {},
                drag: function(e, ui, $widget) {},
                stop: function(e, ui, $widget) { saveButtonLayoutSettings(); }
              }
        }).data('gridster');
    }
    

    //Check for user setting, then lock or unlock button dragging.
    if(localStorage.getItem("buttons_draggable")){
        var isDraggableString = localStorage.getItem("buttons_draggable")+"";
        //console.log(isDraggableString);
        if(isDraggableString === "true") enableDraggableButtons();
        else disableDraggableButtons();
    } else enableDraggableButtons();

}


var touchPadMouseDown = false;
var mouseDownX = 0;
var mouseDownY = 0;
var currentY = 0;
var mouseMoved = false;

var initTouchPadEvents = function () {

    $("#remote_touch_pad").on('mousedown', function (e) {

        if( isInFullTabMode ){
            $("#remote_touch_pad").css("width", "960px");
            $("#remote_touch_pad").css("height", "480px");
            $("#remote_touch_pad").css("left", "-320px");
        } else {
            $("#remote_touch_pad").css("height", "431px");
        }
        $("#remote_button_panels").css("z-index", "3");

        touchPadMouseDown = true;

        mouseMoved = false;

    });

    $("#remote_touch_pad").on('mouseup', function (e) {

        if( isInFullTabMode ){
            $("#remote_touch_pad").css("width", "640px");
            $("#remote_touch_pad").css("height", "335px");
            $("#remote_touch_pad").css("left", "0px");
        } else {
            $("#remote_touch_pad").css("height", "239px");
        }
        
        $("#remote_button_panels").css("z-index", "1");

        touchPadMouseDown = false;

        if (!mouseMoved) {
            //send click
            if(!anyMotePluginActive) { //MoteBridge
                sendKeyCode("BTN_MOUSE");
            } else {                   //AnyMote
                sendTpadKeyEvent(e.which);
            }  
            
        }
        mouseMoved = false;
    });

    $("#remote_touch_pad").on('mouseout', function () {

        if( isInFullTabMode ){
            $("#remote_touch_pad").css("width", "640px");
            $("#remote_touch_pad").css("height", "335px");
            $("#remote_touch_pad").css("left", "0px");
        } else {
            $("#remote_touch_pad").css("height", "239px");
        }
        $("#remote_button_panels").css("z-index", "1");

    });

    var prevX = -1;
    var prevY = -1;

    $("#remote_touch_pad").on('mousemove', function (e) {
        var currentX = e.clientX;
        var currentY = e.clientY;
        var deltaX   = e.clientX - prevX;
        var deltaY   = e.clientY - prevY;

        if (touchPadMouseDown && !mouseLocked) {
            //console.log(deltaX + "  " + deltaY);
            if(!anyMotePluginActive) { //MoteBridge
                sendMovement(deltaX, deltaY); 
            } else {                   //AnyMote
                sendTpadMouseMoveEvent(deltaX, deltaY);
            }            
        }
        if (mouseDownX != e.clientX && mouseDownY != e.clientY && !mouseMoved)
            mouseMoved = true;
        prevX = e.clientX;
        prevY = e.clientY;
    });

    //$('#remote_touch_pad').bind('mousewheel', function(event, delta) {
    //  this.scrollLeft -= (delta * 30);
    //  event.preventDefault();
    //  console.log(event);
    //  sendScroll(scrollX, scrollY);
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
        //console.log(currPos);

        
        if(!anyMotePluginActive) { //MoteBridge
            sendScroll(0, currPos);
        } else {                   //AnyMote
            sendTpadMouseWheelEvent(0, currPos);
        }  
        //moving the position of the object
        //document.getElementById('scroll').style.top = currPos+"px";
        //document.getElementById('scroll').innerHTML = event.wheelDelta + ":" + event.detail;

    }


}




var enableKeyBoardEvents = function() {
	document.body.addEventListener('keydown', keyBoardEvents,false);
	console.log('Enabled keyboard mode.');
}

var disableKeyBoardEvents = function() {
	document.body.removeEventListener('keydown', keyBoardEvents, false);
	console.log('Disabled keyboard mode.');
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
            //$("#keyboard_activity_indicator").css("opacity","1");
            $( "#keyboard_activity_indicator" ).stop().animate({
                    opacity: 0.75,
            }, 100, function() {
                $( "#keyboard_activity_indicator" ).stop().animate({
                        opacity: 0.25,
                }, 200, function() {
                    // Animation complete.
                });
            });
            if(keyActTimeout) clearTimeout(keyActTimeout);
            keyActTimeout = setTimeout(function(){
                $( "#keyboard_activity_indicator" ).stop().animate({
                    opacity: 0,
                }, 250, function() {
                    // Animation complete.
                });
            }, 300);
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
var keyActTimeout = null;

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


function toggleCustomBorderColors(){
    if(!borderColorsEnabled) {
        $("#border_color_checkbox").prop("checked", true);
        borderColorsEnabled = true;
        changeThemeColor(themeHexColor);
    } else {
        $("#border_color_checkbox").prop("checked", false);
        borderColorsEnabled = false;
        changeThemeColor(themeHexColor);
    }
    $("#border_color_checkbox").blur();
}

function initColorPicker(){  

    if(borderColorsEnabled) $("#border_color_checkbox").prop("checked", true);
    else                    $("#border_color_checkbox").prop("checked", false);

    $('#colorpicker').farbtastic(function(color) {
        themeHexColor = color;
        changeThemeColor(color);
        $("#custom_theme_color_input").val(color);
    });
    //$.farbtastic('#colorpicker').setColor(themeHexColor);
    setTimeout(function(){ $.farbtastic('#colorpicker').setColor(themeHexColor);},10);
    $("#custom_theme_color_input").bind('paste', colorPickerInputChangeEvent)
                                  .bind('cut', colorPickerInputChangeEvent)
                                  .keyup(colorPickerInputChangeEvent)
                                  .bind('keypress', colorPickerInputKeyPressEvent);

    $("#border_color_checkbox_holder").click(function () { toggleCustomBorderColors(); });

    //Init presets.
    for( var i = 0 ; i < document.getElementsByClassName("theme_color_preset").length; i++ ){
        var thisEl = document.getElementsByClassName("theme_color_preset")[i],
         thisColor = thisEl.getAttribute("color"),
         hadBorder = false;

        if(thisEl.getAttribute("border") == "true") hadBorder = true;


        $(thisEl).css("background-color", thisColor);
        if(hadBorder) $(thisEl.getElementsByClassName("theme_color_border")).css("border-color",thisEl.getAttribute("color"));
        
        //console.log(thisEl.getAttribute("color"));

        $(thisEl).click(function(){
            if((this.getAttribute("border") == "true" && !borderColorsEnabled) || (this.getAttribute("border") == "false" && borderColorsEnabled)){
                toggleCustomBorderColors();
            }
            //changeThemeColor(this.getAttribute("color"));
            $.farbtastic('#colorpicker').setColor(this.getAttribute("color"));
        });
    }
    
}

function colorPickerInputChangeEvent(){
    setTimeout(function(){
        var initVal = $("#custom_theme_color_input").val();
        var value = $("#custom_theme_color_input").val().replace(/[^-a-fA-F0-9]/g, "");

        if($('#custom_theme_color_input').val()[0] != '#')
            $('#custom_theme_color_input').val('#' + value);

        if(initVal != '#'+value)
            $('#custom_theme_color_input').val('#' + value);

        if(value.length == 3 || value.length == 6)            
            $.farbtastic('#colorpicker').setColor('#' + value);
    }, 20);    
}

function colorPickerInputKeyPressEvent(event) {
    var regex = new RegExp("^[a-fA-F0-9]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key) && !(event.which == 13)) {
       event.preventDefault();
       return false;
    } else if(event.which == 13){
        var value = $("#custom_theme_color_input").val().replace(/[^-a-fA-F0-9]/g, "");
        if(value.length == 3 || value.length == 6) {
            $('#custom_theme_color_input').blur();
            console.log("Fire click event to save custom theme settings.");
        } else {
            $("#custom_theme_color_input").css("border-color", "#f00");
            setTimeout(function () {
                $("#custom_theme_color_input").css("border-color", "");
                setTimeout(function () {
                    $("#custom_theme_color_input").css("border-color", "#f00");
                    setTimeout(function () {
                        $("#custom_theme_color_input").css("border-color", "");
                        setTimeout(function () {                                
                            $("#custom_theme_color_input").focus();
                            setInputSelection(document.getElementById("custom_theme_color_input"), 1, 6);
                        }, 150);
                    }, 150);
                }, 150);
            }, 150);
        }
    }
}

function setInputSelection(input, startPos, endPos) {
    input.focus();
    if (typeof input.selectionStart != "undefined") {
        input.selectionStart = startPos;
        input.selectionEnd = endPos;
    } else if (document.selection && document.selection.createRange) {
        // IE branch
        input.select();
        var range = document.selection.createRange();
        range.collapse(true);
        range.moveEnd("character", endPos);
        range.moveStart("character", startPos);
        range.select();
    }
}

function changeThemeColor(hex) {
    var rgb = hexToRgb(hex);
    var red = rgb.r, green = rgb.g, blue = rgb.b;
    var borderColor = "";   
    if(borderColorsEnabled) borderColor = hex;//borderColor = "rgba(" + red + ", " + green + ", " + green + ", 0.75)"; 
    
    //$('body').css("background-color", 'rgba(' + giveHex(hex[1]+hex[2]) + ',' + giveHex(hex[3]+hex[4]) + ',' + giveHex(hex[5]+hex[6]) + ', 0.5)' );

    var css  =  '.device_found_active{border-color:'       + balanceSaturation(hex,"#f5f6f6") + '; \n' + 
                '                 background-color: rgba(' + hexToRgb(balanceSaturation(hex,"#f5f6f6")).r + ',' + 
                                                           hexToRgb(balanceSaturation(hex,"#f5f6f6")).g + ',' + 
                                                           hexToRgb(balanceSaturation(hex,"#f5f6f6")).b + ', 0.10 )} \n' +

                '.device_found:active{color:'       + balanceSaturation(hex,"#f5f6f6") + '; \n' + 
                '              border-color:'       + balanceSaturation(hex,"#f5f6f6") + '; \n' +
                '          background-color: rgba(' + hexToRgb(balanceSaturation(hex,"#f5f6f6")).r + ',' + 
                                                    hexToRgb(balanceSaturation(hex,"#f5f6f6")).g + ',' + 
                                                    hexToRgb(balanceSaturation(hex,"#f5f6f6")).b + ', 0.10 )} \n' +

                '.app_icon_item:hover{background-color: rgba(' + hexToRgb(balanceSaturation(hex,"#f5f6f6")).r + ',' + 
                                                               hexToRgb(balanceSaturation(hex,"#f5f6f6")).g + ',' + 
                                                               hexToRgb(balanceSaturation(hex,"#f5f6f6")).b + ', 0.10 )} \n' +
                '.app_icon_item:active{color:'      + balanceSaturation(hex,"#f5f6f6") + '; \n' + 
                '              border-color:'       + balanceSaturation(hex,"#f5f6f6") + '; \n' +
                '          background-color: rgba(' + hexToRgb(balanceSaturation(hex,"#f5f6f6")).r + ',' + 
                                                    hexToRgb(balanceSaturation(hex,"#f5f6f6")).g + ',' + 
                                                    hexToRgb(balanceSaturation(hex,"#f5f6f6")).b + ', 0.10 )} \n' +

                '.custom_intent_item:hover{background-color: rgba(' + hexToRgb(balanceSaturation(hex,"#f5f6f6")).r + ',' + 
                                                                    hexToRgb(balanceSaturation(hex,"#f5f6f6")).g + ',' + 
                                                                    hexToRgb(balanceSaturation(hex,"#f5f6f6")).b + ', 0.10 )} \n' +
                '.custom_intent_item:active{color:' + balanceSaturation(hex,"#f5f6f6") + '; \n' + 
                '              border-color:'       + balanceSaturation(hex,"#f5f6f6") + '; \n' +
                '          background-color: rgba(' + hexToRgb(balanceSaturation(hex,"#f5f6f6")).r + ',' + 
                                                    hexToRgb(balanceSaturation(hex,"#f5f6f6")).g + ',' + 
                                                    hexToRgb(balanceSaturation(hex,"#f5f6f6")).b + ', 0.10 )} \n' +

                '.custom_macro_item:hover{background-color: rgba(' + hexToRgb(balanceSaturation(hex,"#f5f6f6")).r + ',' + 
                                                                    hexToRgb(balanceSaturation(hex,"#f5f6f6")).g + ',' + 
                                                                    hexToRgb(balanceSaturation(hex,"#f5f6f6")).b + ', 0.10 )} \n' +
                '.custom_macro_item:active{color:' + balanceSaturation(hex,"#f5f6f6") + '; \n' + 
                '              border-color:'       + balanceSaturation(hex,"#f5f6f6") + '; \n' +
                '          background-color: rgba(' + hexToRgb(balanceSaturation(hex,"#f5f6f6")).r + ',' + 
                                                    hexToRgb(balanceSaturation(hex,"#f5f6f6")).g + ',' + 
                                                    hexToRgb(balanceSaturation(hex,"#f5f6f6")).b + ', 0.10 )} \n' +

                '.custom_macro_item:hover{background-color: rgba(' + hexToRgb(balanceSaturation(hex,"#f5f6f6")).r + ',' + 
                                                                    hexToRgb(balanceSaturation(hex,"#f5f6f6")).g + ',' + 
                                                                    hexToRgb(balanceSaturation(hex,"#f5f6f6")).b + ', 0.10 )} \n' +
                '.custom_macro_item:active{color:' + balanceSaturation(hex,"#f5f6f6") + '; \n' + 
                '              border-color:'       + balanceSaturation(hex,"#f5f6f6") + '; \n' +
                '          background-color: rgba(' + hexToRgb(balanceSaturation(hex,"#f5f6f6")).r + ',' + 
                                                    hexToRgb(balanceSaturation(hex,"#f5f6f6")).g + ',' + 
                                                    hexToRgb(balanceSaturation(hex,"#f5f6f6")).b + ', 0.10 )} \n' +

                '.system_channels_list_item:hover{background-color: rgba(' + hexToRgb(balanceSaturation(hex,"#f5f6f6")).r + ',' + 
                                                                    hexToRgb(balanceSaturation(hex,"#f5f6f6")).g + ',' + 
                                                                    hexToRgb(balanceSaturation(hex,"#f5f6f6")).b + ', 0.10 )} \n' +
                '.system_channels_list_item:active{color:' + balanceSaturation(hex,"#f5f6f6") + '; \n' + 
                '              border-color:'       + balanceSaturation(hex,"#f5f6f6") + '; \n' +
                '          background-color: rgba(' + hexToRgb(balanceSaturation(hex,"#f5f6f6")).r + ',' + 
                                                    hexToRgb(balanceSaturation(hex,"#f5f6f6")).g + ',' + 
                                                    hexToRgb(balanceSaturation(hex,"#f5f6f6")).b + ', 0.10 )} \n' +

                '.device_found:hover{background-color: rgba(' + hexToRgb(balanceSaturation(hex,"#f5f6f6")).r + ',' + 
                                                              hexToRgb(balanceSaturation(hex,"#f5f6f6")).g + ',' + 
                                                              hexToRgb(balanceSaturation(hex,"#f5f6f6")).b + ', 0.10 )} \n' +

                '.device_found_active .device_found_name_input:disabled{color:'       + balanceSaturation(hex,"#f5f6f6") + '} \n' +
                '.device_found_active .device_found_name_input:disabled:active{color:'+ balanceSaturation(hex,"#f5f6f6") + '} \n' +
                '.device_found_active .device_found_name_input:disabled:hover{color:' + balanceSaturation(hex,"#f5f6f6") + '} \n' +
                '.device_found_active .device_found_ip{color:' + balanceSaturation(hex,"#f5f6f6") + '} \n' +

                '#main_container{background-color:' + hex + '} \n' + 
                '.options_tabs_bottom_filler{background-color:' + hex + '} \n' + 
                '#ad_block_back{background-color:' + hex + '} \n' +                 
                '.loaderImage{background-color:' + balanceSaturation(hex,"#f5f6f6") + '} \n' + 
                '#devices_refresh_button{background-color:' + balanceSaturation(hex,"#f5f6f6") + '} \n' + 
                '#devices_add_button{background-color:' + balanceSaturation(hex,"#f5f6f6") + '} \n' + 
                '#intent_add_button{background-color:' + balanceSaturation(hex,"#f5f6f6") + '} \n' + 
                '#update_channels_button{background-color:' + balanceSaturation(hex,"#f5f6f6") + '} \n' + 
                '#apps_sync_button{background-color:' + balanceSaturation(hex,"#f5f6f6") + '} \n' + 
                '#macro_add_button{background-color:' + balanceSaturation(hex,"#f5f6f6") + '} \n' + 
                '.remote_button:not(.remote_button_no_border){ border-top-color:' + borderColor + '} \n' + 
                '.remote_button{border-left-color:' + borderColor + '} \n' + 
                '.remote_button_rocker{border-top-color:' + borderColor + '} \n' + 
                '.remote_button_rocker{border-left-color:' + borderColor + '} \n' + 
                '.touch_pad_filler{border-top-color:' + borderColor + '} \n' + 
                '.touch_pad_filler{border-left-color:' + borderColor + '} \n' + 
                '#menu_items{border-top-color:' + borderColor + '; \n' + 
                '           border-left-color:' + borderColor + '; \n' + 
                '          border-right-color:' + borderColor + ';} \n' + 
                '.menu_item{border-bottom-color:' + borderColor + '} \n' + 
                '.menu_panel_category{border-bottom-color:' + borderColor + '} \n' + 
                '.sub_menu_panel{border-bottom-color:' + borderColor + '} \n' + 
                '#ad_block_back{border-color:' + borderColor + '} \n' + 
                '.options_tabs_bottom_filler_inner{background-color:' + borderColor + '} \n' + 
                //'body{background-color:' + 'rgba(' + giveHex(hex[1]+hex[2]+"") + ',' + giveHex(hex[3]+hex[4]+"") + ',' + giveHex(hex[5]+hex[6]+"") + ', 0.5)' + '} \n' + 
                //$(".remote_button:not(.remote_button_no_border)").css("border-top-color", borderColor);
        
        '';
    if(isInFullTabMode) {
        css = css + 
              'body{background-color: rgba(' + giveHex(hex[1]+hex[2]) + ',' + giveHex(hex[3]+hex[4]) + ',' + giveHex(hex[5]+hex[6]) + ', 0.5);} \n' + 
              '#main_button_list{border-color:' + borderColor + '} \n';
    }
              
              
    $("#theme_colors").remove();
    var style=document.createElement('style');
    style.id = "theme_colors";
    if (style.styleSheet) style.styleSheet.cssText=css; else style.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(style);

    localStorage.setItem("theme_colors", '{ "baseColor": "' + hex + '", "borders": ' + borderColorsEnabled + ' }');
}

function hexToRgb(hex) {
    if(hex.length == 4) hex = hex[0]+hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3];
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function getInverseHex(theString) {
    theString = theString[0] + theString[1] + theString[2] + theString[3] + theString[4] + theString[5];
    if(theString.length<6||theString.length>6){
        window.alert('You Must Enter a six digit color code')
        document.rin.reset();
        return false;
    }
    a=theString.slice(0,2);
    b=theString.slice(2,4);
    c=theString.slice(4,6);
    a1=16*giveHex(a.slice(0,1));
    a2=giveHex(a.slice(1,2));
    a=a1+a2;
    b1=16*giveHex(b.slice(0,1));
    b2=giveHex(b.slice(1,2));
    b=b1+b2;
    c1=16*giveHex(c.slice(0,1));
    c2=giveHex(c.slice(1,2));
    c=c1+c2;
    newColor=DecToHex(255-a)+""+DecToHex(255-b)+""+DecToHex(255-c)
    return "#" + newColor;    
}
var hexbase="0123456789ABCDEF";
function DecToHex(number) { return hexbase.charAt((number>> 4)& 0xf)+ hexbase.charAt(number& 0xf); }
function giveHex(s){ s=s.toUpperCase(); return parseInt(s,16); }

function openCrxOptionsPage(){
    var isTab = "false";
    chrome.tabs.getAllInWindow(undefined, function(tabs) {
        for (var i = 0, tab; tab = tabs[i]; i++) {
            isTab = "false";
            if(tab.url == chrome.extension.getURL('chromemote.html?tab') ){ isTab = "true"; }
            if(tab.url && isTab == "true") {
                if(isInFullTabMode) {
                    chrome.tabs.update(tab.id, {'pinned': !tab.pinned, selected: true});
                    console.log("Full Tab Mode was detected. Toggle tabs pinned state.");
                    isTab = "true";
                    window.close();
                    break;
                } else {
                    chrome.tabs.update(tab.id, {selected: true});
                    console.log("Full Tab Mode was detected. Selected Full Mode Tab.");
                    isTab = "true";
                    window.close();
                    break;
                }
            }   
        }
        if(isTab == "false") {
            chrome.tabs.create( {
                index: 0,
                url: chrome.extension.getURL('chromemote.html?tab'),
                pinned: true
            } );
            console.log("Full Tab Mode was not detected. Enabling Full Tab Mode.");
            window.close();
        }
    });
}

function balanceSaturation(hex, bgHex){
    var newHex = hex;
    if(!bgHex) bgHex = "#dcdee0";

    //console.log(hex[1] + hex[3] + hex[5]);
    var r1 = hex[1], r2 = hex[2],
        g1 = hex[3], g2 = hex[4],
        b1 = hex[5], b2 = hex[6],
        r = hex[1] + hex[2],
        g = hex[3] + hex[4],
        b = hex[5] + hex[6];

    var saturation = parseInt(r1, 16) + parseInt(g1, 16) + parseInt(b1, 16);
    //console.log("Saturation LVL: " + saturation);

    var bgDiff = (parseInt(bgHex[1]+bgHex[2]+"", 16) + parseInt(bgHex[3]+bgHex[4]+"", 16) + parseInt(bgHex[5]+bgHex[6]+"", 16)) - (parseInt(r, 16) + parseInt(g, 16) + parseInt(b, 16));
    //console.log("BG Difference: " + bgDiff);

    //if(bgDiff < 0) bgDiff = bgDiff * -1;
    if(bgDiff <=  50 && bgDiff >= 0) newHex = "#" + intToHex((hexToInt(r) - 40)) + intToHex((hexToInt(g) - 40)) + intToHex((hexToInt(b) - 40));
    if(bgDiff >= -50 && bgDiff <  0) newHex = "#" + intToHex((hexToInt(r) + 40)) + intToHex((hexToInt(g) + 40)) + intToHex((hexToInt(b) + 40));

    //console.log("newHex: " + newHex   );

    if(saturation < 4) newHex = "#3ea8b7";
    if(saturation <= 10 && saturation >= 4 && saturation < 40) newHex = "#" + intToHex((hexToInt(r) + 80)) + intToHex((hexToInt(g) + 80)) + intToHex((hexToInt(b) + 80));
    if(saturation >= 40) newHex = "#79797a";

    bgDiff = (parseInt("dc", 16) + parseInt("de", 16) + parseInt("e0", 16)) - (parseInt(intToHex((hexToInt(r) - 40)), 16) + parseInt(intToHex((hexToInt(g) - 40)), 16) + parseInt(intToHex((hexToInt(b) - 40)), 16));
    //console.log("BG Difference: " + bgDiff);

    return newHex;
}

function hexToInt(hex){ 
    var integer = 0;
    integer = parseInt(hex, 16 );
    return integer;
}
function intToHex(integer){ 
    var hex = "";
    hex = integer.toString( 16 );
    return hex; 
}

var devicesStatusLabelTimeout = setTimeout(function(){}, 1);
function setDevicesStatusLabel(msg, timeOut){
    document.getElementById("devices_status_label").textContent = msg;
    clearTimeout(devicesStatusLabelTimeout);
    if(timeOut) devicesStatusLabelTimeout = setTimeout(function(){ document.getElementById("devices_status_label").textContent = ""; }, 5000);
}

function sendKeyCode(keyCode, keyDown, callback) {
    if(!anyMotePluginActive) { //MoteBridge
        if(keyDown == null || keyDown ) sendMoteCommand("keycode", keyCode, callback);
    } else {                   //AnyMote
        sendKeyEvent(keyCode, keyDown);
    }
}

function sendFling(uri){
    if(!anyMotePluginActive) { //MoteBridge
        sendMBridgeFling(uri);
    } else {                   //AnyMote
        sendAnymoteFling(uri);
    }    
}

function initMoteServerIPSettings(){
    if(moteServerAddress != null){
        $("#menu_panel_settings_mote_ip #ipaddress_abcd__octet_1").attr("value", moteServerAddress.split('.')[0]);
        $("#menu_panel_settings_mote_ip #ipaddress_abcd__octet_2").attr("value", moteServerAddress.split('.')[1]);
        $("#menu_panel_settings_mote_ip #ipaddress_abcd__octet_3").attr("value", moteServerAddress.split('.')[2]);
        $("#menu_panel_settings_mote_ip #ipaddress_abcd__octet_4").attr("value", moteServerAddress.split('.')[3]);
        document.getElementsByClassName("mote_server_ip_input")[0].value = moteServerAddress;
    }
    $("#menu_panel_settings_mote_ip #ipaddress_abcd__octet_1, #menu_panel_settings_mote_ip #ipaddress_abcd__octet_2, #menu_panel_settings_mote_ip #ipaddress_abcd__octet_3, #menu_panel_settings_mote_ip #ipaddress_abcd__octet_4").bind('input', function(e) {
        $("#save_mote_ip_button").css("display","block");
        $("#cancel_mote_ip_button").css("display","block");
    });

    $("#save_mote_ip_button").click(function(){
        
        var ipEntered = document.getElementsByClassName("mote_server_ip_input")[0].value;

        if (ipAddressIsValid(ipEntered)) {
            setMoteServer(ipEntered);            
            $("#mote_server_status").css("background-color", "yellow");

            setTimeout(function(){ sendMoteCommand("getDeviceList", true); },250);

            $("#save_mote_ip_button").css("display","none");
            $("#cancel_mote_ip_button").css("display","none");

        } else {
            $("#menu_panel_settings_mote_ip .ip_container").css("border-color", "#f00");
            setTimeout(function () {
                $("#menu_panel_settings_mote_ip .ip_container").css("border-color", "");
                setTimeout(function () {
                    $("#menu_panel_settings_mote_ip .ip_container").css("border-color", "#f00");
                    setTimeout(function () {
                        $("#menu_panel_settings_mote_ip .ip_container").css("border-color", "");
                        setTimeout(function () {
                            $("#menu_panel_settings_mote_ip #ipaddress_abcd__octet_1").focus();
                            $("#menu_panel_settings_mote_ip #ipaddress_abcd__octet_1").select();
                        }, 150);
                    }, 150);
                }, 150);
            }, 150);
        }
    });
    $(function () { $('.mote_server_ip_input').ipaddress({ cidr: true }); });

    $("#cancel_mote_ip_button").click(function(){        
        
            $("#menu_panel_settings_mote_ip #ipaddress_abcd__octet_1").val('');
            $("#menu_panel_settings_mote_ip #ipaddress_abcd__octet_2").val('');
            $("#menu_panel_settings_mote_ip #ipaddress_abcd__octet_3").val('');
            $("#menu_panel_settings_mote_ip #ipaddress_abcd__octet_4").val('');
            document.getElementsByClassName("mote_server_ip_input")[0].value = '';

            if(moteServerAddress != null){
                $("#menu_panel_settings_mote_ip #ipaddress_abcd__octet_1").val(moteServerAddress.split('.')[0]);
                $("#menu_panel_settings_mote_ip #ipaddress_abcd__octet_2").val(moteServerAddress.split('.')[1]);
                $("#menu_panel_settings_mote_ip #ipaddress_abcd__octet_3").val(moteServerAddress.split('.')[2]);
                $("#menu_panel_settings_mote_ip #ipaddress_abcd__octet_4").val(moteServerAddress.split('.')[3]);
                document.getElementsByClassName("mote_server_ip_input")[0].value = moteServerAddress;
            
            }

            $("#save_mote_ip_button").css("display","none");
            $("#cancel_mote_ip_button").css("display","none");
        
    });

    //Check for user setting, then lock or unlock button dragging.
    if(localStorage.getItem("npapi_enabled")){
        var isEnabledString = localStorage.getItem("npapi_enabled")+"";
        if(isEnabledString === "true") enableNPAPIPlugin();
        else disableNPAPIPlugin();
    } else enableNPAPIPlugin();

}

function buildDialogBox(titleString, bodyHtml, option1String, option2String, option1Event, option2Event) {

    if(option1String == null) option1String = "Ok";
    if(option2String == null) option2String = "Close";

    var newDialogEl = document.createElement("div"),
        dialogBoxCount    = 1,
        dialogBoxId       = "dialog_box_holder_0";
    newDialogEl.className = "dialog_box_holder";
    do{ if(!document.getElementById("dialog_box_holder_" + dialogBoxCount)) {
            dialogBoxId = "dialog_box_holder_" + dialogBoxCount;
            break;
        } else{ dialogBoxCount++; }
    } while(true);
    newDialogEl.id = dialogBoxId;
    newDialogEl.innerHTML = "<div class='dialog_box'>" +
                                "<div class='dialog_box_header'>"  + titleString  + "</div>" +
                                "<div class='dialog_box_content'>" + bodyHtml     + "</div>" +
                                "<div class='dialog_box_footer'>"  +
                                    "<div class='dialog_box_footer_button main'>" + option1String + "</div>" +
                                    "<div class='dialog_box_footer_button alt'>"  + option2String + "</div>" +
                                "</div>" +
                            "</div>";
    $("body").append(newDialogEl);

    if(option1Event) $("#"+dialogBoxId+" .main").click(option1Event);
    if(option2Event) $("#"+dialogBoxId+" .alt").click(option2Event);

    $("#"+dialogBoxId+" .main, #"+dialogBoxId+" .alt").click(function(){
        var thisBoxId = this.parentNode.parentNode.parentNode.id;
        $("#"+thisBoxId).remove();  
    });
}

var toastTimeOut = null;
function showToast(messageString, showTime){

    if(!showTime) showTime = 5000;
    var newToastEl = document.createElement("div"),
        toastCount = 1,
        toastId    = "toast_msg_0";

    newToastEl.className = "toast_msg";    
    toastId = "toast_msg_" + toastCount;
    newToastEl.id = toastId;

    if(!document.getElementById("toast_msg_" + toastCount) ) {        
        newToastEl.innerHTML = "<div class='toast_msg_content'>" + messageString + "</div>";
        $("#main_container").append(newToastEl);
    } else {        
        clearTimeout( toastTimeOut );
        $(".toast_msg_content").text(messageString);
    }

    $("#"+toastId).click(function(){
        this.remove();
        var i = parseInt( this.id.replaceAll("toast_msg_","") );
        clearTimeout( toastTimeOut );
    });
    toastTimeOut = setTimeout(function(){
        $("#"+toastId).remove();
    }, showTime);

}

var currentAdIndex = 0;
function initAdCarousel(){

    setAd(currentAdIndex);
    setInterval(function(){ 
        var adCount = backgroundPageWindow.adsJson.length;
        currentAdIndex++;
        if(currentAdIndex >= adCount) currentAdIndex = 0;
        setAd(currentAdIndex);
    },5000);
    
    //setInterval(updateAdList, 5* 60 * 1000);
    updateAdList();
}

function setAd(index){    
    $('#ad_block').unbind('click'); // just for click events
    $('#ad_block').unbind(); // for all events
    $('#ad_block').off();
    $("#ad_block").click(function () { window.open("http://api.chromemote.com/link/"+backgroundPageWindow.adsJson[index]._id, "_blank"); });
    $("#ad_block").css("background-image", "url(" + backgroundPageWindow.adsJson[index].img + ")");
}

function updateAdList(){
    $.getJSON( "http://api.chromemote.com/ads/", function( data ) {
        //console.log( JSON.stringify(data) );
        backgroundPageWindow.adsJson = data;
        localStorage.setItem("ad_list", JSON.stringify(data));
    });
}