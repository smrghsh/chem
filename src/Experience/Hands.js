import * as THREE from "three";
import Experience from "./Experience.js";
import { XRHandModelFactory } from "three/addons/webxr/XRHandModelFactory.js";

export default class Hands {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer;
    this.handModelFactory = new XRHandModelFactory();

    this.hand1 = this.renderer.instance.xr.getHand(0);
    this.hand1.add(this.handModelFactory.createHandModel(this.hand1));

    this.scene.add(this.hand1);

    this.hand2 = this.renderer.instance.xr.getHand(1);
    this.hand2.add(this.handModelFactory.createHandModel(this.hand2));
    this.scene.add(this.hand2);
  }
}
