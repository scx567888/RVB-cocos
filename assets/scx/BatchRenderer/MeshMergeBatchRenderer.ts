import {gfx, Layers, Material, Mesh, MeshRenderer, Node, Quat, utils, Vec3} from "cc";
import {UnitTransform} from "./UnitTransform.ts";
import {BatchRenderer} from "./BatchRenderer.ts"

/**
 * 网格合并 批量渲染器
 */
class MeshMergeBatchRenderer implements BatchRenderer {

    // 容量
    protected readonly _capacity: number;

    // 原始网格
    protected readonly _rawMesh: Mesh;

    // 原始网格的 顶点 数据
    protected readonly _rawPositions: Float32Array;
    // 原始网格的 法线 数据
    protected readonly _rawNormals: Float32Array;
    // 原始网格的 UV 数据
    protected readonly _rawUVs: Float32Array;
    // 原始网格的 索引 数据
    protected readonly _rawIndices: Uint32Array;

    // 整个网格的 顶点 数据
    protected readonly _positions: Float32Array;
    // 整个网格的 法线 数据
    protected readonly _normals: Float32Array;
    // 整个网格的 UV 数据
    protected readonly _uvs: Float32Array;
    // 整个网格的 索引 数据
    protected readonly _indices: Uint32Array;

    // 整个网格
    protected readonly _mesh: Mesh;
    // 持有节点
    protected readonly _node: Node;
    // 网格渲染器
    protected readonly _meshRenderer: MeshRenderer;

    // Unit 的变换数据
    protected readonly _unitTransforms: UnitTransform[];

    constructor(capacity: number, rawMesh: Mesh, material?: Material) {
        this._capacity = capacity;
        this._rawMesh = rawMesh;

        // 提取原始网格的数据
        this._rawPositions = this._rawMesh.readAttribute(0, gfx.AttributeName.ATTR_POSITION) as Float32Array;
        this._rawNormals = this._rawMesh.readAttribute(0, gfx.AttributeName.ATTR_NORMAL) as Float32Array;
        this._rawUVs = this._rawMesh.readAttribute(0, gfx.AttributeName.ATTR_TEX_COORD) as Float32Array;
        this._rawIndices = this._rawMesh.readIndices(0) as Uint32Array;

        // 创建整个网格的数据
        this._positions = new Float32Array(this._rawPositions.length * this._capacity);
        this._normals = new Float32Array(this._rawNormals.length * this._capacity);
        this._uvs = new Float32Array(this._rawUVs.length * this._capacity);
        this._indices = new Uint32Array(this._rawIndices.length * this._capacity);

        // 初始化网格数据
        const rawVertexCount = this._rawPositions.length / 3;
        for (let i = 0; i < this._capacity; i++) {
            // 我们忽略填充 this._positions 以便 在视觉上默认隐藏所有单位
            // 填充法线
            this._normals.set(this._rawNormals, i * this._rawNormals.length);
            // 填充 UV
            this._uvs.set(this._rawUVs, i * this._rawUVs.length);
            // 填充 索引 (索引需要计算偏移)
            let indicesOffset = i * this._rawIndices.length;
            for (let j = 0; j < this._rawIndices.length; j++) {
                this._indices[indicesOffset + j] = this._rawIndices[j] + i * rawVertexCount;
            }
        }

        // 创建网格
        this._mesh = utils.MeshUtils.createDynamicMesh(0, {
            positions: this._positions,
            normals: this._normals,
            uvs: this._uvs,
            indices32: this._indices,
        }, null, {
            maxSubMeshes: 1,
            maxSubMeshVertices: this._positions.length / 3,
            maxSubMeshIndices: this._indices.length,
        });

        // 创建容器节点
        this._node = new Node("BatchRenderer");

        // 创建 MeshRenderer
        this._meshRenderer = this._node.addComponent(MeshRenderer);
        this._meshRenderer.mesh = this._mesh;
        this._meshRenderer.setSharedMaterial(material, 0);

        // 创建 单元 变化状态数组
        this._unitTransforms = new Array(this._capacity);
        for (let i = 0; i < this._capacity; i++) {
            this._unitTransforms[i] = new UnitTransform();
        }

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
        this._node.layer = 1 << Layers.nameToLayer(name);
    }

