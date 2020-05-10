const stream = require('stream')

let someData = 'abv'

module.exports = new stream.Duplex({
  write (chunk, encoding, next) {
    // Do something with the chunk and then call next() to indicate 
    // that the chunk has been processed. The write() fn will handle
    // data piped into this duplex stream. After the write() has
    // finished, the data will be processed by the read() below.
    someData = chunk.toString()
    next();
  },
  read ( size ) {
    // Add new data to be read by streams piped from this duplex
    setTimeout(() => {
      this.push( someData )
      someData = ''
    })
  }
})
