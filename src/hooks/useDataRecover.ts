/*
 * @Description: 数据恢复，在初次安装和设置界面使用
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-12-03 15:50:11
 * @LastEditTime: 2021-12-04 00:38:03
 */
import os from "os"
import { doRecover } from '@/api/option'
import { relaunch, showOpenFileBox, showMessageBoxSync, openChildWindow } from '@/api/win'
import { Ref } from "vue"
import { obj2Query } from "@/utils/common"

export default (backup_path?: Ref<string>) => {
    return async () => {

        const MSG = backup_path ? '恢复' : '导入'

        const confirmRes = await showMessageBoxSync({
            title: '警告',
            type: 'warning',
            msg: backup_path ?
                '1. 恢复后当前数据将被完全清空，包括总密码、账户表、验证问题、配置项及操作记录！\n' +
                '2. 可到账户列表对现有账户数据进行选择性导出，等恢复了备份再增量导入！\n' +
                '3. 稍候将填写数据加密私钥，数据恢复后将重启软件！\n' +
                '4. 数据包不合法或加密私钥错误将导致程序故障，若有疑问请取消恢复！\n' +
                '5. 请谨慎操作，确保已选择的备份文件安全有效！' :
                '1. 导入后请使用原先的账号密码登录！\n' +
                '2. 稍候将填写数据加密私钥，数据导入后将重启软件！\n' +
                '3. 数据包不合法或加密私钥错误将导致程序故障，若有疑问请取消导入！\n' +
                '4. 请谨慎操作，确保已选择的备份文件安全有效！'
        })

        if (confirmRes === 0) {

            // 选择文件
            const fileRes = await showOpenFileBox(
                `选择需要${MSG}的数据备份文件`,
                ['db.bak'],
                backup_path ? backup_path.value : os.homedir() //用户文件夹
            )

            if (fileRes && !fileRes.canceled) {
                const { origin, pathname } = location
                const queryObj = {
                    label: '请输入数据加密私钥，私钥是在软件安装时所填写的一串字符',
                }
                openChildWindow(
                    {
                        wid: 'promptWindow',
                        url: `${origin + pathname}#/prompt?${obj2Query(queryObj)}`,
                        width: 360,
                        height: 150,
                        title: '私钥',
                    },
                    async ({ msg, data }: IWinMessage) => {
                        // 接收消息
                        if (msg === 'sure') {
                            const skey = (data as any).value
                            const filePath = fileRes.filePaths[0]
                            // 执行恢复
                            const recoverRes = await doRecover(filePath, skey)
                            if (recoverRes && recoverRes.ok) {
                                window.toast(`数据${MSG}成功`)
                                let num = 3
                                const timer = setInterval(() => {
                                    window.toast({
                                        type: 'warn',
                                        msg: '即将重启...(' + num.toString() + ')',
                                    })
                                    num--
                                    if (num < 0) {
                                        // 重启
                                        relaunch()
                                        clearInterval(timer)
                                    }
                                }, 1000)
                            }
                        }
                    }
                )

            }
        }
    }
}