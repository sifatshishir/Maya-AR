import * as THREE from "../libs/three.module.js";

const AudioType = {
    POSITIONAL: 0,
    NON_POSITIONAL: 1
};

const AudioIndex = {
    EVENT01: 0,
    EVENT02: 1,
    EVENT03: 2
};

const AudioDataMap = {};

class AudioController {
    type;
    source;
    listener;
    index;

    constructor(type, source, listener, index) {
        this.type = type;
        this.source = source;
        this.listener = listener;
        this.index = index;

        this.load(source);
    }

    load() {
        let self = this;
        let sound;
        switch (this.type) {
            case AudioType.POSITIONAL:
                sound = new THREE.PositionalAudio(this.listener);
                sound.setRefDistance(20);
                break;
            case AudioType.NON_POSITIONAL:
                sound = new THREE.Audio(this.listener);
                break;
        }

        const audioLoader = new THREE.AudioLoader();

        audioLoader.load(this.source,
            function (buffer) {
                sound.setBuffer(buffer);
                sound.setLoop(false);
                sound.setVolume(0.5);

                AudioDataMap[self.index] = sound;
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
            (error) => {
                console.log(error);
            }
        );
    }

    play(audioIndex) {
        AudioDataMap[audioIndex].setLoop(false);
        AudioDataMap[audioIndex].play();
    }
}

export {AudioController, AudioIndex, AudioType};