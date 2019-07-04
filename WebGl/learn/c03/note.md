### varyings

pass data from vertex shader to fragment shader

write some `out v_abc` in vertex shader, and `in v_abc` in fragment shader, no need to specify the value in javascript files

## control buffer

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
