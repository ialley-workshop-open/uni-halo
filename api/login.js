/**
 * 普通用户登录
 */

// 获取用户信息
export function getUserInfo() {
	return new Promise((resolve, reject) => {
		uni.getUserProfile({
			lang: 'zh_CN',
			desc: '用户登录', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，
			success: (res) => {
				console.log(res, 'resss')
				resolve(res.userInfo)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

export function getLogin() {
	return new Promise((resolve, reject) => {
		uni.login({
			success(res) {
				console.log('----------getLogin ---------')
				console.log(res)
				resolve(res)
			},
			fail: (err) => {
				console.log(err, 'logoer')
				reject(err)
			}
		})
	})
}

export function wxLogin() {
	uni.getProvider({
		service: 'oauth',
		success: function(res) {
			//支持微信、qq和微博等
			if (~res.provider.indexOf('weixin')) {
				console.log(res, 'ress')
				let _userInfo = getUserInfo();
				let _loginRes = getLogin();
				Promise.all([_userInfo, _loginRes]).then((res) => {
					let userInfo = res[0];
					let loginRes = res[1];
					if (loginRes.errMsg == 'login:ok') {
						uni.$tm.vx.commit('user/setWxLoginInfo', {
							avatarUrl: userInfo.avatarUrl,
							nickName: userInfo.nickName,
							email: '',
							url: ''
						});
						uni.showToast({
							icon: 'none',
							title: '登录成功！'
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: '登录失败，请重试！'
						})
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: '登录失败，请重试！'
					})
				})
			}
		},
		fail: function(err) {
			uni.showToast({
				icon: 'none',
				title: '登录失败，请重试！'
			})
		}
	})
}

export function appWxLogin() {
	uni.login({
		provider: 'weixin',
		success: function(loginRes) {
			// 获取用户信息
			uni.getUserInfo({
				provider: 'weixin',
				success: function(infoRes) {
					uni.$tm.vx.commit('user/setWxLoginInfo', {
						avatarUrl: infoRes.userInfo.avatarUrl,
						nickName: infoRes.userInfo.nickName,
						email: '',
						url: ''
					});
					uni.showToast({
						icon: 'none',
						title: '登录成功！'
					})
				},
				fail: function(err) {
					uni.showToast({
						icon: 'none',
						title: '登录失败，请重试！'
					})
				}
			});
		}
	});
}
