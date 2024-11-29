//vue.config.js
module.exports = {
	devServer: {
		disableHostCheck: true,
		proxy: {
			"/apis": {
				target: 'https://blog.xiaoxiaomo.cn',
				changeOrigin: true,
				secure: true,
				pathRewrite: {
					"^/apis": "/apis"
				}
			}
		}
	}
}
