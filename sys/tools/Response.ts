/*
 * @Description: 响应参数配置
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-25 14:23:18
 * @LastEditTime: 2021-06-09 12:27:47
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

    /**
     * 重载参数
     */
    static fail(msg: string): Response
    static fail(arg: IResponse): Response
    static fail(arg: IResponse | string): Response {
        if (typeof arg == "string") {
            return new Response(0, arg)
        } else {
            return new Response(arg.ok, arg.msg)
        }
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
