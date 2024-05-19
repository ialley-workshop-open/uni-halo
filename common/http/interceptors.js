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
	delCache,
	setCache
} from "@/utils/storage";

const getCategoryNameByUrl = (url) => {
	const reg = '(?<=/api/content/categories/).+(?=/posts)'
	return url.match(reg)[0] || '无分类名'
}
const showCategoryInputPasswordModal = (response, category) => {
	uni.showModal({
		title: `[ ${category} ] 分类已加密`, // TODO 这里应该获取分类的名字，可以在弹窗之前请求后台拿到所有分类根据分类code拿到名称，但是不会在这之前发送请求
		content: '',
		editable: true,
		placeholderText: '请输入分类密码后访问',
		confirmText: '验证密码',
		cancelText: '暂不访问',
		showCancel: true,
		cancelColor: '#999999',
		confirmColor: '#03a9f4',
		success: (res) => {
			if (res.confirm) {
				// TODO 这里如果没有输入密码点击确认应该阻止窗口关闭，但是没找到方法
				if (!res.content) {
					uni.showToast({
						title: '提示：请输入密码',
						icon: 'none',
						success: () => {
							setTimeout(() => {
								showCategoryInputPasswordModal(response, category);
							}, 800)
						}
					})
					return;
				}
				// 根据请求URL正则匹配分类code，然后把输入的密码根据分类code放入缓存，然后在category.getCategoryPostList中获取，解决多个分类加密输入密码后点错的问题
				// 目前存在一个问题，比如前两个都需要密码，如果先输入第二个的密码之后，重新进来默认打开第一个还会弹窗，所以想在弹窗标题上增加分类名字
				// 另外有以下两种方式科技解决
				// TODO 1.其实这里获取到密码之后可以直接发送一个请求追加上password参数，因为后台会缓存权限，后续不输入密码也可以访问,可惜不会
				// TODO 2.另外也可以拿到密码之后，直接选中该分类追加password参数，重新请求，可惜也不会
				setCache('APP_CATEGORY_PWD_' + category, res.content)
				uni.reLaunch({
					url: '/pages/tabbar/category/category'
				});
			} else if (res.cancel) {}
		},
	})
}

export const setInterceptors = (http) => {
	http.interceptors.request.use(
		(config) => {
			console.log("config", config)

			// 可使用async await 做异步操作
			config.header = {
				...config.header
				// ... 可以直接加参数
			};
			if (config.custom.systemToken) {
				config.header['Authorization'] = `Bearer ${config.custom.systemToken}`
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
				uni.$tm.toast(response.data.message);
				// 如果是请求分类之后报401说明密码错误，那么清除该密码，下次点击会报403弹窗再次输入密码
				if (response.config.url.indexOf('/api/content/categories') >= 0) {
					const category = getCategoryNameByUrl(response.config.url)
					delCache('APP_CATEGORY_PWD_' + category);
					uni.showToast({
						title: '提示：密码不正确',
						icon: 'none',
						success: () => {
							setTimeout(() => {
								showCategoryInputPasswordModal(response, category);
							}, 800)
						}
					})
				} else {
					// 其他情况维持原来的逻辑
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
				}
				return Promise.reject(response.data);
			} else if (response.data.status == 403) {
				// 如果报403是请求分类文章接口（您没有该分类的访问权限）的话说明是私密分类，需要输入密码请求
				if (response.config.url.indexOf('/api/content/categories') >= 0) {
					const category = getCategoryNameByUrl(response.config.url);
					showCategoryInputPasswordModal(response, category);
				}
				return Promise.reject(response.data);
			} else {
				return Promise.reject(response.data);
			}

		}
	);
};