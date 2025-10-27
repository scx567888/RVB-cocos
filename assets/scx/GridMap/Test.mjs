import {GridMap} from "./GridMap.mjs";

/**
 * @type {GridMap<GridCell>}
 */
let gridMap = new GridMap(0, 0, 1000, 1000, 5);
//
// while (true) {
//     let l = Date.now();
//     for (let i = 0; i < 10000; i++) {
//         // gridMap.forEachCell((c)=>{
//         //
//         // })
//         gridMap.findCellsInRect(500, 500, 80, 80, (c) => {
//
//         })
//         // gridMap.findCellsInCircleScanLine(500, 500, 200, (c) => {
//         //
//         // })
//     }
//     console.log(Date.now() - l)
// }

//
// const list = [];
//
// for (let i = 0; i < 50000; i++) {
//     const x = Math.floor(Math.random() * 1000);
//     const y = Math.floor(Math.random() * 1000);
//     list.push({x: x, y: y})
// }
//
// var ssss = [];
// var ssss1 = [];
//
// // 传统方法
// while (true) {
//     var data = Date.now();
//     for (let i = 0; i < list.length; i++) {
//         const e = list[i];
//         let nearest = null;
//         let minDist = Infinity;
//
//         for (let j = 0; j < list.length; j++) {
//             if (i === j) continue; // 不和自己比
//             const other = list[j];
//             const dx = e.x - other.x;
//             const dy = e.y - other.y;
//             const dist = Math.sqrt(dx * dx + dy * dy); // 欧几里得距离
//             if (dist < minDist) {
//                 minDist = dist;
//                 nearest = other;
//             }
//         }
//         ssss.push({a: e, b: nearest})
//     }
//     console.log(Date.now() - data)
//     // break
// }
//
// const map = GridMap.create(100, 100, 1000, 1000);
//
//
// while (true) {
//     ssss1 = []
//     let data = Date.now();
//     map.forEachCell(c => {
//         c.items = [];
//     })
//     for (let i = 0; i < list.length; i++) {
//         let e = list[i];
//         let cell = map.getCellByWorldPositionSafe(e.x, e.y)
//         cell.items.push(e)
//     }
//     // 此处利用网格实现最近查找?
//     for (let i = 0; i < list.length; i++) {
//         let e = list[i];
//         map.findNeighbor(e.x, e.y, 9999, (c) => {
//             let nearest = null;
//             let minDist = Infinity;
//             for (let gridCell of c) {
//                 for (let other of gridCell.items) {
//                     if (e === other) continue; // 不和自己比
//                     const dx = e.x - other.x;
//                     const dy = e.y - other.y;
//                     const dist = Math.sqrt(dx * dx + dy * dy); // 欧几里得距离
//                     if (dist < minDist) {
//                         minDist = dist;
//                         nearest = other;
//                     }
//                 }
//                 if (nearest != null) {
//                     ssss1.push({a: e, b: nearest})
//                     return true
//                 }
//             }
//
//         })
//     }
//
//     console.log(Date.now() - data)
//     // debugger
// }
//
// // console.log(ssss)
// // console.log(ssss1)
