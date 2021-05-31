/*
 * @Description:
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-29 17:34:20
 * @LastEditTime: 2021-05-31 22:41:15
 */
import SQLAgent from '../tools/SQLAgent' //配置文件

//Schema（模式/架构）对象
const LoginSchema = {
    core_password: { // 核心密码
        type: 'VARCHAR(255)',
        notNull: true,
    },
    verify_question: {  // 验证问题
        type: 'VARCHAR(255)',
        notNull: true,
    },
    verify_answer: { // 验证答案
        type: 'VARCHAR(255)',
        notNull: true,
    },
    create_time: {
        type: 'DATETIME',
        default: "datetime('now','localtime')", //默认当前时间
        notNull: true,
    },
}

export default new SQLAgent('login', LoginSchema)