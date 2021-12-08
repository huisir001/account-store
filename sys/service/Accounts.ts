/*
 * @Description: 账号表数据增删改查
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-25 11:26:37
 * @LastEditTime: 2021-12-08 18:24:53
 */
import Response from "../tools/Response"
import AccountModel from "../models/Accounts"
import { operate } from "./operationLog"
import Encrypt from "../tools/Encrypt"
import { formatDate } from "../tools/utils"
import { creatToken } from "../tools/Token"
import TokenModel from "../models/Token"
import loginMethod from "./Login"
import { csvString2Obj, rowData2CsvBuffer, wsWriteSync } from "../tools/csv"
import path from "path"
import fs from "fs"

/**
 * 查询列表返回数据类型
 */
interface IAccountListByPage {
    list: object[] // 数据集
    page: number // 当前页码
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

// 需要加密的字段
const needEncryptKeys: string[] = ["account", "password", "email", "phone"]

class Accounts implements IAccunts {
    /**
     * @description: 修改或新增账户数据
     * @param {IAddAccountParams} params
     * @return {*}
     */
    async saveAccount(params: IAddAccountParams): Promise<any> {
        // 加密
        Object.keys(params).forEach((key) => {
            if (needEncryptKeys.includes(key)) {
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
            params.update_time = formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
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

            // 解密
            Object.keys(data).forEach((key) => {
                if (needEncryptKeys.includes(key)) {
                    data[key] = Encrypt.decrypt(data[key])
                }
            })

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
        // fuzzy-模糊查询
        let list = await AccountModel.find(
            { name },
            {
                page,
                limit,
                sort: "-create_time",
                filter: "id name create_time",
                fuzzy: true,
            }
        )
        const { count: total } = await AccountModel.count({ name })
        if (list) {
            const data: IAccountListByPage = {
                list,
                page,
                limit,
                total, // 总条数
                pageTotal:
                    total % limit > 0 ? Math.floor(total / limit) + 1 : total / limit,
            }
            return Promise.resolve(Response.succ({ data }))
        }
    }

    /**
     * 导出所有账户为CSV
     * @param {string} folder
     * @return {*}
     */
    async exportAccounts2Csv(folder: string): Promise<any> {
        operate("导出CSV账户数据")

        // 思路：先查出所有id，再根据ID查询单行数据，然后按行写入文件
        // 查询所有id：page=-1
        const ids = await AccountModel.find('', { page: -1, filter: "id", sort: "-create_time" })
        if (!(ids && ids.length)) {
            return Promise.resolve(Response.fail("暂无账户数据"))
        }

        // 写文件流
        const Ws = fs.createWriteStream(path.join(folder, `${Date.now()}.csv`))

        // 查詢單行数据
        for (let index = 0; index < ids.length; index++) {
            const { id } = ids[index];
            const data = await AccountModel.findOne({ id })

            if (data) {
                // 单行数据写入
                if (index === 0) {
                    // 第一行，需要同时写入keys和第一行values
                    await wsWriteSync(Ws, rowData2CsvBuffer(data, true))
                } else {
                    await wsWriteSync(Ws, rowData2CsvBuffer(data))
                }
                // 关闭流
                if (index === ids.length - 1) {
                    Ws.close()
                }
            }
        }

        return Promise.resolve(Response.succ())
    }

    /**
     * 导入cvs
     * @param filePath cvs文件绝对路径
     * @returns 
     */
    async importCsvAccountsFile(filePath: string): Promise<any> {
        operate("导入CSV账户数据文件")

        // 思路：由于表数据不会很大，所以这里直接全文件读，写入
        const csvBuffer = fs.readFileSync(filePath)
        // 转换为对象
        const jsonObj = csvString2Obj(csvBuffer)

        // 加密
        jsonObj.forEach(params => {
            Object.keys(params).forEach((key) => {
                if (needEncryptKeys.includes(key)) {
                    params[key] = Encrypt.encrypt(params[key])
                }
            })
        })

        // 存表
        let result = await AccountModel.createMany(jsonObj)

        return Promise.resolve(Response.succ({ data: result }))
    }

    /**
     * @description: 随机查询n条数据
     * @param {number} limit 查询n条，必须为大于0整数
     * @return {*}
     * @author: HuiSir
     */
    async getAccountListRan(limit: number): Promise<any> {
        operate("账户列表随机查询")
        const list = await AccountModel.find("", {
            page: -1,
            limit,
            filter: "id name",
            sort: "random",
        })
        if (list) {
            return Promise.resolve(Response.succ({ data: list }))
        }
    }

    /**
     * @description: 多个账户数据校验
     * @param {IAddAccountParams} params
     * @return {*}
     * @author: HuiSir
     */
    async checkAccounts(jsonstr: string): Promise<any> {
        operate("账户数据校验")

        const params: IAddAccountParams[] = JSON.parse(jsonstr)

        const list: IAddAccountParams[] = await AccountModel.find(
            { id: params.map((item) => item.id) },
            {
                page: -1,
                filter: "id account password",
            }
        )

        if (list) {
            for (const { id, account, password } of list) {
                const paramItem = params.find((p) => p.id === id)
                if (
                    paramItem?.account !== Encrypt.decrypt(account!) ||
                    paramItem?.password !== Encrypt.decrypt(password!)
                ) {
                    return Promise.resolve(Response.succ({ data: { token: null } }))
                }
            }
            // 查询用户id
            const { data } = await loginMethod.getLoginData()
            // 创建token
            const token = creatToken(data.id)
            // 缓存token
            const saveToken = await TokenModel.create({ token })
            if (saveToken) {
                return Promise.resolve(Response.succ({ data: { token } }))
            }
        }
    }
}

export default new Accounts()
