const notFound = require('../lib/404')

if (!module.parent) {
  notFound.listen(3003, function () {
    console.log('server running on port 3003...')
  })
}
