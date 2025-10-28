import {_decorator, Component, Prefab, Vec3} from 'cc';
import {MeshMergeBatchRenderer} from "db://assets/scx/BatchRenderer/MeshMergeBatchRenderer.ts";
import {BatchRendererBuilder} from "db://assets/scx/BatchRenderer/BatchRendererBuilder.ts";

const {ccclass, property} = _decorator;

// 网格合批方式
@ccclass('BatchRendererTest')
export class BatchRendererTest extends Component {

    // 预制体
    @property({type: Prefab})
    cube: Prefab;

    batchRenderer: MeshMergeBatchRenderer;

    show() {
        this.node.active = true;
    }

    disShow() {
        this.node.active = false;
    }

    start() {
        this.batchRenderer = BatchRendererBuilder.createByPrefab(10000 * 3, this.cube);
        this.batchRenderer.setParent(this.node);
        for (let j = 0; j < this.batchRenderer.capacity(); j++) {
            this.batchRenderer.setUnitVisible(j, true);
            this.batchRenderer.setUnitPosition(j, BatchRendererTest.randomFloat(-100, 100), BatchRendererTest.randomFloat(-100, 100), BatchRendererTest.randomFloat(-100, 100))

        }
        this.batchRenderer.update()
    }

    update(deltaTime: number) {

        // 绕 Y 轴旋转 Node
        this.node.eulerAngles = new Vec3(
            this.node.eulerAngles.x,
            this.node.eulerAngles.y + 10 * deltaTime,
            this.node.eulerAngles.z
        );

        for (let j = 0; j < this.batchRenderer.capacity(); j++) {
            this.batchRenderer.setUnitPosition(j, BatchRendererTest.randomFloat(-30, 30), BatchRendererTest.randomFloat(-30, 30), BatchRendererTest.randomFloat(-30, 30))
        }

        this.batchRenderer.update()
    }

    static randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

}


