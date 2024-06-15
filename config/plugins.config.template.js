/** 插件相关配置 */
const PluginsConfig = Object.freeze({
	// 友链提交配置
	autoSubmitLink: {
		// 可以考虑配置一个插件id，检测是否开启了友链提交插件（暂未使用）
		pluginId: "",
		// 是否开启（可能后台没有安装或未不启用插件）
		enabled: true,
		// 我的友链信息
		blogDetail: {
			// 博客名称
			name: "",
			// 博客地址
			url: "",
			// 博客logo
			logo: "",
			// 博客简介
			description: "",
		}
	},
	// tools工具箱插件配置
	toolsPlugin: {
		pluginId:"tools",
		enabled: true,
		Authorization: "Tools工具箱插件设置的认证token"
	}
})


export default PluginsConfig;