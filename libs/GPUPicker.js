const NO_PICK = {};

const GPUPicker = new class {
    DEFAULT_SIZE = 15;

    flags = {
        pickTooltip: false
    };

    _renderer = new THREE.WebGLRenderer({});

    _currentRenderList = {};

    _renderTarget = new THREE.WebGLRenderTarget(1, 1, {
        minFilter: THREE.LinearFilter,
        stencilBuffer: false,
        depthBuffer: true,
        type: THREE.FloatType,
        encoding: THREE.sRGBEncoding
    });

    _scene = VR.scene;
    _camera = iq3Camera.camera;

    _size = 0;

    _objectIDMap = {};
    _pickingMaterialTemplates = [];

    constructor() {
        this._renderer.outputEncoding = THREE.sRGBEncoding;
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._renderer.toneMapping = THREE.LinearToneMapping;
        this._renderer.sortObjects = false;
        this._renderer.autoClear = false;
        this._renderer.setClearColor(0x000000);
        this._renderer.setClearAlpha(0);

        this._renderer.setRenderTarget(this._renderTarget);

        this._renderer.initPerpetualRenderAfter(this._scene, this._camera);

        this._currentRenderList = this._renderer.renderLists.get(this._scene, 0);

        this.setSize(this.DEFAULT_SIZE);
    }

    setSize(dim) {
        if (this._size === dim) return;

        this._size = dim;

        this._renderTarget.setSize(dim, dim);
        this._renderer.setSize(dim, dim);
        this._renderer.setRenderTarget(this._renderTarget);
    }

    isValidID(id) {
        return this._objectIDMap.hasOwnProperty(id) || id >= wv.numberOfReservedMeshIDForPicking;
    }

    getObjectFromID(id) {
        if (id >= wv.numberOfReservedMeshIDForPicking) {
            let volumeName = getMeshNameFromID(id);
            let modelName = getModelNameFromVolumeName(volumeName);
            return getModelObject(modelName);
        } else {
            return this._objectIDMap[id];
        }
    }

    updateObjectGeometry(object) {
        this._renderer.projectObject(object, this._camera, 0, this._renderer.sortObjects);
    }

    pickEverything(coords, camera = iq3Camera.getCamera(), blacklist = []) {
        try {
            let x = coords.clientX || coords.x;
            let y = coords.clientY || coords.y;

            x *= (camera.initialPixelRatio || 1);
            y *= (camera.initialPixelRatio || 1);

            this.clearRenderer();
            this.prepareCamera(camera, x, y);
            this.renderScene(blacklist);
            this.resetCamera();

            return this.pickOnCoords(x, y);

        } catch (e) {
            console.error(e);
            this.resetCamera();
            return NO_PICK;
        }
    }

    clearRenderer() {
        this._renderer.clear();
        this._currentRenderList.init();
    }

    prepareCamera(camera, x, y) {
        let domWidth = iq3Renderer.canvas.width;
        let domHeight = iq3Renderer.canvas.height;

        this._camera = camera;

        this._camera.setViewOffset(domWidth, domHeight, x - Math.ceil(this._size / 2) + 1, y - Math.ceil(this._size / 2) + 1, this._size, this._size);
        this._renderer.updateCameraState(this._camera);
    }

    resetCamera() {
        this._camera.clearViewOffset();
    }

    renderScene(blacklist) {
        this._renderer.projectObject(VR.scene, this._camera, 0, this._renderer.sortObjects);

        let items = [...this._currentRenderList.opaque, ...this._currentRenderList.transparent];
        items.sort((item1, item2) => item1.renderOrder - item2.renderOrder);

        for (let item of items) {
            let object = item.object;

            if (Array.isArray(blacklist) ? blacklist.includes(object) : blacklist(object) === false) {
                continue;
            }

            //TODO object.isMenu is temporary, it's currently being directly raycast. It should come from here
            if (!object.parent ||
                object.isUserTooltip ||
                object.isMousePointer ||
                object.isMenu ||
                (!this.flags.pickTooltip && object.isTooltip) ||
                item.material.colorWrite === false ||
                object.is360Content ||
                object.isVRMessage
            ) {
                continue;
            }

            let geometry = item.geometry;
            let material = this.getPickingMaterial(item);

            if (material) {
                this._renderer.renderObject(object, this._scene, this._camera, geometry, material, null);
            }
        }

        this._renderer.info.render.frame++;
    }

    getObjectIndex(buffer) {
        let spiralArray = getSpiralOutwardsArrayFromCenter(this._size);

        let minDistance = Infinity;
        let minIndex = -1;

        for (let i = 0; i < spiralArray.length; i++) {
            let index = spiralArray[i] * 4;
            let id = Math.round(buffer[index + 3]);

            if (this.isValidID(id)) {
                if (wv.proximalPickingEnabled || (pointCloudController.config.cameraProximityPicking && this.getObjectFromID(id).isPointCloudModel)) {
                    let point = new THREE.Vector3(
                        buffer[index],
                        buffer[index + 1],
                        buffer[index + 2]
                    );

                    let distance = getWorldPositionThreeJS(this._camera).distanceTo(point);

                    if (distance < minDistance) {
                        minDistance = distance;
                        minIndex = spiralArray[i];
                    }
                } else {
                    return spiralArray[i];
                }
            }
        }

        return minIndex;
    }

    pickOnCoords(x, y) {
        let pixelBuffer = new Float32Array(4 * this._size * this._size);
        this._renderer.readRenderTargetPixels(this._renderTarget, 0, 0, this._size, this._size, pixelBuffer);

        let index = this.getObjectIndex(pixelBuffer);

        if (index === -1) {
            return NO_PICK;
        }

        let id = Math.round(pixelBuffer[index * 4 + 3]);
        let object = this.getObjectFromID(id);
        let point = new THREE.Vector3(
            pixelBuffer[index * 4],
            pixelBuffer[index * 4 + 1],
            pixelBuffer[index * 4 + 2]
        );

        let coords = new THREE.Vector2(
            ((x / (this._camera.initialPixelRatio || 1)) / window.innerWidth) * 2 - 1,
            -((y / (this._camera.initialPixelRatio || 1)) / window.innerHeight) * 2 + 1,
        );

        let arrayPos = [index % this._size, Math.floor(index / this._size)];
        arrayPos[0] = (arrayPos[0] - Math.floor(this._size / 2)) / this._size;
        arrayPos[1] = (arrayPos[1] - Math.floor(this._size / 2)) / this._size;

        coords.x += arrayPos[0];
        coords.y += arrayPos[1];

        let raycastData = object.getPickingData(id, coords);

        if (raycastData.distance === Infinity) {
            raycastData.distance = getWorldPositionThreeJS(this._camera).distanceTo(point);
        }

        if (this._camera.isOrthographicCamera) {
            let planeDir = getWorldDirectionThreeJS(this._camera);
            raycastData.distance = Math.abs(point.dot(planeDir) - getWorldPositionThreeJS(this._camera).dot(planeDir));
        }

        return {
            ...raycastData,
            id: id,
            point: point,
            object: object,
            coords: coords.clone(),
        };
    }

    getPickingMaterial(item) {
        let object = item.object;

        let id = object.id;
        let material = item.material;
        let geometry = item.geometry;

        if (object.material instanceof Potree.PointCloudMaterial) {
            let parent = object;
            while (!parent.isPointCloudModel) parent = parent.parent;
            id = parent.id;
            this._objectIDMap[id] = parent;
        } else {
            this._objectIDMap[id] = object;
        }

        let useMorphing = 0;

        if (material.morphTargets === true) {
            if (geometry.isBufferGeometry === true) {
                useMorphing =
                    geometry.morphAttributes && geometry.morphAttributes.position && geometry.morphAttributes.position.length > 0
                        ? 1
                        : 0;
            } else if (geometry.isGeometry === true) {
                useMorphing = geometry.morphTargets && geometry.morphTargets.length > 0 ? 1 : 0;
            }
        }

        let useSkinning = 0;
        if (object.isSkinnedMesh === true) {
            if (material.skinning === true) {
                useSkinning = 1;
            } else {
                console.warn('THREE.SkinnedMesh with material.skinning set to false:', object);
            }
        }

        let useInstancing = object.isInstancedMesh === true ? 1 : 0;
        let frontSide = material.side === THREE.FrontSide ? 1 : 0;
        let backSide = material.side === THREE.BackSide ? 1 : 0;
        let doubleSide = material.side === THREE.DoubleSide ? 1 : 0;
        let depthTest = material.depthTest ? 1 : 0;
        let depthWrite = material.depthWrite ? 1 : 0;
        let isCADModel = object.isCADModel ? 1 : 0;
        let isPointCloudModel = (material instanceof Potree.PointCloudMaterial) ? 1 : 0;
        let isSpriteMaterial = material.isSpriteMaterial ? 1 : 0;
        let index =
            (useMorphing << 0) |
            (useSkinning << 1) |
            (useInstancing << 2) |
            (frontSide << 3) |
            (backSide << 4) |
            (doubleSide << 5) |
            (depthTest << 6) |
            (depthWrite << 7) |
            (isCADModel << 8) |
            (isPointCloudModel << 9) |
            (isSpriteMaterial << 9);
        let renderMaterial = item.object.pickingMaterial ? item.object.pickingMaterial : this._pickingMaterialTemplates[index];
        if (!renderMaterial) {
            if (isPointCloudModel) {
                renderMaterial = new THREE.ShaderMaterial({
                    uniforms: {
                        id: {value: -1},
                        spacing: {type: "f", value: 1.0},
                        fov: {type: "f", value: 1.0},
                        screenHeight: {type: "f", value: 1.0},
                        size: {type: "f", value: 10},
                        minSize: {type: "f", value: 2},
                        maxSize: {type: "f", value: 2},
                        octreeSize: {type: "f", value: 0},
                        bbSize: {type: "fv", value: [0, 0, 0]},
                        visibleNodes: {
                            type: "t",
                            value: material.uniforms.visibleNodes.value
                        }
                        /* **Notes**
                        // added the texture inside visibleNodes to sync with the potree loader
                        // need to be careful while disposing texture
                        */
                    },
                    vertexShader: shaders.pickers.potree_vs,
                    fragmentShader: shaders.pickers.potree_fs,
                    transparent: false,
                    side: THREE.DoubleSide
                });
            } else if (isCADModel) {
                renderMaterial = new THREE.ShaderMaterial({
                    vertexShader: shaders.pickers.cad_vs,
                    fragmentShader: shaders.pickers.cad_fs,
                    uniforms: {
                        id: {value: -1.0},
                        explode_value: {value: object.current_explosion},
                        dataTextureWidth: {value: material.uniforms.dataTextureWidth.value},
                        dataTextureHeight: {value: material.uniforms.dataTextureHeight.value},
                        volumeSpecificDataTextureWidth: {value: material.uniforms.volumeSpecificDataTextureWidth.value},
                        volumeSpecificDataTextureHeight: {value: material.uniforms.volumeSpecificDataTextureHeight.value},
                        explodeMap: {value: material.uniforms.explodeMap.value},
                        alphaValueMap: {value: material.uniforms.alphaValueMap.value},
                        uOpacity: {value: material.uniforms.uOpacity.value},
                    },
                    side: material.side,
                    depthTest: depthTest > 0,
                    depthWrite: depthWrite > 0
                });
            } else {
                renderMaterial = new THREE.ShaderMaterial({
                    vertexShader: shaders.pickers.general_vs,
                    fragmentShader: shaders.pickers.general_fs,
                    uniforms: {
                        id: {value: -1.0},
                        rotation: {value: 0.0},
                        center: {value: new THREE.Vector2(0.5, 0.5)}
                    },
                    defines: {
                        ...(isSpriteMaterial ? {IS_SPRITE: ''} : {})
                    },
                    side: material.side,
                    depthTest: depthTest > 0,
                    depthWrite: depthWrite > 0
                });
            }

            this._pickingMaterialTemplates[index] = renderMaterial;
        }

        if (isCADModel) {
            renderMaterial.uniforms.explode_value.value = object.current_explosion;
            renderMaterial.uniforms.explodeMap.value = material.uniforms.explodeMap.value;
            renderMaterial.uniforms.alphaValueMap.value = material.uniforms.alphaValueMap.value;
            renderMaterial.uniforms.alphaValueMap.value.needsUpdate = true;
            renderMaterial.uniforms.uOpacity.value = material.uniforms.uOpacity.value;
        } else if (isPointCloudModel) {
            renderMaterial.uniforms.id.value = id;
            renderMaterial.uniforms.spacing.value = material.uniforms.spacing.value;
            renderMaterial.uniforms.fov.value = material.uniforms.fov.value;
            renderMaterial.uniforms.screenHeight.value = material.uniforms.screenHeight.value;
            renderMaterial.uniforms.size.value = material.uniforms.size.value;
            renderMaterial.uniforms.minSize.value = material.uniforms.minSize.value;
            renderMaterial.uniforms.maxSize.value = material.uniforms.maxSize.value;
            renderMaterial.uniforms.octreeSize.value = material.uniforms.octreeSize.value;
            renderMaterial.uniforms.bbSize.value = material.uniforms.bbSize.value;
            renderMaterial.uniforms.visibleNodes.value = material.uniforms.visibleNodes.value;
        } else {
            renderMaterial.uniforms.id.value = id;

            if (isSpriteMaterial) {
                renderMaterial.uniforms.rotation.value = material.rotation;
                renderMaterial.uniforms.center.value = object.center.clone();
            }
        }

        renderMaterial.uniformsNeedUpdate = true;
        return renderMaterial;
    }
};