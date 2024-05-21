<template>
	<view class="app-page"></view>
</template>

<script>
	export default {
		onLoad() {
			this.fnCheckShowStarted();
		},
		methods: {
			// 检查是否需要跳转到启动页
			fnCheckShowStarted() {
				if (!getApp().globalData.start.use) {
					uni.switchTab({
						url: '/pages/tabbar/home/home'
					});
					return;
				}
				if (uni.getStorageSync('APP_HAS_STARTED')) {
					uni.switchTab({
						url: '/pages/tabbar/home/home'
					});
				} else {
					uni.redirectTo({
						url: '/pagesA/start/start'
					});
				}
			}
		}
	};
</script>