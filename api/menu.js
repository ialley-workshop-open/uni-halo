/**
 * 菜单接口
 * @see https://api.halo.run/content-api.html#tag/menu-controller
 */

import HttpHandler from '@/common/http/request.js'

export default {
	/**
	 * 获取菜单列表（列表）
	 * @param {Object} params 参数
	 */
	getMenuList: (params) => {
		return HttpHandler.Get(`/api/content/menus`, params)
	},

	/**
	 * 获取菜单列表（树形）
	 * @param {Object} params 参数
	 */
	getMenuTree: (params) => {
		return HttpHandler.Get(`/api/content/menus/tree_view`, params)
	},
}
