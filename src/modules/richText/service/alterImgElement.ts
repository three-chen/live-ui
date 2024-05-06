export function getRichTextContent(html: string, picURLs: string[]) {
  const contentHTML = html
  //   const frag = document.createDocumentFragment()
  const div = document.createElement('div')
  div.innerHTML = contentHTML

  // 把img元素中的图片替换成服务器返回的图片地址
  const images = div.querySelectorAll('img')
  for (let index = 0; index < images.length; index++) {
    const image = images[index]

    image.src = picURLs[index]
    image.style.maxWidth = '100%'
  }

  return div.innerHTML
}
