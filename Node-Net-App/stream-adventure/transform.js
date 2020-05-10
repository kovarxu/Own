var through = require('through2')

// through2(options, _transform, _flush)

function _transform (buffer, encoding, callback) {
  this.push(buffer.toString().toUpperCase())
  callback()
}

function _flush (callback) {
  // 某些情况下，转换操作可能需要在流的末尾发送一些额外的数据，此时可用。
  callback()
}

var tr = through(_transform, _flush)
process.stdin.pipe(tr).pipe(process.stdout)
