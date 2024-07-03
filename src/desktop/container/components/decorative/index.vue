<template>
  <div class="decorativeContent" :style="getImageStyle" ref="singleSealIns">
    <img :src="item.src" alt="装饰图" @mousedown="handleMouseDown" draggable="false">
  </div>
</template>
<script setup>
import {computed, ref} from "vue";
import {settingStore} from "@/stores/drawer.js";

const props = defineProps(["item"]);
const getSettingStore = settingStore()
const itemConfig = ref();
itemConfig.value = {...props.item};
const getImageStyle = computed(() => {
  return `
    width:${itemConfig.value.width}px;
    height:${itemConfig.value.height}px;
    left:${itemConfig.value.x}px;
    top:${itemConfig.value.y}px;
  `;
});
const handleMouseDown = (event) => {
  const reat = getSettingStore.backgroundIns.getRect();
  const start = {
    x: itemConfig.value.x,
    y: itemConfig.value.y,
  };
  const startPos = {
    x: event.x ?? 0,
    y: event.y ?? 0,
  };
  if (event.preventDefault) {
    // 防止拖拽时屏幕滑动，阻止默认事件
    event.preventDefault();
  }
  const move = (e) => {
    const movePos = {
      x: e.x ?? 0,
      y: e.y ?? 0,
    };
    const xDis = movePos.x - startPos.x;
    const yDis = movePos.y - startPos.y;
    itemConfig.value.x = start.x + xDis / getSettingStore.pageZoom;
    itemConfig.value.y = start.y + yDis / getSettingStore.pageZoom;
  }
  const stop = () => {
    const id = itemConfig.value.id;
    const index = itemConfig.value.index;
    const left = itemConfig.value.width / 2;
    const top = itemConfig.value.height / 2;
    const checkBorder = (x = itemConfig.value.x, y = itemConfig.value.y) => {
      const check = () => {
        return (
            x >= left &&
            x <= reat.width - left &&
            y >= top &&
            y <= reat.height - top
        );
      };
      return check();
    };
    // 此处的两种情况可以合并，但如果存在多页的情况，可以在此基础上进行修改
    if (checkBorder()) {
      getSettingStore.decorativeImageURL[index] = {
        ...getSettingStore.decorativeImageURL[index],
        x: itemConfig.value.x,
        y: itemConfig.value.y,
      };
    } else {
      itemConfig.value.x = Math.max(
          left,
          Math.min(reat.width - left, itemConfig.value.x)
      );
      itemConfig.value.y = Math.max(
          top,
          Math.min(reat.height - top, itemConfig.value.y)
      );
      getSettingStore.decorativeImageURL[index] = {
        ...getSettingStore.decorativeImageURL[index],
        x: itemConfig.value.x,
        y: itemConfig.value.y,
      };
    }
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", stop);
  };
  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", stop);
};

</script>

<style scoped lang="stylus">
.decorativeContent {
  width fit-content
  position absolute
  transform translate(-50%, -50%)
  border 1px dashed #aaaaaa
}
</style>
