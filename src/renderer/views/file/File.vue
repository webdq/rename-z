<template>
  <div class="page-file">
    <div style="margin-bottom: 20px">
      <a-alert
        message="提示：文件名为空或者文件名有重复，会导致文件被覆盖或文件丢失"
        type="info"
      ></a-alert>
    </div>

    <div class="op-row">
      <div>
        <a-space :size="10">
          <a-button @click="addFile" icon="file">添加文件</a-button>
          <a-button @click="addDirectory" icon="folder">添加文件夹</a-button>
          <a-button @click="removeAll" icon="delete">移除所有文件</a-button>
        </a-space>
      </div>
      <div>
        <a-space :size="10">
          <a-button @click="preview" icon="eye">预览</a-button>
          <a-button :loading="isStart" @click="start" icon="play-square"
            >开始</a-button
          >
        </a-space>
      </div>
    </div>

    <div class="datalist-row">
      <DataList @updateFileList="updateFileList" :list="fileList"></DataList>
    </div>

    <UploadLayer :visible="showUpload" @drop="drop"></UploadLayer>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import DataList from "./DataList";
import UploadLayer from "@/components/common/UploadLayer";
export default {
  data() {
    return {
      isStart: false,
      showUpload: false,
      fileList: [],
    };
  },
  computed: {
    actionList() {
      return [...this.$store.state.action.actionList];
    },
  },
  components: {
    DataList,
    UploadLayer,
  },
  methods: {
    ...mapActions("action", ["removeAllAction"]),
    drop(files) {
      this.appendFile(files);
      this.showUpload = false;
    },
    updateFileList(list) {
      this.fileList = list;
    },
    async addFile() {
      let { filePaths } = await window.openFile();
      let files = await window.path2fileObj(filePaths);
      this.appendFile(files);
    },
    async addDirectory() {
      let { filePaths } = await window.openDirectory();
      let files = await window.path2fileObj(filePaths);
      this.appendFile(files);
    },
    removeAll() {
      this.fileList = [];
    },
    appendFile(files) {
      files.forEach((file) => {
        let has = this.fileList.find((item) => item.path === file.path);
        if (!has) {
          let obj = {
            name: file.name,
            path: file.path,
            size: file.size,
            type: file.type,
            previewName: "",
            previewPath: "",
            newName: "",
            newPath: "",
            changed: -1,
          };
          this.fileList.push(obj);
        }
      });
    },
    valid(list) {
      let name1 = list.map((item) => item.previewPath);
      let name2 = [...new Set(name1)];
      return name1.length === name2.length;
    },
    preview() {
      let list = window.createPreviewName(this.actionList, this.fileList);
      this.fileList = list;
    },
    async start() {
      if (this.actionList.length === 0 || this.fileList.length === 0) return;
      this.isStart = true;
      let previewNameList = window.createPreviewName(
        this.actionList,
        this.fileList
      );
      let flag = this.valid(previewNameList);
      if (!flag) {
        this.$message.warning("有文件重名");
      } else {
        let list = await window.renameStart(this.actionList, this.fileList);
        this.fileList = list;
      }
      this.isStart = false;
    },
  },
  mounted() {
    this.removeAllAction(true);
    this.__dragenter = () => {
      if (!window.__drag) this.showUpload = true;
    };
    window.addEventListener("dragenter", this.__dragenter);
  },
  beforeDestroy() {
    window.removeEventListener("dragenter", this.__dragenter);
  },
};
</script>

<style lang="scss"></style>
