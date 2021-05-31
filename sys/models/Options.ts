/*
 * @Description: 配置项
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-29 18:21:14
 * @LastEditTime: 2021-05-31 19:06:12
 */
import SQLAgent from '../tools/SQLAgent'
import os from "os"
import path from "path"

//Schema（模式/架构）对象
const OptionsSchema = {
    backup_path: { // 备份路径
        type: 'VARCHAR(255)',
        default: `'${path.join(os.homedir(), "AccountStore")}'`,
        notNull: true,
    },
    auto_backup: {  // 自动备份时机
        type: 'TINYINT', //0启动时，1为结束时
        default: 0, //默认值
        notNull: true,
    },
    create_time: {
        type: 'DATETIME',
        default: '(datetime(\'now\',\'localtime\'))', //默认当前时间
        notNull: true,
    },
}

export default new SQLAgent('options', OptionsSchema)