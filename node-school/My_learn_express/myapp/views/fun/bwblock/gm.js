const hideColor = '#111'
const showColor = '#eee'
const strokeStyle = '#f13'

const lampArray = [
  [0, 1, 1, 0, 1, 0],
  [1, 0, 0, 1, 1, 1],
  [0, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 1],
  [0, 1, 1, 1, 0, 0]
]

function init () {
  render()
  canvas.addEventListener('click', onClick, false)
  canvas.addEventListener('touchend', onClick, false)
}

function render () {
  for (let i = 0; i < R; i++) {
    for (let j = 0; j < C; j++) {
      renderRect(i, j, lampArray[i][j])
    }
  }

  function renderRect (i, j, v) {
    let fillStyle = v ? showColor : hideColor
    renderCell(i, j, fillStyle, strokeStyle)
  }
}

function onClick (e) {
  changeLamp.apply(null, getClickPos(e))
  reRender()
}

function flip (i, j) {
  lampArray[j][i] ^= 1
}

function changeLamp (x, y) {
  flip(x, y)
  if (x >= 1) flip(x-1, y)
  if (x <= C - 2) flip(x+1, y)
  if (y >= 1) flip(x, y-1)
  if (y <= R - 2) flip(x, y+1)
}


function reRender () {
  context.clearRect(0, 0, C * W, R * W)
  render()
}

window.onload = init
