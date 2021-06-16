/*
 * @Description: 窗口对象单例缓存
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-16 15:04:19
 * @LastEditTime: 2021-06-16 21:05:15
 */
import { BrowserWindow } from 'electron'

export default (() => {
    // tslint:disable-next-line:variable-name
    let _mainWindow: BrowserWindow
    return {
        get: () => _mainWindow,
        set: (win: BrowserWindow) => {
            _mainWindow = win
        }
    }
})()
