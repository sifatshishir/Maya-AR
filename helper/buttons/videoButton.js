import {Button} from './button.js';
import {fontJsonData, loadTexture} from "../helper.js";
import ThreeMeshUI from '../../libs/three-mesh-ui.module.js';
import * as THREE from "../../libs/three.module.js";
import {EventName} from "../../events/eventController.js";

class VideoButton extends Button {
    container;
    buttonContainer;
    button;
    playIcon;
    stopIcon;
    forwardIcon;
    backwardIcon;

    constructor() {
        super();
    }

    get() {
        return this.buttonContainer;
    }

    setState(object) {
        if (object === this.button || object.parent === this.button) {
            this.button.setState(EventName.EVENT08);
        }

        if (object === this.playIcon || object.parent === this.playIcon) {
            this.playIcon.setState(EventName.EVENT08);
        }

        if (object === this.stopIcon || object.parent === this.stopIcon) {
            this.stopIcon.setState(EventName.EVENT08);
        }

        if (object === this.forwardIcon || object.parent === this.forwardIcon) {
            this.forwardIcon.setState(EventName.EVENT08);
        }

        if (object === this.backwardIcon || object.parent === this.backwardIcon) {
            this.backwardIcon.setState(EventName.EVENT08);
        }
    }

    createIcon(texture) {
        return new ThreeMeshUI.Block({
            backgroundTexture: texture,
            width: 0.15,
            height: 0.15,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0.01,
            margin: 0.01,
        });
    }

    setupButtonStates() {
        const selectedAttributes = {
            backgroundColor: new THREE.Color(0xffffff),
            fontColor: new THREE.Color(0x000000)
        };

        this.playIcon.setupState({
            state: 'event08',
            attributes: selectedAttributes,
            onSet: () => window.videoController.play()
        });

        this.stopIcon.setupState({
            state: 'event08',
            attributes: selectedAttributes,
            onSet: () => window.videoController.pause()
        });

        this.backwardIcon.setupState({
            state: 'event08',
            attributes: selectedAttributes,
            onSet: () => window.videoController.backward()
        });

        this.forwardIcon.setupState({
            state: 'event08',
            attributes: selectedAttributes,
            onSet: () => window.videoController.forward()
        });

        this.button.setupState({
            state: 'event08',
            attributes: selectedAttributes,
            onSet: () => {
                window.camera.remove(this.buttonContainer);
                window.videoController.show(false);
                window.videoController.pause();
                window.eventController.play(EventName.EVENT09);
            }
        });
    }

    async create() {
        if (!fontJsonData) {
            await this.loadData();
        }

        const playTexture = await loadTexture('../../resources/mediaPlay.png');
        const stopTexture = await loadTexture('../../resources/mediaStop.png');
        const forwardTexture = await loadTexture('../../resources/mediaForward.png');
        const backwardTexture = await loadTexture('../../resources/mediaBackward.png');

        this.container = new ThreeMeshUI.Block({
            justifyContent: 'center',
            alignItems: 'center',
            contentDirection: 'row',
            flexDirection: 'row',
            fontFamily: 'Roboto',
            fontTexture: 'Roboto',
            fontSize: 0.07,
            padding: 0.01,
            margin: 0.01,
            borderRadius: 0.05,
            backgroundColor: new THREE.Color(0xffffff),
            backgroundOpacity: 0.8,

        });

        this.buttonContainer = new ThreeMeshUI.Block({
            justifyContent: 'center',
            alignItems: 'center',
            contentDirection: 'column',
            flexDirection: 'column',
            fontFamily: 'Roboto',
            fontTexture: 'Roboto',
            fontSize: 0.07,
            padding: 0.01,
            margin: 0.01,
            borderRadius: 0.05,
            backgroundColor: new THREE.Color(0xffffff),
            backgroundOpacity: 0,
            height: 0.2,
            width: 0.9,
        });

        const buttonOptions = {
            width: 0.2,
            height: 0.15,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0.02,
            backgroundColor: new THREE.Color(0xffffff),
            backgroundOpacity: 0.5,
            borderRadius: 0.075,
            fontColor: new THREE.Color(0x000000),
            offset: 0.05,
        };

        this.button = new ThreeMeshUI.Block(buttonOptions);
        this.button.backgroundOpacity = 0.8;
        this.button.borderRadius = 0.03;
        this.button.width = 0.7;

        this.button.add(
            new ThreeMeshUI.Text({content: 'NEXT SCENE'})
        );

        this.playIcon = this.createIcon(playTexture);
        this.stopIcon = this.createIcon(stopTexture);
        this.forwardIcon = this.createIcon(forwardTexture);
        this.backwardIcon = this.createIcon(backwardTexture);

        this.setupButtonStates();

        this.container.add(this.backwardIcon, this.playIcon, this.stopIcon, this.forwardIcon);
        this.buttonContainer.add(this.container, this.button);
        // this.buttonContainer.position.set(0, -0.9, -2);
        // window.camera.add(this.buttonContainer);
    }
}

export {VideoButton};