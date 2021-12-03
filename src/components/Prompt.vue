<!--
 * @Description: 输入对话框，使用openChildWindow子窗口
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-12-03 17:38:49
 * @LastEditTime: 2021-12-04 00:09:13
-->
<template>
    <div class="prompt">
        <el-form label-position="top" size="mini">
            <el-form-item :label="label">
                <el-input v-model="inputText" :placeholder="placeholder" clearable />
            </el-form-item>
            <el-form-item class="btn-go">
                <el-button type="default" @click="onSubmit">
                    确定
                </el-button>
                <el-button type="default" @click="close">
                    取消
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
 
<script lang="ts">
import { postChildMsg, showErrorBox } from '@/api/win'
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
    name: 'Prompt',
    setup() {
        // 取消隐藏动画
        useStore().dispatch('showApp')
        // 获取参数
        const $route = useRoute()
        // label:提示信息，defaultText：默認值
        const { label, defaultText, placeholder } = $route.query
        const inputText = ref(defaultText || '')

        // 确定
        const onSubmit = async () => {
            if (inputText.value === '') {
                showErrorBox({ title: '错误', msg: '私钥不能为空！' })
                return
            }

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
.prompt {
    padding: 0 10px;
    &:deep(.el-input__inner) {
        border-radius: 0 !important;
    }
    .el-form-item {
        margin-bottom: 2px;
        &:deep(.el-form-item__label) {
            color: #333;
            font-size: 12px;
            padding-bottom: 5px;
        }
    }
    .btn-go {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        text-align: center;
        background: #f5f5f5;
        margin-bottom: 0 !important;
        padding: 10px;
        border-top: 1px solid #eee;

        &:deep(.el-form-item__content) {
            line-height: 1;
        }

        .el-button {
            padding: 0 20px;
            background-color: #eae9e9;
            border: 1px solid #d4d4d4;
            border-radius: 0;
            color: #000;
            min-height: 24px;
            font-size: 12px;
            &:hover,
            &:focus {
                color: #2f2f2f;
                border-color: #5589ff;
                background: #83a9ff29;
            }
        }
    }
}
</style>