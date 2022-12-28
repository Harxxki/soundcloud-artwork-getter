// ブラウザアクションをクリックしたときの処理
chrome.action.onClicked.addListener(() => {
  console.log('browser action')
  // アクティブなタブを取得する
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // タブを指定して、コンテンツスクリプトを実行する
    chrome.tabs.executeScript(tabs[0].id, {
      code:
        `const elements = document.querySelectorAll('.sc-artwork *');\n` +
        `console.log('document.querySelectorAll()') \n` +
        `for (let i = 0; i < elements.length; i++) {\n` +
        `  const style = elements[i].style;\n` +
        `  const backgroundImage = style.backgroundImage;\n` +
        `  if (backgroundImage && backgroundImage.startsWith("url(")) {\n` +
        `    const url = backgroundImage.substring(4, backgroundImage.length - 1);\n` +
        `    console.log(url);\n` +
        `    chrome.runtime.sendMessage({type: "copy", text: url});\n` +
        `  }\n` +
        `}`,
    })
  })
})

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
