const editor = CodeMirror(document.querySelector('#text-content'), {
  lineNumbers: true,
});
let mesh = null

let curEdit = ''
const htmlButton = document.querySelector('#html-btn')
const cssButton = document.querySelector('#css-btn')
const jsButton = document.querySelector('#js-btn')

const htmlCon = document.querySelector('#html-con')
const cssCon = document.querySelector('#css-con')
const jsCon = document.querySelector('#js-con')

const grid = document.querySelector('#grid')

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

  grid.addEventListener('change', function(e) {
    let input = e.target
    if (input.checked) {
      console.log('checked')
      if (mesh) htmlCon.style['backgroundImage'] = `url(${mesh})`
    } else {
      htmlCon.style['backgroundImage'] = ''
    }
  })

  document.addEventListener('click', function(e) {
    let target = e.target
    if (target.tagName.toLowerCase() === 'button') {
      let allKids = [].slice.call(target.parentNode.children)
      allKids.forEach(kid => {
        kid.classList && kid.classList.remove('active')
      })
      target.classList.add('active')
    }
  })

  htmlButton.click()
  htmlCon.innerHTML = svgCode

  generateMesh()
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

function generateMesh () {
  let svgEle = htmlCon.querySelector('svg')
  let width = svgEle.clientWidth, height = svgEle.clientHeight 
  if (width && height) {
    let canvas = document.createElement('canvas')
    console.log(width, height)
    canvas.width = width
    canvas.height = height
    let ctx = canvas.getContext('2d')

    ctx.save()
    ctx.lineWidth = 2
    ctx.strokeStyle = '#555'

    ctx.strokeRect(1, 1, width-2, height-2)
    
    ctx.strokeStyle = '#999'
    for (let i=0; i<width/10; i++) {
      ctx.beginPath()
      ctx.moveTo(10*i, 0)
      if(i % 10 === 0) {
        ctx.lineTo(10*i, 12)
      } else {
        ctx.lineTo(10*i, 8)
      }
      ctx.stroke()
    }
    for (let i=0; i<height/10; i++) {
      ctx.beginPath()
      ctx.moveTo(0, 10*i)
      if(i % 10 === 0) {
        ctx.lineTo(12, 10*i)
      } else {
        ctx.lineTo(8, 10*i)
      }
      ctx.stroke()
    }

    ctx.restore()
    mesh = canvas.toDataURL()
  }
}
