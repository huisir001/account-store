/*
 * @Description: 常量配置
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-26 09:32:21
 * @LastEditTime: 2021-05-26 22:16:30
 */

export default {
    // 用户登陆过期时间为5分钟（以秒计算）
    // 这里设置这么短是为了确保安全性，防止忘记关闭软件而导致的数据泄露
    LOGIN_TIMEOUT: 60 * 5,

    SKEY: "ABC..123", // 总密码加密私钥
    // 搞个操作日志表，再搞个错误日志
}
