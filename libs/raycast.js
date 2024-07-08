import * as THREE from "./three.module.js";

export function getFirstObjectWithName(event, window, camera, scene, name) {
    const raycaster = new THREE.Raycaster();
    const getFirstValue = true;

    const mousePointer = getMouseVector2(event, window);
    const intersections = checkRayIntersections(
        mousePointer,
        camera,
        raycaster,
        scene,
        getFirstValue
    );
    const wheelList = getObjectsByName(intersections, name);

    if (typeof wheelList[0] !== "undefined") {
        return wheelList[0];
    }

    return null;
}

export function getMouseVector2(event, window) {
    let mousePointer = new THREE.Vector2();

    mousePointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    return mousePointer;
}

export function checkRayIntersections(mousePointer, camera, raycaster, scene) {
    raycaster.setFromCamera(mousePointer, camera);

    let intersections = raycaster.intersectObjects(scene.children, true);

    return intersections;
}

export function getObjectsByName(objectList, name) {
    const wheelObjects = [];

    objectList.forEach((object) => {
        const objectName = object.object.name || "Unnamed Object";
        objectName.includes(name) ? wheelObjects.push(object.object) : null;
    });

    return wheelObjects;
}
