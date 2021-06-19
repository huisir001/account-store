/*
 * @Description: 选项设置
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-14 20:58:09
 * @LastEditTime: 2021-06-19 16:33:21
 */
import { todo } from "@/utils/sys"

// 请求设置选项
export const getOptionsData = () => todo('getOptionsData')

// 保存设置选项
export const saveOptionsData = (params: IOptionsParams) => todo('saveOptionsData', params)

// 立即备份
export const backup = () => todo('doBackup')

// 执行数据恢复
export const doRecover = (filePath: string) => todo('doRecover', filePath)