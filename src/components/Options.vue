<!--
 * @Description: 设置页
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-08 13:57:51
 * @LastEditTime: 2021-06-14 21:29:36
-->
<template>
    <div class="option">
        <el-form :inline="true" size="small">
            <el-form-item label="备份路径">
                <el-input v-model="backup_path" :disabled="true" style="width:250px;"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="resetBackupPath">重设</el-button>
            </el-form-item>
            <br>
            <el-form-item label="自动备份">
                <el-switch v-model="auto_backup"></el-switch>
                <span class="line-intro">开启后每次退出时将会备份数据库</span>
            </el-form-item>
        </el-form>
    </div>
</template>
 
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getOptionsData } from '@/api/option'

export default defineComponent({
    name: '',
    setup() {
        const backup_path = ref('')
        const auto_backup = ref(0)

        // 请求初始数据
        ;(async () => {
            const res = await getOptionsData()
            if (res && res.ok) {
                backup_path.value = res.data.backup_path
                auto_backup.value = res.data.auto_backup
            }
        })()

        const resetBackupPath = () => {
            console.log('重设')
        }
        return { backup_path, auto_backup, resetBackupPath }
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