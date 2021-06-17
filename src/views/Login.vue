<!--
 * @Description: 登录页
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-24 10:42:53
 * @LastEditTime: 2021-06-18 00:38:18
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
            <h2>账号仓库</h2>
        </div>
        <div class="form">
            <template v-if="step1">
                <el-divider class="login-divider">设置数据加密私钥</el-divider>
                <el-form size="medium">
                    <el-form-item class="skey-form-item">
                        <el-input v-model="skey" placeholder="请输入数据加密私钥"></el-input>
                        <el-button type="text" class="create-skey-btn" @click="createSkey">生成
                        </el-button>
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
                        <el-button type="primary" round :disabled="disabledBtn" @click="onSubmit">
                            立即{{isReg?'提交':'进入'}}</el-button>
                    </el-form-item>
                </el-form>
            </template>
        </div>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref, Ref, nextTick } from 'vue'
import WaveWrapper from '@/components/WaveWrapper.vue'
import CloseWinBtn from '@/components/CloseWinBtn.vue'
import MinWinBtn from '@/components/MinWinBtn.vue'
import { ElForm } from 'element-plus'
import { useStore } from 'vuex'
import { getLoginData, saveLoginData, doLogin, openMainWindow } from '@/api/login'

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
        const skey: Ref = ref('')
        // 是否为设置阶段
        const isReg: Ref = ref(false)
        // 可选状态
        let disabledBtn: Ref = ref(false)
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

        // 生成skey
        const createSkey = () => {
            skey.value = parseInt((Math.random() * Date.now()).toString()).toString(16)
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
                formEl.value.clearValidate()
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
            disabledBtn.value = true
            ;(formEl.value as typeof ElForm).validate(async (valid: any) => {
                if (valid) {
                    // 保存登陆数据
                    let { id, core_password, verify_question, verify_answer } = loginData

                    if (isReg.value) {
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

                    disabledBtn.value = false
                } else {
                    disabledBtn.value = false
                    return false
                }
            })
        }

        // 暴露数据
        return {
            step1,
            skey,
            createSkey,
            isReg,
            formEl,
            loginData,
            tipStr,
            rules,
            disabledBtn,
            onSubmit,
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
            font-size: 20px;
        }
    }
    .form {
        padding: 1px 35px 35px 35px;
        background: #fff;
        &:deep(.el-input),
        &:deep(.el-button) {
            -webkit-app-region: no-drag;
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
                padding: 12px 50px;
                transition: 0.5s;
                &:hover {
                    opacity: 0.6;
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