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
        // console.log('blob:', blob)
        // const fileUrl = URL.createObjectURL(blob)
        // console.log('fileUrl:', fileUrl)
        // window.open(fileUrl)

        // img要素を作成する
        const img = document.createElement('img')
        // img.src = imageUrl
        img.src = URL.createObjectURL(blob)
        console.log('img.src:', img.src)

        document.body.prepend(img)

        const canvas = document.createElement('canvas')
        canvas.width = 500
        canvas.height = 500
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)

        document.body.prepend(canvas)

        // canvas.toBlob((blob) => {
        //   // 画像データをクリップボードに書き込む
        //   const item = new ClipboardItem({
        //     'image/png': blob,
        //   })
        //   navigator.clipboard.write([item])
        //   console.log('クリップボードにコピーしました。')
        // }, 'image/png')

        // const item = new ClipboardItem({
        //   'image/png': canvas.toDataURL('image/png', 1),
        // })
        // navigator.clipboard.write([item])
      })
  }

  for (const element of elements) {
    const style = element.style
    const backgroundImage = style.backgroundImage
    if (backgroundImage && backgroundImage.startsWith('url(')) {
      const url = backgroundImage.substring(5, backgroundImage.length - 2)
      // console.log(url)
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
