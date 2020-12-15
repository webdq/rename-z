<template>
  <div class="page-file">
    <div style="margin-bottom: 20px">
      <a-alert
        style="margin-bottom: 10px;"
        message="提示：文件名为空或者文件名有重复，会导致文件被覆盖或文件丢失"
        type="info"
      ></a-alert>
      <a-alert
        message="提示：主文件名不会修改，副文件名会被修改"
        type="info"
      ></a-alert>
    </div>

    <div class="op-row">
      <div>
        <a-space :size="10">
          <a-button-group>
            <a-button @click="addFile" icon="file">添加主文件</a-button>
            <a-button @click="removeAll" icon="delete">移除主文件</a-button>
          </a-button-group>
          <a-button-group>
            <a-button @click="addFile2" icon="file">添加副文件</a-button>
            <a-button @click="removeAll2" icon="delete">移除副文件</a-button>
          </a-button-group>
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
      <a-row type="flex" justify="space-between">
        <a-col :span="8">
          <DataList
            @updateFileList="updateMasterFileList"
            :list="masterFileList"
            group="masterFiles"
            style="background: #fff8d7;"
          >
            <template v-slot:listHead>
              <a-row class="list-row" type="flex" justify="space-between">
                <a-col class="list-col" :span="16">主文件名</a-col>
                <a-col class="list-col" :span="8">操作</a-col>
              </a-row>
            </template>
          </DataList>
        </a-col>

        <a-col :span="8">
          <DataList
            @updateFileList="updateSubFileList"
            :list="subFileList"
            group="subFiles"
            style="background: #ffeaea;"
          >
            <template v-slot:listHead>
              <a-row class="list-row" type="flex" justify="space-between">
                <a-col class="list-col" :span="16">副文件名</a-col>
                <a-col class="list-col" :span="8">操作</a-col>
              </a-row>
            </template>
          </DataList>
        </a-col>

        <a-col :span="8">
          <DataList :list="subFileList" :isDrag="false">
            <template v-slot:listHead>
              <a-row class="list-row" type="flex" justify="space-between">
                <a-col class="list-col" :span="16">修改后</a-col>
                <a-col class="list-col" :span="8">结果</a-col>
              </a-row>
            </template>
            <template v-slot:emptyContent>
              <a-row class="list-row" type="flex" justify="space-between">
                <a-col class="list-col" :span="24"></a-col>
              </a-row>
            </template>
          </DataList>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { v4 as uuidv4 } from "uuid";
import DataList from "./DataList";
export default {
  data() {
    return {
      isStart: false,
      masterFileList: [],
      subFileList: [],
    };
  },
  computed: {
    actionList() {
      return [...this.$store.state.action.actionList];
    },
  },
  components: {
    DataList,
  },
  methods: {
    ...mapActions("action", ["removeAllAction", "addAction"]),
    transferSubFileName() {
      let list = [];
      this.subFileList.forEach((item, index) => {
        let master = this.masterFileList[index];
        if (master) {
          list.push({ ...item, newName: master.name });
        }
      });
      return list;
    },
    updateMasterFileList(list) {
      this.masterFileList = list;
    },
    updateSubFileList(list) {
      this.subFileList = list;
    },
    async addFile() {
      let { filePaths } = await window.openFile();
      let files = await window.path2fileObj(filePaths);
      this.appendFile("masterFileList", files);
    },
    async addFile2() {
      let { filePaths } = await window.openFile();
      let files = await window.path2fileObj(filePaths);
      this.appendFile("subFileList", files);
    },
    removeAll() {
      this.masterFileList = [];
    },
    removeAll2() {
      this.subFileList = [];
    },
    appendFile(fileListName, files) {
      files.forEach((file) => {
        let has = this[fileListName].find((item) => item.path === file.path);
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
          this[fileListName].push(obj);
        }
      });
    },
    valid(list) {
      let name1 = list.map((item) => item.previewPath);
      let name2 = [...new Set(name1)];
      return name1.length === name2.length;
    },
    preview() {
      let transferFileList = this.transferSubFileName();
      let list = window.createPreviewName(this.actionList, transferFileList);
      this.subFileList = list;
    },
    async start() {
      if (
        this.actionList.length === 0 ||
        this.masterFileList.length === 0 ||
        this.subFileList.length === 0
      )
        return;
      this.isStart = true;
      let transferFileList = this.transferSubFileName();
      let previewNameList = window.createPreviewName(
        this.actionList,
        transferFileList
      );
      let flag = this.valid(previewNameList);
      if (!flag) {
        this.$message.warning("有文件重名");
      } else {
        let list = await window.renameStart(this.actionList, transferFileList);
        this.subFileList = list;
      }
      this.isStart = false;
    },
  },
  mounted() {
    this.removeAllAction(true);
    this.addAction({
      id: uuidv4(),
      title: "映射文件名称",
      type: "mapping-name",
      isNotEdit: true,
      isNotRemove: true,
    });
  },
};
</script>

<style lang="scss"></style>
