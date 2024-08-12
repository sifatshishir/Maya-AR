import * as THREE from '../../../libs/three.module.js';
import Text from "./text.js";
import {canvasMaxHeightWidthPercentageToPixel, straightRect} from "../helpers.js";
import {RenderOrderEnum, TooltipTextMaxline} from "../ARSubtitleLiterals.js";

export default class Canvas extends Text {
    canvasWidth;
    canvasHeight;
    messageCanvas;
    messageCanvasContext;
    transparent;
    maxHeight;
    opacity;

    constructor(properties) {
        super(properties);
        this.canvasWidth = 0;
        this.canvasHeight = 0;
        let dimension = canvasMaxHeightWidthPercentageToPixel(properties.Camera);
        this.maxWidth = dimension?.maxWidth || 0;
        this.maxHeight = dimension?.maxHeight || 0;
        this.messageCanvas = document.createElement('canvas');
        this.messageCanvasContext = this.messageCanvas.getContext('2d');
        this.transparent = properties.transparent || true;
        this.opacity = properties.opacity || 1;
    }

    updateCanvasSize(width, height) {
        this.canvasWidth = width || this.canvasWidth;
        this.canvasHeight = height || this.canvasHeight;
        this.messageCanvas.width = this.canvasWidth;
        this.messageCanvas.height = this.canvasHeight;
    }

    createSubtitleMessage() {
        let newVRMessage = {};
        newVRMessage.object = this.makeTextSprite({
            renderOrder: RenderOrderEnum.VRMessageRO
        });

        return newVRMessage;
    }

    makeTextSprite(parameters = {}) {
        this.updateCanvasText(parameters);
        return this.getSpriteFromCanvas(parameters);
    }

    setCanvasFont() {
        this.messageCanvasContext.font = "Bold " + this.fontSize + "px " + this.fontFace;
    }

    setCanvasBackground() {
        this.messageCanvasContext.fillStyle = "rgba(" + this.backgroundColor.r + "," + this.backgroundColor.g + ","
            + this.backgroundColor.b + "," + this.backgroundColor.a + ")";
    }

    setCanvasBorder() {
        this.messageCanvasContext.strokeStyle = "rgba(" + this.borderColor.r + "," + this.borderColor.g + ","
            + this.borderColor.b + "," + this.borderColor.a + ")";
    }

    setCanvasTextColor() {
        this.messageCanvasContext.fillStyle = "rgba(" + this.textColor.r + "," + this.textColor.g + ","
            + this.textColor.b + "," + this.textColor.a + ")";
    }

    getMaxWidth() {
        return this.maxWidth || .8 * window.innerWidth;
    }


    updateCanvasText() {
        // setting font first time to measure text width and height
        this.setCanvasFont();

        const {texts, totalLines, textWidth, textHeight} = this.computeTextMetrics();

        this.updateCanvasSize(textWidth, textHeight);

        this.setCanvasFont();

        this.setCanvasBackground();

        this.setCanvasBorder();

        this.messageCanvasContext.lineWidth = this.borderThickness;

        straightRect(this.messageCanvasContext, this.borderThickness / 2, this.borderThickness / 2,
            this.messageCanvas.width - this.borderThickness / 2, this.messageCanvas.height - this.borderThickness / 2);


        this.setCanvasTextColor();

        for (let i = 1; i <= totalLines; i++) {
            let startingWidthForThisLine = this.borderThickness;
            if (this.textCenterAlign === true) {
                let thisLineWidth = this.messageCanvasContext.measureText(texts[i - 1]).width;
                startingWidthForThisLine = (textWidth / 2) - (thisLineWidth / 2);
            }
            this.messageCanvasContext.fillText(texts[i - 1], startingWidthForThisLine, this.fontSize * i + this.borderThickness / 2);
        }

    }

    computeTextMetrics() {
        let texts = this.text.split('\n');
        let maxLines = this.getMaxLinesAllowed();
        if (texts.length > maxLines) {
            const lastLineIndex = maxLines - 1;
            texts[lastLineIndex] = texts[lastLineIndex].trim() + '...';

            texts.splice(maxLines);
        }

        let textWidth = 0;

        for (let i = 0; i < texts.length; i++) {
            let metrics = this.messageCanvasContext.measureText(texts[i]);
            if (metrics.width > this.getMaxWidth()) {
                this.adjustTextWidth(texts, i);
            }
            texts[i] = ' ' + texts[i] + ' ';
            metrics = this.messageCanvasContext.measureText(texts[i]);
            textWidth = Math.max(textWidth, metrics.width);
        }
        let totalLines = texts.length;
        let textHeight = (this.fontSize * totalLines * 1.3) + 2 * this.borderThickness;

        textWidth += 2 * this.borderThickness;

        return {
            texts: texts,
            totalLines: totalLines,
            textWidth: textWidth,
            textHeight: textHeight
        };
    }

    calcMaxCharPerLine(text) {
        let avgCharLength = (this.messageCanvasContext.measureText(text)).width / text.length;
        let allowedChar = Math.floor(this.getMaxWidth() / avgCharLength);

        if (allowedChar === text.length || this.fontSize === this.minFontSize) {
            for (let i = allowedChar - 1; i >= 0; i--) {
                if (text[i] === ' ') {
                    allowedChar = i + 1; // Move one position after the space
                    break;
                }
            }

            return allowedChar;
        }

        this.decrementFontSize();
        this.setCanvasFont();
        return this.calcMaxCharPerLine(text);
    }

    getMaxLinesAllowed() {
        if (this.maxHeight) {
            return Math.floor(this.maxHeight / this.fontSize);
        } else {
            return TooltipTextMaxline;
        }
    }


    adjustTextWidth(texts, pos) {
        if (texts.length <= this.getMaxLinesAllowed()) {
            const allowedChar = this.calcMaxCharPerLine(texts[pos]);
            const ellipsisCharLength = 4;

            if (texts.length >= this.getMaxLinesAllowed()) {
                let str = texts[pos].slice(0, allowedChar - ellipsisCharLength);
                if (allowedChar <= 4)
                    str = "";
                str.trim();
                str += "...";
                texts[pos] = str;
            } else {
                let str = texts[pos].slice(0, allowedChar - 1);
                str.trim();
                let resStr = texts[pos].slice(allowedChar - 1, texts[pos].length);
                texts[pos] = str;

                for (let i = texts.length; i > pos + 1; i--)
                    texts[i] = texts[i - 1];

                texts[pos + 1] = resStr;
            }

        }
    }

    getSpriteFromCanvas(parameters) {
        let texture = new THREE.Texture(this.messageCanvas);
        texture.encoding = THREE.sRGBEncoding;
        texture.needsUpdate = true;

        let spriteMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            side: THREE.DoubleSide
        });


        if (this.transparent === true) {
            spriteMaterial.transparent = true;
            spriteMaterial.depthWrite = false;
            spriteMaterial.depthTest = false;
        }
        let spriteGeometry = new THREE.PlaneGeometry(1, 1);

        let sprite = new THREE.Mesh(spriteGeometry, spriteMaterial);
        sprite.isVRMessage = true;
        sprite.scale_width = this.messageCanvas.width;
        sprite.scale_height = this.messageCanvas.height;
        sprite.renderOrder = parameters.renderOrder !== undefined ? parameters.renderOrder : RenderOrderEnum.tooltipRO;
        return sprite;
    }
}
