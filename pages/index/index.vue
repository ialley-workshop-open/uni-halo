<template>
	<view class="app-page"></view>
</template>

<script>
export default {
	onLoad() {
		this.fnCheckHadStarted();
	},
	methods: {
		// 检查是否已经启动过
		fnCheckHadStarted() {
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
