<template>
  <div class="backgroundContainer" ref="backgroundContainer">
    <!-- 装饰图容器 -->
    <div class="decorativeContainer">
      <Decorative v-for="(item,key) in getSettingStore.decorativeImageList"
                  :key="key"
                  :item="item"
      ></Decorative>
    </div>
  </div>
</template>
<script setup>
import Decorative from "@/desktop/container/components/decorative/index.vue";
import {defineExpose, ref, watch} from "vue";
import {settingStore} from "@/stores/drawer.js";

const getSettingStore = settingStore()
const backgroundContainer = ref()
const getPageIns = () => {
  return backgroundContainer.value
}
const getRect = () => {
  return backgroundContainer.value.getBoundingClientRect()
}

// onMounted(() => {
// })

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
