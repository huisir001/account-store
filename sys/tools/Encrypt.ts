/*
 * @Description: 对称加密
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-26 18:09:58
 * @LastEditTime: 2021-05-26 18:39:10
 */

// const { Log } = require('./logger') //日志
import { SKEY } from "../config/const"

class Encrypt {
    private skey: string

    constructor(skey: string) {
        this.skey = skey     //密钥
    }

    //加密
    encrypt(str, skey = this.skey) {
        let strArr = Buffer.from(str + skey)
            .toString('base64')
            .split('') //Base64
        strArr.reverse() //逆序
        let enStr = strArr.join('').replace(/=/g, '$') //将=替换
        return enStr
    }

    //解密
    decrypt(pass, skey = this.skey) {
        let strArr = pass.replace(/\$/g, '=').split('')
        strArr.reverse() //逆序
        let str = Buffer.from(strArr.join(''), 'base64')
            .toString()
            .split(skey)[0]
        return str
    }
}

export default new Encrypt(SKEY)