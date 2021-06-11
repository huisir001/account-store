/*
 * @Description: 日志列表模块
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-30 18:49:16
 * @LastEditTime: 2021-06-11 22:15:19
 */
import SQLAgent from '../tools/SQLAgent'

//Schema（模式/架构）对象
const OperateLogSchema = {
    log: {
        type: 'VARCHAR(255)',
        notNull: true,
    },
    create_time: {
        type: 'DATETIME',
        default: "(datetime('now','localtime'))", //默认当前时间
        notNull: true,
    },
}

export default new SQLAgent('operate_log', OperateLogSchema)