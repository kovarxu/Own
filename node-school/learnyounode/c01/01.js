// console.log('HELLO WORLD')

var fs = require('fs')

var argvs = process.argv

// var nums = argvs.slice(2)

// console.log(nums.reduce((a, b) => a + Number(b), 0))

var filename = argvs[2]

if (filename) {
  // var fileContent = fs.readFileSync(filename, {
  //   encoding: 'utf-8',
  //   flat: 'r'
  // })
  // if (typeof fileContent === 'string') {
  //   console.log(fileContent.split('\n').length - 1)
  // }

  fs.readFile(filename, 'utf-8', (err, content) => {
     if (!err) {
      console.log(content.split('\n').length - 1)
    }
  })
}
