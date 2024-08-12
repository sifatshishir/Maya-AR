import * as THREE from "../libs/three.module.js";

const AnimationIndex = {
    IDLE01: 11,
    IDLE02: 21,
    IDLE03: 31,
    EVENT01: 0,
    EVENT02: 1,
    EVENT03: 2,
    EVENT04: 3,
    EVENT05: 4
};

class AnimationController {
    gltf;
    mixer;
    action;
    isAnimationPlaying;
    finishedCallback;

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

            if (self.finishedCallback) {
                self.finishedCallback();
            } else {
                self.play(AnimationIndex.EVENT02);
            }
        });
    }

    createAction(animationIndex) {
        const isIdle = (index) => {
            switch (index) {
                case AnimationIndex.EVENT02:
                    return true;
                default:
                    return false;
            }
        };

        if (this.action) {
            //this.action.fadeOut(0.5);
            this.action.stop();
        }
        this.action = this.mixer.clipAction(this.gltf.animations[animationIndex]);
        this.action.clampWhenFinished = true;

        if (!isIdle(animationIndex)) {
            this.action.setLoop(THREE.LoopOnce);
            this.isAnimationPlaying = true;
        }
    }

    play(animationIndex, finishedCallback = undefined) {
        this.createAction(animationIndex);
        this.finishedCallback = finishedCallback;
        this.action.play();
    }
}

export {AnimationController, AnimationIndex};