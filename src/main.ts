/*
 * @Description: 入口
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-24 10:42:53
 * @LastEditTime: 2021-06-05 15:58:52
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUi from './utils/element-ui'
import './utils/popup.min' // 提示框

import '@/assets/styles/var.scss' //主题样式变量
import '@/assets/styles/base.scss'

const app = createApp(App)

ElementUi(app).use(store).use(router).mount('#app')