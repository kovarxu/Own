const route = require('../lib/route')

if (!module.parent) {
  route.listen(3003, function () {
    console.log('server running on port 3003...')
  })
}

