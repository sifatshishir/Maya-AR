import {Button} from './button.js';
import {fontJsonData} from "../helper.js";
import ThreeMeshUI from '../../libs/three-mesh-ui.module.js';
import * as THREE from "../../libs/three.module.js";
import {EventName} from "../../events/eventController.js";

const DressTypeEnum = {
    SALWAR_KAMIJ: 'maya_dress_01_salwar_kameez',
    SHIRT_PANT: 'maya_dress_02_western_dress',
    WESTERN: 'maya_dress_03_western_dress'
};

class DressButton extends Button {
    buttonContainer;
    dress1;
    dress2;
    dress3;
    constructor(){
        super();
    }

    get() {
        return this.buttonContainer;
    }

    setState(object) {
        if (object === this.dress1 || object.parent === this.dress1) {
            this.dress1.setState(eventController.selectionState);
        }

        if (object === this.dress2 || object.parent === this.dress2) {
            this.dress2.setState(eventController.selectionState);
        }

        if (object === this.dress3 || object.parent === this.dress3) {
            this.dress3.setState(eventController.selectionState);
        }
    }

    updateDress(type) {
        window.model.children.forEach(child => {
            if (child.name === DressTypeEnum.SALWAR_KAMIJ
                || child.name === DressTypeEnum.SHIRT_PANT
                || child.name === DressTypeEnum.WESTERN) {
                child.visible = false;
            }
        });

        window.model.children.forEach(child => {
            if (child.name === type) {
                child.visible = true;
            }
        });
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

        this.dress1 = new ThreeMeshUI.Block(buttonOptions);
        this.dress2 = new ThreeMeshUI.Block(buttonOptions);
        this.dress3 = new ThreeMeshUI.Block(buttonOptions);

        // Add text to buttons

        this.dress1.add(
            new ThreeMeshUI.Text({content: 'Salwar Kamiz'})
        );

        this.dress2.add(
            new ThreeMeshUI.Text({content: 'Shirt Pant'})
        );

        this.dress3.add(
            new ThreeMeshUI.Text({content: 'Western New'})
        );

        const selectedAttributes = {
            backgroundColor: new THREE.Color(0xffffff),
            fontColor: new THREE.Color(0x000000)
        };

        this.dress1.setupState({
            state: 'event05',
            attributes: selectedAttributes,
            onSet: () => {
                window.camera.remove(this.buttonContainer);
                this.updateDress(DressTypeEnum.SALWAR_KAMIJ);
                //window.eventController.play(EventName.EVENT05);
            }
        });

        this.dress2.setupState({
            state: 'event05',
            attributes: selectedAttributes,
            onSet: () => {
                window.camera.remove(this.buttonContainer);
                this.updateDress(DressTypeEnum.SHIRT_PANT);
                //window.eventController.play(EventName.EVENT05);
            }
        });

        this.dress3.setupState({
            state: 'event05',
            attributes: selectedAttributes,
            onSet: () => {
                window.camera.remove(this.buttonContainer);
                this.updateDress(DressTypeEnum.WESTERN);
                window.eventController.play(EventName.EVENT06);
            }
        });

        this.buttonContainer.add(this.dress1);
        this.buttonContainer.add(this.dress2);
        this.buttonContainer.add(this.dress3);

        //this.buttonContainer.position.set(0.4, -0.9, -2);
    }
}

export {DressButton, DressTypeEnum};