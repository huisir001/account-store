<!--
 * @Description: 重设总密码
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-19 18:25:22
 * @LastEditTime: 2021-06-20 18:01:17
-->
<template>
    <div class="reset">
        <template v-if="step1">
            <el-form size="mini" :model="accountTestData">
                <div v-for="item in accountTestData" :key="item.id">
                    <el-form-item class="skey-form-item" :label="`请输入${item.name}的账号`">
                        <el-input v-model="item.account" clearable placeholder="请输入账号"></el-input>
                    </el-form-item>
                    <el-form-item class="skey-form-item" :label="`请输入${item.name}的密码`">
                        <el-input v-model="item.password" type="password" clearable
                            placeholder="请输入密码">
                        </el-input>
                    </el-form-item>
                </div>
                <el-form-item class="btn-go">
                    <el-button type="default" @click="toNextStep">下一步</el-button>
                </el-form-item>
            </el-form>
        </template>
        <template v-else>
            <el-form ref="formEl" :model="loginData" size="mini">
                <el-form-item v-if="from=='home'" label="请输入旧密码">
                    <el-input type="password" v-model="loginData.old_password" clearable />
                </el-form-item>
                <el-form-item label="请设置新密码">
                    <el-input type="password" v-model="loginData.core_password" clearable />
                </el-form-item>
                <el-form-item label="请再次输入新密码">
                    <el-input type="password" v-model="loginData.resetPass" clearable />
                </el-form-item>
                <el-form-item label="请设置验证问题">
                    <el-input v-model="loginData.verify_question" clearable />
                </el-form-item>
                <el-form-item label="请设置验证问题的答案">
                    <el-input v-model="loginData.verify_answer" clearable />
                </el-form-item>
                <el-form-item class="btn-go">
                    <el-button type="default" @click="onSubmit">立即提交</el-button>
                </el-form-item>
            </el-form>
        </template>
    </div>
</template>
 
<script lang="ts">
import { defineComponent, reactive, ref, Ref, toRaw } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { getAccountListRan, checkAccounts } from '@/api/account'
import { resetLoginData } from '@/api/login'
import { postChildMsg, showMessageBoxSync } from '@/api/win'

interface IaccountTestData {
    id: string
    name: string
    account: string
    password: string
}

export default defineComponent({
    name: 'Reset',
    setup() {
        // 取消隐藏动画
        useStore().dispatch('showApp')
        // 获取参数
        const { from, token: queryToken } = useRoute().query
        // 是否第一步
        const step1: Ref = ref(from == 'login')
        // form表单元素
        const formEl: Ref = ref(null)
        // 账号验证表单数据
        const accountTestData: Ref<IaccountTestData[]> = ref([])

        // 缓存token
        if (from === 'home') {
            sessionStorage.setItem('token', queryToken as string)
        }

        // 登录数据
        const loginData = reactive({
            ...(from == 'home' ? { old_password: '' } : {}),
            core_password: '',
            resetPass: '',
            verify_question: '',
            verify_answer: '',
        })

        // 随机查询2条账户数据
        ;(async () => {
            const accs = await getAccountListRan()
            if (accs && accs.ok && accs.data.length > 0) {
                accountTestData.value = accs.data.map((item: any) => {
                    return {
                        account: '',
                        password: '',
                        ...item,
                    }
                })
            } else {
                step1.value = false
            }
        })()

        // 下一步
        const toNextStep = async () => {
            for (let index = 0; index < accountTestData.value.length; index++) {
                const { account, password } = accountTestData.value[index]
                if (account.trim() == '' || password.trim() == '') {
                    window.sys.win('showErrorBox', {
                        title: '错误信息',
                        msg: '存在未填项，请检查',
                    })
                    return
                }
            }
            // 检查账号密码，检查无误会返回一个token以便下一步重置密码时使用（这里是为了更高的前端安全性）
            const check = await checkAccounts(JSON.stringify(accountTestData.value))
            if (check && check.ok && check.data.token) {
                // 缓存token
                sessionStorage.setItem('token', check.data.token)
                // 校验成功
                step1.value = false
            } else {
                window.sys.win('showErrorBox', {
                    title: '错误信息',
                    msg: '填写的账号或密码有误！',
                })
            }
        }

        // 执行重设
        const onSubmit = async () => {
            let resetParams: Index = toRaw(loginData)

            for (const key in resetParams) {
                if (resetParams[key].trim() === '') {
                    window.sys.win('showErrorBox', {
                        title: '错误信息',
                        msg: '存在未填项，请检查',
                    })
                    return
                }
            }

            if (from == 'home' && resetParams.old_password == resetParams.core_password) {
                window.sys.win('showErrorBox', {
                    title: '错误信息',
                    msg: '新密码不能与旧密码相同',
                })
                return
            }

            if (resetParams.core_password !== resetParams.resetPass) {
                window.sys.win('showErrorBox', {
                    title: '错误信息',
                    msg: '两次输入的密码不一致',
                })
                return
            }

            const resetRes = await resetLoginData({
                ...(from == 'home' ? { old_password: resetParams.old_password } : {}),
                core_password: resetParams.core_password,
                verify_question: resetParams.verify_question,
                verify_answer: resetParams.verify_answer,
                token: sessionStorage.getItem('token')!,
            })

            if (resetRes && resetRes.ok) {
                if (from === 'login') {
                    // 保存成功给父窗口传消息
                    const res = await postChildMsg({ msg: 'resetSuccess' })
                    if (res && res.ok === 1) {
                        window.close()
                    }
                } else {
                    // 重设成功，跳回登陆
                    await showMessageBoxSync({
                        title: '提示',
                        msg: '重设成功，请重新登陆',
                        btns: ['ok'],
                    })
                    window.sys.do('openLoginWindow')
                }
            }
        }

        return { from, step1, formEl, accountTestData, loginData, toNextStep, onSubmit }
    },
})
</script>
 
<style scoped lang="scss">
.reset {
    padding: 0 10px;
    &:deep(.el-input__inner) {
        border-radius: 0 !important;
    }
    .el-form-item {
        margin-bottom: 2px;
        &:deep(.el-form-item__label) {
            color: #333;
            font-size: 12px;
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