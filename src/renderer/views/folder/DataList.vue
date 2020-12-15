<template>
  <div class="list-wrap">
    <div class="list-head">
      <slot name="listHead">
        <a-row class="list-row" type="flex" justify="space-between">
          <a-col class="list-col" :span="colSpan[0]">文件名</a-col>
          <a-col class="list-col" :span="colSpan[1]">操作</a-col>
        </a-row>
      </slot>
    </div>
    <div v-if="fileList.length === 0" class="list-body">
      <slot name="emptyContent">
        <a-row class="list-row" type="flex" justify="space-between">
          <a-col class="list-col" :span="24">暂无文件</a-col>
        </a-row>
      </slot>
    </div>
    <div v-else class="list-body">
      <template v-if="isDrag">
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
                <a-button
                  @click="removeFile(item)"
                  size="small"
                  icon="delete"
                ></a-button>
                <a-button size="small" icon="drag"></a-button>
              </a-col>
            </a-row>
          </transition-group>
        </draggable>
      </template>
      <template v-else>
        <a-row
          class="list-row"
          v-for="(item, index) in fileList"
          :key="item.path"
          type="flex"
          justify="space-between"
        >
          <a-col class="list-col" :span="colSpan[0]">
            {{ item.newName }}
          </a-col>
          <a-col class="list-col" :span="colSpan[1]">
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
      </template>
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
        return [16, 8];
      },
    },
    isDrag: {
      type: Boolean,
      default: true,
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
