/*
 * @Description: 入口
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-24 10:42:53
 * @LastEditTime: 2021-05-24 11:19:32
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 样式
import '@/assets/styles/base.scss'

createApp(App).use(store).use(router).mount('#app')
