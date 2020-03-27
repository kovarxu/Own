## draw 3d character 'F'

### avoid the turbulance when faces ecllapsed

`gl.enable(gl.CULL_FACE)` only see anti-clockwise triangles

`gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)`, `gl.enable(gl.DEPTH_TEST)`

apart from the color pixel, a depth pixel will drawn (in GPU), the value of it also changes from -1 to 1

but only those 0-1 values will be drawn.

#### understand what VAO is

both the a_position and a_color can use a single vao to bind to the relative Buffer, it can be seen as a tool for link data.

#### understand what ortho is

ortho(out, left, right, bottom, up, near, far) is a simple function converting the pixel coordinate to the clip space coordinate.

ortho can also be thought as normalizing an area in which the object drawn.

after ortho, a right-handed coordinate system can turn into a left-handed one.
