
function injectScript(tabId) {
	browser.scripting.executeScript({target: {tabId: tabId}, files: ["botfinder.js"]});
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.url && changeInfo.url.includes("https://www.twitch.tv")) {
		injectScript(tabId);			
	}
});
