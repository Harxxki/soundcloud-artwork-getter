const getImage = () => {
  const _getImage = (imageUrl) => {
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const img = document.createElement('img')
        img.src = URL.createObjectURL(blob)

        const canvas = document.createElement('canvas')
        img.onload = function () {
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)
          canvas.toBlob((blob) => {
            const item = new ClipboardItem({
              'image/png': blob,
            })
            navigator.clipboard.write([item])
            console.log(
              'SoundCloud Coverart Getter: Artwork copied to clipboard.'
            )
          }, 'image/png')
        }
      })
  }

  const elements = document.querySelectorAll('span.sc-artwork.sc-artwork-40x')

  for (const element of elements) {
    const style = element.style
    const backgroundImage = style.backgroundImage
    if (backgroundImage && backgroundImage.startsWith('url(')) {
      const url = backgroundImage.substring(5, backgroundImage.length - 2)
      _getImage(url)
    }
  }
}

// When a browser action is clicked
chrome.action.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: getImage,
    })
  })
})
