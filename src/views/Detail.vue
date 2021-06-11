<!--
 * @Description: 账户详情页
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-10 21:31:24
 * @LastEditTime: 2021-06-11 19:04:39
-->
<template>
    <el-descriptions direction="vertical" :column="2" size="medium" border>
        <!-- <template #extra>
      <el-button type="primary" size="small">操作</el-button>
    </template> -->
        <el-descriptions-item>
            <template #label>
                <i class="el-icon-user"></i>
                账号
            </template>
            {{account}}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <i class="el-icon-mouse"></i>
                密码
            </template>
            {{password}}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <i class="el-icon-message"></i>
                绑定邮箱
            </template>
            {{email}}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <i class="el-icon-mobile-phone"></i>
                绑定手机
            </template>
            {{phone}}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <i class="el-icon-date"></i>
                创建时间
            </template>
            {{create_time}}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <i class="el-icon-date"></i>
                更新时间
            </template>
            {{update_time}}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <i class="el-icon-tickets"></i>
                备注
            </template>
            {{remark}}
        </el-descriptions-item>
    </el-descriptions>
</template>
 
<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import useAccountInfoScript from '@/hooks/useAccountInfoScript'

export default defineComponent({
    name: 'Detail',
    setup() {
        let { formdata, close } = useAccountInfoScript()
        return { ...toRefs(formdata), close }
    },
})
</script>
 
<style scoped lang="scss">
</style>