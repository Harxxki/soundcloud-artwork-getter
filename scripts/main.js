window.onload = function () {
  chrome.tabs.getSelected(null, function (tab) {
    document.getElementById('title').innerHTML = tab.title
    document.getElementById('url').innerHTML = tab.url
  })
}
