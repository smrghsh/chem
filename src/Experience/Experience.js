import * as THREE from "three";
import Debug from "./Utils/Debug.js";
import Sizes from "./Utils/Sizes.js";
// import Time from "./Utils/Time.js";
import Resources from "./Utils/Resources.js";
import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import World from "./World/World.js";
import sources from "./sources.js";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import Controllers from "./Controllers.js";
import Chemical from "./Chemical.js";

let instance = null;

export default class Experience {
  constructor(canvas) {
    if (instance) {
      return instance;
    }
    instance = this;
    // Global access
    window.experience = this;

    // if query parameter mobile = true, nextVideo()
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const mobile = urlParams.get("mobile");
    // log
    console.log("mobile: " + mobile);
    this.mobileVersion = mobile == "true" ? true : false;
    //log

    this.canvas = canvas;

    this.sizes = new Sizes();

    // this.time = new Time();
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.clock.start();
    this.resources = new Resources(sources);
    this.world = new World();
    this.camera = new Camera();
    this.renderer = new Renderer();

    this.renderer.instance.xr.enabled = true;
    document.body.appendChild(
      VRButton.createButton(this.renderer.instance, {
        requiredFeatures: ["hand-tracking"],
      })
    );

    this.renderer.instance.setAnimationLoop(() => {
      // tick();
      this.world.update();
      // this.controllers.update();
      this.renderer.instance.render(this.scene, this.camera.instance);
    });

    this.controllers = new Controllers();
    // this.hands = new Hands();

    this.mouse = new THREE.Vector2();
    window.addEventListener("mousemove", (event) => {
      this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;
    });

    this.resources.on("ready", () => {
      this.currentChemical = 0;
      this.chemicalList = [
        {
          filename: "caffeine.pdb",
          title: "Caffeine",
          description: "A drug that stimulates \nyour brain and nervous \nsystem. Caffeine is found in \nmany drinks such as \ncoffee, tea, soft drinks \nand energy drinks",
          metadata: "Caffeine (1,3,7-trimethylxanthine) \nis a plant alkaloid with a chemical \nstructure of C8H10N4O2 and \na molecular weight of 194.19."
        },
        {
          filename: "ethanol.pdb",
          title: "Ethanol",
          description: "Ethanol is a clear, colourless \nliquid with a characteristic pleasant \nodour and burning taste.\nIt is highly flammable.",
          metadata: "ethanol is CH 3−CH 2−OH, which \nindicates that the carbon of a methyl \ngroup (CH3−) is attached to \ncarbon of a methylene group (−CH2–)"
        },
      ];
      this.chemicalList.forEach((e, i) => {
        e.chemical = new Chemical(e.filename, e.title, e.description, e.metadata);
        e.chemical.hide();
      });
      this.chemicalList[this.currentChemical].chemical.show();
    });

    /** Debug
     *
     */
    this.debug = new Debug();
    // this.debug.active = true;
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("experience");
      const debugObject = {
        // sampleBoolean: this.sampleBoolean,
        // sampleNumber: this.sampleNumber,
        nextChemical: function () {
          console.log("next Chemical");
          window.experience.nextChemical();
        },
        previousChemical: function () {
          console.log("previous Chemical");
          window.experience.previousChemical();
        },
      };
      this.debugFolder.add(debugObject, "nextChemical");
      this.debugFolder.add(debugObject, "previousChemical");
    }

    // window.addEventListener("click", () => {
    //   if (this.INTERSECTED) {
    //     // do something here if there is something in this.INTERSECTED
    //   }
    // });
    this.sizes.on("resize", () => {
      this.resize();
      this.camera.resize();
      this.renderer.resize();
    });
    // this.time.on("tick", () => {
    //   this.update();
    // });
  }
  nextChemical() {
    this.currentChemical++;
    // if this.currentChemical more than this.chemicalList.length, make it 0
    if (this.currentChemical > this.chemicalList.length - 1) {
      this.currentChemical = 0;
    }
    this.chemicalList.forEach((e) => {
      e.chemical.hide();
    });
    this.chemicalList[this.currentChemical].chemical.show();
  }
  previousChemical() {
    this.currentChemical--;
    // if this.currentChemical more than this.chemicalList.length, make it 0
    if (this.currentChemical < 0) {
      this.currentChemical = this.chemicalList.length - 1;
    }
    this.chemicalList.forEach((e) => {
      e.chemical.hide();
    });
    this.chemicalList[this.currentChemical].chemical.show();
  }

  resize() {
    console.log("resized occured");
    this.camera.resize();
  }
  update() {
    this.camera.update();
    this.controllers.update();
    this.world.update();
  }
  destroy() {
    this.sizes.off("resize");
    this.time.off("tick");

    // Traverse the whole scene
    this.scene.traverse((child) => {
      // Test if it's a mesh
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        // Loop through the material properties
        for (const key in child.material) {
          const value = child.material[key];

          // Test if there is a dispose function
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });
    this.camera.controls.dispose();
    this.renderer.instance.dispose();
    if (this.debug.active) {
      this.debug.ui.destroy();
    }
  }
}
