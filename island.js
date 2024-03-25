import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

export class Island {
  constructor(scene, listener, mouse, camera) {
    this.scene = scene;
    this.listener = listener;
    this.mouse = mouse;
    this.camera = camera;

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
      console.log("clicked on object");
      if (this.isActive) {
        this.isActive = false;
        console.log("turn inactive");
      } else {
        this.isActive = true;
        console.log("turn active");
        // TODO: show textbox
      }
    }
  }

  update() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    if (this.mesh) {
      let interaction = this.raycaster.intersectObject(this.mesh);
      if (interaction.length > 0) {
        this.hover = true;
        // this.mesh.scale.set(0.15, 0.15, 0.15);
        // this.mesh.scale.multiplyScalar(0.15);
      } else {
        this.hover = false;
        // this.mesh.scale.set(0.12, 0.12, 0.12);
        // this.mesh.scale.multiplyScalar(0.12);
      }
    }
  }
}
