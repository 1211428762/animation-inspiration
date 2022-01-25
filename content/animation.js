let target = null
document.oncontextmenu = function (evt) {
  target = evt.target
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    target.classList.add(`animate__animated`, `animate__${message.name}`)
    setTimeout(() => {
      target.classList.remove(`animate__animated`, `animate__${message.name}`)
    }, 1000)
  })
  chrome.runtime.sendMessage({ switch: true })
}

var linkzh = document.createElement('link')
linkzh.setAttribute('rel', 'stylesheet')
linkzh.setAttribute('href', 'https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.min.css')
document.head.appendChild(linkzh)
console.log('animate.css加载成功')
console.log('鼠标右键随机生成5个动画')
