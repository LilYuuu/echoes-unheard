import * as THREE from "three";

// PointerLockControls: wasd + mouse direction
// import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";

let scene, camera, renderer;

// first person controls
let controls;
let clock = new THREE.Clock();

// spatial audio
let audioListener;
// let audioListenerMesh;
let audioSources = [];

// raycasting
let inactiveMat, activeMat;
let mouse;

// text
// let text

function init() {
  // create a scene in which all other objects will exist
  scene = new THREE.Scene();

  // create a camera and position it in space
  let aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.z = 5; // place the camera in space
  camera.position.y = 1;
  camera.lookAt(0, 0.7, 0);

  // the renderer will actually show the camera view within our <canvas>
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // let gridHelper = new THREE.GridHelper(25, 25);
  // scene.add(gridHelper);

  // add pointer lock controls
  controls = new FirstPersonControls(camera, renderer.domElement);
  controls.movementSpeed = 5;
  controls.lookSpeed = 0.03;

  // controls.minPolarAngle = Math.PI / 2;
  // controls.maxPolarAngle = Math.PI / 2;

  controls.noFly = true;
  controls.lookVertical = false;

  // hide instructions on click
  let blocker = document.getElementById("blocker");
  let instructions = document.getElementById("instructions");

  instructions.addEventListener("click", function () {
    blocker.style.display = "none";
    // add audio listener and sources
    addSpatialAudio();
  });

  // materials for raycasting the sound objects
  activeMat = new THREE.MeshBasicMaterial({ color: "red" });
  inactiveMat = new THREE.MeshBasicMaterial();

  // get the card element from DOM
  let card = document.getElementsByClassName("card")[0];
  // console.log(card);
  card.addEventListener("click", (ev) => {
    ev.target.style.display = "none";
  });

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

  let raycaster = new THREE.Raycaster();
  document.addEventListener("click", (ev) => {
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(audioSources);

    // reset all materials
    for (let i = 0; i < audioSources.length; i++) {
      audioSources[i].material = inactiveMat;
    }
    for (let i = 0; i < intersects.length; i++) {
      intersects[i].object.material = activeMat;
      card.style.display = "block";
      // place a cube
      // let boxGeo = new THREE.BoxGeometry(10, 10, 10);
      // let boxMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      // let cube = new THREE.Mesh(boxGeo, boxMat);
      // cube.position.set(intersects[i].x, intersects[i].y, intersects[i].z);
      // scene.add(cube);
      // console.log(cube);
    }
  });

  window.addEventListener("resize", onWindowResize);

  loop();
}

function addSpatialAudio() {
  // first lets add our audio listener.  This is our ear (or microphone) within the 3D space.
  audioListener = new THREE.AudioListener();

  // attach the audio listener to camera so that it follows as user moves.
  camera.add(audioListener);

  // create an audio loader which will load our audio files:
  const audioLoader = new THREE.AudioLoader();

  // then let's add some audio sources
  // use the inactive material by default
  for (let i = 1; i < 3; i++) {
    let mesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 12, 12),
      // new THREE.MeshBasicMaterial({ color: "blue" })
      inactiveMat
    );

    mesh.position.set(10 * (-1) ** i, 0, 5);

    let audioSource = new THREE.PositionalAudio(audioListener);

    // load the audio file into the positional audio source
    audioLoader.load(i + ".mp3", function (buffer) {
      audioSource.setBuffer(buffer);
      audioSource.setDistanceModel("exponential");
      audioSource.setRefDistance(1);
      audioSource.setRolloffFactor(3);
      audioSource.setVolume(1);
      audioSource.setLoop(true);
      audioSource.play();
    });

    mesh.add(audioSource);
    scene.add(mesh);

    audioSources.push(mesh);
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function loop() {
  window.requestAnimationFrame(loop); // pass the name of your loop function into this function

  controls.update(clock.getDelta());
  // finally, take a picture of the scene and show it in the <canvas>
  renderer.render(scene, camera);
}

init();

// let hasInitialized = false;
// window.addEventListener("click", () => {
//   if (!hasInitialized) {
//     hasInitialized = true;
//     init();
//   }
// });
