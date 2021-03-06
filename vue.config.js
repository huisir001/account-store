/*
 * @Description: vue-cli配置文件
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-23 00:22:44
 * @LastEditTime: 2021-12-03 23:50:34
 */
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
	publicPath: './',	//避免路径为绝对路径
	productionSourceMap: false, //关闭生产环境map
	devServer: {
		port: process.env['npm_package_config_port'], // 启动端口
	},
	chainWebpack: config => {
		//将以下文件复制到dist目录下，因为打包electron需要
		config.plugin('copy').use(CopyWebpackPlugin, [[
			{
				from: 'app.js',
				to: './'
			},
			{
				from: 'package.json',
				to: './'
			},
			{
				from: 'sys',
				to: './',
				globOptions: {
					ignore: ["**/*.md", "**/*.ts", "**/*.json"]
				}
			},
			{
				from: 'public/favicon.ico',
				to: './'
			},
		]])
	}
}