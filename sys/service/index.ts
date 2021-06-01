/*
 * @Description: 暴露方法
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-01 17:44:18
 * @LastEditTime: 2021-06-01 18:05:25
 */
import accounts from "./Accounts"
import login from "./Login"
import options from "./Options"
import { getOperateLogs, delOperateLogs } from "./operationLog"

// 定义可索引类型的接口
interface IMethods {
    [key: string]: (...arg: any[]) => any
}

let methods: IMethods = {
    getOperateLogs,
    delOperateLogs
}

const getProtoMethods = (instant: any) => {
    return Object.getOwnPropertyNames(Object.getPrototypeOf(instant)).filter(m => m != "constructor")
}

const classMethods = [accounts, login, options]

classMethods.forEach(instance => {
    getProtoMethods(instance).forEach(key => {
        methods[key] = Object.assign(instance)[key]
    })
})

export default methods


