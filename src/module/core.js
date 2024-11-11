import {PointPressure} from "./point-pressure.js"
import {getStroke} from "perfect-freehand";

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
                    stroke-width="${_config?.borderWidth ?? 1}"
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
            pointPressureList.push(new PointPressure(item._x, item._y, item._pressure))
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
                    fill="${_config?.borderColor ?? '#000'}"
                    data-id="${stroke.id}"
                    stroke="${_config?.borderColor ?? '#000'}"
                    stroke-opacity="${_config?.borderOpacity ?? 1}"
                    stroke-width="${_config?.borderWidth ?? 1}"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    pointer-events="all"
                 />
                 <path d="${path}"
                    fill="${_config?.color ?? '#f00'}"
                    data-id="${stroke._id}"
                    stroke="${_config?.color ?? '#f00'}"
                    stroke-width="0"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    pointer-events="all"
                 />`
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
        const startX = parseFloat(start._x.toFixed(2))
        const startY = parseFloat(start._y.toFixed(2))
        const endX = parseFloat(end._x.toFixed(2))
        const endY = parseFloat(end._y.toFixed(2))
        const path = `M ${startX},${startY} L${endX},${endY}`
        return `<path d="${path}"
                    fill="none"
                    data-id="${stroke._id}"
                    stroke="${_config?.borderColor ?? '#000'}"
                    stroke-width="${_config?.borderWidth ?? 1}"
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
                    stroke="${_config?.borderColor ?? '#000'}"
                    stroke-width="${_config?.borderWidth ?? 1}"
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
                    stroke="${_config?.borderColor ?? '#000'}"
                    stroke-width="${_config?.borderWidth ?? 1}"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                />`
    }

    /**
     * 根据笔画类型获取笔画路径信息
     * @param stroke 笔画信息
     * @returns {*}
     */
    static getStrokePathFromType(stroke) {
        let path
        const start = stroke._points[0]
        const end = stroke._points[1]
        const startX = parseFloat(start._x.toFixed(2))
        const startY = parseFloat(start._y.toFixed(2))
        const endX = parseFloat(end._x.toFixed(2))
        const endY = parseFloat(end._y.toFixed(2))
        const midX = parseFloat(((startX + endX) / 2).toFixed(2))
        const midY = parseFloat(((startY + endY) / 2).toFixed(2))
        const disX = parseFloat((Math.abs(startX - endX) / 2).toFixed(2))
        const disY = parseFloat((Math.abs(startY - endY) / 2).toFixed(2))
        switch (stroke._type) {
            case "draw":
                const pressurePoint = Core.point2pointPressure(stroke._points)
                const points = getStroke(pressurePoint, stroke._config)
                path = this.getSvgPressurePathFromStroke(points)
                break
            case "straight":
                path = `M ${startX},${startY} L${endX},${endY}`
                break
            case "circular":
                const radius = Math.sqrt(disX * disX, disY * disY)
                // 此为画椭圆参数
                path = `M ${midX} ${midY} m ${-1 * radius} 0
                        a ${disX} ${disY} 0 1 0 ${disX * 2} 0
                        a ${disX} ${disY} 0 1 0 ${disX * -2} 0`
                break
            case "triangle":
                path = `M ${startX} ${endY}
                        L ${endX} ${endY}
                        L ${midX} ${startY} Z`
                break
            default:
                break
        }
        return new Path2D(path)
    }

    /**
     * 在传入的画布上绘制笔画
     * @param canvas 传入的画布
     * @param strokeList 笔画列表
     * @returns {*}
     */
    static drawStrokeAtCanvas(canvas, strokeList) {
        const ctx = canvas.getContext('2d')
        ctx.lineJoin = 'round'
        for (const stroke of strokeList) {
            let strokePath = this.getStrokePathFromType(stroke)
            ctx.fillStyle = stroke._config?.color ?? "#f00"
            if (stroke._type !== "draw") {
                ctx.fillStyle = "transparent"
            }
            const lineWidth = stroke._config?.borderWidth ?? 1
            if (lineWidth > 0) {
                // 设置描边的颜色
                ctx.strokeStyle = stroke._config?.borderColor ?? "#000"
                // 设置描边的宽度
                ctx.lineWidth = lineWidth
                // 根据当前的描边样式绘制路径
                ctx.stroke(strokePath)
            }
            // 根据 fillStyle 填充指定路径
            ctx.fill(strokePath)
        }
        return canvas
    }

    /**
     * 根据传入的笔画管理对象绘制笔画的画布
     * @param strokeManager 传入的笔画管理对象
     * @param zoom svg 缩放比例
     * @returns {[]}
     */
    static getCanvasFromStrokeList(strokeManager, zoom) {
        const result = []
        const svgRect = strokeManager._svg.getBoundingClientRect()
        const strokeList = strokeManager.getStrokeList()
        for (const stroke of strokeList) {
            const canvas = document.createElement('canvas')
            // 防止在缩小的情况下，画布范围不足以画出笔画
            canvas.width = svgRect.width / zoom
            canvas.height = svgRect.height / zoom
            // 对当前笔画及当前笔画挂载的笔画列表进行绘制
            Core.drawStrokeAtCanvas(canvas, [stroke, ...stroke._strokeList ?? []])
            const curG = strokeManager._svg.getElementById(stroke._id)
            const itemRect = curG.getBoundingClientRect()
            const lineWidth = stroke._config.borderWidth ?? 1
            const rect = {
                sx: itemRect.left - svgRect.left - lineWidth,
                sy: itemRect.top - svgRect.top - lineWidth,
                sw: itemRect.width + lineWidth * 2,
                sh: itemRect.height + lineWidth * 2
            }
            const ctx = canvas.getContext('2d')
            // 因为 svg 标签进行了缩放，但是绘画的点还是 100% 比例下的点位，所以需要除以缩放比
            const cutImage = ctx.getImageData(rect.sx / zoom, rect.sy / zoom, rect.sw / zoom, rect.sh / zoom)
            const cutCanvas = document.createElement('canvas')
            cutCanvas.width = rect.sw / zoom
            cutCanvas.height = rect.sh / zoom
            const cutCtx = cutCanvas.getContext('2d')
            cutCtx.putImageData(cutImage, 0, 0)
            result.push({
                id: stroke._id,
                type: stroke._type ?? "draw",
                base64: cutCanvas.toDataURL(),
                itemRect,
                svgRect,
                zoom,
                rect,
            })
        }
        return result
    }

}
