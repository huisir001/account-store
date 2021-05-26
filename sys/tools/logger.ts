/*
 * @Description: 日志处理 log4js
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-26 18:05:31
 * @LastEditTime: 2021-05-26 22:27:10
 */
import log4js from 'log4js'
const isDev = process.argv.includes('--dev')

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
            appenders: isDev ? ['process'] : ['process', 'output', 'errors'], //进程打印到文件，同时打印到终端
            level: LEVELS[3],
        },
        debug: {
            appenders: ['debug'], //开发模式直接打印到终端
            level: LEVELS[0],
        },
    },
    //pm2:true  //使用pm2执行
})

const Log = isDev ? log4js.getLogger('debug') : log4js.getLogger()
const Print = log4js.getLogger('process')

/* Example */
// Log.trace('Log', 'Entering cheese testing')
// Log.debug('Log', 'Got cheese.')
// Print.info('Print', 'Cheese is Gouda.')
// Print.info('Print', 'Cheese is Gouda.')
// Print.info('Print', 'Cheese is Gouda.')
// Log.warn('Log', 'Cheese is quite smelly.')
// Log.error('Log', 'Cheese is too ripe!')
// Log.fatal('Log', 'Cheese was breeding ground for listeria.')

module.exports = {
    Log,
    Print,
}