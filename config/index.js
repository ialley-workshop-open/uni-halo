// 应用设置存储key值
export const _AppConfigKey = 'APP_GLOBAL_CONFIGS';

// 默认的应用设置
export const DefaultAppConfigs = {
	loveConfig: {},
	imagesConfig: {},
	authorConfig: {},
	appConfig: {},
	pluginConfig: {},
}

/**
 * 获取应用设置
 */
export const getAppConfigs = () => {
	let configs = uni.getStorageSync(_AppConfigKey)
	if (configs) return JSON.parse(configs)

	uni.setStorageSync(_AppConfigKey, JSON.stringify(DefaultAppConfigs))
	return DefaultAppConfigs;
}

/**
 * 保存应用设置
 */
export const setAppConfigs = (configs) => {
	uni.setStorageSync(_AppConfigKey, JSON.stringify(configs))
}
