/*
 * @Description: 窗口对象单例缓存
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-16 15:04:19
 * @LastEditTime: 2021-06-16 15:07:30
 */
import { BrowserWindow } from 'electron'

export default (() => {
    let _mainWindow: BrowserWindow
    return {
        get: () => _mainWindow,
        set: (win: BrowserWindow) => {
            _mainWindow = win
        }
    }
})()
