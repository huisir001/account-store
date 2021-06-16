/*
 * @Description: 窗口相关api
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-05 22:06:05
 * @LastEditTime: 2021-06-16 15:52:55
 */
import { remote } from 'electron'

interface IshowOpenFileBoxArgs {
    multi?: boolean // 是否可多选
    filters?: string[] // 可选文件类型后缀
}

interface Iobj extends Object {
    [key: string]: any
}

const winMethods: Iobj = {
    /**
     * 窗口最小化
     */
    minimize: () => remote.getCurrentWindow().minimize(),

    /**
     * 窗口最大化、还原
     */
    maximize(isMaxed = false) {
        const browserWindow = remote.getCurrentWindow()
        if (isMaxed) {
            return browserWindow.unmaximize()
        } else {
            return browserWindow.maximize()
        }
    },

    /**
     * 窗口关闭
     */
    close: () => remote.getCurrentWindow().close(),



    /**
     * @description: 错误提示（普通提示，无按钮回调）
     * @param {IshowMessageBoxArgs} param1
     * @return {*}
     */
    showErrorBox: ({ title = 'error', msg = '' }: IshowMessageBoxArgs): number => {
        return winMethods.showMessageBoxSync({ title, msg, type: 'error' })
    },



    /**
     * @description: 确认框，有按钮回调（阻塞模式）
     * @param {IshowMessageBoxArgs} param1
     * @return {number} 点击按钮index
     */
    showMessageBoxSync({ title = 'message', msg = "", type = 'info', btns = ['ok', 'cancel'] }: IshowMessageBoxArgs): number {
        // showMessageBoxSync方法的第一个参数传当前的窗口对象
        // 可以作为当前窗口的附属模态框，那么模态框弹出时，不允许再操作主窗口
        // 若不传当前窗口对象，那么msgbox会作为新的窗口弹出，那么无法阻止用户操作主窗口

        console.log(remote.getCurrentWindow())

        return remote.dialog.showMessageBoxSync(remote.getCurrentWindow(), {
            type,
            title,
            message: msg,
            buttons: type == 'error' ? ['ok'] : btns
        })
    },



    /**
     * @description: 打开文件对话框
     * @param {IshowOpenFileBoxArgs}
     * @return {Promise<any>}
     */
    showOpenFileBox({ multi = false, filters = ['*'] }: IshowOpenFileBoxArgs): Promise<any> {
        return remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
            properties: multi ? ['openFile', 'multiSelections'] : ['openFile'],
            filters: [
                { name: '可选文件类型', extensions: filters }
            ]
        })
    },



    /**
     * @description: 打开文件夹/目录对话框
     * @param {boolean} multi 允许多选
     * @return {Promise<any>}
     */
    showOpenDirBox({ multi = false }: IshowOpenFileBoxArgs): Promise<any> {
        return remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
            properties: multi ? ['openDirectory', 'multiSelections'] : ['openDirectory']
        })
    },


    /**
     * 打开保存文件对话框
     */
    showSaveDialog(): Promise<any> {
        return remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
            properties: ['createDirectory']
        })
    }
}

export default winMethods