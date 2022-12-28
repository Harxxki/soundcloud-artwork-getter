const getUrl = () => {
  const elements = document.querySelectorAll('span.sc-artwork.sc-artwork-40x')
  for (const element of elements) {
    const style = element.style
    const backgroundImage = style.backgroundImage
    if (backgroundImage && backgroundImage.startsWith('url(')) {
      const url = backgroundImage.substring(4, backgroundImage.length - 1)
      console.log(url)
      chrome.runtime.sendMessage({ type: 'copy', text: url })
    }
  }
}

// ブラウザアクションをクリックしたときの処理
chrome.action.onClicked.addListener(() => {
  console.log('browser action')
  // アクティブなタブを取得する
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // タブを指定して、コンテンツスクリプトを実行する
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: getUrl,
    })
  })
})

const unsecuredCopyToClipboard = (text) => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  try {
    document.execCommand('copy')
  } catch (err) {
    console.error('Unable to copy to clipboard', err)
  }
  document.body.removeChild(textArea)
}

// メッセージを受け取ったときの処理
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type == 'copy') {
    // クリップボードにコピーする
    unsecuredCopyToClipboard(message.text)
    // navigator.clipboard.writeText(message.text).then(
    //   function () {
    //     console.log('Copied to clipboard!')
    //   },
    //   function (error) {
    //     console.error(error)
    //   }
    // )
  }
})
