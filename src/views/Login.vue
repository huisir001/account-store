<!--
 * @Description: 登录页
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-24 10:42:53
 * @LastEditTime: 2021-06-06 16:23:31
-->
<template>
    <div class="login">
        <!-- 波浪背景 -->
        <div class="waveWrapper waveAnimation">
            <div class="waveWrapperInner bgTop">
                <div class="wave waveTop"></div>
            </div>
            <div class="waveWrapperInner bgMiddle">
                <div class="wave waveMiddle"></div>
            </div>
            <div class="waveWrapperInner bgBottom">
                <div class="wave waveBottom"></div>
            </div>
        </div>
        <!-- 关闭按钮 -->
        <svg t="1622891709537"
             @click="Api('winClose')"
             class="icon close-icon"
             viewBox="0 0 1024 1024"
             version="1.1"
             xmlns="http://www.w3.org/2000/svg"
             p-id="34945"
             width="20"
             height="20">
            <path d="M832.8704 846.2848c-2.6112 0-5.2224-1.024-7.2192-3.0208L183.9104 201.5232c-3.9936-3.9936-3.9936-10.496 0-14.4896 3.9936-3.9936 10.496-3.9936 14.4896 0l641.7408 641.7408c3.9936 3.9936 3.9936 10.496 0 14.4896-2.048 1.9968-4.6592 3.0208-7.2704 3.0208z"
                  p-id="34946"
                  fill="#ffffff"></path>
            <path d="M191.1296 846.2848a10.26048 10.26048 0 0 1-7.2192-17.5104L825.6 187.0848c3.9936-3.9936 10.496-3.9936 14.4896 0 3.9936 3.9936 3.9936 10.496 0 14.4896L198.3488 843.264c-1.9968 1.9968-4.608 3.0208-7.2192 3.0208z"
                  p-id="34947"
                  fill="#ffffff"></path>
        </svg>
        <!-- 最小化 -->
        <svg t="1622900690444"
             @click="minIconNoHover=true;Api('winMinimize')"
             @mouseenter="bindMinIconMouseenter"
             :class="{
                 'icon':true,
                  'mini-icon':true,
                  'no-hover':minIconNoHover
             }"
             viewBox="0 0 1024 1024"
             version="1.1"
             xmlns="http://www.w3.org/2000/svg"
             p-id="7843"
             width="20"
             height="20">
            <path d="M98.23 451.003l829.685-1.992 0.154 64-829.685 1.992z"
                  fill="#ffffff"
                  p-id="7844"></path>
        </svg>
        <!-- logo -->
        <div class="cont">
            <svg t="1622690592734"
                 class="logo"
                 viewBox="0 0 1025 1024"
                 version="1.1"
                 xmlns="http://www.w3.org/2000/svg"
                 p-id="637"
                 width="80"
                 height="80">
                <path d="M792.754707 634.735874m-126.909755 0a126.909755 126.909755 0 1 0 253.81951 0 126.909755 126.909755 0 1 0-253.81951 0Z"
                      p-id="638"
                      fill="#ffffff"></path>
                <path d="M879.778539 792.829168h-16.679568a168.971273 168.971273 0 0 1-145.039719 0h-14.503972a132.711343 132.711343 0 0 0-132.711344 132.711344v42.061518a50.038703 50.038703 0 0 0 47.863108 47.863108h350.270922a49.313505 49.313505 0 0 0 47.863108-47.863108v-42.061518a134.886939 134.886939 0 0 0-137.062535-132.711344zM135.724778 435.30626l277.025864 145.039719a79.046647 79.046647 0 0 1 45.687512 72.51986v290.079439a91.375023 91.375023 0 0 1-136.337337 68.893867l-276.300665-145.03972A78.321449 78.321449 0 0 1 0.11264 791.378771v-290.079439A91.375023 91.375023 0 0 1 135.724778 435.30626zM552.713971 12.515477l280.651858 163.894883a91.375023 91.375023 0 0 1 0 156.642897L552.713971 496.948141a87.023832 87.023832 0 0 1-89.924626 0L182.137488 333.053257a91.375023 91.375023 0 0 1 0-156.642897L462.789345 12.515477a87.023832 87.023832 0 0 1 89.924626 0z"
                      p-id="639"
                      fill="#ffffff"></path>
            </svg>
            <h2>账号仓库</h2>
        </div>
        <div class="form">
            <el-divider class="login-divider">{{isReg?"请设置验证信息":'Sign In'}}</el-divider>
            <el-form ref="formEl"
                     :rules="rules"
                     :model="loginData"
                     size="medium">
                <el-form-item prop="core_password">
                    <el-input type="password"
                              v-model="loginData.core_password"
                              clearable
                              :placeholder="`请${tipStr}总密码`"></el-input>
                </el-form-item>
                <el-form-item v-if="isReg"
                              prop="resetPass">
                    <el-input type="password"
                              v-model="loginData.resetPass"
                              clearable
                              placeholder="请再次输入密码，确保两次输入一致"></el-input>
                </el-form-item>
                <el-form-item prop="verify_question">
                    <el-input v-model="loginData.verify_question"
                              clearable
                              :disabled="!isReg"
                              :placeholder="`请${tipStr}验证问题`"></el-input>
                </el-form-item>
                <el-form-item prop="verify_answer">
                    <el-input v-model="loginData.verify_answer"
                              clearable
                              :placeholder="`请${tipStr}以上验证问题的答案`"></el-input>
                </el-form-item>
                <el-form-item class="btn-go">
                    <el-button type="primary"
                               round
                               :disabled="disabledBtn"
                               @click="onSubmit">立即{{isReg?'提交':'进入'}}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref, Ref, nextTick } from 'vue'
