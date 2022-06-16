/*
 * @Description: SQLite数据库连接池(自创)
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-27 10:15:21
 * @LastEditTime: 2022-06-16 23:06:48
 */
import SQLiteDB from "./SQLiteDB"
import CONST from "../config/const"
import { Print, Log } from './Logger' //日志
const {
    DB_NAME,
    BD_POOL_MIN_CONN_NUM,
    BD_POOL_MAX_CONN_NUM,
    BD_POOL_MAX_WAIT_TIME,
    BD_POOL_MAX_USE_TIMES
} = CONST

const PoolOpts = {
    minConnNum: BD_POOL_MIN_CONN_NUM, // 最小连接数
    maxConnNum: BD_POOL_MAX_CONN_NUM, // 最大连接数
    maxWaitTime: BD_POOL_MAX_WAIT_TIME, // 最大等待时间
    maxUseTimes: BD_POOL_MAX_USE_TIMES, // 最大使用次数
}

export interface IPool {
    createDBConn(): Promise<SQLiteDB>
    getDBConn(): Promise<SQLiteDB>
    closeAll(): void
}

interface IPoolOpts {
    minConnNum: number // 最小连接数
    maxConnNum: number // 最大连接数
    maxWaitTime: number // 最大等待时间
    maxUseTimes: number // 最大使用次数
}

/**
 * 创建连接池及读取连接
 */
class Pool implements IPool {
    private pool: SQLiteDB[] = []
    private dbName: string
    private minConnNum: number
    private maxConnNum: number
    private maxWaitTime: number
    private maxUseTimes: number
    /**
     * 初始化连接池
     */
    constructor(dbName: string, poolOpts: IPoolOpts) {
        this.dbName = dbName
        this.minConnNum = poolOpts.minConnNum
        this.maxConnNum = poolOpts.maxConnNum
        this.maxWaitTime = poolOpts.maxWaitTime
        this.maxUseTimes = poolOpts.maxUseTimes

        if (this.dbName !== ":memory:") {
            this.initPool(poolOpts)
        }
    }

    /**
     * 连接池中连接数初始化
     */
    private async initPool(poolOpts: IPoolOpts) {
        while (this.pool.length < poolOpts.minConnNum) {
            this.pool.push(await this.createDBConn())
        }
        Print.info(`数据库 [${this.dbName}] 连接池初始化成功`)
    }

    /**
     * 创建数据库连接
     */
    // tslint:disable-next-line: member-ordering
    async createDBConn() {
        const conn: SQLiteDB = await new Promise((resolve, reject) => {
            const dbconn = new SQLiteDB(this.dbName, function (err) {
                if (err) {
                    Log.error("创建数据库连接失败：", err.toString())
                    // 创建连接池属于程序启动初始化脚本，出错时直接抛出错误，中断程序
                    reject(err)
                } else {
                    resolve(dbconn)
                }
            })
        })
        // 监听是否释放
        // 当客户释放数据库连接时，先判断该连接的引用次数是否超过了规定值
        // 如果超过就从连接池中删除该连接，否则保留为其他客户服务。
        // 删除前判断连接数是否大于最小值
        conn.on('release', () => {
            if (conn.useTimes >= this.maxUseTimes && this.pool.length > this.minConnNum) {
                // tslint:disable-next-line: triple-equals
                this.pool.splice(this.pool.findIndex(({ id }) => id == conn.id), 1)

                conn.close((err) => {
                    if (err) {
                        Log.error(`关闭Redis连接 ${conn.id} 失败：` + err.toString())
                    }
                })
            }
        })

        return conn
    }

