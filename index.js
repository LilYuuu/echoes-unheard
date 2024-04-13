// code reference for ocean & sky: https://github.com/mrdoob/three.js/blob/master/examples/webgl_shaders_ocean.html

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";

import { Water } from "three/addons/objects/Water.js";
import { Sky } from "three/addons/objects/Sky.js";

import { Island } from "./island.js";
import { Boat } from "./boat.js";

import { lerp } from "./utility.js";

let scene, camera, renderer;

let controls, water, sun;
let clock = new THREE.Clock();

let islands = [];
let islandAmei, islandBucika, islandGerman;

let boat;

let mouse;
let pointerOn = false;

// let pointLight;

let waterVideo = document.getElementById("water-video");
let waterTexture = new THREE.VideoTexture(waterVideo);

let waterColorVideo = document.getElementById("water-video-color");
let waterTextureColor = new THREE.VideoTexture(waterColorVideo);

waterTexture.wrapS = THREE.RepeatWrapping;
waterTexture.wrapT = THREE.RepeatWrapping;
waterTexture.repeat.set(10000 / 512, 10000 / 512);

waterTextureColor.wrapS = THREE.RepeatWrapping;
waterTextureColor.wrapT = THREE.RepeatWrapping;
waterTextureColor.repeat.set(10000 / 4.5, 10000 / 4.5);

// first create a loader
let gltfLoader = new GLTFLoader();

function loadLeaf01() {
  gltfLoader.load("./models/leaf01.glb", function (gltf) {
    // for island on the left
    let leaf = gltf.scene;
    scene.add(leaf);
    leaf.scale.set(0.1, 0.1, 0.1);
    leaf.position.set(-20, -0.01, -9.7);

    let leaf2 = leaf.clone();
    scene.add(leaf2);
    leaf2.scale.set(0.13, 0.13, 0.13);
    leaf2.position.set(-21.5, 0, -9.2);
    leaf2.rotation.y = Math.PI / 2;

    let leaf3 = leaf.clone();
    scene.add(leaf3);
    leaf3.scale.set(0.09, 0.09, 0.09);
    leaf3.position.set(-20, 0.01, -10.5);
    leaf3.rotation.y = Math.PI / 3;

    let leaf4 = leaf.clone();
    scene.add(leaf4);
    leaf4.scale.set(0.07, 0.07, 0.07);
    leaf4.position.set(-22, 0.01, -10.5);
    leaf4.rotation.y = Math.PI / 6;

    let leaf5 = leaf.clone();
    scene.add(leaf5);
    leaf5.scale.set(0.07, 0.07, 0.07);
    leaf5.position.set(-19.7, 0.01, -15.3);
    leaf5.rotation.y = Math.PI / 6;

    let leaf6 = leaf.clone();
    scene.add(leaf6);
    leaf6.scale.set(0.1, 0.1, 0.1);
    leaf6.position.set(-20.3, 0.01, -14.8);
    leaf6.rotation.y = -Math.PI / 4;

    let leaf7 = leaf.clone();
    scene.add(leaf7);
    leaf7.scale.set(0.08, 0.08, 0.08);
    leaf7.position.set(-19.4, 0.01, -16.3);
    leaf7.rotation.y = -Math.PI / 3;

    // for island in the middle
    let leaf8 = leaf.clone();
    scene.add(leaf8);
    leaf8.scale.set(0.13, 0.13, 0.13);
    leaf8.position.set(3, 0, -20);
    leaf8.rotation.y = Math.PI / 3;

    let leaf9 = leaf.clone();
    scene.add(leaf9);
    leaf9.scale.set(0.09, 0.09, 0.09);
    leaf9.position.set(0, 0, -22);
    leaf9.rotation.y = -Math.PI / 3;

    let leaf10 = leaf.clone();
    scene.add(leaf10);
    leaf10.scale.set(0.07, 0.07, 0.07);
    leaf10.position.set(-1, 0, -18);
    leaf10.rotation.y = Math.PI / 6;

    let leaf11 = leaf.clone();
    scene.add(leaf11);
    leaf11.scale.set(0.07, 0.07, 0.07);
    leaf11.position.set(0.7, 0, -20);
    leaf11.rotation.y = Math.PI / 6;

    let leaf12 = leaf.clone();
    scene.add(leaf12);
    leaf12.scale.set(0.07, 0.07, 0.07);
    leaf12.position.set(7, 0, -20);
    leaf12.rotation.y = Math.PI / 6;

    let leaf13 = leaf.clone();
    scene.add(leaf13);
    leaf13.scale.set(0.08, 0.08, 0.08);
    leaf13.position.set(7.4, 0, -21.1);
    leaf13.rotation.y = (Math.PI / 3) * 2;

    let leaf14 = leaf.clone();
    scene.add(leaf14);
    leaf14.scale.set(0.06, 0.06, 0.06);
    leaf14.position.set(6.4, 0, -21.4);
    leaf14.rotation.y = -(Math.PI / 4) * 3;

    // for island on the right
    let leaf15 = leaf.clone();
    scene.add(leaf15);
    leaf15.scale.set(0.06, 0.06, 0.06);
    leaf15.position.set(20.1, 0, -16);
    leaf15.rotation.y = -(Math.PI / 4) * 3;

    let leaf16 = leaf.clone();
    scene.add(leaf16);
    leaf16.scale.set(0.07, 0.07, 0.07);
    leaf16.position.set(20.7, 0, -15.4);
    leaf16.rotation.y = (Math.PI / 3) * 2;

    let leaf17 = leaf.clone();
    scene.add(leaf17);
    leaf17.scale.set(0.07, 0.07, 0.07);
    leaf17.position.set(20, 0, -14);
    leaf17.rotation.y = -(Math.PI / 3) * 2;
  });
}

