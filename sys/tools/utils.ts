/*
 * @Description: 工具
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-30 17:12:49
 * @LastEditTime: 2021-05-30 17:23:46
 */

interface Iformat {
    [key: string]: any
}

/**
 * @description: 时间格式化
 * @param {*} timeStamp
 * @param {*} timeType
 * @return {*}
 * @author: HuiSir
 */
export const formatDate = (timeStamp: Date | string | number, timeType: string) => {
    const date =
        timeStamp instanceof Date ? timeStamp : new Date(timeStamp)
    const getFullNum = (num: number) => (num < 10 ? '0' + num : num) //小于两位补零
    const format: Iformat = {
        yyyy: date.getFullYear(),
        M: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds(),
        MM: getFullNum(date.getMonth() + 1),
        dd: getFullNum(date.getDate()),
        hh: getFullNum(date.getHours()),
        mm: getFullNum(date.getMinutes()),
        ss: getFullNum(date.getSeconds()),
        day: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
    }
    const reformat = function (typeStr: string, str: string): string {
        if (typeStr.includes(str) && typeStr.split(str).length - 1 === 1) {
            return typeStr.replace(str, format[str])
        } else {
            return typeStr
        }
    }

    let result: string = ""
    Object.keys(format).forEach((key) => {
        result = reformat(result || timeType || 'yyyy-MM-dd', key)
    })
    return result
}