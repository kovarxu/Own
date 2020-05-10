const app = require('../../lib/up_load')

if (!module.parent) { 
  app.listen(3003, () => console.log('server running on port 3003...'))
}
