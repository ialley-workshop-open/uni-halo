/**
 * 广告配置
 */
export default {
	adpid: '', // uni-AD App广告位id，在uni-AD官网申请广告位
	unitId: '', // 广告单元id，可在小程序管理后台的流量主模块新建 (非个人资质，小程序后台广告主开通申请)
	frequency: 8, // 列表中，广告出现的频率（8=每8条数据出现一次广告）
	// 首页广告
	home: {
		use: false,
	},
	// 文章列表广告
	articles: {
		use: false,
	},
	// 文章详情广告
	articleDetail: {
		// 微信广告/dclound申请的广告
		use: true,

		// 自定义广告
		custom: {
			use: true,
			cover: 'https://b.925i.cn/uni_halo/uni_halo_ad_cover.png',
			title: 'uni-halo 正式开源啦，欢迎来使用和体验！',
			content: '基于 uni-app + halo1.x API 实现一款现代化的开源博客 / CMS 系统API开发的多端应用。功能包括：前台博客系统 和 后台管理系统，同时满足浏览和管理两端合一的需求，真正实现一个应用实现博客浏览和后台管理。',
			url: 'https://uni-halo.925i.cn'
		}
	}
}
