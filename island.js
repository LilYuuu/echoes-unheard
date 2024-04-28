import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

import {
  camera,
  controls,
  outlinePass,
  getIslandsVisited,
  setIslandsVisited,
} from "./index.js";

// import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect.js";

// export const outlineEffect = new OutlineEffect(renderer, {
//   defaultThickness: 0.01,
//   defaultColor: [0, 0, 1],
//   defaultAlpha: 0.8,
// });

import { getHtmlOn, setHtmlOn } from "./interface.js";

export let curIsland;

export class Island {
  constructor(scene, listener, mouse, camera, name) {
    this.scene = scene;
    this.listener = listener;
    this.mouse = mouse;
    this.camera = camera;
    this.name = name;

    this.mesh = null;
    this.sound = null;

    this.hover = false;
    this.isActive = false;

    window.addEventListener("click", (ev) => this.onClick(ev));

    this.raycaster = new THREE.Raycaster();
  }

  async loadModel(path) {
    const loader = new FBXLoader();

    try {
      const model = await new Promise((resolve, reject) => {
        loader.load(path, resolve, undefined, reject);
      });

      this.mesh = model.children[0]; // Assuming the model has a single mesh

      this.scene.add(this.mesh);
      // Scaling the model
      this.mesh.scale.multiplyScalar(0.12);
    } catch (error) {
      console.error("An error occurred while loading the model:", error);
    }
  }

  async loadAudio(audioUrl) {
    const audioLoader = new THREE.AudioLoader();

    try {
      const audioBuffer = await new Promise((resolve, reject) => {
        audioLoader.load(audioUrl, resolve, undefined, reject);
      });

      this.sound = new THREE.PositionalAudio(this.listener);
      this.sound.setBuffer(audioBuffer);
      this.sound.setDistanceModel("exponential");
      this.sound.setRefDistance(5); // Set this according to your needs
      this.sound.setRolloffFactor(3);
      this.sound.setVolume(1);
      this.sound.setLoop(true);
      this.mesh.add(this.sound); // Attach the sound to the mesh
    } catch (error) {
      console.error("An error occurred while loading the audio:", error);
    }
  }

  setPosition(x, y, z) {
    if (this.mesh) {
      this.mesh.position.set(x, y, z);
    }
  }

  setRotation(x, y, z) {
    if (this.mesh) {
      this.mesh.rotation.set(x, y, z);
    }
  }

  setScale(s) {
    if (this.mesh) {
      this.mesh.scale.multiplyScalar(s);
    }
  }

  playAudio() {
    if (this.sound && !this.sound.isPlaying) {
      this.sound.play();
    }
  }

  stopAudio() {
    if (this.sound && this.sound.isPlaying) {
      this.sound.stop();
    }
  }

  onClick() {
    if (this.hover) {
      // console.log("clicked on object");

      curIsland = this.name;
      console.log(curIsland);

      if (!getIslandsVisited().includes(this.name)) {
        setIslandsVisited(this.name);
        console.log(getIslandsVisited());
      }

      let card = document.getElementById(`title-card-${this.name}`);

      // hide all the other cards if they are on
      const titleCards = document.getElementsByClassName("title-card");

      for (let i = 0; i < titleCards.length; i++) {
        if (titleCards[i].style.display != "none") {
          titleCards[i].style.opacity = 0;
          setTimeout(function () {
            titleCards[i].style.display = "none";
          }, 300);
        }
      }

      // then show this card
      card.style.display = "block";
      setTimeout(function () {
        card.style.opacity = 1;
      }, 100);

      if (!getHtmlOn()) {
        setHtmlOn(true);
      }

      // this.moveCamera();
      // controls.enabled = true;
      // controls.update();

      if (this.isActive) {
        this.isActive = false;
        console.log("turn inactive");
      } else {
        this.isActive = true;
        console.log("turn active");
        // TODO: keep the outline
        // outlinePass.selectedObjects = [this.mesh];
      }
    }
  }

  update() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    if (this.mesh) {
      let interaction = this.raycaster.intersectObject(this.mesh);

      if (interaction.length > 0) {
        this.hover = true;
        // console.log(interaction);
        // console.log("hover");
        // document.querySelector("canvas").style.cursor = "pointer";
        // this.mesh.scale.set(0.15, 0.15, 0.15);
        // this.mesh.scale.multiplyScalar(1.1);
        outlinePass.selectedObjects = [this.mesh];
      } else {
        this.hover = false;
        if (!this.isActive) {
          outlinePass.selectedObjects = [];
        }

        // document.querySelector("canvas").style.cursor = "auto";
        // this.mesh.scale.set(0.12, 0.12, 0.12);
        // this.mesh.scale.multiplyScalar(1.0);
      }
    }
  }

  moveCamera() {
    // const newCameraPos = this.mesh.position.clone().add(new THREE.Vector3(0, 0, 10));
    const newCameraPos = camera.position.clone();
    newCameraPos.x = this.mesh.position.x;
    newCameraPos.z = this.mesh.position.z + 20;
    // camera.up = new THREE.Vector3(0, 0, 0);

    const newLookAtPos = this.mesh.position;

    const duration = 3000; // in ms
    const startTime = Date.now();
    controls.enabled = false;
    console.log("taking over controls");

    function updateCameraPos() {
      const elaspedTime = Date.now() - startTime;
      const t = elaspedTime / duration;

      // controls.enabled = false;
      if (t < 1) {
        camera.position.lerpVectors(camera.position, newCameraPos, t);
        camera.lookAt(newLookAtPos);
        // controls.copy(newLookAtPos);
        controls.update();
        requestAnimationFrame(updateCameraPos);
      } else {
        console.log("releasing controls");
        controls.enabled = true;
        camera.position.copy(newCameraPos);
        camera.lookAt(newLookAtPos);
      }
    }

    updateCameraPos();
  }
}
