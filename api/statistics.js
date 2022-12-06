/**
 * 博客统计信息
 * @see https://api.halo.run/content-api.html#tag/statistic-controller
 */

import HttpHandler from '@/common/http/request.js'

export default {
	/**
	 * 获取博客统计信息
	 */
	getBlogStatistics: () => {
		return HttpHandler.Get(`/api/content/statistics`)
	},

	/**
	 * 获取博客统计信息和用户信息
	 */
	getBlogStatisticsWithUser: () => {
		return HttpHandler.Get(`/api/content/statistics/user`)
	},
}
