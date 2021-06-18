/*
 * @Description: 手写字符串对称加密
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-26 18:09:58
 * @LastEditTime: 2021-06-18 22:25:10
 */
import Skey from "../service/Skey"

class Encrypt {

    /**
     * @description: 加密
     * @param {string} str 要加密的字符串
     * @return {string}
     * @author: HuiSir
     */
    encrypt(str: string | number): string {
        str = str.toString()
        const skey = Skey.getSkey().data

        const encodeStr = this.EncodeUnicodeArray(str)
        const encodeSkey = this.EncodeUnicodeArray(skey)

        let flag = ""
        if (encodeStr.length > 0 && encodeStr.length < encodeSkey.length) {
            flag = `~${encodeStr.length + encodeSkey.length}`
        }

        const mixinUnicodeArr = this.mixin(encodeStr, encodeSkey)
        const encode36Arr = mixinUnicodeArr.map((item: { toString: (arg0: number) => any }) => item.toString(36))
        const encode2Base64 = Buffer.from(encode36Arr.join('-') + flag).toString('base64').replace(/=/g, "")

        return encode2Base64
    }


    /**
     * @description: 解密
     * @param {string} pass 要解密的密文
     * @return {string}
     * @author: HuiSir
     */
    decrypt(pass: string): string {
        const skey = Skey.getSkey().data
        const encodeSkey = this.EncodeUnicodeArray(skey)

        let decodeBase64 = Buffer.from(pass, 'base64').toString()

        let myStrLen = null

        if (decodeBase64.includes("~")) {
            const splitArr = decodeBase64.split("~")
            myStrLen = parseInt(splitArr[1], 10) - encodeSkey.length
            decodeBase64 = splitArr[0]
        }

        const encode36Arr = decodeBase64.split('-')
        const mixinUnicodeArr = encode36Arr.map((item) => parseInt(item, 36))

        if (JSON.stringify(mixinUnicodeArr) === JSON.stringify(encodeSkey)) {
            return ""
        }

        const deMixinArr = this.deMixin(mixinUnicodeArr, encodeSkey, myStrLen)

        return this.DecodeUnicodeArray(deMixinArr)
    }


    /**
     * @description: 转Unicode
     * @param {string} txt
     * @return {*}
     * @author: HuiSir
     */
    private EncodeUnicodeArray(txt: string): number[] {
        return txt.split('').map((c) => c.charCodeAt(0))
    }


    /**
     * @description: 解Unicode
     * @param {number} unicodeArray
     * @return {*}
     * @author: HuiSir
     */
    private DecodeUnicodeArray(unicodeArray: number[]): string {
        return (unicodeArray.map((unicode) => String.fromCharCode(unicode))).join('')
    }


    /**
     * @description: 混合
     * @param {number} strArr
     * @param {number} skeyArr
     * @return {*}
     * @author: HuiSir
     */
    private mixin(strArr: number[], skeyArr: number[]): number[] {
        if (strArr.length === 0) {
            return skeyArr
        }

        const [x, y] = strArr.length >= skeyArr.length ? [strArr, skeyArr] : [skeyArr, strArr]

        return x.map((n, i) => {
            const m = y[i] || y[i % y.length]
            return n + m + y.length
        })
    }


    /**
     * @description: 解混合
     * @param {number} mixinArr
     * @param {number} skeyArr
     * @param {number} myStrLen
     * @return {*}
     * @author: HuiSir
     */
    private deMixin(mixinArr: number[], skeyArr: number[], myStrLen: number | null): number[] {
        const skeyLen = skeyArr.length

        const resArr: number[] = mixinArr.map((m, i) => {
            const x = m - (skeyArr[i] || skeyArr[i % skeyLen]) - (myStrLen || skeyLen)
            return x
        })

        if (myStrLen) {
            return resArr.slice(0, myStrLen)
        } else {
            return resArr
        }
    }
}

export default new Encrypt()