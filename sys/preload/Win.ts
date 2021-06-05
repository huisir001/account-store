/*
 * @Description: 窗口相关api
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-05 22:06:05
 * @LastEditTime: 2021-06-06 00:04:07
 */
import { remote } from 'electron'
export default {
    /**
     * 窗口最小化
     */
    winMinimize() {
        remote.getCurrentWindow().minimize()
    },

    /**
     * 窗口最大化、还原
     */
    winMaximize(isMaxed = false) {
        const browserWindow = remote.getCurrentWindow()
        if (isMaxed) {
            browserWindow.unmaximize()
        } else {
            browserWindow.maximize()
        }
    },

    /**
     * 窗口关闭
     */
    winClose() {
        remote.getCurrentWindow().close()
    }
}