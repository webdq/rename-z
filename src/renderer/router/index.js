import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/page/file",
    },
    {
      path: "/page",
      redirect: "/page/file",
      component: () => import("@/components/layout/BaseLayout"),
      children: [
        {
          path: "/page/file",
          name: "page-file",
          component: () => import("@/views/file/File"),
        },
        {
          path: "/page/folder",
          name: "page-folder",
          component: () => import("@/views/folder/Folder"),
        },
      ],
    },
    {
      path: "*",
      redirect: "/",
    },
  ],
});
