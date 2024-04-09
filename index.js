// code reference for ocean & sky: https://github.com/mrdoob/three.js/blob/master/examples/webgl_shaders_ocean.html

import * as THREE from "three";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
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

// function loadBoat() {
//   // then load the file and add it to your scene

//   // "fishing_boat"
//   gltfLoader.load("./models/boat.glb", function (gltf) {
//     boat = gltf.scene;

//     // scene.add(camera);
//     camera.add(boat);

//     // boat.scale.set(0.9, 0.9, 0.9);
//     boat.position.set(0, -0.5, -1);
//     boat.rotation.y = Math.PI;
//     // boat.rotation.x = Math.PI / 3;
//   });
// }

function loadLeaf01() {
  gltfLoader.load("./models/leaf01.glb", function (gltf) {
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
  });
}

function loadLeaf02() {
  gltfLoader.load("./models/leaf02.glb", function (gltf) {
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
  });
}

function loadWaterlily() {
  gltfLoader.load("./models/waterlily.glb", function (gltf) {
    let waterlily = gltf.scene;
    scene.add(waterlily);
    waterlily.scale.set(0.1, 0.1, 0.1);
    waterlily.position.set(-21.2, 0, -9.8);

    let waterlily2 = waterlily.clone();
    scene.add(waterlily2);
    waterlily2.scale.set(0.09, 0.09, 0.09);
    waterlily2.position.set(-20.5, 0, -10.5);
    waterlily2.rotation.y = Math.PI / 3;
  });
}

function loadGrass01() {
  gltfLoader.load("./models/grass03.glb", function (gltf) {
    let grass = gltf.scene;
    scene.add(grass);
    grass.scale.set(0.01, 0.01, 0.01);
    grass.position.set(-20, -0.1, -12);

    let grass2 = grass.clone();
    scene.add(grass2);
    grass2.scale.set(0.02, 0.02, 0.02);
    grass2.position.set(-25, -0.1, -21);
    grass2.rotation.y = Math.PI / 3;
  });
}

function loadStone() {
  gltfLoader.load("./models/stone.glb", function (gltf) {
    let stone = gltf.scene;
    scene.add(stone);
    stone.position.set(-22, -0.1, -13);

    let stone2 = stone.clone();
    scene.add(stone2);
    stone2.scale.set(3, 1, 1);
    stone2.position.set(-23.5, -0.5, -9);
    stone2.rotation.y = Math.PI / 4;
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
  controls.movementSpeed = 1;
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
  scene.add(helper);

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
