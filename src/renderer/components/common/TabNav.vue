<template>
  <div class="panel">
    <div class="tab-nav">
      <a-space>
        <router-link to="/page/file" class="tab-nav-item"
          >修改文件名</router-link
        >
        <router-link to="/page/folder" class="tab-nav-item"
          >修改映射文件名称</router-link
        >
      </a-space>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.tab-nav-item {
  display: inline-block;
  font-weight: 400;
  white-space: nowrap;
  text-align: center;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  user-select: none;
  touch-action: manipulation;
  height: 32px;
  padding: 0 15px;
  font-size: 14px;
  line-height: 30px;
  border-radius: 15px;
  background-color: transparent;
  border-color: #fff;
  color: #fff;
}
.router-link-exact-active,
.tab-nav-item:hover,
.tab-nav-item.active {
  background-color: #fff;
  color: #ff7c7c;
  box-shadow: 0 2px 10px #d86767, 0 12px 18px #d85e5e;
}
</style>
