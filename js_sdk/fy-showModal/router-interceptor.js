/**
 * @author 大雄
 * @Date 2021年7月1日20:49:58
 * @description 路由导航守卫（简单版，后续需要功能再完善）
 */
export default function() {
	// 监听路由前进
	function routerPush({ type = 'navigateTo' } = {}) {
		routeWatchClearModal();
	}
	// 监听路由后退
	function routerBack() {
		routeWatchClearModal();
	}

	// 页面跳转后，销毁当前页面未关闭的弹框
	function routeWatchClearModal() {
		try {
			var FyShowModalView = plus.nativeObj.View.getViewById("FyShowModalView");
			if (FyShowModalView) {
				FyShowModalView.clear();
			}
			var FyShowModalCancel = plus.nativeObj.View.getViewById("FyShowModalCancel");
			if (FyShowModalCancel) {
				FyShowModalCancel.clear();
			}
			var FyShowModalConfirm = plus.nativeObj.View.getViewById("FyShowModalConfirm");
			if (FyShowModalConfirm) {
				FyShowModalConfirm.clear();
			}
		} catch(err) {
			console.log(err);
		}
	}
	
	uni.addInterceptor('navigateTo', {
		success(e) {
			routerPush({ type: 'navigateTo' });
		}
	})
	uni.addInterceptor('redirectTo', {
		success(e) {
			routerPush({ type: 'redirectTo' });
		}
	})
	uni.addInterceptor('reLaunch', {
		success(e) {
			routerPush({ type: 'reLaunch' });
		}
	})
	uni.addInterceptor('switchTab', {
		success(e) {
			routerPush({ type: 'switchTab' });
		}
	})
	uni.addInterceptor('navigateBack', {
		success(e) {
			routerBack();
		}
	})
	
}