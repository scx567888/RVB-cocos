import {Quat, Vec3} from "cc";

class UnitTransform {

    position: Vec3;
    rotation: Quat;
    scale: Vec3;
    visible: boolean;

    constructor() {
        this.position = new Vec3(0, 0, 0);
        this.rotation = new Quat(0, 0, 0, 1);
        this.scale = new Vec3(1, 1, 1);
        this.visible = false;
    }

}

export {
    UnitTransform
}