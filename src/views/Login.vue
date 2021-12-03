<!--
 * @Description: 登录页
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-24 10:42:53
 * @LastEditTime: 2021-12-03 15:16:51
-->
<template>
    <div class="login">
        <!-- 波浪背景 -->
        <WaveWrapper />
        <!-- 关闭按钮 -->
        <CloseWinBtn left="20px" top="15px" />
        <!-- 最小化 -->
        <MinWinBtn right="20px" top="15px" />
        <!-- logo -->
        <div class="cont">
            <img src="../assets/imgs/logo.svg">
            <h2>Account Store</h2>
        </div>
        <div class="form">
            <template v-if="step1">
                <el-divider class="login-divider">设置加密私钥</el-divider>
                <el-form size="medium">
                    <el-form-item class="skey-form-item">
                        <el-input v-model="skey" placeholder="请输入数据加密私钥"></el-input>
                        <el-button type="text" class="create-skey-btn" @click="createSkey">生成
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <div class="tips">
                            一台电脑只允许设置一次私钥，请备份好私钥<br />备份数据需要提供正确的私钥才能恢复成功
                        </div>
                    </el-form-item>
                    <el-form-item class="btn-go">
                        <el-button type="primary" round @click="toNextStep">下一步</el-button>
                    </el-form-item>
                </el-form>
            </template>
            <template v-else>
                <el-divider class="login-divider">{{isReg?"请设置验证信息":'Sign In'}}</el-divider>
                <el-form ref="formEl" :rules="rules" :model="loginData" size="medium">
                    <el-form-item prop="core_password">
                        <el-input type="password" v-model="loginData.core_password" clearable
                            :placeholder="`请${tipStr}总密码`"></el-input>
                    </el-form-item>
                    <el-form-item v-if="isReg" prop="resetPass">
                        <el-input type="password" v-model="loginData.resetPass" clearable
                            placeholder="请再次输入密码，确保两次输入一致"></el-input>
                    </el-form-item>
                    <el-form-item prop="verify_question">
                        <el-input v-model="loginData.verify_question" clearable :disabled="!isReg"
                            :placeholder="`请${tipStr}验证问题`"></el-input>
                    </el-form-item>
                    <el-form-item prop="verify_answer">
                        <el-input v-model="loginData.verify_answer" clearable
                            :placeholder="`请${tipStr}以上验证问题的答案`"></el-input>
                    </el-form-item>
                    <el-form-item class="btn-go">
                        <el-button type="primary" round @click="onSubmit">立即{{isReg?'提交':'进入'}}
                        </el-button>
                    </el-form-item>
                    <el-form-item v-if="!isReg" class="sub-btn">
                        <el-button type="text" @click="passReset">忘记密码</el-button>
                        <span style="color: #999;">/</span>
                        <el-button type="text" @click="softReset">软件重置</el-button>
                    </el-form-item>
                    <el-form-item v-if="isReg && hasStep1" class="sub-btn">
                        <el-button type="text" @click="step1 = true">上一步</el-button>
                    </el-form-item>
                </el-form>
            </template>
        </div>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref, Ref, nextTick, watch } from 'vue'
import WaveWrapper from '@/components/WaveWrapper.vue'
import CloseWinBtn from '@/components/CloseWinBtn.vue'
import MinWinBtn from '@/components/MinWinBtn.vue'
import { ElForm } from 'element-plus'
import { useStore } from 'vuex'
import {
    getLoginData,
    saveLoginData,
    doLogin,
    openMainWindow,
    haskey,
    addSkey,
    softWareReset,
} from '@/api/login'
import { openChildWindow, showMessageBoxSync, relaunch } from '@/api/win'

