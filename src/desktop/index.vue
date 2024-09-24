<template>
  <div class="layoutContainer">
    <Menu></Menu>
    <Toolbar></Toolbar>
    <Container></Container>
    <ControllerPart></ControllerPart>
  </div>
</template>

<script setup>
import Menu from "./menu/index.vue";
import Toolbar from "./toolbar/index.vue";
import Container from "./container/index.vue";
import ControllerPart from "./container/components/controllerPart/index.vue";

</script>

<style scoped lang="stylus">
.layoutContainer {
  display flex
  flex-direction column
  height 100vh
}
</style>
