import {Button} from './button.js';
import {fontJsonData, loadTexture} from "../helper.js";
import ThreeMeshUI from '../../libs/three-mesh-ui.module.js';
import * as THREE from "../../libs/three.module.js";
import {EventName} from "../../events/eventController.js";

class VideoInitButton extends Button {
    buttonContainer;
    button;
    icon;

    constructor() {
        super();
    }

    get() {
        return this.buttonContainer;
    }

    setState(object) {
        if (object === this.button || object.parent === this.button) {
            this.button.setState(eventController.selectionState);
        }

        if (object === this.icon || object.parent === this.icon) {
            this.icon.setState(eventController.selectionState);
        }
    }

    async create() {
        if (!fontJsonData) {
            await this.loadData();
        }
        const texture = await loadTexture('../../resources/mediaPlayer.png');

        this.buttonContainer = new ThreeMeshUI.Block({
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
            height: 0.2,
            width: 0.9,
        });

        this.icon = new ThreeMeshUI.Block({
            backgroundTexture: texture,
            width: 0.15,
            height: 0.15,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0.01,
            margin: 0.01,
        });

        this.icon.position.set(0, -0.9, -2);
        const buttonOptions = {
            width: 0.7,
            height: 0.15,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0.01,
            padding: 0.01,
            backgroundColor: new THREE.Color(0xffffff),
            backgroundOpacity: 0,
            borderRadius: 0.01,
            fontColor: new THREE.Color(0x000000),
        };

        this.button = new ThreeMeshUI.Block(buttonOptions);

        // Add text to buttons

        this.button.add(
            new ThreeMeshUI.Text({content: 'WEITER ZUM VIDEO'})
        );

        const selectedAttributes = {
            backgroundColor: new THREE.Color(0xffffff),
            fontColor: new THREE.Color(0x000000)
        };

        this.button.setupState({
            state: 'event06',
            attributes: selectedAttributes,
            onSet: () => {
                window.camera.remove(this.buttonContainer);
                window.eventController.play(EventName.EVENT07);
            }
        });

        this.icon.setupState({
            state: 'event06',
            attributes: selectedAttributes,
            onSet: () => {
                window.camera.remove(this.buttonContainer);
                window.eventController.play(EventName.EVENT07);
            }
        });

        this.buttonContainer.add(this.button, this.icon);

        // this.buttonContainer.position.set(0, -0.9, -2);
        // window.camera.add(this.buttonContainer);
    }
}

export {VideoInitButton};