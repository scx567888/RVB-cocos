import {_decorator, Component, Material, SpriteAtlas, Vec3} from 'cc';
import {SpriteDynamicBatchRenderer} from "db://assets/scx/BatchRenderer/SpriteDynamicBatchRenderer.ts";
import {Obj} from "db://assets/scx_test/TestAnimation/scripts/Obj.ts";

const {ccclass, property} = _decorator;

@ccclass('Test')
export class Test extends Component {

    @property(SpriteAtlas)
    atlas: SpriteAtlas = null;

    @property(Material)
    material: Material = null;

    private spriteDynamicBatchRenderer: SpriteDynamicBatchRenderer;
    private spriteRenderUnits: Obj[];

    list: string[];

    start() {

        this.spriteRenderUnits = []
        this.spriteDynamicBatchRenderer = new SpriteDynamicBatchRenderer(5000, this.atlas, 300, this.material);
        this.list = this.spriteDynamicBatchRenderer.getFrameNames();

        this.spriteDynamicBatchRenderer.setParent(this.node);

        for (let j = 0; j < 10000 * 5; j++) {
            let spriteRenderUnit = this.spriteDynamicBatchRenderer.createUnit();
            spriteRenderUnit.setVisible(true)
            spriteRenderUnit.setPosition(Test.randomFloat(-50, 50), Test.randomFloat(-50, 50), Test.randomFloat(-50, 50));

            spriteRenderUnit.setFrame(this.list[0])
            // 给每个单元一个随机起始帧索引
            let obj = new Obj(spriteRenderUnit, Math.floor(Math.random() * this.list.length))
            this.spriteRenderUnits.push(obj);
        }

    }

    update(deltaTime: number) {

        // 绕 Y 轴旋转 Node
        this.node.eulerAngles = new Vec3(
            this.node.eulerAngles.x,
            this.node.eulerAngles.y + 10 * deltaTime,
            this.node.eulerAngles.z
        );

        for (const spriteRenderUnit of this.spriteRenderUnits) {
            // 每个单元的帧索引累加
            spriteRenderUnit.frameIndex++;
            const frameName = this.list[spriteRenderUnit.frameIndex % this.list.length];
            spriteRenderUnit.spriteRenderUnit.setFrame(frameName);
        }

        this.spriteDynamicBatchRenderer.update();

    }

    static randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

}