import { ElForm } from 'element-plus'
import { useStore } from 'vuex'
import Api from '@/api'

declare const window: Window & { toast: any }

export default defineComponent({
    name: 'Login',
    setup() {
        // 使用store
        const store = useStore()
        // 是否为设置阶段
        const isReg: Ref = ref(false)
        // 可选状态
        let disabledBtn: Ref = ref(false)
        // form表单元素
        const formEl: Ref = ref(null)
        // 按钮hover移除
        const minIconNoHover: Ref = ref(false)
        // 登录数据
        const loginData = reactive({
            id: '',
            core_password: '',
            resetPass: '',
            verify_question: '',
            verify_answer: '',
        })

        // 查询是否已有登录数据
        ;(async () => {
            const {
                ok,
                data: { id, verify_question },
            } = await Api('getLoginData')

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
                            callback(
                                new Error(`两次${tipStr.value}的密码不一致`)
                            )
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
                    let { id, core_password, verify_question, verify_answer } =
                        loginData

                    if (isReg.value) {
                        const { ok, data } = await Api('saveLoginData', {
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
                        const res = await Api('doLogin', {
                            id,
                            core_password,
                            verify_answer,
                        })
                        if (res && res.ok === 1) {
                            sessionStorage.setItem('token', res.data.token)
                            window.toast('验证成功')
                            Api('openMainWindow')
                        }
                    }

                    disabledBtn.value = false
                } else {
                    disabledBtn.value = false
                    return false
                }
            })
        }

        // 窗口icon鼠标移入显示hover
        const bindMinIconMouseenter = () => {
            if (minIconNoHover.value) {
                minIconNoHover.value = false
            }
        }

        // 暴露数据
        return {
            isReg,
            formEl,
            loginData,
            tipStr,
            rules,
            disabledBtn,
            minIconNoHover,
            bindMinIconMouseenter,
            onSubmit,
            Api,
        }
    },
})
</script>
<style scoped lang="scss">
.login {
    $iconMargin: 20px;
    .icon {
        position: absolute;
        z-index: 99999;
        top: 15px;
        cursor: pointer;
        -webkit-app-region: no-drag;
        &:hover {
            background: rgba(255, 255, 255, 0.1);
        }
    }
    .close-icon {
        left: $iconMargin;
    }
    .mini-icon {
        right: $iconMargin;
        path {
            transform-origin: center;
            transform: scaleY(0.8) scaleX(0.9);
            opacity: 0.7;
        }
        &.no-hover {
            background: none !important;
        }
    }
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
    }
    .waveWrapper {
        overflow: hidden;
        height: 235px;
        width: 100%;
        position: relative;
    }
    .waveWrapperInner {
        position: absolute;
        width: 100%;
        overflow: hidden;
        height: 100%;
        top: 0;
        background-image: linear-gradient(to top, #854cff 20%, #663bc1 80%);
    }
    .bgTop {
        z-index: 15;
        opacity: 0.5;
    }
    .bgMiddle {
        z-index: 10;
        opacity: 0.75;
    }
    .bgBottom {
        z-index: 5;
    }
    .wave {
        position: absolute;
        left: 0;
        width: 200%;
        height: 100%;
        background-repeat: repeat no-repeat;
        background-position: 0 bottom;
        transform-origin: center bottom;
    }
    .waveTop {
        background-size: 50% 40px;
        background-image: url('../assets/imgs/wave-top.png');
    }
    .waveAnimation .waveTop {
        animation: move-wave 3s;
        -webkit-animation: move-wave 3s;
        -webkit-animation-delay: 1s;
        animation-delay: 1s;
    }
    .waveMiddle {
        background-size: 50% 50px;
        background-image: url('../assets/imgs/wave-mid.png');
    }
    .waveAnimation .waveMiddle {
        animation: move_wave 10s linear infinite;
    }
    .waveBottom {
        background-size: 50% 40px;
        background-image: url('../assets/imgs/wave-bot.png');
    }
    .waveAnimation .waveBottom {
        animation: move_wave 15s linear infinite;
    }
}
@keyframes move_wave {
    0% {
        transform: translateX(0) translateZ(0) scaleY(1);
    }
    50% {
        transform: translateX(-25%) translateZ(0) scaleY(0.55);
    }
    100% {
        transform: translateX(-50%) translateZ(0) scaleY(1);
    }
}
</style>

