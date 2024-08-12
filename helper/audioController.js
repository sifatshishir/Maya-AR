import * as THREE from "../libs/three.module.js";

const AudioType = {
    POSITIONAL: 0,
    NON_POSITIONAL: 1
};

const AudioIndex = {
    BACKGROUND: 0,
    EVENT01: 1,
    EVENT02: 2,
    EVENT03: 3
};

const AudioDataMap = {};

class AudioController {
    listener;

    constructor(listener) {
        this.listener = listener;
    }

    load(type, source, index) {
        let sound;
        switch (type) {
            case AudioType.POSITIONAL:
                sound = new THREE.PositionalAudio(this.listener);
                sound.setRefDistance(20);
                break;
            case AudioType.NON_POSITIONAL:
                sound = new THREE.Audio(this.listener);
                break;
        }

        const audioLoader = new THREE.AudioLoader();

        audioLoader.load(source,
            function (buffer) {
                sound.setBuffer(buffer);
                sound.setLoop(false);
                sound.setVolume(0.5);

                AudioDataMap[index] = sound;
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
            (error) => {
                console.log(error);
            }
        );
    }

    play(audioIndex, loop = false) {
        if (AudioDataMap[audioIndex] && !AudioDataMap[audioIndex].isPlaying) {
            AudioDataMap[audioIndex].setLoop(loop);
            AudioDataMap[audioIndex].play();
            if (audioIndex === AudioIndex.BACKGROUND) {
                window.backgroundAudioDone = true;
            }
        }
    }

    setVolume(audioIndex, value) {
        if (AudioDataMap[audioIndex]) {
            AudioDataMap[audioIndex].setVolume(value);
        }
    }
}

export {AudioController, AudioIndex, AudioType};