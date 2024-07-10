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
  // console.log(type)
  switch (type) {
    case "new":
      break
    case "save":
      break
    case "backgroundImage":
      uploadImage(1)
      break
    case "decorativeImage":
      uploadImage(2)
      break
    case "about":
      break
    default:
      break;
  }
}

// 上传图片函数
const uploadImage = (type) => {
  const fileUpload = document.createElement("input")
  fileUpload.type = "file"
  fileUpload.accept = "image/*"
  fileUpload.addEventListener("change", (e) => {
    const windowURL = window.URL || window.webkitURL
    const fileObj = e.target.files[0]
    const imageURL = windowURL.createObjectURL(fileObj)
    if (type === 1) {
      getSettingStore.backgroundImageURL = imageURL
    } else {
      const image = new Image()
      image.src = imageURL
      image.onload = () => {
        const id = new Date().getTime()
        const position = {
          id,
          src: imageURL,
          width: image.width,
          height: image.height,
          x: image.width / 2,
          y: image.height / 2,
        }
        getSettingStore.decorativeImageList[id] = position
      }
    }
  })
  fileUpload.click()
}

</script>

<style scoped lang="stylus">

</style>
