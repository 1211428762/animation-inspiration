let animateClass = []
let menuNum = 5
let isRandom = true
let menuItemInfo = Array(menuNum)
let hasCreateMenu = false
const getRandomClass = (num = menuNum) => animateClass.sort(() => Math.random() - 0.5).slice(0, num)
const sendAnime = (cur) => {
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
      // onclick: () => sendAnime(cur),
      parentId: 'main',
    })
    menuItemInfo[index] = cur
  })
  menuNum = num
  isRandom = boo
}
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const index = info?.menuItemId?.replace('main', '')
  sendAnime(menuItemInfo[index])
})

const updateMenu = (num) => {
  //旧版更新逻辑
  menuItemInfo = getRandomClass(num)
  // sendUpdateMenu(menuItemInfo)
  menuItemInfo.forEach((cur, index) => {
    chrome.contextMenus.update('main' + String(index), {
      title: cur,
      // onclick: () => sendAnime(cur),
    })
  })
}
const initMenu = (arr) => {
  // 获取初始动画类名数组
  animateClass = arr
  createFatherMenu()
  createMenu(menuNum, true)
  hasCreateMenu = true
}
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // 只初始化一次
  if (message?.animateClass?.length && !hasCreateMenu) {
    initMenu(message.animateClass)
  }

  if (message.switch && isRandom) {
    if (hasCreateMenu) {
      updateMenu(menuNum)
    }
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
