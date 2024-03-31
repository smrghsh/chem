import * as THREE from "three";
import Experience from "../Experience.js";
import Environment from "./Environment.js";
import Floor from "./Floor.js";
import Stars from "./Stars.js";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.resources = this.experience.resources;
    this.resources.on("ready", () => {
      // Setup
      console.log("resources ready");
      // this.test = new Test()
      // this.stars = new Stars();
      // this.scene.add(new THREE.AxesHelper());

      // this.spectra = new Spectra()
      // this.sushi = new Sushi()

      this.environment = new Environment();
      this.ready = true;
    });
    this.floor = new Floor();
    //event list
  }
  update() {}
  reset() {}
}
