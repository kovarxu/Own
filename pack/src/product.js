document.writeln('hi product')
let mail = require('./mail.png')

require('./style.css')

window.onload = function () {
  let asv = document.querySelector('.asv')
  asv.addEventListener('mouseover', function () {
    asv.classList.add('active')
  }, false)
  asv.addEventListener('mouseout', function () {
    asv.classList.remove('active')
  }, false)
}
