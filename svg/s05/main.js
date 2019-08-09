let svg, turb

function main () {
  svg = document.querySelector('#tur-svg-1')
  turb = svg.querySelector('#truf').children[0]

  const gui = initGUI ()

  const btn = document.querySelector('#btn')
  btn.onclick = function() {
    animTrubuY(0, 0.2, 1, 1)
  }
}

function initGUI () {
  const text = new MainText()
  const gui = new dat.GUI()
  gui.remember(text)

  gui.add(text, 'baseFrequencyX', 0).listen().onChange(function(value) {
    let frequency = turb.getAttribute('baseFrequency')
    let newFrequency = frequency.replace(/^[\d\.]+/, value)
    setTurbAttr(turb, 'baseFrequency', newFrequency)
  })

  gui.add(text, 'baseFrequencyY', 0).listen().onChange(function(value) {
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

function animTrubuY (startY, endY, speed, loop) {
  let pretime = 0, offset = 0, endOffset = endY - startY, invert = 0

  requestAnimationFrame(anim)

  function anim (time) {
    let dent = 0
    if (pretime === 0) {
      pretime = time
    } else {
      dent = (time - pretime) / 1000 * speed
      offset += dent
      pretime = time
      if (Math.abs(offset) >= endOffset) {
        offset = 0
        speed = -speed
        if (++invert >= loop * 2) {
          setFrequency(dent, true)
          return false
        }
      }
    }

    setFrequency(dent)

    requestAnimationFrame(anim)
  }

  function setFrequency (dent, reset) {
    let frequency = turb.getAttribute('baseFrequency')
    let newFrequency
    if (!reset) {
      newFrequency = frequency.replace(/([\d\.]+)$/, ($1) => Number($1) + dent >= 0 ? Number($1) + dent : 0)
    } else {
      newFrequency = frequency.replace(/([\d\.]+)$/, '0')
    }
    setTurbAttr(turb, 'baseFrequency', newFrequency)
  }
}

const MainText = function () {
  this.baseFrequencyX = 0
  this.baseFrequencyY = 0
  this.numOctaves = 2
  this.type = 'fractalNoise'
  this.seed = 3
  this.stitchTiles = 'stitch'
}

main()
