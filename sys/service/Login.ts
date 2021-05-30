/*
 * @Description: 登陆
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-29 17:20:11
 * @LastEditTime: 2021-05-30 19:55:50
 */

import Response from "../tools/Response"
import LoginModel from '../models/Login'
import AccountModel from '../models/Accounts'
import OptionsModel from '../models/Options'
import TokenModel from '../models/Token'
import { creatToken } from "../tools/Token"
import { formatDate } from '../tools/utils' //工具
import { operate } from "./operationLog"


interface ILoginParams {
    id?: string
    core_password: string
    verify_question: string
    verify_answer: string
}


class Login {

    /**
     * @description: 保存登陆数据(包含重设密码)
     * @param {ILoginParams} params
     * @return {*}
     */
    async saveLoginData(params: ILoginParams): Promise<any> {
        if (params.hasOwnProperty("id")) {
            operate("重设登陆数据")
            const id = params.id
            delete params.id
            const res = await LoginModel.update({ id }, params)
            if (res) {
                return Promise.resolve(Response.succ())
            }
        } else {
            operate("初始化登陆数据")
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
    @operate("查询登陆数据")
    async getLoginData(): Promise<any> {
        const res = await LoginModel.find({}, 'id')
        if (res.length > 0) {
            return Promise.resolve(Response.succ({ data: res[0] }))
        }
    }


    /**
     * @description: 验证登陆数据
     * @param {ILoginParams} params
     * @return {Promise<Response>}
     */
    @operate("验证登陆数据")
    async doLogin(params: ILoginParams): Promise<any> {
        const res = await LoginModel.findOne(params, "id")
        if (res && res.id) {
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
        }
    }

    /**
     * @description: 清空所有数据
     */
    async clearAllTable(): Promise<any> {
        const [res1, res2, res3] =
            await Promise.all([LoginModel.clearTable(), AccountModel.clearTable(), OptionsModel.clearTable()])

        if (res1 && res2 && res3) {
            return Promise.resolve(Response.succ())
        }
    }

    /**
     * @description: 登出
     * @return {Promise<Response>}
     * @author: HuiSir
     */
    @operate("登出")
    async logout(): Promise<any> {
        const res = await TokenModel.clearTable()

        if (res) {
            return Promise.resolve(Response.succ())
        }
    }

    /**
     * @description: 获取token缓存数据
     * @return {Promise<Response>}
     * @author: HuiSir
     */
    async getTokenCache(Token: string): Promise<any> {
        const res = await TokenModel.findOne({ token: Token })
        if (res) {
            return Promise.resolve(Response.succ({ data: res }))
        }
    }

    /**
     * @description: 更新缓存时间
     * @return {Promise<Response>}
     * @author: HuiSir
     */
    async updateCatcheActTime(tokenId: string): Promise<any> {
        const res = await TokenModel.update({ id: tokenId }, {
            act_time: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
        })
        if (res) {
            return Promise.resolve(Response.succ())
        }
    }

}

export default new Login()