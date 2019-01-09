

const getCurUrl = () => location.href;





const [i, q] = ['www.iqiyi.com', 'v.qq.com']

if (getCurUrl().includes(q)) {
    qq();
}
if (getCurUrl().includes(i)) {
    iqiyi();
}



function qq() {
    const aList = document.querySelectorAll('span.item a');

    Array.from(aList).forEach(node => {
        node.onclick = function (e) {
            location.assign(node.href)
        }
    });
    const vipUrl = "https://jx.wslmf.com/?url=" + getCurUrl();

    const i = document.getElementById('mod_player');
    i.innerHTML = `<iframe id="mainIframe" height="100%" width="100%" name="mainIframe" src=${vipUrl} frameborder="0" scrolling="auto" ></iframe>`
}
function iqiyi() {
    alert('iqiyi')
    const aList = document.querySelectorAll('.select-link');
    console.log(aList)
    Array.from(aList).forEach(node => {
        node.onclick = function (e) {
            location.assign(node.baseURI.replace('https://' + i, ''))
        }
    });

    const vipUrl = "https://jx.wslmf.com/?url=" + getCurUrl();
    const i = document.getElementById('flashbox');
    i.innerHTML = `<iframe id="mainIframe" height="100%" width="100%" name="mainIframe" src=${vipUrl} frameborder="0" scrolling="auto" ></iframe>`
}








// fetch(vipUrl + curHref, {
//     method: 'GET'
// }).then(res => {
//     return res.text()
// }).then(res => {
//     console.log(res)

// })

const handler = {
    get: (t, n) => {
        return t[n]
    },
    set: (t, n, v) => {
        t[n] = v;
        renderDom();
    }
}

function observable(obj) {
    return new Proxy(obj, handler)
}