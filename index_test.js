import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let scene, camera, renderer;

let controls;

function init() {
  scene = new THREE.Scene();

  scene.background = 0x000000;
  // scene.fog = new THREE.FogExp2(0xc5bacb, 0.05);
  scene.fog = new THREE.FogExp2(0x000000, 0.02);

  let aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.z = 5; // place the camera in space
  camera.position.y = 1.5;

  scene.add(camera);

  // camera.position.y = 3; // for dev and testing
  camera.lookAt(0, 1.5, 0);

  // audioListener = new THREE.AudioListener();
  // camera.add(audioListener);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  const geometry = new THREE.PlaneGeometry(10000, 10000);
  const material = new THREE.MeshStandardMaterial({
    color: 0xfff700,
    roughness: 0.01,
    metalness: 0.99,
    // map: waterTexture,
  });
  // const material = new THREE.MeshLambertMaterial({
  //   color: 0xfff700,
  //   // envMap: waterTexture,
  //   refractionRatio: 0.95,
  // });
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // lights
  scene.add(new THREE.AmbientLight(0xbbbbbb, 1));
  // scene.add(new THREE.DirectionalLight(0xffffff, 1));

  // pointLight = new THREE.PointLight(0xff0000, 1, 100);
  // pointLight.position.set(0, 1, -5);
  // scene.add(pointLight);
  // camera.add(pointLight);

  // const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
  // scene.add(pointLightHelper);

  const light = new THREE.PointLight(0x666666, 1000, 1000000);
  light.position.set(0, 2, -5);
  camera.add(light);

  const helper = new THREE.PointLightHelper(light);
  scene.add(helper);

  // camera.add(pointLight);

  window.addEventListener("resize", onWindowResize);

  loop();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function loop() {
  window.requestAnimationFrame(loop); // pass the name of your loop function into this function

  renderer.render(scene, camera);
}

init();
