/*
 * @Description: 响应参数配置
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-25 14:23:18
 * @LastEditTime: 2021-06-01 17:24:11
 */
interface IResponse {
    ok: number
    msg: string
    data?: any
}

interface ISuccArg {
    msg?: string
    data?: any
}

export default class Response implements IResponse {

    static succ(arg: ISuccArg = {}): Response {
        const { msg, data } = arg
        return new Response(1, msg, data)
    }

    static fail(msg: string = "未知错误"): Response {
        return new Response(0, msg)
    }

    ok: number = 1
    msg: string = "成功"
    data?: any

    private constructor(ok?: number, msg?: string, data?: any) {
        ok !== undefined && (this.ok = ok)
        msg && (this.msg = msg)
        data && (this.data = data)
    }

}