function loadLeaf02() {
  gltfLoader.load("./models/leaf02.glb", function (gltf) {
    // for island on the left
    let leaf = gltf.scene;
    scene.add(leaf);
    leaf.scale.set(0.1, 0.1, 0.1);
    leaf.position.set(-21, 0, -11);

    let leaf2 = leaf.clone();
    scene.add(leaf2);
    leaf2.scale.set(0.11, 0.11, 0.11);
    leaf2.position.set(-21.5, 0, -11);
    leaf2.rotation.y = Math.PI / 3;

    let leaf3 = leaf.clone();
    scene.add(leaf3);
    leaf3.scale.set(0.11, 0.11, 0.11);
    leaf3.position.set(-20.5, 0, -9);
    leaf3.rotation.y = Math.PI / 3;

    let leaf4 = leaf.clone();
    scene.add(leaf4);
    leaf4.scale.set(0.1, 0.1, 0.1);
    leaf4.position.set(-20.7, 0, -10.2);
    leaf4.rotation.y = Math.PI / 3;

    // for island in the middle
    let leaf5 = leaf.clone();
    scene.add(leaf5);
    leaf5.scale.set(0.11, 0.11, 0.11);
    leaf5.position.set(0.2, 0, -19.5);
    leaf5.rotation.y = Math.PI / 3;

    let leaf6 = leaf.clone();
    scene.add(leaf6);
    leaf6.scale.set(0.11, 0.11, 0.11);
    leaf6.position.set(0.5, 0, -21.5);
    leaf6.rotation.y = -Math.PI / 2;

    let leaf7 = leaf.clone();
    scene.add(leaf7);
    leaf7.scale.set(0.1, 0.1, 0.1);
    leaf7.position.set(2.7, 0, -22);
    leaf7.rotation.y = Math.PI / 3;

    let leaf8 = leaf.clone();
    scene.add(leaf8);
    leaf8.scale.set(0.1, 0.1, 0.1);
    leaf8.position.set(-1.6, 0, -19.6);
    leaf8.rotation.y = Math.PI / 3;

    // for island on the right
    let leaf9 = leaf.clone();
    scene.add(leaf9);
    leaf9.scale.set(0.1, 0.1, 0.1);
    leaf9.position.set(19.2, 0, -15.2);
    leaf9.rotation.y = Math.PI / 3;

    let leaf10 = leaf.clone();
    scene.add(leaf10);
    leaf10.scale.set(0.11, 0.11, 0.11);
    leaf10.position.set(20.7, 0, -14);
    leaf10.rotation.y = -Math.PI / 2;

    let leaf11 = leaf.clone();
    scene.add(leaf11);
    leaf11.scale.set(0.1, 0.1, 0.1);
    leaf11.position.set(19.6, 0, -12);
    leaf11.rotation.y = Math.PI / 3;
  });
}

