<template>
  <div class="drawContainer">
    <!-- 背景图容器 -->
    <div class="backgroundContainer"></div>
    <!-- 装饰图图容器 -->
    <div class="decorativeContainer"></div>
  </div>
</template>

<script setup>
import {settingStore} from "@/stores/drawer.js";

const getSettingStore = settingStore()

</script>

<style scoped lang="stylus">
.drawContainer {
  padding 5vh
  flex 1
  background-color rgb(239 244 249)
  overflow auto

  .backgroundContainer {
    margin auto
    width 800px
    height 600px
    background-color white
  }
}
</style>
