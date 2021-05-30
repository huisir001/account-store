/*
 * @Description: 服务分发
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-24 15:11:20
 * @LastEditTime: 2021-05-30 12:09:58
 */

import accountsMethods from "../service/accounts"
import loginMethods from "../service/login"
import Response from "../config/Response"
import { Log } from '../tools/Logger' //日志

// 定义可索引类型的接口
interface IMethods {
    [key: string]: (...arg: any[]) => any
}

// 方法map
const methods: IMethods = {
    ...accountsMethods,
    ...loginMethods
}

export default (ipcMain: Electron.IpcMain) => {
    // 接收渲染进程（操作系统模块）,将模块返回
    ipcMain.on('todo', async (event: Electron.IpcMainEvent, something: string, params: object) => {
        let res: object
        if (Object.keys(methods).includes(something)) {

            try {
                res = await methods[something](params)
            } catch (err) {
                res = Response.fail("执行错误：" + err.toString())
                Log.error("执行错误：", err.toString())
            }

        } else {
            res = Response.fail(`不存在“${something}”方法或此方法被禁用！`)
        }
        event.reply(something, res)
    })
}