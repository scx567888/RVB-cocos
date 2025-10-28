import {Node, Quat, Vec3} from "cc";

/**
 * 模拟 Node
 */
interface NodeLike {

    setParent(parent: Node): void;

    getParent(): Node | null;

    setPosition(x: number, y: number, z?: number): void;

    getPosition(): Vec3;

    setRotation(x: number, y: number, z: number, w: number): void;

    setRotationFromEuler(x: number, y: number, z?: number): void;

    getRotation(): Quat;

    setScale(x: number, y: number, z?: number): void;

    getScale(): Vec3;

    setActive(active: boolean): void;

    getActive(): boolean;

    setLayer(name: string): void;

    getLayer(): string;

    destroy(): void;

}

export {
    type NodeLike
}