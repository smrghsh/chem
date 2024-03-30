import * as THREE from "three";
import { PDBLoader } from "three/addons/loaders/PDBLoader.js";
import Experience from "./Experience.js";
// import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

export default class Chemical {
  constructor(filename, title, description, metadata) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.font = this.resources.items.font;
    // console.log(this.resources.items);

    this.debug = this.experience.debug;

    this.textParameters = {
      size: 0.5,
      // height: 0.2, //depth of font
      depth: 0.2,
      curveSegments: 5, //lower = easier for computer
      bevelThickness: 0.03,
      bevelSize: 0.015,
      bevelOffset: 0,
      bevelSegments: 3, //lower = easier for computer
      
      descHeight: 0.1,
      descSize: 0.1,
      descBevelSize: 0.001,

      metadataHeight: 0.1,
      metadataSize: 0.07,
      metadataBevelSize: 0.001,
    };

    this.titleGeometry = new TextGeometry(title, {
      font: this.font,
      size: this.textParameters.size,
      depth: this.textParameters.depth,
      // depth: this.textParameters.depth,
      curveSegments: this.textParameters.curveSegments,
      bevelEnabled: true,
      bevelThickness: this.textParameters.bevelThickness,
      bevelSize: this.textParameters.bevelSize,
      bevelOffset: this.textParameters.bevelOffset,
      bevelSegments: this.textParameters.bevelSegments,
    });
    this.textMaterial = new THREE.MeshBasicMaterial({color: "white"});

    // this.textGeometry.center(); //much simpler way than commented code above
    this.titleMesh = new THREE.Mesh(this.titleGeometry, this.textMaterial);
    this.titleMesh.scale.set(1.0, 1.0, 0.3);
    this.titleMesh.position.set(-1, 1.6, 0.5);
    this.scene.add(this.titleMesh);
    this.offset = new THREE.Vector3();

    // Description
    this.descGeometry = new TextGeometry(description, {
      font: this.font,
      size: this.textParameters.descSize,
      height: this.textParameters.descHeight,
      
      curveSegments: this.textParameters.curveSegments,
      bevelEnabled: true,
      bevelThickness: this.textParameters.bevelThickness,
      bevelSize: this.textParameters.descBevelSize,
      bevelOffset: this.textParameters.bevelOffset,
      bevelSegments: this.textParameters.bevelSegments,
    });
    this.textMaterial = new THREE.MeshBasicMaterial({color: "blue"});

    this.descMesh = new THREE.Mesh(this.descGeometry, this.textMaterial);
    this.descMesh.scale.set(1.0, 1.0, 0.3);
    this.descMesh.position.set(1.8, 1.5, 0.8);
    this.scene.add(this.descMesh);
    this.offset = new THREE.Vector3();

    // Metadata
    this.metadataGeometry = new TextGeometry(metadata, {
      font: this.font,
      size: this.textParameters.metadataSize,
      height: this.textParameters.metadataHeight,
      
      curveSegments: this.textParameters.curveSegments,
      bevelEnabled: true,
      bevelThickness: this.textParameters.bevelThickness,
      bevelSize: this.textParameters.descBevelSize,
      bevelOffset: this.textParameters.bevelOffset,
      bevelSegments: this.textParameters.bevelSegments,
    });
    this.textMaterial = new THREE.MeshBasicMaterial({color: "grey"});

    this.metadataMesh = new THREE.Mesh(this.metadataGeometry, this.textMaterial);
    this.metadataMesh.scale.set(1.0, 1.0, 0.3);
    this.metadataMesh.position.set(-0.9, 1.3, 0.9);
    this.scene.add(this.metadataMesh);
    this.offset = new THREE.Vector3();

    // this.root contains the 3D model
    this.root = new THREE.Group();
    this.group = new THREE.Group();
    this.root.position.set(1, 1, 1);
    this.group.add(this.root);
    // add the title
    // add the metadata
    // add the description
    this.scene.add(this.group);
    this.loader = new PDBLoader();
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
    this.titleMesh.visible = false;
    this.descMesh.visible = false;
    this.metadataMesh.visible = false;

  }
  show() {
    this.root.visible = true;
    this.titleMesh.visible = true;
    this.descMesh.visible = true;
    this.metadataMesh.visible = true;
  }
}
