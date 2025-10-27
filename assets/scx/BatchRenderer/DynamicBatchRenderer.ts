import {Material} from "cc";
import {RenderUnit} from "./RenderUnit.ts";
import {NodeLike} from "./NodeLike.ts";

/**
 * 动态的 面向对象的 批量渲染器
 */
interface DynamicBatchRenderer<U extends RenderUnit> extends NodeLike {

    // 材质
    setMaterial(material: Material): void;

    getMaterial(): Material | null;

    // Unit
    createUnit(): U;

    destroyUnit(unit: RenderUnit): void;

    // 更新
    update(): void;

}

export {
    type DynamicBatchRenderer
}