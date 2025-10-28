import {_decorator, Component, Prefab, Vec3} from 'cc';
import {BatchRendererBuilder} from "db://assets/scx/BatchRenderer/BatchRendererBuilder.ts";
import {DefaultDynamicBatchRenderer} from "db://assets/scx/BatchRenderer/DefaultDynamicBatchRenderer.ts";
import {Utils} from "db://assets/scx/Utils/Utils.ts";

const {ccclass, property} = _decorator;

// 动态批处理方式
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

        this.dynamicBatchRenderer = BatchRendererBuilder.createDynamicByPrefab(5000, this.cube);
        this.dynamicBatchRenderer.setParent(this.node);

        for (let j = 0; j < 10000 * 3; j++) {
            let renderUnit = this.dynamicBatchRenderer.createUnit();
            renderUnit.setPosition(Utils.randomFloat(-100, 100), Utils.randomFloat(-100, 100), Utils.randomFloat(-100, 100))
            this.list.push(renderUnit);
        }
    }

    update(deltaTime: number) {

        // 绕 Y 轴旋转 Node
        this.node.eulerAngles = new Vec3(
            this.node.eulerAngles.x,
            this.node.eulerAngles.y + 10 * deltaTime,
            this.node.eulerAngles.z
        );

        for (let j = 0; j < this.list.length; j++) {
            this.list[j].setPosition(Utils.randomFloat(-30, 30), Utils.randomFloat(-30, 30), Utils.randomFloat(-30, 30))
        }

        this.dynamicBatchRenderer.update()

    }

}


