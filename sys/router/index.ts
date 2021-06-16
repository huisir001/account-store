/*
 * @Description: 服务分发
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-24 15:11:20
 * @LastEditTime: 2021-06-16 15:52:10
 */
import { BrowserWindow } from 'electron'
import methods from "../service"
import Response from "../tools/Response"
import Permission from "../tools/Permission"
import { decodeToken } from "../tools/Token"
import { Log } from '../tools/Logger' //日志
import CONST from "../config/const"

export default async (ipcMain: Electron.IpcMain, createWindow: (isLoginWin?: boolean, query?: object) => any) => {

    // 缓存当前主窗口
    let mainWindow: BrowserWindow

    // 接收渲染进程事件（操作系统模块）,将模块返回
    ipcMain.on('todo', async (event: Electron.IpcMainEvent, something: string, token?: string, ...params: any[]) => {
        let res: object

        // 登录成功启动主窗口
        if (something === "openMainWindow") {
            // 启动主窗口，将token以query方式传回
            mainWindow = createWindow(false, { token })
            return
        }

        // 重新登录
        if (something === "openLoginWindow") {
            mainWindow = createWindow(true)
            return
        }

        // 子窗口创建
        if (something === "openChildWindow") {
            if (mainWindow && params && params[0] && params[0].url) {
                params[0].parent = mainWindow
            } else {
                event.reply(something, Response.fail("参数错误或父窗口未创建"))
                return
            }
        }

        // token验证
        const failLogin = (msg: string = "Token验证失败，请重新登录") => {
            event.reply(something, Response.fail({ ok: 401, msg }))
        }

        if (Object.keys(methods).includes(something)) {
            try {
                // 验证token
                if (!Permission.verify(something)) {
                    if (!token) {
                        failLogin()
                        return
                    }
                    const userid = decodeToken(token)
                    const { data: { id } } = await methods.getLoginData()

                    // 查询缓存中的token数据
                    const tokenCacheRes = await methods.getTokenCache(token)

                    if (!tokenCacheRes) {
                        failLogin()
                        return
                    }

                    const { data: { id: tokenId, act_time, token: cacheToken } } = tokenCacheRes

                    if (!userid || userid !== id || cacheToken !== token) {
                        failLogin()
                        return
                    } else if (Date.now() - new Date(act_time).getTime() >= CONST.LOGIN_TIMEOUT) {
                        failLogin("登录超时，请重新登录")
                        return
                    } else {
                        // 更新token时间
                        await methods.updateCatcheActTime(tokenId)
                    }
                }

                // 执行方法
                res = await methods[something](...params)
            } catch (err) {
                res = Response.fail("执行错误：" + (err as any).toString())
                Log.error("执行错误：", (err as any).toString())
            }

        } else {
            res = Response.fail(`不存在“${something}”方法或此方法被禁用！`)
        }

        event.reply(something, res)
    })
}