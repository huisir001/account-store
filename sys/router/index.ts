/*
 * @Description: 服务分发
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-24 15:11:20
 * @LastEditTime: 2021-05-29 17:17:39
 */

import { saveAccount, delAccount, getAccountListByPage } from "../service/accounts"
import Response from "../config/Response"
import { Log } from '../tools/Logger' //日志

// 定义可索引类型的接口
interface IMethods {
    [key: string]: (...arg: any[]) => any
}

// 方法map
const methods: IMethods = {
    // accounts
    saveAccount,
    delAccount,
    getAccountListByPage,
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