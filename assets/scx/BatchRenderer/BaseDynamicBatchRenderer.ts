import {Layers, Material, Mesh, Node, Quat, Vec3} from "cc";
import {RenderUnit} from "./RenderUnit.ts";
import {DynamicBatchRenderer} from "./DynamicBatchRenderer.ts";
import {SlotMeshMergeBatchRenderer} from "./SlotMeshMergeBatchRenderer.ts";
import {BatchRenderer} from "./BatchRenderer.ts";


abstract class BaseDynamicBatchRenderer<U extends RenderUnit> implements DynamicBatchRenderer<U> {

    // 单个分块的容量
    protected readonly _chunkCapacity: number;

    // 原始网格
    protected readonly _rawMesh: Mesh;

    // 默认材质
    protected readonly _material: Material;

    // 分块列表
    protected readonly _chunks: Map<number, SlotMeshMergeBatchRenderer>;

    // 持有节点
    protected readonly _node: Node;

    // 分块 ID
    private _nextChunkID: number;

    protected constructor(chunkCapacity: number, rawMesh: Mesh, material?: Material) {
        this._chunkCapacity = chunkCapacity;
        this._rawMesh = rawMesh;
        this._material = material;
        this._chunks = new Map<number, SlotMeshMergeBatchRenderer>;
        this._node = new Node();
        this._nextChunkID = 0;
    }

    // ================ Node 模拟接口 ================

    setParent(parent: Node): void {
        this._node.setParent(parent);
    }

    getParent(): Node | null {
        return this._node.getParent();
    }

    setPosition(x: number, y: number, z?: number): void {
        this._node.setPosition(x, y, z);
    }

    getPosition(): Vec3 {
        return this._node.getPosition();
    }

    setRotation(x: number, y: number, z: number, w: number): void {
        this._node.setRotation(x, y, z, w);
    }

    setRotationFromEuler(x: number, y: number, z?: number): void {
        this._node.setRotationFromEuler(x, y, z);
    }

    getRotation(): Quat {
        return this._node.getRotation();
    }

    setScale(x: number, y: number, z?: number): void {
        this._node.setScale(x, y, z);
    }

    getScale(): Vec3 {
        return this._node.getScale();
    }

    setActive(active: boolean): void {
        this._node.active = active;
    }

    getActive(): boolean {
        return this._node.active;
    }


    setLayer(name: string): void {
        this._node.layer = Layers.nameToLayer(name);
        // 递归处理子 layer
        for (let [key, value] of this._chunks) {
            value.setLayer(name);
        }
    }

    getLayer() {
        return Layers.layerToName(this._node.layer);
    }

    destroy(): void {
        for (let [key, value] of this._chunks) {
            value.destroy();
        }
        // 销毁 Node
        this._node.destroy();
    }

    // ================ DynamicBatchRenderer 接口 ================

    // 材质
    setMaterial(material: Material): void {
        for (let [key, value] of this._chunks) {
            value.setMaterial(material);
        }
    }

    getMaterial(): Material | null {
        return null;
    }

    // Unit
    createUnit(): U {
        // 寻找一个空位
        let batchRenderer: SlotMeshMergeBatchRenderer = null;
        let chunkID: number = null;
        let index: number = null;

        // 先尝试寻找一个空位
        for (let [key, value] of this._chunks) {
            if (value.hasFree()) {
                batchRenderer = value;
                chunkID = key;
                index = value.allocate();
                break
            }
        }

        // 没找到任何符合的 创建 (扩容)
        if (batchRenderer == null) {
            batchRenderer = new SlotMeshMergeBatchRenderer(this._chunkCapacity, this._rawMesh, this._material);
            batchRenderer.setParent(this._node)
            batchRenderer.setLayer(this.getLayer());
            chunkID = this._nextChunkID++;
            index = batchRenderer.allocate();
            this._chunks.set(chunkID, batchRenderer);
        }

        return this.createUnit0(batchRenderer, chunkID, index);
    }

    destroyUnit(unit: RenderUnit): void {
        // 获取分块
        const chunk = this._chunks.get(unit.chunkID);
        // 回收 id
        chunk.release(unit.index);
        // 设为不可见
        unit.setVisible(false);
        // 全部空闲 则回收整个 分块
        if (chunk.allFree()) {
            chunk.destroy();
            this._chunks.delete(unit.chunkID)
        }
    }

    // 更新
    update(): void {
        for (let [key, value] of this._chunks) {
            value.update();
        }
    }

    protected abstract createUnit0(batchRenderer: BatchRenderer, chunkID: number, index: number): U;

}

export {
    BaseDynamicBatchRenderer
}