import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { lerp } from "./utility.js";

export class Boat {
  constructor(camera, clock) {
    // this.scene = scene;
    this.camera = camera;
    this.clock = clock;

    this.mesh = null;

    this.raycaster = new THREE.Raycaster();
  }

  async loadModel(path) {
    const loader = new GLTFLoader();

    try {
      const model = await new Promise((resolve, reject) => {
        loader.load(path, resolve, undefined, reject);
      });

      this.mesh = model.scene; // Assuming the model has a single mesh

      this.camera.add(this.mesh);

      // Scaling the model
      this.mesh.position.set(0, -0.5, -1);
      this.mesh.rotation.y = Math.PI;
    } catch (error) {
      console.error("An error occurred while loading the boat model:", error);
    }
  }

  float() {
    // rotation
    let startValRot = this.mesh.rotation.x;
    let endValRot =
      perlin.get(this.clock.elapsedTime / 10, this.clock.elapsedTime / 2) * 0.1;
    this.mesh.rotation.x = lerp(startValRot, endValRot, 0.5);

    // pos x
    let startValPosX = this.mesh.position.x;
    let endValPosX =
      perlin.get(
        (this.clock.elapsedTime + 100) / 10,
        this.clock.elapsedTime / 2
      ) * 0.1;
    this.mesh.position.x = lerp(startValPosX, endValPosX, 0.5);
  }
}
