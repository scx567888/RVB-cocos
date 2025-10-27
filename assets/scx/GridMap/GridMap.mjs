import {GridCell} from "./GridCell.mjs"

/**
 * 一个网格容器, 可用于 寻敌, 空间划分 等
 * 每一个格子都是正方形
 * @template {GridCell} T
 */
class GridMap {

    /**
     * 世界 X (世界坐标系)
     * @type {number}
     */
    worldX;

    /**
     * 世界 Y (世界坐标系)
     * @type {number}
     */
    worldY;

    /**
     * 世界宽度 (世界坐标系)
     * @type {number}
     */
    worldWidth;

    /**
     * 世界高度 (世界坐标系)
     * @type {number}
     */
    worldHeight;

    /**
     * 格子大小 (正方形) (世界坐标系)
     * @type {number}
     */
    cellSize;

    /**
     * 横向的格子数量 (Grid 坐标系)
     * @type {number}
     */
    gridWidth;

    /**
     * 纵向的格子数量 (Grid 坐标系)
     * @type {number}
     */
    gridHeight;

    /**
     * 格子 (二维数组)
     * @type {T[][]}
     */
    cells;

    /**
     * 创建一个 GridMap
     * @param {number} worldX   世界 X
     * @param {number} worldY  世界 Y
     * @param {number}  worldWidth  世界宽度
     * @param {number} worldHeight  世界高度
     * @param {number} cellSize  格子大小 (正方形宽高)
     * @param CellClass 格子构造函数
     */
    constructor(worldX, worldY, worldWidth, worldHeight, cellSize, CellClass = GridCell) {
        if (worldWidth <= 0 || worldHeight <= 0 || cellSize <= 0) {
            throw new Error("worldWidth, worldHeight, cellSize 必须为正数");
        }
        this.worldX = worldX;
        this.worldY = worldY;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.cellSize = cellSize;

        // 计算有多少个格子
        this.gridWidth = Math.ceil(worldWidth / cellSize);
        this.gridHeight = Math.ceil(worldHeight / cellSize);

        // 创建二维数组
        this.cells = [];
        for (let gridY = 0; gridY < this.gridHeight; gridY++) {
            const row = [];
            for (let gridX = 0; gridX < this.gridWidth; gridX++) {
                let cell = new CellClass(
                    gridX, gridY,
                    this.gridToWorldStartX(gridX), this.gridToWorldStartY(gridY),
                    this.gridToWorldEndX(gridX), this.gridToWorldEndY(gridY),
                );
                row.push(cell);
            }
            this.cells.push(row);
        }

    }

    /**
     * 世界坐标 X 转 Grid 坐标 X
     * 坐标正好在格子边界时, 归入索引较大的格子.
     * @param {number} x X 坐标 (世界坐标系)
     * @returns {number} 格子 X (Grid 坐标系)
     */
    worldToGridX(x) {
        return Math.floor((x - this.worldX) / this.cellSize);
    }

    /**
     * 世界坐标 Y 转 Grid 坐标 Y
     * 坐标正好在格子边界时, 归入索引较大的格子.
     * @param {number} y Y 坐标 (世界坐标系)
     * @returns {number} 格子 Y (Grid 坐标系)
     */
    worldToGridY(y) {
        return Math.floor((y - this.worldY) / this.cellSize);
    }

    /**
     * Grid 坐标 X 转 格子起始 X 坐标 (世界坐标系)
     * @param {number} gridX
     * @return {number} 格子起始 X 坐标
     */
    gridToWorldStartX(gridX) {
        return this.worldX + gridX * this.cellSize;
    }

    /**
     * Grid 坐标 Y 转 格子起始 Y 坐标 (世界坐标系)
     * @param {number} gridY
     * @returns {number} 格子起始 Y 坐标
     */
    gridToWorldStartY(gridY) {
        return this.worldY + gridY * this.cellSize;
    }

