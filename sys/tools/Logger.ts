/*
 * @Description: 日志处理 log4js
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-26 18:05:31
 * @LastEditTime: 2021-05-31 17:03:20
 */
import log4js from 'log4js'
const IsDev = process.env.NODE_ENV === "development"

//日志等级列表，顺序越后等级越高
//等级大小写均可，all是输出全部，off是不输出
const LEVELS = [
    'ALL',
    'TRACE',
    'DEBUG',
    'INFO',
    'WARN',
    'ERROR',
    'FATAL',
    'OFF',
]

//配置
log4js.configure({
    //自定义日志类型配置
    appenders: {
        //需要单独打印到控制台的内容（进程内容）
        process: {
            type: 'console',
            category: 'process',
        },
        //开发模式，打印所有日志
        debug: {
            type: 'console', //打印到控制台
            category: 'debug',
        },
        //默认输出
        output: {
            type: 'file',
            filename: 'logs/output.log',
            maxLogSize: 10485760, //10M
            backups: 3, //保留3个文件
        },
        //错误信息
        errors: {
            type: 'logLevelFilter', //单独配置等级，不受categories中配置的干扰
            level: LEVELS[5],
            appender: 'errorFile',
        },
        errorFile: {
            type: 'file',
            filename: 'logs/errors.log',
            maxLogSize: 10485760, //10M
            backups: 3,
        },
    },
    //自定义类型分组
    categories: {
        default: {
            appenders: ['output', 'errors'],
            level: LEVELS[3],
        },
        process: {
            appenders: IsDev ? ['process'] : ['process', 'output', 'errors'], //进程打印到文件，同时打印到终端
            level: LEVELS[3],
        },
        debug: {
            appenders: ['debug'], //开发模式直接打印到终端
            level: LEVELS[0],
        },
    }
})

const Log = IsDev ? log4js.getLogger('debug') : log4js.getLogger()
const Print = log4js.getLogger('process')

/* Example */
// Log.trace('追踪级别')
// Log.debug('调试级别')
// Print.info('信息级别')
// Log.warn('警告级别')
// Log.error('错误级别')
// Log.fatal('致命错误级别')

export {
    Log,
    Print,
}