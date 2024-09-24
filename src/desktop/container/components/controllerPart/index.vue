<template>
  <div id="controllerPart" class="backgroundContainer" ref="backgroundContainer">
    <div class="label">
      {{ $getLangText("缩放") }}:
    </div>
    <NumberInput :value="Math.round(getSettingStore.zoomInfo.zoom*100)" :step="20" unit="%"
                 :min="getSettingStore.zoomInfo.min*100" :max="getSettingStore.zoomInfo.max*100"
                 @change="zoom=>getSettingStore.zoomInfo.zoom=zoom/100">
    </NumberInput>
  </div>
</template>

<script setup>
import NumberInput from "@/desktop/container/components/controllerPart/components/numberInput.vue";
import ButtonGroup from "@/desktop/container/components/controllerPart/components/buttonGroup.vue";
import nextIcon from "@/assets/icon/next.svg";
import lastIcon from "@/assets/icon/last.svg";
import {settingStore} from "@/stores/drawer.js";

const getSettingStore = settingStore()
</script>

<style scoped lang="stylus">
#controllerPart
  width max-content
  //width 200px
  height 50px
  position fixed
  bottom 5vh
  left 50vw
  display flex
  align-items center
  transform translateX(-50%)
  color #DDDDDD
  background-color rgba(44, 44, 44, 1)
  box-sizing border-box
  transition opacity 0.3s
  border-radius 8px
  z-index 1000
  cursor pointer
  opacity 0.1

  &:hover
    opacity 1

  .label
    padding-left 15px
    flex 0 0 auto
    font-size 12px

  .slider
    width 2px
    height 40%
    margin 0 3px
    background-color #888888
    border-radius 1px

  .zoomButton
    width 25px
    height 25px
    margin 0 5px
    padding 5px
    border-radius 5px

    &:hover
      background-color rgba(255, 255, 255, .15)
</style>
