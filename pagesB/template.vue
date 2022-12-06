<template>
	<view class="app-page flex flex-col">
		<view v-if="loading != 'success'" class="loading-wrap">
			<block v-if="loading == 'loading'">
				<tm-skeleton model="card"></tm-skeleton>
				<tm-skeleton model="cardActions"></tm-skeleton>
				<tm-skeleton model="list"></tm-skeleton>
				<tm-skeleton model="listAvatr"></tm-skeleton>
				<tm-skeleton model="listAvatr"></tm-skeleton>
				<tm-skeleton model="listAvatr"></tm-skeleton>
			</block>
			<view v-else-if="loading == 'error'" class="loading-error flex flex-col flex-center">
				<tm-empty icon="icon-wind-cry" label="加载失败"><tm-button theme="light-blue" size="m" @click="fnGetData()">重新加载</tm-button></tm-empty>
			</view>
		</view>
		<block v-else><!-- 内容区域 --></block>
	</view>
</template>

<script>
import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
export default {
	components: {
		tmSkeleton,
		tmButton,
		tmEmpty
	},
	data() {
		return {
			loading: 'loading',
			queryParams: {
				size: 10,
				page: 0
			},
			result: null
		};
	},

	onLoad() {
		this.fnSetPageTitle();
	},
	created() {
		this.fnGetData();
	},
	onPullDownRefresh() {
		this.fnGetData();
	},
	methods: {
		fnGetData() {
			this.loading = 'loading';
			uni.showLoading({
				mask: true,
				title: '加载中...'
			});
			this.$httpApi.admin
				.getAttachmentsByPage(this.queryParams)
				.then(res => {
					console.log('请求结果：');
					console.log(res);
					// this.result = res.data.xxx;
					setTimeout(() => {
						this.loading = 'success';
					}, 500);
				})
				.catch(err => {
					console.error(err);
					this.loading = 'error';
				})
				.finally(() => {
					setTimeout(() => {
						uni.hideLoading();
						uni.stopPullDownRefresh();
					}, 500);
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.app-page {
	width: 100vw;
	min-height: 100vh;
}
.loading-wrap {
	padding: 24rpx;
	.loading-error {
		height: 65vh;
	}
}
</style>
