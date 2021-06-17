/*
 * @Description: 加密私钥存取
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-17 22:14:18
 * @LastEditTime: 2021-06-17 23:12:12
 */
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

    addSkey(val: string) { return this.Reg.add(this.regSkeyName, val) }

    delSkey() { return this.Reg.del(this.regSkeyName) }

    updateSkey(val: string) { return this.Reg.update(this.regSkeyName, val) }

    getSkey() { return this.Reg.find(this.regSkeyName) }
}

export default new Skey(new RegAgent(regDir), regSkeyName)