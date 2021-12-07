/*
 * @Description: SQLite查询封装（中间件）
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-26 17:53:39
 * @LastEditTime: 2021-12-07 20:02:32
 */

/**
 * SQLite语句中 带特殊符号的字符串要加单引号
 */

import SQLiteDB from "./SQLiteDB"
import { Log } from './Logger' //日志
import { v1 as uuidv1 } from 'uuid'
import { IPool, dataPool, cachePool } from "./DBPool"

interface IWhereItem {
    [key: string]: any
}

interface IWhere extends IWhereItem {
    _OR?: IWhereItem
    _AND?: IWhereItem
}

interface IListParams {
    filter?: string
    sort?: string
    page?: number
    limit?: number
    fuzzy?: boolean //模糊查询
}

export default class SQLAgent {

    /**
     * 返回字段过滤
     */
    static fieldFilter(filter: string, schema: object) {
        const filterKeys = filter.split(' ')
        const removeKeys: string[] = []
        const getOutKeys: string[] = []
        filterKeys.forEach((item) => {
            if (item[0] === '-') {
                removeKeys.push(item.slice(1))
            } else {
                getOutKeys.push(item)
            }
        })
        return (
            Object.keys(schema)
                .filter((k) => {
                    return getOutKeys.length > 0
                        ? getOutKeys.includes(k)
                        : !removeKeys.includes(k)
                })
                .join(',') || '*'
        )
    }

    /**
     * 多条件查询条件对象转义
     * @param where  String/Object
     * 注：where为Object类型时仅支持单个AND子句或OR子句，不支持混合子句，支持相等`=`条件和模糊查询`LIKE`
     * 注：where为Object类型时,若where某个字段为数组，则该字段数组中的值为OR子句，与其他字段用AND连接
     * fuzzy=true时为模糊查询
     */
    static obj2whereStr(where: IWhere | string, fuzzy = false): string {
        //字符串直接返回
        if (typeof where === 'string') {
            return where
        }
        //对象类型
        const whereStrArr = []
        let joinStr = ' AND '
        const operatChar = fuzzy ? ' LIKE ' : ' = ' //运算符
        if (where.hasOwnProperty('_OR')) {
            Object.keys(where._OR!).forEach((key) => {
                if (where._OR![key].trim() !== "") {
                    const val = fuzzy ? `%${where._OR![key]}%` : where._OR![key]
                    whereStrArr.push(`${key}${operatChar}'${val}'`)
                }
            })
            joinStr = ' OR '
        } else {
            const curWhere = where.hasOwnProperty('_AND') ? where._AND : where
            for (const key in curWhere) {
                if (curWhere[key] === null || curWhere[key] === undefined) { continue }
                if (curWhere[key] instanceof Array) {
                    const tempArr = curWhere[key].map(
                        (item: string) => {
                            const val = fuzzy ? `%${item}%` : item
                            return item.trim() !== "" ? `${key}${operatChar}'${val}'` : ''
                        }
                    )
                    const tempStr = tempArr.join(' OR ')
                    whereStrArr.push(tempStr)
                } else {
                    if (curWhere[key].trim() !== "") {
                        const val = fuzzy ? `%${curWhere[key]}%` : curWhere[key]
                        whereStrArr.push(`${key}${operatChar}'${val}'`)
                    }
                }
            }
        }
        return whereStrArr.join(joinStr)
    }

    /**
     * @description: 将对象转换为SET关键字后的插值语句
     * @param {IWhereItem} setObj
     * @return {string}
     * @author: HuiSir
     */
    static obj2SetStr(setObj: IWhereItem): string {
        const keys = Object.keys(setObj)
        let str = ""
        keys.map((key, index) => {
            str += `${key}='${setObj[key]}'${index !== (keys.length - 1) ? ',' : ''}`
        })
        return str
    }

