/*
 * @Description: 账号表数据增删改查
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-25 11:26:37
 * @LastEditTime: 2021-05-30 11:19:26
 */
import Response from "../config/Response"
import AccountModel from '../models/Accounts'

interface IAddAccountParams {
    id?: string // 若有id 为修改原数据，若无，则为新增
    name?: string // 名称
    account?: string // 登录账号
    password?: string // 登录密码
    email?: string // 绑定邮箱
    phone?: string // 绑定手机
    remark?: string // 备注
}

interface IGetListParams {
    name?: string // 名称
    page: number // 当前页码
    limit: number // 每页条数
}

interface IAccountListByPage {
    list: object[]  // 数据集
    page: number  // 当前页码
    limit: number // 每页条数
    total: number // 总条数
    pageTotal: number // 总页数
}

/**
 * @description: 修改或新增账户数据
 * @param {IAddAccountParams} params
 * @return {*}
 */
const saveAccount = async (params: IAddAccountParams): Promise<any> => {
    // 修改
    if (params.hasOwnProperty("id")) {
        // 这里不需要捕获错误，因为router处统一捕获了
        const id = params.id
        delete params.id
        const { ok } = await AccountModel.update({ id }, params)
        if (ok === 1) {
            return Promise.resolve(Response.succ())
        }
    } else {
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
const delAccount = async (id: string): Promise<any> => {
    const { ok } = await AccountModel.remove({ id })
    if (ok === 1) {
        return Promise.resolve(Response.succ({ msg: "删除成功" }))
    }
}

/**
 * @description: 分页查询列表
 * @param {IGetListParams} params
 * @return {*}
 */
const getAccountListByPage = (params: IGetListParams): Promise<Response> => {
    const { page, limit, name = "" } = params // name 模糊查询，可不传

    return new Promise((resolve, reject) => {


        const resData: IAccountListByPage = {
            list: [],
            page,
            limit,
            total: 1000,
            pageTotal: 1000
        }

        resolve(Response.succ({ data: resData }))
    })
}

export {
    saveAccount,
    delAccount,
    getAccountListByPage
}
