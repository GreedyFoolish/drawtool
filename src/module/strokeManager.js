import {Stroke} from "./stroke";
import {Core} from "@/module/core.js";

export class StrokeManager {
    _board
    _contain
    _documentEvent
    _map = new Map()
    _svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    _selected = new Proxy({},
        {
            set: (target, key, newValue, receiver) => {
                return Reflect.set(target, key, newValue, receiver)
            }
        }
    )

    constructor(board) {
        this._board = board
        this._svg.classList.add("boardSvg")
        this._svg.setAttribute("draggable", false)
        this._svg.innerHTML = `<defs></defs>`
    }

    getStrokeIdList() {
        return [...this._map.keys()]
    }

    getStrokeList() {
        return [...this._map.values()]
    }

    getById(id) {
        return this._map.get(id)
    }

    addBorder(border) {
        this._board.addBorder(border)
    }

    /**
     * 根据传入笔画类型，进行笔画添加操作
     * @param stroke 传入笔画
     * @returns {*|*[]}
     */
    add(stroke) {
        if (stroke.constructor === Stroke) {
            let id = this.addStroke(stroke)
            // 根据类型进行对应初始化
            switch (stroke._type) {
                case "draw":
                    break
                case "straight":
                    stroke.addLine(stroke._points[0], stroke._points[1])
                    break
                case "circular":
                    stroke.addCircular(stroke._points[0], stroke._points[1])
                    break
                case "triangle":
                    stroke.addTriangle(stroke._points[0], stroke._points[1])
                    break
                default:
                    break
            }
            const strokeList = stroke._strokeList
            let path = ""
            if (strokeList.length > 0) {
                strokeList.forEach(item => {
                    // 根据笔画列表生成对应的笔画
                    const curStroke = new Stroke({...item._config}, item._points, item._id)
                    // 根据生成的笔画生成对应的 path 标签
                    switch (item._type) {
                        case "draw":
                            path += Core.getPressurePathFromStroke(curStroke)
                            break
                        case "straight":
                            path += Core.getLinePathFromStroke(curStroke, curStroke._points[0], curStroke._points[1])
                            break
                        case "circular":
                            path +=
                                Core.getCircularPathFromStroke(curStroke, curStroke._points[0], curStroke._points[1])
                            break
                        case "triangle":
                            path +=
                                Core.getTrianglePathFromStroke(curStroke, curStroke._points[0], curStroke._points[1])
                            break
                        default:
                            break
                    }
                })
            }
            // 将生成的 path 标签挂载到笔画上
            this._map.get(id)._g.innerHTML += path
            return id
        } else if (stroke.constructor === StrokeManager) {
            return stroke.getStrokeList().filter(s => s.constructor === Stroke).map(s => this.addStroke(s))
        } else if (stroke.constructor === Array) {
            return stroke.filter(s => s.constructor === Stroke).map(s => this.addStroke(s))
        } else {
            throw new Error("stroke type error")
        }
    }

    addStroke(stroke) {
        const id = stroke.bind(this)
        this._map.set(id, stroke)
        this.loadStroke(stroke)
        return id
    }

    loadStroke(stroke) {
        stroke.mount(this._svg)
    }

    mount(contain) {
        this._contain = contain
        this._contain.append(this._svg)
        this._documentEvent = () => {
            this._selected.value = undefined
        }
        document.body.addEventListener("pointerdown", this._documentEvent)
    }

    unMount() {
        this.clear()
        this._svg.remove()
        document.body.removeEventListener("mousedown", this._documentEvent)
    }

    clear() {
        for (const [id, stroke] of this._map) {
            stroke.unMount()
            this._map.delete(id)
        }
        return this
    }

    remove(item) {
        const id = item.constructor === Stroke ? item._id : item
        this.removeById(id)
        return this
    }

    removeById(id) {
        this._map.get(id).unMount()
        this._map.delete(id)
        return this
    }

    /**
     * 获取当前笔画的视口布局信息
     * @returns {DOMRect} 视口布局信息
     */
    get rect() {
        return this._svg.getBoundingClientRect()
    }

    /**
     * 获取与传入点有交集的笔画
     * @param x 传入点水平坐标
     * @param y 传入点垂直坐标
     * @returns {*} 与传入点有交集的笔画
     */
    getStrokeListByPoint({x, y}) {
        return this.getStrokeList().filter(stroke => {
            const rect = stroke.rect
            return !(rect.left > x || rect.right < x || rect.top > y || rect.bottom < y)
        })
    }

    /**
     * 根据传入 id 查询该笔画的视口布局信息
     * @param id 传入 id
     * @returns {DOMRect} 笔画的视口布局信息
     */
    getStrokeListRectById(id = this.getStrokeIdList()) {
        const idList = [id].flat(Infinity).filter(id => this._map.has(id))
        if (idList.length > 0) {
            const rect = {
                left: Infinity,
                right: -Infinity,
                top: Infinity,
                bottom: -Infinity
            }
            idList.forEach((id, index) => {
                const strokeRect = (this._map.get(id)).rect
                rect.left = Math.min(rect.left, strokeRect.left)
                rect.top = Math.min(rect.top, strokeRect.top)
                rect.right = Math.max(rect.right, strokeRect.right)
                rect.bottom = Math.max(rect.bottom, strokeRect.bottom)
            })
            const svgRect = this._svg.getBoundingClientRect()
            return new DOMRect(
                rect.left - svgRect.left,
                rect.top - svgRect.top,
                rect.right - rect.left,
                rect.bottom - rect.top
            )
        } else {
            throw new Error("No stroke has those id or in this id list!")
        }
    }

