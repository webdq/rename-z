<template>
  <div
    @dragenter.stop.prevent="dragenter"
    @dragover.stop.prevent="dragover"
    @dragleave.stop.prevent.self="dragleave"
    @drop.stop.prevent="drop"
    class="upload"
    :class="{ active: dragHover }"
  >
    <div class="upload-content">
      <p class="upload-icon"><a-icon type="inbox" /></p>
      <p class="upload-text">拖拽文件到这里</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dragHover: false,
    };
  },
  methods: {
    dragenter(e) {
      console.log(e);
      this.$emit("dragenter");
      this.dragHover = true;
    },
    dragover(e) {
      this.$emit("dragover");
      this.dragHover = true;
    },
    dragleave(e) {
      this.$emit("dragleave");
      this.dragHover = false;
    },
    drop(e) {
      let files = [...e.dataTransfer.files];
      this.$emit("drop", files);
      this.dragHover = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.upload {
  width: 100%;
  height: 100%;
  padding: 20px;
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.7);
  transition: border-color 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 2000;
  &:not(.upload-dragger-disabled):hover {
    border-color: #f97878;
  }
  &:not(.upload-dragger-disabled).active {
    border-color: #f97878;
  }
  .upload-content {
    text-align: center;
  }
  .upload-icon {
    font-size: 60px;
    margin-bottom: 20px;
  }
  .upload-text {
    font-size: 30px;
    margin-bottom: 20px;
  }
}
</style>
