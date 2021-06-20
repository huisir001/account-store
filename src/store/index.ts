/*
 * @Description: store
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-22 15:46:37
 * @LastEditTime: 2021-06-20 10:35:02
 */
import { createStore } from 'vuex'

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
    showSlideInAnimate() {
      const $app = document.getElementById("app")
      $app?.setAttribute("class", "slidein")
    },
    showApp() {
      const $body = document.body
      const $app = document.getElementById("app")
      $body.setAttribute("class", "show")
      $app?.setAttribute("class", "show")
    }
  },
  modules: {
  }
})
