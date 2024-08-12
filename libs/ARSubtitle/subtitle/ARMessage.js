import Canvas from "./canvas.js";
import {MAX_SIGNED_INT_32, tooltip_default_scale} from "../ARSubtitleLiterals.js"
import {disposeObject, generateUUID} from "../helpers.js";

class ARMessage extends Canvas {
    configData;
    duration;
    message;
    position;
    quaternion;
    scaleMultiplier;
    messageId;
    isCameraFix;
    parent;
    spacing;

    constructor(properties) {
        super(properties);
        this.configData = properties;
        this.duration = Math.min(properties.duration || 5000, MAX_SIGNED_INT_32);
        this.message = this.createSubtitleMessage();
        this.messageId = generateUUID();
        this.parent = properties.parent || window.camera;
        this.position = {};
        this.quaternion = properties.Scene?.quaternion?.map(parseFloat) || [];
        this.scaleMultiplier = properties.Scene?.scaleMultiplier || properties.scaleMultiplier || 1.0;
        this.spacing = properties.spacing;
        this.isCameraFix = true;
    }

    setPosition(position) {
        this.setParentObject(window.camera);
        this.updateScalingAndPosition(position);
    }

    updateScalingAndPosition(position) {
        this.position = {
            xPosition: position.xPosition,
            yPosition: position.yPosition,
            zPosition: position.zPosition
        };
        this.updateScaling();
        this.updatePosition();
    }

    updateScaling() {
        let factor = this.message.object.scale_width / tooltip_default_scale;
        this.message.object.scaleFactor = factor;
        const fovScaleFactor = 1;
        this.scaleMultiplier = 1.0;

        this.message.object.scale.set(
            factor * this.scaleMultiplier * fovScaleFactor,
            (factor * this.scaleMultiplier * this.message.object.scale_height * fovScaleFactor) / this.message.object.scale_width,
            this.scaleMultiplier
        );
    }

    setDuration(duration) {
        this.duration = duration;
    }

    updatePosition() {
        this.message.object.position.set(this.position.xPosition, this.getYPosition(), this.position.zPosition);
    }

    getYPosition() {
        return this.position.yPosition * 1;
    }

    getMessageHeight() {
        const dimension3DFactor = 200;
        return this.canvasHeight / dimension3DFactor;
    }

    show() {
        this.fadeIn();
    }

    updatePositionY() {
        const initialY = this.message.object.position.y;
        const targetY = this.getYPosition();
        const animationDuration = 500;

        new TWEEN.Tween({y: initialY})
            .to({y: targetY}, animationDuration)
            .onUpdate(({y}) => {
                this.message.object.position.set(this.position.xPosition, y, this.position.zPosition);
            })
            .start();
    }

    fadeOut() {
        const material = this.message.object.material;
        material.transparent = true;
        new TWEEN.Tween(material)
            .to({opacity: 0}, 500)
            .onComplete(() => {
                alert('done');
            })
            .start();
    }

    fadeIn() {
        this.parent.add(this.message.object);
        const material = this.message.object.material;
        material.transparent = true;

        new TWEEN.Tween(material)
            .to({opacity: this.opacity}, 300)
            .start();
    }

    removeParent() {
        this.parent.remove(this.message.object);
    }

    setParentObject(parent) {
        this.parent = parent;
    }

    disposeMessage() {
        //this.fadeOut();
        this.removeParent();
        disposeObject(this.message.object);
    }
}

export default ARMessage;