function loadWaterlily() {
  gltfLoader.load("./models/waterlily.glb", function (gltf) {
    // for island on the left
    let waterlily = gltf.scene;
    scene.add(waterlily);
    waterlily.scale.set(0.1, 0.1, 0.1);
    waterlily.position.set(-21.2, 0, -9.8);

    let waterlily2 = waterlily.clone();
    scene.add(waterlily2);
    waterlily2.scale.set(0.09, 0.09, 0.09);
    waterlily2.position.set(-20.5, 0, -10.5);
    waterlily2.rotation.y = Math.PI / 3;

    let waterlily3 = waterlily.clone();
    scene.add(waterlily3);
    waterlily3.scale.set(0.09, 0.09, 0.09);
    waterlily3.position.set(-20, 0, -15.7);
    waterlily3.rotation.y = Math.PI / 3;

    // for island in the middle
    let waterlily4 = gltf.scene;
    scene.add(waterlily4);
    waterlily4.scale.set(0.1, 0.1, 0.1);
    waterlily4.position.set(0.5, 0, -20.5);

    let waterlily5 = waterlily.clone();
    scene.add(waterlily5);
    waterlily5.scale.set(0.09, 0.09, 0.09);
    waterlily5.position.set(-1, 0, -19);
    waterlily5.rotation.y = Math.PI / 3;

    let waterlily6 = waterlily.clone();
    scene.add(waterlily6);
    waterlily6.scale.set(0.06, 0.06, 0.06);
    waterlily6.position.set(2, 0, -21);
    waterlily6.rotation.y = Math.PI / 3;

    let waterlily7 = waterlily.clone();
    scene.add(waterlily7);
    waterlily7.scale.set(0.1, 0.1, 0.1);
    waterlily7.position.set(2.3, 0, -19.6);
    waterlily7.rotation.y = Math.PI / 5;

    let waterlily8 = waterlily.clone();
    scene.add(waterlily8);
    waterlily8.scale.set(0.1, 0.1, 0.1);
    waterlily8.position.set(5, 0, -19.6);
    waterlily8.rotation.y = Math.PI / 5;

    let waterlily9 = waterlily.clone();
    scene.add(waterlily9);
    waterlily9.scale.set(0.08, 0.08, 0.08);
    waterlily9.position.set(7, 0, -21.3);
    waterlily9.rotation.y = Math.PI / 5;

    let waterlily10 = waterlily.clone();
    scene.add(waterlily10);
    waterlily10.scale.set(0.09, 0.09, 0.09);
    waterlily10.position.set(7.8, 0, -22.3);
    waterlily10.rotation.y = Math.PI / 5;

    // for island on the right
    let waterlily11 = waterlily.clone();
    scene.add(waterlily11);
    waterlily11.scale.set(0.09, 0.09, 0.09);
    waterlily11.position.set(20, -0.08, -15);
    waterlily11.rotation.y = Math.PI / 3;

    let waterlily12 = waterlily.clone();
    scene.add(waterlily12);
    waterlily12.scale.set(0.06, 0.06, 0.06);
    waterlily12.position.set(20.5, -0.03, -14.5);
    waterlily12.rotation.y = Math.PI / 3;

    let waterlily13 = waterlily.clone();
    scene.add(waterlily13);
    waterlily13.scale.set(0.1, 0.1, 0.1);
    waterlily13.position.set(20, -0.08, -11.7);
    waterlily13.rotation.y = (Math.PI / 5) * 4;

    let waterlily14 = waterlily.clone();
    scene.add(waterlily14);
    waterlily14.scale.set(0.1, 0.1, 0.1);
    waterlily14.position.set(22, -0.08, -9.3);
    waterlily14.rotation.y = -Math.PI / 5;

    let waterlily15 = waterlily.clone();
    scene.add(waterlily15);
    waterlily15.scale.set(0.1, 0.1, 0.1);
    waterlily15.position.set(22, -0.08, -18);
    waterlily15.rotation.y = Math.PI / 5;
  });
}

