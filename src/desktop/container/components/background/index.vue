<template>
  <div id="backgroundContainer" class="backgroundContainer" ref="backgroundContainer">
    <!-- 装饰图容器 -->
    <div class="decorativeContainer" @wheel="(e)=>defaultWheel(e)">
      <Decorative v-for="(item,key) in getSettingStore.decorativeImageList"
                  :key="key"
                  :item="item"
      ></Decorative>
      <WriteBoard ref="writeBoardIns"></WriteBoard>
    </div>
  </div>
</template>
<script setup>
import Decorative from "@/desktop/container/components/decorative/index.vue";
import WriteBoard from "@/desktop/container/components/writeBoard/index.vue";
import {defineExpose, onMounted, ref} from "vue";
import {settingStore} from "@/stores/drawer.js";

const getSettingStore = settingStore()
const backgroundContainer = ref()
const writeBoardIns = ref()
const defaultWheel = (e) => {
  if (e.ctrlKey) {
    e.stopPropagation();
    e.preventDefault();
    let magnification = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    const tempZoom = getSettingStore.zoomInfo.zoom * magnification;
    const min = getSettingStore.zoomInfo.min, max = getSettingStore.zoomInfo.max;
    magnification = Math.max(Math.min(max, tempZoom), min) / getSettingStore.zoomInfo.zoom;
    const offsetY = e.pageY - backgroundContainer.value.getBoundingClientRect().top;
    const offsetX = e.pageX - backgroundContainer.value.getBoundingClientRect().left;
    getSettingStore.zoomInfo.offsetY = (offsetY + backgroundContainer.value.scrollTop) * magnification - offsetY;
    getSettingStore.zoomInfo.offsetX = (offsetX + backgroundContainer.value.scrollLeft) * magnification - offsetX;
    getSettingStore.zoomInfo.zoom = Math.max(Math.min(max, tempZoom), min);
  }
};

const getPageIns = () => {
  return backgroundContainer.value
}
const getRect = () => {
  return backgroundContainer.value.getBoundingClientRect()
}

onMounted(() => {
  getSettingStore.writeBoardIns = writeBoardIns.value
})

defineExpose({
  getPageIns,
  getRect,
})
</script>


<style scoped lang="stylus">
.backgroundContainer {
  margin auto
  width 400px
  height 300px
  background-color white

  .decorativeContainer {
    width inherit
    height inherit
    position relative
  }
}
</style>
