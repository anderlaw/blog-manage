<template>
  <div>
    <imageCut @dataReady="handleData" />
    <el-button style="margin-top:8px;" size="small" @click="handleSend" type="primary">确定上传</el-button>
    <el-alert
      v-for="(item,index) in uploadList"
      :key="index"
      title="上传成功！"
      type="success"
      :description="item.filePath"
      show-icon
    ></el-alert>
  </div>
</template>

<script>
import ajax from "../api";
import imageCut from "./imageCut";
export default {
  name: "app",
  data() {
    return {
      currentFile: null,
      currentDataUrl: "",
      uploadList: []
    };
  },
  methods: {
    handleData({ file, dataUrl }) {
      this.currentFile = file;
      this.currentDataUrl = dataUrl;
    },
    handleSend() {
      if (!this.currentFile) {
        this.$message.error("请选择图片！");
        return;
      }
      var formData = new FormData();
      formData.append("image", this.currentFile);
      ajax({
        url: "/api/upload-image",
        data: formData,
        callback: res => {
          if (res.success) {
            this.uploadList.push({
              filePath: res.filePath,
              dataUrl: this.currentDataUrl
            });
          }
        }
      });
    }
  },
  components: {
    imageCut
  }
};
</script>

<style>
</style>
