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
import html2canvas from "html2canvas"
import {settingStore} from "@/stores/drawer.js";

const getSettingStore = settingStore()

const handleSelectMenu = (type) => {
  // console.log(type)
  switch (type) {
    case "new":
      break
    case "save":
      captureElementAndSaveAsImage("backgroundContainer")
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

const captureElementAndSaveAsImage = (elementId, filename = "captured-element.png") => {
  // 获取要截取的元素
  const element = document.getElementById(elementId)
  html2canvas(element).then(function (canvas) {
    // 导出 Canvas 内容为 base64 格式的图片数据，可以选择其他格式如 "image/jpeg"
    const imageData = canvas.toDataURL("image/png");
    // 创建一个链接，并将 base64 数据设置为链接的 href 属性
    const downloadLink = document.createElement("a");
    downloadLink.href = imageData;
    // 设置下载的文件名
    downloadLink.download = filename;
    // 将链接插入到文档中，模拟点击下载
    document.body.appendChild(downloadLink);
    downloadLink.click();
    // 清理插入的链接
    document.body.removeChild(downloadLink);
  });
}

</script>

<style scoped lang="stylus">

</style>
