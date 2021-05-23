/*
 * @Description: 主进程
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-22 23:45:01
 * @LastEditTime: 2021-05-23 19:17:34
 */
const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

// 环境变量
const IsDev = process.env.NODE_ENV == "development"

// 创建一个带有预加载脚本的新的浏览器窗口
function createWindow () {
    //隐藏菜单栏
    Menu.setApplicationMenu(null)

    // 你通过调用 createWindow方法，在 electron app 第一次被初始化时创建了一个新的窗口
    const Win = new BrowserWindow({
        backgroundColor: '#386efa',// 初始化背景
        fullscreen: false,// 是否全屏
        width: 800,
        height: 600,
        resizable: IsDev, // 宽高拖拽
        frame: IsDev, // 边框显示
        webPreferences: {// web首选项
            // nodeIntegration: true,// 具有Node集成, 并且可以使用像 require 和 process 这样的node APIs 去访问低层系统资源，不推荐
            webSecurity: false,  //关闭窗口跨域,可访问本地绝对路径资源(图片)
            preload: path.join(__dirname, 'app.preload.js') // 预加载脚本。充当Node.js 和您的网页之间的桥梁。 它允许将特定的 API 和行为暴露到你的网页上，而不是危险地把整个 Node.js 的 API暴露。
        }
    })

    if (IsDev) {
        // 获取端口号
        const request = require('request')
        const Port = process.env.npm_package_scripts_serve.split(" ").find((item, index, arr) => arr[index - 1] == "--port")

        // 打开测试页
        Win.loadURL("http://127.0.0.1:" + Port)

        // 由于vue-cli-service serve和electron命令同时启动，无法判定哪个先启动完成
        // 所以这里写个定时器，不断加载直到加载成功
        const Timer = setInterval(() => {
            request("http://127.0.0.1:" + Port, function (err) {
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
            const installExtension = require('electron-devtools-installer-bycrx')
            const res = await installExtension({
                id: "vue-devtools-6.0.0-beta.11.mod-by-huisir",
                path: "http://wailian.qn.zuifengyun.com/vue-devtools-6.0.0-beta.11.mod-by-huisir.crx",
            })
            if (res) {
                console.log("success load : " + res)
            }
        } catch (err) {
            console.error('Vue Devtools failed to install : ', err.toString())
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

// 退出所有窗口时 关闭主进程
app.on('window-all-closed', () => {
    // 当应用程序不再有任何打开窗口时试图退出
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
