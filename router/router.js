// router.js
import {
	RouterMount,
	createRouter
} from 'uni-simple-router';

const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,
	routes: [...ROUTES]
});

import {
	wxLogin,
	appWxLogin
} from '@/api/login.js'

import {
	checkHasWxLogin,
	checkHasAdminLogin
} from '@/utils/auth.js'

//全局路由前置守卫
router.beforeEach((to, from, next) => {
	// 管理页面：超管
	if (to.meta && to.meta.auth == 'admin') {
		if (checkHasAdminLogin()) {
			next()
		} else {
			uni.$eShowModal({
				title: '提示',
				content: '未登录超管账号或登录状态已过期，是否立即登录？',
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
			next(false)
		}
	}
	// 普通用户需要登录
	else if (to.meta && to.meta.auth == 'login') {
		if (checkHasWxLogin()) {
			next()
		} else {
			uni.$eShowModal({
				title: '提示',
				content: `主人，您好像还没有登录呢？`,
				showCancel: true,
				cancelText: '取消',
				cancelColor: '#999999',
				confirmText: '登录',
				confirmColor: '#03a9f4'
			}).then(res => {
				// #ifdef APP-PLUS
				appWxLogin()
				// #endif
				// #ifdef MP-WEIXIN
				wxLogin()
				// #endif
				// #ifndef APP-PLUS||MP-WEIXIN

				// #endif
			}).catch(err => {})
			next(false)
		}
	} else {
		next();
	}
});
// 全局路由后置守卫
router.afterEach((to, from) => {
	console.log('跳转结束')
})

export {
	router,
	RouterMount
}
