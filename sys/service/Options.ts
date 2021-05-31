/*
 * @Description: 首选项设置
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-31 13:39:33
 * @LastEditTime: 2021-05-31 14:13:56
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
    constructor() {
        // 初始化默认数据
        this.initOptions()
    }

    private async initOptions() {
        try {
            const res = await OptionsModel.find({})
            // 若没有数据则创建一条
            if (!res || res.length == 0) {
                let defaultData = await OptionsModel.create({})
                if (defaultData) {
                    Log.trace("首选项默认数据初始化成功")
                }
            }
        } catch (error) {
            Log.error("首选项默认数据初始化出错：" + error.toString())
        }
    }

    @operate("请求首选项设置数据")
    async getOptionsData(): Promise<any> {
        const res = await OptionsModel.find({})
        if (res) {
            return Promise.resolve(Response.succ({ data: res[0] }))
        }
    }

    @operate("保存首选项设置数据")
    async saveOptionsData(params: IOptionsParams): Promise<any> {
        const { id, ...rest } = params
        const res = await OptionsModel.update({ id }, { ...rest })
        if (res) {
            return Promise.resolve(Response.succ())
        }
    }
}

export default new Options()