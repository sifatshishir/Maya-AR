import {Button} from './button.js';
import {fontJsonData} from "../helper.js";
import ThreeMeshUI from '../../libs/three-mesh-ui.module.js';
import * as THREE from "../../libs/three.module.js";
import {EventName} from "../../events/eventController.js";

class PanoramicVideoInit extends Button {
    buttonContainer;
    button;
    constructor() {
        super();
    }

    get() {
        return this.buttonContainer;
    }

    setState(object) {
        if (object === this.button || object.parent === this.button) {
            this.button.setState(EventName.EVENT10);
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

        const buttonOptions = {
            width: 0.7,
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

        this.button.add(
            new ThreeMeshUI.Text({content: 'mach einen unterschied'})
        );

        const selectedAttributes = {
            backgroundColor: new THREE.Color(0xffffff),
            fontColor: new THREE.Color(0x000000)
        };

        this.button.setupState({
            state: 'event10',
            attributes: selectedAttributes,
            onSet: () => {
                window.camera.remove(this.buttonContainer);
                window.camera.remove(window.imageButton.get());
                window.imageController.show(false);
                window.eventController.play(EventName.EVENT11);
            }
        });

        this.buttonContainer.add(this.button);
    }
}

export {PanoramicVideoInit};