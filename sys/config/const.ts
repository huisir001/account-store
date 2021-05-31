/*
 * @Description: 常量配置
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-26 09:32:21
 * @LastEditTime: 2021-05-31 11:59:31
 */

export default {
    // 用户登陆过期时间为5分钟（以毫秒计算）
    // 这里设置这么短是为了确保安全性，防止忘记关闭软件而导致的数据泄露
    LOGIN_TIMEOUT: 60 * 1000 * 5,

    SKEY: "ABC..123", // 总密码加密私钥

    API_WHITE_LIST: ["doLogin", "clearAllTable", "getLoginData", "saveLoginData"],   // api白名单（允许不带token）

    DB_NAME: "data.db", // 数据库名称
    BD_POOL_LEN: 6, // 数据库连接池默认初始化容量
    BD_POOL_MAX_LEN: 8, // 数据库连接池最大连接数

    BG_COLOR: '#386efa', // 初始化背景
    WIN_WIDTH: 800, // 窗口宽
    WIN_HEIGHT: 600, // 窗口高

    VUE_DEVTOOLS_CDN_LINK: "http://wailian.qn.zuifengyun.com/vue-devtools-6.0.0-beta.11.mod-by-huisir.crx"

    // 搞个操作日志表
}
