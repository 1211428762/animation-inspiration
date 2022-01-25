const sendAnime = (cur) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { name: cur }, function (response) {
      //向 content_script 发送消息
    })
  })
}
const arr = [
  'bounce',
  'flash',
  'pulse',
  'rubberBand',
  'shakeX',
  'shakeY',
  'headShake',
  'swing',
  'tada',
  'wobble',
  'jello',
  'heartBeat',
  'backInDown',
  'backInLeft',
  'backInRight',
  'backInUp',
  'backOutDown',
  'backOutLeft',
  'backOutRight',
  'backOutUp',
  'bounceIn',
  'bounceInDown',
  'bounceInLeft',
  'bounceInRight',
  'bounceInUp',
  'bounceOut',
  'bounceOutDown',
  'bounceOutLeft',
  'bounceOutRight',
  'bounceOutUp',
  'fadeIn',
  'fadeInDown',
  'fadeInDownBig',
  'fadeInLeft',
  'fadeInLeftBig',
  'fadeInRight',
  'fadeInRightBig',
  'fadeInUp',
  'fadeInUpBig',
  'fadeInTopLeft',
  'fadeInTopRight',
  'fadeInBottomLeft',
  'fadeInBottomRight',
  'fadeOut',
  'fadeOutDown',
  'fadeOutDownBig',
  'fadeOutLeft',
  'fadeOutLeftBig',
  'fadeOutRight',
  'fadeOutRightBig',
  'fadeOutUp',
  'fadeOutUpBig',
  'fadeOutTopLeft',
  'fadeOutTopRight',
  'fadeOutBottomRight',
  'fadeOutBottomLeft',
  'flip',
  'flipInX',
  'flipInY',
  'flipOutX',
  'flipOutY',
  'lightSpeedInRight',
  'lightSpeedInLeft',
  'lightSpeedOutRight',
  'lightSpeedOutLeft',
  'rotateIn',
  'rotateInDownLeft',
  'rotateInDownRight',
  'rotateInUpLeft',
  'rotateInUpRight',
  'rotateOut',
  'rotateOutDownLeft',
  'rotateOutDownRight',
  'rotateOutUpLeft',
  'rotateOutUpRight',
  'hinge',
  'jackInTheBox',
  'rollIn',
  'rollOut',
  'zoomIn',
  'zoomInDown',
  'zoomInLeft',
  'zoomInRight',
  'zoomInUp',
  'zoomOut',
  'zoomOutDown',
  'zoomOutLeft',
  'zoomOutRight',
  'zoomOutUp',
  'slideInDown',
  'slideInLeft',
  'slideInRight',
  'slideInUp',
  'slideOutDown',
  'slideOutLeft',
  'slideOutRight',
  'slideOutUp',
]
let menuNum = 5
let isRandom = true
chrome.contextMenus.create({
  type: 'normal',
  id: 'main',
  title: '动画选单',
  contexts: ['all'],
})
const createMenu = (num, boo) => {
  arr
    .sort(() => Math.random() - 0.5)
    .slice(0, num)
    .forEach((cur, index) => {
      chrome.contextMenus.create({
        type: 'normal',
        id: 'main' + String(index),
        title: cur,
        contexts: ['all'],
        onclick: () => sendAnime(cur),
        parentId: 'main',
      })
    })
  menuNum = num
  isRandom = boo
}
// 初始创建5条
createMenu(5, true)
const updateMenu = (num) => {
  arr
    .sort(() => Math.random() - 0.5)
    .slice(0, num)
    .forEach((cur, index) => {
      chrome.contextMenus.update('main' + String(index), {
        title: cur,
        onclick: () => sendAnime(cur),
      })
    })
}

chrome.runtime.onMessage.addListener(function (message, sender) {
  if (message.switch && isRandom) {
    updateMenu(menuNum)
  }

  if (message.num) {
    isRandom = message.isRandom
    if (message.num !== menuNum || isRandom === true) {
      for (let i = 0; i < menuNum; i++) {
        chrome.contextMenus.remove('main' + String(i))
      }
      createMenu(message?.num || 5, isRandom)
    }
  }
  // resPopup(menuNum, isRandom)

  return true
})
// const resPopup = (menuNum, isRandom) => {
//   var views = chrome.extension.getViews({ type: 'popup' })
//   if (views.length > 0) {
//     const dom = views.find((cur) => cur.document.title === '动画选单设置').document
//     console.log(dom.getElementById('num'), dom.getElementById('random'))
//     dom.getElementById('num').value = menuNum
//     dom.getElementById('random').checked = isRandom
//   }
// }
