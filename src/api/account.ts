/*
 * @Description: 账户存储相关API
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-10 17:29:40
 * @LastEditTime: 2021-12-07 22:01:03
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

// 随机查询2条账户
export const getAccountListRan = () => todo('getAccountListRan', 2)

// 验证数据
export const checkAccounts = (data: string) => todo('checkAccounts', data)

// 导出
export const exportAccounts2Csv = (path: string) => todo('exportAccounts2Csv', path)

// 导入
export const importCsvAccountsFile = (filePath: string) => todo('importCsvAccountsFile', filePath)