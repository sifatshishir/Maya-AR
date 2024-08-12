import * as THREE from "../libs/three.module.js";

class VideoController {
    source;
    video;
    videoTexture;
    plane;

    constructor(source) {
        this.source = source;

        this.load();
    }

    load() {
        this.video = document.createElement('video');
        this.video.src = this.source;
        this.video.crossOrigin = 'anonymous';
        this.video.loop = false;
        this.video.muted = false;

        this.videoTexture = new THREE.VideoTexture(this.video);
        const material = new THREE.MeshBasicMaterial({map: this.videoTexture});

        const geometry = new THREE.PlaneGeometry(4, 3.5);
        this.plane = new THREE.Mesh(geometry, material);

        this.plane.position.set(0, 0, -8);
        window.camera.add(this.plane);
        this.plane.visible = false;
    }

    show(visible = true) {
        this.plane.visible = visible;
    }

    play() {
        if (this.video.paused) {
            this.video.play();
        }
    }

    pause() {
        if (!this.video.paused) {
            this.video.pause();
        }
    }

    forward(seconds = 5) {
        this.video.currentTime += seconds;
    }

    backward(seconds = 5) {
        this.video.currentTime -= Math.min(0, seconds);
    }

    update() {
        if (this.video && this.video.readyState >= this.video.HAVE_CURRENT_DATA) {
            this.videoTexture.needsUpdate = true;
        }
    }
}

export {VideoController};