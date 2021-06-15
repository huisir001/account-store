<!--
 * @Description: 设置页
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-08 13:57:51
 * @LastEditTime: 2021-06-15 14:22:33
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
            </el-form-item>
            <el-form-item label="自动备份">
                <el-switch v-model="auto_backup" @change="setAutoBackup"></el-switch>
                <span class="line-intro">开启后每次退出时将会备份数据库</span>
            </el-form-item>
        </el-form>
    </div>
</template>
 
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getOptionsData, saveOptionsData, backup } from '@/api/option'
import { showOpenDirBox } from '@/api/win'

export default defineComponent({
    name: '',
    setup() {
        const backup_path = ref('')
        const auto_backup = ref(false)
        const optionId = ref('')

        // 请求初始数据
        ;(async () => {
            const res = await getOptionsData()
            if (res && res.ok) {
                backup_path.value = res.data.backup_path
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

        return { backup_path, auto_backup, resetBackupPath, doBackup, setAutoBackup }
    },
})
</script>
 
<style scoped lang="scss">
.option {
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