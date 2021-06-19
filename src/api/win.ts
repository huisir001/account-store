/*
 * @Description: 窗口api
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-10 17:30:12
 * @LastEditTime: 2021-06-19 17:00:13
 */
import { winTodo, todo, on, postMsg } from "@/utils/sys"

// 窗口最小化
export const minimize = () => winTodo('minimize')

// 关闭窗口
export const close = () => winTodo('close')

// 消息弹框
export const showMessageBoxSync = (params: IshowMessageBoxArgs) => winTodo('showMessageBoxSync', params)

// 选择文件夹
export const showOpenDirBox = () => winTodo('showOpenDirBox', { multi: false })

/**
 * @description: 选择文件对话框
 * @param {string} filters 选择文件的后缀限制
 * @return {*}
 * @author: HuiSir
 */
export const showOpenFileBox = (title: string, filters: string[], defaultPath = ""): any =>
    winTodo('showOpenFileBox', { title, filters, defaultPath })


/**
 * @description: 创建子窗口
 * @param {IOpenChildWinArgs} data 窗口参数
 * @param {function} onchange 接收子窗口消息回调
 * @return {*}
 */
export const openChildWindow = (() => {
    // 闭包封装变量，避免多次执行监听
    let flag = false
    return function (data: IOpenChildWinArgs, onchange?: (content: IWinMessage) => void) {
        flag || onchange && on(data.wid, onchange) // 接收子窗口消息
        flag = true
        todo('openChildWindow', data)
    }
})()

/**
 * 子窗口发消息
 */
export const postChildMsg = (content: IWinMessage) => postMsg(content)

/**
 * 外部打开网页
 */
export const openExternal = (url: string) => winTodo('openExternal', url)

/**
 * 打开文件
 */
export const openFile = (path: string) => winTodo('openFile', path)