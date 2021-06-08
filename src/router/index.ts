/*
 * @Description: 路由配置
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-24 10:42:53
 * @LastEditTime: 2021-06-08 14:57:42
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import CreateAccount from '../components/CreateAccount.vue'

/**
 * 由于是本地桌面应用，用户只有自己一个
 * 所以不做beforeEach路由跳转权限验证
 * 另外，登录状态已经由主线程维护，登录失效或token错误会直接打开登录窗口、关闭主窗口
 * 所以这里不用操心登录问题
 */

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: "/home/createAccount",
    children: [
      {
        path: 'createAccount',
        name: 'CreateAccount',
        component: CreateAccount,
        meta: {
          title: '新增账户',
          icon: 'el-icon-folder-add',
        },
      },
      {
        path: 'accountList',
        name: 'AccountList',
        component: () => import('../components/AccountList.vue'),
        meta: {
          title: '账户列表',
          icon: 'el-icon-files',
        },
      },
      {
        path: 'operateLogs',
        name: 'OperateLogs',
        component: () => import('../components/OperateLogs.vue'),
        meta: {
          title: '操作日志',
          icon: 'el-icon-chat-line-square',
        },
      },
      {
        path: 'options',
        name: 'Options',
        component: () => import('../components/Options.vue'),
        meta: {
          title: '设置选项',
          icon: 'el-icon-cpu',
        },
      }
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  // history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
