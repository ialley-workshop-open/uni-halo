/**
 * 主题设置
 * @see https://api.halo.run/content-api.html#tag/theme-controller
 */

import HttpHandler from '@/common/http/request.js'

export default {
	/**
	 * 获取激活主题的信息
	 * @param {Object} params 参数
	 */
	geActivationThemeList: (params) => {
		return HttpHandler.Get(`/api/content/themes/activation`, params)
	},

	/**
	 * 获取激活的主题设置
	 * @param {Object} params 参数
	 */
	getActivationThemeSettings: (params) => {
		return HttpHandler.Get(`/api/content/themes/activation/settings`, params)
	},

	/**
	 * 根据主题ID列出主题设置
	 * @param {Object} params 参数
	 */
	getThemeSettingsByThemeId: (themeId) => {
		return HttpHandler.Get(`/api/content/themes/${themeId}/settings`)
	},

	/**
	 * 通过主题ID获取主题属性
	 * @param {Object} params 参数
	 */
	getThemePropertyByThemeId: (themeId) => {
		return HttpHandler.Get(`/api/content/themes/${themeId}`)
	},
}
