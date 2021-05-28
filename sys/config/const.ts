/*
 * @Description: 常量配置
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-26 09:32:21
 * @LastEditTime: 2021-05-28 09:32:06
 */

export default {
    // 用户登陆过期时间为5分钟（以秒计算）
    // 这里设置这么短是为了确保安全性，防止忘记关闭软件而导致的数据泄露
    LOGIN_TIMEOUT: 60 * 5,

    SKEY: "ABC..123", // 总密码加密私钥

    API_BLACK_LIST: [],   // api黑名单

    DB_NAME: "data.db", // 数据库名称
    BD_POOL_LEN: 6, // 数据库连接池默认初始化容量
    BD_POOL_MAX_LEN: 8, // 数据库连接池最大连接数

    // 搞个操作日志表，再搞个错误日志
}