    /**
     * @description: 将order by传值类似与`id age -update_time`形式的字符串转为query串
     * @param {*} orderStr
     * @return {*}
     * @author: HuiSir
     */
    static sort2QueryStr(orderStr: string): string {
        if (!orderStr || orderStr.trim() === '') {
            return ''
        }

        // 随机
        if (orderStr === 'random') {
            return 'ORDER BY random()'
        }

        const orderArr = orderStr.split(' ')
        const orderArr2 = orderArr.map((item) => {
            //升降序，带-号为降序
            let sortMark = 'ASC' //升序
            if (item[0] === '-') {
                item = item.slice(1)
                sortMark = 'DESC'
            }
            return `${item} ${sortMark}`
        })

        return 'ORDER BY ' + orderArr2.join(',')
    }
    getDBConn: () => SQLiteDB

    private pool: IPool
    private tableName: string
    private schema: IWhereItem

    /**
     * 构造方法
     */
    constructor(tableName: string, schema: object, cache: boolean = false) {
        this.tableName = tableName
        this.pool = cache ? cachePool : dataPool
        this.getDBConn = this.pool.getDBConn.bind(this.pool)

        // 添加主键id
        this.schema = {
            id: {
                type: 'VARCHAR(36)',
                notNull: true,
            },
            ...schema,
        }

        //数据表创建
        this.creatTable()
    }