export default defineComponent({
    name: 'Login',
    components: {
        WaveWrapper,
        CloseWinBtn,
        MinWinBtn,
    },
    setup() {
        // 改标题
        document.title = '密码验证'
        // 使用store
        const store = useStore()
        // 是否需要设置加密私钥（第一步）
        const step1: Ref = ref(false)
        // 是否存在密钥
        const hasStep1: Ref = ref(false)
        // 私钥
        const skey: Ref = ref('')
        // 是否为设置阶段
        const isReg: Ref = ref(false)
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

        // 查询是否已有密钥
        ;(async () => {
            const res = await haskey()
            if (res && !res.data) {
                step1.value = true
                hasStep1.value = true
            }
        })()

        // 生成skey
        const createSkey = () => {
            skey.value = parseInt((Math.random() * Date.now()).toString()).toString(36)
        }

        // 下一步
        const toNextStep = async () => {
            if (skey.value.trim() == '') {
                window.sys.win('showErrorBox', {
                    title: '错误信息',
                    msg: '密钥不能为空',
                })
                return
            }
            step1.value = false
        }

        // 查询是否已有登录数据
        ;(async () => {
            const {
                ok,
                data: { id, verify_question },
            } = await getLoginData()

            // 有登录数据
            if (ok === 1 && id) {
                loginData.id = id
                loginData.verify_question = verify_question
            } else {
                isReg.value = true
            }

            nextTick(() => {
                // 清除数据更新导致自动触发的表单验证
                formEl.value && formEl.value.clearValidate()
                // 显示界面，展示滑入动画
                store.dispatch('showSlideInAnimate')
            })
        })()

        // 计算属性
        const tipStr = computed(() => (isReg.value ? '设置' : '输入'))

        // 规则
        const rules = computed(() => ({
            core_password: [
                {
                    required: true,
                    message: `请${tipStr.value}总密码`,
                    trigger: 'blur',
                },
            ],
            resetPass: [
                {
                    validator: (_: any, value: string, callback: any) => {
                        if (!isReg.value) {
                            callback()
                            return
                        }
                        if (!value || value === '') {
                            callback(new Error(`请再次${tipStr.value}密码`))
                        } else if (value !== loginData.core_password) {
                            callback(new Error(`两次${tipStr.value}的密码不一致`))
                        } else {
                            callback()
                        }
                    },
                    trigger: 'blur',
                },
            ],
            verify_question: [
                {
                    required: true,
                    message: `请${tipStr.value}验证问题`,
                    trigger: 'blur',
                },
            ],
            verify_answer: [
                {
                    required: true,
                    message: `请${tipStr.value}答案`,
                    trigger: 'blur',
                },
            ],
        }))

        // 登陆、提交按钮
        const onSubmit = () => {
            ;(formEl.value as typeof ElForm).validate(async (valid: any) => {
                if (valid) {
                    // 保存登陆数据
                    let { id, core_password, verify_question, verify_answer } = loginData

                    if (isReg.value) {
                        // 保存密钥
                        if (skey.value.trim() !== '') {
                            const res = await addSkey(skey.value)
                            if (!res || !res.ok) {
                                return
                            }
                        }

                        const { ok, data } = await saveLoginData({
                            core_password,
                            verify_question,
                            verify_answer,
                        })

                        if (ok === 1) {
                            window.toast('提交成功')
                            isReg.value = false
                            loginData.id = data.id
                            loginData.verify_question = data.verify_question
                        }
                    } else {
                        // 登陆验证
                        const res = await doLogin({ id, core_password, verify_answer })

                        if (res && res.ok === 1) {
                            sessionStorage.setItem('token', res.data.token)
                            window.toast('验证成功')
                            openMainWindow()
                        }
                    }
                } else {
                    return false
                }
            })
        }

        // 密码重设
        const passReset = async () => {
            const confirmRes = await showMessageBoxSync({
                title: '提示',
                msg: '确认要重设密码？\n若数据库中已有账户数据，\n需要先验证随机1-2条账户的账号密码，\n验证成功方可重设。',
            })
            if (confirmRes === 0) {
                const { origin, pathname } = location
                openChildWindow(
                    {
                        wid: 'passReset',
                        url: `${origin + pathname}#/reset?from=login`,
                        width: 280,
                        height: 320,
                        title: '重设密码',
                    },
                    async ({ msg }) => {
                        // 接收消息
                        if (msg == 'resetSuccess') {
                            // 重设成功，刷新页面
                            const {
                                ok,
                                data: { id, verify_question },
                            } = await getLoginData()

                            // 有登录数据
                            if (ok === 1 && verify_question) {
                                loginData.id = id
                                loginData.verify_question = verify_question
                                loginData.core_password = ''
                                loginData.verify_answer = ''
                            }

                            // 提示
                            window.toast('重设成功')
                        }
                    }
                )
            }
        }

        // 软件重置
        const softReset = async () => {
            const confirmRes = await showMessageBoxSync({
                title: '提示',
                msg: '若程序发生未知错误无法登录或无法重设密码，\n或忘记加密私钥导致恢复备份数据后出错，需重置。',
                btns: ['取消', '确认重置'],
            })
            if (confirmRes === 1) {
                const sureConfirm = await showMessageBoxSync({
                    title: '确认重置',
                    msg: '重置后数据将会清空，确认重置？',
                    type: 'warning',
                })
                if (sureConfirm === 0) {
                    const ResetRes = await softWareReset()
                    if (ResetRes && ResetRes.ok) {
                        window.toast('软件重置成功')
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

        // 暴露数据
        return {
            step1,
            hasStep1,
            skey,
            toNextStep,
            createSkey,
            isReg,
            formEl,
            loginData,
            tipStr,
            rules,
            onSubmit,
            passReset,
            softReset,
        }
    },
})
</script>
<style scoped lang="scss">
.login {
    .cont {
        z-index: 99;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        h2 {
            color: #fff;
            margin: 5px 0 0 0;
            font-size: 22px;
        }
    }
    .form {
        padding: 1px 35px 35px 35px;
        background: #fff;
        &:deep(.el-input),
        &:deep(.el-button) {
            -webkit-app-region: no-drag;
        }
        .tips {
            font-size: 12px;
            color: #ccc;
            line-height: 2;
            text-align: center;
        }
        .login-divider {
            margin-bottom: 30px;
            &:deep(.el-divider__text) {
                color: #bcc0c7;
            }
        }
        .btn-go {
            margin-top: 35px;
            margin-bottom: 0;
            text-align: center;
            .el-button {
                padding: 12px 70px;
                transition: 0.5s;
                &:hover {
                    opacity: 0.6;
                }
            }
        }
        .sub-btn {
            text-align: center;
            margin-bottom: 0;
            height: 26px;
            .el-button--text {
                color: #999;
                font-size: 12px;
                &:hover {
                    color: #854cff;
                }
            }
        }
        .skey-form-item {
            .create-skey-btn {
                position: absolute;
                right: 15px;
                top: 0;
                color: #999;
                display: none;
            }
            &:hover .create-skey-btn {
                display: inline-block;
            }
        }
    }
}
</style>