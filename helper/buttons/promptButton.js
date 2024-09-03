import {Button} from './button.js';
import {fontJsonData} from "../helper.js";
import ThreeMeshUI from '../../libs/three-mesh-ui.module.js';
import * as THREE from "../../libs/three.module.js";
import {EventName} from "../../events/eventController.js";

class PromptButton extends Button {
    buttonContainer;
    buttonYes;
    buttonNo;
    constructor() {
        super();
    }

    get() {
        return this.buttonContainer;
    }

    setState(object) {
        if (object === this.buttonYes || object.parent === this.buttonYes) {
            this.buttonYes.setState(window.eventController.selectionState);
        }
        if (object === this.buttonNo || object.parent === this.buttonNo) {
            this.buttonNo.setState(window.eventController.selectionState);
        }
    }

    async create() {
        if (!fontJsonData) {
            await this.loadData();
        }

        this.buttonContainer = new ThreeMeshUI.Block({
            justifyContent: 'center',
            contentDirection: 'column',
            fontFamily: 'Roboto',
            fontTexture: 'Roboto',
            fontSize: 0.07,
            padding: 0.05,
            borderRadius: 0.11,
            backgroundColor: new THREE.Color(0xffffff),
            backgroundOpacity: 0
        });

        // this.buttonContainer.position.set(-0.3, -0.9, -2);
        // window.camera.add(this.buttonContainer);
        // BUTTONS

        // We start by creating objects containing options that we will use with the two buttons,
        // in order to write less code.

        const buttonOptions = {
            width: 0.5,
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

        this.buttonYes = new ThreeMeshUI.Block(buttonOptions);
        this.buttonNo = new ThreeMeshUI.Block(buttonOptions);

        // Add text to buttons

        this.buttonYes.add(
            new ThreeMeshUI.Text({content: 'JA'})
        );

        this.buttonNo.add(
            new ThreeMeshUI.Text({content: 'NEIN'})
        );

        // Create states for the buttons.
        // In the loop, we will call component.setState( 'state-name' ) when mouse hover or click

        const selectedAttributes = {
            backgroundColor: new THREE.Color(0xffffff),
            fontColor: new THREE.Color(0x000000)
        };

        this.buttonYes.setupState({
            state: 'event02',
            attributes: selectedAttributes,
            onSet: () => {
                window.camera.remove(this.buttonContainer);
                window.eventController.play(EventName.EVENT03);
            }
        });

        //

        this.buttonNo.setupState({
            state: 'event02',
            attributes: selectedAttributes,
            onSet: () => {
                window.camera.remove(this.buttonContainer);
                window.eventController.play(EventName.EVENT04);
            }
        });

        //

        this.buttonContainer.add(this.buttonYes);
        this.buttonContainer.add(this.buttonNo);
    }
}

export {PromptButton};