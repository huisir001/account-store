/*
 * @Description: 登陆
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-29 17:20:11
 * @LastEditTime: 2021-05-30 14:51:35
 */

import Response from "../config/Response"
import LoginModel from '../models/Login'
import AccountModel from '../models/Accounts'
import OptionsModel from '../models/Options'
import TokenModel from '../models/Token'
import { creatToken } from "../tools/Token"


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
const getLoginData = async (): Promise<Response> => {
    const res = await LoginModel.find({}, 'id')
    if (res.length > 0) {
        return Promise.resolve(Response.succ({ data: res[0] }))
    } else {
        return Promise.resolve(Response.fail())
    }
}


/**
 * @description: 验证登陆数据
 * @param {ILoginParams} params
 * @return {Promise<Response>}
 */
const doLogin = async (params: ILoginParams): Promise<any> => {
    const res = await LoginModel.findOne(params, "-core_password -verify_answer")
    if (res && res.verify_question) {
        // 这里做简单的登陆验证(使用用户id+时间戳生成token)
        // 此处需要做登陆缓存（将token存于sqlite缓存数据库中，附加登陆时间）
        // 每次请求携带token,验证有效期是否失效
        // 若失效则删除缓存数据,重新登陆
        // 若未失效，则重置登陆时间
        const token = creatToken(res.id)
        const saveToken = await TokenModel.create({ token })
        if (saveToken) {
            return Promise.resolve(Response.succ({ data: { token } }))
        }
    } else {
        return Promise.resolve(Response.fail('密码或验证问题错误'))
    }
}

/**
 * @description: 清空所有数据
 */
const clearAllTable = async (): Promise<Response> => {
    const [{ ok: ok1 }, { ok: ok2 }, { ok: ok3 }] =
        await Promise.all([LoginModel.clearTable(), AccountModel.clearTable(), OptionsModel.clearTable()])

    if (ok1 === 1 && ok2 === 1 && ok3 === 1) {
        return Promise.resolve(Response.succ())
    } else {
        return Promise.resolve(Response.fail())
    }
}

/**
 * @description: 登出
 * @return {Promise<Response>}
 * @author: HuiSir
 */
const logout = async (): Promise<Response> => {
    const { ok } = await TokenModel.remove({ token })

    if (ok === 1) {
        return Promise.resolve(Response.succ())
    } else {
        return Promise.resolve(Response.fail())
    }
}

export default {
    saveLoginData,
    getLoginData,
    doLogin,
    logout,
    clearAllTable
}