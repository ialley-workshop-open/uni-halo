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

	apiUrl: '', // Api基础域名 [必填] ：你的Halo博客基础域名
	apiAuthorization: '', // Api认证key [必填]： Halo中-系统-博客设置-切换到高级选项-API设置-Access key

	title: '', // 博客标题 [建议必填]：在某些页面没有设置具体的页面名称时候，使用该值显示
	miniCodeImageUrl: '', // 小程序的太阳码/二维码的图片地址 [建议必填]：主要用于文章详情页面的生成海报的功能
	aboutProfileImageUrl: '', // 关于页面中的资料卡背景图 [建议必填]

	// 启动页面的配置（页面地址`/pagesA/start/start`）
	start: {
		use: true, // 是否使用首次启动页：用户第一次使用你的应用会显示否则不显示
		title: 'uni-halo', // 启动页面中的文字标题
		bg: '', // 留空则使用默认 开屏首页背景，可以是颜色值或者图片图片地址
		logo: 'https://b.925i.cn/uni_halo/uni_halo_logo.png', // logo
		desc1: '全新UI，准备出发', // 描述信息1
		desc2: '新触动 新感受 新体验', // 描述信息2
		btnText: '全新触发' // 按钮文字
	},

	// 博主信息 
	author: {
		use: true, // 是否启用这里配置的信息，不启用则获取PC端博客设置的信息
		nickname: '', // 昵称
		avatar: '', // 头像
		email: '', // 邮箱
		description: '', // 介绍
	},

	// 版权信息（用于文章详情）
	copyright: {
		use: true, // 是否使用版权描述
		author: '', // 版权归属说明
		description: '', // 版权描述
		violation: '', // 侵权处理说明
	},

	// 社交信息(将会在`/pagesA/contact/contact`页面中展示)
	// 具体的某个参数值留空则不展示
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
