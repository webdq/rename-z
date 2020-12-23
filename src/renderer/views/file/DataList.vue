<template>
  <div class="list-wrap">
    <div class="list-head">
      <a-row class="list-row" type="flex" justify="space-between">
        <a-col class="list-col" :span="colSpan[0]">文件名</a-col>
        <a-col class="list-col" :span="colSpan[1]">修改后</a-col>
        <a-col class="list-col" :span="colSpan[2]">操作</a-col>
        <a-col class="list-col" :span="colSpan[3]">结果</a-col>
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
            <a-col class="list-col" :span="colSpan[0]">
              <a-popover>
                <template slot="content">
                  <p>文件路径：{{ item.path }}</p>
                  <p>文件类型：{{ item.type }}</p>
                </template>
                <span><a-icon type="info-circle" /> {{ item.name }}</span>
              </a-popover>
            </a-col>
            <a-col class="list-col" :span="colSpan[1]">
              <a-popover>
                <template slot="content">
                  <p>{{ item.previewName }}</p>
                </template>
                <span>{{ item.previewName }}</span>
              </a-popover>
            </a-col>
            <a-col class="list-col" :span="colSpan[2]">
              <a-button @click="removeFile(item)" size="small" icon="delete"
                >移除</a-button
              >
              <a-button size="small" icon="drag">拖动</a-button>
            </a-col>
            <a-col class="list-col" :span="colSpan[3]">
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
</template>

<script>
import draggable from "vuedraggable";
export default {
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    colSpan: {
      type: Array,
      default() {
        return [8, 8, 6, 2];
      },
    },
    group: {
      type: String,
      default: "files",
    },
  },
  watch: {
    list(val) {
      this.fileList = [...val];
    },
  },
  data() {
    return {
      fileList: [...this.list],
      dragOptions: {
        animation: 200,
        group: this.group,
        disabled: false,
        ghostClass: "ghost",
      },
    };
  },
  components: {
    draggable,
  },
  methods: {
    dragStart() {
      window.__drag = true;
    },
    dragEnd() {
      window.__drag = false;
      this.$emit("updateFileList", this.fileList);
    },
    removeFile(file) {
      this.fileList = this.fileList.filter((item) => item.path !== file.path);
      this.$emit("updateFileList", this.fileList);
    },
  },
};
</script>

<style lang="scss" scoped></style>
