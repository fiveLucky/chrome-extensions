
const aList = document.querySelectorAll('span.item a');
const i = document.getElementById('mod_player');
const urlList = Array.from(aList).map(node => node.baseURI);
const curHref = window.location.href;
const vipUrl = "https://jx.wslmf.com/?url=" + curHref;

i.innerHTML = `<iframe id="mainIframe" name="mainIframe" src=${vipUrl} frameborder="0" scrolling="auto" ></iframe>`


// fetch(vipUrl + curHref, {
//     method: 'GET'
// }).then(res => {
//     return res.text()
// }).then(res => {
//     console.log(res)

// })