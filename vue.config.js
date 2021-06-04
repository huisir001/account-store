/*
 * @Description: vue-cli配置文件
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-23 00:22:44
 * @LastEditTime: 2021-06-04 10:39:15
 */
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
	publicPath: './',	//避免路径为绝对路径
	productionSourceMap: false, //关闭生产环境map
	devServer: {
		// can be overwritten by process.env.HOST
		// host: "0.0.0.0",
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