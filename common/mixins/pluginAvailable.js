/**
 *  功能：插件检查
 */
import {
	NeedPluginIds,
	NeedPlugins,
	checkNeedPluginAvailable
} from "@/utils/plugin.js"

const HaloPluginAvailableMixin = {
	data() {
		return {
			NeedPluginIds,
			NeedPlugins,
			uniHaloPluginAvailableError: "",
			uniHaloPluginAvailable: true,
			uniHaloPluginPageClass: "",
			uniHaloPluginId: "", // 当前需要的插件
			uniHaloPluginInfo: "" // 当前插件信息
		};
	},
	watch: {
		uniHaloPluginAvailable: {
			immediate: true,
			handler(val) {
				if (val) {
					this.uniHaloPluginPageClass = ""
				} else {
					this.uniHaloPluginPageClass = "box-border items-center justify-center"
				}
			}
		}
	},
	methods: {
		/** 设置插件ID */
		setPluginId(pluginId) {
			this.uniHaloPluginId = pluginId
			this.uniHaloPluginInfo = NeedPlugins.get(pluginId)
		},
		/** 检查插件状态 */
		async checkPluginAvailable(pluginId) {
			pluginId = pluginId ?? this.uniHaloPluginId
			if (!pluginId) return false;
			const available = await checkNeedPluginAvailable(pluginId)
			this.uniHaloPluginAvailable = available
			return available
		},
		/** 设置错误信息 */
		setPluginError(text) {
			this.uniHaloPluginAvailableError = text
		}
	},
}

export default HaloPluginAvailableMixin;