    getLayer(): string {
        return Layers.layerToName(Math.log2(this._node.layer));
    }

    destroy(): void {
        // 销毁 GPU buffer (否则会导致内存泄露)
        this._mesh.destroy();
        // 销毁 Node
        this._node.destroy();
    }

    // ================ BatchRenderer 接口 ================

    // 容量
    capacity(): number {
        return this._capacity;
    }

    // 材质
    setMaterial(material: Material): void {
        this._meshRenderer.setSharedMaterial(material, 0);
    }

    getMaterial(): Material | null {
        return this._meshRenderer.getSharedMaterial(0);
    }

    // 位置
    setUnitPosition(index: number, x: number, y: number, z: number): void {
        const unitTransform = this._unitTransforms[index];
        unitTransform.position.set(x, y, z);
        // 更新顶点
        this.refreshUnit(index);
    }

    getUnitPosition(index: number): Vec3 {
        return this._unitTransforms[index].position;
    }

    translateUnit(index: number, dx: number, dy: number, dz: number): void {
        const unitTransform = this._unitTransforms[index];
        unitTransform.position.x += dx;
        unitTransform.position.y += dy;
        unitTransform.position.z += dz;
        // 更新顶点
        this.refreshUnit(index);
    }

    // 旋转
    setUnitRotation(index: number, x: number, y: number, z: number, w: number): void {
        const unitTransform = this._unitTransforms[index];
        unitTransform.rotation.set(x, y, z, w);
        // 更新顶点
        this.refreshUnit(index);
    }

    setUnitRotationFromEuler(index: number, x: number, y: number, z: number): void {
        const unitTransform = this._unitTransforms[index];
        // 将欧拉角转四元数
        Quat.fromEuler(unitTransform.rotation, x, y, z);
        // 更新顶点
        this.refreshUnit(index);
    }

    getUnitRotation(index: number): Quat {
        return this._unitTransforms[index].rotation;
    }

    rotateUnit(index: number, dx: number, dy: number, dz: number, dw: number): void {
        const unitTransform = this._unitTransforms[index];
        Quat.multiply(unitTransform.rotation, unitTransform.rotation, new Quat(dx, dy, dz, dw));
        // 更新顶点
        this.refreshUnit(index);
    }

    rotateUnitFromEuler(index: number, dx: number, dy: number, dz: number): void {
        const unitTransform = this._unitTransforms[index];
        Quat.multiply(unitTransform.rotation, unitTransform.rotation, Quat.fromEuler(new Quat(), dx, dy, dz));
        // 更新顶点
        this.refreshUnit(index);
    }

    // 缩放
    setUnitScale(index: number, x: number, y: number, z: number): void {
        let unitTransform = this._unitTransforms[index];
        unitTransform.scale.set(x, y, z);
        // 更新顶点
        this.refreshUnit(index);
    }

    getUnitScale(index: number): Vec3 {
        return this._unitTransforms[index].scale;
    }

    scaleUnit(index: number, sx: number, sy: number, sz: number): void {
        const unitTransform = this._unitTransforms[index];
        // 累加增量
        unitTransform.scale.x *= sx;
        unitTransform.scale.y *= sy;
        unitTransform.scale.z *= sz;
        this.refreshUnit(index);
    }

    // 可见性
    setUnitVisible(index: number, visible: boolean): void {
        const unitTransform = this._unitTransforms[index];
        // 如果和之前一样 跳过
        if (unitTransform.visible == visible) {
            return;
        }

        unitTransform.visible = visible;

        if (unitTransform.visible) {
            this.updateUnitVertices(index, unitTransform);
        } else {
            // 通过将单元的所有顶点塌缩到 0 点(0, 0, 0), 使其在视觉上隐藏/移除
            this.collapseUnitVertices(index, 0, 0, 0);
        }

    }

