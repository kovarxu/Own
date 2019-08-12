# textures

## start about three

steps to draw:

1.get canvas and **renderer**

```javascript
const canvas = getMainCanvas();
const renderer = new THREE.WebGLRenderer({ canvas });
```

2.create a camera

```javascript
const fov = 75; // in degree
const aspect = 1.5;  // the canvas default
const near = 0.1;
const far = 5;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;
```

3.create a scene, an object(includeing mesh) and put it into the scene

```javascript
const scene = new THREE.Scene();

const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

const cubes = [];  // just an array we can use to rotate the cubes
const loader = new THREE.TextureLoader();

const material = new THREE.MeshBasicMaterial({
  map: loader.load('http://127.0.0.1:8062/imgs/greg/flower-1.jpg'),
});

const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);
cubes.push(cube);  // add to our list of cubes to rotate

```

4.change view size

```javascript
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}
...
// in render
if (resizeRendererToDisplaySize(renderer)) {
  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
}
...
```

5.render

`renderer.render(scene, camera);`

## box textures

* materials usage

It should be noted though that not all geometry types supports multiple materials. BoxGeometry and BoxBufferGeometry can use 6  materials one for each face. ConeGeometry and ConeBufferGeometry can use 2 materials, one for the bottom and one for the cone.  CylinderGeometry and CylinderBufferGeometry can use 3 materials, bottom, top, and side.



