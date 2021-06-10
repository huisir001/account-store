/*
 * @Description: 
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-22 15:46:37
 * @LastEditTime: 2021-06-11 01:26:31
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
      const $app = document.getElementById("app")
      $app?.setAttribute("class", "show")
    }
  },
  modules: {
  }
})
