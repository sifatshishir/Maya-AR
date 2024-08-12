import {Button} from './button.js';
import {fontJsonData} from "../helper.js";
import ThreeMeshUI from '../../libs/three-mesh-ui.module.js';
import * as THREE from "../../libs/three.module.js";
import {EventName} from "../../events/eventController.js";

class VideoButton extends Button {
    buttonContainer;
    buttonPlay;
    buttonStop;
    buttonBackward;
    buttonForward;
    constructor(){
        super();
    }

    get() {
        return this.buttonContainer;
    }

    setState(object) {

    }

    async create() {
        if (!fontJsonData) {
            await this.loadData();
        }

        this.buttonContainer = new ThreeMeshUI.Block({
            justifyContent: 'center',
            contentDirection: 'row',
            fontFamily: 'Roboto',
            fontTexture: 'Roboto',
            fontSize: 0.07,
            padding: 0.05,
            borderRadius: 0.11,
            backgroundColor: new THREE.Color(0xffffff),
            backgroundOpacity: 0
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


        this.buttonPlay = new ThreeMeshUI.Block(buttonOptions);
        this.buttonStop = new ThreeMeshUI.Block(buttonOptions);
        this.buttonBackward = new ThreeMeshUI.Block(buttonOptions);
        this.buttonForward = new ThreeMeshUI.Block(buttonOptions);

        // Add text to buttons

        this.buttonPlay.add(
            new ThreeMeshUI.Text({content: 'P'})
        );

        this.buttonStop.add(
            new ThreeMeshUI.Text({content: 'S'})
        );

        this.buttonBackward.add(
            new ThreeMeshUI.Text({content: 'B'})
        );

        this.buttonForward.add(
            new ThreeMeshUI.Text({content: 'F'})
        );


        const selectedAttributes = {
            backgroundColor: new THREE.Color(0xffffff),
            fontColor: new THREE.Color(0x000000)
        };

        this.buttonContainer.add(this.buttonBackward);
        this.buttonContainer.add(this.buttonPlay);
        this.buttonContainer.add(this.buttonForward);
        this.buttonContainer.add(this.buttonStop);

        // this.buttonContainer.position.set(0, -0.9, -2);
        // window.camera.add(this.buttonContainer);
    }
}

export {VideoButton};