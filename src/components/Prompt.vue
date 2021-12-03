<!--
 * @Description: 输入对话框，使用openChildWindow子窗口
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-12-03 17:38:49
 * @LastEditTime: 2021-12-03 18:09:36
-->
<template>
    <el-form ref="formEl" label-position="top" size="mini">
        <el-form-item :label="label">
            <el-input v-model="inputText" :placeholder="placeholder" clearable />
        </el-form-item>
        <el-form-item>
            <el-button type="default" @click="onSubmit">
                确定
            </el-button>
            <el-button type="default" @click="close">
                取消
            </el-button>
        </el-form-item>
    </el-form>
</template>
 
<script lang="ts">
import { postChildMsg } from '@/api/win'
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
    name: 'Prompt',
    setup() {
        // 获取参数
        const $route = useRoute()
        // label:提示信息，defaultText：默認值
        const { label, defaultText, placeholder } = $route.query
        const inputText = ref(defaultText || '')

        // 确定
        const onSubmit = async () => {
            // 给父窗口传消息
            const res = await postChildMsg({ msg: 'sure', data: { value: inputText.value } })
            if (res && res.ok === 1) {
                window.close()
            }
        }

        return {
            inputText,
            label,
            placeholder,
            onSubmit,
            close: () => window.close(),
        }
    },
})
</script>
 
<style scoped lang="scss">
</style>