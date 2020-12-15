<template>
  <div class="footer-text">
    <span>当前版本：{{ version }}</span>
    <span @click="updateClick" class="update-text">检查更新</span>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  data() {
    return {
      version: "",
    };
  },
  methods: {
    updateClick() {
      ipcRenderer.send("update");
    },
  },
  mounted() {
    ipcRenderer.send("get-version");
    ipcRenderer.on("get-version", (event, version) => {
      this.version = version;
    });
  },
};
</script>

<style lang="scss" scoped>
.footer-text {
  color: #fff;
  text-shadow: 1px 1px #f37c7c;
  text-align: right;
}
.update-text {
  margin-left: 20px;
  cursor: pointer;
}
</style>
