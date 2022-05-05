/*
 * @Description: 常量配置
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-26 09:32:21
 * @LastEditTime: 2022-05-05 11:11:47
 */

export default {
    // 用户登陆过期时间为5分钟（以毫秒计算）
    // 这里设置这么短是为了确保安全性，防止忘记关闭软件而导致的数据泄露
    LOGIN_TIMEOUT: 60 * 1000 * 5,

    regDir: "AccountStore", // 注册表路径
    regSkeyName: "SKEY", // 加密私钥键名

    // api白名单（允许不带token）
    API_WHITE_LIST: [
        "haskey",
        "addSkey",
        "doLogin",
        "getAccountListRan",
        "checkAccounts",
        "clearAllTable",
        "getLoginData",
        "saveLoginData",
        "resetLoginData",
        "openMainWindow",
        "openChildWindow",
        "openLoginWindow",
        "minimize",
        "maximize",
        "close",
        "relaunch",
        "softWareReset",
        "showErrorBox",
        "showMessageBoxSync",
        "showOpenFileBox",
        "showOpenDirBox",
        "showSaveDialog",
        "openExternal",
        "openFile",
        "doRecover"
    ],

    DB_NAME: "data.db", // 数据库名称
    BD_POOL_MIN_CONN_NUM: 6, // 数据库连接池最小连接数
    BD_POOL_MAX_CONN_NUM: 12, // 数据库连接池最大连接数
    BD_POOL_MAX_WAIT_TIME: 500, // 数据库连接池最大等待时间
    BD_POOL_MAX_USE_TIMES: 8, // 数据库连接池最大使用次数

    MAIN_WIN_BG_COLOR: '#00000000', // 主窗口初始化背景
    MAIN_WIN_WIDTH: 900, // 主窗口宽
    MAIN_WIN_HEIGHT: 560, // 主窗口高

    LOGIN_WIN_BG_COLOR: '#00000000', // 登录窗口初始化背景
    LOGIN_WIN_WIDTH: 380, // 登录窗口宽
    LOGIN_WIN_HEIGHT: 655, // 登录窗口高

    VUE_DEVTOOLS_CDN_LINK: "http://wailian.qn.zuifengyun.com/vue_devtools_20210601.crx"
}
