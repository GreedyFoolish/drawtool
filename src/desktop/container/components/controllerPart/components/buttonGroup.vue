<template>
  <div class="buttonGroup">
    <template v-for="(button,index) in buttons" :key="button.icon">
      <div v-show="index !== 0" class="split"></div>
      <div :class="{button,disabled:actionDisabled(button.type)}" @click="actionClick(button.type)">
        <img :src="button.icon" :alt="button.text">
      </div>
    </template>
  </div>
</template>

<script setup>
import {settingStore} from "@/stores/drawer.js";
import {computed} from "vue";

const getSettingStore = settingStore()
const props = defineProps({
  buttons: [{
    type: String,
    text: String,
    icon: Image | String,
  }]
});

const actionDisabled = computed(() => (type) => {
  return getSettingStore.actionDisabled[type]
})

const actionClick = (type) => {
  return getSettingStore.actionStepper[type]()
}
</script>

<style scoped lang="stylus">
.buttonGroup
  margin 0 10px
  display flex
  background-color transparent
  border-radius 2px
  box-sizing border-box
  transition all 0.3s
  text-align center
  overflow hidden
  cursor pointer
  user-select none

  .split
    width 2px
    height inherit
    margin 8px 3px
    box-sizing border-box
    transition all 0.3s

  .button
    margin 1px 0
    flex 1
    display flex
    justify-content center
    align-items center
    font-size 14px
    font-weight bold
    transition all 0.3s
    border-radius 2px

    img
      width 30px
      height 30px

    &:hover
      background-color rgba(155, 155, 155, .2)

  .button.disabled
    opacity 0.5
    cursor not-allowed
</style>
