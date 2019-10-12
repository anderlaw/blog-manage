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
        <el-input type="file" id="video-box" @change.native="handleVideofile" v-model="ruleForm.file"></el-input>
      </el-form-item>
      <el-form-item label="字幕文件" prop="srt">
        <el-input type="file" @change.native="handleSrtfile" v-model="ruleForm.srt"></el-input>
      </el-form-item>
      <el-form-item label="视频预览">
        <video id="video-element" :src="videoDataUrl" playsinline="" webkit-playsinline="" controls="controls"></video>
      </el-form-item>
      <el-form-item label="视频封面">
        <img :src="imgDataUrl" style="vertical-align:middle;margin-right:10px;"/>
        <el-button type="success" @click="cutVideoScreen">视频截图为封面</el-button>
      </el-form-item>
      <el-form-item label="提交">
        <el-button size="small" @click="handleSend" type="primary">上传</el-button>
      </el-form-item>
    </el-form>
    <el-alert v-if="success" title="上传成功！" type="success" :description="filePath" show-icon></el-alert>
  </div>
</template>

<script>
import ajax from "../api";
export default {
  name: "app",
  data() {
    return {
      videoDataUrl:"",
      imgDataUrl:"",
      srtString: "",
      ruleForm: {
        title: "",
        description: "",
        file: "",
        srt: "",
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
    converBase64ToFile(){
      if(this.imgDataUrl === ""){
        this.$message.error('请先获取封面！');
        return;
      }
      let arr = this.imgDataUrl.split(',');

      let mime = arr[0].match(/:(.*?);/)[1];

      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n)
      while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    handleVideofile(ev){
      var file = ev.target.files[0];
      this.videoDataUrl = URL.createObjectURL(file)
    },
    cutVideoScreen(){
      var file = document.getElementById("video-box").files[0];
      if(file){
        var video = document.getElementById("video-element");
        var canvas = document.createElement("canvas");
        canvas.width = video.offsetWidth;
        canvas.height = video.offsetHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        //create dataUrl of image
        this.imgDataUrl = canvas.toDataURL("image/jpeg");
        return;
      }
      this.$message.error('请选择视频文件！')
    },
    handleSend() {
      let coverImg = this.converBase64ToFile();

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
          if(coverImg){
            //如果有封面则发送封面
            formData.append("coverImg", coverImg);
          }
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