function loadGrass01() {
  gltfLoader.load("./models/grass03.glb", function (gltf) {
    // for island on the left
    let grass = gltf.scene;
    scene.add(grass);
    grass.scale.set(0.01, 0.01, 0.01);
    grass.position.set(-20, -0.1, -12);

    let grass2 = grass.clone();
    scene.add(grass2);
    grass2.scale.set(0.02, 0.02, 0.02);
    grass2.position.set(-25, -0.1, -21);
    grass2.rotation.y = Math.PI / 3;

    let grass3 = grass.clone();
    scene.add(grass3);
    grass3.scale.set(0.02, 0.02, 0.02);
    grass3.position.set(-21, 0, -18);
    grass3.rotation.y = Math.PI / 4;

    // for island in the middle
    let grass4 = grass.clone();
    scene.add(grass4);
    grass4.scale.set(0.013, 0.013, 0.013);
    grass4.position.set(-2, 0, -22);
    grass4.rotation.y = Math.PI / 3;

    let grass5 = grass.clone();
    scene.add(grass5);
    grass5.scale.set(0.02, 0.02, 0.02);
    grass5.position.set(-4, 0, -30);
    grass5.rotation.y = Math.PI / 4;

    let grass6 = grass.clone();
    scene.add(grass6);
    grass6.scale.set(0.013, 0.013, 0.013);
    grass6.position.set(5, 0, -30);
    grass6.rotation.y = Math.PI / 4;

    let grass7 = grass.clone();
    scene.add(grass7);
    grass7.scale.set(0.02, 0.02, 0.02);
    grass7.position.set(8.5, 0, -24.4);
    grass7.rotation.y = Math.PI / 4;

    // for island on the right
    let grass8 = grass.clone();
    scene.add(grass8);
    grass8.scale.set(0.019, 0.019, 0.019);
    grass8.position.set(23.8, -0.08, -19.3);
    grass8.rotation.y = Math.PI / 4;

    let grass9 = grass.clone();
    scene.add(grass9);
    grass9.scale.set(0.019, 0.019, 0.019);
    grass9.position.set(22, -0.08, -13);
    grass9.rotation.y = Math.PI / 4;

    let grass10 = grass.clone();
    scene.add(grass10);
    grass10.scale.set(0.011, 0.011, 0.011);
    grass10.position.set(22.8, -0.08, -9);
    grass10.rotation.y = Math.PI / 4;
  });
}

