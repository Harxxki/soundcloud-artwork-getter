// メッセージを受け取ったときの処理
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type == 'copy') {
    // クリップボードにコピーする
    navigator.clipboard.writeText(message.text).then(
      function () {
        console.log('Copied to clipboard!')
      },
      function (error) {
        console.error(error)
      }
    )
  }
})
