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
      <div class="list-wrap">
        <div class="list-head">
          <a-row class="list-row" type="flex" justify="space-between">
            <a-col class="list-col" :span="8">文件名</a-col>
            <a-col class="list-col" :span="8">修改后</a-col>
            <a-col class="list-col" :span="6">操作</a-col>
            <a-col class="list-col" :span="2">结果</a-col>
          </a-row>
        </div>
        <div v-if="fileList.length === 0" class="list-body">
          <a-row class="list-row" type="flex" justify="space-between">
            <a-col class="list-col" :span="24">暂无文件</a-col>
          </a-row>
        </div>
        <div v-else class="list-body">
          <draggable
            @start="dragStart"
            @end="dragEnd"
            v-model="fileList"
            v-bind="dragOptions"
            handle=".list-row"
          >
            <transition-group type="transition" name="flip-list">
              <a-row
                class="list-row"
                v-for="(item, index) in fileList"
                :key="item.path"
                type="flex"
                justify="space-between"
              >
                <a-col class="list-col" :span="8">
                  <a-popover>
                    <template slot="content">
                      <p>文件路径：{{ item.path }}</p>
                      <p>文件类型：{{ item.type }}</p>
                    </template>
                    <span><a-icon type="info-circle" /> {{ item.name }}</span>
                  </a-popover>
                </a-col>
                <a-col class="list-col" :span="8">{{ item.newName }}</a-col>
                <a-col class="list-col" :span="6">
                  <a-button @click="removeFile(item)" size="small" icon="delete"
                    >移除</a-button
                  >
                  <a-button size="small" icon="drag">拖动</a-button>
                </a-col>
                <a-col class="list-col" :span="2">
                  <a-icon
                    v-show="item.changed === 1"
                    :style="{ fontSize: '20px' }"
                    type="check-circle"
                    theme="twoTone"
                    twoToneColor="#52c41a"
                  />
                  <a-icon
                    v-show="item.changed === 0"
                    :style="{ fontSize: '20px' }"
                    type="close-circle"
                    theme="twoTone"
                    twoToneColor="#f5222d"
                  />
                </a-col>
              </a-row>
            </transition-group>
          </draggable>
        </div>
      </div>
    </div>

    <UploadLayer v-show="showUpload" @drop="drop"></UploadLayer>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import UploadLayer from "@/components/common/UploadLayer";
export default {
  data() {
    return {
      isStart: false,
      showUpload: false,
      dragOptions: {
        animation: 200,
        group: "files",
        disabled: false,
        ghostClass: "ghost",
      },
      fileList: [],
    };
  },
  computed: {
    actionList() {
      return [...this.$store.state.action.actionList];
    },
  },
  components: {
    draggable,
    UploadLayer,
  },
  methods: {
    dragStart() {
      window.__drag = true;
    },
    dragEnd() {
      window.__drag = false;
    },
    drop(files) {
      this.appendFile(files);
      this.showUpload = false;
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
            newName: "",
            newPath: "",
            changed: -1,
          };
          this.fileList.push(obj);
        }
      });
    },
    removeFile(file) {
      this.fileList = this.fileList.filter((item) => item.path !== file.path);
    },
    valid() {
      let name1 = this.fileList.map((item) => item.newPath);
      let name2 = [...new Set(name1)];
      return name1.length === name2.length;
    },
    preview() {
      let list = window.createNewName(this.actionList, this.fileList);
      this.fileList = list;
    },
    async start() {
      let flag = this.valid();
      if (!flag) {
        this.$message.warning("有文件重名");
        return;
      }
      if (this.actionList.length === 0 || this.fileList.length === 0) return;
      this.isStart = true;
      let list = await window.renameStart(this.actionList, this.fileList);
      this.fileList = list;
      this.isStart = false;
    },
  },
  mounted() {
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
