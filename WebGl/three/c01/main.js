'use strict';

/* global THREE */

function main() {
  const canvas = getMainCanvas();
  const renderer = new THREE.WebGLRenderer({ canvas });

  const fov = 75; // in degree
  const aspect = 1.5;  // the canvas default
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  const scene = new THREE.Scene();

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  const cubes = [];  // just an array we can use to rotate the cubes
  const loader = new THREE.TextureLoader();

  // add cube 1, render from image textures
  const materials = [
    new THREE.MeshBasicMaterial({ map: loader.load('http://127.0.0.1:8062/imgs/greg/flower-1.jpg') }),
    new THREE.MeshBasicMaterial({ map: loader.load('http://127.0.0.1:8062/imgs/greg/flower-2.jpg') }),
    new THREE.MeshBasicMaterial({ map: loader.load('http://127.0.0.1:8062/imgs/greg/flower-3.jpg') }),
    new THREE.MeshBasicMaterial({ map: loader.load('http://127.0.0.1:8062/imgs/greg/flower-4.jpg') }),
    new THREE.MeshBasicMaterial({ map: loader.load('http://127.0.0.1:8062/imgs/greg/flower-5.jpg') }),
    new THREE.MeshBasicMaterial({ map: loader.load('http://127.0.0.1:8062/imgs/greg/flower-6.jpg') }),
  ]

  const cube = new THREE.Mesh(geometry, materials);
  cube.position.x = 1
  scene.add(cube);
  cubes.push(cube);  // add to our list of cubes to rotate

  // todo add cube2, use inner textures
  const material2 = new THREE.MeshPhongMaterial({ color: 0x44AA88 })
  const cube2 = new THREE.Mesh(geometry, material2)
  cube2.position.x = -1
  scene.add(cube2)
  cubes.push(cube2)

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

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

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    cubes.forEach((cube, ndx) => {
      const speed = .3 + ndx * .1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
