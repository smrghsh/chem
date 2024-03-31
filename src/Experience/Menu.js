import * as THREE from "three";
import Experience from "./Experience.js";

export default class Menu {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.resources = this.experience.resources;

    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.createBacking();
  }

  createBacking() {
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: "red" })
    );
    this.group.add(this.mesh);
  }
  hide() {
    this.group.visible = false;
  }
  show() {
    this.group.visible = true;
  }
}
