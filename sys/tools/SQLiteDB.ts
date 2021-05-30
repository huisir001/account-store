/*
 * @Description: Database扩展方法
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-28 23:54:09
 * @LastEditTime: 2021-05-30 16:48:47
 */
import sqlite from "sqlite3"
import { v1 as uuidv1 } from 'uuid'

export default class SQLiteDB extends sqlite.Database {
    id: string = uuidv1()  // 数据库连接对象id
    locked: boolean = false // 连接使用上锁，释放后解锁
    release(): void {
        this.locked = false
    }
}