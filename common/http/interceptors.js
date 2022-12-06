/**
 *  功能：http拦截
 *  作者：小莫唐尼
 *  邮箱：studio@925i.cn
 *  时间：2022年07月21日 19:02:14
 *  版本：v0.1.0
 *  修改记录：
 *  修改内容：
 *  修改人员：
 *  修改时间：
 */
import {
	getAdminAccessToken
} from "@/utils/auth.js";
import {
	delCache
} from "@/utils/storage";
export const setInterceptors = (http) => {
	http.interceptors.request.use(
		(config) => {
			// 可使用async await 做异步操作
			config.header = {
				...config.header
				// ... 可以直接加参数
			};
			if (getAdminAccessToken()) {
				config.header['admin-authorization'] = getAdminAccessToken()
			}
			return config;
		},
		(config) => {
			// 可使用async await 做异步操作
			return Promise.reject(config);
		}
	);

	http.interceptors.response.use(
		(response) => {
			/* 对响应成功做点什么 可使用async await 做异步操作*/
			//  if (response.data.code !== 200) { // 服务端返回的状态码不等于200，则reject()
			//    return Promise.reject(response) // return Promise.reject 可使promise状态进入catch
			// if (response.config.custom.verification) { // 演示自定义参数的作用
			//   return response.data
			// } 

			if (response.statusCode == 200) {
				return response.data;
			} else {
				return Promise.reject(response);
			}
		},
		(response) => {
			/*  对响应错误做点什么 （statusCode !== 200）*/
			if (!response.data) {
				return Promise.reject({
					status: 500,
					message: 'API接口服务异常！'
				})
			} else if (response.data.status == 401) {
				delCache('APP_ADMIN_LOGIN_TOKEN');
				uni.$eShowModal({
					title: '提示',
					content: '您未登录超管账号或登录已过期，是否重新登录？',
					showCancel: true,
					cancelText: '否',
					cancelColor: '#999999',
					confirmText: '是',
					confirmColor: '#03a9f4'
				}).then(res => {
					uni.navigateTo({
						url: '/pagesB/login/login'
					})
				}).catch(err => {
					uni.switchTab({
						url: '/pages/tabbar/about/about'
					})
				})
			} else {
				return Promise.reject(response.data);
			}

		}
	);
};
