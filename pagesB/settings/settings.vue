<template>
	<view class="app-page flex flex-col">
		<view class="content"><!-- 内容区域 --></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			loading: 'loading',
			result: null
		};
	},
	created() {
		this.fnGetData();
	},
	methods: {
		fnGetData() {
			// todo:
		}
	}
};
</script>

<style scoped lang="scss">
.app-page {
	width: 100vw;
}
</style>
