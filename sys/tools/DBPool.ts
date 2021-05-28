/*
 * @Description: SQLite数据库连接池(自创)
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-27 10:15:21
 * @LastEditTime: 2021-05-29 00:02:14
 */
import SQLiteDB from "./SQLiteDB"
import CONST from "../config/const"
import { Print, Log } from './Logger' //日志
const { DB_NAME, BD_POOL_LEN, BD_POOL_MAX_LEN } = CONST


/**
 * 创建连接池及读取连接
 */
export default class Pool {
    private pool: SQLiteDB[] = []
    private dbName: string

    /**
     * 初始化连接池
     */
    constructor(dbName: string) {
        this.dbName = dbName

        // 连接池中连接数初始化
        for (let n = 0; n < BD_POOL_LEN; n++) {
            this.pool.push(this.createDBConn())
            Print.info(`数据库连接池连接${n + 1}初始化成功`)
        }
    }

    /**
     * 创建数据库连接
     */
    createDBConn(): SQLiteDB {
        return new SQLiteDB(this.dbName, function (err) {
            if (err) {
                Log.error("创建数据库连接失败：", err.toString())
            }
        })
    }

    /**
     * 读取连接
     */
    getDBConn(): SQLiteDB {
        // 取出第一个可用db
        const db: SQLiteDB | undefined = this.pool.find((item) => !item.locked)

        // 是否存在可用db,不存在创建
        if (!db) {
            this.pool.push(this.createDBConn())
            return this.pool[this.pool.length - 1]
        } else {
            db.locked = true  // 加锁

            // 若连接池超过最大连接数,则开启回收机制(将闲置连接关闭出栈,直到连接池保持在最大连接数量)
            let overNum: number = this.pool.length - BD_POOL_MAX_LEN
            if (overNum > 0) {
                this.pool.forEach((item, index) => {
                    if (overNum > 0 && !item.locked) {
                        item.close((err) => {
                            if (err) {
                                Log.error("关闭数据库连接失败：", err.toString())
                            }
                        })
                        this.pool.splice(index, 1)
                        overNum--
                    }
                })
            }

            return db
        }
    }
}

// export default new Pool(DB_NAME)