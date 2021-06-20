/*
 * @Description: 窗口操作
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-16 15:50:07
 * @LastEditTime: 2021-06-20 17:15:43
 */
import path from 'path'
import { dialog, shell } from 'electron'
import curWin from '../tools/curWin'

interface IshowOpenFileBoxArgs {
    title?: string // 对话框标题
    multi?: boolean // 是否可多选
    filters?: string[] // 可选文件类型后缀
    defaultPath?: string //默认打开的文件夹路径
}

interface Iobj extends Object {
    [key: string]: any
}

const winMethods: Iobj = {
    /**
     * 窗口最小化
     */
    minimize: () => curWin.get().minimize(),

    /**
     * 窗口最大化、还原
     */
    maximize(isMaxed = false) {
        if (isMaxed) {
            return curWin.get().unmaximize()
        } else {
            return curWin.get().maximize()
        }
    },

    /**
     * 窗口关闭
     */
    close: () => curWin.get().close(),



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
    showMessageBoxSync(
        { title = 'message', msg = "", type = 'info', btns = ['ok', 'cancel'] }: IshowMessageBoxArgs
    ): number {
        // showMessageBoxSync方法的第一个参数传当前的窗口对象
        // 可以作为当前窗口的附属模态框，那么模态框弹出时，不允许再操作主窗口
        // 若不传当前窗口对象，那么msgbox会作为新的窗口弹出，那么无法阻止用户操作主窗口
        return dialog.showMessageBoxSync(curWin.get(), {
            type,
            title,
            message: msg,
            buttons: type === 'error' ? ['ok'] : btns
        })
    },



    /**
     * @description: 打开文件对话框
     * @param {IshowOpenFileBoxArgs}
     * @return {Promise<any>}
     */
    showOpenFileBox({
        title = "选择文件",
        multi = false,
        filters = ['*'],
        defaultPath = "" }: IshowOpenFileBoxArgs): Promise<any> {
        return dialog.showOpenDialog(curWin.get(), {
            title,
            properties: multi ? ['openFile', 'multiSelections'] : ['openFile'],
            defaultPath,
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
        return dialog.showOpenDialog(curWin.get(), {
            properties: multi ? ['openDirectory', 'multiSelections'] : ['openDirectory']
        })
    },


    /**
     * 打开保存文件对话框
     */
    showSaveDialog(): Promise<any> {
        return dialog.showSaveDialog(curWin.get(), {
            properties: ['createDirectory']
        })
    },


    /**
     * 使用浏览器打开网页
     */
    openExternal(url: string): void {
        shell.openExternal(url)
    },


    /**
     * 打开文件
     */
    openFile(file: string): void {
        const basePath = path.resolve(__dirname, "../../")
        shell.openPath(path.join(basePath, file))
    }
}

export default winMethods
