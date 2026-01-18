// 应用设置存储key值
export const _AppConfigKey = 'APP_GLOBAL_CONFIGS';
export const _AppMockJsonKey = 'APP_GLOBAL_MOCK_JSON';

// 默认的应用设置
export const DefaultAppConfigs = {
	basicConfig: {
		tokenConfig: {
			personalToken: "",
		}
	},
	loveConfig: {},
	imagesConfig: {},
	authorConfig: {},
	appConfig: {},
	pluginConfig: {
		votePlugin: {},
		toolsPlugin: {},
		linksPlugin:{},
		linksSubmitPlugin: {},
		doubanPlugin: {
			position: 'bottom'
		},
	},
	pageConfig: {
		homeConfig: {
			pageTitle: "首页",
			useCategory: true,
			bannerConfig: {
				enabled: true,
				showTitle: true,
				showIndicator: true,
				height: "400rpx",
				dotPosition: "right",
				type: "post",
				list: []
			}
		},
		categoryConfig: {
			type: "list"
		},
		momentConfig: {
			useTagRandomColor: true
		}
	},
	auditConfig: {
		auditModeEnabled: false,
		auditModeData: {
			jsonUrl: "",
			jsonData: ""
		}
	}
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


/**
 * 获取应用模拟数据
 */
export const getAppMockJson = () => {
	let json = uni.getStorageSync(_AppMockJsonKey)
	if (json) return JSON.parse(json)

	uni.setStorageSync(_AppMockJsonKey, JSON.stringify({}))
	return {};
}

/**
 * 保存应用模拟数据
 */
export const setAppMockJson = (json) => {
	uni.setStorageSync(_AppMockJsonKey, JSON.stringify(json))
}