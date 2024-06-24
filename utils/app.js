export const Platform = {
	ios: 'ios',
	android: 'android'
}

/**
 * 检查当前环境是什么环境
 */
export const checkPlatform = (name) => {
	return uni.getSystemInfoSync().platform === name;
}

// 默认的应用设置
export const _DefaultAppSettings = {
	showStartPage: false, // 是否每次启动都显示启动页
	isAvatarRadius: false, // 评论头像是否圆形
	banner: {
		useDot: true,
		dotPosition: 'right'
	},
	// 布局配置
	layout: {
		// h_row_col1 = 一行一列
		// h_row_col2 = 一行两列
		home: 'h_row_col1',
		// lr_image_text=左图右文
		// lr_text_image=左文右图
		// tb_image_text=上图下文
		// tb_text_image=上文下图
		// only_text=仅文字
		cardType: 'lr_image_text',
	},
	// 广告配置（todo）
	ad: {
		timeout: 3, // 屏蔽广告时长，时间到后自动恢复展示（单位小时）
		disabled: false, // 是否屏蔽广告（看广告可以关闭应用内设置的广告）
	},
	// 评论弹幕（文章详情）
	barrage: {
		use: false, // 是否启用
		type: 'leftBottom' // 弹幕位置（rightToLeft leftBottom）
	},
	gallery: {
		// 是否使用瀑布流
		useWaterfull: true
	},
	links: {
		// 是否使用简约模式
		useSimple: false,
		useGroup: false,
	},
	about: {
		showAdmin: false, // 显示后台登录入口
		showAllCount: false, // 默认显示所有的统计信息（关于页面）
	},
	// 文章配置
	article: {

	},
	// 联系博主页面
	contact: {
		// 链接是否使用复制的方式，否则直接在内部打开（小程序需要配置对应链接的业务域名）
		isLinkCopy: true,
	},

}
// 应用设置存储key值
export const _AppSettingsKey = 'APP_GLOBAL_SETTINGS';
/**
 * 获取应用设置
 */
export const getAppSettings = () => {
	let _appSettings = uni.getStorageSync(_AppSettingsKey)
	if (_appSettings) return JSON.parse(_appSettings)

	uni.setStorageSync(_AppSettingsKey, JSON.stringify(_DefaultAppSettings))
	return _appSettings;
}

/**
 * 保存应用设置
 */
export const setAppSettings = (appSettings) => {
	uni.setStorageSync(_AppSettingsKey, JSON.stringify(appSettings))
}
