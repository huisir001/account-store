/*
 * @Description: 首选项设置
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-31 13:39:33
 * @LastEditTime: 2021-05-31 23:36:12
 */
import OptionsModel from '../models/Options'
import { Log } from '../tools/Logger'
import Response from "../tools/Response"
import { operate } from "./operationLog"

interface IOptionsParams {
    id: string
    backup_path?: string
    auto_backup?: number
}

class Options {
    async getOptionsData(): Promise<any> {
        operate("请求首选项设置数据")
        const res = await OptionsModel.find({})
        if (res) {
            return Promise.resolve(Response.succ({ data: res[0] }))
        }
    }

    async saveOptionsData(params: IOptionsParams): Promise<any> {
        operate("保存首选项设置数据")
        const { id, ...rest } = params
        const res = await OptionsModel.update({ id }, { ...rest })
        if (res) {
            return Promise.resolve(Response.succ())
        }
    }

    async initOptions(): Promise<any> {
        const res = await OptionsModel.find({})
        // 若没有数据则创建一条
        if (!res || res.length === 0) {
            const defaultData = await OptionsModel.create({})
            if (defaultData) {
                Log.trace("首选项默认数据初始化成功")
                return Promise.resolve(Response.succ())
            }
        }
    }
}

export default new Options()