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
    size: 10,
    color: "red",
    borderWidth: 5,
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
    }
  ],
})

const setPageAction = (data, type) => {
  if (type === "last") {
    if (data.type === "word") {
      board._textareaManager.remove(data.svg)
    } else {
      board._strokeManager.remove(data.svg)
    }
  } else {
    switch (data.type) {
      case "draw":
        const draw = new Stroke({...data.svg._config}, data.svg._points, data.svg._id)
        board._strokeManager.add(draw)
        break
      case "word":
        const word = new Textarea(board, {...data.svg._config}, data.svg._textValue, data.svg._id)
        board._textareaManager.add(word, "revoke")
        break
      case "straight":
        const straight = new Stroke({...data.svg._config}, data.svg._points, data.svg._id)
        board._strokeManager.add(straight)
        break
      case "circular":
        const circular = new Stroke({...data.svg._config}, [], data.svg._id)
        board._strokeManager.add(circular)
        circular.addCircular(data.svg._points[0], data.svg._points[1])
        break
      case "triangle":
        const triangle = new Stroke({...data.svg._config}, [], data.svg._id)
        board._strokeManager.add(triangle)
        triangle.addTriangle(data.svg._points[0], data.svg._points[1])
        break
    }
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
})
</script>

<style scoped lang="stylus">
#drawBoard {
  width 100%
  height 100%
}
</style>
