const editor = CodeMirror(document.querySelector('#text-content'), {
  lineNumbers: true,
});

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
    let ct = svgCode
    editor.setValue(ct.replace(/\n/, '')) // 消除第一个换行符
  }, false)

  cssButton.addEventListener('click', function() {
    curEdit = 'css'
    let ct = cssCon.innerHTML
    editor.setValue(ct)
  }, false)

  jsButton.addEventListener('click', function() {
    curEdit = 'js'
    let ct = jsCon.innerHTML
    editor.setValue(ct)
  }, false)

  document.addEventListener('click', function(e) {
    let target = e.target
    let allKids = [].slice.call(target.parentNode.children)
    allKids.forEach(kid => {
      kid.classList && kid.classList.remove('active')
    })
    target.classList.add('active')
  })

  htmlButton.click()
  htmlCon.innerHTML = svgCode
}

window.addEventListener('keydown', function(e) {
  if (e.key === 's' && e.ctrlKey) {
    e.preventDefault()
    if (curEdit === 'html') {
      htmlCon.innerHTML = svgCode = editor.getValue().replace(/(&gt;|&lt;)/g, $1 => {
        if ($1 === '&gt;') return '>'
        else if ($1 === '&lt;') return '<'
      })
    }
  }
})