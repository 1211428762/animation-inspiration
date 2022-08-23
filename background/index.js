let animateClass = [
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
let menuItemInfo = Array(menuNum)
let hasCreateMenu = false
let prevMenuItemInfo = Array(menuNum)
const getRandomClass = (num = menuNum) => animateClass.sort(() => Math.random() - 0.5).slice(0, num)
const sendAnime = (cur) => {
  // console.log(cur)
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { name: cur }, function (response) {
      //向 content_script 发送消息
    })
  })
}
const sendUpdateMenu = (menu) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { menu })
  })
}
const createFatherMenu = () => {
  chrome.contextMenus.create({
    type: 'normal',
    id: 'main',
    title: 'CSS动画选单',
    contexts: ['all'],
  })
}

const createMenu = (num, boo) => {
  getRandomClass(num).forEach((cur, index) => {
    chrome.contextMenus.create({
      type: 'normal',
      id: 'main' + String(index),
      title: cur,
      contexts: ['all'],
      parentId: 'main',
    })
    menuItemInfo[index] = cur
  })
  menuNum = num
  isRandom = boo
}
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const index = info?.menuItemId?.replace('main', '')
  const animateName = isRandom ? prevMenuItemInfo[index] : menuItemInfo[index]
  sendAnime(animateName)
})
const updateMenu = (num) => {
  //旧版更新逻辑

  prevMenuItemInfo = menuItemInfo
  menuItemInfo = getRandomClass(menuNum)
  menuItemInfo.forEach((cur, index) => {
    chrome.contextMenus.update('main' + String(index), {
      title: cur,
    })
  })
}
const initMenu = (arr) => {
  // 获取初始动画类名数组
  createFatherMenu()
  createMenu(menuNum, true)
  hasCreateMenu = true
}
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // 只初始化一次
  if (!hasCreateMenu) {
    initMenu(animateClass)
    updateMenu(menuNum)
  }

  if (message.switch && isRandom) {
    updateMenu(menuNum)
  }

  if (message.num) {
    isRandom = message.isRandom
    if (message.num !== menuNum || isRandom === true) {
      for (let i = 0; i < menuNum; i++) {
        chrome.contextMenus.remove('main' + String(i))
      }
      createMenu(Number(message?.num) || menuNum, isRandom)
    }
  }
  // resPopup(menuNum, isRandom)
  sendResponse()
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
