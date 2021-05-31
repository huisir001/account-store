/*
 * @Description: token缓存
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-30 14:35:38
 * @LastEditTime: 2021-05-31 23:20:30
 */
import SQLAgent from '../tools/SQLAgent'

//Schema（模式/架构）对象
const TokenSchema = {
    token: {
        type: 'VARCHAR(255)',
        notNull: true,
    },
    act_time: {  // 登陆激活时间
        type: 'DATETIME',
        default: "(datetime('now','localtime'))", //默认值
        notNull: true,
    }
}

export default new SQLAgent('token', TokenSchema, true)