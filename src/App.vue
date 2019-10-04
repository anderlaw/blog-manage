<template>
  <div id="app">
    <div v-show="isLogined">
      <el-menu
        :default-active="currentShow"
        class="nav-wrapper"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="article">发布文章</el-menu-item>
        <el-menu-item index="image">上传图片</el-menu-item>
        <el-menu-item index="video">上传视频</el-menu-item>
      </el-menu>
      <div class="content">
        <Editor v-show="currentShow === 'article'" />
        <UpImage v-show="currentShow === 'image'" />
        <UpVideo v-show="currentShow === 'video'" />
      </div>
    </div>
    <div class="login" v-show="!isLogined">
      <el-form
        class="login-form"
        size="small"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          <el-button @click="resetForm('ruleForm')">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Editor from "./components/editor.vue";
import UpImage from "./components/upload-image.vue";
import UpVideo from "./components/upload-video.vue";
import ajax from "./api";
export default {
  components: {
    Editor,
    UpImage,
    UpVideo
  },
  data() {
    return {
      currentShow: "article",
      isLogined: false,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "change" }]
      },
      ruleForm: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    handleSelect(type) {
      this.currentShow = type;
    },
    isActive(tag) {
      return this.currentShow === tag ? "active" : "";
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var formData = new FormData();
          formData.append('username',this.ruleForm.username)
          formData.append('password',this.ruleForm.password)
          console.log(this.ruleForm);
          ajax({
            data:formData,
            url:'/api/login',
            callback:(res)=>{
              if(res.success){
                //写入cookie.
                this.$message.success('登录成功');
                this.isLogined = true;
                //写入cookie
                document.cookie = "login=true;max-age=1200";
              }else{
                this.$message.error('登录失败');
                this.isLogined = false;
              }

            }
          })
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

  },
  mounted() {

    //读取cookie
    var cookie = document.cookie;
    if(cookie.indexOf("login=true") != -1){
      this.isLogined = true;
    }else{
      this.isLogined = false;
    }
  },
  watch:{

  }
};
</script>

<style>
body {
  margin: 0;
  padding-top:61px;
}
.content {
  padding: 8px;
}
.nav-wrapper {
  position: fixed !important;
  top: 0;
  width: 100%;
  z-index: 1000;
}
.login {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-image: url(./assets/spaceship.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.login-form {
  width: 30%;
  position: fixed;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
}
.CodeMirror img{
  max-width:100% !important;
}
</style>
