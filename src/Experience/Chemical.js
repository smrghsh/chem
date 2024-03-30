import * as THREE from "three";
import { PDBLoader } from "three/addons/loaders/PDBLoader.js";
import Experience from "./Experience.js";

export default class Chemical {
  constructor(filename, title, description, metadata) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    // console.log("leggo");
    // const MOLECULES = {
    //   Ethanol: "ethanol.pdb",
    //   Aspirin: "aspirin.pdb",
    //   Caffeine: "caffeine.pdb",
    //   Nicotine: "nicotine.pdb",
    //   LSD: "lsd.pdb",
    //   Cocaine: "cocaine.pdb",
    //   Cholesterol: "cholesterol.pdb",
    //   Lycopene: "lycopene.pdb",
    //   Glucose: "glucose.pdb",
    //   "Aluminium oxide": "Al2O3.pdb",
    //   Cubane: "cubane.pdb",
    //   Copper: "cu.pdb",
    //   Fluorite: "caf2.pdb",
    //   Salt: "nacl.pdb",
    //   "YBCO superconductor": "ybco.pdb",
    //   Buckyball: "buckyball.pdb",
    //   Graphite: "graphite.pdb",
    // };
    this.offset = new THREE.Vector3();

    // this.root contains the 3D model
    this.root = new THREE.Group();
    this.group = new THREE.Group();
    this.group.add(this.root);
    // add the title
    // add the metadata
    // add the description
    this.scene.add(this.group);
    this.loader = new PDBLoader();
    // this.loader.load("models/chemicals/caffeine.pdb", (pdb) => {
    //   console.log("tryna load bruh");
    //   console.log(pdb);
    //   //   let group = pdb;
    // this.group.scale.set(0.1, 0.1, 0.1);
    //   this.scene.add(group);
    // });
    this.loadMolecule(filename, this.root);
  }
  loadMolecule(model) {
    const url = "models/chemicals/" + model;

    while (this.root.children.length > 0) {
      const object = this.root.children[0];
      object.parent.remove(object);
    }
    let root = this.root;
    this.loader.load(url, function (pdb) {
      const geometryAtoms = pdb.geometryAtoms;
      const geometryBonds = pdb.geometryBonds;
      const json = pdb.json;

      const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
      const sphereGeometry = new THREE.IcosahedronGeometry(1, 3);

      geometryAtoms.computeBoundingBox();
      const offset = new THREE.Vector3();
      geometryAtoms.boundingBox.getCenter(offset).negate();

      geometryAtoms.translate(offset.x, offset.y, offset.z);
      geometryBonds.translate(offset.x, offset.y, offset.z);

      let positions = geometryAtoms.getAttribute("position");
      const colors = geometryAtoms.getAttribute("color");

      const position = new THREE.Vector3();
      const color = new THREE.Color();

      for (let i = 0; i < positions.count; i++) {
        position.x = positions.getX(i);
        position.y = positions.getY(i);
        position.z = positions.getZ(i);

        color.r = colors.getX(i);
        color.g = colors.getY(i);
        color.b = colors.getZ(i);

        const material = new THREE.MeshPhongMaterial({ color: color });

        const object = new THREE.Mesh(sphereGeometry, material);
        object.position.copy(position);
        object.position.multiplyScalar(75);
        object.scale.multiplyScalar(25);
        // console.log(root);
        root.add(object);

        const atom = json.atoms[i];

        const text = document.createElement("div");
        text.className = "label";
        text.style.color =
          "rgb(" + atom[3][0] + "," + atom[3][1] + "," + atom[3][2] + ")";
        text.textContent = atom[4];

        // const label = new CSS2DObject(text);
        // label.position.copy(object.position);
        // root.add(label);
      }

      positions = geometryBonds.getAttribute("position");

      const start = new THREE.Vector3();
      const end = new THREE.Vector3();

      for (let i = 0; i < positions.count; i += 2) {
        start.x = positions.getX(i);
        start.y = positions.getY(i);
        start.z = positions.getZ(i);

        end.x = positions.getX(i + 1);
        end.y = positions.getY(i + 1);
        end.z = positions.getZ(i + 1);

        start.multiplyScalar(75);
        end.multiplyScalar(75);

        const object = new THREE.Mesh(
          boxGeometry,
          new THREE.MeshPhongMaterial({ color: 0xffffff })
        );
        object.position.copy(start);
        object.position.lerp(end, 0.5);
        object.scale.set(5, 5, start.distanceTo(end));
        object.lookAt(end);
        root.add(object);
      }
    });
    // make root super small

    root.scale.set(0.001, 0.001, 0.001);
  }
  hide() {
    this.root.visible = false;
  }
  show() {
    this.root.visible = true;
  }
}