    getUnitVisible(index: number): boolean {
        return this._unitTransforms[index].visible;
    }

    // UV
    setUnitUVs(index: number, uvs: Float32Array): void {
        // 计算 Unit 在 UVs 数组中的起始位置
        let startIndex = this._rawUVs.length * index;
        // 更新 UV
        this._uvs.set(uvs, startIndex);
    }

    getUnitUVs(index: number): Float32Array {
        // 计算 Unit 在 UVs 数组中的起始位置
        let startIndex = this._rawUVs.length * index;
        // 截取 UV
        return this._uvs.slice(startIndex, startIndex + this._rawUVs.length);
    }

    // 更新
    update(): void {
        // 更新网格
        this._meshRenderer.mesh.updateSubMesh(0, {
            positions: this._positions,
            normals: this._normals,
            uvs: this._uvs,
            indices32: this._indices,
        });
        this._meshRenderer.onGeometryChanged();
    }

    protected refreshUnit(index: number) {
        let unitTransform = this._unitTransforms[index];
        // 不可见无需更新
        if (!unitTransform.visible) {
            return;
        }
        this.updateUnitVertices(index, unitTransform);
    }

    // 塌缩顶点 (通常用于隐藏单元)
    protected collapseUnitVertices(index: number, x: number, y: number, z: number) {
        // 计算 Unit 在顶点数组中的起始位置
        let startIndex = this._rawPositions.length * index;
        // 一次更改一个顶点的三个坐标
        for (let i = 0; i < this._rawPositions.length; i = i + 3) {
            this._positions[startIndex + i] = x
            this._positions[startIndex + i + 1] = y
            this._positions[startIndex + i + 2] = z;
        }
    }

    // 更新顶点
    protected updateUnitVertices(index: number, unitTransform: UnitTransform) {
        // 计算 Unit 在顶点数组中的起始位置
        const startIndex = this._rawPositions.length * index;

        const qx = unitTransform.rotation.x;
        const qy = unitTransform.rotation.y;
        const qz = unitTransform.rotation.z;
        const qw = unitTransform.rotation.w;

        const x2 = qx + qx;
        const y2 = qy + qy;
        const z2 = qz + qz;

        const xx = qx * x2;
        const xy = qx * y2;
        const xz = qx * z2;
        const yy = qy * y2;
        const yz = qy * z2;
        const zz = qz * z2;
        const wx = qw * x2;
        const wy = qw * y2;
        const wz = qw * z2;

        const sx = unitTransform.scale.x;
        const sy = unitTransform.scale.y;
        const sz = unitTransform.scale.z;

        const m00 = (1 - (yy + zz)) * sx;
        const m01 = (xy + wz) * sx;
        const m02 = (xz - wy) * sx;

        const m04 = (xy - wz) * sy;
        const m05 = (1 - (xx + zz)) * sy;
        const m06 = (yz + wx) * sy;

        const m08 = (xz + wy) * sz;
        const m09 = (yz - wx) * sz;
        const m10 = (1 - (xx + yy)) * sz;

        const m12 = unitTransform.position.x;
        const m13 = unitTransform.position.y;
        const m14 = unitTransform.position.z;

        for (let i = 0; i < this._rawPositions.length; i += 3) {

            let vx = this._rawPositions[i];
            let vy = this._rawPositions[i + 1];
            let vz = this._rawPositions[i + 2];

            // 更新 positions
            this._positions[startIndex + i] = m00 * vx + m04 * vy + m08 * vz + m12;
            this._positions[startIndex + i + 1] = m01 * vx + m05 * vy + m09 * vz + m13;
            this._positions[startIndex + i + 2] = m02 * vx + m06 * vy + m10 * vz + m14;
        }
    }

}

export {
    MeshMergeBatchRenderer
}