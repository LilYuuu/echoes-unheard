import * as THREE from "three";

// PointerLockControls: wasd + mouse direction
// import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";

let scene, camera, renderer;

// raycasting
let myObjects = [];
let inactiveMat, activeMat;
let mouse;

// first person controls
let controls;
let clock = new THREE.Clock();

// spatial audio
let audioListener;
let audioListenerMesh;
let audioSources = [];

function init() {
  // create a scene in which all other objects will exist
  scene = new THREE.Scene();

  // create a camera and position it in space
  let aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.z = 5; // place the camera in space
  camera.position.y = 5;
  camera.lookAt(0, 0, 0);

  // the renderer will actually show the camera view within our <canvas>
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  let gridHelper = new THREE.GridHelper(25, 25);
  scene.add(gridHelper);

  // add pointer lock controls
  controls = new FirstPersonControls(camera, renderer.domElement);
  controls.movementSpeed = 5;
  controls.lookSpeed = 0.03;

  // hide instructions on click
  let blocker = document.getElementById("blocker");
  let instructions = document.getElementById("instructions");

  instructions.addEventListener("click", function () {
    blocker.style.display = "none";
  });

  // add audio listener and sources
  addSpatialAudio();

  window.addEventListener("resize", onWindowResize);

  loop();
}

function addSpatialAudio() {
  // first lets add our audio listener.  This is our ear (or microphone) within the 3D space.
  audioListener = new THREE.AudioListener();
  camera.add(audioListener); // attaches the audio listener to camera so that it follows as user moves.

  // create a 3D mesh so we can see the location of the audio listener
  // this is not strictly necessary, but can be helpful for debugging
  // audioListenerMesh = new THREE.Mesh(
  //   new THREE.BoxGeometry(1, 1, 1),
  //   new THREE.MeshBasicMaterial({ color: "red" })
  // );
  // audioListenerMesh.add(audioListener);
  // audioListenerMesh.position.set(0, 0, 5);
  // scene.add(audioListenerMesh);

  // create an audio loader which will load our audio files:
  const audioLoader = new THREE.AudioLoader();

  // then let's add some audio sources
  for (let i = 1; i < 3; i++) {
    let mesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 12, 12),
      new THREE.MeshBasicMaterial({ color: "blue" })
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

let hasInitialized = false;
window.addEventListener("click", () => {
  if (!hasInitialized) {
    hasInitialized = true;
    init();
  }
});
