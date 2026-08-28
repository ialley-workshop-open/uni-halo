// 应用设置存储key值
export const _HaloConfigKey = 'HALO_GLOBAL_CONFIGS';

// 默认的应用设置
export const DefaultHaloGlobalConfigs = {
	allowAnonymousComments: true,
	allowRegistration: true,
	mustVerifyEmailOnRegistration: true,
	mustVerifyPhoneOnRegistration: false,
	restrictRegistrationDomain: false,
	shopDisabled: true,
}

/**
 * 获取应用设置
 */
export const getHaloGlobalConfigs = () => {
	let configs = uni.getStorageSync(_HaloConfigKey)
	if (configs) return JSON.parse(configs)

	uni.setStorageSync(_HaloConfigKey, JSON.stringify(DefaultHaloGlobalConfigs))
	return DefaultHaloConfigs;
}

/**
 * 保存应用设置
 */
export const setHaloGlobalConfigs = (configs) => {
	uni.setStorageSync(_HaloConfigKey, JSON.stringify(configs))
}