    /**
     * 自定义执行单条语句
     * @param sqlMod  String
     * @returns {Promise<any>}
     */
    run(sqlMod: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const DB = this.getDBConn()
            DB.run(sqlMod, function (err: any) {
                DB.release() // 释放连接
                if (err) {
                    reject(err)
                } else {
                    // this 代表回调函数的上下文
                    resolve(true)
                }
            })
        })
    }

    /**
     * 自定义执行多条语句
     * @param sqlMod  String
     * @returns {Promise<any>}
     */
    exec(sqlMod: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const DB = this.getDBConn()
            DB.run(sqlMod, function (err: any) {
                DB.release()
                if (err) {
                    reject(err)
                } else {
                    // this 代表回调函数的上下文
                    resolve(true)
                }
            })
        })
    }

    /**
     * 创建数据表
     */
    creatTable(): void {
        const { tableName, schema, getDBConn } = this

        // 判断表是否存在
        const tableExistSql = `SELECT count(*) as count FROM sqlite_master WHERE type = 'table' AND name = '${tableName}'`
        const DB = getDBConn()
        DB.get(tableExistSql, function (err: any, { count }: any) {
            if (err) {
                DB.release()
                Log.error(`数据库查询出错：` + err.toString())
            } else {
                //表不存在创建表
                if (count <= 0) {
                    let dbQueryStemp = ''
                    const schemaKeys = Object.keys(schema)
                    schemaKeys.forEach((key, index) => {
                        const item = schema[key]
                        dbQueryStemp += `${key} ${item.type}${key === 'id' ? ' PRIMARY KEY' : ''}${item.notNull ? ' NOT NULL' : ''
                            }${item.default !== undefined
                                ? ` DEFAULT ${item.default}`
                                : ''
                            }${index < schemaKeys.length - 1 ? ',' : ''}`
                    })

                    const querystr = `CREATE TABLE IF NOT EXISTS ${tableName} (${dbQueryStemp});`

                    DB.run(querystr, function (err2: any) {
                        DB.release()
                        if (err2) {
                            Log.error(`创建数据表${tableName}失败：` + err2.toString())
                        } else {
                            Log.info(`数据表 ${tableName} 创建成功`)
                        }
                    })
                } else {
                    DB.release()
                }
            }
        })
    }

    /**
     * 单个数据查询接口
     * @param tableName
     * @param slot Object
     * @returns {Promise<any>}
     */
    findOne(slot: object, filter = ''): Promise<any> {
        const { tableName, schema, getDBConn } = this
        //返回字段过滤
        const resFields = SQLAgent.fieldFilter(filter, schema)
        //条件转义
        const whereStr = SQLAgent.obj2whereStr(slot)
        return new Promise((resolve, reject) => {
            const sqlMod = `SELECT ${resFields} FROM ${tableName} ${whereStr ? 'WHERE ' + whereStr : ''} limit 1;`
            const DB = getDBConn()
            DB.get(sqlMod, function (err: any, row: any) {
                DB.release()
                if (err) {
                    reject(err)
                } else {
                    resolve(row)
                }
            })
        })
    }

    /**
     * 取数据集合
     * @param slot
     * @returns {Promise<any>}
     */
    find(slot: object | string, listParams: IListParams = {}): Promise<any> {
        const { tableName, getDBConn, schema } = this
        const { filter = "", sort = "", page = 1, limit, fuzzy = false } = listParams
        const { fieldFilter, obj2whereStr, sort2QueryStr } = SQLAgent
        //返回字段过滤
        const resFields = fieldFilter(filter, schema)
        //条件转义
        const whereStr = obj2whereStr(slot, fuzzy)
        //升降序，带-号为降序
        const sortQueryStr = sort2QueryStr(sort)
        // 限制
        let limitStr: string
        // 不分页查所有
        if (page === -1) {
            limitStr = limit ? `limit ${limit}` : ""
        } else {
            limitStr = limit ? `limit ${(page - 1) * limit},${limit}` : ""
        }
        return new Promise((resolve, reject) => {
            const sqlMod = `SELECT ${resFields} FROM ${tableName} ${whereStr ? 'WHERE ' + whereStr : ''} ${sortQueryStr} ${limitStr};`
            const DB = getDBConn()
            DB.all(sqlMod, function (err: any, rows: any) {
                DB.release()
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    /**
     * 单数据创建接口
     * @param tableName
     * @param slot Object
     * @param filter String el:'-password -id' 要返回的字段或要排除的字段，-号为排除
     * @returns {Promise<any>}
     */
    create(slot: any, filter = ''): Promise<any> {
        const { tableName, getDBConn, schema } = this
        // uuid
        slot.id = uuidv1()
        // 返回字段过滤
        const resFields = SQLAgent.fieldFilter(filter, schema)
        return new Promise((resolve, reject) => {
            const slotKeys = Object.keys(slot)
            const slotVals = slotKeys.map((key) => slot[key])
            const sqlMod1 = `INSERT INTO ${tableName} (${slotKeys.join(',')}) VALUES ('${slotVals.join('\',\'')}');`
            const sqlMod2 = `SELECT ${resFields} FROM ${tableName} WHERE id = '${slot.id}';`
            const DB = getDBConn()

            // 串行
            DB.serialize(function () {
                DB.run(sqlMod1, function (err: any) {
                    if (err) {
                        reject(err)
                    }
                })

                DB.get(sqlMod2, function (err: any, row: any) {
                    DB.release()
                    if (err) {
                        reject(err)
                    } else {
                        resolve(row)
                    }
                })
            })
        })
    }

    /**
     * @description: 多数据创建
     * @param {Array} slot [Object,Object,...]
     * @return {*}
     * @author: HuiSir
     */
    createMany(slot: any[] = []): Promise<any> {
        if (slot.length === 0) {
            return Promise.reject(new Error('插入数据为空'))
        }

        const { tableName, getDBConn, schema } = this
        const ids: string[] = []

        //插入字段
        const insertKeys = Object.keys(slot[0])
        insertKeys.unshift('id') //插入主键id

        //插入数据转义
        const insertValues = slot.map((item) => {
            item.id = uuidv1() // uuid
            ids.push(item.id)
            const valuesArr = insertKeys.map((k) => item[k])
            return valuesArr.join("','")
        })
        const insertValuesStr = insertValues.join("'),('")
        //条件转义
        const whereStr = SQLAgent.obj2whereStr({ id: ids })
        return new Promise((resolve, reject) => {
            const sqlMod1 = `INSERT INTO ${tableName} (${insertKeys.join(',')}) VALUES ('${insertValuesStr}');`
            const sqlMod2 = `SELECT COUNT(*) as count FROM ${tableName} ${whereStr ? 'WHERE ' + whereStr : ''};`

            const DB = getDBConn()

            // 串行
            DB.serialize(function () {
                DB.run(sqlMod1, function (err: any) {
                    if (err) {
                        reject(err)
                    }
                })

                DB.get(sqlMod2, function (err: any, row: any) {
                    DB.release()
                    if (err) {
                        reject(err)
                    } else {
                        resolve(row)
                    }
                })
            })
        })
    }

    /**
     * 数据修改接口
     * @param whereSlot Object
     * @param updateSlot Object
     * @returns {Promise<any>}
     */
    update(whereSlot: object, updateSlot: object): Promise<any> {
        const { tableName, getDBConn } = this
        //条件转义
        const whereStr = SQLAgent.obj2whereStr(whereSlot)
        const updateStr = SQLAgent.obj2SetStr(updateSlot)
        return new Promise((resolve, reject) => {
            const sqlMod = `UPDATE ${tableName} SET ${updateStr} WHERE ${whereStr}`
            const DB = getDBConn()
            DB.run(sqlMod, function (err: any) {
                DB.release()
                if (err) {
                    reject(err)
                } else {
                    resolve(true)
                }
            })
        })
    }

    /**
     * 数据删除接口
     * @param {object} slot
     * @param {boolean} returnData  可选参数，是否返回删除的数据
     * @param {string} filter  可选参数，返回数据过滤
     * @returns {Promise<any>}
     */
    remove(slot: object, returnData: boolean = false, filter: string = ''): Promise<any> {
        const { tableName, getDBConn, schema } = this
        //条件转义
        const whereStr = SQLAgent.obj2whereStr(slot)
        //返回字段过滤
        const resFields = returnData && SQLAgent.fieldFilter(filter, schema)
        return new Promise((resolve, reject) => {
            const sqlDelMod = `DELETE FROM ${tableName} WHERE ${whereStr};`

            //返回被删数据
            const sqlMod = `SELECT ${resFields} FROM ${tableName} WHERE ${whereStr};`

            const DB = getDBConn()

            if (returnData) {
                // 串行
                DB.get(sqlMod, function (err: any, row: any) {
                    if (err) {
                        reject(err)
                    } else {
                        DB.run(sqlDelMod, function (err2: any) {
                            DB.release()
                            if (err2) {
                                reject(err)
                            } else {
                                resolve(row)
                            }
                        })
                    }
                })
            } else {
                DB.run(sqlDelMod, function (err: any) {
                    DB.release()
                    if (err) {
                        reject(err)
                    } else {
                        resolve(true)
                    }
                })
            }
        })
    }

    /**
     * 批量删除,简单删除，仅限一个字段
     * @param key el: id
     * @param values el: "1,2,3" 
     */
    removeMany(key: string, values: string): Promise<any> {
        const { tableName, getDBConn } = this
        return new Promise((resolve, reject) => {
            values = values.split(",").join("','")
            const sqlMod = `DELETE FROM ${tableName} WHERE ${key} IN ('${values}')`
            const DB = getDBConn()
            DB.run(sqlMod, function (err: any) {
                DB.release()
                if (err) {
                    reject(err)
                } else {
                    resolve(true)
                }
            })
        })
    }

    /**
     * 统计
     * @param slot
     * @returns {Promise<any>}
     */
    count(slot: object | string = ""): Promise<any> {
        const { tableName, getDBConn } = this
        //条件转义
        const whereStr = SQLAgent.obj2whereStr(slot)
        return new Promise((resolve, reject) => {
            const sqlMod = `SELECT COUNT(*) as count FROM ${tableName} ${whereStr ? 'WHERE ' + whereStr : ''}`
            const DB = getDBConn()
            DB.get(sqlMod, function (err: any, row: any) {
                DB.release()
                if (err) {
                    reject(err)
                } else {
                    resolve(row)
                }
            })
        })
    }

    /**
     * @description: 清空表数据
     * @return {Promise<any>}
     * @author: HuiSir
     */
    clearTable(): Promise<any> {
        const { tableName, getDBConn } = this
        return new Promise((resolve, reject) => {
            const sqlMod = `DELETE FROM ${tableName};`
            const DB = getDBConn()
            DB.run(sqlMod, function (err: any) {
                DB.release()
                if (err) {
                    reject(err)
                } else {
                    resolve(true)
                }
            })
        })
    }
}