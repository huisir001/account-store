/*
 * @Description: 入口
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-24 10:42:53
 * @LastEditTime: 2021-12-05 12:31:03
 */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUi from "./utils/ui";
import "./utils/toast";

import "@/assets/styles/var.scss"; //主题样式变量
import "@/assets/styles/base.scss";

// 路由后置钩子
router.afterEach((to) => {
  // 设置app高度变量
  if (to.name === "Login") {
    document.documentElement.setAttribute("style", "--appHeight:auto");
  } else {
    document.documentElement.setAttribute("style", "--appHeight:100%");
  }
  // 开发环境设置body宽高
  if (process.env.NODE_ENV === "development") {
    const {
      LOGIN_WIN_WIDTH,
      LOGIN_WIN_HEIGHT,
      MAIN_WIN_WIDTH,
      MAIN_WIN_HEIGHT,
    } = require("../sys/config/const").default;
    if (to.name === "Login") {
      document.body.setAttribute(
        "style",
        `background:#ccc;width:${LOGIN_WIN_WIDTH}px;height:${LOGIN_WIN_HEIGHT}px`
      );
    } else if (to.path.includes("/home")) {
      document.body.setAttribute(
        "style",
        `background:#ccc;width:${MAIN_WIN_WIDTH}px;height:${MAIN_WIN_HEIGHT}px`
      );
    }
  }
});

const app = createApp(App);

ElementUi(app)
  .use(store)
  .use(router)
  .mount("#app");
