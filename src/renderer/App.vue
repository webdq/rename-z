<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <div class="stars">
        <div class="stars1"></div>
        <div class="stars2"></div>
        <div class="stars3"></div>
      </div>
      <router-view></router-view>
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
export default {
  data() {
    return {
      locale: zhCN,
    };
  },
};
</script>

<style>
/* CSS */
</style>
