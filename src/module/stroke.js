import {Point} from "./point";
import {Core} from "./core";

export class Stroke {
    _config
    _contain
    _strokeManager
    _type = "draw"
    _points = []
    _id = Core.uuid()
    _g = document.createElementNS("http://www.w3.org/2000/svg", "g")
    _offset = new Proxy(
        {x: 0, y: 0},
        {
            set: (target, key, newValue, receiver) => {
                const r = Reflect.set(target, key, newValue, receiver)
                const _content = this._strokeManager._board._content
                const zoom = _content?.getAttribute('data-zoom') ? _content?.getAttribute('data-zoom') : 1
                this._g.setAttribute("transform", `translate(${target.x / zoom},${target.y / zoom})`)
                return r
            }
        }
    )

    constructor(config, points, id) {
        if (id) {
            this._id = id
        }
        this._config = JSON.parse(JSON.stringify({...this._config, ...config}))
        this.reDraw()
        this.add(points)
        this.addEvent()
        this._type = "draw"
    }

    /**
     * 调用 Core 的 getPathFromStroke 方法，对笔画进行重新绘制
     */
    reDraw() {
        // this._g.innerHTML = Core.getPathFromStroke(this)
        this._g.innerHTML = Core.getPressurePathFromStroke(this)
    }

    /**
     * 根据传入点的集合，对笔画进行重新绘制
     * @param points 传入点的集合
     * @returns {Stroke}
     */
    add(points) {
        if (points?.constructor === Point) {
            this._points.push(points)
        } else if (points?.constructor === Array) {
            for (const point of points) {
                this._points.push(point)
            }
        }
        this.reDraw()
        return this
    }

    /**
     * 添加笔画鼠标拖动和失去焦点的事件处理函数
     */
    addEvent() {
        this._g.id = this._id
        // 笔画鼠标拖动事件
        this._g.addEventListener("mousedown", (e) => {
            const rect = this.rect
            if (rect) {
                this.addBorder(rect)
            }
            const start = {
                x: e.x,
                y: e.y,
                offsetX: this._offset.x,
                offsetY: this._offset.y,
            }
            const move = (e) => {
                this._offset.x = e.x - start.x + start.offsetX
                this._offset.y = e.y - start.y + start.offsetY
                const rect = this.rect
                if (rect) {
                    this.addBorder(rect)
                }
            }
            const end = (e) => {
                move(e)
                document.body.removeEventListener("mousemove", move)
                document.body.removeEventListener("mouseup", end)
            }
            document.body.addEventListener("mousemove", move)
            document.body.addEventListener("mouseup", end)
        })
        // 笔画失去焦点事件
        this._g.addEventListener("blur", (e) => {
            this._strokeManager.addBorder()
        })
    }

    /**
     * 添加笔画的高亮框
     * @param rect 笔画的视口布局信息
     * @param lineWidth 高亮框宽度 默认2px
     * @param lineStyle 高亮框样式 默认虚线
     * @param lineColor 高亮框颜色 默认黑色
     */
    addBorder(rect, lineWidth = 2, lineStyle = "dashed", lineColor = "black") {
        const border = document.createElement("div")
        const svgRect = this._strokeManager.rect
        const {borderWidth} = this._config
        border.style.width = `${rect.width + borderWidth - lineWidth}px`
        border.style.height = `${rect.height + borderWidth - lineWidth}px`
        border.style.position = "absolute"
        border.style.left = `${rect.x - svgRect.x - borderWidth / 2}px`
        border.style.top = `${rect.y - svgRect.y - borderWidth / 2}px`
        border.style.border = `${lineWidth}px ${lineStyle} ${lineColor}`
        this._strokeManager.addBorder(border)
    }

    addLine(start, end) {
        if (start.constructor !== Point || end.constructor !== Point) {
            console.warn("The endpoint types at both ends of the line are wrong")
        }
        this._points = [start, end]
        this._g.innerHTML = Core.getLinePathFromStroke(this, start, end)
        this._type = "straight"
    }

    addCircular(start, end) {
        if (start.constructor !== Point || end.constructor !== Point) {
            console.warn("The endpoint types at both ends of the circular are wrong")
        }
        this._points = [start, end]
        this._g.innerHTML = Core.getCircularPathFromStroke(this, start, end)
        this._type = "circular"
    }

    addTriangle(start, end) {
        if (start.constructor !== Point || end.constructor !== Point) {
            console.warn("The endpoint types at both ends of the circular are wrong")
        }
        this._points = [start, end]
        this._g.innerHTML = Core.getTrianglePathFromStroke(this, start, end)
        this._type = "triangle"
    }

    /**
     * 将当前笔画的笔画管理对象绑定为传入的笔画管理对象
     * @param strokeManager 传入的笔画管理对象
     * @returns {string}
     */
    bind(strokeManager) {
        this._strokeManager = strokeManager
        return this._id
    }

    mount(contain) {
        this._contain = contain
        this._contain.append(this._g)
    }

    unMount() {
        this._g.remove()
    }

    /**
     * 获取当前笔画的视口布局信息
     * @returns {DOMRect} 视口布局信息
     */
    get rect() {
        return this._g.getBoundingClientRect()
    }
}
