var bildrScriptOpenPage = 'https://pce19a399738c476381639b5e4a1450b0.bildr.com/portifolio', bildrScriptBildrIfrmId = 'bildrifrm_Srihihta Portfolio_1', bildrScriptBildrPopId = 'Srihihta Portfolio_1'; 
function injectScript(file_path, tag) {
var node = document.getElementsByTagName(tag)[0];
var script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', file_path);
node.appendChild(script);
}
injectScript(chrome.runtime.getURL('js/injectScript_Srihihta Portfolio_1.js'), 'body');
chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) { 
	 //console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
	 if (request.greeting == "tab capture result") {
		sendResponse({farewell: "Tab captured"});
		//send restult to bildr page inside extension iframe
		var myIframe = document.getElementById(request.bildrIfrmId).contentWindow;
		myIframe.postMessage( {"msgId":request.msgId,"result":request.imageUri}, "*");
		}
	});
