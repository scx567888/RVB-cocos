/**
 * 表示 GridMap 中的一个单元, 可以继承以实现更多功能
 */
class GridCell {

    /**
     *  自己所在的 列 (Grid 坐标系)
     *  @type {number}
     */
    gridX;

    /**
     * 自己所在的 行 (Grid 坐标系)
     *  @type {number}
     */
    gridY;

    /**
     * 格子起始 X 坐标 (世界坐标系)
     *  @type {number}
     */
    worldStartX;

    /**
     * 格子起始 Y 坐标 (世界坐标系)
     *  @type {number}
     */
    worldStartY;

    /**
     * 格子结束 X 坐标 (世界坐标系)
     *  @type {number}
     */
    worldEndX;

    /**
     * 格子结束 Y 坐标 (世界坐标系)
     *  @type {number}
     */
    worldEndY;

    /**
     * @param {number} gridX
     * @param {number} gridY
     * @param {number} worldStartX
     * @param {number} worldStartY
     * @param {number} worldEndX
     * @param {number} worldEndY
     */
    constructor(gridX, gridY, worldStartX, worldStartY, worldEndX, worldEndY) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.worldStartX = worldStartX;
        this.worldStartY = worldStartY;
        this.worldEndX = worldEndX;
        this.worldEndY = worldEndY;
    }

}

export {
    GridCell
}