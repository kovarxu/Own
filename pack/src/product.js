const _ = require('lodash')
const mail = require('./mail.png')
require('./style.css')
const util = require('./active')

window.onload = function () {
  let asv = document.querySelector('.asv')
  asv.addEventListener('mouseover', function () {
    asv.classList.add('active')
  }, false)
  asv.addEventListener('mouseout', function () {
    asv.classList.remove('active')
  }, false)

  let l = [0, 1, 2, 3, '', 6]
  _.compact(l)
  document.writeln(l)

  document.writeln(util.getList())
}
