/*
 * @Description: 权限控制
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-26 09:16:55
 * @LastEditTime: 2021-05-30 18:09:05
 */

import CONST from "../config/const"

/**
 * 权限控制(携带token)
 */
export default class Permission {
    static verify(api: string): boolean {
        return new Permission().apiWhitelist.includes(api)
    }
    private apiWhitelist: string[] = CONST.API_WHITE_LIST   // api白名单
}
