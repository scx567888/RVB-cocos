import {RenderUnit} from "./RenderUnit.ts";
import {BatchRenderer} from "./BatchRenderer.ts";
import {SpriteDynamicBatchRenderer} from "./SpriteDynamicBatchRenderer.ts";

class SpriteRenderUnit extends RenderUnit {

    constructor(dynamicBatchRenderer: SpriteDynamicBatchRenderer, batchRenderer: BatchRenderer, chunkID: number, index: number) {
        super(dynamicBatchRenderer, batchRenderer, chunkID, index);
    }

    // UV
    setFrame(name: string): void {
        let uvs = this.spriteDynamicBatchRenderer().getUVsByFrameName(name);
        this.batchRenderer.setUnitUVs(this.index, uvs);
    }

    getFrame(): string {
        return null;
    }

    private spriteDynamicBatchRenderer(): SpriteDynamicBatchRenderer {
        return this.dynamicBatchRenderer as SpriteDynamicBatchRenderer;
    }

}

export {
    SpriteRenderUnit
}