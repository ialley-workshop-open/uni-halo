import utils from '@/utils/index.js'
import v2Apis from "@/api/v2/all.api.js"

export const NeedPluginIds = Object.freeze({
	PluginUniHalo: "plugin-uni-halo",
	PluginPhotos: "PluginPhotos",
	PluginLinks: "PluginLinks",
	PluginMoments: "PluginMoments",
	PluginSearchWidget: "PluginSearchWidget",
	PluginCommentWidget: "PluginCommentWidget",
	PluginVote: "vote",
})

export const NeedPlugins = new Map([
	[
		NeedPluginIds.PluginUniHalo, {
			id: "plugin-uni-halo",
			name: "UniHalo配置",
			desc: "uni-halo 核心插件，未安装和启用的情况下，将无法使用 uni-halo，请检查是否已安装和启用",
			logo: utils.checkUrl("/plugins/plugin-uni-halo/assets/logo.png"),
			url: "https://www.halo.run/store/apps/app-ryemX"
		}
	],
	[
		NeedPluginIds.PluginPhotos, {
			id: "PluginPhotos",
			name: "图库管理",
			desc: "图库功能模块所需要的插件",
			logo: utils.checkUrl("/plugins/PluginPhotos/assets/logo.svg"),
			url: "https://www.halo.run/store/apps/app-BmQJW"
		}
	],
	[
		NeedPluginIds.PluginLinks, {
			id: "PluginLinks",
			name: "链接管理",
			desc: "链接管理模块，用于网站友情链接功能模块",
			logo: utils.checkUrl("/plugins/PluginLinks/assets/logo.svg"),
			url: "https://www.halo.run/store/apps/app-hfbQg"
		}
	],
	[
		NeedPluginIds.PluginMoments, {
			id: "PluginMoments",
			name: "瞬间",
			desc: "提供一个轻量级的内容图文、视频、音频等内容展示",
			logo: utils.checkUrl("/plugins/PluginMoments/assets/logo.svg"),
			url: "https://www.halo.run/store/apps/app-SnwWD"
		}
	],
	[
		NeedPluginIds.PluginSearchWidget, {
			id: "PluginSearchWidget",
			name: "搜索组件",
			desc: "为应用提供统一的搜索组件",
			logo: utils.checkUrl("/plugins/PluginSearchWidget/assets/logo.svg"),
			url: "https://www.halo.run/store/apps/app-DlacW"
		}
	],
	[
		NeedPluginIds.PluginCommentWidget, {
			id: "PluginCommentWidget",
			name: "评论组件",
			desc: "为用户前台提供完整的评论解决方案",
			logo: utils.checkUrl("/plugins/PluginCommentWidget/assets/logo.svg"),
			url: "https://www.halo.run/store/apps/app-YXyaD"
		}
	],
	[
		NeedPluginIds.PluginVote, {
			id: "vote",
			name: "投票管理",
			desc: "投票模块所需要的插件，用于展示投票和提交投票",
			logo: utils.checkUrl("/plugins/vote/assets/logo.png"),
			url: "https://www.halo.run/store/apps/app-veyvzyhv"
		}
	]
])

/**
 * 检查插件是否启用、安装
 * @param {String} pluginId 插件id
 * @return {Boolean} true = 安装、启用  false= 未安装启用
 */
export const checkNeedPluginAvailable = (pluginId) => {
	return new Promise(async (resolve) => {
		try {
			const available = await v2Apis.checkPluginAvailable(pluginId)
			resolve(available)
		} catch (err) {
			resolve(false)
		}
	})
}