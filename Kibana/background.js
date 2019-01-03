
chrome.browserAction.onClicked.addListener(function () {
    const path = chrome.runtime.getURL('./release/index.html')
    chrome.tabs.create({ url: path })
});