/*
 * @Description: 对称加密
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-26 18:09:58
 * @LastEditTime: 2021-05-26 22:24:30
 */
import CONST from "../config/const"

class Encrypt {
    private skey: string

    constructor(skey: string) {
        this.skey = skey     //密钥
    }

    //加密
    encrypt(str: string, skey: string = this.skey) {
        const strArr: string[] = Buffer.from(str + skey)
            .toString('base64')
            .split('') //Base64
        strArr.reverse() //逆序
        const enStr: string = strArr.join('').replace(/=/g, '$') //将=替换
        return enStr
    }

    //解密
    decrypt(pass: string, skey: string = this.skey) {
        const strArr: string[] = pass.replace(/\$/g, '=').split('')
        strArr.reverse() //逆序
        const str: string = Buffer.from(strArr.join(''), 'base64')
            .toString()
            .split(skey)[0]
        return str
    }
}

export default new Encrypt(CONST.SKEY)