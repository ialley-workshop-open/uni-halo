// 微信分享配置
import haloConfig from '@/config/halo.config.js'
import { jsonToUrlParams2 } from '@/utils/url.params.js'
export const haloWxShareMixin = {
	data() {
		return {
			haloWxShareData: {
				...haloConfig.wxShareConfig
			},
		}
	},

	//#ifdef MP-WEIXIN
	onShareAppMessage(res) {
		return {
			...this.haloWxShareData,
			success: res => {}
		}
	},
	//#endif
	/* 分享到微信好友 */
	onShareAppMessage(res) {
		const promise = new Promise(resolve => {
			setTimeout(() => {
				resolve({
					title: this.haloWxShareData.title,
					path: this.haloWxShareData.path,
				})
			}, 2000)
		})
		return {
			title: this.haloWxShareData.title,
			path: '',
			promise
		}
	},

	// 分享到朋友圈-这里封装不够，在页面还要声明一次，否则是拿不到参数的，被分享者在朋友圈打开链接是空的
	onShareTimeline: function() {
		return {
			title: this.haloWxShareData.title,
			query: {},
			imageUrl: this.haloWxShareData.imageUrl,
		}
	},
	methods: {
		// 设置分享信息（需要在页面调用）
		fnSetWxShareConfig(config = {}) {
			let currentRoutes = getCurrentPages(); // 获取当前打开过的页面路由数组
			let currentRoute = currentRoutes[currentRoutes.length - 1].route; //获取当前页面路由(分销思路，分享者点开使用的小程序将获取到分享者的id)
			let sharePath = currentRoutes
			if (config.params) {
				const URLParams = config.params ? jsonToUrlParams2(config.params) : {};
				sharePath += URLParams
			}
			let _config = Object.assign({}, {
				path: sharePath,
				copyLink: haloConfig.apiUrl,
				query: {}
			}, config)

			uni.$tm.vx.commit('setWxShare', _config);
			this.haloWxShareData = _config;
		}
	}
}
