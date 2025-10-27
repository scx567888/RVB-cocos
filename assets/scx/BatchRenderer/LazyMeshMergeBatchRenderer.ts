import {Material, Mesh} from "cc";
import {MeshMergeBatchRenderer} from "./MeshMergeBatchRenderer.ts";

// todo 这个貌似获得不了什么 性能提升?
class LazyMeshMergeBatchRenderer extends MeshMergeBatchRenderer {

    private readonly unitChanges: boolean[];

    constructor(capacity: number, rawMesh: Mesh, material?: Material) {
        super(capacity, rawMesh, material);
        this.unitChanges = new Array(this._capacity);
    }

    update() {
        for (let i = 0; i < this.unitChanges.length; i++) {
            if (this.unitChanges[i]) {
                super.refreshUnit(i)
                this.unitChanges[i] = null;
            }
        }
        super.update();
    }

    protected updateUnitVertices(index: number) {
        let unitTransform = this._unitTransforms[index];
        // 不可见无需更新
        if (!unitTransform.visible) {
            return
        }
        this.unitChanges[index] = true;
    }

}

export {
    LazyMeshMergeBatchRenderer
}