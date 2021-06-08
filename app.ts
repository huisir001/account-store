/*
 * @Description: 主进程
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-22 23:45:01
 * @LastEditTime: 2021-06-08 18:16:47
 */
import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import path from 'path'
import router from "./sys/router"
import { dataPool, cachePool } from "./sys/tools/DBPool"
import { Print } from './sys/tools/Logger' //日志
import CONST from './sys/config/const'
import request from 'request'
import { obj2Query } from "./sys/tools/utils"

// 环境变量
const IsDev: boolean = process.env.NODE_ENV === "development"

/**
 * 窗口集合
 * 整个软件包含两个窗口，一个为登录窗口，一个为主窗口
 */
const WINS: Set<any> = new Set()


// 创建一个带有预加载脚本的新的浏览器窗口
function createWindow(isLoginWin = false, query?: object, callback?: () => void): BrowserWindow {
    //隐藏菜单栏
    Menu.setApplicationMenu(null)

    let {
        MAIN_WIN_WIDTH: winWidth,
        MAIN_WIN_HEIGHT: winHeight,
        MAIN_WIN_BG_COLOR: winBgColor
    } = CONST

    // 如果当前没有窗口，默认打开的是登录窗口
    if (WINS.size === 0 || isLoginWin) {
        winWidth = CONST.LOGIN_WIN_WIDTH
        winHeight = CONST.LOGIN_WIN_HEIGHT
        winBgColor = CONST.LOGIN_WIN_BG_COLOR
    }

    // 你通过调用 createWindow方法，在 electron app 第一次被初始化时创建了一个新的窗口
    let Win: any = new BrowserWindow({
        show: false, // 默认先隐藏，等待渲染进程完全启动后再显示窗口，可避免窗口闪烁
        fullscreen: false, // 是否全屏
        width: winWidth,
        height: winHeight,
        backgroundColor: winBgColor, // 初始化背景
        resizable: IsDev, // 宽高拖拽
        frame: IsDev, // 边框显示
        transparent: !IsDev, // 窗口透明
        webPreferences: {// web首选项
            // 是否开启Node集成, 并且可以使用像 require 和 process 这样的node APIs 去访问低层系统资源，
            // Electron v5之后的默认为false
            nodeIntegration: false,
            webSecurity: false,  // 关闭窗口跨域,可访问本地绝对路径资源(图片)
            contextIsolation: true, // 上下文隔离（主进程和渲染进程隔离）防止原型污染
            enableRemoteModule: true, // 允许渲染进程中使用远程（remote）模块访问窗口方法
            // 预加载脚本。充当Node.js 和您的网页之间的桥梁。 
            // 它允许将特定的 API 和行为暴露到你的网页上，而不是危险地把整个 Node.js 的 API暴露。
            preload: path.join(__dirname, 'sys/preload/index.js')
        }
    })

    if (IsDev) {
        // 获取端口号
        const Port = process.env.npm_package_scripts_serve!.split(" ").find((_, index, arr) => arr[index - 1] === "--port")

        // 由于vue-cli-service serve和electron命令同时启动，无法判定哪个先启动完成
        // 所以这里写个定时器，不断加载直到加载成功
        let reqFlag = false
        const Timer = setInterval(() => {
            request("http://127.0.0.1:" + Port, function (err: any) {
                if (!err && !reqFlag) {
                    reqFlag = true
                    const sto = setTimeout(() => {
                        Print.info("正在启动窗口，请等待...")
                        clearTimeout(sto)
                    }, 500)
                    // 打开测试页
                    Win.loadURL(`http://127.0.0.1:${Port}${query ? '?' + obj2Query(query) : ''}#${WINS.size === 0 || isLoginWin ? 'login' : 'home'}`)
                    // 开启调试.
                    Win.webContents.openDevTools()
                    clearInterval(Timer)
                }
            })
        }, 500)
    } else {
        // 入口页面
        Win.loadURL(path.join(__dirname, `index.html${query ? '?' + obj2Query(query) : ''}#${WINS.size === 0 || isLoginWin ? 'login' : 'home'}`))
    }

    // 将窗口push到集合中
    WINS.add(Win)

    // 渲染进程ready后再显示窗口
    Win.once('ready-to-show', () => {
        // 这里判断，如果是窗口启动完成，则关闭先前窗口
        WINS.forEach((item) => {
            if (item !== Win) {
                item.close()
            }
        })
        // 显示窗口
        Win.show()

        // 打印日志
        Print.info("窗口启动成功")

        // 启动回调
        callback && callback()
    })

    //从已关闭的窗口Set中移除引用
    Win.on('closed', () => {
        WINS.delete(Win)
        Win = null
    })

    return Win
}

// 监听Electron执行打包完成
app.whenReady().then(async () => {
    if (IsDev) {
        // 安装vue-devtools插件
        // 使用try catch避免阻塞后续脚本执行
        try {
            const installExtension = require('electron-devtools-installer-bycrx')
            const res = await installExtension({
                id: path.basename(CONST.VUE_DEVTOOLS_CDN_LINK).split(".")[0],
                path: CONST.VUE_DEVTOOLS_CDN_LINK,
            })
            if (res) {
                Print.info("插件加载成功：" + res)
            }
        } catch (err) {
            Print.info('Vue Devtools 加载失败：', err.toString())
        }
    }

    // 打开登录窗口
    createWindow(true)

    // 引用程序激活监听器
    app.on('activate', () => {
        // 激活后没有可见窗口（BrowserWindow.getAllWindows()）时，才能创建新的浏览器窗口。
        // 例如，在首次启动应用程序后或重启运行中的应用程序。
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

/**
 * 退出所有窗口时 关闭主进程、关闭数据库连接
 * 由于有两个窗口，所以要保证两个窗口不能同时关闭
 * 所以若登录成功后不能立即关闭登录窗口，需要等待主窗口打开后再关闭
 */
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
router(ipcMain, createWindow)