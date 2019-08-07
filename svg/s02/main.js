const svgDoms = document.getElementsByTagName('svg')
const svgs = Array.prototype.slice.call(svgDoms)
const idList = []

function main () {
  svgs.forEach((svg, index) => {
    let id = svg.id
    if (id) idList.push(id)
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '500')
    if (index) {
      svg.classList.add('hide')
    }
  })

  const text = new MainText()
  const gui = new dat.GUI()
  gui.remember(text)

  gui.add(text, 'pattern', idList).onChange(value => {
    let ele = document.getElementById(value)
    if (ele) {
      svgs.forEach((svg) => {
        if (svg.id !== value) svg.classList.add('hide')
        else svg.classList.remove('hide')
      })
    }
  })

  gui.add(text, 'guess', 0, 5.0).onChange(value => {
    let ele = document.getElementById('gauss_f')
    if (ele && ele.children.length) {
      ele.children[0].setAttribute('stdDeviation', value)
    }
  })

  document.body.classList.remove('hide')
}

const MainText = function () {
  this.pattern = idList[0]
  this.guess = 1.0
}

main()
