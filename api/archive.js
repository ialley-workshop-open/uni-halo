/**
 * 归档接口
 * @see https://api.halo.run/content-api.html#tag/archive-controlle
 */

import HttpHandler from '@/common/http/request.js'

export default {
	/**
	 * 获取归档列表(按月)
	 */
	getMonthArchives: () => {
		return HttpHandler.Get(`/api/content/archives/months`)
	},

	/**
	 * 获取归档列表(按年)
	 */
	getYearArchives: () => {
		return HttpHandler.Get(`/api/content/archives/years`)
	},
}
