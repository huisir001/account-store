/*
 * @Description: 导出CSV操作
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-12-05 15:03:02
 * @LastEditTime: 2021-12-05 16:44:52
 */
import iconvLite from "iconv-lite"
/**
 * 导出csv-csvDataBuffer
 * @param data any[]
 */
export function JSON2CsvBuffer(data: any[]) {
    const keys = Object.keys(data[0])
    const csvData = data.reduce((prev: string, curr: { [x: string]: any }, index: number) => {
        index === 1 && (prev = `${keys.join(",")}\r\n${keys.map(key => handleCsvWord(data[0][key])).join(',')}`)
        return `${prev}\r\n${keys.map(key => handleCsvWord(curr[key])).join(',')}`
    })

    // 注意使用iconvLite将带汉字的字符串格式转为GBK，解决中文文件乱码问题
    return iconvLite.encode(csvData, "gbk")
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