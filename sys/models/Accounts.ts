/*
 * @Description:
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-29 17:34:20
 * @LastEditTime: 2021-12-09 11:11:27
 */
import SQLAgent from '../tools/SQLAgent' //配置文件

//Schema（模式/架构）对象
const AccountSchema = {
    name: {
        type: 'VARCHAR(255)', //数据类型（mysql基本数据类型）
        notNull: true, //NOT NULL
    },
    secret: {
        type: 'TEXT',
        notNull: true,
    },
    // account: {
    //     type: 'VARCHAR(255)',
    //     notNull: true,
    // },
    // password: {
    //     type: 'VARCHAR(255)',
    //     notNull: true,
    // },
    // email: {
    //     type: 'VARCHAR(255)',
    // },
    // phone: {
    //     type: 'VARCHAR(128)',
    // },
    remark: {
        type: 'VARCHAR(800)',
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