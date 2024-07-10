export class Core {
    /**
     * 生成 uuid
     * @returns {string} uuid
     */
    static uuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0
            const v = c == "x" ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    }

    /**
     * 根据传入的笔画信息，生成 svg 对象的 path 标签
     * @param stroke 传入的笔画信息
     * @returns {string} svg 对象的 path 标签
     */
    static getPathFromStroke(stroke) {
        const {_config} = stroke
        const path = this.getSvgPathFromStroke(stroke._points)
        return `<path d="${path}"
                    fill="none"
                    data-id="${stroke.id}"
                    stroke="${_config?.color ?? '#000'}"
                    stroke-width="${_config?.borderWidth ?? 3}"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                />`
    }

    /**
     * 根据传入点的集合，生成 path 标签的路径命令
     * @param points 传入点的集合
     * @param closed 是否闭合
     * @returns {string} 路径命令
     */
    static getSvgPathFromStroke(points, closed = false) {
        const len = points.length
        if (len < 2) {
            return ""
        }
        let a = points[0]
        let result = `M ${a._x.toFixed(2)},${a._y.toFixed(2)} `

        for (let i = 1; i < len; i++) {
            a = points[i]
            result += `L ${a._x.toFixed(2)},${a._y.toFixed(2)} `
        }
        // 是否闭合图形
        if (closed) {
            result += "Z"
        }
        return result
    }
}
