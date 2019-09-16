var express = require('express');
var router = express.Router();
var path = require('path')
var fs = require('fs')

/* Get tool home page */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get(/\/(.*)/, function(req, res, next) {
  var fileSrc = 'views/tool/' + RegExp.$1
  if (path.extname(fileSrc) === '.html') {
    fs.exists(fileSrc, (exists) => {
      if (exists) {
        res.setHeader('Content-Type', 'text/html')
        fs.createReadStream(fileSrc).pipe(res)
      } else {
        res.render('s404')
      }
    })
  } else {
    res.render('s404')
  }
})

module.exports = router;
