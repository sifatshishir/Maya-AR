import * as THREE from "../libs/three.module.js";
import {loadTexture} from "./helper.js";

class ImageController {
    source;
    image;
    sphereMesh;

    constructor(source) {
        this.source = source;
    }

    async load() {
        const texture = await loadTexture(this.source);
        const sphereGeometry = new THREE.SphereGeometry(500, 60, 40);
        sphereGeometry.scale(-1, 1, 1);

        const sphereMaterial = new THREE.MeshBasicMaterial({map: texture});
        this.sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(this.sphereMesh);
        this.sphereMesh.visible = false;
    }

    show(visible = true) {
        this.sphereMesh.visible = visible;
    }
}

export {ImageController};