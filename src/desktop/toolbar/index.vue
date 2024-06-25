<template>
  <div class="toolbarContainer">
  </div>
</template>

<script setup>
import {settingStore} from "@/stores/drawer.js";

const getSettingStore = settingStore()

</script>

<style scoped lang="stylus">
.toolbarContainer {
  height 10vh
}
</style>
