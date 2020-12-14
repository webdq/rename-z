<template>
  <div class="bl">
    <div class="bl-sider">
      <SiderAction></SiderAction>
      <FooterBing></FooterBing>
    </div>
    <div class="bl-main">
      <div class="bl-header panel-box">
        <TabNav></TabNav>
      </div>
      <div class="bl-content panel-box">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import SiderAction from "@/components/common/SiderAction";
import TabNav from "@/components/common/TabNav";
import FooterBing from "@/components/common/FooterBing";
export default {
  data() {
    return {};
  },
  components: {
    SiderAction,
    TabNav,
    FooterBing,
  },
};
</script>

<style lang="scss" scoped>
.bl {
  padding: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex: auto;
  position: relative;
  z-index: 2;
  .bl-sider {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 0 0 300px;
    margin-right: 40px;
  }
  .bl-main {
    flex: auto;
    .bl-header {
      box-shadow: none;
      margin-bottom: 20px;
    }
    .bl-content {
      min-height: 500px;
    }
  }
}
</style>
