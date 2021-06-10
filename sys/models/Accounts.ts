/*
 * @Description:
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-29 17:34:20
 * @LastEditTime: 2021-06-10 10:51:29
 */
import SQLAgent from '../tools/SQLAgent' //配置文件

//Schema（模式/架构）对象
const AccountSchema = {
    name: {
        type: 'VARCHAR(255)', //数据类型（mysql基本数据类型）
        notNull: true, //NOT NULL
    },
    account: {
        type: 'VARCHAR(64)',
        notNull: true,
    },
    password: {
        type: 'VARCHAR(128)',
        notNull: true,
    },
    email: {
        type: 'VARCHAR(128)',
    },
    phone: {
        type: 'VARCHAR(24)',
    },
    remark: {
        type: 'VARCHAR(255)',
    },
    update_time: {
        type: 'DATETIME',
        default: "(datetime('now','localtime'))", //默认当前时间
        notNull: true,
    },
    create_time: {
        type: 'DATETIME',
        default: "(datetime('now','localtime'))", //默认当前时间
        notNull: true,
    },
}

export default new SQLAgent('accounts', AccountSchema)