/*
 * @Description: 路由配置
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-24 10:42:53
 * @LastEditTime: 2021-06-02 15:58:06
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

/**
 * 由于是本地桌面应用，用户只有自己一个
 * 所以不做beforeEach路由跳转权限验证
 * 另外，登录状态已经由主线程维护，登录失效或token错误会直接打开登录窗口、关闭主窗口
 * 所以这里不用操心登录问题
 */

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  // history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
