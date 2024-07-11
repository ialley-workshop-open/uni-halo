//vue.config.js
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
	}
}
