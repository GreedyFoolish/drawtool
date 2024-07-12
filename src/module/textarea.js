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
    _text
    _id = Core.uuid()
    _textarea = document.createElement("textarea")
    _g = document.createElementNS("http://www.w3.org/2000/svg", "g")

    constructor(board, config) {
        this._board = board
        this.setConfig(config)
        board._writeBoard.append(this._textarea)
        this.addEvent()
    }

    setConfig(config) {
        this._config = {...this._config, ...config}
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

    addEvent() {
        this._textarea.addEventListener("blur", (e) => {
            const {x, y, fontFamily, fontSize, rows, cols} = this._config
            const value = e.target.value
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
                this._textarea.style.display = "none"
                this._board._addTextarea = false
            }
        })
    }
}
