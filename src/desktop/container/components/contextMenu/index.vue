<template>
  <ul v-show="visible"
      class="contextmenu"
      :style="getContextMenuStyle"
  >
    <li v-for="item in menuList" @click="item.rightClickHandle">{{ item.menuName }}</li>
  </ul>
</template>
<script setup>
import {computed, watch} from "vue";

const props = defineProps(["visible", "config", "menuList"]);
const getContextMenuStyle = computed(() => {
  return `left:${props.config.x}px;top:${props.config.y}px;`;
});

watch(() => props.visible,
    (value, oldValue) => {
      if (value) {
        document.body.addEventListener("click", props.config.closeMenu)
      } else {
        document.body.removeEventListener("click", props.config.closeMenu)
      }
    }
)
</script>

<style scoped lang="stylus">
.contextmenu {
  width 44px
  margin 0
  padding 4px
  position absolute
  background #fff
  color #333
  list-style-type none
  border 1px solid #aaa
  font-size 12px
  cursor pointer
  user-select none

  li {
    margin 0
    padding 5px
  }

  li:hover {
    background #eee
  }
}
</style>
