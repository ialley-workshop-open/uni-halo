/**
 *  功能：token操作
 *  作者：小莫唐尼
 *  邮箱：studio@925i.cn
 *  时间：2022年07月21日 18:00:05
 *  版本：v0.1.0
 *  修改记录：
 *  修改内容：
 *  修改人员：
 *  修改时间：
 */

import {
	getCache
} from "./storage";

const TokenAuthKey = "EvanIAlley_App_Token";

/**
 * 获取登录token
 */
export function getAdminAccessToken() {
	const tokens = getCache('APP_ADMIN_LOGIN_TOKEN');
	if (tokens) {
		return tokens.access_token;
	}
	return null
}

/**
 * 获取刷新token
 */
export function getAdminRefreshToken() {
	const tokens = getCache('APP_ADMIN_LOGIN_TOKEN');
	if (tokens) {
		return tokens.refresh_token;
	}
	return null
}

/**
 * 设置微信登录信息
 */
export function setWxLoginInfo(info) {
	uni.setStorageSync('APP_WX_LOGIN_INFO', info);
}

/**
 * 获取微信登录信息
 */
export function getWxLoginInfo() {
	let wxLoginInfo = uni.getStorageSync('APP_WX_LOGIN_INFO');
	if (wxLoginInfo) {
		return JSON.parse(wxLoginInfo)
	} else {
		return null;
		// return {
		// 	avatarUrl: '',
		// 	nickName: '',
		// 	email: '',
		// 	url: ''
		// }
	}
}

/**
 * 检查是否已经微信授权
 */
export function checkHasWxLogin() {
	return !!uni.getStorageSync('APP_WX_LOGIN_INFO')
}

/**
 * 检查超管是否已经登录
 */
export function checkHasAdminLogin() {
	return !!getCache('APP_ADMIN_LOGIN_TOKEN')
}
