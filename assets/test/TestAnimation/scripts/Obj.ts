import {SpriteRenderUnit} from "db://assets/scx/BatchRenderer/SpriteRenderUnit.ts";

class Obj {

    spriteRenderUnit: SpriteRenderUnit;

    frameIndex: number;

    constructor(spriteRenderUnit: SpriteRenderUnit, frameIndex: number) {
        this.spriteRenderUnit = spriteRenderUnit;
        this.frameIndex = frameIndex;
    }

}

export {
    Obj
}