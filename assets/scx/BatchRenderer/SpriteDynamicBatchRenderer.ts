import {gfx, Material, Mesh, SpriteAtlas, utils, Vec2} from "cc";
import {BaseDynamicBatchRenderer} from "./BaseDynamicBatchRenderer.ts";
import {BatchRenderer} from "./BatchRenderer.ts";
import {SpriteRenderUnit} from "./SpriteRenderUnit.ts";


class SpriteDynamicBatchRenderer extends BaseDynamicBatchRenderer<SpriteRenderUnit> {

    private _rawSpriteAtlas: any;
    private _uvs: Map<string, Float32Array>;
    private _frameNames: string[];

    constructor(batchCapacity: number, rawSpriteAtlas: SpriteAtlas, pixelsToUnit: number, material?: Material) {
        let mesh = SpriteDynamicBatchRenderer.createMash(rawSpriteAtlas, pixelsToUnit);

        // 没有则使用默认贴图
        if (!material) {
            material = SpriteDynamicBatchRenderer.createMaterial(rawSpriteAtlas);
        }

        super(batchCapacity, mesh, material);

        this._rawSpriteAtlas = rawSpriteAtlas;

        //创建 UVs
        this._uvs = new Map<string, Float32Array>();

        // 获取所有帧
        let frameNames = Object.keys(this._rawSpriteAtlas.spriteFrames);

        // 转换为 Float32Array 存储
        for (let frameName of frameNames) {
            let spriteFrame = this._rawSpriteAtlas.spriteFrames[frameName];
            let uvs = new Float32Array(spriteFrame.uv.length);
            for (let i = 0; i < spriteFrame.uv.length; i++) {
                uvs[i] = spriteFrame.uv[i];
            }
            this._uvs.set(frameName, uvs);
        }

        this._frameNames = Array.from(this._uvs.keys());
    }

    // 创建一个可以承载 精灵图的 4 变形网格
    static createMash(rawSpriteAtlas: SpriteAtlas, pixelsToUnit: number): Mesh {
        let frameNames = Object.keys(rawSpriteAtlas.spriteFrames);
        // 前提是 所有 帧 大小都一致
        let firstFrame = rawSpriteAtlas.spriteFrames[frameNames[0]];
        let {height, width} = firstFrame.getOriginalSize();

        // 根据 pixelsToUnit 计算场景单位尺寸
        let halfWidth = (width / pixelsToUnit) / 2;
        let halfHeight = (height / pixelsToUnit) / 2;

        // 创建顶点 positions (x, y, z)
        let positions = [
            -halfWidth, -halfHeight, 0,  // 左下
            halfWidth, -halfHeight, 0,  // 右下
            -halfWidth, halfHeight, 0,  // 左上
            halfWidth, halfHeight, 0,  // 右上
        ];

        let pivot = firstFrame.pivot;

        // pivot 是百分比坐标 (0-1)
        // 计算偏移量
        let pivotOffset = new Vec2(
            (pivot.x - 0.5) * (width / pixelsToUnit),
            (pivot.y - 0.5) * (height / pixelsToUnit)
        );

        for (let i = 0; i < positions.length; i = i + 3) {
            positions[i] -= pivotOffset.x;
            positions[i + 1] -= pivotOffset.y;
        }

        // 创建法线
        let normals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,];

        // 创建 UV
        let uvs = [0, 1, 1, 1, 0, 0, 1, 0,];

        // 创建索引
        let indices = [0, 1, 2, 1, 3, 2,];

        // 创建网格
        return utils.MeshUtils.createMesh({
            positions: positions,
            normals: normals,
            uvs: uvs,
            indices: indices,
        });

    }

    static createMaterial(spriteAtlas: SpriteAtlas): Material {
        // 当前的效果 实际上是 同时开启了 半透明和深度写入, 这会带来以下效果
        // 1, 材质支持半透明, 但这并不是完全正确的半透明
        // 2, 相对于其他物体, 可以呈现正确的半透明.
        // 3, 相对于同一网格内的面, 则会出现不正确的半透明.
        // 4, 因为深度写入的原因, 完全不透明的物体 遮挡顺序是正确的.

        let texture = spriteAtlas.getTexture();

        let material = new Material();

        material.initialize({
            effectName: "builtin-unlit",
            technique: 3, // alpha-blend
            defines: {
                USE_TEXTURE: true,
                USE_ALPHA_TEST: true
            },
            states: {
                rasterizerState: {
                    cullMode: gfx.CullMode.NONE, // 这里设置剔除模式
                },
                depthStencilState: {
                    depthTest: true,      // 开启深度测试
                    depthWrite: true      // 开启深度写入
                }
            }
        })

        material.setProperty("mainTexture", texture)
        material.setProperty('alphaThreshold', 0.01); // 0 ~ 1
        return material;
    }

    getUVsByFrameName(name: string): Float32Array {
        return this._uvs.get(name);
    }

    getFrameNames(): string[] {
        return this._frameNames;
    }

    protected createUnit0(batchRenderer: BatchRenderer, chunkID: number, index: number): SpriteRenderUnit {
        // 创建一个 SpriteRenderUnit
        const unit = new SpriteRenderUnit(this, batchRenderer, chunkID, index);
        unit.setVisible(true);
        return unit;
    }

}

export {
    SpriteDynamicBatchRenderer
}