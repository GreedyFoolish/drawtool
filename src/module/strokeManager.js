import {Stroke} from "./stroke";

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
        this.addEvent()
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

    addEvent() {
        this._svg.addEventListener("pointerdown", e => {
            const id = (e.target).getAttribute("data-id")
            this._selected.value = this._map.get(id)
            e.stopPropagation()
        })
    }

    /**
     * 根据传入笔画类型，进行笔画添加操作
     * @param stroke 传入笔画
     * @returns {*|*[]}
     */
    add(stroke) {
        if (stroke.constructor === Stroke) {
            return this.addStroke(stroke)
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
}