    /**
     * 根据传入的 rect 和 lastRect 计算当前笔画和上一步笔画的视图距离
     * @param rect 当前笔画的视口布局信息
     * @param lastRect 上一步笔画的视口布局信息
     * @param dist 距离标准，默认值 30
     * @returns {boolean}
     */
    computeDist(rect, lastRect, dist = 30) {
        const {top, right, bottom, left} = rect
        const {top: lastTop, right: lastRight, bottom: lastBottom, left: lastLeft} = lastRect
        const vertex = [
            {x: left, y: top},
            {x: left, y: bottom},
            {x: right, y: top},
            {x: right, y: bottom}
        ]
        const lastVertex = [
            {x: lastLeft, y: lastTop},
            {x: lastLeft, y: lastBottom},
            {x: lastRight, y: lastTop},
            {x: lastRight, y: lastBottom}
        ]
        for (const item of vertex) {
            if (item.x >= lastLeft && item.x <= lastRight && item.y >= lastTop && item.y <= lastBottom) {
                // 若当前笔画视图四个顶点在上一步笔画的视图内，则需要合并
                return true
            }
        }
        for (const item of lastVertex) {
            if (item.x >= left && item.x <= right && item.y >= top && item.y <= bottom) {
                // 若上一步笔画视图四个顶点在当前笔画的视图内，则需要合并
                return true
            }
        }
        // 若当前笔画视图的上边界/下边界在上一步笔画的视图上下边界范围内，则需要进行判定
        if ((top >= lastTop && top <= lastBottom) || (bottom >= lastTop && bottom <= lastBottom)) {
            const ll = Math.abs(left - lastLeft)
            const lr = Math.abs(left - lastRight)
            const rl = Math.abs(right - lastLeft)
            const rr = Math.abs(right - lastRight)
            if (ll <= dist || lr <= dist || rl <= dist || rr <= dist) {
                // 若当前笔画视图左边界/右边界在上一步笔画的视图左右边界范围内，则需要合并
                return true
            }
        }
        // 若上一步笔画视图的上边界/下边界在当前笔画的视图上下边界范围内，则需要进行判定
        if ((lastTop >= top && lastTop <= bottom) || (lastBottom >= top && lastBottom <= bottom)) {
            const ll = Math.abs(left - lastLeft)
            const lr = Math.abs(left - lastRight)
            const rl = Math.abs(right - lastLeft)
            const rr = Math.abs(right - lastRight)
            if (ll <= dist || lr <= dist || rl <= dist || rr <= dist) {
                // 若上一步笔画视图左边界/右边界在当前笔画的视图左右边界范围内，则需要合并
                return true
            }
        }
        // 若当前笔画视图的左边界/右边界在上一步笔画的视图左右边界范围内，则需要进行判定
        if ((left >= lastLeft && left <= lastRight) || (right >= lastLeft && right <= lastRight)) {
            const tt = Math.abs(top - lastTop)
            const tb = Math.abs(top - lastBottom)
            const bt = Math.abs(bottom - lastTop)
            const bb = Math.abs(bottom - lastBottom)
            if (tt <= dist || tb <= dist || bt <= dist || bb <= dist) {
                // 若当前笔画视图上边界/下边界在上一步笔画的视图上下边界范围内，则需要合并
                return true
            }
        }
        // 若上一步笔画视图的左边界/右边界在当前笔画的视图左右边界范围内，则需要进行判定
        if ((lastLeft >= left && lastLeft <= right) || (lastRight >= left && lastRight <= right)) {
            const tt = Math.abs(top - lastTop)
            const tb = Math.abs(top - lastBottom)
            const bt = Math.abs(bottom - lastTop)
            const bb = Math.abs(bottom - lastBottom)
            if (tt <= dist || tb <= dist || bt <= dist || bb <= dist) {
                // 若上一步笔画视图上边界/下边界在当前笔画的视图上下边界范围内，则需要合并
                return true
            }
        }
        return false
    }

    /**
     * 判断的当前笔画是否需要和上一步笔画合并及合并操作
     * @param stroke 当前笔画
     * @param id 当前笔画id
     * @param type 当前笔画类型
     * @param dist 距离标准，默认值 30
     */
    mergeStroke(stroke, id, type = "draw", dist = 30) {
        const gList = this._svg.querySelectorAll(`[data-type="${type}"]`)
        const gSize = gList.length
        if (gSize > 1) {
            // 获取上一步笔画对象
            const lastStroke = this._map.get(gList[gSize - 2].id)
            // 判断当前笔画和上一步笔画是否需要合并
            const mergeFlag = this.computeDist(stroke.rect, lastStroke.rect, dist)
            if (mergeFlag) {
                const lastNode = this._map.get(lastStroke._id)
                const curNode = this._map.get(id)
                const lastG = lastNode._g
                const curG = curNode._g
                const curPath = curG.querySelectorAll('path')
                for (const node of curPath) {
                    lastG.appendChild(node)
                }
                // 移除当前笔画的 g 标签
                this._svg.removeChild(curG)
                // 将当前笔画信息挂载到上一步笔画的笔画列表
                lastNode.addStrokeList(curNode)
                // 删除笔画映射表中当前笔画的相关信息
                this._map.delete(id)
                stroke = lastStroke
            }
        }
        return stroke
    }
}
