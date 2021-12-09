/*
 * @Description: 手写字符串对称加密
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-26 18:09:58
 * @LastEditTime: 2021-12-09 12:30:15
 */
import Skey from "../service/Skey"
import crypto from 'crypto';

class Encrypt {
    /**
     * @description: 加密
     * @param {string} src 要加密的字符串
     * @return {string}
     * @author: HuiSir
     */
    encrypt(src: string | number): string {
        src = src.toString()
        const key = Skey.getSkey().data
        // 加盐
        const iv = Buffer.alloc(0);
        const keyBuffer = crypto.createHash('md5').update(key).digest()
        const cipher = crypto.createCipheriv('AES-128-ECB', keyBuffer, iv);
        return cipher.update(src, 'utf8', 'hex') + cipher.final('hex');
    }

    /**
    * @description: 解密
    * @param {string} sign 要解密的密文
    * @return {string}
    * @author: HuiSir
    */
    decrypt(sign: string): string {
        const key = Skey.getSkey().data
        // 加盐
        const iv = Buffer.alloc(0);
        const keyBuffer = crypto.createHash('md5').update(key).digest()
        const cipher = crypto.createDecipheriv('AES-128-ECB', keyBuffer, iv);
        return cipher.update(sign, 'hex', 'utf8') + cipher.final('utf8');
    }
}

export default new Encrypt()