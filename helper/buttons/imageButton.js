import {Button} from './button.js';
import {fontJsonData} from "../helper.js";
import ThreeMeshUI from '../../libs/three-mesh-ui.module.js';
import * as THREE from "../../libs/three.module.js";
import {EventName} from "../../events/eventController.js";
import {VrMessagePriorityEnum} from "../../libs/ARSubtitle/ARSubtitleLiterals.js";

class ImageButton extends Button {
    buttonContainer;
    buttonA;
    buttonB;
    buttonC;
    buttonD;
    onProcess;

    constructor() {
        super();
        this.onProcess = false;
    }

    get() {
        return this.buttonContainer;
    }

    setState(object) {
        if (object === this.buttonA || object.parent === this.buttonA) {
            this.buttonA.setState(EventName.EVENT10);
        }

        if (object === this.buttonB || object.parent === this.buttonB) {
            this.buttonB.setState(EventName.EVENT10);
        }

        if (object === this.buttonC || object.parent === this.buttonC) {
            this.buttonC.setState(EventName.EVENT10);
        }

        if (object === this.buttonD || object.parent === this.buttonD) {
            this.buttonD.setState(EventName.EVENT10);
        }
    }

    setupButtonStates() {
        const selectedAttributes = {
            backgroundColor: new THREE.Color(0xffffff),
            fontColor: new THREE.Color(0x000000)
        };

        this.buttonA.setupState({
            state: 'event10',
            attributes: selectedAttributes,
            onSet: async () => {
                if (this.onProcess === true) {
                    return;
                } else {
                    this.onProcess = true;
                }
                const data = [
                    {
                        text: 'Neuen bis elf Stunden Arbeit mit nur 1 Stunde Pause und ohne',
                        duration: 2000
                    },
                    {
                        text: 'periodische kurze Pause erhöhen das Risiko von Müdigkeit,',
                        duration: 2000
                    },
                    {
                        text: 'Kopfschmerzen, Fieber Taubheitsgefühl,',
                        duration: 2000
                    },
                    {
                        text: 'Rückenschmerzen und',
                        duration: 2000
                    },
                    {
                        text: 'Handgelenksschmerzen',
                        duration: 2000
                    }
                ];

                for (let i = 0; i < data.length; i++) {
                    const duration = data[i].duration;
                    window.eventController.arSubtitleController.addARMessage({
                        text: data[i].text,
                        priority: VrMessagePriorityEnum.HIGHPRIORITYINFO,
                        duration: duration
                    });

                    await new Promise(r => setTimeout(r, duration));

                    window.eventController.arSubtitleController.removeMessage(window.eventController.arSubtitleController.messages[0]);
                }

                this.onProcess = false;
            }
        });

        this.buttonB.setupState({
            state: 'event10',
            attributes: selectedAttributes,
            onSet: async () => {
                if (this.onProcess === true) {
                    return;
                } else {
                    this.onProcess = true;
                }
                const data = [
                    {
                        text: 'Schreien demotiviert die Frauen,',
                        duration: 2000
                    },
                    {
                        text: 'während sie arbeiten',
                        duration: 1000
                    }
                ];

                for (let i = 0; i < data.length; i++) {
                    const duration = data[i].duration;
                    window.eventController.arSubtitleController.addARMessage({
                        text: data[i].text,
                        priority: VrMessagePriorityEnum.HIGHPRIORITYINFO,
                        duration: duration
                    });

                    await new Promise(r => setTimeout(r, duration));

                    window.eventController.arSubtitleController.removeMessage(window.eventController.arSubtitleController.messages[0]);
                }

                this.onProcess = false;
            }
        });

        this.buttonC.setupState({
            state: 'event10',
            attributes: selectedAttributes,
            onSet: async () => {
                if (this.onProcess === true) {
                    return;
                } else {
                    this.onProcess = true;
                }
                const data = [
                    {
                        text: 'Die Arbeit mit falscher Haltung, Schweres Heben und sich ständig',
                        duration: 2000
                    },
                    {
                        text: 'wiederholenden Handlungen verursacht Schmerzen an',
                        duration: 2000
                    },
                    {
                        text: 'verschiedenen Stellen des Körpers',
                        duration: 2000
                    }
                ];

                for (let i = 0; i < data.length; i++) {
                    const duration = data[i].duration;
                    window.eventController.arSubtitleController.addARMessage({
                        text: data[i].text,
                        priority: VrMessagePriorityEnum.HIGHPRIORITYINFO,
                        duration: duration
                    });

                    await new Promise(r => setTimeout(r, duration));

                    window.eventController.arSubtitleController.removeMessage(window.eventController.arSubtitleController.messages[0]);
                }

                this.onProcess = false;
            }
        });

        this.buttonD.setupState({
            state: 'event10',
            attributes: selectedAttributes,
            onSet: async () => {
                if (this.onProcess === true) {
                    return;
                } else {
                    this.onProcess = true;
                }
                const data = [
                    {
                        text: 'Schmutz vom Boden und Flusen vom Nähen',
                        duration: 2000
                    },
                    {
                        text: 'verursachen',
                        duration: 2000
                    },
                    {
                        text: 'Atemwegsprobleme.',
                        duration: 2000
                    }
                ];

                for (let i = 0; i < data.length; i++) {
                    const duration = data[i].duration;
                    window.eventController.arSubtitleController.addARMessage({
                        text: data[i].text,
                        priority: VrMessagePriorityEnum.HIGHPRIORITYINFO,
                        duration: duration
                    });

                    await new Promise(r => setTimeout(r, duration));

                    window.eventController.arSubtitleController.removeMessage(window.eventController.arSubtitleController.messages[0]);
                }

                this.onProcess = false;
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

        this.buttonA = new ThreeMeshUI.Block(buttonOptions);
        this.buttonB = new ThreeMeshUI.Block(buttonOptions);
        this.buttonC = new ThreeMeshUI.Block(buttonOptions);
        this.buttonD = new ThreeMeshUI.Block(buttonOptions);

        this.buttonA.add(
            new ThreeMeshUI.Text({content: 'A'})
        );

        this.buttonB.add(
            new ThreeMeshUI.Text({content: 'B'})
        );

        this.buttonC.add(
            new ThreeMeshUI.Text({content: 'C'})
        );

        this.buttonD.add(
            new ThreeMeshUI.Text({content: 'D'})
        );

        this.setupButtonStates();

        this.buttonContainer.add(this.buttonA, this.buttonB, this.buttonC, this.buttonD);
        // this.buttonContainer.position.set(0, -0.9, -2);
        // window.camera.add(this.buttonContainer);
    }
}

export {ImageButton};