import { uploadImgToServer } from 'live-service'

function uploadImages(contentEl: HTMLDivElement): Promise<string[]> {
  const images: NodeListOf<HTMLImageElement> = contentEl.querySelectorAll('img')
  //   createImageUploadStatusBar(images)

  const imageBlobs = null

  return new Promise((resolve, reject) => {
    uploadImagesToServer(images).then(picURLs => {
      console.log('all images uploaded', picURLs)
      //   removeImageUploadStatusBar(images)
      resolve(picURLs)
    })
  })
}

// function createImageUploadStatusBar(images: NodeListOf<HTMLImageElement>) {
//   for (let index = 0; index < images.length; index++) {
//     const image = images[index]

//     const div = document.createElement('div')
//     div.classList.add('image-upload-status')
//     const bar = document.createElement('div')
//     bar.className = 'image-upload-status-bar image-upload-status-bar-inactive'
//     bar.innerHTML = `<div class="image-upload-status-bar-progress">uploading...</div>`

//     const imgParent = image.parentNode // 获取 image 的父元素
//     imgParent!.insertBefore(div, image) // 将 div 插入到 image 前面
//     div.appendChild(image) // 将 image 移动到 div 内
//     div.appendChild(bar)
//   }
// }

// function removeImageUploadStatusBar(images: NodeListOf<HTMLImageElement>) {
//   for (let index = 0; index < images.length; index++) {
//     const image = images[index]
//     const div = image.parentNode
//     if (div!.className === 'image-upload-status') {
//       const parent = div.parentNode
//       parent.insertBefore(image, div)
//       parent.removeChild(div)
//     }
//   }
// }

function uploadImagesToServer(images: NodeListOf<HTMLImageElement>): Promise<string[]> {
  const promises = []
  for (let index = 0; index < images.length; index++) {
    promises.push(uploadImageToServer(images[index]))
  }
  return Promise.all(promises)
}

function uploadImageToServer(image: HTMLImageElement): Promise<string> {
  const base64Image = image
  return new Promise((resolve, reject) => {
    toOriginImage(base64Image).then((imageblob: any) => {
      console.log('imageblob', imageblob)

      resolve(uploadImgToServer(imageblob, ''))
    })
  })
}

function toOriginImage(base64Image: HTMLImageElement): Promise<Blob> {
  const imageMIME = base64Image.src.split(',')[0].split(':')[1].split(';')[0]
  const imageData = base64Image.src.split(',')[1]

  return new Promise((resolve, reject) => {
    // 如果imageData不是base64格式，则返回
    if (!base64Image.src.startsWith('data:image')) {
      reject('imageData is not base64 format')
    }
    // 如果base64图片尺寸大于1M
    // else if (imageData.length / 1.33 > 1024 * 1024) {
    //   reject('imageData is too large')
    // } else {
    const bstr = atob(imageData)
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    resolve(
      new Blob([u8arr], {
        type: imageMIME
      })
    )
    // }
  })
}

// function postImageBlob(image: HTMLImageElement, imageblob: Blob) {
//   return new Promise((resolve, reject) => {
//     // 模拟上传进度
//     let progress = 0
//     const progressBar = image.nextElementSibling
//     progressBar!.classList.remove('image-upload-status-bar-inactive')
//     progressBar!.classList.add('image-upload-status-bar-active')
//     const interval = setInterval(() => {
//       progress++
//       // image元素的后一个兄弟节点的style中的--progress属性设置为progress
//       console.log(progress)

//       progressBar!.style.setProperty('--progress', progress + '%')
//       if (progress == 100) {
//         // 清理掉interval定时器
//         clearInterval(interval)
//         progressBar!.classList.remove('image-upload-status-bar-active')
//         progressBar!.classList.add('image-upload-status-bar-inactive')
//         resolve('picURL')
//       }
//     }, 50)
//   })
// }

export { uploadImages }
