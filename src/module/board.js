import "./board.styl"
import {Core} from "@/module/core.js";
import {StrokeManager} from "./strokeManager.js";
import {Stroke} from "@/module/stroke.js";
import {Point} from "@/module/point.js";
import {Textarea} from "@/module/textarea.js";
import {TextareaManager} from "@/module/textareaManager.js";

export class Board {
    _content
    _drawConfig
    _modeSet = new Set(["arrow", "draw", "eraser", "word", "straight", "circular", "triangle"])
    _mode = "draw"
    _eventMap = {
        beforeDraw: {},
        afterDraw: {},
        pointChanged: {},
        modeChange: {},
        contentChange: {},
        drawConfigChange: {}
    }
    _parent = document.createElement("div")
    _writeBoard = document.createElement("div")
    _writeRemoveBoard = document.createElement("div")
    _strokeManager = new StrokeManager(this)
    _textareaManager = new TextareaManager(this)

    constructor(content, config = {
        mode: "draw",
        drawConfig: {},
        event: [],
        strokes: []
    }) {
        this.setConfig(config)
        this.init()
        this.setStructure(content)
        this.addBoardEvent()
    }

    /**
     * 添加自定义事件监听
     * @param eventName 事件名称
     * @param fn 事件处理函数
     * @returns {string}
     */
    addCustomEventListener(eventName, fn) {
        if (eventName in this._eventMap) {
            const id = Core.uuid()
            Reflect.set(this._eventMap[eventName], id, fn)
            return id
        }
    }

    /**
     * 触发自定义事件
     * @param eventName 事件名称
     * @param data 事件数据
     */
    triggerEvent(eventName, ...data) {
        for (const event of Object.values(this._eventMap[eventName] ?? {}) ?? []) {
            event(...data)
        }
    }

    setConfig(config) {
        this.setMode(config.value.mode)
        if ("drawConfig" in config.value) {
            this.setDrawConfig(config.value.drawConfig)
        }
        if ("event" in config.value) {
            for (const {eventName, fn} of config.value.event) {
                this.addCustomEventListener(eventName, fn)
            }
        }
        if ("strokes" in config.value) {
            this._strokeManager.add(config.value.strokes)
        }
    }

    setMode(mode) {
        if (this._modeSet.has(mode)) {
            this._mode = mode
            this._parent.setAttribute("data-mode", mode)
            this._textareaManager.clear()
            this.triggerEvent("modeChange", this._mode)
        } else {
            // throw new Error("Not allowed mode")
            console.error("Not allowed mode")
        }
        return this
    }

    setDrawConfig(drawConfig, replace = false) {
        this._drawConfig = replace ? drawConfig : {...this._drawConfig, ...drawConfig}
        this.triggerEvent("drawConfigChange", this._drawConfig)
        return this
    }

    init() {
        this._parent.classList.add("boardParent")
        this._writeBoard.classList.add("writeBoard")
        this._writeRemoveBoard.classList.add("writeRemoveBoard")
    }

    setStructure(content) {
        if (typeof content === "string") {
            content = document.querySelector(content)
        }
        this._content = content
        this._parent.remove()
        this.setParent()
        this._parent.append(this._writeBoard)
        this._parent.append(this._writeRemoveBoard)
        this.triggerEvent("contentChange", this._content)
        return this
    }

    setParent() {
        if (this._content) {
            this._content.append(this._parent)
            this._strokeManager.mount(this._parent)
        }
        return this
    }

    addBoardEvent() {
        this._writeBoard.addEventListener("pointerdown", (e) => {
            if (this._mode === "draw") {
                this.draw(e)
            } else if (this._mode === "word") {
                this.word(e)
            }
        })
        this._writeRemoveBoard.addEventListener("pointerdown", (e) => {
            const down = (e) => {
                const point = {x: e.x, y: e.y}
                this.removeStrokeFormPoint(point)
            }
            down(e)
            const up = () => {
                this._writeRemoveBoard.removeEventListener("pointermove", down)
                this._writeRemoveBoard.removeEventListener("pointerup", up)
                this._writeRemoveBoard.removeEventListener("pointerleave", up)
            }
            this._writeRemoveBoard.addEventListener("pointermove", down)
            this._writeRemoveBoard.addEventListener("pointerup", up)
            this._writeRemoveBoard.addEventListener("pointerleave", up)
        })

    }

    draw(e) {
        const stroke = new Stroke(
            {
                ...this._drawConfig,
                start: {...this._drawConfig?.start},
                end: {...this._drawConfig?.end}
            },
            []
        )
        const id = this._strokeManager.add(stroke)
        this.triggerEvent("beforeDraw", stroke, id)

        const down = (e) => {
            const {x, y} = this._writeBoard.getBoundingClientRect()
            const point = {x: e.x, y: e.y}
            this.addPoint(id, {x: point.x - x, y: point.y - y})
        }
        down(e)
        const up = () => {
            this._writeBoard.removeEventListener("pointermove", down)
            this._writeBoard.removeEventListener("pointerup", up)
            this._writeBoard.removeEventListener("pointerleave", up)
            this.triggerEvent("afterDraw", stroke, id)
        }
        this._writeBoard.addEventListener("pointermove", down)
        this._writeBoard.addEventListener("pointerup", up)
        this._writeBoard.addEventListener("pointerleave", up)
    }

    word(e) {
        const {x, y} = this._writeBoard.getBoundingClientRect()
        const start = {x: e.x, y: e.y}
        const textarea = new Textarea(
            this,
            {
                x: (start.x - x).toFixed(2),
                y: (start.y - y).toFixed(2),
                fontSize: 30,
            },
        )
        this._textareaManager.add(textarea)
    }

    /**
     * 根据传入 id 和 坐标{x, y} 添加点并重新绘制笔画
     * @param id 传入 id
     * @param x 传入 坐标 x
     * @param y 传入 坐标 y
     */
    addPoint(id, {x, y}) {
        const stroke = this._strokeManager.getById(id)
        if (stroke) {
            const point = new Point(x, y)
            stroke.add(point)
            this.triggerEvent("pointChanged", {point})
            stroke.reDraw()
        }
    }

    /**
     * 根据传入点，获取当前笔画集合与之有交集的笔画进行移除操作
     * @param point 传入点
     * @returns {Board}
     */
    removeStrokeFormPoint(point) {
        const zoom = this._content?.getAttribute("data-zoom") ? this._content?.getAttribute("data-zoom") : 1
        const zoomPoint = {
            x: point.x / parseFloat(zoom),
            y: point.y / parseFloat(zoom)
        }
        const strokes = this._strokeManager.getStrokeListByPoint(zoomPoint)
        for (const stroke of strokes) {
            this._strokeManager.remove(stroke)
        }
        return this
    }
}
