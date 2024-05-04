importScripts('/worker/spark-md5.min.js')

const spark = new self.SparkMD5.ArrayBuffer()

onmessage = function (e) {
  console.log(e)

  createHash(e.data).then((hash) => {
    this.postMessage(hash)
  })
}

function createHash(chunks) {
  let cur = 1
  return new Promise((resolve) => {
    chunks.forEach(async (chunk) => {
      await createOne(chunk)
      if (cur === chunks.length) {
        resolve(spark.end())
      } else {
        cur++
      }
    })
  })
}

function createOne(chunk) {
  return new Promise((resolve) => {
    const freader = new FileReader()
    freader.readAsArrayBuffer(chunk)
    freader.onload = (e) => {
      resolve(spark.append(e.target.result))
    }
  })
}
