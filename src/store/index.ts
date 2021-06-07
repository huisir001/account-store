/*
 * @Description: 
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-22 15:46:37
 * @LastEditTime: 2021-06-06 10:23:08
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
    }
  },
  modules: {
  }
})
