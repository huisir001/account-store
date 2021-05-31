/*
 * @Description: 账号表数据增删改查
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-25 11:26:37
 * @LastEditTime: 2021-05-31 23:29:09
 */
import Response from "../tools/Response"
import AccountModel from '../models/Accounts'
import { operate } from "./operationLog"
import Encrypt from "../tools/Encrypt"

interface Index {
    [key: string]: any
}

interface IAddAccountParams extends Index {
    id?: string // 若有id 为修改原数据，若无，则为新增
    name?: string // 名称
    account?: string // 登录账号
    password?: string // 登录密码
    email?: string // 绑定邮箱
    phone?: string // 绑定手机
    remark?: string // 备注
}

/**
 * 分页列表入参
 */
interface IGetListParams {
    name?: string // 名称
    page: number // 当前页码
    limit: number // 每页条数
}

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

    /**
     * @description: 修改或新增账户数据
     * @param {IAddAccountParams} params
     * @return {*}
     */
    async saveAccount(params: IAddAccountParams): Promise<any> {
        // 加密
        Object.keys(params).forEach((key) => {
            if (key !== "id" && key !== "name") {
                params[key] = Encrypt.encrypt(params[key])
            }
        })

        // 修改
        if (params.hasOwnProperty("id")) {
            operate("更新账户数据")
            // 这里不需要捕获错误，因为router处统一捕获了
            const id = params.id
            delete params.id
            const res = await AccountModel.update({ id }, params)
            if (res) {
                return Promise.resolve(Response.succ())
            }
        } else {
            operate("新增账户数据")
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
        operate("删除账户数据")
        const res = await AccountModel.remove({ id })
        if (res) {
            return Promise.resolve(Response.succ({ msg: "删除成功" }))
        }
    }

    /**
     * @description: 分页查询列表
     * @param {IGetListParams} params
     * @return {*}
     */
    async getAccountList(params: IGetListParams): Promise<any> {
        operate("账户列表分页查询")
        const { name = "", page, limit } = params
        const list = await AccountModel.find({ name }, { page, limit })
        const { count: total } = await AccountModel.count({ name })
        if (list) {
            const data: IAccountListByPage = {
                list,
                page,
                limit,
                total, // 总条数
                pageTotal: total % limit > 0 ? total / limit : total / limit + 1
            }
            return Promise.resolve(Response.succ({ data }))
        }
    }
}

export default new Accounts()