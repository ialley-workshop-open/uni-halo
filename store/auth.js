/**
 *  功能：登录用户
 *  作者：小莫唐尼
 *  邮箱：studio@925i.cn
 *  时间：2022年07月21日 18:41:44
 *  版本：v0.1.0
 *  修改记录：
 *  修改内容：
 *  修改人员：
 *  修改时间：
 */
 
import HaloConfig from '@/config/halo.config.js';
import {
	getWxLoginInfo
} from '@/utils/auth.js'
import {
	setCache,
	getCache
} from '@/utils/storage.js'
export default {
	state: { 
		// 微信登录的信息
		wxLoginInfo: getWxLoginInfo(),
	},
	getters: { 
		getWxLoginInfo(state) {
			return state.wxLoginInfo
		},
	},
	mutations: { 
		setWxLoginInfo(state, data) {
			state.wxLoginInfo = data
			uni.setStorageSync('APP_WX_LOGIN_INFO', JSON.stringify(data))
		},
	},
	actions: { 
		checkAndSetDefaultUser(context) {
			if (!context.state.wxLoginInfo) {
				context.commit('setWxLoginInfo', {
					avatarUrl: HaloConfig.defaultAvatarUrl,
					nickName: '匿名访客',
					email: '',
					url: ''
				})
			}
		} 
	},
};
