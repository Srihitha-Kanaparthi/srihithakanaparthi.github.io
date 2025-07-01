var openPage = 'https://pce19a399738c476381639b5e4a1450b0.bildr.com/portifolio', bildrIfrmId = 'bildrifrm_Srihihta Portfolio_1', bildrPopId = 'Srihihta Portfolio_1'; 

//var openPage, bildrIfrmId, bildrPopId - vars from ext generating
// Append CSS File to head - 2023.05.23 -16.58

var headID = document.getElementsByTagName('head')[0];
if (!(document.getElementById("bildrStyleFileId"))) {
	var link = document.createElement('link');
	link.type = 'text/css';
	link.rel = 'stylesheet';
	headID.appendChild(link);
	link.href = chrome.runtime.getURL('src/bildr/ui/css/bildrStyle.css');
	link.id = "bildrStyleFileId";
	link.class = "bildrStyleFileClass";
}



var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }
        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}


//Open Bildr PopUp Page
var bildrPopUp = document.getElementById(bildrPopId);

if (!bildrPopUp) {
		
	var client = new HttpClient();
	client.get(chrome.runtime.getURL('./src/bildr/ui/index.html'), function(response) {
	//console.log("*****	Appending index.html");
		var elem = document.createElement('div');
		document.body.appendChild(elem);
		elem.outerHTML = response;
	});
} else {
	//bildr PopUp exist - toggle vissibe on-off
	if (bildrPopUp.style.display == "block") {
		//hide the panel
		bildrPopUp.style.display = "none";
		var bildrCss = document.getElementById("bildrStyleFileId");
		if (bildrCss) bildrCss.remove();
	} else {
		//show the panel
		bildrPopUp.style.display = "block";
	}	
}


/********** listener to event from iframe *********/
var eventMethod = window.addEventListener ? "addEventListener":"attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod === "attachEvent"?"onmessage":"message";

eventer(messageEvent, function (e) {
	if (e && openPage && (openPage.indexOf(e.origin) != -1)) {
		console.log('Message from iframe just came! - To popUp Script !!!');
		var fnctActArgs = [];
		let onWait = 0;
		try {
			if (e.data.fnctArgs) fnctActArgs=JSON.parse(e.data.fnctArgs);
		} catch(e) {}
		
		// If there are onLoad actions that need listeners, prepare flag to know about
		if (fnctActArgs.setOnLoadAsListener && fnctActArgs.setOnLoadAsListener != "undefined" && fnctActArgs.setOnLoadAsListener*1 == 1) {
			fnctActArgs.setOnLoadAsListener = 1;
		}
		if (fnctActArgs.onWait && fnctActArgs.onWait != "undefined" && fnctActArgs.onWait*1 == 1) {
			onWait = 1;
		}
		fnctActArgs.uMsgId = e.data.uMsgId;
		fnctActArgs.bildrIfrmId = bildrIfrmId;
		
		//make sure fnctArgs = Array
		if (!(fnctActArgs && fnctActArgs.constructor && fnctActArgs.constructor === Array)) fnctActArgs = [fnctActArgs];
		
		
		if (e.data.v3BildrExt) {
			var fnctName = e.data.fnctName;
			var response = window[fnctName](...fnctActArgs);			
		} else {
			/*
			var jsFunctionCode = e.data.jsCode;
			var F = new Function ('actionArguments',jsFunctionCode);
			var response = (F(fnctActArgs));
			*/
		}
		if (response !== undefined && onWait == 0) {
			var myIframe = document.getElementById(bildrIfrmId).contentWindow;
			myIframe.postMessage( {"msgId":e.data.uMsgId,"result":response}, "*");
			}
	}	
});
/********** END - listener to event from iframe *********/