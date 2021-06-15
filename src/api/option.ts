/*
 * @Description: 选项设置
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-14 20:58:09
 * @LastEditTime: 2021-06-15 13:48:40
 */
import { todo } from "@/utils/sys"

// 请求设置选项
export const getOptionsData = () => todo('getOptionsData')

// 保存设置选项
export const saveOptionsData = (params: IOptionsParams) => todo('saveOptionsData', params)

// 立即备份
export const backup = () => todo('doBackup')