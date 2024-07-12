<template>
  <div class="toolbarContainer">
    <div class="baseToolbar">
      <img v-for="item in toolList"
           :class="{active:item.name===getSettingStore.selectTool}"
           :src="item.src"
           :alt="item.mark"
           @click="toolClick(item)"
      />
    </div>
    <div class="toolbarConfig">
      <div class="sliderContent">
        <el-slider v-model="sliderValue" :min="1" :max="40"
                   show-input :format-tooltip="(v) => `${v} 像素`"
                   @change="sliderChange"
                   :disabled="getSettingStore.drawMode==='word'"
        />
      </div>
      <div class="colorContent">
        <el-color-picker v-model="colorValue" show-alpha
                         :predefine="predefineColors"
                         @change="colorChange"
                         :disabled="getSettingStore.drawMode==='word'"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from "vue";
import {settingStore} from "@/stores/drawer.js";
import arrow from "@/assets/icon/arrow.png"
import pen from "@/assets/icon/pen.png"
import eraser from "@/assets/icon/eraser.png"
import word from "@/assets/icon/word.png"
import straight from "@/assets/icon/straight.png"
import circular from "@/assets/icon/circular.png"
import triangle from "@/assets/icon/triangle.png"

const getSettingStore = settingStore()
const toolList = [
  {
    name: "arrow",
    src: arrow,
    mark: "箭头",
    mode: "arrow",
  },
  {
    name: "pen",
    src: pen,
    mark: "铅笔",
    mode: "draw",
  },
  {
    name: "eraser",
    src: eraser,
    mark: "橡皮",
    mode: "eraser",
  },
  {
    name: "word",
    src: word,
    mark: "文字",
    mode: "word",
  },
  {
    name: "straight",
    src: straight,
    mark: "直线",
    mode: "straight",
  },
  {
    name: "circular",
    src: circular,
    mark: "椭圆",
    mode: "circular",
  },
  {
    name: "triangle",
    src: triangle,
    mark: "三角形",
    mode: "triangle",
  },
]
const defaultConfig = {
  name: "",
  src: "",
  mark: "",
  size: 1,
  color: "#000",
}
const sliderValue = ref(1)
const colorValue = ref("rgba(30, 144, 255, 1)")
const predefineColors = ref([
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#90ee90",
  "#00ced1",
  "#1e90ff",
  "#c71585",
  "#ffffff",
  "#000000",
])
const curTool = computed(() => {
  return getSettingStore.selectTool
})

const initToolbarConfig = () => {
  toolList.forEach(item => {
    getSettingStore.toolbarConfig[item.name] = {
      ...defaultConfig,
      ...item,
    }
  })
  sliderValue.value = getSettingStore.toolbarConfig[curTool.value].size
  colorValue.value = getSettingStore.toolbarConfig[curTool.value].color
}
// 初始化工具配置
initToolbarConfig()
const toolClick = (item) => {
  getSettingStore.selectTool = item.name
  getSettingStore.drawMode = item.mode
  sliderValue.value = getSettingStore.toolbarConfig[item.name].size
  colorValue.value = getSettingStore.toolbarConfig[item.name].color
}

const sliderChange = (value) => {
  getSettingStore.toolbarConfig[curTool.value].size = value
}

const colorChange = (color) => {
  getSettingStore.toolbarConfig[curTool.value].color = color
}

</script>

<style scoped lang="stylus">
.toolbarContainer {
  height 10vh
  display flex

  .baseToolbar {
    width 30%
    height 100%
    display flex
    flex-wrap wrap
    justify-content space-around
    align-items center
    overflow auto
    border-right 1px solid #dcdfe6

    img {
      width 30px
      height 30px
      border 1px solid transparent
    }

    img.active {
      border 1px solid #0067c0
      border-radius 4px
    }
  }

  .toolbarConfig {
    display flex
    justify-content space-around
    align-items center

    .sliderContent {
      min-width: 300px;
      padding 0 3vh
    }

    .colorContent {
      min-width: 100px;
      padding 0 3vh
    }
  }
}
</style>
