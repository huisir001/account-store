/*
 * @Description: 首选项设置
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-31 13:39:33
 * @LastEditTime: 2021-12-07 19:49:29
 */
import OptionsModel from '../models/Options'
import { Log } from '../tools/Logger'
import Response from "../tools/Response"
import { operate } from "./operationLog"
import Skey from "./Skey"
import { mkdir, readdir, unlink, copyFile } from 'fs/promises'
import path from 'path'
import { formatDate } from '../tools/utils'
import CONST from "../config/const"
const { DB_NAME } = CONST

class Options {
    async getOptionsData(): Promise<any> {
        // operate("请求首选项设置数据")
        const res = await OptionsModel.find({})
        if (res) {
            return Promise.resolve(Response.succ({ data: res[0] }))
        }
    }

    async saveOptionsData(params: IOptionsParams): Promise<any> {
        operate("设置选项保存")
        const { id, ...rest } = params
        const res = await OptionsModel.update({ id }, { ...rest })
        if (res) {
            return Promise.resolve(Response.succ())
        }
    }

    // 初始化首选项默认数据
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

    // 执行备份(若设置为自动备份，则在主进程退出前会执行此备份方法)
    async doBackup(): Promise<any> {
        operate("执行数据备份")
        // 请求首选项设置数据
        const res = await this.getOptionsData()
        // 查询已有备份文件数量，超量删除最前文件
        try {
            const backupfiles = await readdir(res.data.backup_path)
            // 删除超量文件
            if (backupfiles.length >= res.data.backup_file_num) {
                // 找到最旧的文件
                const earliestFile = backupfiles.sort((a, b) => parseInt(a, 10) - parseInt(b, 10))[0]
                await unlink(path.join(res.data.backup_path, earliestFile))
                Log.trace("删除超量备份文件：" + earliestFile)
            }
        } catch ({ errno }) {
            if (errno === -4058) {
                // 路径不存在时创建备份目录
                await mkdir(res.data.backup_path)
                Log.trace("备份目录创建成功")
            }
        }
        // 组装备份路径
        const copytopath = path.join(res.data.backup_path, formatDate(Date.now(), 'yyyyMMddhhmmss') + '.db.bak')
        // 拷贝
        await copyFile(DB_NAME, copytopath)
        return Promise.resolve(Response.succ())
    }

    /**
     * @description: 数据恢复
     * @param {string} filePath
     * @return {*}
     * @author: HuiSir
     */
    async doRecover({ filePath, skey }: { filePath: string, skey: string }): Promise<any> {
        operate("执行数据恢复")
        // 更新私钥
        Skey.updateSkey(skey)
        // 拷贝
        await copyFile(filePath, DB_NAME)
        return Promise.resolve(Response.succ())
    }
}

export default new Options()