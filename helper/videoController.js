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
        window.scene.add(this.plane);
        this.plane.visible = false;
    }

    show(visible = true) {

        // Calculate the position directly in front of the camera
        const cameraDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(window.camera.quaternion);
        const distance = 8; // Distance in front of the camera
        this.plane.position.copy(window.camera.position).add(cameraDirection.multiplyScalar(distance));
        this.plane.lookAt(window.camera.position); // Make sure the plane faces the camera
        this.plane.visible = visible; // Show the plane

        window.videoShowed = visible;
    }

    play() {
        if (this.video.currentTime >= this.video.duration - 0.1) {
            this.video.currentTime = 0;
        }
        if (this.video.paused) {
            this.video.play();
        }
    }

    pause() {
        if (!this.video.paused) {
            this.video.pause();
        }
    }

    forward(seconds = 2) {
        this.video.currentTime += seconds;
    }

    backward(seconds = 2) {
        this.video.currentTime -= Math.min(0, seconds);
    }

    update() {
        if (this.video && this.video.readyState >= this.video.HAVE_CURRENT_DATA && !this.video.paused) {
            this.videoTexture.needsUpdate = true;
        }
    }
}

export {VideoController};