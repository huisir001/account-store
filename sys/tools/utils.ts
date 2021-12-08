/*
 * @Description: 工具
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-30 17:12:49
 * @LastEditTime: 2021-12-08 23:41:02
 */

interface IObject {
    [key: string]: any
}

/**
 * @description: 时间格式化
 * @param {*} timeStamp
 * @param {*} timeType
 * @return {*}
 * @author: HuiSir
 */
export const formatDate = (timeStamp: Date | string | number, timeType?: string) => {
    const date =
        timeStamp instanceof Date ? timeStamp : new Date(timeStamp)
    const getFullNum = (num: number) => (num < 10 ? '0' + num : num) //小于两位补零
    const format: IObject = {
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

/**
 * url-query转对象
 */
export const getUrlQuery = (): IObject => {
    var query: IObject = {}
    var params = window.location.search[1] ? window.location.search.slice(1).split("&") : []	//参数内容
    for (var i = 0; i < params.length; i++) {	//将query转换为json
        var item = params[i].split("=")
        query[item[0]] = item[1]
    }
    return query
}

/**
 * 对象转query
 */
export const obj2Query = (data: IObject) => {
    var _result = []
    for (var key in data) {
        var value = data[key]
        if (value.constructor == Array) {
            value.forEach(function (_value) {
                _result.push(key + "=" + _value)
            })
        } else {
            _result.push(key + '=' + value)
        }
    }
    return _result.join('&')
}