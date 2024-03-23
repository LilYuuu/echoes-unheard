import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

export class Island {
  constructor(listener) {
    this.mesh = null;
    this.sound = null;
    this.listener = listener;
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

  setRotation(x, y, z) {
    if (this.mesh) {
      this.mesh.rotation.set(x, y, z);
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
}
