/**
 * 检查微信小程序更新
 */
export const CheckWxUpdate = (useTip = false) => {
	if (uni.canIUse('getUpdateManager')) {
		const updateManager = wx.getUpdateManager();
		updateManager && updateManager.onCheckForUpdate((res) => {
			if (res.hasUpdate) {
				updateManager.onUpdateReady(() => {
					uni.showModal({
						title: '更新提示',
						content: '新版本已经准备就绪，是否需要重新启动应用？',
						success: (res) => {
							if (res.confirm) {
								uni.clearStorageSync() // 更新完成后刷新storage的数据
								updateManager.applyUpdate()
							}
						}
					})
				})

				updateManager.onUpdateFailed(() => {
					uni.showModal({
						title: '已有新版本上线',
						content: '小程序自动更新失败，请删除该小程序后重新搜索打开哟~~~',
						showCancel: false
					})
				})
			} else {
				if (useTip) {
					//没有更新
					uni.showToast({
						icon: 'none',
						title: '已经是最新版本！'
					})
				}
			}
		})
	} else {

		uni.showModal({
			title: '提示',
			content: '当前微信版本过低，无法使用该功能，请更新到最新的微信后再重试。',
			showCancel: false
		})
	}
}
