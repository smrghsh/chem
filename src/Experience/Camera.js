import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Experience from "./Experience.js";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.setInstance();
    this.setOrbitControls();
  }
  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.instance.position.set(5, 4, 3);
    this.instance.lookAt(new THREE.Vector3(0, 1, 1));
    this.scene.add(this.instance);
  }
  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
    // this.instance.position.set(0, 2, 3);
    // this.instance.lookAt(new THREE.Vector3(0, 1, -10));
    // this.controls.target = new THREE.Vector3(0, 1, 1);
    // this.controls.target = new THREE.Vector3(0, 1.8, 0);
  }
  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }
  update() {
    this.controls.update();
  }
}
