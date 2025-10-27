import {Quat, Vec3} from "cc"
import {BatchRenderer} from "./BatchRenderer.ts";
import {DynamicBatchRenderer} from "./DynamicBatchRenderer.ts";

/**
 * 渲染单元
 */
class RenderUnit {

    protected dynamicBatchRenderer: DynamicBatchRenderer<any>;
    protected batchRenderer: BatchRenderer;
    readonly chunkID: number;
    readonly index: number;

    constructor(dynamicBatchRenderer: DynamicBatchRenderer<any>, batchRenderer: BatchRenderer, chunkID: number, index: number) {
        this.dynamicBatchRenderer = dynamicBatchRenderer;
        this.batchRenderer = batchRenderer;
        this.chunkID = chunkID;
        this.index = index;
    }

    // 位置
    setPosition(x: number, y: number, z?: number): void {
        this.batchRenderer.setUnitPosition(this.index, x, y, z);
    }

    getPosition(): Vec3 {
        return this.batchRenderer.getUnitPosition(this.index);
    }

    translate(dx: number, dy: number, dz?: number): void {
        this.batchRenderer.translateUnit(this.index, dx, dy, dz);
    }

    // 旋转
    setRotation(x: number, y: number, z: number, w: number): void {
        this.batchRenderer.setUnitRotation(this.index, x, y, z, w);
    }

    setRotationFromEuler(x: number, y: number, z?: number): void {
        this.batchRenderer.setUnitRotationFromEuler(this.index, x, y, z);
    }

    getRotation(): Quat {
        return this.batchRenderer.getUnitRotation(this.index);
    }

    rotate(dx: number, dy: number, dz: number, dw: number): void {
        this.batchRenderer.rotateUnit(this.index, dx, dy, dz, dw);
    }

    rotateFromEuler(dx: number, dy: number, dz?: number): void {
        this.batchRenderer.rotateUnitFromEuler(this.index, dx, dy, dz);
    }

    // 缩放
    setScale(x: number, y: number, z?: number): void {
        this.batchRenderer.setUnitScale(this.index, x, y, z);
    }

    getScale(): Vec3 {
        return this.batchRenderer.getUnitScale(this.index);
    }

    // 可见性
    setVisible(visible: boolean) {
        this.batchRenderer.setUnitVisible(this.index, visible)
    }

    getVisible(): boolean {
        return this.batchRenderer.getUnitVisible(this.index);
    }

    // UV
    setUVs(uvs: Float32Array): void {
        this.batchRenderer.setUnitUVs(this.index, uvs);
    }

    getUVs(): Float32Array {
        return this.batchRenderer.getUnitUVs(this.index);
    }

    // 销毁
    destroy(): void {
        this.dynamicBatchRenderer.destroyUnit(this);
        // 置空 防止后续外部调用
        this.dynamicBatchRenderer = null;
        this.batchRenderer = null;
    }

}

export {
    RenderUnit
}