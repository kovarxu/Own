const stream = require('stream')

module.exports = class Ws extends stream.Writable {

  constructor () {
    super({ objectMode: true })
    this.content = ''
  }

  _write(buf, encoding, callback) {
    let { data } = buf
    this.content += data.insurance.length || 0
    callback()
  }

  _final(callback) {
    console.log(this.content)
    callback()
  }
}
