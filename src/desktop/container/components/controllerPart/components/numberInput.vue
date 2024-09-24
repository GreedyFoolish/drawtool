<template>
  <div class="numberInput">
    <div class="button" @click="buttonClick(-1)">
      <img :src="minusIcon" alt="">
    </div>
    <input ref="input" :value="tempVal" @change="(e)=>{tempVal=e.target.value}">
    <span>
        {{ unit ?? "" }}
    </span>
    <div class="button" @click="buttonClick(1)">
      <img :src="addIcon" alt="">
    </div>
  </div>
</template>

<script setup>
import addIcon from "@/assets/icon/add.svg";
import minusIcon from "@/assets/icon/minus.svg";
import {computed, ref} from "vue";

const props = defineProps(["value", "min", "max", "step", "precision", "unit"]);
const emits = defineEmits(["update:value", "change"]);
const input = ref();
const tempVal = computed({
  get: () => +props.value,
  set: (v) => {
    let value = +v;
    if (!isNaN(+v)) {
      value = props.min ? Math.max(props.min, value) : value;
      value = props.max ? Math.min(props.max, value) : value;
    } else {
      tempVal.value = 1;
      return;
    }
    value = +value.toFixed(2);
    emits("update:value", value);
    emits("change", value);
    input.value.value = tempVal.value;
  },
});

const buttonClick = (ratio) => {
  tempVal.value = tempVal.value + ratio * props.step ?? 1
}
</script>

<style scoped lang="stylus">
.numberInput
  margin 0 10px
  display flex
  align-items center
  background-color transparent

  .button
    width 28px
    height 28px
    margin 0 1px
    display flex
    justify-content center
    align-items center
    font-size 22px
    line-height 28px
    background-color transparent
    cursor pointer
    user-select none
    border-radius 3px

    img
      width 20px
      height 20px

  input
    width 40px
    height 28px
    padding 0
    border 0
    text-align center
    outline 0
    color inherit
    background-color inherit
    border-radius 3px

    &:hover
      background-color rgba(255, 255, 255, .15)

  .unit
    padding 5px
    font-size 12px
</style>
