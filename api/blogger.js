/**
 * 博主信息
 * @see https://api.halo.run/content-api.html#tag/user-controller
 */

import HttpHandler from '@/common/http/request.js'

export default {
	/**
	 * 获取博主信息
	 */
	getBloggerInfo: () => {
		return HttpHandler.Get(`/api/content/users/profile`)
	},
}
