/*
 * @Description: SQLite数据库连接池(自创)
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-27 10:15:21
 * @LastEditTime: 2021-06-06 16:19:58
 */
import SQLiteDB from "./SQLiteDB"
import CONST from "../config/const"
import { Print, Log } from './Logger' //日志
const { BD_POOL_LEN, BD_POOL_MAX_LEN } = CONST

export interface IPool {
    createDBConn(): SQLiteDB
    getDBConn(): SQLiteDB
    closeAll(): void
}

/**
 * 创建连接池及读取连接
 */
class Pool implements IPool {
    private pool: SQLiteDB[] = []
    private dbName: string

    /**
     * 初始化连接池
     */
    constructor(dbName: string) {
        this.dbName = dbName

        if (dbName !== ":memory:") {
            // 连接池中连接数初始化
            for (let n = 0; n < BD_POOL_LEN; n++) {
                this.pool.push(this.createDBConn())
            }
            Print.info(`数据库 [${dbName}] 连接池初始化成功`)
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
        // 缓存数据库直接取出
        if (this.dbName === ":memory:") {
            const memorydb = this.pool[0]
            if (!memorydb) {
                this.pool.push(this.createDBConn())
                return this.pool[0]
            } else {
                return memorydb
            }
        }

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

    /**
     * 关闭所有连接
     */
    closeAll(): void {
       this.pool.forEach((item,index) => {
            item.close((err) => {
                if (err) {
                    Log.error("关闭所有数据库：", err.toString())
                }
            })
			if(index== this.pool.length-1){
				this.pool = []	
			}
        })
    }
}

// 初始化数据库连接池,缓存数据库名为“:memory:”
// 如果使用`./:memory:?cache=shared`打开内存数据库，则允许它们使用共享缓存,可以通过两个或多个数据库连接打开相同的内存数据库
// 如果使用未加修饰的“:memory:”名称来指定内存数据库，数据库连接关闭后，数据库就不再存在。每一个memory连接数据库彼此不同
// 所以这里内存数据库不使用连接池
export const dataPool = new Pool(CONST.DB_NAME)
export const cachePool = new Pool(':memory:')
