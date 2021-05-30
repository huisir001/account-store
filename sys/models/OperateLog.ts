/*
 * @Description:
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-30 18:49:16
 * @LastEditTime: 2021-05-30 18:58:01
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
        default: 'CURRENT_TIMESTAMP', //默认当前时间
        notNull: true,
    },
}

export default new SQLAgent('operate_log', OperateLogSchema)