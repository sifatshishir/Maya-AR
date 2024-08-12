import {loadJsonData, loadTexture, fontJsonData} from "../helper.js";
import ThreeMeshUI from '../../libs/three-mesh-ui.module.js';

class Button {
    constructor() {

    }

    async loadData() {
        await loadJsonData();
        const tex = await loadTexture('../../resources/Roboto-msdf.png');

        ThreeMeshUI.FontLibrary.addFont('Roboto', fontJsonData, tex);
    }
}

export {Button};