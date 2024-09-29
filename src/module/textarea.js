import {Core} from "@/module/core.js";

export class Textarea {
    _board
    _config = {
        fontFamily: "Microsoft YaHei",
        fontSize: 12,
        rows: 3,
        cols: 20,
        autofocus: true,
    }
    _contain
    _textareaManager
    _textValue
    _type = "word"
    _id = Core.uuid()
    _textarea = document.createElement("textarea")
    _g = document.createElementNS("http://www.w3.org/2000/svg", "g")
    _offset = new Proxy(
        {x: 0, y: 0},
        {
            set: (target, key, newValue, receiver) => {
                const r = Reflect.set(target, key, newValue, receiver)
                const _content = this._textareaManager._board._content
                const zoom = _content?.getAttribute('data-zoom') ? _content?.getAttribute('data-zoom') : 1
                this._g.setAttribute("transform", `translate(${target.x / zoom},${target.y / zoom})`)
                return r
            }
        }
    )

    constructor(board, config, textValue, id) {
        if (id) {
            this._id = id
        }
        this._board = board
        this.setConfig(config)
        this._textValue = textValue
        this.addEvent()
        this._type = "word"
        return this
    }

    setConfig(config) {
        this._config = JSON.parse(JSON.stringify({...this._config, ...config}))
        const {x, y, fontFamily, fontSize, rows, cols, autofocus} = this._config
        this._textarea.style.position = "absolute"
        this._textarea.style.left = x + "px"
        this._textarea.style.top = y + "px"
        this._textarea.style.fontFamily = fontFamily
        this._textarea.style.fontSize = fontSize + "px"
        this._textarea.rows = rows
        this._textarea.cols = cols
        this._textarea.autofocus = autofocus
    }

    /**
     * 添加文本框失去焦点的事件处理函数
     * 添加文本鼠标拖动和失去焦点的事件处理函数
     */
    addEvent() {
        // 文本框失去焦点事件
        this._textarea.addEventListener("blur", (e) => {
            this.textarea2Text(e)
        })
        // 文本鼠标拖动事件
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
        // 文本失去焦点事件
        this._g.addEventListener("blur", (e) => {
            this._board.addBorder()
        })
        // 若是反撤销操作，则需要触发文本框转文本事件函数
        if (this._textValue) {
            this.textarea2Text()
        }
    }

    /**
     * 文本框转文本事件函数
     * @param e 事件事件对象
     */
    textarea2Text(e) {
        const {x, y, fontFamily, fontSize, rows, cols} = this._config
        const value = this._textValue ?? e.target.value
        const wordList = value.split("\n")
        let resWord = ""
        // 统计一行写了超出一行文本的行数
        let cntRow = 0
        for (let i = 0; i < wordList.length; i++) {
            const curWord = wordList[i]
            if (curWord) {
                // 基本行高（4/3字体大小）
                const baseY = parseFloat((fontSize * 4 / 3).toFixed(2))
                // 上浮高度
                const floatY = parseFloat((fontSize / 4).toFixed(2))
                if (curWord.length > cols) {
                    const row = Math.ceil(curWord.length / cols)
                    for (let j = 0; j < row; j++) {
                        const txt = curWord.slice(j * cols, (j + 1) * cols)
                        const posY = parseFloat(y) + (i + 1 + cntRow + j) * baseY - floatY
                        resWord += `<tspan x="${x}" y="${posY}">${txt}</tspan>`
                    }
                    // 统计多出来的行数
                    cntRow += row - 1
                } else {
                    const posY = parseFloat(y) + (i + 1 + cntRow) * baseY - floatY
                    resWord += `<tspan x="${x}" y="${posY}">${curWord}</tspan>`
                }
            }
        }
        if (value === "") {
            this._g.id = this._id
        } else {
            this._g.id = this._id
            this._g.innerHTML = `<text font-family="${fontFamily}" font-size="${fontSize}">${resWord}</text>`
            this._board._strokeManager._svg.append(this._g)
            this._textarea.remove()
            this._textValue = value
            this._board.triggerEvent("removeTextarea", this._id)
        }
    }

    /**
     * 添加文本的高亮框
     * @param rect 文本的视口布局信息
     * @param lineWidth 高亮框宽度 默认2px
     * @param lineStyle 高亮框样式 默认虚线
     * @param lineColor 高亮框颜色 默认黑色
     */
    addBorder(rect, lineWidth = 2, lineStyle = "dashed", lineColor = "black") {
        const border = document.createElement("div")
        const svgRect = this._board._strokeManager.rect
        border.style.width = `${rect.width - lineWidth}px`
        border.style.height = `${rect.height - lineWidth}px`
        border.style.position = "absolute"
        border.style.left = `${rect.x - svgRect.x}px`
        border.style.top = `${rect.y - svgRect.y}px`
        border.style.border = `${lineWidth}px ${lineStyle} ${lineColor}`
        this._board.addBorder(border)
    }

    /**
     * 将当前文本的文本管理对象绑定为传入的文本管理对象
     * @param textareaManager 传入的文本管理对象
     * @returns {string}
     */
    bind(textareaManager) {
        this._textareaManager = textareaManager
        return this._id
    }

    mount(contain) {
        this._contain = contain
        this._contain.append(this._textarea)
        this._board.triggerEvent("addTextarea", this._id)
    }

    unMount() {
        this._textarea.remove()
    }

    remove() {
        this._g.remove()
    }

    /**
     * 获取当前文本的视口布局信息
     * @returns {DOMRect} 视口布局信息
     */
    get rect() {
        return this._g.getBoundingClientRect()
    }
}
