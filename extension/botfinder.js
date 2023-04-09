var viewerList = [];
var botList = [];

function setMenuText(message) {
	var menuText = document.getElementById("bot-finder-text");
	menuText.innerText = message;
}

async function getBots() {
	var url = 'https://raw.githubusercontent.com/paret0x/Twitch-Bot-Finder/main/botlist.txt';
	
	var response = await fetch(url, {method: 'GET', mode: 'cors', headers: { "Accept": "text/plain" }});
	var data = await response.text();

	var bots = data.split("\n");
	botList.push(...bots);
	
	setMenuText("Loaded " + bots.length + " bots");
}

function findViewers() {
	setMenuText("Searching for bots");
	
	for (var index = 0; index < viewerList.length; index++) {
		viewerList[index].classList.remove("viewer-bot");
	}
	viewerList = [];
	
	var classNames = ["CoreText-sc-1txzju1-0 boA-dNo", "ScCoreLink-sc-16kq0mq-0 fHFCAz tw-link"];
	for (var index = 0; index < classNames.length; index++) {
		var list = document.getElementsByClassName(classNames[index]);
		
		if (list.length > 0) {
			viewerList.push(...list);
			return;
		}
	}
}

function highlightBots() {
	var foundBotCount = 0;
	for (var index = 0; index < viewerList.length; index++) {
		var username = viewerList[index].innerHTML.toLowerCase();
		
		if (botList.includes(username)) {
			viewerList[index].classList.add("viewer-bot");
			foundBotCount += 1;
		}
	}
	
	setMenuText("Found " + foundBotCount + " bots");
}

function onButtonClick() {
	findViewers();
	highlightBots();
}

function getViewerLayout() {
	var classNames = ["Layout-sc-1xcs6mc-0 kRyZEP", "Layout-sc-1xcs6mc-0 dLmtZi"];
	
	for (var index = 0; index < classNames.length; index++) {
		var layouts = document.getElementsByClassName(classNames[index]);
		if (layouts.length > 0) {
			return layouts[0];
		}
	}
	
	return null;
}

function injectContextMenu() {
	var contextMenu = document.createElement("div");
	contextMenu.className = "bot-finder-menu";
	
	var contextMenuHeader = document.createElement("p");
	contextMenuHeader.className = "bot-finder-header";
	contextMenuHeader.innerText = "Bot Finder Menu";
	
	var botButton = document.createElement("button");
	botButton.className = "bot-finder-button";
	botButton.innerHTML = "Find Bots";
	botButton.onclick = onButtonClick;
	
	var menuText = document.createElement("span");
	menuText.innerText = "Loading bot list";
	menuText.id = "bot-finder-text";
	
	contextMenu.appendChild(contextMenuHeader);
	contextMenu.appendChild(botButton);
	contextMenu.appendChild(menuText);
	
	// Moderator view
	var modLayout = document.getElementsByClassName("Layout-sc-1xcs6mc-0 kRyZEP");
	if (modLayout.length > 0) {
		contextMenu.classList.add("bot-finder-mod-view");
		modLayout[0].insertBefore(contextMenu, modLayout[0].firstChild);
		return;
	}
	
	// Regular view
	var regularLayout = document.getElementsByClassName("Layout-sc-1xcs6mc-0 krdEPl");
	if (regularLayout.length > 0) {
		contextMenu.classList.add("bot-finder-normal-view");
		var regularLayoutParent = regularLayout[0].parentElement;
		regularLayoutParent.insertBefore(contextMenu, regularLayout[0]);
		return;
	}

	console.error("Failed to find viewer list");
}

function scriptAlreadyLoaded() {
	return (document.getElementsByClassName("bot-finder-menu").length > 0);
}

function doBootLoop() {
	if (scriptAlreadyLoaded()) {
		console.log("Script already loaded");
		return;
	}
	
	if (getViewerLayout() == null) {
		setTimeout(doBootLoop, 1000);
	} else {
		console.log("Adding bot finder menu");
		injectContextMenu();
		getBots();
	}
}

console.log("Bot finder script injected");
doBootLoop();
