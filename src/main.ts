/*
 * @Description: 入口
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-24 10:42:53
 * @LastEditTime: 2021-12-05 11:35:02
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUi from './utils/ui'
import './utils/toast'

import '@/assets/styles/var.scss' //主题样式变量
import '@/assets/styles/base.scss'

// 开发环境设置body宽高
if (process.env.NODE_ENV == 'development') {
    const CONST = require('../sys/config/const').default
    router.afterEach((to) => {
        if (to.name === "Login") {
            document.body.style.width = CONST.LOGIN_WIN_WIDTH + 'px'
            document.body.style.height = CONST.LOGIN_WIN_HEIGHT + 'px'
        } else if (to.path.includes("/home")) {
            document.body.style.width = CONST.MAIN_WIN_WIDTH + 'px'
            document.body.style.height = CONST.MAIN_WIN_HEIGHT + 'px'
        }
    })
}

const app = createApp(App)

ElementUi(app).use(store).use(router).mount('#app')