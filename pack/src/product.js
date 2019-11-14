const _ = require('lodash')
const $ = require('jquery')
const mail = require('./mail.png')
require('./style.css')
const util = require('./active')

window.onload = function () {
  let asv = $('.asv')
  asv.on('mouseover', function () {
    asv.classList.add('active')
  }, false)
  asv.on('mouseout', function () {
    asv.classList.remove('active')
  }, false)

  let l = [0, 1, 2, 3, '', 6]
  _.compact(l)
  document.writeln(l)

  document.writeln(util.getList())
}
