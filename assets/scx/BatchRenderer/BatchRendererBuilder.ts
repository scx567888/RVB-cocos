import {instantiate, MeshRenderer, Prefab} from "cc";
import {MeshMergeBatchRenderer} from "./MeshMergeBatchRenderer.ts";
import {PositionOnlyMeshMergeBatchRenderer} from "./PositionOnlyMeshMergeBatchRenderer.ts";
import {LazyMeshMergeBatchRenderer} from "./LazyMeshMergeBatchRenderer.ts";
import {DefaultDynamicBatchRenderer} from "./DefaultDynamicBatchRenderer.ts";

class BatchRendererBuilder {

    static createByPrefab(capacity: number, prefab: Prefab): MeshMergeBatchRenderer {
        // 实例化
        let tempNode = instantiate(prefab);
        // 从预制体提取网格数据
        let tempMeshRenderer = tempNode.getComponent(MeshRenderer);
        let tempMesh = tempMeshRenderer.mesh;
        let tempMaterial = tempMeshRenderer.getSharedMaterial(0);
        // 创建 BatchRenderer
        const batchRenderer = new MeshMergeBatchRenderer(capacity, tempMesh, tempMaterial);
        // 创建完成 销毁 临时节点
        tempNode.destroy();
        // 返回
        return batchRenderer;
    }

    static createPositionOnlyByPrefab(capacity: number, prefab: Prefab): MeshMergeBatchRenderer {
        // 实例化
        let tempNode = instantiate(prefab);
        // 从预制体提取网格数据
        let tempMeshRenderer = tempNode.getComponent(MeshRenderer);
        let tempMesh = tempMeshRenderer.mesh;
        let tempMaterial = tempMeshRenderer.getSharedMaterial(0);
        // 创建 BatchRenderer
        const batchRenderer = new PositionOnlyMeshMergeBatchRenderer(capacity, tempMesh, tempMaterial);
        // 创建完成 销毁 临时节点
        tempNode.destroy();
        // 返回
        return batchRenderer;
    }

    static createLazyByPrefab(capacity: number, prefab: Prefab): MeshMergeBatchRenderer {
        // 实例化
        let tempNode = instantiate(prefab);
        // 从预制体提取网格数据
        let tempMeshRenderer = tempNode.getComponent(MeshRenderer);
        let tempMesh = tempMeshRenderer.mesh;
        let tempMaterial = tempMeshRenderer.getSharedMaterial(0);
        // 创建 BatchRenderer
        const batchRenderer = new LazyMeshMergeBatchRenderer(capacity, tempMesh, tempMaterial);
        // 创建完成 销毁 临时节点
        tempNode.destroy();
        // 返回
        return batchRenderer;
    }


    static createDynamicByPrefab(chunkCapacity: number, prefab: Prefab): DefaultDynamicBatchRenderer {
        // 实例化
        let tempNode = instantiate(prefab);
        // 从预制体提取网格数据
        let tempMeshRenderer = tempNode.getComponent(MeshRenderer);
        let tempMesh = tempMeshRenderer.mesh;
        let tempMaterial = tempMeshRenderer.getSharedMaterial(0);
        // 创建 BatchRenderer
        const batchRenderer = new DefaultDynamicBatchRenderer(chunkCapacity, tempMesh, tempMaterial);
        // 创建完成 销毁 临时节点
        tempNode.destroy();
        // 返回
        return batchRenderer;
    }

}

export {
    BatchRendererBuilder
}