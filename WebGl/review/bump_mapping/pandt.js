// 虚拟化相机顶点坐标
function getCameraPositions (scale = 1) {
  const positions = [
    -1, -1,  1,  // cube vertices
      1, -1,  1,
    -1,  1,  1,
      1,  1,  1,
    -1, -1,  3,
      1, -1,  3,
    -1,  1,  3,
      1,  1,  3,
      0,  0,  1,  // cone tip
  ];
  const indices = [
    0, 1, 1, 3, 3, 2, 2, 0, // cube indices
    4, 5, 5, 7, 7, 6, 6, 4,
    0, 4, 1, 5, 3, 7, 2, 6,
  ];
  // add cone segments
  const numSegments = 6;
  const coneBaseIndex = positions.length / 3; 
  const coneTipIndex =  coneBaseIndex - 1;
  for (let i = 0; i < numSegments; ++i) {
    const u = i / numSegments;
    const angle = u * Math.PI * 2;
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    positions.push(x, y, 0);
    // line from tip to edge
    indices.push(coneTipIndex, coneBaseIndex + i);
    // line from point on edge to next point on edge
    indices.push(coneBaseIndex + i, coneBaseIndex + (i + 1) % numSegments);
  }
  positions.forEach((v, ndx) => {
    positions[ndx] *= scale;
  });
  return {
    position: positions,
    indices,
  };
}

// 虚拟剪贴空间顶点坐标
function getClipspaceCubeVertices(gl) {
  // first let's add a cube. It goes from 1 to 3
  // because cameras look down -Z so we want
  // the camera to start at Z = 0. We'll put a
  // a cone in front of this cube opening
  // toward -Z
  const positions = [
    -1, -1, -1,  // cube vertices
     1, -1, -1,
    -1,  1, -1,
     1,  1, -1,
    -1, -1,  1,
     1, -1,  1,
    -1,  1,  1,
     1,  1,  1,
  ];
  const indices = [
    0, 1, 1, 3, 3, 2, 2, 0, // cube indices
    4, 5, 5, 7, 7, 6, 6, 4,
    0, 4, 1, 5, 3, 7, 2, 6,
  ];
  return {
    position: positions,
    indices
  };
}

// 8*8明度纹理
function getDefaultTexture(gl, callback) {
  return twgl.createTexture(gl, {
    target: gl.TEXTURE_2D,
    level: 0,
    width: 8,
    height: 8,
    internalFormat: gl.LUMINANCE,
    type: gl.UNSIGNED_BYTE,
    // color: [0.8, 0.6, 1, 1],
    src: new Uint8Array([  // data
      0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
      0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
      0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
      0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
      0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
      0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
      0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
      0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
    ]),
    mag: gl.NEAREST
  }, callback)
}

function getMappingTexture (gl, callback) {
  return twgl.createTexture(gl, {
    target: gl.TEXTURE_2D,
    level: 0,
    width: 1,
    height: 1,
    internalFormat: gl.RGBA,
    type: gl.UNSIGNED_BYTE,
    color: [0.8, 0.6, 1, 1],
    src: 'http://127.0.0.1:8062/imgs/greg/flower-2.jpg',
    crossOrigin: 'anonymous'
  }, callback)
}
