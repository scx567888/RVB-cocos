import {_decorator, Component, Prefab, Vec3} from 'cc';
import {BatchRendererBuilder} from "db://assets/scx/BatchRenderer/BatchRendererBuilder.ts";
import {DefaultDynamicBatchRenderer} from "db://assets/scx/BatchRenderer/DefaultDynamicBatchRenderer.ts";

const {ccclass, property} = _decorator;

@ccclass('DynamicBatchRendererTest')
class DynamicBatchRendererTest extends Component {

    // 预制体
    @property({type: Prefab})
    cube: Prefab;

    dynamicBatchRenderer: DefaultDynamicBatchRenderer;

    list = [];

    show() {
        this.node.active = true;
    }

    disShow() {
        this.node.active = false;
    }

    start() {
        debugger

        this.dynamicBatchRenderer = BatchRendererBuilder.createDynamicByPrefab(5000, this.cube);
        for (let j = 0; j < 10000 * 3; j++) {
            try {
                let renderUnit = this.dynamicBatchRenderer.createUnit();
                renderUnit.setPosition(DynamicBatchRendererTest.randomFloat(-100, 100), DynamicBatchRendererTest.randomFloat(-100, 100), DynamicBatchRendererTest.randomFloat(-100, 100))
                this.list.push(renderUnit)
            } catch (e) {
                console.log(e);
            }

        }
        this.dynamicBatchRenderer.setParent(this.node);
    }

    i = true

    update(deltaTime: number) {
        // 绕 Y 轴旋转 Node
        this.node.eulerAngles = new Vec3(
            this.node.eulerAngles.x,
            this.node.eulerAngles.y + 10 * deltaTime,
            this.node.eulerAngles.z
        );

        for (let j = 0; j < this.list.length; j++) {
            this.list[j].setPosition(DynamicBatchRendererTest.randomFloat(-30, 30), DynamicBatchRendererTest.randomFloat(-30, 30), DynamicBatchRendererTest.randomFloat(-30, 30))
        }

        this.dynamicBatchRenderer.update()

    }

    static randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }
}

export {
    DynamicBatchRendererTest
}
