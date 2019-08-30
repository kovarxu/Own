let curEdit = ''
const htmlButton = document.querySelector('#html-btn')
const cssButton = document.querySelector('#css-btn')
const jsButton = document.querySelector('#js-btn')

const htmlCon = document.querySelector('#html-con')
const cssCon = document.querySelector('#css-con')
const jsCon = document.querySelector('#js-con')

const textContent = document.querySelector('#text-content')

window.onload = function () {
  htmlButton.addEventListener('click', function() {
    curEdit = 'html'
    let ct = htmlCon.innerHTML
    textContent.innerHTML = ct.replace(/([<>])/g, $1 => {
      if ($1 === '<') return '&lt;'
      else if ($1 === '>') return '&gt;'
    })
  }, false)

  cssButton.addEventListener('click', function() {
    curEdit = 'css'
    let ct = cssCon.innerHTML
    textContent.innerHTML = ct
  }, false)

  jsButton.addEventListener('click', function() {
    curEdit = 'js'
    let ct = jsCon.innerHTML
    textContent.innerHTML = ct
  }, false)

  jsButton.click()
}

window.addEventListener('keydown', function(e) {
  if (e.key === 's' && e.ctrlKey) {
    e.preventDefault()
    if (curEdit === 'html') {
      htmlCon.innerHTML = textContent.innerHTML.replace(/(&gt;|&lt;)/g, $1 => {
        if ($1 === '&gt;') return '>'
        else if ($1 === '&lt;') return '<'
      })
    }
  }
})