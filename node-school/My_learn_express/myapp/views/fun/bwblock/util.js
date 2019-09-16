const canvas = document.getElementById('main-canvas')
const context = canvas.getContext('2d')
const R = 5, C = 6, W = 60

const usualColor = ['#111', '#eee', '#f13']

function renderCell (i, j, fillStyle, strokeStyle) {
  context.save()
  context.fillStyle = fillStyle
  context.strokeStyle = strokeStyle
  context.fillRect(j * W, i * W, W, W)
  context.strokeRect(j * W, i * W, W, W)
  context.restore()
}

function getClickPos (e) {
  const x = e.offsetX, y = e.offsetY
  return [Math.floor(x / W), Math.floor(y / W)]
}
