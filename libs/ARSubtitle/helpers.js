import * as THREE from "../../libs/three.module.js";

export function canvasMaxHeightWidthPercentageToPixel(cameraProperties) {
    if (!cameraProperties) return;
    let dimension = {maxHeight: 0, maxWidth: 0};
    if (!isNullOrUndefined(cameraProperties.maxHeight)) {
        dimension.maxHeight = window.innerHeight * (parseFloat(cameraProperties.maxHeight) / 100);
    }
    if (!isNullOrUndefined(cameraProperties.maxWidth)) {
        dimension.maxWidth = window.innerWidth * (parseFloat(cameraProperties.maxWidth) / 100);
    }
    return dimension;
}

export function isNullOrUndefined(data) {
    return !!(data && (data !== undefined || data !== null));
}

export function offsetPercentageToPixel(e, t, n) {
    let o = {};
    return !isNullOrUndefined(e.left) || (o.left = (window.innerWidth - n) * (parseFloat(e.left) / 100)),
    !isNullOrUndefined(e.right) || (o.right = (window.innerWidth - n) * (parseFloat(e.right) / 100)),
    !isNullOrUndefined(e.top) || (o.top = (window.innerHeight - t) * (parseFloat(e.top) / 100)),
    !isNullOrUndefined(e.bottom) || (o.bottom = (window.innerHeight - t) * (parseFloat(e.bottom) / 100)),
        o
}

function degreeToRadian(e) {
    return Math.PI * e / 180
}
function radianToDegree(e) {
    return 180 * e / Math.PI
}

export function mapScreenDimensionTo3D(e, t) {
    let {fov: n, aspect: o, near: r} = window.camera
        , i = r + .001
        , a = 2 * i * Math.tan(degreeToRadian(n) / 2)
        , l = o * a
        , s = window.innerWidth / l
        , c = window.innerHeight / a
        , u = t.width / s
        , d = t.height / c
        , m = 0
        , h = 0;
    return !isNullOrUndefined(e.left) ? !isNullOrUndefined(e.right) || (m = l / 2 - e.right / s - u / 2) : m = -l / 2 + e.left / s + u / 2,
        !isNullOrUndefined(e.bottom) ? !isNullOrUndefined(e.top) || (h = a / 2 - e.top / c - d / 2) : h = -a / 2 + e.bottom / c + d / 2,
        {
            scale: new THREE.Vector3(u,d,1),
            position: new THREE.Vector3(m,h,-i)
        }
}
export function straightRect(ctx, x, y, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x, y2);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function disposeMaterial(material) {
    if (material) {

        if (material instanceof Array) {
            material.forEach(mat => {
                disposeMaterial(mat);
            });
            return;
        }

        const texture = material.map;

        if (texture) {
            texture.dispose();
        }

        for (let uniformName in material.uniforms) {
            let uniform = material.uniforms[uniformName];
            if (uniform.value && uniform.value.dispose) {
                uniform.value.dispose();
            }
        }

        material.dispose();
    }
}

export function disposeObject(obj) {
    if (!obj)
        return;

    var children = obj.children;
    var child;

    if (children) {
        let children_count = children.length;
        for (var i = 0; i < children.length; i += 1) {
            child = children[i];

            disposeObject(child);
            children_count--;
        }

        if (children_count === 0)
            obj.children = [];
        else
            return;
    }

    var geometry = obj.geometry;
    var material = obj.material;

    if (geometry && !obj.isSprite) {
        geometry.dispose();
    }

    disposeMaterial(material);
    obj = null;
}

function* range(start, stop, step) {
    if (stop === undefined) {
        stop = start;
        start = 0;
    }

    if (!step) {
        step = 1;
    }

    for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
        yield i;
    }
}

export let generateUUID = function () {

    let _lut = [];

    for (let i of range(0, 256)) {
        _lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
    }

    return function () {
        let d0 = Math.random() * 0xffffffff | 0;
        let d1 = Math.random() * 0xffffffff | 0;
        let d2 = Math.random() * 0xffffffff | 0;
        let d3 = Math.random() * 0xffffffff | 0;
        let uuid = _lut[d0 & 0xff] + _lut[d0 >> 8 & 0xff] + _lut[d0 >> 16 & 0xff] + _lut[d0 >> 24 & 0xff] + '-' +
            _lut[d1 & 0xff] + _lut[d1 >> 8 & 0xff] + '-' + _lut[d1 >> 16 & 0x0f | 0x40] + _lut[d1 >> 24 & 0xff] + '-' +
            _lut[d2 & 0x3f | 0x80] + _lut[d2 >> 8 & 0xff] + '-' + _lut[d2 >> 16 & 0xff] + _lut[d2 >> 24 & 0xff] +
            _lut[d3 & 0xff] + _lut[d3 >> 8 & 0xff] + _lut[d3 >> 16 & 0xff] + _lut[d3 >> 24 & 0xff];

        return uuid.toUpperCase();
    };
}();