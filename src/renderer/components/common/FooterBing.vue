<template>
  <div class="footer-bing panel-box" :style="footerStyle">
    <div class="copyright">
      <div class="copyright-bg" :style="footerStyle"></div>
      <div class="copyright-text">{{ copyright }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      host: "https://cn.bing.com",
      url: "",
      copyright: "",
      footerStyle: {},
    };
  },
  methods: {
    async getData() {
      try {
        let res = await this.$http.get(
          "https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1"
        );
        this.copyright = res.data.images[0].copyright;
        this.url = res.data.images[0].url;
        this.footerStyle.backgroundImage =
          "url(" + this.host + res.data.images[0].url + ")";
      } catch (e) {}
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style lang="scss" scoped>
.footer-bing {
  width: 300px;
  height: 180px;
  margin-top: 20px;
  background-size: cover;
  background-color: #ddd;
  overflow: hidden;
  position: relative;
  .copyright {
    padding: 10px;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.3);
    .copyright-bg {
      margin: -5px;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      filter: blur(10px);
      z-index: 1;
      background-size: cover;
    }
    .copyright-text {
      position: relative;
      z-index: 2;
      color: #fff;
      font-size: 12px;
    }
  }
}
</style>
