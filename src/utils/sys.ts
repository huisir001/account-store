/*
 * @Description: 主线程API调用
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-02 16:03:20
 * @LastEditTime: 2021-06-11 23:02:13
 */
import { ElLoading as Loading } from 'element-plus'
const noLoadings = ["getAccountList", "getOperateLogs"]

/**
 * 底层操作
 */
export const todo = async (something: string, ...parames: any[]): Promise<any> => {

    // loading
    let loading: any
    if (!noLoadings.includes(something)) {
        loading = Loading.service({
            text: 'Loading...',
            background: 'rgba(255, 255, 255, 0.6)',
            target: "#app" // 在app元素内loading，避免遮罩覆盖透明区
        })
    }

    try {

        const res = await window.sys.do(something, ...parames)

        // 关闭loading
        loading && loading.close()

        return Promise.resolve(res)

    } catch (err: any) {

        // 关闭loading
        loading && loading.close()

        // 错误提示
        if (err.ok && err.ok === 401) {

            window.sys.win('showMessageBoxSync', {
                type: 'error',
                title: '错误信息',
                msg: err.msg || err.toString(),
            }).then((_: any) => {
                // 打开登录窗口
                window.sys.do('openLoginWindow')
            })

        } else {

            window.sys.win('showErrorBox', {
                title: '错误信息',
                msg: err.msg || err.toString()
            })

        }
    }
}

/**
 * 窗口操作
 */
export const winTodo = async (something: string, ...parames: any[]): Promise<any> => {
    try {

        const res = await window.sys.win(something, ...parames)
        return Promise.resolve(res)

    } catch (err: any) {

        window.sys.win('showErrorBox', {
            title: '错误信息',
            msg: err.msg || err.toString()
        })

    }
}

/**
 * 窗口通信->发消息
 */
export const postMsg = async (content: IWinMessage): Promise<any> => {
    try {

        const res = await window.sys.postMsg(content)
        return Promise.resolve(res)

    } catch (err: any) {

        window.sys.win('showErrorBox', {
            title: '错误信息',
            msg: err.msg || err.toString()
        })

    }
}

/**
 * 窗口通信->收消息
 */
export const on = async (wid: string, callback: (content: IWinMessage) => void) => {
    window.sys.on(wid, callback)
}