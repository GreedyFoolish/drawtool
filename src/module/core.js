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
                    data-id="${stroke._id}"
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

    /**
     * 根据传入的笔画信息及起始，终止点，生成 svg 对象的 path 标签
     * @param stroke 传入的笔画信息
     * @param start 起始点
     * @param end 终止点
     * @returns {string} svg 对象的 path 标签
     */
    static getLinePathFromStroke(stroke, start, end) {
        const {_config} = stroke
        const path = `M ${start._x.toFixed(2)},${start._y.toFixed(2)} 
                      L${end._x.toFixed(2)},${end._y.toFixed(2)}`
        return `<path d="${path}"
                    fill="none"
                    data-id="${stroke._id}"
                    stroke="${_config?.color ?? '#000'}"
                    stroke-width="${_config?.borderWidth ?? 3}"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                />`
    }

    /**
     * 根据传入的笔画信息及起始，终止点，生成 svg 对象的 path 标签
     * @param stroke 传入的笔画信息
     * @param start 起始点
     * @param end 终止点
     * @returns {string} svg 对象的 path 标签
     */
    static getCircularPathFromStroke(stroke, start, end) {
        const {_config} = stroke
        const startX = parseFloat(start._x.toFixed(2))
        const startY = parseFloat(start._y.toFixed(2))
        const endX = parseFloat(end._x.toFixed(2))
        const endY = parseFloat(end._y.toFixed(2))
        const midX = parseFloat(((startX + endX) / 2).toFixed(2))
        const midY = parseFloat(((startY + endY) / 2).toFixed(2))
        const disX = parseFloat((Math.abs(startX - endX) / 2).toFixed(2))
        const disY = parseFloat((Math.abs(startY - endY) / 2).toFixed(2))
        const radius = Math.sqrt(disX * disX, disY * disY)
        // 此为画椭圆参数
        const path = `M ${midX} ${midY} m ${-1 * radius} 0
                      a ${disX} ${disY} 0 1 0 ${disX * 2} 0
                      a ${disX} ${disY} 0 1 0 ${disX * -2} 0`
        // 此为画圆参数
        // const path = `M ${midX} ${midY} m ${-1 * radius} 0
        //               a ${radius} ${radius} 0 1 0 ${radius * 2} 0
        //               a ${radius} ${radius} 0 1 0 ${radius * -2} 0`
        return `<path d="${path}"
                    fill="none"
                    data-id="${stroke._id}"
                    stroke="${_config?.color ?? '#000'}"
                    stroke-width="${_config?.borderWidth ?? 3}"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                />`
    }

}
