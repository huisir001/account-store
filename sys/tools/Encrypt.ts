/*
 * @Description: 对称加密
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-26 18:09:58
 * @LastEditTime: 2021-06-18 00:28:00
 */
import CONST from "../config/const"
// import Skey from "../service/Skey"

// Skey.getSkey().then((res2: any) => {
//     console.log("res2", res2)
// }).catch((err2: any) => {
//     console.log('err2', err2)
// })


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
    encrypt(str: string): string {
        const strArr: string[] = Buffer.from(str + this.skey)
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
    decrypt(pass: string): string {
        const strArr: string[] = pass.replace(/\$/g, '=').split('')
        strArr.reverse() //逆序
        const str: string = Buffer.from(strArr.join(''), 'base64')
            .toString()
            .split(this.skey)[0]
        return str
    }
}

export default new Encrypt(CONST.SKEY)