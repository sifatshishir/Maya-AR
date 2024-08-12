import {AudioIndex} from "../helper/audioController.js";

const EventName = {
    EVENT01: 'event01',
    EVENT02: 'event02',
    EVENT03: 'event03',
    EVENT04: 'event04',
    EVENT05: 'event05',
    EVENT06: 'event06',
    EVENT07: 'event07',
    EVENT08: 'event08',
};

import {VrMessagePriorityEnum} from "../libs/ARSubtitle/ARSubtitleLiterals.js";
import ARSubtitleController from "../libs/ARSubtitle/ARSubtitle-controller.js";

class EventController {
    events = [];
    animationController;
    audioController;
    selectionState;

    constructor (animationController, audioController, camera) {
        this.animationController = animationController;
        this.audioController = audioController;
        this.camera = camera;
        this.selectionState = 'ok';
        this.arSubtitleController = new ARSubtitleController();
    }

    addEvent({eventName, animationIndex, audioIndex = undefined,
                 subtitleData = undefined, buttonContainer = undefined,
                 containerPosition, selectionState = undefined, animationFinishCallback,
             buttonContainerTimer = 0}) {
        this.events.push({
            eventName: eventName,
            animationIndex: animationIndex,
            audioIndex: audioIndex,
            subtitleData: subtitleData,
            buttonContainer: buttonContainer,
            selectionState: selectionState,
            animationFinishCallback: animationFinishCallback,
            containerPosition: containerPosition,
            buttonContainerTimer: buttonContainerTimer
        });
    }

    async play(eventName) {
        if (eventName === EventName.EVENT07) {
            this.audioController.setVolume(AudioIndex.BACKGROUND, 0.01);
            window.model.visible = false;
            window.videoController.show(true);
            window.videoController.play();
        }

        this.selectionState = undefined;
        const event = this.events.find(data => data.eventName === eventName);

        if (!event) {
            return;
        }

        window.currentEventName = eventName;
        this.animationController.play(event.animationIndex, event.animationFinishCallback);
        if (event.audioIndex !== undefined) {
            this.audioController.play(event.audioIndex);
        }

        if (event.buttonContainer) {
            this.camera.remove(event.buttonContainer);
            //await new Promise(r => setTimeout(r, event.buttonContainerTimer));
            setTimeout(function () {
                this.camera.add(event.buttonContainer);
                event.buttonContainer.position.copy(event.containerPosition);
            }, event.buttonContainerTimer);
        }

        if (event.selectionState) {
            this.selectionState = event.selectionState;
        }

        if (event.subtitleData) {
            this.audioController.setVolume(AudioIndex.BACKGROUND, 0.01);
            for (let i = 0; i < event.subtitleData.length; i++) {
                const duration = event.subtitleData[i].duration;
                this.arSubtitleController.addARMessage({
                    text: event.subtitleData[i].text,
                    priority: VrMessagePriorityEnum.HIGHPRIORITYINFO,
                    duration: duration
                });

                await new Promise(r => setTimeout(r, duration));

                this.arSubtitleController.removeMessage(this.arSubtitleController.messages[0]);
            }
            this.audioController.setVolume(AudioIndex.BACKGROUND, 0.5);
        }
    }
}

export {EventController, EventName};