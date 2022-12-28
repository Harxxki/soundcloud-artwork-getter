const getUrl = () => {
  const elements = document.querySelectorAll('span.sc-artwork.sc-artwork-40x')
  const copyText = (text) => {
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
  const getImage = (imageUrl) => {
    fetch(imageUrl)
      .then((response) => response.blob()) // 画像のデータをblobとして取得する
      .then((blob) => {
        // blobをData URL形式に変換する
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = function () {
          // Data URLをクリップボードに書き込む
          navigator.clipboard.writeText(reader.result)
        }
      })
  }

  for (const element of elements) {
    const style = element.style
    const backgroundImage = style.backgroundImage
    if (backgroundImage && backgroundImage.startsWith('url(')) {
      const url = backgroundImage.substring(5, backgroundImage.length - 2)
      console.log(url)
      copyText(url)
      getImage(url)
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
