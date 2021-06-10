/*
 * @Description: 窗口api
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-10 17:30:12
 * @LastEditTime: 2021-06-10 18:52:12
 */
import { winTodo } from "@/utils/sys"

export const minimize = () => winTodo('minimize')
export const close = () => winTodo('close')
export const showMessageBoxSync = (params: IshowMessageBoxArgs) => winTodo('showMessageBoxSync', params)