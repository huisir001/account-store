/*
 * @Description: 账号表数据增删改查
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-25 11:26:37
 * @LastEditTime: 2021-06-16 00:26:05
 */
import Response from "../tools/Response"
import AccountModel from '../models/Accounts'
import { operate } from "./operationLog"
import Encrypt from "../tools/Encrypt"
import { formatDate } from "../tools/utils"

/**
 * 查询列表返回数据类型
 */
interface IAccountListByPage {
    list: object[]  // 数据集
    page: number  // 当前页码
    limit: number // 每页条数
    total: number // 总条数
    pageTotal: number // 总页数
}

/**
 * 账户列表类
 */
interface IAccunts {
    saveAccount: (params: IAddAccountParams) => Promise<any>
    delAccount: (id: string) => Promise<any>
    getAccountList: (params: IGetListParams) => Promise<Response>
}

class Accounts implements IAccunts {
    // 需要加密的字段
    private needEncryptKeys: string[] = ['account', 'password', 'email', 'phone']

    /**
     * @description: 修改或新增账户数据
     * @param {IAddAccountParams} params
     * @return {*}
     */
    async saveAccount(params: IAddAccountParams): Promise<any> {
        // 加密
        Object.keys(params).forEach((key) => {
            if (this.needEncryptKeys.includes(key)) {
                params[key] = Encrypt.encrypt(params[key])
            }
        })

        // 修改
        if (params.hasOwnProperty("id")) {
            operate(`更新【${params.name}】账户数据`)
            // 这里不需要捕获错误，因为router处统一捕获了
            const id = params.id
            delete params.id
            // 更新时间
            params.update_time = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
            const res = await AccountModel.update({ id }, params)
            if (res) {
                return Promise.resolve(Response.succ({ msg: "保存成功" }))
            }
        } else {
            operate(`新增【${params.name}】账户数据`)
            // 新增账户
            const res = await AccountModel.create(params)
            if (res) {
                return Promise.resolve(Response.succ({ msg: "新增成功", data: res }))
            }
        }
    }

    /**
     * @description: 删除账号
     * @param {string} id
     * @return {*}
     */
    async delAccount(id: string): Promise<any> {
        operate(`删除id为${id}账户数据`)
        const res = await AccountModel.remove({ id })
        if (res) {
            return Promise.resolve(Response.succ({ msg: "删除成功" }))
        }
    }

    /**
     * @description: 查询单个账户
     * @param {string} id
     * @return {*}
     */
    async getAccountById(id: string): Promise<any> {
        const data = await AccountModel.findOne({ id })
        if (data) {
            operate(`查询【${data.name}】账户数据`)
            return Promise.resolve(Response.succ({ data }))
        }
    }

    /**
     * @description: 解密字符串
     * @param {string} val
     * @return {*}
     * @author: HuiSir
     */
    async decryptByVal(val: string): Promise<any> {
        operate(`解密账户数据`)
        return Promise.resolve(Response.succ({ data: Encrypt.decrypt(val) }))
    }

    /**
     * @description: 分页查询列表
     * @param {IGetListParams} params
     * @return {*}
     */
    async getAccountList(params: IGetListParams): Promise<any> {
        // operate("账户列表分页查询")
        const { name = "", page, limit } = params
        const list = await AccountModel.find({ name }, { page, limit, sort: "-create_time", fuzzy: true })
        const { count: total } = await AccountModel.count({ name })
        if (list) {
            const data: IAccountListByPage = {
                list,
                page,
                limit,
                total, // 总条数
                pageTotal: total % limit > 0 ? Math.floor(total / limit) + 1 : total / limit
            }
            return Promise.resolve(Response.succ({ data }))
        }
    }
}

export default new Accounts()