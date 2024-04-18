import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { lerp } from "./utility.js";

export class Boat {
  constructor(scene, camera, clock) {
    this.scene = scene;
    this.camera = camera;
    this.cameraHeight = 1.5;
    this.clock = clock;

    this.mesh = null;

    this.raycaster = new THREE.Raycaster();

    this.setupCollisionDetection();
  }

  async loadModel(path) {
    const loader = new GLTFLoader();

    try {
      const model = await new Promise((resolve, reject) => {
        loader.load(path, resolve, undefined, reject);
      });

      this.mesh = model.scene; // Assuming the model has a single mesh

      this.camera.add(this.mesh);

      // apply transformation
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

  update() {
    // let origin = this.camera.position.clone();
    // origin.set(origin.x, origin.y - this.cameraHeight, origin.z); // set origin to floor level

    this.float();

    this.detectCollisions();
    // set the raycaster to check downward from this point
    // this.raycaster.set(origin, new THREE.Vector3(0, -1, 0));

    if (Object.values(this.obstacles).indexOf(true) >= 0) {
      // console.log(this.obstacles);
    }
  }

  getCollidables() {
    let collidableMeshList = [];
    this.scene.traverse(function (object) {
      if (object.isMesh) {
        collidableMeshList.push(object);
      }
    });
    // console.log(collidableMeshList);
    return collidableMeshList;
  }

  // Collision Detection 🤾‍♀️

  /*
   * setupCollisionDetection()
   *
   * Description:
   * This function sets up collision detection:
   * 	- creates this.collidableMeshList which will be populated by this.loadFloorModel function
   * 	- creates this.obstacles object which will be queried by player controls before performing movement
   * 	- generates arrays of collision detection points, from which we will perform raycasts in this.detectCollisions()
   *
   */
  setupCollisionDetection() {
    this.obstacles = {
      forward: false,
      backward: false,
      right: false,
      left: false,
    };
  }

  detectCollisions() {
    // reset obstacles:
    this.obstacles = {
      forward: false,
      backward: false,
      right: false,
      left: false,
    };

    // TODO only use XZ components of forward DIR in case we are looking up or down while travelling forward
    // NOTE: THREE.PlayerControls seems to be backwards (i.e. the 'forward' controls go backwards)...
    // Weird, but this function respects those directions for the sake of not having to make conversions
    // https://github.com/mrdoob/three.js/issues/1606
    var matrix = new THREE.Matrix4();
    matrix.extractRotation(this.camera.matrix);
    var backwardDir = new THREE.Vector3(0, 0, 1).applyMatrix4(matrix);
    var forwardDir = backwardDir.clone().negate();
    var rightDir = forwardDir
      .clone()
      .cross(new THREE.Vector3(0, 1, 0))
      .normalize();
    var leftDir = rightDir.clone().negate();

    // TODO more points around avatar so we can't be inside of walls
    // let pt = this.controls.getObject().position.clone()
    let pt = this.camera.position.clone();

    this.forwardCollisionDetectionPoints = [pt];
    this.backwardCollisionDetectionPoints = [pt];
    this.rightCollisionDetectionPoints = [pt];
    this.leftCollisionDetectionPoints = [pt];

    // check forward
    this.obstacles.forward = this.checkCollisions(
      this.forwardCollisionDetectionPoints,
      forwardDir
    );
    this.obstacles.backward = this.checkCollisions(
      this.backwardCollisionDetectionPoints,
      backwardDir
    );
    this.obstacles.left = this.checkCollisions(
      this.leftCollisionDetectionPoints,
      leftDir
    );
    this.obstacles.right = this.checkCollisions(
      this.rightCollisionDetectionPoints,
      rightDir
    );
  }

  checkCollisions(pts, dir) {
    // distance at which a collision will be detected and movement stopped (this should be greater than the movement speed per frame...)
    var detectCollisionDistance = 1;

    for (var i = 0; i < pts.length; i++) {
      var pt = pts[i].clone();

      this.raycaster.set(pt, dir);
      //   this.raycaster.layers.set(3);
      var collisions = this.raycaster.intersectObjects(this.getCollidables());
      //   console.log(collisions);

      if (
        collisions.length > 0 &&
        collisions[0].distance < detectCollisionDistance
      ) {
        // console.log("collision detected");
        return true;
      }
    }
    return false;
  }
}
