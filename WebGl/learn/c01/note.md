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

