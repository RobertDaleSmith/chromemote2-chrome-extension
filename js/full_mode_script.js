var buttonsList = [];
var allButtonElements = document.getElementsByClassName("drag_btn");
for(var i=0; i < allButtonElements.length; i++) {
	buttonsList.push(JSON.parse('{"keycode":"' + allButtonElements[i].id + '"}'));
}
//console.dir(buttonsList);


//Load saved custom layout configuration.
if(localStorage.getItem("button_layout")){
    buttonLayoutJson = JSON.parse( localStorage.getItem("button_layout") );
    for(var i=0; i < document.getElementsByClassName("drag_btn").length; i++) {
    	if(document.getElementsByClassName("drag_btn")[i] && buttonLayoutJson[i]) {
			document.getElementsByClassName("drag_btn")[i].setAttribute("data-row", buttonLayoutJson[i].row);
			document.getElementsByClassName("drag_btn")[i].setAttribute("data-col", buttonLayoutJson[i].col);  
			document.getElementsByClassName("drag_btn")[i].setAttribute("swap", buttonLayoutJson[i].swap); 
		}
	}

	//Backup everything at/after length-7; create JSON string to be stored when saving in full mode.
	for(var i=buttonLayoutJson.length-7; i < buttonLayoutJson.length; i++) {
    	touchButtonLayoutJson.push(buttonLayoutJson[i]);
	}
	//console.dir(touchButtonLayoutJson);

	//console.dir(buttonLayoutJson);

	if(!isInFullTabMode) swapButtons();

} else buttonLayoutJson = JSON.parse( defaultButtonLayoutStr );

function swapButtons(){

	var mainBtnElementsToSwapHTML = "";
	var mainBtnElements = document.getElementById("main_button_list").getElementsByClassName("drag_btn");
	//console.dir(mainBtnElements);
	for(var i=0 ; i < mainBtnElements.length ; i++) {

		//console.log(mainBtnElements[i].getAttribute("swap"));
		if(mainBtnElements[i].getAttribute("swap") == "true"){
			console.log(mainBtnElements[i].id);
			mainBtnElementsToSwapHTML = mainBtnElementsToSwapHTML + mainBtnElements[i].outerHTML;
			mainBtnElements[i].parentNode.removeChild(mainBtnElements[i]); i--;
		}
		
	}
	//console.log(mainBtnElementsToSwapHTML);
	
	var altBtnElementsToSwapHTML = "";
	var altButtonElements = document.getElementById("alt_button_list").getElementsByClassName("drag_btn");
	for(var i=0 ; i < altButtonElements.length ; i++) {

		if(altButtonElements[i].getAttribute("swap") == "true"){
			console.log(altButtonElements[i]);
			altBtnElementsToSwapHTML = altBtnElementsToSwapHTML + altButtonElements[i].outerHTML;
			altButtonElements[i].parentNode.removeChild(altButtonElements[i]); i--;
		}
		
	}
	//console.log(mainBtnElementsToSwapHTML);
	
	$("#main_button_list").append( altBtnElementsToSwapHTML );
	$("#alt_button_list").append( mainBtnElementsToSwapHTML );
}

function initFullTabMode(){

	//Shift positions to fit on fulltab mode.
	var mainButtonElements = document.getElementById("main_button_list").getElementsByClassName("drag_btn");
	for(var i=0 ; i < mainButtonElements.length ; i++) {
		var thisRow = parseInt(mainButtonElements[i].getAttribute("data-row")), thisCol = parseInt(mainButtonElements[i].getAttribute("data-col"));
		if(mainButtonElements[i].getAttribute("swap") == "true"){
			//console.log("!!");
			if(thisRow >= 1 && thisRow <= 2) {
	            mainButtonElements[i].setAttribute( "data-row", thisRow + 7  );
	        } else if(thisRow >= 3  && thisRow <= 5) {
	            mainButtonElements[i].setAttribute( "data-row", thisRow + 5  );
	            mainButtonElements[i].setAttribute( "data-col", thisCol + 5  );
	        } else if(thisRow >= 6 && thisRow <= 7) {
	            mainButtonElements[i].setAttribute( "data-row", thisRow + 2  );
	            mainButtonElements[i].setAttribute( "data-col", thisCol + 10 );
	        }
		}
	}

	var altButtonElements = document.getElementById("alt_button_list").getElementsByClassName("drag_btn");
	for(var i=0 ; i < altButtonElements.length ; i++) {
		var thisRow = parseInt(altButtonElements[i].getAttribute("data-row")), thisCol = parseInt(altButtonElements[i].getAttribute("data-col"));
		if(altButtonElements[i].getAttribute("swap") == "false"){
			if(thisRow >= 1 && thisRow <= 2) {
	            altButtonElements[i].setAttribute( "data-row", thisRow + 7  );
	        } else if(thisRow >= 3  && thisRow <= 5) {
	            altButtonElements[i].setAttribute( "data-row", thisRow + 5  );
	            altButtonElements[i].setAttribute( "data-col", thisCol + 5  );
	        } else if(thisRow >= 6 && thisRow <= 7) {
	            altButtonElements[i].setAttribute( "data-row", thisRow + 2  );
	            altButtonElements[i].setAttribute( "data-col", thisCol + 10 );
	        }
		}
		
	}
	
	$("#main_button_list").append( $("#alt_button_list").html() );
	$("#alt_button_list").html("");
	$('.touch_pad_filler').remove();
	$("#main_button_list").append( '<li data-row="1" data-col="6" data-sizex="10" data-sizey="7" class=" touch_pad_filler"><div id="keyboard_activity_indicator"></div></li>' );
	$("#main_button_list").append( '<li data-row="10" data-col="1"  data-sizex="5" data-sizey="1" class=" fiveByOneFiller"></li>' );
	$("#main_button_list").append( '<li data-row="10" data-col="11" data-sizex="5" data-sizey="1" class=" fiveByOneFiller"></li>' );
	
	var adBlockElementHtml = document.getElementById("ad_block_holder").outerHTML + "";
	$('#ad_block_holder').remove();
	$("#remote_button_panel_main").append(adBlockElementHtml);

	var optionsElementHtml = document.getElementById("options_panel_container").outerHTML + "";
	$('#options_panel_container').remove();
	$("#remote_button_panel_main").append(optionsElementHtml);
	
	$("#title_bar_title").text("full remote");
	//Inject full mode CSS.
	var css  =  '#main_container{ width:  960px;   \n' + 
				'				  height: 530px; } \n' +
				'#remote_button_panels{ width:  960px; \n' + 
				'				        height: 530px; \n' +
				'				        background-image: url("images/bg_full_remote.png"); \n' +
				'				        background-size: 960px 530px; }\n' +
				'#settings_menu_panel{ background-image:  none; \n' + 
				' 					   height: 100%; } \n' + 
				'#remote_button_panel_main{ background-image:  none; } \n' + 
				'#remote_button_panel_alt{ background-image:  none; \n' + 
				'				           display: none; }         \n' +
				'#remote_button_panel_touch{ background-image:  none; } \n' + 
				'#title_bar_container{ width:  960px; } \n' + 
				'#title_bar_title{ width:  832px; } \n' +
				'#touch_pad_open_button{ display:  none; } \n' + 
				'#alt_panel_button{ display:  none; } \n' + 
				'#lock_mouse_button{ display:  block; } \n' + 
				'#options_panel_container{ left:  640px;    \n' + 
				'				           bottom: -432px;  \n' +
				'				           height: 481px; }\n' +
				'#touch_button_list .remote_button{ display:  none; } \n' +
				'#touch_button_list .remote_button_rocker{ display:  none; } \n' +
				'#touch_button_list{ display:     none;  \n' +
				'				     width:       640px; \n' +
				'				     padding-top: 49px; }\n' +
				'#touch_button_list .touch_pad_filler{ width:  639px;  \n' +
				'				     				   height: 335px; }\n' +
				'#remote_touch_pad{ width:  640px;  \n' +
				'				    height: 336px; }\n' +
				'#remote_button_panel_main{  width: 960px;  \n' +
				'				          overflow: hidden;  \n' +
				'				            height: 482px; }\n' +
				'#main_button_list{ border-right-width: 1px;    \n' +
				'				    width:              959px;  \n' +
				'				    padding-top:        480px; }\n' +
				'.touch_pad_filler{ background-position:  160px 48px; } \n' +
				'#remote_button_panel_touch{ width:  640px; } \n' +
				'#full_mode_button{ display: none; } \n' +
				
				'#mouse_lock_cover{ width:  960px;  \n' +
				'				    height: 530px; }\n' +
				'#mouse_lock_cover_label1{ width:        640px;  \n' +
				'				           top:          105px;  \n' +
				'				           padding-left: 320px; }\n' +
				'#mouse_lock_cover_label2{ width:        640px;  \n' +
				'				           top:          320px;  \n' +
				'				           padding-left: 320px; }\n' +
				'.toast_msg{ bottom: 60px; !important } \n' +
				'.options_tabs_bottom_filler{ display:  block; !important} \n' + 
				'#apps_lists, #devices_list, #channels_list{   height: 435px; } \n' +
	'';
    
    $("#full_mode_css").remove();
    var style=document.createElement('style');
    style.id = "full_mode_css";
    if (style.styleSheet) style.styleSheet.cssText=css; else style.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(style);
} 

if( isInFullTabMode ) { //IS FULL TAB MODE
	initFullTabMode();
	initGridster();
} else if(isInPopUpMode) { //IS POPUP MODE
} else { //IS MISC MODE
}