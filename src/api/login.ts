/*
 * @Description: 登录相关API
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-10 17:29:10
 * @LastEditTime: 2021-06-20 16:56:53
 */
import { todo } from "@/utils/sys"

// 获取登录数据(id)
export const getLoginData = () => todo('getLoginData')

// 保存、修改
export const saveLoginData = (data: ILoginParams) => todo('saveLoginData', data)

// 登录验证
export const doLogin = (data: ILoginParams) => todo('doLogin', data)

// 打开主窗口
export const openMainWindow = () => todo('openMainWindow')

// 查询密钥
export const haskey = () => todo('haskey')

// 密钥保存到注册表
export const addSkey = (key: string) => todo('addSkey', key)

// 重设登陆数据
export const resetLoginData = (data: IResetLoginParams) => todo('resetLoginData', data)