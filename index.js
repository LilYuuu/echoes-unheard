// code reference for ocean & sky: https://github.com/mrdoob/three.js/blob/master/examples/webgl_shaders_ocean.html

import * as THREE from "three";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";

import { Water } from "three/addons/objects/Water.js";
import { Sky } from "three/addons/objects/Sky.js";

import { Island } from "./island.js";

let scene, camera, renderer;

let controls, water, sun;
let clock = new THREE.Clock();

let islands = [];
let islandAmei, islandBucika, islandGerman;

let mouse;
let pointerOn = false;

export let titleCards = document.getElementsByClassName("title-card");

// first create a loader
// let loader = new FBXLoader();

// Function that returns a promise which resolves with the loaded model
// function loadModel(url) {
//   return new Promise((resolve, reject) => {
//     loader.load(url, (model) => resolve(model), undefined, reject);
//   });
// }

// Function to clone the mesh
// function cloneMesh(originalMesh) {
//   const clonedGeometry = originalMesh.geometry.clone();
//   //   const clonedMaterial = originalMesh.material.clone();
//   let clonedMaterial;

//   if (Array.isArray(originalMesh.material)) {
//     // Clone each material in the array
//     clonedMaterial = originalMesh.material.map((material) => material.clone());
//   } else {
//     // Clone the single material
//     clonedMaterial = originalMesh.material.clone();
//   }

//   const clonedMesh = new THREE.Mesh(clonedGeometry, clonedMaterial);
//   return clonedMesh;
// }

// spatial audio
let audioListener;

async function init() {
  scene = new THREE.Scene();

  // scene.background =
  scene.fog = new THREE.FogExp2(0xc5bacb, 0.05);

  let aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.z = 5; // place the camera in space
  camera.position.y = 2;
  camera.lookAt(0, 1, 0);

  audioListener = new THREE.AudioListener();
  camera.add(audioListener);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // controls = new OrbitControls(camera, renderer.domElement);
  controls = new FirstPersonControls(camera, renderer.domElement);
  controls.movementSpeed = 5;
  controls.lookSpeed = 0.01;

  controls.noFly = true;
  // controls.lookVertical = false;

  // add a raycast on click
  mouse = new THREE.Vector2(0, 0);
  document.addEventListener(
    "mousemove",
    (ev) => {
      // three.js expects 'normalized device coordinates' (i.e. between -1 and 1 on both axes)
      mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
    },
    false
  );

  // water
  const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
  water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(
      "textures/waternormals.jpg",
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0xd5d1dd,
    distortionScale: 5,
    fog: scene.fog !== undefined,
  });

  water.rotation.x = -Math.PI / 2;
  scene.add(water);

  // // sun
  // sun = new THREE.Vector3();

  // // Skybox
  // const sky = new Sky();
  // sky.scale.setScalar(10000);
  // scene.add(sky);

  // const skyUniforms = sky.material.uniforms;

  // skyUniforms["turbidity"].value = 100;
  // skyUniforms["rayleigh"].value = 2;
  // skyUniforms["mieCoefficient"].value = 0.005;
  // skyUniforms["mieDirectionalG"].value = 0.8;

  // const parameters = {
  //   elevation: 2,
  //   azimuth: 0,
  // };

  // const pmremGenerator = new THREE.PMREMGenerator(renderer);
  // const sceneEnv = new THREE.Scene();

  // let renderTarget;

  // function updateSun() {
  //   const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
  //   const theta = THREE.MathUtils.degToRad(parameters.azimuth);

  //   sun.setFromSphericalCoords(1, phi, theta);

  //   sky.material.uniforms["sunPosition"].value.copy(sun);
  //   water.material.uniforms["sunDirection"].value.copy(sun).normalize();

  //   if (renderTarget !== undefined) renderTarget.dispose();

  //   sceneEnv.add(sky);
  //   renderTarget = pmremGenerator.fromScene(sceneEnv);
  //   scene.add(sky);

  //   scene.environment = renderTarget.texture;
  // }

  // updateSun();

  // add some lights so we can see our model
  scene.add(new THREE.AmbientLight(0xffffff, 1));
  scene.add(new THREE.DirectionalLight(0xffffff, 5));

  window.addEventListener("resize", onWindowResize);

  // islands
  islandAmei = new Island(scene, audioListener, mouse, camera, "amei");
  // ensure the model is loaded before adding it to the scene, otherwise would raise errors
  await islandAmei.loadModel("./island.fbx");
  await islandAmei.loadAudio("./audio/amei.mp3");
  islandAmei.setPosition(3, -0.08, -10);
  islandAmei.setScale(1.7);
  islandAmei.playAudio();
  scene.add(islandAmei.mesh);
  islands.push(islandAmei);

  islandBucika = new Island(scene, audioListener, mouse, camera, "bucika");
  await islandBucika.loadModel("./island.fbx");
  await islandBucika.loadAudio("./audio/bucika.mp3");
  islandBucika.setPosition(5, -0.05, -2);
  islandBucika.setRotation(0, Math.PI / 3, 0);
  islandBucika.playAudio();
  scene.add(islandBucika.mesh);
  islands.push(islandBucika);

  islandGerman = new Island(scene, audioListener, mouse, camera, "german");
  await islandGerman.loadModel("./island.fbx");
  await islandGerman.loadAudio("./audio/german.mp3");
  islandGerman.setPosition(-20, -0.05, -15);
  islandGerman.setRotation(0, -Math.PI / 6, 0);
  islandGerman.setScale(3);
  islandGerman.playAudio();
  scene.add(islandGerman.mesh);
  islands.push(islandGerman);

  loop();
}

// function loadModel() {
//     // first create a loader
//     let loader = new FBXLoader();

//   // then load the file and add it to your scene
//   loader.load("./island.fbx", function (object) {
//     object.scale.multiplyScalar(0.12);
//     object.position.set(0, -0.05, 0);
//     scene.add(object);
//   });

//   loader.load("./island.fbx", function (object) {
//     object.scale.multiplyScalar(0.12);
//     object.position.set(10, -0.05, -8);
//     object.rotateY(Math.PI / 3);
//     scene.add(object);
//   });

//   loader.load("./island.fbx", function (object) {
//     object.scale.multiplyScalar(0.12);
//     object.position.set(-20, -0.05, -15);
//     object.rotateY(-Math.PI / 6);
//     scene.add(object);
//   });
// }

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function loop() {
  window.requestAnimationFrame(loop); // pass the name of your loop function into this function

  controls.update(clock.getDelta());

  water.material.uniforms["time"].value += 0.1 / 60.0;

  for (let i = 0; i < islands.length; i++) {
    let thisIsland = islands[i];
    thisIsland.update();
    if (thisIsland.hover) {
      // console.log(thisIsland.name);
      pointerOn = true;
      console.log("hovering on: " + thisIsland.name);
      break;
    } else {
      pointerOn = false;
    }
  }

  console.log(pointerOn);

  if (pointerOn) {
    document.querySelector("canvas").style.cursor = "pointer";
  } else {
    document.querySelector("canvas").style.cursor = "auto";
  }

  renderer.render(scene, camera);
}

init();
