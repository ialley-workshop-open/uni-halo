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
import User from '@/api/admin/user.js'
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
		// 超管登录
		adminToken: getCache('APP_ADMIN_LOGIN_TOKEN'),

		// 微信登录的信息
		wxLoginInfo: getWxLoginInfo(),
	},
	getters: {
		getAdminToken(state) {
			return getCache('APP_ADMIN_LOGIN_TOKEN')
		},
		getWxLoginInfo(state) {
			return state.wxLoginInfo
		},
	},
	mutations: {
		setAdminToken(state, data) {
			state.adminToken = data
			setCache('APP_ADMIN_LOGIN_TOKEN', data, data?.expired_in)
		},
		setWxLoginInfo(state, data) {
			state.wxLoginInfo = data
			uni.setStorageSync('APP_WX_LOGIN_INFO', JSON.stringify(data))
		},
	},
	actions: {
		adminLogin(context, data) {
			return new Promise((resolve, reject) => {
				User.login(data).then((res) => {
					if (res.status == 200) {
						context.commit("setAdminToken", res.data);
						resolve(res)
					} else {
						reject(err)
					}
				}).catch((err) => {
					reject(err)
				});
			})
		},
		checkAndSetDefaultUser(context) {
			if (!context.state.wxLoginInfo) {
				context.commit('setWxLoginInfo', {
					avatarUrl: HaloConfig.defaultAvatarUrl,
					nickName: '匿名访客',
					email: '',
					url: ''
				})
			}
		},
		adminLogout(context) {
			context.commit("setAdminToken", null);
		}
	},
};
