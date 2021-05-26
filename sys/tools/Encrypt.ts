/*
 * @Description: 对称加密
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-26 18:09:58
 * @LastEditTime: 2021-05-26 22:48:41
 */
import CONST from "../config/const"

class Encrypt {
    private skey: string

    constructor(skey: string) {
        this.skey = skey     //密钥
    }

    /**
     * @description: 加密
     * @param {string} str 要加密的字符串
     * @param {string} skey 私钥
     * @return {string}
     * @author: HuiSir
     */
    encrypt(str: string, skey: string = this.skey): string {
        const strArr: string[] = Buffer.from(str + skey)
            .toString('base64')
            .split('') //Base64
        strArr.reverse() //逆序
        const enStr: string = strArr.join('').replace(/=/g, '$') //将=替换
        return enStr
    }

    /**
     * @description: 解密
     * @param {string} pass 要解密的密文
     * @param {string} skey 私钥
     * @return {string}
     * @author: HuiSir
     */
    decrypt(pass: string, skey: string = this.skey): string {
        const strArr: string[] = pass.replace(/\$/g, '=').split('')
        strArr.reverse() //逆序
        const str: string = Buffer.from(strArr.join(''), 'base64')
            .toString()
            .split(skey)[0]
        return str
    }
}

export default new Encrypt(CONST.SKEY)