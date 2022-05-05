/*
 * @Description: Database扩展方法
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-28 23:54:09
 * @LastEditTime: 2022-05-05 11:14:59
 */
import sqlite from "sqlite3"
import { v1 as uuidv1 } from 'uuid'

export default class SQLiteDB extends sqlite.Database {
    id: string = uuidv1()  // 数据库连接对象id
    useTimes: number = 0  // 使用次数
    private locked: boolean = false // 使用时上锁，释放后解锁
    // 获取锁值
    // 获取方式：redis.lockStatus
    get lockStatus(): boolean {
        return this.locked
    }

    // 加锁
    lock(): void {
        this.locked = true
        // 每次加锁使用时增加次数
        this.useTimes++
    }

    // 释放（解锁）
    // 注意每次执行语句完毕之后都要手动进行释放
    release(): void {
        this.locked = false
        // 触发release事件便于捕捉
        this.emit('release')
    }
}