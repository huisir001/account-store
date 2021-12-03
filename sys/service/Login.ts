/*
 * @Description: 登陆
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-29 17:20:11
 * @LastEditTime: 2021-12-03 15:19:57
 */
import Response from "../tools/Response"
import LoginModel from '../models/Login'
import AccountModel from '../models/Accounts'
import OptionsModel from '../models/Options'
import TokenModel from '../models/Token'
import OperateLogModel from '../models/OperateLog'
import { creatToken, decodeToken } from "../tools/Token"
import { formatDate } from '../tools/utils' //工具
import { operate } from "./operationLog"
import Encrypt from "../tools/Encrypt"
import optionsMethods from "./Options"
import Skey from "./Skey"
import { Print, Log } from '../tools/Logger'

/**
 * 登录数据加密
 */
const loginDataEncrypt = (params: ILoginParams | IResetLoginParams): string[] => {
    const keys = Object.keys(params)

    // 加密
    keys.forEach((key) => {
        if (key !== "id" && key !== "verify_question" && params[key]) {
            params[key] = Encrypt.encrypt(params[key])
        }
    })
    return keys
}

class Login {

    /**
     * @description: 保存登陆数据(包含重设密码)
     * @param {ILoginParams} params
     * @return {*}
     */
    async saveLoginData(params: ILoginParams): Promise<any> {
        // 加密
        const keys = loginDataEncrypt(params)

        if (keys.includes("id")) {
            operate("重设登陆数据")
            const id = params.id
            delete params.id
            const res = await LoginModel.update({ id }, params)
            if (res) {
                return Promise.resolve(Response.succ())
            }
        } else {
            operate("初始化登陆数据")
            // 首选项默认数据初始化
            await optionsMethods.initOptions()
            const res = await LoginModel.create(params, 'id verify_question')
            if (res) {
                return Promise.resolve(Response.succ({ data: res }))
            }
        }
    }

    /**
     * @description: 重设登陆数据
     * @param {IResetLoginParams} param1
     * @return {*}
     * @author: HuiSir
     */
    async resetLoginData(params: IResetLoginParams): Promise<any> {


        const { old_password, core_password, verify_question, verify_answer, token } = params
        // 如果有旧密码，则校验旧密码
        if (old_password) {
            const userid = decodeToken(token)
            // 查询
            const res = await LoginModel.findOne({
                id: userid,
                core_password: Encrypt.encrypt(old_password)
            }, "id")

            if (!res || !res.id) {
                return Promise.resolve(Response.fail("旧密码输入错误"))
            }
            const loginParams: ILoginParams = {
                id: userid!,
                core_password,
                verify_question,
                verify_answer
            }
            return this.saveLoginData(loginParams)
        } else {
            // 加密
            loginDataEncrypt(params)

            const { core_password, verify_question, verify_answer } = params

            // 没有旧密码，完全重置，新增一条用户数据
            const res = await LoginModel.create({
                core_password,
                verify_question,
                verify_answer
            })
            if (res) {
                return Promise.resolve(Response.succ())
            }
        }
    }

    /**
     * @description: 是否存在登陆数据（返回登陆数据id）
     * @return {Promise<Response>}
     */
    async getLoginData(): Promise<any> {
        // operate("查询登陆数据")
        // 这里查询用户数据，查询最新一条，因爲重置密碼會產生多條數據
        const res = await LoginModel.find({}, { filter: 'id verify_question', sort: "-create_time" })
        return Promise.resolve(Response.succ({ data: res.length > 0 ? res[0] : {} }))
    }


    /**
     * @description: 验证登陆数据
     * @param {ILoginParams} params
     * @return {Promise<Response>}
     */
    async doLogin(params: ILoginParams): Promise<any> {
        operate("验证登陆数据")
        // 加密
        loginDataEncrypt(params)

        // 查询
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
        } else {
            return Promise.resolve(Response.fail("密码或答案错误"))
        }
    }

    /**
     * @description: 清空所有数据
     */
    async clearAllTable(): Promise<any> {
        Print.info("执行数据库清空")
        const [res1, res2, res3] =
            await Promise.all([
                LoginModel.clearTable(),
                AccountModel.clearTable(),
                OptionsModel.clearTable(),
                OperateLogModel.clearTable()
            ])

        if (res1 && res2 && res3) {
            return Promise.resolve(Response.succ())
        }
    }

    /**
     * @description: 登出（点击关闭按钮时会执行）
     * @return {Promise<Response>}
     * @author: HuiSir
     */
    async logout(): Promise<any> {
        operate("退出系统")
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

    /**
     * @description: 重置
     * @return {*}
     * @author: HuiSir
     */
    async softWareReset(): Promise<any> {
        // 打印日志
        Print.info("执行软件重置")

        // 删除数据库
        this.clearAllTable()

        // 删除注册表加密私钥
        Skey.delSkey()

        return Promise.resolve(Response.succ())
    }

}

export default new Login()