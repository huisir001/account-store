<!--
 * @Description: 新增账户
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-08 13:57:11
 * @LastEditTime: 2021-06-20 10:47:59
-->
<template>
    <div :class="{formbox:true,edit:isEdit}">
        <el-form ref="formRef" :size="isEdit?'mini':'medium'" :rules="rules" :model="formdata"
            :label-width="isEdit?'46px':'50px'">
            <el-form-item label="名称" prop="name">
                <el-input v-model="formdata.name" placeholder="请输入账户名称，如网站名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="账号" prop="account">
                <el-input v-model="formdata.account" placeholder="请输入登录账号" clearable show-password>
                </el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="formdata.password" placeholder="请输入登录密码" clearable show-password>
                </el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="formdata.email" placeholder="请输入绑定邮箱" clearable show-password>
                </el-input>
            </el-form-item>
            <el-form-item label="手机" prop="phone">
                <el-input v-model="formdata.phone" placeholder="请输入绑定手机号码" clearable show-password>
                </el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="formdata.remark" placeholder="备注信息，如网址">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button :type="isEdit?'default':'primary'" @click="onSubmit">
                    {{isEdit?'保存':'立即新增'}}
                </el-button>
                <el-button v-if="isEdit" :type="isEdit?'default':'primary'" @click="close">
                    取消
                </el-button>
                <el-button v-if="!isEdit" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
 
<script lang="ts">
import { defineComponent, ref, toRaw } from 'vue'
import { saveAccount } from '@/api/account'
import { postChildMsg } from '@/api/win'
import useAccountInfoScript from '@/hooks/useAccountInfoScript'

export default defineComponent({
    name: 'CreateAccount',
    setup() {
        const formRef = ref(null)
        let { formdata, isEdit, close } = useAccountInfoScript()

        // 重置
        const reset = () => {
            ;(<any>formRef.value).resetFields()
        }

        // 表单验证
        const rules = {
            name: [
                {
                    required: true,
                    message: '请输入账户名称',
                    trigger: 'blur',
                },
            ],
            account: [
                {
                    required: true,
                    message: '请输入登录账号',
                    trigger: 'blur',
                },
            ],
            password: [
                {
                    required: true,
                    message: '请输入登录密码',
                    trigger: 'blur',
                },
            ],
            phone: [
                {
                    required: false,
                    validator: (_: any, value: string, callback: any) => {
                        if (value.trim() == '' || /^1[3|4|5|6|7|8|9][0-9]{9}$/.test(value)) {
                            callback()
                        } else {
                            callback(new Error('手机号格式错误'))
                        }
                    },
                    trigger: 'blur',
                },
            ],
            email: [
                {
                    required: false,
                    validator: (_: any, value: string, callback: any) => {
                        if (
                            value.trim() == '' ||
                            /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value)
                        ) {
                            callback()
                        } else {
                            callback(new Error('邮箱格式错误'))
                        }
                    },
                    trigger: 'blur',
                },
            ],
        }

        // 提交
        const onSubmit = () => {
            ;(<any>formRef.value).validate(async (valid: any) => {
                if (valid) {
                    // 保存数据
                    const res = await saveAccount(toRaw(formdata))
                    if (res && res.ok === 1) {
                        window.toast(res.msg)
                        // 编辑模式
                        if (isEdit.value) {
                            // 保存成功给父窗口传消息
                            const res = await postChildMsg({ msg: 'saved' })
                            if (res && res.ok === 1) {
                                window.close()
                            }
                        } else {
                            reset()
                        }
                    }
                }
            })
        }

        return {
            isEdit,
            formRef,
            formdata,
            rules,
            onSubmit,
            reset,
            close,
        }
    },
})
</script>
 
<style scoped lang="scss">
.formbox {
    float: left;
    width: 70%;
    &.edit {
        padding: 10px;
        width: calc(100% - 5px);
        &:deep(.el-form > .el-form-item):last-child {
            position: fixed;
            left: 0;
            bottom: 0;
            width: 100%;
            text-align: center;
            background: #f5f5f5;
            padding: 10px;
            margin-bottom: 0;
            border-top: 1px solid #eee;
            .el-form-item__content {
                margin-left: 0 !important;
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
        &:deep(.el-form-item__label) {
            font-size: 12px;
        }
        &:deep(.el-input__inner),
        &:deep(.el-textarea__inner) {
            border: 1px solid #bdbdbd;
            border-radius: 0 !important;
        }
    }
    &:deep(.el-form-item__label) {
        color: #333;
    }
    &:deep(.el-input__inner),
    &:deep(.el-textarea__inner) {
        border: 1px solid #c6d8e6;
        font-family: auto;
        max-height: 70px;
    }
    &:deep(.el-button) {
        padding: 10px 30px;
    }
}
</style>
