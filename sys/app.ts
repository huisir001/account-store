/*
 * @Description: 主进程
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-22 23:45:01
 * @LastEditTime: 2021-05-31 18:43:05
 */
import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import path from 'path'
import router from "./router"
import { dataPool, cachePool } from "./tools/DBPool"
import { Print } from './tools/Logger' //日志
import CONST from './config/const'
import request from 'request'
import installExtension from 'electron-devtools-installer-bycrx'

// 环境变量
const IsDev = process.env.NODE_ENV === "development"

// 创建一个带有预加载脚本的新的浏览器窗口
function createWindow() {
    //隐藏菜单栏
    Menu.setApplicationMenu(null)

    // 你通过调用 createWindow方法，在 electron app 第一次被初始化时创建了一个新的窗口
    const Win = new BrowserWindow({
        backgroundColor: CONST.BG_COLOR, // 初始化背景
        fullscreen: false, // 是否全屏
        width: CONST.WIN_WIDTH,
        height: CONST.WIN_HEIGHT,
        resizable: IsDev, // 宽高拖拽
        frame: IsDev, // 边框显示
        webPreferences: {// web首选项
            // 是否开启Node集成, 并且可以使用像 require 和 process 这样的node APIs 去访问低层系统资源，
            // Electron v5之后的默认为false
            nodeIntegration: false,

            webSecurity: false,  // 关闭窗口跨域,可访问本地绝对路径资源(图片)
            contextIsolation: true, // 上下文隔离（主进程和渲染进程隔离）防止原型污染
            enableRemoteModule: false, // 关闭渲染进程中使用远程（remote）模块访问主进程方法，若要使用只能使用ipc模块发送消息事件
            // 预加载脚本。充当Node.js 和您的网页之间的桥梁。 
            // 它允许将特定的 API 和行为暴露到你的网页上，而不是危险地把整个 Node.js 的 API暴露。
            preload: path.join(__dirname, 'sys/preload/index.js')
        }
    })

    if (IsDev) {
        // 获取端口号
        const Port = process.env.npm_package_scripts_serve!.split(" ").find((_, index, arr) => arr[index - 1] === "--port")

        // 打开测试页
        Win.loadURL("http://127.0.0.1:" + Port)

        // 由于vue-cli-service serve和electron命令同时启动，无法判定哪个先启动完成
        // 所以这里写个定时器，不断加载直到加载成功
        const Timer = setInterval(() => {
            request("http://127.0.0.1:" + Port, function (err: any) {
                if (!err) {
                    // 刷新页面
                    Win.reload()
                    // 开启调试.
                    Win.webContents.openDevTools()
                    clearInterval(Timer)
                }
            })
        }, 500)
    } else {
        // 入口页面
        Win.loadFile('./index.html')
    }
}

// 监听Electron执行打包完成
app.whenReady().then(async () => {
    if (IsDev) {
        // 安装vue-devtools插件
        // 使用try catch避免阻塞后续脚本执行
        try {
            const res = await installExtension({
                id: path.basename(CONST.VUE_DEVTOOLS_CDN_LINK).split(".")[0],
                path: CONST.VUE_DEVTOOLS_CDN_LINK,
            })
            if (res) {
                Print.info("success load : " + res)
            }
        } catch (err) {
            Print.info('Vue Devtools failed to install : ', err.toString())
        }
    }

    // 打开窗口
    createWindow()

    // 引用程序激活监听器
    app.on('activate', () => {
        // 激活后没有可见窗口（BrowserWindow.getAllWindows()）时，才能创建新的浏览器窗口。
        // 例如，在首次启动应用程序后或重启运行中的应用程序。
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

// 退出所有窗口时 关闭主进程、关闭数据库连接
app.on('window-all-closed', () => {
    // 当应用程序不再有任何打开窗口时试图退出
    if (process.platform !== 'darwin') {
        // 关闭数据库连接
        dataPool.closeAll()
        cachePool.closeAll()
        // 关闭主进程
        app.quit()
    }
})

// 系统操作分发
router(ipcMain)