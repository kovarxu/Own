let svg, turb

function main () {
  svg = document.querySelector('#tur-svg-1')
  turb = svg.querySelector('#truf').children[0]

  const gui = initGUI()
}

function initGUI () {
  const text = new MainText()
  const gui = new dat.GUI()
  gui.remember(text)

  gui.add(text, 'baseFrequencyX').onChange(function(value) {
    let frequency = turb.getAttribute('baseFrequency')
    let newFrequency = frequency.replace(/^[\d\.]+/, value)
    setTurbAttr(turb, 'baseFrequency', newFrequency)
  })

  gui.add(text, 'baseFrequencyY').onChange(function(value) {
    let frequency = turb.getAttribute('baseFrequency')
    let newFrequency = frequency.replace(/[\d\.]+$/, value)
    setTurbAttr(turb, 'baseFrequency', newFrequency)
  })

  gui.add(text, 'numOctaves', 1, 10).step(1).onChange(function(value) {
    setTurbAttr(turb, 'numOctaves', value)
  })

  gui.add(text, 'seed', 1, 10).step(1).onChange(function(value) {
    setTurbAttr(turb, 'seed', value)
  })

  gui.add(text, 'type', ['turbulence', 'fractalNoise']).onChange(function(value) {
    setTurbAttr(turb, 'type', value)
  })

  gui.add(text, 'stitchTiles', ['stitch', 'noStitch']).onChange(function(value) {
    setTurbAttr(turb, 'stitchTiles', value)
  })

  return gui
}

function setTurbAttr (turb, attr, value) {
  const curVal = turb.getAttribute(attr)
  if (curVal && curVal !== value) {
    turb.setAttribute(attr, value)
  }
}

const MainText = function () {
  this.baseFrequencyX = 0.025
  this.baseFrequencyY = 0.025
  this.numOctaves = 1
  this.type = 'turbulence'
  this.seed = 1
  this.stitchTiles = 'stitch'
}

main()
