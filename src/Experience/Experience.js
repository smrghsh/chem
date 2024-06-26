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
import ChemicalManifest from "./ChemicalManifest.js";

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
    this.queryChemical = urlParams.get("chemical");
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
    this.chemicalManifest = ChemicalManifest;

    this.renderer.instance.xr.enabled = true;
    document.body.appendChild(
      VRButton.createButton(this.renderer.instance, {
        requiredFeatures: ["hand-tracking"],
      })
    );

    this.renderer.instance.setAnimationLoop(() => {
      // tick();
      this.world.update();
      this.controllers.update();
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
      this.categories = ["Other"];
      this.currentCategory = 0;

      this.categories.forEach((category, i) => {
        this.chemicalManifest[category].forEach((e, i) => {
          function addNewlineEveryNChars(str, n) {
            const regex = new RegExp(`.{1,${n}}`, "g");
            return str.match(regex).join("\n");
          }
          function addNewlineWithoutSplittingWords(str, n) {
            let result = "";
            let lineLength = 0;

            str.split(" ").forEach((word) => {
              if (lineLength + word.length + 1 > n) {
                result += "\n";
                lineLength = 0;
              }
              result += (lineLength > 0 ? " " : "") + word;
              lineLength += word.length + 1; // +1 for the space
            });

            return result;
          }
          e.chemical = new Chemical(
            e.filename,
            e.name,
            addNewlineWithoutSplittingWords(e.description, 60),
            e.formula
          );
          e.chemical.hide();
        });
      });
      this.chemicalList =
        this.chemicalManifest[this.categories[this.currentCategory]];

      // Function to find the index of an object with name 'chemical'
      function findChemicalIndex(array, queryChemical) {
        // Use findIndex to find the index of the object with name 'chemical'
        const index = array.findIndex((obj) => obj.name === queryChemical);

        // If index is -1 (not found), return 0, otherwise return the found index
        return index === -1 ? 0 : index;
      }
      this.currentChemical = this.queryChemical
        ? findChemicalIndex(this.chemicalList, this.queryChemical)
        : 0;
      // this.chemicalList.forEach((e, i) => {
      //   e.chemical = new Chemical(
      //     e.filename,
      //     e.title,
      //     e.description,
      //     e.metadata
      //   );
      //   e.chemical.hide();
      // });
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
        // nextCategory: function () {
        //   console.log("previous Chemical");
        //   window.experience.nextCategory();
        // },
      };
      this.debugFolder.add(debugObject, "nextChemical");
      // this.debugFolder.add(debugObject, "nextCategory");
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
  nextCategory() {
    console.log("next category");
    this.chemicalList.forEach((e) => {
      e.chemical.hide();
    });
    this.currentCategory++;
    if (this.currentCategory > this.categories.length - 1) {
      this.currentCategory = 0;
    }
    this.chemicalList =
      this.chemicalManifest[this.categories[this.currentCategory]];
    this.chemicalList[this.currentChemical].chemical.show();
    this.currentChemical = 0;
  }
  nextChemical() {
    console.log("next chemical");
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
