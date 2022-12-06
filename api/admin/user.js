/**
 * 登录管理
 * @see https://api.halo.run/admin-api.html#tag/admin-controller
 */
import HttpHandler from '@/common/http/request.js'

export default {
	// 登录前检查
	loginPreCheck: (data) => {
		return HttpHandler.Post('/api/admin/login/precheck', data, {})
	},
	// 登录
	login: (data) => {
		return HttpHandler.Post('/api/admin/login', data, {})
	},
	// 刷新token
	refreshToken: (refreshToken) => {
		return HttpHandler.Post($`/api/admin/refresh/${refreshToken}`, {}, {})
	},

	// 退出登录
	logout: () => {
		return HttpHandler.Post('/api/admin/logout')
	},

	/**
	 * 获取修改密码的验证码
	 * {
	 *	"email": "string",
	 *	"username": "string"
	 * }
	 */
	getResetPasswordCode: () => {
		return HttpHandler.Post('/api/admin/password/code')
	},

	/**
	 * 重置密码
	 * {
	 *	"code": "string",
	 *   "email": "string",
	 *   "password": "stringst",
	 *   "username": "string"
	 * }
	 */
	resetPasswordByCode: (data) => {
		return HttpHandler.Put('/api/admin/password/reset', data)
	},

	/**
	 * 获取个人信息（当前登录的管理员）
	 */
	getAdminProfile: () => {
		return HttpHandler.Get('/api/admin/users/profiles')
	},

	/**
	 * 修改个人信息（当前登录的管理员）
	 *	 {
	 *	   "avatar": "string",
	 *	   "description": "string",
	 *	   "email": "string",
	 *	   "nickname": "string",
	 *	   "password": "stringst",
	 *	   "username": "string"
	 *	 }
	 */
	updateAdminProfile: (data) => {
		return HttpHandler.Put('/api/admin/users/profiles', data)
	},
	/**
	 * 修改密码
	 * {
	 *	 "confirmPassword": "string",
	 *   "newPassword": "string",
	 *   "oldPassword": "strings" 
	 * }
	 */
	modifyAdminPassword: (data) => {
		return HttpHandler.Put('/api/admin/users/profiles/password', data)
	},

}
