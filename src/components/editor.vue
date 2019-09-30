<template>
  <div>
    <el-form
      size="small"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="文章描述" prop="desc">
        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
      </el-form-item>
      <el-form-item label="文章封面">
        <img :src="dataUrl" alt="" style="vertical-align:middle;margin-right:10px;">
        <el-button size="mini" type="info" @click="openDialog">选择图片</el-button>
        <!-- <imageCut @dataReady="handleData" /> -->
      </el-form-item>
    </el-form>
    <el-dialog @close="dialogVisible = false;" title="选择剪切图片" :visible="dialogVisible">
      <imageCut @dataReady="handleData" />
    </el-dialog>
    <textarea id="editor"></textarea>
    <el-button size="small" type="primary" @click="handlePost">发表文章</el-button>
  </div>
</template>

<script>
import imageCut from "./imageCut";
import ajax from "../api";
export default {
  name: "app",
  data() {
    return {
      simplemde: null,
      file: null,
      dataUrl:'',
      ruleForm: {
        title: "",
        desc: ""
      },
      rules: {
        title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
        desc: [{ required: true, message: "请输入文章描述", trigger: "change" }]
      },
      dialogVisible:false
    };
  },
  components: {
    imageCut
  },
  methods: {
    openDialog(event){
      event.preventDefault();
      this.dialogVisible = true;
    },
    handleData({ file, dataUrl }) {
      this.file = file;
      this.dataUrl = dataUrl;
    },
    handlePost() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (this.simplemde.value() === "") {
            this.$message.error("请编写文章内容！");
            return;
          }
          if (!this.file) {
            this.$message.error("请上传封面！");
            return;
          }
          var formData = new FormData();

          formData.append("title", this.ruleForm.title);
          formData.append("desc", this.ruleForm.desc);
          formData.append("content", this.simplemde.value());
          formData.append("coverImg", this.file);
          console.log(formData);
          ajax({
            url: "/api/upload-article",
            data: formData,
            callback: function(res) {
              if (res.success === true) {
                alert("发布成功！");
              }
            }
          });
        }
      });
    }
  },
  mounted() {
    // Most options demonstrate the non-default behavior
    this.simplemde = new SimpleMDE({
      element: document.getElementById("editor"),
      spellChecker: false,
      toolbar: [
        "bold",
        "italic",
        "link",
        "image",
        "table",
        "preview",
        "heading",
        "strikethrough",
        "ordered-list",
        "unordered-list",
        "|",
        "quote"
      ],
      autosave: {
        enabled: true,
        unique_id: "editor"
      }
    });
  }
};
</script>

<style>
</style>
