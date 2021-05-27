/*
 * @Description: SQLite数据库连接池(自创)
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-27 10:15:21
 * @LastEditTime: 2021-05-27 17:23:01
 */

import sqlite from "sqlite3"
import CONST from "../config/const"
const { Print, Log } = require('./Logger') //日志

/**
 * 连接池元素类型
 */
interface IPool {
    id: string // 数据库连接对象id
    db: sqlite.Database
    locked: boolean // 连接使用上锁，释放后解锁
}

/**
 * 创建连接池及读取连接
 */
class Pool {
    private pool: IPool[] = []
    private dbName: string

    /**
     * 初始化连接池
     */
    constructor(dbName: string) {
        this.dbName = dbName

        // 连接池中默认初始化6个连接
        for (let n = 1; n < 7; n++) {
            this.createDBConn().then(db => {
                this.pool.push({
                    id: Date.now() + n + '',
                    db,
                    locked: false
                })
                Print.info(`数据库连接池连接${n}初始化成功`)
            }).catch(err => {
                Log.error("连接池初始化连接：", err.toString())
            })
        }
    }

    /**
     * 创建数据库连接
     */
    createDBConn(): Promise<sqlite.Database> {
        return new Promise((resolve, reject) => {
            let db = new sqlite.Database(this.dbName, function (err) {
                if (!err) {
                    resolve(db)
                } else {
                    reject(err)
                }
            })
        })
    }

    /**
     * 读取连接
     */
    async getdb() {
        // 取出第一个可用db
        let PoolItem: IPool | undefined = this.pool.find(item => !item.locked)

        // 是否存在可用db，不存在创建
        if (!PoolItem) {
            let db
            try {
                db = await this.createDBConn()
                this.pool.push({
                    id: Date.now() + Number(Math.random().toFixed(3)) * 1000 + '',
                    locked: true,
                    db
                })
            } catch (error) {
                Log.error("连接池新增连接：", error.toString())
            }
            return db
        } else {
            PoolItem.locked = true  // 加锁
            return PoolItem.db
        }
    }

    /**
     * 释放连接
     */
    release() {

    }

}

export default new Pool(CONST.DB_NAME)