const getCurUrl = () => location.href;

const CURRENT_URL = location.href;

const URL = "https://api.v6.chat/?url=";

const [iqiyiDomain, qqDomain, mangGuoDomain] = ["www.iqiyi.com", "v.qq.com", "mgtv.com"];

if (getCurUrl().includes(qqDomain)) {
  qq();
}
// if (getCurUrl().includes(iqiyiDomain)) {
//   iqiyi();
// }
if (getCurUrl().includes(mangGuoDomain)) {
  mangGuoTV();
}

function qq() {
  const aList = document.querySelectorAll("span.item a");

  Array.from(aList).forEach((node) => {
    node.onclick = function (e) {
      location.assign(node.href);
    };
  });
  const vipUrl = URL + getCurUrl();
  const i = document.getElementById("mod_player");
  i.innerHTML = `<iframe id="mainIframe" height="100%" width="100%" name="mainIframe" src=${vipUrl} frameborder="0" scrolling="auto" allowfullscreen ></iframe>`;
}

function iqiyi() {
  //   const aList = document.querySelectorAll(".play-list-item");
  //   console.log(aList);
  //   Array.from(aList).forEach((node) => {
  //     node.onclick = function (e) {
  //       setTimeout(() => {
  //         window.location.reload();
  //       }, 200);
  //     };
  //   });

  listenUrlChange(() => {
    location.reload();
  });
  //   爱奇艺的视频和音频貌似分离了，只能通过暂停他的播放器，来避免声音继续播放
  listenDom(
    () => document.getElementsByTagName("video")[0],
    (dom) => {
      dom.pause();
      const vipUrl = URL + getCurUrl();
      const i = document.getElementById("flashbox");
      i.innerHTML = `<iframe id="mainIframe" height="100%" width="100%" name="mainIframe" src=${vipUrl} frameborder="0" scrolling="auto" ></iframe>`;
    }
  );
}

function mangGuoTV() {
  const aList = document.querySelectorAll("li.variety-column-series a");

  Array.from(aList).forEach((node) => {
    node.onclick = function (e) {
      location.assign(node.href);
    };
  });
  const vipUrl = URL + getCurUrl();

  listenDom(
    () => document.querySelector("container"),
    (dom) => {
      //   const wrapper = document.createElement("div");
      //   wrapper.style.height = "100%";
      //   wrapper.style.width = "100%";
      //   wrapper.style.position = "absolute";
      //   wrapper.style.top = "0";
      //   wrapper.style.zIndex = "999";

      dom.parentNode.innerHTML = `<iframe id="mainIframe" height="100%" width="100%" name="mainIframe" src=${vipUrl} frameborder="0" scrolling="auto" allowfullscreen ></iframe>`;
      //   删除原视频和音频
      setTimeout(() => {
        dom.parentNode.removeChild(dom);
      }, 500);
    }
  );
}

function listenDom(getDom, callback) {
  let timer = setTimeout(() => {
    const dom = getDom();
    if (dom) {
      callback(dom);
    } else {
      listenDom(getDom, callback);
    }
  }, 500);
}

function listenUrlChange(callback) {
  window.onhashchange = callback;
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
    return t[n];
  },
  set: (t, n, v) => {
    t[n] = v;
    renderDom();
  },
};

function observable(obj) {
  return new Proxy(obj, handler);
}
