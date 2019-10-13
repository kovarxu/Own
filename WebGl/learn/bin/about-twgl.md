# twgl

twgl is a small webgl utils library written mainly by greggman

If you want to get stuff done use three.js. If you want
to do stuff low-level with WebGL consider using TWGL.

# some common useful functions

3D render pipeline

## twgl.createProgramFromSources(gl, [vs, fs])

create webgl program

## twgl.createUniformSetters(gl, program)
## twgl.createAttributeSetters(gl, program)

read attrs and uniforms in program automaticly, and return a bunch of them

## twgl.createProgramInfo(gl, ["vertexshader", "fragmentshader"]);

`var programInfo = twgl.createProgramInfo(gl, ["vertexshader", "fragmentshader"]);`
this is a simplification of the above three functions, the returned value `progarmInfo` is an object:

```javascript
programInfo = {
   program: WebGLProgram,  // program we just compiled
   uniformSetters: ...,    // setters as returned from createUniformSetters,
   attribSetters: ...,     // setters as returned from createAttribSetters,
}
```

another more convenient character is it can replace setters or program used in these util functions, such as:

`twgl.createVAOFromBufferInfo(gl, attrSetters, bufferInfo);` -> `twgl.createVAOFromBufferInfo(gl, programInfo, bufferInfo);`  
`twgl.setUniforms(uniformSetters, uniforms)` -> `twgl.setUniforms(programInfo, uniforms)`

## twgl.createVAOAndSetAttributes(gl, attribSetters, attribs, buffers.indices)

```javascript
var buffers = {...};
...
var attribs = {
  a_position: { buffer: buffers.position, numComponents: 3, },
  a_normal:   { buffer: buffers.normal,   numComponents: 3, },
  a_texcoord: { buffer: buffers.texcoord, numComponents: 2, },
};
twgl.createVAOAndSetAttributes(gl, attribSetters, attribs, buffers.indices);
```

we need attribute locations and corresponding buffers to 

1. create the VAO
2. enable attribute
3. link buffer and attribute
[4.](not done, during rendering) link vao and attribute

## twgl.resizeCanvasToDisplaySize(gl.canvas)

## twgl.setUniforms(uniformSetters, uniforms)

uniformSetters is an array of `u_xxx` like key-value object.

this function will search in `uniforms` and match the same name in `uniformSetters`, if not match, skip it.

## twgl.createBufferInfoFromArrays(gl, arrays)

## twgl.createVAOFromBufferInfo(gl, setters, bufferInfo)

```javascript
// first set the prefix
twgl.setAttributePrefix("a_");
// a single triangle
var arrays = {
   position: { numComponents: 3, data: [0, -10, 0, 10, 10, 0, -10, 10, 0], },
   texcoord: { numComponents: 2, data: [0.5, 0, 1, 1, 0, 1],               },
   normal:   { numComponents: 3, data: [0, 0, 1, 0, 0, 1, 0, 0, 1],        },
   indices:  { numComponents: 3, data: [0, 1, 2, 1, 2, 3],                 },
};
 
var bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
var vao = twgl.createVAOFromBufferInfo(gl, setters, bufferInfo);
```

we can supply buffers by ourselves, if `indices` is set, `ELEMENT_ARRAY_BUFFER` will be used, and we should call `gl.drawElements`

## twgl.drawBufferInfo(gl, bufferInfo, [primitive])

If indicies exists we need to call `gl.drawElements`. If not we need to call `gl.drawArrays`, and this function is the combination of them, If you don't pass a 3rd parameter for the type of primitive to draw it assumes `gl.TRIANGLES`.