function loadStone() {
  gltfLoader.load("./models/stone.glb", function (gltf) {
    // for island on the left
    let stone = gltf.scene;
    scene.add(stone);
    stone.position.set(-22, -0.1, -13);

    let stone2 = stone.clone();
    scene.add(stone2);
    stone2.scale.set(3, 1, 1);
    stone2.position.set(-23.5, -0.5, -9);
    stone2.rotation.y = Math.PI / 4;

    let stone3 = stone.clone();
    scene.add(stone3);
    stone3.scale.set(0.5, 0.5, 0.5);
    stone3.position.set(-21, 0, -19);
    stone3.rotation.y = Math.PI / 4;

    // for island in the middle
    let stone4 = stone.clone();
    scene.add(stone4);
    stone4.scale.set(0.5, 0.5, 0.5);
    stone4.position.set(1.6, -0.2, -23);
    stone4.rotation.y = Math.PI / 4;

    let stone5 = stone.clone();
    scene.add(stone5);
    // stone5.scale.set(0.3, 0.5, 1);
    stone5.position.set(-3, -0.2, -24);
    // stone5.rotation.y = Math.PI / 4;

    // for island on the right
    let stone6 = stone.clone();
    scene.add(stone6);
    stone6.scale.set(0.5, 0.5, 0.5);
    stone6.position.set(22.8, -0.08, -7);
    stone6.rotation.y = Math.PI / 4;

    let stone7 = stone.clone();
    scene.add(stone7);
    stone7.scale.set(0.3, 0.7, 0.7);
    stone7.position.set(21, -0.08, -10.4);
    stone7.rotation.y = (-Math.PI / 2) * 3;
  });
}

export let titleCards = document.getElementsByClassName("title-card");

// spatial audio
let audioListener;

const rotateSpeed = 0.01; // Adjust this value as needed

function onDocumentKeyDown(event) {
  // Get the key code of the pressed key
  var keyCode = event.which;

  // 'A' key
  if (keyCode == 65) {
    event.preventDefault();
    event.stopPropagation();
    controls.enabled = false;
    camera.rotation.y += rotateSpeed;
    console.log("A is pressed");
  }
  // 'D' key
  if (keyCode == 68) {
    event.preventDefault();
    event.stopPropagation();
    controls.enabled = false;
    camera.rotation.y -= rotateSpeed;
    console.log("D is pressed");
  }
}

// TO BE FIXED
// Add the event listener for the 'keydown' event
document.addEventListener("keypressed", onDocumentKeyDown);

