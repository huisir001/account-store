<!--
 * @Description: 重设总密码
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-19 18:25:22
 * @LastEditTime: 2021-06-19 21:53:02
-->
<template>
    <div class="reset">
        <template v-if="step1">
            <el-form size="small">
                <h2 class="label">请输入 的账号密码</h2>
                <el-form-item class="skey-form-item">
                    <el-input v-model="skey" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item class="skey-form-item">
                    <el-input v-model="skey" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <h2 class="label">请输入 的账号密码</h2>
                <el-form-item class="skey-form-item">
                    <el-input v-model="skey" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item class="skey-form-item">
                    <el-input v-model="skey" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item class="btn-go">
                    <el-button type="default" @click="toNextStep">下一步</el-button>
                </el-form-item>
            </el-form>
        </template>
        <template v-else>
            <el-form ref="formEl" :rules="rules" :model="loginData" size="small">
                <el-form-item v-if="from=='home'" prop="core_password">
                    <el-input type="password" v-model="loginData.core_password" clearable
                        :placeholder="`请输入旧密码`"></el-input>
                </el-form-item>
                <el-form-item prop="core_password">
                    <el-input type="password" v-model="loginData.core_password" clearable
                        :placeholder="`请设置新密码`"></el-input>
                </el-form-item>
                <el-form-item prop="resetPass">
                    <el-input type="password" v-model="loginData.resetPass" clearable
                        placeholder="请再次输入密码，确保两次输入一致"></el-input>
                </el-form-item>
                <el-form-item prop="verify_question">
                    <el-input v-model="loginData.verify_question" clearable :disabled="!isReg"
                        :placeholder="`请设置验证问题`"></el-input>
                </el-form-item>
                <el-form-item prop="verify_answer">
                    <el-input v-model="loginData.verify_answer" clearable
                        :placeholder="`请输入以上验证问题的答案`">
                    </el-input>
                </el-form-item>
                <el-form-item class="btn-go">
                    <el-button type="primary" round @click="onSubmit">立即提交</el-button>
                </el-form-item>
            </el-form>
        </template>
    </div>
</template>
 
<script lang="ts">
import { defineComponent, reactive, ref, Ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
    name: 'Reset',
    setup() {
        // 取消隐藏动画
        useStore().dispatch('showApp')
        // 获取参数
        const { from } = useRoute().query
        // 是否第一步
        const step1: Ref = ref(from == 'login')
        // form表单元素
        const formEl: Ref = ref(null)
        // 登录数据
        const loginData = reactive({
            id: '',
            core_password: '',
            resetPass: '',
            verify_question: '',
            verify_answer: '',
        })
        return { from, step1, formEl, loginData }
    },
})
</script>
 
<style scoped lang="scss">
.reset {
    &:deep(.el-input__inner) {
        border-radius: 0 !important;
    }
    h2.label {
        color: #000;
        font-size: 14px;
        margin: 0 0 9px;
        font-weight: 500;
    }
    .el-form-item--small.el-form-item {
        margin-bottom: 10px;
    }
    .btn-go {
        position: fixed;
        bottom: 0;
        width: 100%;
        text-align: center;
        background: #f5f5f5;
        margin: 0 -10px;
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