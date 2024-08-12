import ARMessage from "./ARMessage.js";
import {offsetPercentageToPixel, mapScreenDimensionTo3D} from "../helpers.js";

class ARSubtitle extends ARMessage {

    constructor(properties) {
        super(properties);
        this.camera = properties.Camera;
        this.position = {
            xPosition: 0,
            yPosition: -0.7,
            zPosition: -4
        };
    }

    updateScalingAndPosition() {
        let updatedScale;
        if (this.isCameraFix && this.camera) {
            const cameraFixOffsets = offsetPercentageToPixel(this.camera, this.canvasHeight, this.canvasWidth);
            let {position, scale} = mapScreenDimensionTo3D(cameraFixOffsets, {
                height: this.canvasHeight,
                width: this.canvasWidth
            });
            this.position.xPosition = position.x;
            this.position.yPosition = position.y;
            this.position.zPosition = position.z;
            updatedScale = scale;
        } else if (this.configData.Scene?.position) {
            {
                this.position = {
                    xPosition: this.configData.Scene?.position[0],
                    yPosition: this.configData.Scene?.position[1],
                    zPosition: this.configData.Scene?.position[2]
                };
            }
        }

        this.updateScaling(updatedScale);
        this.updatePosition();
    }

    getYPosition() {
        if (this.isCameraFix && this.camera) {
            return this.position.yPosition;
        }

        return this.position.yPosition * getFovScaleFactor();
    }

    updateScaling(scale) {
        if (this.isCameraFix && this.camera) {
            this.message.object.scale.copy(scale);
        } else {
            super.updateScaling();
        }
    }
}

export default ARSubtitle;