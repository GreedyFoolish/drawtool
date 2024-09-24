<template>
  <div class="drawContainer" ref="drawContainer">
    <!-- 背景图容器 -->
    <Background ref="backgroundContainer"
                :style="getBackgroundImageStyle()"
    ></Background>
  </div>
</template>

<script setup>
import Background from "@/desktop/container/components/background/index.vue"
import {settingStore} from "@/stores/drawer.js";
import {onMounted, ref, watch} from "vue";

const getSettingStore = settingStore()
const drawContainer = ref()
const backgroundContainer = ref()

const getBackgroundImageStyle = () => {
  return `
    zoom: ${getSettingStore.zoomInfo.zoom};
    width: ${getSettingStore.backgroundSetting.width}px;
    height: ${getSettingStore.backgroundSetting.height}px;
    background-image: url(${getSettingStore.backgroundImageURL});
    background-repeat: no-repeat;
  `
}
const getPageIns = () => {
  return drawContainer.value
}
const getRect = () => {
  return drawContainer.value.getBoundingClientRect()
}

watch(() => [getSettingStore.backgroundImageURL, getSettingStore.decorativeImageList],
    ([curBackgroundURL, curdDecorativeURL], [oldURL, oldURL2]) => {
      const image = new Image();
      image.src = curBackgroundURL;
      image.onload = () => {
        getSettingStore.backgroundSetting = {
          width: image.width,
          height: image.height
        }
      }
    }
)

onMounted(() => {
  getSettingStore.backgroundIns = backgroundContainer.value
})

defineExpose({
  getPageIns,
  getRect,
})
</script>

<style scoped lang="stylus">
.drawContainer {
  padding 5vh
  flex 1
  background-color rgb(239 244 249)
  overflow auto
}
</style>
