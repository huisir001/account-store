/*
 * @Description: 登陆
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-29 17:20:11
 * @LastEditTime: 2021-05-30 11:21:03
 */

import Response from "../config/Response"
import LoginModel from '../models/Login'
import AccountModel from '../models/Accounts'
import OptionsModel from '../models/Options'


interface ILoginParams {
    id?: string
    core_password: string
    verify_question: string
    verify_answer: string
}

/**
 * @description: 保存登陆数据(包含重设密码)
 * @param {ILoginParams} params
 * @return {*}
 */
const saveLoginData = async (params: ILoginParams): Promise<any> => {
    if (params.hasOwnProperty("id")) {
        const id = params.id
        delete params.id
        const { ok } = await LoginModel.update({ id }, params)
        if (ok === 1) {
            return Promise.resolve(Response.succ())
        }
    } else {
        const res = await LoginModel.create(params)
        if (res) {
            return Promise.resolve(Response.succ({ data: res }))
        }
    }
}

/**
 * @description: 是否存在登陆数据（返回登陆数据id）
 * @return {Promise<Response>}
 */
const getLoginDataId = async (): Promise<Response> => {
    const res = await LoginModel.find({}, 'id')
    if (res.length > 0) {
        return Promise.resolve(Response.succ({ data: res[0] }))
    } else {
        return Promise.resolve(Response.succ({ data: {} }))
    }
}


/**
 * @description: 验证登陆数据
 * @param {ILoginParams} params
 * @return {Promise<Response>}
 */
const verifyLoginData = async (params: ILoginParams): Promise<Response> => {
    const res = await LoginModel.findOne(params, "-core_password -verify_answer")
    if (res && res.verify_question) {
        return Promise.resolve(Response.succ({ data: true }))
    } else {
        return Promise.resolve(Response.succ({ data: false }))
    }
}

/**
 * @description: 清空所有数据
 */
const clearAllTable = async (): Promise<Response> => {
    const [{ ok: ok1 }, { ok: ok2 }, { ok: ok3 }] =
        await Promise.all([LoginModel.clearTable(), AccountModel.clearTable(), OptionsModel.clearTable()])

    if (ok1 === 1 && ok2 === 1 && ok3 === 1) {
        return Promise.resolve(Response.succ({ data: true }))
    } else {
        return Promise.resolve(Response.succ({ data: false }))
    }
}