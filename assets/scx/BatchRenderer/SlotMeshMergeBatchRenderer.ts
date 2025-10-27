import {Material, Mesh} from "cc";
import {MeshMergeBatchRenderer} from "./MeshMergeBatchRenderer.ts";
import {UnitTransform} from "./UnitTransform.ts";

class SlotMeshMergeBatchRenderer extends MeshMergeBatchRenderer {

    private _free: number[];
    private _hasChange: boolean;

    constructor(capacity: number, rawMesh: Mesh, material?: Material) {
        super(capacity, rawMesh, material);
        this._free = [];
        for (let i = 0; i < capacity; i++) {
            this._free.push(i);
        }
        this._hasChange = false;
    }

    allocate(): number {
        return this._free.pop();
    }

    release(index: number): void {
        this._free.push(index);
    }

    hasFree(): boolean {
        return this._free.length > 0;
    }

    allFree(): boolean {
        return this._free.length == this._capacity;
    }

    update(): void {
        if (!this._hasChange) {
            return;
        }
        super.update();
        this._hasChange = false;
    }

    setMaterial(material: Material): void {
        super.setMaterial(material);
        this._hasChange = true;
    }

    setUnitUVs(index: number, uvs: Float32Array): void {
        super.setUnitUVs(index, uvs);
        this._hasChange = true;
    }

    protected collapseUnitVertices(index: number, x: number, y: number, z: number): void {
        super.collapseUnitVertices(index, x, y, z);
        this._hasChange = true;
    }

    protected updateUnitVertices(index: number, unitTransform: UnitTransform): void {
        super.updateUnitVertices(index, unitTransform);
        this._hasChange = true;
    }

}

export {
    SlotMeshMergeBatchRenderer
}