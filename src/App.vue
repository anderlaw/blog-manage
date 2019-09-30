<template>
  <div id="app">
    <button @click="switchIpt">点击</button>
    <Editor v-if="count === 0"/>
    <UpImage v-if="count === 1"/>
    <UpVideo v-if="count === 2"/>
  </div>
</template>

<script>

import Editor from './components/editor.vue'
import UpImage from './components/upload-image.vue'
import UpVideo from './components/upload-video.vue'
export default {
  components: {
    Editor,
    UpImage,
    UpVideo
  },
  data(){
    return {
      count:0
    }
  },
  methods:{
    switchIpt(){
      this.count++;
      this.count = this.count % 3;
    }
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
