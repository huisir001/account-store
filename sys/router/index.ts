/*
 * @Description: 服务分发
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-24 15:11:20
 * @LastEditTime: 2021-05-26 11:29:37
 */

import { saveAccount, delAccount, getAccountListByPage } from "../service/accounts"
import Response from "../config/Response"

// 定义可索引类型的接口
interface IMethods {
    [key: string]: (...arg: any[]) => any
}

// 方法map
const methods: IMethods = {
    // accounts
    saveAccount,
    delAccount,
    getAccountListByPage
}

export default (ipcMain: Electron.IpcMain) => {
    // 接收渲染进程（操作系统模块）,将模块返回
    ipcMain.on('todo', async (event: Electron.IpcMainEvent, something: string, params: object) => {
        let res: object
        if (Object.keys(methods).includes(something)) {
            res = await methods[something](params)
        } else {
            res = Response.fail(`不存在“${something}”方法或此方法被禁用！`)
        }
        event.reply(something, res)
    })
}