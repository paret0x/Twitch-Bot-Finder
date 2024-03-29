var viewerList = [];
var botList = [];

function setMenuText(message) {
	var menuText = document.getElementById("bot-finder-text");
	if (menuText) {
		menuText.innerText = message;
	} else {
		console.debug("Menu text undefined");
	}
}

async function getBots() {
	var bots = [];

	var currentVersion = localStorage.getItem("twitch_bot_finder_version");
	if (currentVersion == null) {
		currentVersion = 0;
	} else {
		currentVersion = parseInt(currentVersion);
	}

	var versionUrl = 'https://raw.githubusercontent.com/paret0x/Twitch-Bot-Finder/main/version.txt';		
	var versionResponse = await fetch(versionUrl, {method: 'GET', mode: 'cors', headers: { "Accept": "text/plain" }});
	var versionData = await versionResponse.text();
	var newVersion = parseInt(versionData.split(":")[1]);

	var currentKnownBots = localStorage.getItem("twitch_bot_finder_list");
	
	if ((currentKnownBots == null) || (currentVersion != newVersion)) {
		console.debug("Pulling bots from GitHub");

		var botListUrl = 'https://raw.githubusercontent.com/paret0x/Twitch-Bot-Finder/main/botlist.txt';		
		var botListResponse = await fetch(botListUrl, {method: 'GET', mode: 'cors', headers: { "Accept": "text/plain" }});
		var botListData = await botListResponse.text();
		bots = botListData.split("\n");

		localStorage.setItem("twitch_bot_finder_list", JSON.stringify(bots));
		localStorage.setItem("twitch_bot_finder_version", newVersion.toString());
	} else {
		console.debug("Loading bots from storage");
		bots = JSON.parse(currentKnownBots);
	}
	
	botList.push(...bots);
	setMenuText("Loaded " + bots.length + " bots");
	
	var bt = document.getElementById("bot-finder-button");
	if (bt != null) {
		bt.disabled = false;
	}
}

function findViewers() {
	for (var index = 0; index < viewerList.length; index++) {
		viewerList[index].classList.remove("viewer-bot");
	}
	viewerList = [];
	
	var classNames = ["chatter-list-item--compact", "chatter-list-item"];
	for (var index = 0; index < classNames.length; index++) {
		var list = document.getElementsByClassName(classNames[index]);
		
		for (var chatter of list) {
			viewerList.push(chatter.firstChild.firstChild);
		}
	}
	console.debug("Found " + viewerList.length + " viewers");
}

function highlightBots() {
	var foundBotCount = 0;
	for (var index = 0; index < viewerList.length; index++) {
		var username = viewerList[index].innerHTML.toLowerCase();
		
		if (botList.includes(username)) {
			console.debug("Found bot: " + username);

			viewerList[index].classList.add("viewer-bot");
			foundBotCount += 1;
		} else {
			console.debug("Viewer " + username + " is not a bot");
		}
	}
	
	setMenuText("Highlighted " + foundBotCount + " bot(s)");
}

function onButtonClick() {
	setMenuText("Searching for bots");
	
	setTimeout(function() {
		findViewers();
		highlightBots();
	}, 500);
}

function getBotFinderMenu() {
	var menus = document.getElementsByClassName("bot-finder-menu");
	if (menus.length > 0) {
		return menus[0];
	} else {
		return null;
	}
}

function injectContextMenu() {
	var contextMenu = document.createElement("div");
	contextMenu.className = "bot-finder-menu";
	
	var contextMenuHeader = document.createElement("p");
	contextMenuHeader.className = "bot-finder-header";
	contextMenuHeader.innerText = "Bot Finder Menu";
	
	var botButton = document.createElement("button");
	botButton.id = "bot-finder-button";
	botButton.className = "bot-finder-button";
	botButton.innerHTML = "Find Bots";
	botButton.onclick = onButtonClick;
	
	var menuText = document.createElement("span");
	if (botList.length > 0) {
		menuText.innerText = "Loaded " + botList.length + " bots";
		botButton.disabled = false;
	} else {
		menuText.innerText = "Loading bot list";
		botButton.disabled = true;
	}
	menuText.id = "bot-finder-text";
	
	contextMenu.appendChild(contextMenuHeader);
	contextMenu.appendChild(botButton);
	contextMenu.appendChild(menuText);

	var sidebar = document.getElementById("community-tab-content");
	if (sidebar != null) {
		contextMenu.classList.add("bot-finder-menu-view");
		sidebar.insertBefore(contextMenu, sidebar.firstChild);
		return;
	}

	console.error("Failed to find viewer list");
}

function scriptAlreadyLoaded() {
	return (getBotFinderMenu() != null);
}

function onViewerPaneFound() {
	if (scriptAlreadyLoaded()) {
		console.debug("Script already loaded");
		return;
	}
	
	if (botList.length == 0) {
		getBots();
	}
	injectContextMenu();
}

function waitForRemovedNode(id) {
    new MutationObserver(function(mutations) {
        var el = document.getElementById(id);
        if (!el) {
			this.disconnect();
			console.debug("Sidebar destroyed, waiting to recreate");
			waitForAddedNode(id);
		}
	}).observe(document.body, {subtree: false, childList: true});
}

function waitForAddedNode(id) {
    new MutationObserver(function(mutations) {
        var el = document.getElementById(id);
        if (el) {
			this.disconnect();
			console.debug("Sidebar loaded/opened");
			onViewerPaneFound();
			waitForRemovedNode(id);
		}
	}).observe(document.body, {subtree: false, childList: true});
}

function setupObservers() {
	if (scriptAlreadyLoaded()) {
		console.debug("Script already loaded");
		return;
	}
	
	waitForAddedNode("community-tab-content");
}

console.log("Bot finder script injected");
setupObservers();
