const encode = (string) => {
    return string.split('').map(char => char.charCodeAt(0)).map(code => String.fromCharCode(code + 1)).join('');
}
const decode = (string) => {
    return string.split('').map(char => char.charCodeAt(0)).map(code => String.fromCharCode(code - 1)).join('');
}
chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({})
});