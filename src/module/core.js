import {PointPressure} from "./point-pressure.js"
import {getStroke} from "perfect-freehand";
import polygonClipping from "polygon-clipping";
export class Core {
    static average(a, b) {
        return (+a + +b) / 2
    }

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
     * 将传入的点阵转换为有压感的点阵
     * @param points 传入的点阵
     * @returns {[]}
     */
    static point2pointPressure(points) {
        const pointPressureList = []
        points.forEach(item => {
            pointPressureList.push(new PointPressure(item._x, item._y, 0.5))
        })
        return pointPressureList
    }

    /**
     * 根据传入的笔画信息，生成 svg 对象的 path 标签
     * @param stroke 传入的笔画信息
     * @returns {string} svg 对象的 path 标签
     */
    static getPressurePathFromStroke(stroke) {
        const {_config} = stroke
        const pressurePoint = Core.point2pointPressure(stroke._points)
        const points = getStroke(pressurePoint, _config)
        const path = this.getSvgPressurePathFromStroke(points)
        return `<path d="${path}"
                    fill="${_config?.color}"
                    data-id="${stroke._id}"
                    stroke="${_config?.color ?? '#000'}"
                    stroke-width="${_config?.borderWidth ?? 1}"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                />
                 <path d="${path}" 
                    stroke-opacity="${_config?.borderOpacity ?? _config?.opacity ?? 1}" 
                    fill="transparent" 
                    stroke="${_config?.borderColor ?? '#000'}" 
                    data-id="${stroke.id}"
                    stroke-width="${_config?.borderWidth ?? 0}" 
                    stroke-linejoin="round" 
                    stroke-linecap="round"
                    pointer-events="all"
                    />`
    }

    static getFlatSvgPathFromStroke(stroke) {
        return polygonClipping.union([stroke]).map((face) =>
            face.map((points) => {
                return Core.getSvgPressurePathFromStroke(points)
            }).join(' ')
        ).join(' ')
    }

    /**
     * 根据传入点的集合，生成 path 标签的路径命令
     * @param points 传入点的集合
     * @param closed 是否闭合
     * @returns {string} 路径命令
     */
    static getSvgPressurePathFromStroke(points, closed = false) {
        const len = points.length
        if (len < 4) {
            return ""
        }
        let a = points[0]
        let b = points[1]
        const c = points[2]
        let result = `M${a[0]},${a[1]} Q${b[0]},${b[1]} ${Core.average(b[0], c[0])},${Core.average(b[1], c[1])} T `

        for (let i = 2; i < (len - 1); i++) {
            a = points[i]
            b = points[i + 1]
            result += `${Core.average(a[0], b[0])},${Core.average(a[1], b[1])} `
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

    static getTrianglePathFromStroke(stroke, start, end) {
        const {_config} = stroke
        const startX = parseFloat(start._x.toFixed(2))
        const startY = parseFloat(start._y.toFixed(2))
        const endX = parseFloat(end._x.toFixed(2))
        const endY = parseFloat(end._y.toFixed(2))
        const midX = parseFloat(((startX + endX) / 2).toFixed(2))
        const midY = parseFloat(((startY + endY) / 2).toFixed(2))
        const disX = parseFloat((Math.abs(startX - endX) / 2).toFixed(2))
        const disY = parseFloat((Math.abs(startY - endY) / 2).toFixed(2))
        const path = `M ${startX} ${endY}
                      L ${endX} ${endY}
                      L ${midX} ${startY} Z`
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
