/*
 * @Description: 权限控制
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-26 09:16:55
 * @LastEditTime: 2021-05-26 09:27:03
 */

/**
 * 权限控制暂时就一个黑名单（或者白名单）
 * 其他权限本软件用不到
 */
export default class Permission {
    private apiBlacklist: string[] = []   // api黑名单

    static verify(api: string): boolean {
        return !new Permission().apiBlacklist.includes(api)
    }
}
