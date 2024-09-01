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
    EVENT09: 'event09',
    EVENT10: 'event10',
    EVENT11: 'event11',
    EVENT12: 'event12',
    EVENT13: 'event13',
};

import {VrMessagePriorityEnum} from "../libs/ARSubtitle/ARSubtitleLiterals.js";
import ARSubtitleController from "../libs/ARSubtitle/ARSubtitle-controller.js";

class EventController {
    events = [];
    animationController;
    audioController;
    selectionState;

    constructor(animationController, audioController, camera) {
        this.animationController = animationController;
        this.audioController = audioController;
        this.camera = camera;
        this.selectionState = 'ok';
        this.arSubtitleController = new ARSubtitleController();
    }

    addEvent({
                 eventName, animationIndex = 1, audioIndex = undefined,
                 subtitleData = undefined, buttonContainer = undefined,
                 containerPosition, selectionState = undefined, animationFinishCallback,
                 buttonContainerTimer = 0
             }) {
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
        window.currentEventName = eventName;

        if (eventName === EventName.EVENT08) {
            this.audioController.setVolume(AudioIndex.BACKGROUND, 0.01);
            window.model.visible = false;
            window.videoController.show(true);
            window.videoController.play();
        }

        if (eventName === EventName.EVENT09) {
            this.audioController.setVolume(AudioIndex.BACKGROUND, 0.5);
        }

        if (eventName === EventName.EVENT10) {
            this.audioController.setVolume(AudioIndex.BACKGROUND, 0.01);
            this.audioController.setVolume(AudioIndex.PANORAMIC_IMAGE, 0.5);
            window.model.visible = false;
            window.imageController.show(true);

            const container = window.panoramicVideoInitButton.get();

            container.position.set(-0.3, -1, -2);
            this.camera.add(container);
        }
        if (eventName === EventName.EVENT11) {
            this.audioController.setVolume(AudioIndex.BACKGROUND, 0.5);
            this.audioController.setVolume(AudioIndex.PANORAMIC_IMAGE, 0);
        }

        if (eventName === EventName.EVENT12) {
            this.audioController.setVolume(AudioIndex.BACKGROUND, 0);
            window.panoramicVideoController.show(true);
        }

        if (eventName === EventName.EVENT13) {
            window.model.visible = true;
        }

        this.selectionState = undefined;
        const event = this.events.find(data => data.eventName === eventName);

        if (!event) {
            return;
        }

        if (event.animationIndex !== undefined) {
            this.animationController.play(event.animationIndex, event.animationFinishCallback);
        }

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