<!--
 * @Description: 登录页
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-24 10:42:53
 * @LastEditTime: 2021-06-03 22:51:24
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
        <i class="el-icon-close close-icon"></i>
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
            <el-form ref="form"
                     :rules="rules"
                     :model="loginData">
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
import { computed, defineComponent, reactive, ref, Ref } from 'vue'
import { ElForm } from 'element-plus'
import Api from '@/api'

export default defineComponent({
    name: 'Login',
    setup() {
        // 是否为设置阶段
        const isReg: Ref = ref(true)
        // 验证问题
        const loginId: Ref = ref('')
        // 可选状态
        const disabledBtn: Ref = ref(false)
        // 登录数据
        const loginData = reactive({
            core_password: '',
            resetPass: '',
            verify_question: '',
            verify_answer: '',
        })

        // 计算属性
        const tipStr = computed(() => (isReg ? '设置' : '输入'))

        // 规则
        const rules = computed(() => ({
            core_password: [
                {
                    required: true,
                    message: `请${tipStr.value}主密码`,
                    trigger: 'blur',
                },
            ],
            resetPass: [
                {
                    validator: (_: any, value: string, callback: any) => {
                        console.log('resetPass', value)

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

        // 查询是否已有登录数据
        const getLoginData = async () => {
            const { id } = await Api('getLoginData')

            // 有登录数据
            if (id) {
                loginId.value = id
                isReg.value = false
            }
        }

        return {
            isReg,
            loginId,
            loginData,
            tipStr,
            rules,
            getLoginData,
            disabledBtn,
        }
    },
    created() {
        this.getLoginData()
    },
    methods: {
        onSubmit() {
            this.disabledBtn = true
            ;(this.$refs.form as typeof ElForm).validate((valid: any) => {
                if (valid) {
                    this.disabledBtn = false
                    alert('submit!')
                } else {
                    this.disabledBtn = false
                    console.log('error submit!!')
                    return false
                }
            })
        },
    },
})
</script>
<style scoped lang="scss">
.login {
    i.close-icon {
        position: absolute;
        z-index: 999;
        color: #fff;
        left: 0;
        top: 0;
        font-size: 24px;
        padding: 15px;
    }
    .cont {
        z-index: 99;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 220px;
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
        margin-top: -240px;
        padding: 0 36px;
        .login-divider {
            margin-bottom: 30px;
            &:deep(.el-divider__text) {
                color: #bcc0c7;
            }
        }
        .btn-go {
            margin-top: 35px;
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
        height: 500px;
        width: 100%;
        transform: scaleY(0.5);
        transform-origin: top;
    }
    .waveWrapperInner {
        position: absolute;
        width: 100%;
        overflow: hidden;
        height: 100%;
        bottom: -1px;
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
        background-size: 50% 100px;
        background-image: url('../assets/imgs/wave-top.png');
    }
    .waveAnimation .waveTop {
        animation: move-wave 3s;
        -webkit-animation: move-wave 3s;
        -webkit-animation-delay: 1s;
        animation-delay: 1s;
    }
    .waveMiddle {
        background-size: 50% 120px;
        background-image: url('../assets/imgs/wave-mid.png');
    }
    .waveAnimation .waveMiddle {
        animation: move_wave 10s linear infinite;
    }
    .waveBottom {
        background-size: 50% 100px;
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

