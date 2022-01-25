function $(ele) {
  return document.querySelector(ele)
}
const bg = chrome.extension.getBackgroundPage()
$('#num').onkeyup = function (evt) {
  let value = evt.target.value
  let target = evt.target
  value = value >= 1 && value <= 10 ? value : 5
  target.value = value
}
$('#enter').onclick = function () {
  const num = $('#num').value || 5
  const isRandom = $('#random').checked
  chrome.runtime.sendMessage({ num, isRandom }, function () {})
  window.close()
}
