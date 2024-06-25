<template>
  <el-menu
      mode="horizontal"
      :default-active="getSettingStore.activeIndex"
  >
    <el-sub-menu index="file">
      <template #title>
        {{ $getLangText("文件") }}
      </template>
      <el-menu-item index="new" @click="handleSelectMenu('new')">
        {{ $getLangText("新建") }}
      </el-menu-item>
      <el-menu-item index="save" @click="handleSelectMenu('save')">
        {{ $getLangText("保存") }}
      </el-menu-item>
      <el-menu-item index="backgroundImage" @click="handleSelectMenu('backgroundImage')">
        {{ $getLangText("背景图") }}
      </el-menu-item>
      <el-menu-item index="decorativeImage" @click="handleSelectMenu('decorativeImage')">
        {{ $getLangText("装饰图") }}
      </el-menu-item>
    </el-sub-menu>
    <el-menu-item index="edit">
      {{ $getLangText("编辑") }}
    </el-menu-item>
    <el-menu-item index="about" @click="handleSelectMenu('about')">
      {{ $getLangText("关于") }}
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import {settingStore} from "@/stores/drawer.js";

const getSettingStore = settingStore()

const handleSelectMenu = (type) => {
  console.log(type)
}

</script>

<style scoped lang="stylus">

</style>
