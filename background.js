chrome.action.onClicked.addListener(function (tab) {
	chrome.scripting.executeScript({
    target: {tabId: tab.id},
		files: ['./src/bildr/script.js']
	});
});


let bildrIfrmId = "";
let msgId = 0;
let callerTab = 0;

function onCaptured(imageUri) {
	console.log(imageUri);
	chrome.tabs.sendMessage(callerTab, {greeting: "tab capture result", imageUri:imageUri, bildrIfrmId:bildrIfrmId, msgId:msgId}, function(response) {
		console.log(response.farewell);
	});
}

function onError(error) {
  console.log(`Error: ${error}`);
}


chrome.runtime.onMessage.addListener((request, sender, reply) => {
	console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
	//capturetab Action receiver
	if (request.action == "captureTab")  {
		reply({ result: "Tab Caputure command received" });
		bildrIfrmId = request.bildrIfrmId;
		msgId = request.msgId;
		callerTab = sender.tab.id;
	
		let capturing = chrome.tabs.captureVisibleTab(request.imageOptions);
		capturing.then(onCaptured, onError);	
	}
	

	return true;
});