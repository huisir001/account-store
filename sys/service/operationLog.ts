/*
 * @Description: 操作日志存表
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-30 18:46:12
 * @LastEditTime: 2021-05-30 19:48:50
 */
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
    try {
        const res = await OperateLogModel.create({})
        if (!res) {
            Log.error("保存操作日志错误：", res.toString())
        }
    } catch (err) {

        Log.error("保存操作日志错误：", err.toString())
    }
}

export {
    operate,
    getOperateLogs
}