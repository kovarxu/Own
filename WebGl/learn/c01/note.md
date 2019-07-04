## notes for basic WebGl

webgl is a rasterization engine. It draws points, lines and triangles based on code you supply.

webgl only care about 2 things, clipspace coordinates and color

webgl runs on GPU

Provided a pairs of functions: vertex shader & fragment shader, in GLSL(GS shader language)

vertex shader: compute vertex positions

fragment shader: rasterize primitives(points, lines or triangles), compute a color for each pixel of the primitive.

`gl.drawArrays`, `gl.drawElements` excutes your shaders on GPU

### shaders receive date

* Attributes, Buffers, and Vertex Arrays

Buffers: upload to GPU, contain positions, normals, texture coordinates, vertex colors and so on. (not random access)

Attributes: how to pull data from Buffers

* Uniforms

global veriables set before execute shader program.

* Texture

contain image data or other than colors, can randomly access

* Varyings

            interpolated
vertex shader ------- fragment shader

### program notes

* shader header

    `#version 300 es` tells WebGL2 you want to use WebGL2's shader language called GLSL ES 3.00.

* webgl bind

    WebGL lets us manipulate many WebGL resources on global bind points. You can think of bind points as internal global variables inside WebGL. First you bind a resource to a bind point. Then, all other functions refer to the resource through the bind point.
    such as: `gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);`

* gl.bufferData

    `gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);`
    The last argument, gl.STATIC_DRAW is a hint to WebGL about how we'll use the data. WebGL can try to use that hint to optimize certain things. gl.STATIC_DRAW tells WebGL we are not likely to change this data much.

* gl.vertexAttribPointer

    `gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)`
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer

