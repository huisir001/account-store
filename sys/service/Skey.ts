/*
 * @Description: 加密私钥存取
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-17 22:14:18
 * @LastEditTime: 2021-06-18 22:06:00
 */
import Response from "../tools/Response"
import RegAgent from "../tools/RegAgent"
import CONST from "../config/const"
const { regDir, regSkeyName } = CONST

class Skey {
    Reg: RegAgent
    regSkeyName: string
    constructor(reg: RegAgent, SkeyName: string) {
        this.Reg = reg
        this.regSkeyName = SkeyName
    }

    addSkey(val: string) {
        const res = this.Reg.add(this.regSkeyName, val)
        return Response.succ({ data: res })
    }

    delSkey() {
        const res = this.Reg.del(this.regSkeyName)
        return Response.succ({ data: res })
    }

    updateSkey(val: string) {
        const res = this.Reg.update(this.regSkeyName, val)
        return Response.succ({ data: res })
    }

    getSkey() {
        const res = this.Reg.find(this.regSkeyName)
        return Response.succ({ data: res })
    }

    haskey() {
        let flag: boolean = true
        try {
            this.Reg.find(this.regSkeyName)
        } catch (error) {
            flag = false
        }
        return Response.succ({ data: flag })
    }
}

export default new Skey(new RegAgent(regDir), regSkeyName)