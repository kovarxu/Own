function camera (context) {
  let { eye_x, eye_y, eye_z, target_x=0, target_y=0, target_z=0 } = context
  let eye = [eye_x, eye_y, eye_z]
  let target = [target_x, target_y, target_z]
  let up = [1, 0, 0]
  let lookat = m4.lookAt(eye, target, up)
  return m4.inverse(lookat)
}

function perspective (context) {
  let { pov=90, width, height, near=1, far=5000 } = context
  pov = toRad(pov)
  let aspect = width / height
  // 这个方法可以直接把默认的左手坐标系变成右手坐标系
  return m4.perspective(pov, aspect, near, far)
}

function ortho (context) {
  let { width, height, near=100, far=2000 } = context
  let ratio = 1
  // left, right, bottom, up, near, far
  return m4.orthographic(-width/ratio, width/ratio, -height/ratio, height/ratio, near, far)
}

function getTransformMatrix (pr) {
  // set rotation orientation to clockwise
  let { tx=0, ty=0, tz=0, rotx=0, roty=0, rotz=0, sx=100, sy=100, sz=100} = pr
  let translation = m4.m4translate(tx, ty, tz),
      rotationX = m4.m4rotateX(toRad(+rotx)),
      rotationY = m4.m4rotateY(toRad(+roty)),
      rotationZ = m4.m4rotateZ(toRad(+rotz)),
      scale = m4.m4scale(+sx/100, +sy/100, +sz/100)

  return m4.m4mul( scale, rotationZ, rotationY, rotationX, translation )
}

function getUMatrixValue (options) {
  let transformMatrix = m4.m4unit()
  let perspectiveMatrix = m4.m4unit()
  let orthoMatrix = m4.m4unit()
  let cameraMatrix = m4.m4unit()

  if (options.transform) {
    transformMatrix = options.transform.length ? options.transform : getTransformMatrix(options.transform)
  }
  if (options.camera) {
    cameraMatrix = options.camera.length ? options.camera : camera(options.camera)
  }
  if (options.perspective) {
    perspectiveMatrix = options.perspective.length ? options.perspective : perspective(options.perspective)
  }
  if (options.ortho) {
    orthoMatrix = options.ortho.length ? options.ortho : ortho(options.ortho)
  }
  return m4.m4mul(transformMatrix, cameraMatrix, perspectiveMatrix, orthoMatrix) 
}