    /**
     * Grid 坐标 X 转 格子结束 X 坐标 (世界坐标系)
     * @param {number} gridX
     * @returns {number} 格子结束 X 坐标
     */
    gridToWorldEndX(gridX) {
        return this.gridToWorldStartX(gridX) + this.cellSize;
    }

    /**
     * Grid 坐标 Y 转 格子结束 Y 坐标 (世界坐标系)
     * @param {number}  gridY
     * @returns {number} 格子结束 Y 坐标
     */
    gridToWorldEndY(gridY) {
        return this.gridToWorldStartY(gridY) + this.cellSize;
    }

    /**
     * 获取格子 (越界会返回 null)
     * @param {number} gridX (Grid 坐标系)
     * @param {number} gridY (Grid 坐标系)
     * @returns {T} 格子
     */
    getCell(gridX, gridY) {
        // 越界判断
        if (gridX < 0 || gridX >= this.gridWidth || gridY < 0 || gridY >= this.gridHeight) {
            return null;
        }
        return this.cells[gridY][gridX];
    }

    /**
     * 获取格子 (越界会返回 边界)
     * @param {number} gridX (Grid 坐标系)
     * @param {number} gridY (Grid 坐标系)
     * @returns {T} 格子
     */
    getCellSafe(gridX, gridY) {
        if (gridX < 0) {
            gridX = 0;
        } else if (gridX >= this.gridWidth) {
            gridX = this.gridWidth - 1;
        }
        if (gridY < 0) {
            gridY = 0;
        } else if (gridY >= this.gridHeight) {
            gridY = this.gridHeight - 1;
        }
        return this.cells[gridY][gridX];
    }

    /**
     * 根据世界坐标获取格子 (越界返回 null)
     * @param {number} x (世界坐标系)
     * @param {number} y (世界坐标系)
     * @returns {T} 格子
     */
    getCellByWorldPosition(x, y) {
        const gridX = this.worldToGridX(x);
        const gridY = this.worldToGridY(y);
        return this.getCell(gridX, gridY);
    }

    /**
     * 根据世界坐标获取格子 (越界返回 边界)
     * @param {number} x (世界坐标系)
     * @param {number} y (世界坐标系)
     * @returns {T} 格子
     */
    getCellByWorldPositionSafe(x, y) {
        const gridX = this.worldToGridX(x);
        const gridY = this.worldToGridY(y);
        return this.getCellSafe(gridX, gridY);
    }

    /**
     * 遍历所有格子
     * @param {function(T): boolean} callback - 回调 (允许中途退出)
     */
    forEachCell(callback) {
        for (let gridY = 0; gridY < this.gridHeight; gridY++) {
            for (let gridX = 0; gridX < this.gridWidth; gridX++) {
                const cell = this.cells[gridY][gridX];
                let stop = callback(cell);
                if (stop === true) {
                    return;
                }
            }
        }
    }


    // **************************************** find 方法 ******************************************

    /**
     * 查找 矩形区域内格子 (相交包含)
     * @param {number} centerX - 中心 X (世界坐标)
     * @param {number} centerY - 中心 Y (世界坐标)
     * @param {number} width - 矩形宽度 (世界坐标)
     * @param {number} height - 矩形高度 (世界坐标)
     * @param {function(T): boolean} callback - 回调 (允许中途退出)
     */
    findCellsInRect(centerX, centerY, width, height, callback) {
        // 1. 计算所覆盖的格子
        let startGridX = Math.max(this.worldToGridX(centerX - width / 2), 0);
        let endGridX = Math.min(this.worldToGridX(centerX + width / 2), this.gridWidth - 1);
        let startGridY = Math.max(this.worldToGridY(centerY - height / 2), 0);
        let endGridY = Math.min(this.worldToGridY(centerY + height / 2), this.gridHeight - 1);

        // 2. 遍历格子
        for (let gridY = startGridY; gridY <= endGridY; gridY++) {
            for (let gridX = startGridX; gridX <= endGridX; gridX++) {
                const cell = this.cells[gridY][gridX];
                // 调用回调函数
                let stop = callback(cell);
                if (stop === true) {
                    return
                }
            }
        }
    }

