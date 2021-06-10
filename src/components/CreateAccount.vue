<!--
 * @Description: 新增账户
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-08 13:57:11
 * @LastEditTime: 2021-06-10 10:40:13
-->
<template>
    <div class="formbox">
        <el-form ref="formRef"
                 size="medium"
                 :rules="rules"
                 :model="formdata"
                 label-width="50px">
            <el-form-item label="名称"
                          prop="name">
                <el-input v-model="formdata.name"
                          placeholder="请输入账户名称，如网站名称"
                          clearable></el-input>
            </el-form-item>
            <el-form-item label="账号"
                          prop="account">
                <el-input v-model="formdata.account"
                          placeholder="请输入登录账号"
                          clearable
                          show-password></el-input>
            </el-form-item>
            <el-form-item label="密码"
                          prop="password">
                <el-input v-model="formdata.password"
                          placeholder="请输入登录密码"
                          clearable
                          show-password></el-input>
            </el-form-item>
            <el-form-item label="邮箱"
                          prop="email">
                <el-input v-model="formdata.email"
                          placeholder="请输入绑定邮箱"
                          clearable></el-input>
            </el-form-item>
            <el-form-item label="手机"
                          prop="phone">
                <el-input v-model="formdata.phone"
                          placeholder="请输入绑定手机号码"
                          clearable></el-input>
            </el-form-item>
            <el-form-item label="备注"
                          prop="remark">
                <el-input type="textarea"
                          v-model="formdata.remark"
                          placeholder="备注信息，如网址"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"
                           @click="onSubmit"
                           style="padding:10px 30px;">立即新增</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
 
<script lang="ts">
import { defineComponent, reactive, ref, toRaw } from 'vue'
import Api from '@/api'

export default defineComponent({
    name: 'CreateAccount',
    setup() {
        let formdata = reactive({
            name: '',
            account: '',
            password: '',
            email: '',
            phone: '',
            remark: '',
        })

        const formRef = ref(null)

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
                        if (
                            value.trim() == '' ||
                            /^1[3|4|5|6|7|8|9][0-9]{9}$/.test(value)
                        ) {
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

        // 新增
        const onSubmit = () => {
            ;(<any>formRef.value).validate(async (valid: any) => {
                if (valid) {
                    const res = await Api('saveAccount', toRaw(formdata))
                    if (res && res.ok === 1) {
                        ;(window as any).toast(res.msg)
                        reset()
                    }
                }
            })
        }

        return {
            formRef,
            formdata,
            rules,
            onSubmit,
            reset,
        }
    },
})
</script>
 
<style scoped lang="scss">
.formbox {
    float: left;
    width: 70%;
    &:deep(.el-form-item__label) {
        color: #000;
    }
    &:deep(.el-input__inner),
    &:deep(.el-textarea__inner) {
        border: 1px solid #c6d8e6;
        font-family: auto;
        max-height: 70px;
    }
}
.infobox {
    float: right;
    width: 26%;
}
</style>
