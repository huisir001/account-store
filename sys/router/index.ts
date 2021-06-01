/*
 * @Description: 服务分发
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-24 15:11:20
 * @LastEditTime: 2021-06-01 18:10:29
 */
import methods from "../service"
import Response from "../tools/Response"
import Permission from "../tools/Permission"
import { decodeToken } from "../tools/Token"
import { Log } from '../tools/Logger' //日志
import CONST from "../config/const"

export default async (ipcMain: Electron.IpcMain) => {
    // 接收渲染进程（操作系统模块）,将模块返回
    ipcMain.on('todo', async (event: Electron.IpcMainEvent, something: string, token?: string, ...params: any[]) => {
        let res: object
        if (Object.keys(methods).includes(something)) {
            try {
                // 验证token
                if (!Permission.verify(something)) {
                    if (!token) {
                        event.reply(something, Response.fail("Token验证失败"))
                        return
                    }
                    const userid = decodeToken(token)
                    const { data: { id } } = await methods.getLoginData()
                    const { data: { id: tokenId, act_time, token: cacheToken } } =
                        await methods.getTokenCache(token)

                    if (!userid || userid !== id || cacheToken !== token) {
                        event.reply(something, Response.fail("Token验证失败"))
                        return
                    } else if (Date.now() - new Date(act_time).getTime() >= CONST.LOGIN_TIMEOUT) {
                        event.reply(something, Response.fail("Token失效"))
                        return
                    } else {
                        // 更新token时间
                        await methods.updateCatcheActTime(tokenId)
                    }
                }

                // 执行方法
                res = await methods[something](...params)
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