<template>
  <div>
    <el-form size="small" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="视频标题" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="视频描述" prop="description">
        <el-input type="textarea" v-model="ruleForm.description"></el-input>
      </el-form-item>
      <el-form-item label="视频文件" prop="file">
        <el-input type="file" id="video-box" v-model="ruleForm.file"></el-input>
      </el-form-item>
      <el-form-item label="字幕文件" prop="srt">
        <el-input type="file" @change.native="handleSrtfile" v-model="ruleForm.srt"></el-input>
      </el-form-item>
    </el-form>
    <el-button size="small" @click="handleSend" type="primary">确定上传</el-button>
    <el-alert v-if="success" title="上传成功！" type="success" :description="filePath" show-icon></el-alert>
  </div>
</template>

<script>
import ajax from "../api";
export default {
  name: "app",
  data() {
    return {
      srtString: "",
      ruleForm: {
        title: "",
        description: "",
        file: "",
        srt: ""
      },
      rules: {
        title: [{ required: true, message: "请输入视频标题", trigger: "blur" }],
        description: [
          { required: true, message: "请输入视频描述", trigger: "change" }
        ],
        file: [
          { required: true, message: "请选择视频文件", trigger: "change" }
        ],
        srt: [{ required: true, message: "请选中字幕文件", trigger: "change" }]
      },
      success:false,
      filePath:""
    };
  },
  methods: {
    handleSrtfile(ev) {
      var file = ev.target.files[0];
      var reader = new FileReader();
      reader.onload = () => {
        this.srtString = reader.result;
      };
      reader.readAsText(file);
    },
    handleSend() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          console.log(this.ruleForm.srt);
          var suffix = this.ruleForm.srt.split(".").reverse()[0];
          if (suffix.toLowerCase() !== "srt") {
            this.$message.error("只能上传srt字幕文件");
            return;
          }
          var formData = new FormData();
          var videoBox = this.$el.querySelector("#video-box");
          formData.append("title", this.ruleForm.title);
          formData.append("description", this.ruleForm.description);
          formData.append("srt", this.srtString);

          formData.append("video", videoBox.files[0]);
          console.log(formData);
          ajax({
            url: "/api/upload-video",
            data: formData,
            callback: (res) =>{
              if (res.success) {
                this.success = true;
                this.filePath = res.filePath;
              }
            }
          });
        }
      });
    }
  }
};
</script>

<style>
</style>
