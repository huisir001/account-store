/*
 * @Description: 主线程API调用
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-02 16:03:20
 * @LastEditTime: 2021-06-07 12:35:41
 */
import { ElLoading as Loading } from 'element-plus'

export default async (something: string, ...parames: any[]): Promise<any> => {

    // loading
    const loading = Loading.service({
        text: '加载中...',
        background: 'rgba(255, 255, 255, 0.6)',
        target: "#app" // 在app元素内loading，避免遮罩覆盖透明区
    })

    try {

        const res = await window.sys.do(something, ...parames)

        // 关闭loading
        loading.close()

        return Promise.resolve(res)

    } catch (err) {

        // 关闭loading
        loading.close()

        // 错误提示
        window.alert(err.msg || err.toString(), '错误信息', '确认')
    }
}