// loading 3d assets
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// console.log("I'm loadAssets");

// first create a loader
let gltfLoader = new GLTFLoader();

export function loadLeaf01() {
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

export function loadLeaf02() {
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

export function loadWaterlily() {
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

export function loadGrass01() {
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

export function loadStone() {
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
