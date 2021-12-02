<!--
 * @Description: 设置页
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-08 13:57:51
 * @LastEditTime: 2021-12-02 18:30:54
-->
<template>
    <div class="option">
        <el-form size="small">
            <el-form-item label="备份路径">
                <el-input v-model="backup_path" :readonly="true" style="width:250px;"></el-input>
            </el-form-item>
            <el-form-item style="margin-left:68px;">
                <el-button @click="resetBackupPath">重设路径</el-button>
                <el-button @click="doBackup">立即备份</el-button>
                <el-button @click="dataRecover">数据恢复</el-button>
            </el-form-item>
            <el-form-item label="备份保留">
                <el-input-number v-model="backup_file_num" :step="1" :min="1"
                    controls-position="right" @change="backupNumChange"></el-input-number>
                <span class="line-intro">只保留最近的{{backup_file_num}}个备份文件</span>
            </el-form-item>
            <el-form-item label="自动备份">
                <el-switch v-model="auto_backup" @change="setAutoBackup"></el-switch>
                <span class="line-intro">开启后每次退出时将会备份数据库</span>
            </el-form-item>
            <el-form-item label="密码重设">
                <el-button @click="passReset">立即重设</el-button>
                <span class="line-intro">重设总密码及验证问题和答案</span>
            </el-form-item>
            <el-form-item label="进程日志">
                <el-button @click="openFile('./logs/output.log')" type="text" style="color:green">
                    执行日志
                </el-button>
                <el-button @click="openFile('./logs/errors.log')" type="text" style="color:red">错误日志
                </el-button>
            </el-form-item>
            <el-form-item label="作者博客">
                <el-button @click="openExternal('http://www.zuifengyun.com')" type="text">醉风云博客
                </el-button>
                <el-button @click="openExternal('http://code.zuifengyun.com')" type="text">码农备忘录
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
 
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { getOptionsData, saveOptionsData, backup, doRecover } from '@/api/option'
import {
    relaunch,
    showOpenDirBox,
    openExternal,
    openFile,
    showOpenFileBox,
    showMessageBoxSync,
    openChildWindow,
} from '@/api/win'
import { updateSkey } from '@/api/login'

export default defineComponent({
    name: '',
    setup() {
        const backup_path = ref('')
        const backup_file_num = ref(1)
        const auto_backup = ref(false)
        const optionId = ref('')

        // 请求初始数据
        ;(async () => {
            const res = await getOptionsData()
            if (res && res.ok) {
                backup_path.value = res.data.backup_path
                backup_file_num.value = res.data.backup_file_num
                auto_backup.value = !!res.data.auto_backup
                optionId.value = res.data.id
            }
        })()

        // 重设路径
        const resetBackupPath = async () => {
            // 选择文件夹
            const res = await showOpenDirBox()
            if (res && !res.canceled) {
                backup_path.value = res.filePaths[0]
                // 保存路径到数据库
                const saveRes = await saveOptionsData({
                    backup_path: backup_path.value,
                    id: optionId.value,
                })
                if (saveRes && saveRes.ok) {
                    window.toast('设置成功')
                }
            }
        }

        // 立即备份
        const doBackup = async () => {
            const res = await backup()
            if (res && res.ok) {
                window.toast('备份成功')
            }
        }

        // 数据恢复
        const dataRecover = async () => {
            // 选择文件
            const fileRes = await showOpenFileBox(
                '选择需要恢复的数据备份文件',
                ['db.bak'],
                backup_path.value
            )

            if (fileRes && !fileRes.canceled) {
                const confirmRes = await showMessageBoxSync({
                    title: '警告',
                    type: 'warning',
                    msg:
                        '1. 恢复后当前数据将被完全清空，包括总密码、账户表、验证问题、配置项及操作记录！\n' +
                        '2. 可到账户列表对现有账户数据进行选择性导出，等恢复了备份再增量导入！\n' +
                        '3. 稍候将填写数据加密私钥，数据恢复后将重启软件！\n' +
                        '4. 数据包不合法或加密私钥错误将导致程序故障，若有疑问请取消恢复！\n' +
                        '5. 请谨慎操作，确保已选择的备份文件安全有效！',
                })

                if (confirmRes === 0) {
                    let skey
                    try {
                        const { value } = await ElMessageBox.prompt(
                            '请输入此备份的数据加密私钥！私钥是在软件安装时所填写。',
                            '提示',
                            {
                                confirmButtonText: '确认',
                                cancelButtonText: '取消',
                                inputPattern: /\w+/,
                                inputErrorMessage: '私钥不能为空',
                            }
                        )
                        skey = value
                    } catch (error) {
                        return
                    }

                    const bakfilePath = fileRes.filePaths[0]
                    // 执行恢复
                    const recoverRes = await doRecover(bakfilePath, skey)
                    if (recoverRes && recoverRes.ok) {
                        window.toast('数据恢复成功')
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
        }

        // 设置备份保留数量
        const backupNumChange = async (n: number) => {
            // 保存数量到数据库
            const saveRes = await saveOptionsData({
                backup_file_num: n,
                id: optionId.value,
            })
            if (saveRes && saveRes.ok) {
                window.toast('设置成功')
            }
        }

        // 自动备份开关
        const setAutoBackup = async (e: any) => {
            // 保存到数据库
            const saveRes = await saveOptionsData({
                auto_backup: e ? 1 : 0,
                id: optionId.value,
            })
            if (saveRes && saveRes.ok) {
                window.toast('设置成功')
            }
        }

        // 密码重设
        const passReset = async () => {
            const confirmRes = await showMessageBoxSync({
                title: '提示',
                msg: '确认要重设密码？',
            })
            if (confirmRes === 0) {
                const { origin, pathname } = location
                openChildWindow({
                    wid: 'passReset',
                    url: `${origin + pathname}#/reset?from=home&token=${sessionStorage.getItem(
                        'token'
                    )}`,
                    width: 280,
                    height: 380,
                    title: '重设密码',
                })
            }
        }

        return {
            backup_path,
            backup_file_num,
            backupNumChange,
            auto_backup,
            dataRecover,
            resetBackupPath,
            doBackup,
            setAutoBackup,
            openExternal,
            openFile,
            passReset,
        }
    },
})
</script>
 
<style scoped lang="scss">
.option {
    position: relative;
    height: 100%;
    span.line-intro {
        font-size: 12px;
        color: #888;
        margin-left: 10px;
    }
    &:deep(.el-form-item__label) {
        color: #000;
    }
}
</style>