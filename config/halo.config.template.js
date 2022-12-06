/**
 *  功能：基础配置
 *  作者：小莫唐尼
 *  邮箱：studio@925i.cn
 *  时间：2022年08月23日 15:19:14
 *  版本：v0.1.0
 *  修改记录：
 *  修改内容：
 *  修改人员：
 *  修改时间：
 */
export default {
	showCopyright: true, // 显示开源版权信息
	showAbout: true, // 显示关于项目入口
	uni_halo_logo: 'https://b.925i.cn/uni_halo/uni_halo_logo.png', // uni-halo的logo

	apiUrl: '', // Api基础域名（您的halo博客基础域名或者是Halo后台管理系统api地址）
	apiAuthorization: '', // Halo中-系统-博客设置-切换到高级选项-API设置-Access key 

	title: '', // 博客标题
	indexImageUrl: '', // 开屏首页图片	
	miniCodeImageUrl: '', // 小程序码地址

	author: {
		name: '', // 昵称
		avatar: '', // 头像地址
		motto: '', // 格言
	},

	social: {
		qq: "", // qq号
		wechat: "", // 微信号
		weibo: "", // 微博地址
		email: "", // 邮箱地址
		blog: "", // 博客地址
		juejin: "", // 掘金地址
		bilibili: "", // b站地址
		gitee: "", // gitee地址
		github: "", // github地址
		csdn: "" // CSDN地址
	},

	defaultThumbnailUrl: '', // 默认封面图地址 
	defaultImageUrl: '', // 默认图片地址 
	defaultAvatarUrl: '', // 默认头像地址

	loadingGifUrl: '', // 图片加载中的地址
	loadingErrUrl: '', // 图片加载失败的地址
	loadingEmptyUrl: '', // 加载图片为空地址

	waveImageUrl: '', // 关于页面波浪图片

	banner: { // 轮播图配置
		type: 'article', //  轮播图数据源 list=下方配置 article=热门文章封面 
		list: [],
	},

	quickNav: { // 快捷导航配置
		use: true,
		list: [{
				icon: 'halocoloricon-classify',
				text: '文章归档',
				iconSize: 60,
				color: 'blue',
				type: 'page',
				path: '/pagesA/archives/archives'
			},
			{
				icon: 'halocoloricon-attent',
				text: '恋爱日记',
				iconSize: 60,
				color: 'blue',
				type: 'page',
				path: '/pagesA/love/love'
			},
			{
				icon: 'halocoloricon-calendar',
				text: '个人日记',
				iconSize: 60,
				color: 'blue',
				type: 'page',
				path: '/pagesA/journal/journal'
			},
			{
				icon: 'halocoloricon-message',
				text: '留言板',
				iconSize: 60,
				color: 'blue',
				type: 'page',
				path: '/pagesA/leaving/leaving'
			}
		]
	},

	// 微信分享信息
	wxShareConfig: {
		title: '', // 小程序分享标题[非必填]
		desc: '', // 小程序分享描述[非必填]
		imageUrl: '', // 小程序分享时候图片地址[非必填]
		path: '/pages/start/start', // 分享路径[非必填] - 基本不需要修改
		copyLink: '/pages/start/start', // 复制链接[非必填]  - 基本不需要修改
		query: {}, // 分享参数[非必填]  - 基本不需要填写
	},

	colors: [
		'#39B449',
		'#E44C41',
		'#8698A2',
		'#0080FE',
		'#1CBCB4',
		'#6638B5',
	]
}
