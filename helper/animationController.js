import * as THREE from "../libs/three.module.js";

const AnimationIndex = {
    IDLE01: 0,
    IDLE02: 1,
    IDLE03: 2,
    EVENT01: 3,
    EVENT02: 4
};

class AnimationController {
    gltf;
    mixer;
    action;
    isAnimationPlaying;
    constructor(gltf, mixer) {
        let self = this;
        this.gltf = gltf;
        this.mixer = mixer;
        this.action = undefined;
        this.isAnimationPlaying = false;

        this.mixer.addEventListener('loop', function (event) {
            console.log(event);
        });

        this.mixer.addEventListener('finished', function (event) {
            self.isAnimationPlaying = false;
            self.play(AnimationIndex.IDLE01);
        });
    }

    createAction(animationIndex) {
        if (this.action) {
            this.action.stop();
        }
        this.action = this.mixer.clipAction(this.gltf.animations[animationIndex]);
        this.action.clampWhenFinished = true;

        if (animationIndex >= 3) {
            this.action.setLoop(THREE.LoopOnce);
            this.isAnimationPlaying = true;
        }
    }

    play(animationIndex) {
        this.createAction(animationIndex);
        this.action.play();
    }
}

export {AnimationController, AnimationIndex};