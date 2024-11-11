<template>
  <div id="drawBoard" :data-zoom="getSettingStore.zoomInfo.zoom"></div>
</template>

<script setup>
import {defineExpose, onMounted, ref, watch} from "vue";
import {Board} from "@/module/board.js";
import {settingStore} from "@/stores/drawer.js";
import {Stroke} from "@/module/stroke.js";
import {Textarea} from "@/module/textarea.js";

const getSettingStore = settingStore()
let board = null
const config = ref({
  mode: "arrow",
  drawConfig: {
    // 压力参数详见： https://github.com/steveruizok/perfect-freehand
    // 笔画的直径，默认值 8
    size: 8,
    // 压力对笔画大小的影响，默认值 0.5
    thinning: 0.9,
    // 笔画柔化描边的程度，默认值 0.5
    smoothing: 1,
    // 笔画简化的程度，默认值 0.5
    streamline: 0.5,
    // 是否根据速度模拟压力，默认值 true
    simulatePressure: true,
    // 应用于每个点的压力的缓动函数
    easing: (t) => t,
    // 线起点的笔锋选项
    start: {
      // 是否绘制笔锋，默认值 true
      cap: true,
      // 到锥度的距离。如果设置为 true，则 taper 将是笔触的总长度，默认值 0
      taper: 20,
      // 笔锋过渡效果
      easing: (t) => t,
    },
    // 线尾的笔锋选项
    end: {
      cap: true,
      taper: 20,
      easing: (t) => t,
    },
    // 描边是否完整
    last: true,
    // 笔画颜色，默认值 #f00
    color: "#f00",
    // 笔画边框颜色，默认值 #000
    borderColor: "#000",
    // 笔画边框宽度，默认值 1
    borderWidth: 1,
    // 笔画边透明度，默认值 1
    borderOpacity: 1,
    // 判断笔画是否合并的距离，默认值 30
    dist: 30,
  },
  event: [
    // {
    //   eventName: 'beforeDraw',
    //   fn: (stroke) => {
    //     console.log("stroke", stroke)
    //   }
    // },
    {
      eventName: 'afterDraw',
      fn: (svg, id, type) => {
        if (id) {
          getSettingStore.actionStepper.addAction({
            type: "drawChange",
            data: {id, svg, type}
          })
        }
      }
    },
    // {
    //   eventName: 'pointChanged',
    //   fn: ({point}) => {
    //     console.log("point", point)
    //   }
    // },
    {
      eventName: 'addTextarea',
      fn: (id) => {
        getSettingStore.actionStepper.lock = true
        getSettingStore.actionStepper.checkAction()
      }
    },
    {
      eventName: 'removeTextarea',
      fn: (id) => {
        getSettingStore.actionStepper.lock = false
        getSettingStore.actionStepper.checkAction()
      }
    },
    {
      eventName: 'eraserChange',
      fn: (strokes, textareaList) => {
        for (const item of strokes) {
          const id = item._id
          getSettingStore.actionStepper.addAction({
            type: "drawChange",
            data: {id, svg: item, type: "eraser"}
          })
        }
        for (const item of textareaList) {
          const id = item._id
          getSettingStore.actionStepper.addAction({
            type: "drawChange",
            data: {id, svg: item, type: "eraser"}
          })
        }
      }
    }
  ],
})

const revoke = (data) => {
  const points = [data.svg._points[0], data.svg._points[1]]
  switch (data.type) {
    case "draw":
      const draw = new Stroke({...data.svg._config}, data.svg._points, data.svg._id, data.type, data.svg._strokeList)
      board._strokeManager.add(draw)
      break
    case "word":
      const word = new Textarea(board, {...data.svg._config}, data.svg._textValue, data.svg._id)
      board._textareaManager.add(word, "revoke")
      break
    case "straight":
      const straight = new Stroke({...data.svg._config}, points, data.svg._id, data.type, data.svg._strokeList)
      board._strokeManager.add(straight)
      break
    case "circular":
      const circular = new Stroke({...data.svg._config}, points, data.svg._id, data.type, data.svg._strokeList)
      board._strokeManager.add(circular)
      break
    case "triangle":
      const triangle = new Stroke({...data.svg._config}, points, data.svg._id, data.type, data.svg._strokeList)
      board._strokeManager.add(triangle)
      break
    case "eraser":
      if (data.svg._type === "word") {
        board._textareaManager.remove(data.svg)
      } else {
        board._strokeManager.remove(data.svg)
      }
      break
    default:
      break
  }
}

const setPageAction = (data, type) => {
  if (type === "last") {
    if (data.type === "word") {
      board._textareaManager.remove(data.svg)
    } else if (data.type === "eraser") {
      const drawType = data.svg._type
      revoke({...data, type: drawType})
    } else {
      board._strokeManager.remove(data.svg)
    }
  } else {
    revoke(data)
  }
}

watch(() => getSettingStore.drawMode, (curMode, oldMode) => {
  if (board) {
    // console.log(curMode, oldMode)
    board.setMode(curMode)
  }
})
watch(() => getSettingStore.toolbarConfig, (curConfig, oldConfig) => {
  if (board) {
    // console.log(curConfig, oldConfig)
    board.setDrawConfig(curConfig)
  }
})

onMounted(() => {
  board = new Board("#drawBoard", config);
})
defineExpose({
  setPageAction,
  getWriteBoardData,
})
</script>

<style scoped lang="stylus">
#drawBoard {
  width 100%
  height 100%
}
</style>
