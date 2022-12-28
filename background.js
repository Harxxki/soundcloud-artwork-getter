const getUrl = () => {
  const elements = document.querySelectorAll('span.sc-artwork.sc-artwork-40x')
  const unsecuredCopyToClipboard = (text) => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.prepend(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
    } catch (err) {
      console.error('Unable to copy to clipboard', err)
    }
    document.body.removeChild(textArea)
  }

  for (const element of elements) {
    const style = element.style
    const backgroundImage = style.backgroundImage
    if (backgroundImage && backgroundImage.startsWith('url(')) {
      const url = backgroundImage.substring(4, backgroundImage.length - 1)
      console.log(url)
      unsecuredCopyToClipboard(url)
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
