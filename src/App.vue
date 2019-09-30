<template>
  <div id="app">
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
</template>

<script>
import Editor from "./components/editor.vue";
import UpImage from "./components/upload-image.vue";
import UpVideo from "./components/upload-video.vue";
export default {
  components: {
    Editor,
    UpImage,
    UpVideo
  },
  data() {
    return {
      currentShow: "article",

    };
  },
  methods: {
    handleSelect(type) {
      this.currentShow = type;
    },
    isActive(tag) {
      return this.currentShow === tag ? "active" : "";
    }
  },
  mounted() {
    var height = this.$el.querySelector(".nav-wrapper").clientHeight;

    document.querySelector("#app").style.paddingTop = height + "px";
  }
};
</script>

<style>
body {
  margin: 0;
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
</style>
