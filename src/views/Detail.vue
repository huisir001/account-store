<!--
 * @Description: 账户详情页
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-10 21:31:24
 * @LastEditTime: 2021-06-16 14:07:08
-->
<template>
    <el-descriptions class="detail" direction="vertical" :column="2" size="medium" border>
        <!-- <template #extra>
            <el-button type="primary" size="small">操作</el-button>
        </template> -->
        <el-descriptions-item>
            <template #label>
                <i class="el-icon-user"></i>
                账号
                <i class="el-icon-view show-val" @mousedown="showVal('account')"></i>
            </template>
            {{hidePassStrs.account}}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <i class="el-icon-mouse"></i>
                密码
                <i class="el-icon-view show-val" @mousedown="showVal('password')"></i>
            </template>
            {{hidePassStrs.password}}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <i class="el-icon-message"></i>
                绑定邮箱
                <i class="el-icon-view show-val" @mousedown="showVal('email')"></i>
            </template>
            {{hidePassStrs.email}}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <i class="el-icon-mobile-phone"></i>
                绑定手机
                <i class="el-icon-view show-val" @mousedown="showVal('phone')"></i>
            </template>
            {{hidePassStrs.phone}}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <i class="el-icon-date"></i>
                创建时间
            </template>
            {{hidePassStrs.create_time}}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <i class="el-icon-date"></i>
                更新时间
            </template>
            {{hidePassStrs.update_time}}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <i class="el-icon-tickets"></i>
                备注
            </template>
            {{hidePassStrs.remark||'暂无'}}
        </el-descriptions-item>
    </el-descriptions>
</template>
 
<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue'
import useAccountInfoScript from '@/hooks/useAccountInfoScript'

export default defineComponent({
    name: 'Detail',
    setup() {
        let { formdata, close } = useAccountInfoScript()

        const hideKeys = ['account', 'password', 'email', 'phone']

        let hidePassStrs: Index = reactive({})

        let flag = ref(false)
        watch(formdata, (n: any) => {
            if (!flag.value) {
                const keys = Object.keys(n)
                keys.map((key) => {
                    hidePassStrs[key] = hideKeys.includes(key)
                        ? '******************'
                        : (formdata as Index)[key]
                })
                flag.value = true
            }
        })

        const showVal = (key: string) => {
            hidePassStrs[key] =
                hidePassStrs[key] == '******************'
                    ? (formdata as Index)[key]
                    : '******************'
        }

        return { hidePassStrs, showVal, close }
    },
})
</script>
 
<style scoped lang="scss">
.detail {
    i.show-val {
        position: absolute;
        padding: 0 5px;
        line-height: 22px;
        right: 8px;
        cursor: pointer;
    }
    &:deep(.el-descriptions__label) {
        position: relative;
        width: 50%;
    }
}
</style>