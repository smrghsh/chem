// import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import * as THREE from "three";
import Experience from "./Experience.js";
import { XRHandModelFactory } from "three/addons/webxr/XRHandModelFactory.js";

export default class Hands {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer;
    this.handModelFactory = new XRHandModelFactory();
    // this.controller1 = this.renderer.instance.xr.getController(0);
    // this.controller2 = this.renderer.instance.xr.getController(1);
    // this.controllerGrip1 = this.renderer.instance.xr.getControllerGrip(0);
    // this.controllerGrip2 = this.renderer.instance.xr.getControllerGrip(1);
    // this.controllerModelFactory = new XRControllerModelFactory();
    // this.handModelFactory = new XRHandModelFactory();
    // this.controllerGrip1.add(this.handModelFactory.createHandModel(this.controllerGrip1, 'spheres'));
    // this.controllerGrip2.add(this.handModelFactory.createHandModel(this.controllerGrip2, 'spheres'));
    // this.scene.add(this.controllerGrip1);
    // this.scene.add(this.controllerGrip2);
    // this.experience = new Experience();
    // this.canvas = this.experience.canvas;
    // this.sizes = this.experience.sizes;
    // this.scene = this.experience.scene;
    // this.renderer = this.experience.renderer;
    // this.r_connection = false;
    // this.l_connection = false;

    // this.controller1 = this.renderer.instance.xr.getController(0);
    // this.controller2 = this.renderer.instance.xr.getController(1);
    // the following but using this where appropriate
    // Hand 1
    // controllerGrip1 = renderer.xr.getControllerGrip(0);
    // controllerGrip1.add(
    //   controllerModelFactory.createControllerModel(controllerGrip1)
    // );
    // scene.add(controllerGrip1);

    this.hand1 = this.renderer.xr.getHand(0);
    this.hand1.add(this.handModelFactory.createHandModel(this.hand1));

    this.scene.add(this.hand1);

    // Hand 2
    // controllerGrip2 = this.renderer.xr.getControllerGrip(1);
    // controllerGrip2.add(
    //   controllerModelFactory.createControllerModel(controllerGrip2)
    // );
    // scene.add(controllerGrip2);

    this.hand2 = this.renderer.xr.getHand(1);
    this.hand2.add(this.handModelFactory.createHandModel(this.hand2));
    this.scene.add(this.hand2);
  }
}