    /**
     * 读取连接（每次访问时从这里取连接）
     * 连接池管理策略
     * 1.当客户请求数据库连接时，首先查看连接池中是否有空闲连接，如果存在空闲连接，则将连接分配给客户使用
     * 2.如果没有空闲连接，则查看当前所开的连接数是否已经达到最大连接数，如果没达到就重新创建一个连接给请求的客户
     * 3.如果达到就按设定的最大等待时间进行等待，待到有空闲连接（有连接被释放）在将其分配给客户。
     * 4.如果超出最大等待时间，则抛出异常给客户。
     * 5.当客户释放数据库连接时，先判断该连接的引用次数是否超过了规定值，如果超过就从连接池中删除该连接，否则保留为其他客户服务。
     * 6.当应用程序退出时，关闭连接池中所有的连接，释放连接池相关的资源。
     * ！！！注意：每次执行语句完毕之后都要进行手动释放，否则无法进行管理
     */
    // tslint:disable-next-line: member-ordering
    async getDBConn() {
        // 缓存数据库直接取出
        if (this.dbName === ":memory:") {
            const memorydb = this.pool[0]
            if (!memorydb) {
                this.pool.push(await this.createDBConn())
                return Promise.resolve(this.pool[0])
            } else {
                return Promise.resolve(memorydb)
            }
        }

        // 取出第一个可用db
        const conn: SQLiteDB | undefined = this.pool.find((item) => !item.lockStatus)

        if (conn) {
            // 上锁
            conn.lock()
            return conn
        } else {
            // 若连接池超过最大连接数,则开启回收机制(将闲置连接关闭出栈,直到连接池保持在最大连接数量)
            // 查看当前所开的连接数是否已经达到最大连接数，如果没达到就重新创建一个连接给请求的客户
            if (this.pool.length < this.maxConnNum) {
                // 未达到最大连接数，新建一个连接给用户
                const newConn = await this.createDBConn()
                this.pool.push(newConn)
                // 上锁
                newConn.lock()
                return newConn
            } else {
                // 如果达到最大连接数就按设定的最大等待时间进行等待，待到有空闲连接（有连接被释放）在将其分配给客户。
                // 故而使得此函数转为异步函数
                // 超时报错，提醒用户检查是否有未释放连接
                const newConn = await this.getConnBySleep()
                if (newConn) {
                    // 上锁
                    newConn.lock()
                    return newConn
                } else {
                    return Promise.reject('连接池获取空闲连接出错，请检查是否有未释放连接！')
                }
            }
        }
    }

    /**
     * 关闭所有连接
     */
    closeAll() {
        this.pool.forEach((conn, index) => {
            conn.close((err) => {
                if (err) {
                    Log.error("关闭数据库：", err.toString())
                }
                // tslint:disable-next-line: triple-equals
                if (index == this.pool.length - 1) {
                    this.pool = []
                }
            })
        })
    }

    /**
     * sleep
     * delay:毫秒数
     */
    private sleep(delay: number) {
        return new Promise(resolve => {
            setTimeout(resolve, delay)
        })
    }

    /**
     * 等待-获取空闲连接
     * 递归实现
     * 每次递归等待20毫秒
     */
    private getConnBySleep(): Promise<SQLiteDB | undefined> {
        const _this = this
        const itemWaitMs = 20
        return new Promise((resolve) => {
            let tempMs = 0;
            (async function _getConn() {
                const nowMs = Date.now()
                const timeOut = _this.maxWaitTime - tempMs
                await _this.sleep(timeOut <= itemWaitMs ? timeOut : itemWaitMs)
                const conn: SQLiteDB | undefined = _this.pool.find((item) => !item.lockStatus)
                // 找到
                if (conn) {
                    resolve(conn)
                } else {
                    // 超时
                    if (timeOut <= itemWaitMs) {
                        resolve(conn)
                    } else {
                        tempMs += (Date.now() - nowMs)
                        _getConn()
                    }
                }
            })()
        })
    }
}

// 初始化数据库连接池,缓存数据库名为“:memory:”
// 如果使用`./:memory:?cache=shared`打开内存数据库，则允许它们使用共享缓存,可以通过两个或多个数据库连接打开相同的内存数据库
// 如果使用未加修饰的“:memory:”名称来指定内存数据库，数据库连接关闭后，数据库就不再存在。每一个memory连接数据库彼此不同
// 所以这里内存数据库不使用连接池
export const dataPool = new Pool(DB_NAME, PoolOpts)
export const cachePool = new Pool(':memory:', PoolOpts)

// 使用示例
/* 
    const dbConn = await pool.getDBConn()
    // dbConn 操作。。。
    dbConn.release()  // 释放
*/
