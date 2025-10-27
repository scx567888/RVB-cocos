import {Material, Mesh} from "cc";

import {MeshMergeBatchRenderer} from "./MeshMergeBatchRenderer.ts";

/**
 * 网格合并 批量渲染器 (省去了矩阵变换, 只支持更新 坐标, 性能可能略高于 MeshMergeBatchRenderer)
 * todo 貌似获得不了什么性能提升?
 */
class PositionOnlyMeshMergeBatchRenderer extends MeshMergeBatchRenderer {

    constructor(capacity: number, rawMesh: Mesh, material?: Material) {
        super(capacity, rawMesh, material);
    }

    setUnitPosition(index: number, x: number, y: number, z: number) {
        const unitTransform = this._unitTransforms[index];
        unitTransform.position.set(x, y, z);
        // 更新顶点
        let startIndex = this._rawPositions.length * index;

        // 一次更改一个顶点的三个坐标
        for (let i = 0; i < this._rawPositions.length; i = i + 3) {
            this._positions[startIndex + i] = this._rawPositions[i] + x
            this._positions[startIndex + i + 1] = this._rawPositions[i + 1] + y
            this._positions[startIndex + i + 2] = this._rawPositions[i + 2] + z;
        }
    }

    // 旋转
    setUnitRotation(index: number, x: number, y: number, z: number, w: number) {
        // 什么都不做
    }

    setUnitRotationFromEuler(index: number, x: number, y: number, z: number): void {
        // 什么都不做
    }

    // 缩放
    setUnitScale(index: number, x: number, y: number, z: number): void {
        // 什么都不做
    }

}

export {
    PositionOnlyMeshMergeBatchRenderer
}