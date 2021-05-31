/*
 * @Description: 操作日志存表
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-30 18:46:12
 * @LastEditTime: 2021-05-31 12:05:52
 */
import Response from "../tools/Response"
import OperateLogModel from '../models/OperateLog'
import { Log } from '../tools/Logger' //日志

interface IGetOperateLogsParams {
    beginTime?: string // 开始时间
    endTime?: string // 结束时间
    page: number // 当前页码
    limit: number // 每页条数
}

interface IOperateLogsByPage {
    list: object[]  // 数据集
    page: number  // 当前页码
    limit: number // 每页条数
    total: number // 总条数
    pageTotal: number // 总页数
}

interface IdelParam {
    ids: string // 使用逗号分隔字符串
}


/**
 * @description: 保存操作日志(装饰器)
 * @param {*} async
 * @return {*}
 * @author: HuiSir
 */
const operate = (log: string): any => {
    OperateLogModel.create({ log }).catch((err) => {
        Log.error("保存操作日志出错：", err.toString())
    })
}

/**
 * @description: 按页查询操作记录
 * @param {*} async
 * @return {*}
 * @author: HuiSir
 */
const getOperateLogs = async (params: IGetOperateLogsParams): Promise<any> => {
    operate("查询操作记录")
    const { beginTime, endTime, page, limit } = params
    const list = await OperateLogModel.find({ beginTime, endTime }, { page, limit })
    const { count: total } = await OperateLogModel.count({ beginTime, endTime })
    if (list) {
        const data: IOperateLogsByPage = {
            list,
            page,
            limit,
            total, // 总条数
            pageTotal: total % limit > 0 ? total / limit : total / limit + 1 // 总页数
        }
        return Promise.resolve(Response.succ({ data }))
    }
}

/**
 * @description: 批量删除操作记录
 * @param {*} async
 * @return {*}
 * @author: HuiSir
 */
const delOperateLogs = async (param: IdelParam): Promise<any> => {
    operate("批量删除操作记录")
    const res = await OperateLogModel.removeMany("id", param.ids)
    if (res) {
        return Promise.resolve(Response.succ())
    }
}

export {
    operate,
    getOperateLogs,
    delOperateLogs
}