## draw multiple views in a canvas

need to know:

1. modify viewport

`gl.viewport(0, 0, cw, ch)` => `gl.viewport(x, y, w, h)`

2. open scissor test, for `gl.clearColor()` need it

`gl.enable(gl.SCISSOR_TEST);`

## p02

practices draw multiple things (about 100) in webgl