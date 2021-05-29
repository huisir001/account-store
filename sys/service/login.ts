/*
 * @Description: 登陆
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-29 17:20:11
 * @LastEditTime: 2021-05-29 18:27:19
 */

import Response from "../config/Response"
import LoginModel from '../models/Login'


interface ILoginParams {
    core_password: string
    verify_question: string
    verify_answer: string
}

/**
 * @description: 保存登陆数据
 * @param {IAddAccountParams} params
 * @return {*}
 */
const saveLoginData = async (params: ILoginParams): Promise<any> => {
    const res = await LoginModel.create(params)
    if (res) {
        return Promise.resolve(Response.succ({ data: res }))
    }
}