/*
 * @Description: 全局类型定义
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-10 16:13:02
 * @LastEditTime: 2021-06-10 18:42:33
 */

/**
 * 可索引对象
 */
declare interface Index {
    [key: string]: any
}

/**
 * 系统操作
 */
declare interface ISys {
    /**
     * @description: 底层请求
     * @param {string} something 方法名
     * @param {array} parames 参数
     * @return {*}
     */
    do: (something: string, ...parames: any[]) => Promise<any>

    /**
     * @description: 窗口操作
     * @param {string} something 方法名
     * @param {array} parames 参数
     * @return {*}
     */
    win: (something: string, ...parames: any[]) => Promise<any>
}

/**
 * toast提示
 */
declare interface IToastArg {
    msg?: string
    delay?: number // 延迟时间，毫秒数
    type?: string // 类型icon，succ\err\warn
}

/**
 * window对象扩展
 */
declare interface Window {
    sys: ISys   // 主线程操作
    toast: (arg: string | IToastArg) => void // 提示信息
}

/**
 * 登录入参
 */
declare interface ILoginParams extends Index {
    id?: string
    core_password: string
    verify_question?: string
    verify_answer: string
}

/**
 * 账户数据入参
 */
declare interface IAddAccountParams extends Index {
    id?: string // 若有id 为修改原数据，若无，则为新增
    name?: string // 名称
    account?: string // 登录账号
    password?: string // 登录密码
    email?: string // 绑定邮箱
    phone?: string // 绑定手机
    remark?: string // 备注
}

/**
 * 账户分页列表入参
 */
declare interface IGetListParams {
    name?: string // 名称
    page: number // 当前页码
    limit: number // 每页条数
}

/**
 * 系统弹窗入参
 */
declare interface IshowMessageBoxArgs {
    title?: string // 标题
    msg?: string // 内容
    type?: string // 类型,默认为'info',如"none", "info", "error", "question" or "warning"
    btns?: string[] // 按钮数组
}
