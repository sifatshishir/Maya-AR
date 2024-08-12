import * as THREE from "../libs/three.module.js";

export let fontJsonData = undefined;
export async function loadJsonData() {
    await $.ajax({
        url: './resources/Roboto-msdf.json',
        dataType: 'json',
        success: function (data) {
            fontJsonData = data;
        }.bind(this),
        statusCode: {
            404: function () {
                console.log("Failed to load font json from assets!")
            }
        }
    });
}

export function loadTexture(path) {
    return new Promise((resolve, reject) => {

        let loader_t = new THREE.TextureLoader();

        loader_t.load(
            // resource URL
            path,
            // Function when resource is loaded
            function (texture) {
                resolve(texture);
            },
            // Function called when download progresses
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            // Function called when download errors
            function (xhr) {
                console.log('An error happened');
                reject();
            }
        );
    })
}