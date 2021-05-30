/*
 * @Description: Token生成和解码
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-30 12:46:46
 * @LastEditTime: 2021-05-30 12:54:54
 */

import _encrypt from "./Encrypt"
const { encrypt, decrypt } = _encrypt
import { Log } from './Logger' //日志

//注意  使用静态方法可以直接使用类名.进行访问，不需要new对象
export const creatToken = (userid: string): string => {
    const curTime = Date.now() //当前时间戳(保证每次生成不同的token)
    const curTime36 = curTime.toString(36) //转为36进制
    return encrypt(`${userid},${curTime36}`)
}

//解析token，搭配redis
export const decodeToken = (token: string): string | null => {
    try {
        const [userid, curTime36] = decrypt(token).split(',')

        const loginTime = parseInt(curTime36, 36) //36进制转10进制

        if ((loginTime + '').length !== 13) {
            Log.error('token不合法')
            return null
        }

        return userid
    } catch (err) {
        Log.error('token不合法')
        return null
    }
}