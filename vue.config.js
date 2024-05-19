//vue.config.js
const TransformPages = require('uni-read-pages')
const {
	webpack
} = new TransformPages()
module.exports = {
	devServer: {
		disableHostCheck: true,
		proxy: {
			"/apis": {
				target: 'https://demo.halo.run',
				changeOrigin: true,
				secure: true,
				pathRewrite: {
					"^/apis": "/apis"
				}
			}
		}
	},
	configureWebpack: {
		plugins: [
			new webpack.DefinePlugin({
				ROUTES: webpack.DefinePlugin.runtimeValue(() => {
					const tfPages = new TransformPages({
						includes: ['path', 'name', 'aliasPath', "meta"]
					});
					return JSON.stringify(tfPages.routes)
				}, true)
			})
		]
	}
}