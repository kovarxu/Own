function main () {
  const text = new MainText()
  const gui = new dat.GUI()
  gui.remember(text)

  const f1 = gui.addFolder('Flow rush')
  f1.add(text, 'message')
  f1.add(text, 'speed', -5, 5)

  const f2 = gui.addFolder('Jackky mode')
  f2.add(text, 'display')
  f2.add(text, 'click')
  const controller = f2.add(text, 'favor', ['pizza', 'chrome', 'hooray'])
  controller.onChange(function (val) {
    document.body.appendChild(document.createTextNode(val + ' '))
  })
  controller.onFinishChange(function (val) {
    document.body.appendChild(document.createElement('hr'))
    console.log(text.favor)
  })
  
  const f3 = gui.addFolder('Special')
  f3.addColor(text, 'color')

  gui.add(text, 'message').name('this is a name').onChange(function() {
    alert('I am changed!')
  })

  f3.open()
}

const MainText = function () {
  this.message = 'main gui'
  this.speed = 0.7
  this.display = false
  this.click = function () {
    alert('yes')
  }
  this.favor = 'pizza'
  this.color = '#ff3333'
}

main()
