/*
 * @Description: 导出导入CSV操作
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-12-05 15:03:02
 * @LastEditTime: 2021-12-08 18:39:08
 */
import iconvLite from "iconv-lite"
import fs from "fs"
import Encrypt from "./Encrypt"
// 需要加密的字段
const needEncryptKeys: string[] = ["account", "password", "email", "phone"]

/**
 * 行对象数据转义csv-buffer
 * @param row 行数据
 * @param hasKeys 是否是第一行 
 */
export function rowData2CsvBuffer(row: Index, hasKeys: boolean = false): Buffer {
    const keys = Object.keys(row)
    const keysLine = hasKeys ? keys.join(",") : ""
    const valsLine = `\r\n${keys.map(key => {
        // 这里处理解密
        let value = row[key]
        if (needEncryptKeys.includes(key)) {
            value = Encrypt.decrypt(value)
        }
        return handleCsvWord(value)
    }).join(',')}`
    // 注意使用iconvLite将带汉字的字符串格式转为GBK，解决中文文件乱码问题
    return iconvLite.encode(keysLine + valsLine, "gbk")
}

/**
 * 封装写入流为promise
 * @param Ws 
 * @param buf 
 * @returns 
 */
export function wsWriteSync(Ws: fs.WriteStream, buf: Buffer): Promise<any> {
    return new Promise((resolve, reject) => {
        Ws.write(buf, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve(1)
            }
        })
    })
}

/**
 * 导入csv文件字符转数组对象
 * @param csvBuffer csv文件字符
 * @returns 
 */
export function csvString2Obj(csvBuffer: Buffer): Index[] {
    // 注意使用iconvLite解决中文文件乱码问题
    const rows = iconvLite.decode(csvBuffer, "gbk").split("\r\n")
    const keys = (rows.shift() || '').split(",")
    const jsonObj = rows.map(item => {
        // 去除制表符
        const values = item.replace(/\t/g, "").split(",")
        const obj: Index = {}
        for (var i = 0; i < keys.length; i++) {
            const curVal = values[i]
            // 去除值首尾的双引号
            const matchQuot = curVal.match(/^"(.*)"$/)
            const realVal = matchQuot ? matchQuot[1] : curVal
            obj[keys[i]] = realVal
        }
        return obj
    })
    return jsonObj
}

/**
 * 处理csv中值
 * 每条记录占一行 以逗号为分隔符 逗号前后的空格会被忽略
 * 字段中包含有逗号，该字段必须用双引号括起来
 * 字段中包含有换行符，该字段必须用双引号括起来
 * 字段前后包含有空格，该字段必须用双引号括起来
 * 字段中如果有双引号，该字段必须用双引号括起来
 * 字段中如果有長字符串且为数字字符串，则添加\t制表符，防止预览时被表格转义为科学计数
 */
function handleCsvWord(value: string) {
    const Characters = [',', ' ', '\r\n', '"']
    if (value && value.toString().split("").find(word => Characters.includes(word))) {
        return `"${value}"`
    } else if (typeof value === "string" && value.length > 5 && !isNaN(Number(value))) {
        // 防止预览时被表格转义为科学计数
        return value + "\t"
    } else {
        return value
    }
}