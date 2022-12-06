/**
 *  功能：应用设置
 *  作者：小莫唐尼
 *  邮箱：studio@925i.cn
 *  时间：2022年12月04日 12:00:44
 *  版本：v0.1.0 
 */
import {
	getAppSettings,
	setAppSettings,
	_DefaultAppSettings,
} from '@/utils/app.js'

export default {
	namespaced: true,
	state: {
		settings: getAppSettings(),
	},
	getters: {
		getSettings(state) {
			return state.settings
		},
	},
	mutations: {
		setSettings(state, data) {
			state.settings = data;
			console.log('设置：', data);
			setAppSettings(data)
		},
	},
	actions: {
		// 设置默认的数据
		updateDefaultAppSettings({
			commit
		}) {
			console.log(_DefaultAppSettings);
			commit('setSettings', JSON.parse(JSON.stringify(_DefaultAppSettings)))
		},
		// 检查并设置默认的数据
		checkAndSetDefaultAppSettings(context) {
			if (!context.state.settings) {
				context.commit('setSettings', getAppSettings())
			}
		}
	}
};
