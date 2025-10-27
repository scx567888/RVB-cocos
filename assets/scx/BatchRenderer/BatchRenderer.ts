import {Material, Quat, Vec3} from "cc";
import {NodeLike} from "./NodeLike.ts";

/**
 * 批量渲染器 (固定容量)
 */
interface BatchRenderer extends NodeLike {

    // 容量
    capacity(): number;

    // 材质
    setMaterial(material: Material): void;

    getMaterial(): Material | null;

    // 位置
    setUnitPosition(index: number, x: number, y: number, z: number): void;

    getUnitPosition(index: number): Vec3;

    translateUnit(index: number, dx: number, dy: number, dz: number): void;

    // 旋转
    setUnitRotation(index: number, x: number, y: number, z: number, w: number): void;

    setUnitRotationFromEuler(index: number, x: number, y: number, z: number): void;

    getUnitRotation(index: number): Quat;

    rotateUnit(index: number, dx: number, dy: number, dz: number, dw: number): void;

    rotateUnitFromEuler(index: number, dx: number, dy: number, dz: number): void;

    // 缩放
    setUnitScale(index: number, x: number, y: number, z: number): void;

    getUnitScale(index: number): Vec3;

    scaleUnit(index: number, sx: number, sy: number, sz: number): void;

    // 可见性
    setUnitVisible(index: number, visible: boolean): void;

    getUnitVisible(index: number): boolean;

    // UV
    setUnitUVs(index: number, uvs: Float32Array): void;

    getUnitUVs(index: number): Float32Array;

    // 更新
    update(): void;

}

export {
    type BatchRenderer
}