async function init() {
  scene = new THREE.Scene();

  scene.background = 0x000000;
  // scene.fog = new THREE.FogExp2(0xc5bacb, 0.05);
  scene.fog = new THREE.FogExp2(0x000000, 0.02);

  let aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.z = 5; // place the camera in space
  // camera.position.z = -10;
  camera.position.y = 1.5;

  scene.add(camera);

  // camera.position.y = 3; // for dev and testing
  camera.lookAt(0, 1.5, 0);

  audioListener = new THREE.AudioListener();
  camera.add(audioListener);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // controls = new OrbitControls(camera, renderer.domElement);
  controls = new FirstPersonControls(camera, renderer.domElement);
  // controls.movementSpeed = 1;
  controls.movementSpeed = 5;
  controls.lookSpeed = 0.01;

  controls.noFly = true;
  controls.lookVertical = false;

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
  // scene.add(water);

  const geometry = new THREE.PlaneGeometry(10000, 10000);
  const material = new THREE.MeshStandardMaterial({
    color: 0x555555,
    roughness: 0.0,
    metalness: 0.5,
    map: waterTextureColor,
    // displacementMap: waterTexture,
    // displacementScale: 1,
  });
  // const material = new THREE.MeshLambertMaterial({
  //   color: 0xfff700,
  //   // envMap: waterTexture,
  //   refractionRatio: 0.95,
  // });
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // const planeHelper = new THREE.PlaneHelper(plane, 1, 0xffff00);
  // scene.add(planeHelper);

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

  // lights
  scene.add(new THREE.AmbientLight(0xbbbbbb, 1));
  // scene.add(new THREE.DirectionalLight(0xffffff, 1));

  // pointLight = new THREE.PointLight(0xff0000, 1, 100);
  // pointLight.position.set(0, 1, -5);
  // scene.add(pointLight);
  // camera.add(pointLight);

  // const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
  // scene.add(pointLightHelper);

  const light = new THREE.PointLight(0x666666, 2000, 1000000);
  light.position.set(0, 2, -10);
  camera.add(light);

  const helper = new THREE.PointLightHelper(light);
  // scene.add(helper);

  // camera.add(pointLight);

  window.addEventListener("resize", onWindowResize);

  // islands
  islandAmei = new Island(scene, audioListener, mouse, camera, "amei");
  // ensure the model is loaded before adding it to the scene, otherwise would raise errors
  await islandAmei.loadModel("./models/island.fbx");
  await islandAmei.loadAudio("./audio/amei.mp3");
  islandAmei.setPosition(30, -0.08, -15);
  islandAmei.setScale(3);
  islandAmei.playAudio();
  islands.push(islandAmei);

  islandBucika = new Island(scene, audioListener, mouse, camera, "bucika");
  await islandBucika.loadModel("./models/island.fbx");
  await islandBucika.loadAudio("./audio/bucika.mp3");
  islandBucika.setPosition(3, -0.08, -30);
  islandBucika.setRotation(0, Math.PI / 3, 0);
  islandBucika.setScale(3);
  islandBucika.playAudio();
  islands.push(islandBucika);

  islandGerman = new Island(scene, audioListener, mouse, camera, "german");
  await islandGerman.loadModel("./models/island.fbx");
  await islandGerman.loadAudio("./audio/german.mp3");
  islandGerman.setPosition(-30, -0.08, -15);
  islandGerman.setRotation(0, -Math.PI / 6, 0);
  islandGerman.setScale(3);
  islandGerman.playAudio();
  islands.push(islandGerman);

  // boat
  // loadBoat();
  boat = new Boat(scene, camera, clock);
  boat.loadModel("./models/boat.glb");

  // decorations
  loadLeaf01();
  loadLeaf02();
  loadWaterlily();
  loadGrass01();
  loadStone();

  // // test box for collision
  // let geo = new THREE.BoxGeometry(1, 1, 1);
  // let mat = new THREE.MeshBasicMaterial();
  // let box = new THREE.Mesh(geo, mat);
  // scene.add(box);
  // box.position.set(0, 1, -5);
  // // box.layers.enable(3);   // to set the object as collidable, need to align with the raycaster setting

  loop();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

// function lerp(start, end, amt) {
//   return (1 - amt) * start + amt * end;
// }

function loop() {
  window.requestAnimationFrame(loop); // pass the name of your loop function into this function

  controls.update(clock.getDelta());

  // console.log(boat.rotation);
  // boat.float();

  if (boat.mesh) {
    boat.update();
  }

  // // boat floating effect
  // if (boat) {
  //   // boat.rotation.x += 0.01; // for testing
  //   // boat.rotation.x = Math.sin(clock.elapsedTime) * 0.04;

  //   let startValRot = boat.rotation.x;
  //   let endValRot =
  //     perlin.get(clock.elapsedTime / 10, clock.elapsedTime / 2) * 0.1;
  //   boat.rotation.x = lerp(startValRot, endValRot, 0.5);

  //   let startValPosX = boat.position.x;
  //   let endValPosX =
  //     perlin.get((clock.elapsedTime + 100) / 10, clock.elapsedTime / 2) * 0.1;
  //   boat.position.x = lerp(startValPosX, endValPosX, 0.5);
  // }

  water.material.uniforms["time"].value += 0.1 / 60.0;

  for (let i = 0; i < islands.length; i++) {
    let thisIsland = islands[i];
    thisIsland.update();
    if (thisIsland.hover) {
      // console.log(thisIsland.name);
      pointerOn = true;
      // console.log("hovering on: " + thisIsland.name);
      break;
    } else {
      pointerOn = false;
    }
  }

  // console.log(pointerOn);

  if (pointerOn) {
    document.querySelector("canvas").style.cursor = "pointer";
  } else {
    document.querySelector("canvas").style.cursor = "auto";
  }

  renderer.render(scene, camera);
}

init();
