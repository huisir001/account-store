/*
 * @Description: 暴露方法
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-01 17:44:18
 * @LastEditTime: 2021-06-18 22:20:53
 */
import accounts from "./Accounts"
import login from "./Login"
import options from "./Options"
import skey from "./Skey"
import winMethods from "./Win"
import { getOperateLogs, delOperateLogs } from "./operationLog"
import { openChildWindow } from "./ChildWin"

// 定义可索引类型的接口
interface IMethods {
    [key: string]: (...arg: any[]) => any
}

const methods: IMethods = {
    getOperateLogs,
    delOperateLogs,
    openChildWindow,
}

Object.assign(methods, winMethods)

const getProtoMethods = (instance: InstanceType<any>) => {
    return Object.getOwnPropertyNames(Object.getPrototypeOf(instance))
        .filter((m) => m !== "constructor")
}

const classMethods = [accounts, login, options, skey]

classMethods.forEach((instance) => {
    getProtoMethods(instance).forEach((key) => {
        // 这里必须使用bind绑定this指向实例对象，否则在方法中找不到this
        methods[key] = Object.assign(instance)[key].bind(instance)
    })
})

export default methods