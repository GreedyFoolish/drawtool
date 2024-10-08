import {Textarea} from "@/module/textarea.js";

export class TextareaManager {
    _board
    _map = new Map()

    constructor(board) {
        this._board = board
    }

    getTextareaIdList() {
        return [...this._map.keys()]
    }

    getTextareaList() {
        return [...this._map.values()]
    }

    getById(id) {
        return this._map.get(id)
    }

    /**
     * 根据传入文本类型，进行文本添加操作
     * @param textarea 传入文本
     * @param type 文本添加类型（1、create：创建 2、revoke：撤销）
     * @returns {*}
     */
    add(textarea, type) {
        let undefinedCnt = 0
        for (const [id, item] of this._map) {
            if (item._textValue === undefined) {
                undefinedCnt++
            }
        }
        if (undefinedCnt > 0) {
            console.warn("Please complete the previous input")
            return
        }
        if (textarea.constructor === Textarea) {
            return this.addTextarea(textarea, type)
        } else {
            throw new Error("textarea type error")
        }
    }

    addTextarea(textarea, type) {
        const id = textarea.bind(this)
        this._map.set(id, textarea)
        if (type === "create") {
            this.loadTextarea(textarea)
        }
        return id;
    }

    loadTextarea(textarea) {
        textarea.mount(this._board._writeBoard)
    }

    clear() {
        for (const [id, textarea] of this._map) {
            if (textarea._textValue === undefined) {
                textarea.unMount()
                this._map.delete(id)
            }
        }
        return this
    }

    remove(item) {
        const id = item.constructor === Textarea ? item._id : item
        this.removeById(id)
        return this
    }

    removeById(id) {
        this._map.get(id).remove()
        this._map.delete(id)
        return this
    }

    /**
     * 获取与传入点有交集的文本
     * @param x 传入点水平坐标
     * @param y 传入点垂直坐标
     * @returns {*} 与传入点有交集的文本
     */
    getTextareaListByPoint({x, y}) {
        return this.getTextareaList().filter(textarea => {
            const rect = textarea.rect
            return !(rect.left > x || rect.right < x || rect.top > y || rect.bottom < y)
        })
    }
}
