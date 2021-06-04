/*
 * @Description: 对称加密
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-26 18:09:58
 * @LastEditTime: 2021-06-05 02:13:21
 */
import CONST from "../config/const"
import { Print } from './Logger' //日志
import os from "os"

const netInfo: NodeJS.Dict<os.NetworkInterfaceInfo[]> = os.networkInterfaces()
const MAC = Object.keys(netInfo).map((key) => netInfo[key]![0]).find((item) => item.mac !== "00:00:00:00:00:00")!.mac
Print.info("本机MAC地址为" + MAC)

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
        const strArr: string[] = Buffer.from(str + this.skey + MAC)
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