/*
 * @Description: 服务分发
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-24 15:11:20
 * @LastEditTime: 2021-05-25 13:18:53
 */

import { saveAccount } from "../service"

// 方法map
const methods = {
    saveAccount
}

export default (ipcMain: Electron.IpcMain) => {
    // 接收渲染进程（操作系统模块）,将模块返回
    ipcMain.on('todo', async (event: Electron.IpcMainEvent, something: string, parames: object) => {
        let res: object
        if (Object.keys(methods).includes(something)) {
            res = await saveAccount(parames)
        } else {
            res = {
                ok: 0,
                msg: `不存在“${something}”方法或此方法被禁用！`
            }
        }
        event.reply(something, res)
    })
}