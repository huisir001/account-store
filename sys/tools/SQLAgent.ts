/*
 * @Description: SQLite查询封装（中间件）
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-26 17:53:39
 * @LastEditTime: 2021-05-26 22:42:05
 */
import { Log } from './Logger' //日志
import { v1 as uuidv1 } from 'uuid'
class SQLAgent {
    /**
     * 构造方法
     */
    constructor(pool, tableName, schema) {
        this.tableName = tableName
        this.pool = pool

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
     * 返回字段过滤
     */
    static fieldFilter(filter, schema) {
        let filterKeys = filter.split(' '),
            removeKeys = [],
            getOutKeys = []
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
     * 注：where为Object类型时仅支持单个AND子句或OR子句，不支持混合子句，且仅支持相等`=`条件
     * 注：where为Object类型时,若where某个字段为数组，则该字段数组中的值为OR子句，与其他字段用AND连接
     */
    static obj2whereStr(where) {
        //字符串直接返回
        if (typeof where === 'string') {
            return where
        }
        //对象类型
        let whereStrArr = [],
            joinStr = ' AND '
        if (where.hasOwnProperty('_OR')) {
            for (let key in where._OR) {
                whereStrArr.push(`${key} = '${where._OR[key]}'`)
            }
            joinStr = ' OR '
        } else {
            const curWhere = where.hasOwnProperty('_AND') ? where._AND : where
            for (let key in curWhere) {
                if (curWhere[key] instanceof Array) {
                    let tempArr = curWhere[key].map(
                        (item) => `${key} = '${item}'`
                    )
                    let tempStr = tempArr.join(' OR ')
                    whereStrArr.push(tempStr)
                } else {
                    whereStrArr.push(`${key} = '${curWhere[key]}'`)
                }
            }
        }
        return whereStrArr.join(joinStr)
    }

    /**
     * @description: 将order by传值类似与`id age -update_time`形式的字符串转为query串
     * @param {*} orderStr
     * @return {*}
     * @author: HuiSir
     */
    static sort2QueryStr(orderStr) {
        if (!orderStr || orderStr.trim() === '') {
            return ''
        }

        let orderArr = orderStr.split(' ')
        const orderArr2 = orderArr.map((item) => {
            //升降序，带-号为降序
            let sortMark = 'ASC' //升序
            if (item[0] === '-') {
                item = item.slice(1)
                sortMark = 'DESC'
            }
            return `${item} ${sortMark}`
        })

        return ' ORDER BY ' + orderArr2.join(',')
    }

    /**
     * 自定义查询
     * @param sql  String
     * @returns {Promise<any>}
     */
    doQuery(sqlMod) {
        return new Promise((resolve, reject) => {
            this.pool.query(sqlMod, (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            })
        })
    }

    /**
     * 创建数据表
     * @param tableName
     * @param model
     * @returns {Promise<any>}
     */
    creatTable() {
        const { pool, tableName, schema } = this

        //判断表是否存在
        pool.query(`SHOW TABLES LIKE '${tableName}'`, (error, result) => {
            if (error) {
                Log.error(error)
            } else {
                if (result.length === 0) {
                    //表不存在创建表
                    let dbQueryStemp = ''
                    Object.keys(schema).forEach((key) => {
                        const item = schema[key]
                        dbQueryStemp += `${key} ${item.type}${item.notNull ? ' NOT NULL' : ''
                            }${item.default !== undefined
                                ? ' DEFAULT ' + item.default
                                : ''
                            },`
                    })
                    let querystr = `CREATE TABLE IF NOT EXISTS ${tableName}(${dbQueryStemp} PRIMARY KEY (id))ENGINE=InnoDB DEFAULT CHARSET=utf8;`
                    pool.query(querystr, (err) => {
                        if (err) {
                            Log.error(err)
                        } else {
                            Log.info(`数据表 ${tableName} 创建成功`)
                        }
                    })
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
    findOne(slot, filter = '') {
        const { tableName, pool, schema } = this
        //返回字段过滤
        const resFields = DB.fieldFilter(filter, schema)
        //条件转义
        const whereStr = DB.obj2whereStr(slot)
        return new Promise((resolve, reject) => {
            const sqlMod = `SELECT ${resFields} FROM ${tableName} ${whereStr ? 'WHERE ' + whereStr : ''
                }`
            pool.query(sqlMod, (error, results) => {
                if (error) {
                    reject(error)
                } else {
                    if (results) {
                        resolve(results.pop()) //返回最后一条
                    } else {
                        resolve(results)
                    }
                }
            })
        })
    }

    /**
     * 取数据集合
     * @param slot
     * @returns {Promise<any>}
     */
    find(slot, filter = '', sort = '') {
        const { tableName, pool, schema } = this
        const { fieldFilter, obj2whereStr, sort2QueryStr } = DB
        //返回字段过滤
        const resFields = fieldFilter(filter, schema)
        //条件转义
        const whereStr = obj2whereStr(slot)
        //升降序，带-号为降序
        const sortQueryStr = sort2QueryStr(sort)
        return new Promise((resolve, reject) => {
            const sqlMod = `SELECT ${resFields} FROM ${tableName} ${whereStr ? 'WHERE ' + whereStr : ''
                }${sortQueryStr}`
            pool.query(sqlMod, (error, results) => {
                if (error) {
                    reject(error)
                } else resolve(results)
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
    create(slot, filter = '') {
        const { tableName, pool, schema } = this
        // uuid
        slot.id = uuidv1()
        // 返回字段过滤
        const resFields = DB.fieldFilter(filter, schema)
        return new Promise((resolve, reject) => {
            const sqlMod = `INSERT INTO ${tableName} SET ?;SELECT ${resFields} FROM ${tableName} WHERE id = '${slot.id}';`
            pool.query(sqlMod, slot, (error, results) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(results[1][0])
                }
            })
        })
    }

    /**
     * @description: 多数据创建
     * @param {Array} slot [Object,Object,...]
     * @param {String} filter el:'-password -id' 要返回的字段或要排除的字段，-号为排除
     * @return {*}
     * @author: HuiSir
     */
    createMany(slot = [], filter = '') {
        //验证slot
        if (!slot instanceof Array) {
            return Promise.reject(new Error('请传参Array对象')) //返回带有拒绝原因的promise对象
        }

        if (slot.length === 0) {
            return Promise.reject(new Error('插入数据为空')) //返回带有拒绝原因的promise对象
        }

        const { tableName, pool, schema } = this
        let ids = []

        //插入字段
        let insertKeys = Object.keys(slot[0])
        insertKeys.unshift('id') //插入主键id
        //插入数据转义
        let insertValues = slot.map((item) => {
            item.id = uuidv1() // uuid
            ids.push(item.id)
            let valuesArr = insertKeys.map((k) => item[k])
            return valuesArr.join("','")
        })
        const insertValuesStr = insertValues.join("'),('")
        //返回字段过滤
        const resFields = DB.fieldFilter(filter, schema)
        //条件转义
        const whereStr = DB.obj2whereStr({ id: ids })
        return new Promise((resolve, reject) => {
            const sqlMod = `INSERT INTO ${tableName} (${insertKeys.join(
                ','
            )}) VALUES ('${insertValuesStr}');SELECT ${resFields} FROM ${tableName} ${whereStr ? 'WHERE ' + whereStr : ''
                }`
            pool.query(sqlMod, (error, results) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(results[1])
                }
            })
        })
    }

    /**
     * 数据修改接口
     * @param tableName
     * @param whereSlot Object
     * @param updateSlot Object
     * @returns {Promise<any>}
     */
    update(whereSlot, updateSlot) {
        const { tableName, pool } = this
        //条件转义
        const whereStr = DB.obj2whereStr(whereSlot)
        return new Promise((resolve, reject) => {
            const sqlMod = `UPDATE ${tableName} SET ? WHERE ${whereStr}`
            pool.query(sqlMod, updateSlot, (error, result) => {
                if (error) reject(error)
                else resolve(result)
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
    remove(slot, returnData = false, filter = '') {
        const { tableName, pool, schema } = this
        //条件转义
        const whereStr = DB.obj2whereStr(slot)
        //返回字段过滤
        const resFields = returnData && DB.fieldFilter(filter, schema)
        return new Promise((resolve, reject) => {
            let sqlDelMod = `DELETE FROM ${tableName} ${whereStr ? 'WHERE ' + whereStr : ''
                };`

            //是否返回被删数据
            const sqlMod = returnData
                ? `SELECT ${resFields} FROM ${tableName} ${whereStr ? 'WHERE ' + whereStr : ''
                };${sqlDelMod}`
                : sqlDelMod

            pool.query(sqlMod, (error, result) => {
                if (error) reject(error)
                else returnData ? resolve(result[0]) : resolve(result)
            })
        })
    }

    /**
     * 统计
     * @param slot
     * @returns {Promise<any>}
     */
    count(slot = {}) {
        const { tableName, pool } = this
        //条件转义
        const whereStr = DB.obj2whereStr(slot)
        return new Promise((resolve, reject) => {
            const sqlMod = `SELECT COUNT(*) as count FROM ${tableName} ${whereStr ? 'WHERE ' + whereStr : ''
                }`
            pool.query(sqlMod, (error, result) => {
                if (error) reject(error)
                else resolve(result.pop())
            })
        })
    }
}

export default SQLAgent