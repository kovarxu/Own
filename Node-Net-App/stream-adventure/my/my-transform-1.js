const stream = require('stream')

// 为了避免收集不完全，搞一个缓存
let content = ''

function transform(buffer, encoding, callback) {
  let jsonBody = buffer.toString()
  content += jsonBody
  callback()
}

// 在flush中一次性parse它
function flush(callback) {
  this.push(JSON.parse(content))
  callback()
}

module.exports = function jsonTransformer(options) {
  const streamInstance = new stream.Transform(options)
  streamInstance._transform = transform
  streamInstance._flush = flush
  return streamInstance
}
