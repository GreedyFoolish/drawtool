<template>
  <div id="drawBoard" :data-zoom="getSettingStore.zoomInfo.zoom"></div>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import {Board} from "@/module/board.js";
import {settingStore} from "@/stores/drawer.js";

const getSettingStore = settingStore()
let board = null
const config = ref({
  mode: "arrow",
  drawConfig: {
    size: 10,
    color: "red",
    borderWidth: 5,
  },
  // event: [
  //   {
  //     eventName: 'beforeDraw',
  //     fn: (stroke) => {
  //       console.log("stroke", stroke)
  //     }
  //   },
  //   {
  //     eventName: 'pointChanged',
  //     fn: ({point}) => {
  //       console.log("point", point)
  //     }
  //   }
  // ],
})

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
</script>

<style scoped lang="stylus">
#drawBoard {
  width 100%
  height 100%
}
</style>
