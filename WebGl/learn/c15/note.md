## Draw multiple things

multi objects ==> multi VAO ==> draw multi

```javascript
var objectsToDraw = [
  {
    programInfo: programInfo, // different shaders can be applied
    bufferInfo: sphereBufferInfo,
    vertexArray: sphereVAO,
    uniforms: sphereUniforms,
  },
  {
    programInfo: programInfo,
    bufferInfo: cubeBufferInfo,
    vertexArray: cubeVAO,
    uniforms: cubeUniforms,
  },
  {
    programInfo: programInfo,
    bufferInfo: coneBufferInfo,
    vertexArray: coneVAO,
    uniforms: coneUniforms,
  },
];
```

This is arguably the main rendering loop of most 3D engines in existence. 

## Consider using a library

It's important to notice that you can't draw just any geometry with just any shader. For example a shader that requires normals will not function with geometry that has no normals. Similarly a shader that requires textures will not work without textures.

This is one of the many reasons it's great to choose a 3D Library like Three.js because it handles all of this for you. You create some geometry, you tell three.js how you want it rendered and it generates shaders at runtime to handle the things you need. Pretty much all 3D engines do this from Unity3D to Unreal to Source to Crytek. Some generate them offline but the important thing to realize is they generate shaders.

Of course the reason you're reading these articles is you want to know what's going on deep down. That's great and it's fun to write everything yourself. It's just important to be aware WebGL is **super low level** so there's a ton of work for you to do if you want to do it yourself and that often includes writing a shader generator since different features often require different shaders.


