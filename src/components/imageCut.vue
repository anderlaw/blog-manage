<template>
  <div>
    <div class="upload-core">
      <img @mousedown="handleMouseDown" class="preview-image" :src="dataUrl" alt />
      <div @mousedown="handleMove" class="cut-box"></div>
    </div>
    <div class="upload-control">
      <input @change="handleFileChange" type="file" class="file-box"/>
      <button @click="cutImage" class="cut-btn">裁剪</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      _previewImg: null,
      _cutBox: null,
      _fileBox:null,
      _left: 0,
      _top: 0,
      file: null,
      dataUrl: "",
    };
  },
  methods: {
    initEles(){
      this._previewImg = this.$el.querySelector('.preview-image');
      this._cutBox = this.$el.querySelector(".cut-box");
      this._fileBox = this.$el.querySelector(".file-box");
    },
    initCutBox(){
      this._cutBox.style.width = 0;
      this._cutBox.style.height = 0;
    },
    sendData(){
      this.$emit('dataReady',{
        file:this.file,
        dataUrl:this.dataUrl
      })
    },
    handleFileChange(param) {
      this.file = param.target.files[0];
      var fileReader = new FileReader();

      fileReader.onload = () => {
        // 通过 reader.result 来访问生成的 DataURL
        this.dataUrl = fileReader.result;
      };
      fileReader.readAsDataURL(this.file);

      //发生图片给父亲。
      this.sendData();
    },
    
    handleMouseDown(event) {
      //初始化剪切框，大小设置为0*0；
      this.initCutBox();

      //阻止默认行为，清除图片无法拖动影响。
      event.preventDefault();

      //获取预览图片距离视口的位置。left,top.
      var obj = this._previewImg.getBoundingClientRect();

      //记录按下鼠标的位置。
      var startX = event.clientX;
      var startY = event.clientY;

      this._left = startX - obj.left;
      this._top = startY - obj.top;

      const moveFn = (event) => {
        //阻止默认行为
        event.preventDefault();

        var endX = event.clientX;
        var endY = event.clientY;


        //修正终点
        if (endX >= obj.right) {
          endX = obj.right;
        }
        if (endX <= obj.left) {
          endX = obj.left;
        }
        if (endY >= obj.bottom) {
          endY = obj.bottom;
        }
        if (endY <= obj.top) {
          endY = obj.top;
        }

        //修正left、top值。
        if (endX <= startX) {
          this._left = endX - obj.left;
        }
        if (endY <= startY) {
          this._top = endY - obj.top;
        }

        var width = Math.abs(endX - startX);
        var height = Math.abs(endY - startY);

        
        this._cutBox.style.left = this._left + "px";
        this._cutBox.style.top = this._top + "px";
        this._cutBox.style.width = width + "px";
        this._cutBox.style.height = height + "px";
      }
      const upFn = (event) =>{
        document.removeEventListener("mousemove", moveFn);
        document.removeEventListener("mouseup", upFn);
      }
      document.addEventListener("mousemove", moveFn);
      document.addEventListener("mouseup", upFn);
    },
    handleMove(event) {
      //获取移动的距离，对_left和_top值进行修整。
      event.stopPropagation();
      var startX = event.clientX;
      var startY = event.clientY;

      const moveFn = (event) => {
        var distanceX = event.clientX - startX;
        var distanceY = event.clientY - startY;
        //记录left、top值。
        this._left += distanceX;
        this._top += distanceY;

        var newLeft = parseFloat(getComputedStyle(this._cutBox).left) + distanceX;
        var newTop = parseFloat(getComputedStyle(this._cutBox).top) + distanceY;

        this._cutBox.style.left = newLeft + "px";
        this._cutBox.style.top = newTop + "px";

        //循环重置起点位置。
        startX = event.clientX;
        startY = event.clientY;
      }
      const upFn = (event) => {
        this._cutBox.style.cursor = "default";
        document.removeEventListener("mousemove", moveFn);
        document.removeEventListener("mouseup", upFn);
      }
      document.addEventListener("mousemove", moveFn);
      document.addEventListener("mouseup", upFn);
    },
    cutImage(ev) {
      //此组件放在el-form里，会导致自动提交，preventDefault取消默认事件。

      ev.preventDefault();

      //获取剪切好的图像，然后给图片区域。并获取记录对应的blob.
      var canvas = document.createElement("canvas");
      var width = parseFloat(getComputedStyle(this._cutBox).width);
      var height = parseFloat(getComputedStyle(this._cutBox).height);

      //必须此处设置宽高，否则图片后面绘制时设置宽高无效。
      canvas.width = width;
      canvas.height = height;

      var ctx = canvas.getContext("2d");

      ctx.drawImage(this._previewImg, this._left, this._top, width, height, 0, 0, width, height); //绘制
      //
      this.dataUrl = canvas.toDataURL();

      //同时转化为blob
      canvas.toBlob((blob) => {
        this.file = new window.File([blob], "random." + blob.type.split("/")[1], {
          type: blob.type
        });
        //发送数据到父元素
        this.sendData();
      });
      //关闭剪切框
      this.initCutBox();
      //清空文件筐
      this._fileBox.value = null;

    },
  },
  mounted() {
    this.initEles();
  }
};
</script>

<style scoped>
.upload-control {
  margin-top: 10px;
}
.upload-core {
  position: relative;
  min-height: 100px;
  background-image: url(../assets/upload-bg.jpg);
}
.cut-box{
  position: absolute;
  background: #000;
  transition: opacity 1s;
  border: 1px dashed #fff;
  opacity: 0.5;
  outline-style: auto;
  outline-width: 3px;
  outline-color: rgba(0, 0, 0, 0.3);
}
</style>
