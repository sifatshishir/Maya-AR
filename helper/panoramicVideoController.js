import * as THREE from "../libs/three.module.js";

class PanoramicVideoController {
    source;
    video;

    constructor(source) {
        this.source = source;
    }

    async load() {
        this.video = document.createElement('video');
        this.video.src = this.source;
        this.video.crossOrigin = 'anonymous';
        this.video.loop = true;
        this.video.muted = false;

        let videoTexture = await new THREE.VideoTexture(this.video);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        const geometry = new THREE.SphereGeometry(500, 60, 40);
        const material = new THREE.MeshBasicMaterial({map: videoTexture, side: THREE.BackSide});
        this.sphere = new THREE.Mesh(geometry, material);

        window.scene.add(this.sphere);
        this.sphere.visible = false;
    }

    show(visible = true) {
        this.sphere.visible = visible;
        if (visible) {
            if (this.video.currentTime >= this.video.duration - 0.1) {
                this.video.currentTime = 0;
            }
            this.video.play();
        } else {
            this.video.pause();
        }
    }
}

export {PanoramicVideoController};