export default class Background {
    texture;
    backgroundColor;
    borderThickness;
    borderColor;

    constructor(properties) {
        this.texture = properties.backgroundImage || null;
        this.borderThickness = properties.borderThickness || 2;
        this.backgroundColor = Object.assign(
            {r: 0, g: 0, b: 0, a: 0.4},
            properties.backgroundColor
        );

        this.borderColor = Object.assign(
            {r: 0, g: 0, b: 1, a: 0.7},
            properties.borderColor
        );
    }
}