    /**
     * 查找 圆形区域内格子 (朴素算法) (相交包含)
     * @param {number} centerX - 圆心 X (世界坐标)
     * @param {number} centerY - 圆心 Y (世界坐标)
     * @param {number} radius - 半径 (世界坐标)
     * @param {function(T): boolean} callback - 回调 (允许中途退出)
     */
    findCellsInCircleNaive(centerX, centerY, radius, callback) {
        // 1. 计算所覆盖的格子
        let startGridX = Math.max(this.worldToGridX(centerX - radius), 0);
        let endGridX = Math.min(this.worldToGridX(centerX + radius), this.gridWidth - 1);
        let startGridY = Math.max(this.worldToGridY(centerY - radius), 0);
        let endGridY = Math.min(this.worldToGridY(centerY + radius), this.gridHeight - 1);

        // 1.1. 计算常量值
        const radius2 = radius * radius;

        // 2. 遍历格子
        for (let gridY = startGridY; gridY <= endGridY; gridY++) {
            for (let gridX = startGridX; gridX <= endGridX; gridX++) {
                const cell = this.cells[gridY][gridX];

                // 2.1. 跳过不在圆的范围内的

                // 计算格子水平方向上到圆心的最短距离
                let dx = 0;
                if (centerX < cell.worldStartX) {
                    dx = cell.worldStartX - centerX; // 圆心在格子左边
                } else if (centerX > cell.worldEndX) {
                    dx = centerX - cell.worldEndX; // 圆心在格子右边
                }

                // 计算格子垂直方向上到圆心的最短距离
                let dy = 0;
                if (centerY < cell.worldStartY) {
                    dy = cell.worldStartY - centerY; // 圆心在格子上边
                } else if (centerY > cell.worldEndY) {
                    dy = centerY - cell.worldEndY; // 圆心在格子下边
                }

                // 勾股定理 判断是否在圆的范围内
                if (dx * dx + dy * dy > radius2) {
                    continue;
                }

                // 调用回调函数
                let stop = callback(cell);
                if (stop === true) {
                    return
                }

            }
        }
    }

    /**
     * 查找 圆形区域内格子 (扫描线算法)  (相交包含)
     * @param {number} centerX - 圆心 X (世界坐标)
     * @param {number} centerY - 圆心 Y (世界坐标)
     * @param {number} radius - 半径 (世界坐标)
     * @param {function(T): boolean} callback - 回调 (允许中途退出)
     */
    findCellsInCircleScanLine(centerX, centerY, radius, callback) {
        // 1. 计算覆盖的行范围
        let startGridY = Math.max(this.worldToGridY(centerY - radius), 0);
        let endGridY = Math.min(this.worldToGridY(centerY + radius), this.gridHeight - 1);

        // 1.1. 计算常量值
        const radius2 = radius * radius;

        // 2. 循环每一行
        for (let gridY = startGridY; gridY <= endGridY; gridY++) {
            // 计算当前行的 上下 Y (世界坐标距离)
            const worldStartY = this.gridToWorldStartY(gridY);
            const worldEndY = this.gridToWorldEndY(gridY);

            // 计算当前行垂直方向上到圆心的最短距离
            let dy = 0;
            if (centerY < worldStartY) {
                dy = worldStartY - centerY; // 圆心在格子上边
            } else if (centerY > worldEndY) {
                dy = centerY - worldEndY; // 圆心在格子下边
            }

            // 计算当前行覆盖的列范围
            const dxMax = Math.sqrt(radius2 - dy * dy);
            let startGridX = Math.max(this.worldToGridX(centerX - dxMax), 0);
            let endGridX = Math.min(this.worldToGridX(centerX + dxMax), this.gridWidth - 1);

            // 遍历当前行
            for (let gridX = startGridX; gridX <= endGridX; gridX++) {
                const cell = this.cells[gridY][gridX];
                // 调用回调函数
                let stop = callback(cell);
                if (stop === true) {
                    return;
                }
            }

        }
    }

}

export {
    GridMap
}