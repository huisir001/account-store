/*
 * @Description: 账户存储相关API
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-10 17:29:40
 * @LastEditTime: 2021-06-10 18:23:31
 */

import { todo } from "@/utils/sys";

export const saveAccount = (data: IAddAccountParams) => todo('saveAccount', data)


export const getAccountList = (data: IGetListParams) => todo('getAccountList', data)


export const delAccount = (id: string) => todo('delAccount', id)