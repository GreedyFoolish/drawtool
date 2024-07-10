import {Point} from "./point";
import {Core} from "./core";

export class Stroke {
    _config
    _contain
    _strokeManager
    _points = []
    _id = Core.uuid()
    _g = document.createElementNS("http://www.w3.org/2000/svg", "g")
    _offset = new Proxy(
        {x: 0, y: 0},
        {
            set: (target, key, newValue, receiver) => {
                const r = Reflect.set(target, key, newValue, receiver)
                this._g.setAttribute("transform", `translate(${target.x},${target.y})`)
                return r
            }
        }
    )

    constructor(config, points) {
        this._config = JSON.parse(JSON.stringify({...this._config, ...config}))
        this.reDraw()
        this.add(points)
        this._g.id = this._id
        this._g.addEventListener("mousedown", (e) => {
            const start = {
                x: e.x,
                y: e.y,
                offsetX: this._offset.x,
                offsetY: this._offset.y,
            }
            const move = (e) => {
                this._offset.x = e.x - start.x + start.offsetX
                this._offset.y = e.y - start.y + start.offsetY
            }
            const end = (e) => {
                move(e)
                document.body.removeEventListener("mousemove", move)
                document.body.removeEventListener("mouseup", end)
            }
            document.body.addEventListener("mousemove", move)
            document.body.addEventListener("mouseup", end)
        })
    }

    /**
     * 调用 Core 的 getPathFromStroke 方法，对笔画进行重新绘制
     */
    reDraw() {
        this._g.innerHTML = Core.getPathFromStroke(this)
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
