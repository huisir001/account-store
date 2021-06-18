/*
 * @Description: 注册表操作
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-17 15:59:18
 * @LastEditTime: 2021-06-18 21:23:51
 */
import process from 'child_process'

interface IRegArgs {
    // 数据类型，默认REG_SZ，可为字符串或数字
    type?: ('REG_SZ' | 'REG_MULTI_SZ' | 'REG_EXPAND_SZ' | 'REG_DWORD' | 'REG_QWORD' | 'REG_BINARY' | 'REG_NONE')
    // 根项/根路径
    rootDir?: ('HKCU' | 'HKCR' | 'HKLM' | 'HKU' | 'HKCC')
    childDir: string // 子项/子路径（多级路径用反斜杠隔开，如`MyApp\UserInfo`）,项目一般用大驼峰写法
}

export default class RegAgent {

    /**
     * @description: 全路径
     * @param {*}
     * @return {*}
     */
    get regdir(): string {
        const { rootDir, childDir } = this
        return rootDir + '\\' + childDir
    }

    /**
     * @description: 子进程执行回调
     * @param {*} error 执行出错
     * @param {*} stdout 标准输出
     * @param {*} stderr 标准错误
     * @return {*}
     */
    static doReg(regQuery: string): string {
        const stdout = process.execSync(regQuery).toString('utf-8')
        const matchRes = stdout.match(/@@(.*?)@@/)
        return matchRes ? matchRes[1] : stdout
    }

    type: string
    rootDir: string
    childDir: string

    constructor(childDir: string)
    // tslint:disable-next-line:unified-signatures
    constructor(args: IRegArgs)
    constructor(arg: IRegArgs | string) {
        if (typeof arg === 'string') {
            this.type = 'REG_SZ'
            this.rootDir = 'HKCU'
            this.childDir = arg
        } else {
            this.type = arg.type || 'REG_SZ'
            this.rootDir = arg.rootDir || 'HKCU'
            this.childDir = arg.childDir
        }
    }

    /**
     * @description: 增
     * @param {string} key
     * @param {string} val
     * @param {boolean} isReset
     * @return {*}
     */
    add(key: string, val: string, isReset: boolean = false): any {
        const { type, regdir } = this
        // ps:@@为占位符
        val = `"@@${val}@@"`
        const regQuery = `REG ADD ${regdir} /v ${key} /t ${type} /d ${val}${isReset ? ' /f' : ''}`

        // 执行
        return RegAgent.doReg(regQuery)
    }

    /**
     * @description: 删
     * @param {string} key
     * @return {*}
     */
    del(key: string): any {
        const regQuery = `REG DELETE ${this.regdir} /v ${key} /f`

        // 执行
        return RegAgent.doReg(regQuery)
    }

    /**
     * @description: 改
     * @param {string} key
     * @param {string} val
     * @return {*}
     */
    update(key: string, val: string): any {
        this.add(key, val, true)
    }

    /**
     * @description: 查
     * @param {string} key
     * @return {*}
     */
    find(key: string): any {
        const regQuery = `REG QUERY ${this.regdir} /v ${key} /f *`

        // 执行
        return RegAgent.doReg(regQuery)
    }
}