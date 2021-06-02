/*
 * @Description: babel配置
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-24 10:42:53
 * @LastEditTime: 2021-06-02 17:46:43
 */
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      "import",
      {
        libraryName: 'element-plus',
        customStyleName: (name) => {
          name = name.slice(3)
          return `element-plus/packages/theme-chalk/src/${name}.scss`;
        },
      },
    ],
  ],
}
