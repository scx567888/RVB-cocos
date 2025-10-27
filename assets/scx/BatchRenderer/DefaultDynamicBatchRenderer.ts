import {Material, Mesh} from "cc";
import {BaseDynamicBatchRenderer} from "./BaseDynamicBatchRenderer.ts";
import {RenderUnit} from "./RenderUnit.ts";
import {BatchRenderer} from "./BatchRenderer.ts";

class DefaultDynamicBatchRenderer extends BaseDynamicBatchRenderer<RenderUnit> {

    constructor(chunkCapacity: number, rawMesh: Mesh, material: Material) {
        super(chunkCapacity, rawMesh, material);
    }

    protected createUnit0(batchRenderer: BatchRenderer, chunkID: number, index: number): RenderUnit {
        // 创建一个 RenderUnit
        const unit = new RenderUnit(this, batchRenderer, chunkID, index);
        unit.setVisible(true);
        return unit;
    }

}

export {
    DefaultDynamicBatchRenderer
}