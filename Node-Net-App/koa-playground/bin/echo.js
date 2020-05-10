const echo = require('../lib/echo')

if (!module.parent) {
  echo.listen(3003, function () {
    console.log('server running on port 3003...')
  })
}
