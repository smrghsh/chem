import * as THREE from "three";
import Experience from "./Experience.js";
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory.js";
import { XRHandModelFactory } from "three/addons/webxr/XRHandModelFactory.js";
export default class Controllers {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer;
    this.r_connection = false;
    this.l_connection = false;

    this.controller1 = this.renderer.instance.xr.getController(0);
    this.controller2 = this.renderer.instance.xr.getController(1);

    this.lastAButtonPressed = false;
    this.lastBButtonPressed = false;
    this.lastXButtonPressed = false;
    this.lastYButtonPressed = false;
    this.lastLeftTriggerPressed = false;
    this.lastRightTriggerPressed = false;

    this.hand1Pinching = false;
    this.hand2Pinching = false;

    // this.debugCube = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1),
    //   new THREE.MeshBasicMaterial({ color: "red" })
    // );
    // this.scene.add(this.debugCube);

    // const onSelectStart = function (event) {};
    // this.controller1.addEventListener("selectstart", onSelectStart);
    // this.controller2.addEventListener("selectstart", onSelectStart);

    this.controller2.gamepad = undefined;
    this.controller1.gamepad = undefined;
    // this.controller2.addEventListener( 'selectend', onSelectEnd );
    this.controller2.addEventListener("connected", (event) => {
      if (event.data.gamepad) {
        this.r_connection = true;
        this.controller2.gamepad = event.data.gamepad;
      } else {
        this.r_connection = false;
      }
    });

    this.controller1.addEventListener("connected", (event) => {
      if (event.data.gamepad) {
        this.l_connection = true;
        this.controller1.gamepad = event.data.gamepad;
      } else {
        this.l_connection = false;
      }
    });
    // this.controller1.addEventListener( 'selectend', onSelectEnd );

    // this.controller2.addEventListener( 'selectend', onSelectEnd );
    this.scene.add(this.controller1);
    this.scene.add(this.controller2);

    this.controllerModelFactory = new XRControllerModelFactory();

    this.controllerGrip1 = this.renderer.instance.xr.getControllerGrip(0);
    this.controllerGrip1.add(
      this.controllerModelFactory.createControllerModel(this.controllerGrip1)
    );
    this.scene.add(this.controllerGrip1);

    this.controllerGrip2 = this.renderer.instance.xr.getControllerGrip(1);
    this.controllerGrip2.add(
      this.controllerModelFactory.createControllerModel(this.controllerGrip2)
    );
    this.scene.add(this.controllerGrip2);

    // hands
    this.handModelFactory = new XRHandModelFactory();

    this.hand1 = this.renderer.instance.xr.getHand(0);
    this.hand1.add(this.handModelFactory.createHandModel(this.hand1, "mesh"));

    this.scene.add(this.hand1);

    // this.hand1.addEventListener("pinchin", function () {
    //   this.debugCube.material.color = "blue";
    // });

    this.hand2 = this.renderer.instance.xr.getHand(1);
    this.hand2.add(this.handModelFactory.createHandModel(this.hand2, "mesh"));
    this.scene.add(this.hand2);

    // this.debugAxes = new THREE.AxesHelper(1);
    // this.scene.add(this.debugAxes);

    this.hand1.addEventListener("pinchend", function () {
      // window.experience.controllers.debugCube.material.color = "green";
      // window.experience.controllers.hand1Pinching = false;
      // window.experience.controllers.hand2Pinching = false;
      window.experience.nextCategory();
    });
    // // this.hand2.addEventListener("pinchin", function () {
    // //   this.debugCube.material.color = "yellow";
    // // });

    this.hand2.addEventListener("pinchend", function () {
      // window.experience.controllers.debugCube.material.color = "purple";
      // window.experience.controllers.hand1Pinching = false;
      // window.experience.controllers.hand2Pinching = false;
      // this.hand2;
      window.experience.nextChemical();
    });
  }

  setInstance() {}

  resize() {}

  update() {
    try {
      // Right Controller
      if (this.controller2.gamepad) {
        // A Button
        if (
          this.controller2.gamepad.buttons[4].pressed !==
          this.lastAButtonPressed
        ) {
          if (this.controller2.gamepad.buttons[4].pressed) {
            console.log("A pressed");
          } else {
            console.log("A released");
          }
        }
        this.lastAButtonPressed = this.controller2.gamepad.buttons[4].pressed;
        // B button
        if (
          this.controller2.gamepad.buttons[5].pressed !==
          this.lastBButtonPressed
        ) {
          if (this.controller2.gamepad.buttons[5].pressed) {
            console.log("B pressed");
          } else {
            console.log("B released");
          }
        }
        this.lastBButtonPressed = this.controller2.gamepad.buttons[5].pressed;
        if (
          this.controller2.gamepad.buttons[0].pressed !==
          this.lastRightTriggerPressed
        ) {
          if (this.controller2.gamepad.buttons[0].pressed) {
            console.log("right trigger pressed");
          } else {
            console.log("right trigger released");
          }
        }
        this.lastRightTriggerPressed =
          this.controller2.gamepad.buttons[0].pressed;
      }
      // Left Controller
      if (this.controller1.gamepad) {
        // X button
        if (
          this.controller1.gamepad.buttons[4].pressed !==
          this.lastXButtonPressed
        ) {
          if (this.controller1.gamepad.buttons[4].pressed) {
            console.log("X pressed");
          } else {
            console.log("X released");
          }
        }
        this.lastXButtonPressed = this.controller1.gamepad.buttons[4].pressed;
        // Y button
        if (
          this.controller1.gamepad.buttons[5].pressed !==
          this.lastYButtonPressed
        ) {
          if (this.controller1.gamepad.buttons[5].pressed) {
            console.log("Y pressed");
          } else {
            console.log("Y released");
          }
        }
        this.lastYButtonPressed = this.controller1.gamepad.buttons[5].pressed;
        // Left trigger
        if (
          this.controller1.gamepad.buttons[0].pressed !==
          this.lastLeftTriggerPressed
        ) {
          if (this.controller1.gamepad.buttons[0].pressed) {
          } else {
          }
        }
        this.lastLeftTriggerPressed =
          this.controller1.gamepad.buttons[0].pressed;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
