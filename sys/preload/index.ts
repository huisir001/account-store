/*
 * @Description: 预加载脚本
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-22 23:22:25
 * @LastEditTime: 2021-05-29 18:06:44
 */

/**
 * 预加载脚本是为了渲染进程访问主进程数据、模块而生。避免渲染进程直接访问主进程模块（node）控制而带来的不安全因素
 * 无论页面是否集成Node，此脚本都可以调用所有Node API
 * 预加载脚本在渲染进程中最先执行。（在浏览器窗口中执行一次）
 * 这里可以设置访问后台数据的白名单，使用ipc进行进程间传值
 * 预加载js只会执行一次
 * 使用`contextBridge.exposeInMainWorld(key,data/method)`方法可以将方法暴露给渲染进程window对象，
 * 可见文档(https://www.electronjs.org/docs/api/context-bridge#contextbridge)
 */

/**
 * 此后我们在渲染进程中不会调用node模块，不会在渲染进程中处理系统级别的业务
 * 而是发送消息给主进程，主进程来完成业务，完成之后将结果告知渲染进程
 * 这种方式和web编程中的前后端分离模式相同
 * 也就是说用户以为系统级别的操作是在客户端窗口中完成的，而实际是通过消息传递（类似前端接口传参）到主进程（类似后端）完成的
 */

import { contextBridge, ipcRenderer as ipc } from 'electron'
import Response from "../config/Response"
import Permission from "../config/Permission"

/**
 * 关闭控制台安全警告
 * 除了这种方式，也可以在命令中执行`set ELECTRON_DISABLE_SECURITY_WARNINGS=true`
 */
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

/**
 * 将模块暴露给window对象
 */
contextBridge.exposeInMainWorld("sys", {
    do(something: string, parames: object): Promise<Response> {
        // 返回一个Promise用于接收执行结果
        return new Promise((resolve, reject) => {
            // 验证权限
            if (Permission.verify(something)) {
                // 发送请求
                ipc.send('todo', something, parames)

                // 接收请求结果
                ipc.on(something, (_, res) => {
                    if (res.ok === 1) {
                        resolve(res)
                    } else {
                        reject(res)
                    }
                })
            } else {
                reject(Response.fail(`“${something}”不是可用的请求！`))
            }
        })
    }
})