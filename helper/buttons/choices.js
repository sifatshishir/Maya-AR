import {Button} from './button.js';
import {fontJsonData} from "../helper.js";
import ThreeMeshUI from '../../libs/three-mesh-ui.module.js';
import * as THREE from "../../libs/three.module.js";
import {EventName} from "../../events/eventController.js";

class Choices extends Button {
    buttonContainer;
    choice1;
    choice2;
    choice3;
    choice4;
    choice5;
    videoButton;

    constructor() {
        super();
    }

    get() {
        return this.buttonContainer;
    }

    setState(object) {
        if (object === this.choice1 || object.parent === this.choice1) {
            this.choice1.setState(EventName.EVENT11);
        }

        if (object === this.choice2 || object.parent === this.choice2) {
            this.choice2.setState(EventName.EVENT11);
        }

        if (object === this.choice3 || object.parent === this.choice3) {
            this.choice3.setState(EventName.EVENT11);
        }

        if (object === this.choice4 || object.parent === this.choice4) {
            this.choice4.setState(EventName.EVENT11);
        }

        if (object === this.choice5 || object.parent === this.choice5) {
            this.choice5.setState(EventName.EVENT11);
        }

        if (object === this.videoButton || object.parent === this.videoButton) {
            this.videoButton.setState(EventName.EVENT11);
        }
    }

    chooser(data) {

    }

    setupButtonStates() {
        const selectedAttributes = {
            backgroundColor: new THREE.Color(0xffffff),
            fontColor: new THREE.Color(0x000000)
        };

        this.choice1.setupState({
            state: EventName.EVENT11,
            attributes: selectedAttributes,
            onSet: () => {
                window.camera.remove(this.buttonContainer);
                this.chooser('choice1');
                window.eventController.play(EventName.EVENT13);
            }
        });

        this.choice2.setupState({
            state: EventName.EVENT11,
            attributes: selectedAttributes,
            onSet: () => {
                window.camera.remove(this.buttonContainer);
                this.chooser('choice1');
                window.eventController.play(EventName.EVENT13);
            }
        });

        this.choice3.setupState({
            state: EventName.EVENT11,
            attributes: selectedAttributes,
            onSet: () => {
                window.camera.remove(this.buttonContainer);
                this.chooser('choice1');
                window.eventController.play(EventName.EVENT13);
            }
        });

        this.choice4.setupState({
            state: EventName.EVENT11,
            attributes: selectedAttributes,
            onSet: () => {
                window.camera.remove(this.buttonContainer);
                this.chooser('choice1');
                window.eventController.play(EventName.EVENT13);
            }
        });

        this.choice5.setupState({
            state: EventName.EVENT11,
            attributes: selectedAttributes,
            onSet: () => {
                window.camera.remove(this.buttonContainer);
                this.chooser('choice1');
                window.eventController.play(EventName.EVENT13);
            }
        });

        this.videoButton.setupState({
            state: EventName.EVENT11,
            attributes: {
                backgroundColor: new THREE.Color(0xADD8E6),
                fontColor: new THREE.Color(0x000000)
            },
            onSet: () => {
                window.camera.remove(this.buttonContainer);
                this.chooser('choice1');
                window.eventController.play(EventName.EVENT12);
            }
        });
    }

    async create() {
        if (!fontJsonData) {
            await this.loadData();
        }

        this.buttonContainer = new ThreeMeshUI.Block({
            justifyContent: 'center',
            alignItems: 'center',
            contentDirection: 'column',
            flexDirection: 'column',
            fontFamily: 'Roboto',
            fontTexture: 'Roboto',
            fontSize: 0.04,
            padding: 0.01,
            margin: 0.01,
            borderRadius: 0.05,
            backgroundColor: new THREE.Color(0xffffff),
            backgroundOpacity: 0,
            height: 0.2,
            width: 0.9,
        });

        const buttonOptions = {
            width: 1,
            height: 0.25,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0.02,
            backgroundColor: new THREE.Color(0xffffff),
            backgroundOpacity: 0.5,
            borderRadius: 0.075,
            fontColor: new THREE.Color(0x000000),
            offset: 0.05,
        };

        this.choice1 = new ThreeMeshUI.Block(buttonOptions);
        this.choice2 = new ThreeMeshUI.Block(buttonOptions);
        this.choice3 = new ThreeMeshUI.Block(buttonOptions);
        this.choice4 = new ThreeMeshUI.Block(buttonOptions);
        this.choice5 = new ThreeMeshUI.Block(buttonOptions);
        this.videoButton = new ThreeMeshUI.Block(buttonOptions);
        this.videoButton.backgroundColor = new THREE.Color(0xADD8E6);

        this.choice1.add(
            new ThreeMeshUI.Text({content: 'schmutziger Boden und unhygienischer Arbeitsplatz'})
        );

        this.choice2.add(
            new ThreeMeshUI.Text({content: 'Schreie an die Arbeiter'})
        );

        this.choice3.add(
            new ThreeMeshUI.Text({content: 'Neun bis elf Stunden Arbeit mit nur einer Stunde Hauptpause und ohne periodische Kurzpausen'})
        );

        this.choice4.add(
            new ThreeMeshUI.Text({content: 'Arbeiten mit falscher Haltung und ohne Maske'})
        );

        this.choice5.add(
            new ThreeMeshUI.Text({content: 'alle oben genannten Punkte'})
        );

        this.videoButton.add(
            new ThreeMeshUI.Text({content: ' Ein echtes Video einer Bekleidungsfabrik in Bangladesch.'})
        );

        this.setupButtonStates();

        this.buttonContainer.add(this.choice1, this.choice2, this.choice3, this.choice4, this.choice5);
        // this.choice3ontainer.position.set(0, -0.9, -2);
        // window.camera.add(this.choice3ontainer);
    }
}

export {Choices};