### varyings

pass data from vertex shader to fragment shader

write some `out v_abc` in vertex shader, and `in v_abc` in fragment shader, no need to specify the value in javascript files

### control buffer

`gl.vertexAttribPointer(location, numComponents, typeOfData, normalizeFlag, strideToNextPieceOfData, offsetIntoBuffer);`
`location: atrib location; numComponents: 1-4; typeOfData: following; normalizeFray: follwing; ...`

### buffer and data type

buffer can be specified as many types: `BYTE, FLOAT, INT, UNSIGNED_SHORT, etc...`  
stride means how many bytes to skip to get from one piece of data to the next.  
how far into the buffer our data is.

### normalize

If you set the normalize flag to true then the values of a BYTE (-128 to 127) represent the values -1.0 to +1.0,  
UNSIGNED_BYTE (0 to 255) become 0.0 to +1.0. A normalized SHORT also goes from -1.0 to +1.0 it just has more resolution than a BYTE.  

user these Integer types can save memory.

### matrix columns

matrix in gl(even c++) is different from mathmatics, converting matrix of the latter can be something like this:

[
  1, 0, 0, tx,
  0, 1, 0, ty,
  0, 0, 1, tz,
  0, 0, 0, 1
]

but in webgl(or opengl), it would be:

[
  1, 0, 0, 0, // this is a column, we can get x axis easily
  0, 1, 0, 0,
  0, 0, 1, 0,
  tx, ty, tz, 1
]

### matrix convertion (this may be not correct)

two meanings for:

`projection * translation * rotation * scale * position`

1. look from right to left, we can apply scale, rotation, translation, projection, respectively.

2. look from left to right, just convert the coordinate:

    first, run projection
    second, translate the coordinate's original point(O) to translation[x], translation[y]
    third, rotate the coordinate in an anti-clockwise orientation
    last, run scale

### matrix transposed (or this could be right)

[ST * RT * TT * PT] -> u_matrix

[VT] -> a_position

in shader: 

                                             in opengl and webgl         in mathmatics
    gl_Position = u_matrix * a_position = [ST * RT * TT * PT] * VT = (V * [P * T * R * S])T



