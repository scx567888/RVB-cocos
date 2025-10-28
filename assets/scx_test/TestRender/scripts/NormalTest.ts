import {_decorator, Component, instantiate, Prefab, Vec3} from 'cc';

const {ccclass, property} = _decorator;

// 标准实例化方式
@ccclass('NormalTest')
export class NormalTest extends Component {

    // 预制体
    @property({type: Prefab})
    cube: Prefab;

    list = [];

    show() {
        this.node.active = true;
    }

    disShow() {
        this.node.active = false;
    }

    start() {
        for (let j = 0; j < 10000 * 3; j++) {
            let node = instantiate(this.cube);
            node.setPosition(NormalTest.randomFloat(-100, 100), NormalTest.randomFloat(-100, 100), NormalTest.randomFloat(-100, 100))
            node.parent = this.node;
            this.list.push(node)
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
            this.list[j].setPosition(NormalTest.randomFloat(-30, 30), NormalTest.randomFloat(-30, 30), NormalTest.randomFloat(-30, 30))
        }

    }

    static randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

}


