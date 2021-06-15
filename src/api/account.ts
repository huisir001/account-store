/*
 * @Description: 账户存储相关API
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-10 17:29:40
 * @LastEditTime: 2021-06-16 00:23:51
 */

import { todo } from "@/utils/sys"

// 保存账户
export const saveAccount = (data: IAddAccountParams) => todo('saveAccount', data)

// 查询列表
export const getAccountList = (data: IGetListParams) => todo('getAccountList', data)

// 获取单个账户
export const getAccountById = (id: string) => todo('getAccountById', id)

// 删除账户
export const delAccount = (id: string) => todo('delAccount', id)

// 解密账户字符串
export const decryptByVal = (val: string) => todo('decryptByVal', val)