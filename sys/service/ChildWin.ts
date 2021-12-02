/*
 * @Description: 子窗口创建
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-11 11:25:57
 * @LastEditTime: 2021-12-02 11:28:00
 */

import { BrowserWindow, ipcMain } from 'electron'
import Response from "../tools/Response"
import path from 'path'
import curWin from '../tools/curWin'
const IsDev: boolean = process.env.NODE_ENV === "development" // 环境变量

/**
 * @description: 创建子窗口
 * @param {Electron} options
 * @return {*}
 */
export const openChildWindow = (options: IOpenChildWinArgs): Promise<any> => {

    return new Promise((resolve) => {

        const { wid, url, title = "加载中...", width = 400, height = 500, backgroundColor = '#ffffff', parent } = options

        // tslint:disable-next-line:variable-name
        const _options: Electron.BrowserWindowConstructorOptions = {
            title,
            width,
            height,
            parent,
            show: false, // 默认先隐藏，等待渲染进程完全启动后再显示窗口，可避免窗口闪烁
            modal: true,
            frame: true, // 边框显示
            fullscreen: false, // 是否全屏
            backgroundColor, // 初始化背景
            resizable: IsDev, // 宽高拖拽
            transparent: false, // 窗口透明
            icon: path.join(__dirname, '../../favicon.ico'), // 标题ico图标
            webPreferences: {// web首选项
                nodeIntegration: false, // 拒绝node模块
                webSecurity: false,  // 关闭窗口跨域,可访问本地绝对路径资源(图片)
                contextIsolation: true, // 上下文隔离（主进程和渲染进程隔离）防止原型污染
                enableRemoteModule: true, // 允许渲染进程中使用远程（remote）模块访问窗口方法
                preload: path.join(__dirname, '../preload/index.js') // 预加载脚本
            }
        }

        const cWin = new BrowserWindow(_options)

        // 缓存窗口对象
        curWin.set(cWin)

        // 开启调试.
        IsDev && cWin.webContents.openDevTools()

        // 打开路由
        cWin.loadURL(url)

        // 监听渲染进程ready
        cWin.once('ready-to-show', () => {
            // 显示窗口
            cWin.show()
            // 输出
            resolve(Response.succ())
        })

        //监听窗口关闭
        cWin.on('closed', () => {
            // 修改缓存窗口
            curWin.set(parent)
            // 向父窗口传递消息
            // parent.webContents.send('msg_' + wid, { msg: 'closed' } as IWinMessage)
        })

        // 监听窗口消息
        // wid:窗口唯一id、标识符,wid作为url的query参数传入到窗口页面
        // 窗口页面发消息时携带wid
        ipcMain.on('message', async (event: Electron.IpcMainEvent, content: IWinMessage) => {
            // 向父窗口传递消息
            parent.webContents.send('msg_' + wid, content)
            // 子窗口输出
            event.reply('message', Response.succ())
        })
    })
}