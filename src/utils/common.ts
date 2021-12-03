/*
 * @Description: 工具
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-12-03 18:18:00
 * @LastEditTime: 2021-12-03 18:19:13
 */

export const obj2Query = (data: { [x: string]: any; }) => {
    var _result = [];
    for (var key in data) {
        var value = data[key];
        if (value.constructor == Array) {
            value.forEach(function (_value) {
                _result.push(key + "=" + _value);
            });
        } else {
            _result.push(key + '=' + value);
        }
    }
    return _result.join('&');
}
