import background from "./background.js";

export default class Text extends background {
    text;
    fontSize;
    minFontSize;
    textColor;
    fontFace;
    textCenterAlign;

    constructor(properties) {
        super(properties);
        this.text = properties.text;
        this.textColor = Object.assign(
            {r: 255, g: 255, b: 255, a: 1.0},
            properties.textColor
        );
        this.fontFace = properties.fontFamily || 'Helvetica';
        this.textCenterAlign = true;
        this.minFontSize = 32;
        this.fontSize = properties.fontSize || this.minFontSize;
    }

    decrementFontSize() {
        if (this.fontSize <= this.minFontSize) {
            return;
        }
        this.fontSize--;
    }
}