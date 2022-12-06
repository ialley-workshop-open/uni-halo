<template>
	<view class="app-page">
		<view v-if="loading != 'success'" class="loading-wrap">
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
		</view>
		<!-- 内容区域 -->
		<view v-else class="app-page-content">
			<view v-if="dataList.length == 0" class="content-empty flex flex-center">
				<!-- 空布局 -->
				<tm-empty icon="icon-shiliangzhinengduixiang-" label="该分类下暂无数据"></tm-empty>
			</view>
			<block v-else>
				<block v-for="(item, index) in dataList" :key="index">
					<!--  卡片 -->
					<tm-translate animation-name="fadeUp" :wait="(index + 1) * 50">
						<!-- 列表项 -->
						{{ item }}
					</tm-translate>
				</block>
				<tm-flotbutton @click="fnToTopPage" size="m" color="light-blue" icon="icon-angle-up"></tm-flotbutton>
				<view class="load-text">{{ loadMoreText }}</view>
			</block>
		</view>
	</view>
</template>

<script>
import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
export default {
	components: {
		tmSkeleton,
		tmFlotbutton,
		tmTranslate,
		tmEmpty
	},
	data() {
		return {
			loading: 'loading',
			queryParams: {
				size: 10,
				page: 0
			},
			result: null,
			dataList: [],
			isLoadMore: false,
			loadMoreText: '加载中...'
		};
	},

	onLoad() {
		this.fnSetPageTitle();
	},
	created() {
		this.fnGetData();
	},
	onPullDownRefresh() {
		this.isLoadMore = false;
		this.queryParams.page = 0;
		this.fnGetData();
	},

	onReachBottom(e) {
		if (this.result.hasNext) {
			this.queryParams.page += 1;
			this.isLoadMore = true;
			this.fnGetData();
		} else {
			uni.showToast({
				icon: 'none',
				title: '没有更多数据了'
			});
		}
	},
	methods: {
		fnGetData() {
			return;
			uni.showLoading({
				mask: true,
				title: '加载中...'
			});
			// 设置状态为加载中
			if (!this.isLoadMore) {
				this.loading = 'loading';
			}
			this.loadMoreText = '加载中...';
			this.$httpApi
				.getXXX(this.queryParams)
				.then(res => {
					console.log('请求结果：');
					console.log(res);

					this.loading = 'success';
					this.loadMoreText = res.data.hasNext ? '上拉加载更多' : '呜呜，没有更多数据啦~';
					// 处理数据
					this.result = res.data;
					if (this.isLoadMore) {
						this.dataList = this.dataList.concat(res.data.content);
					} else {
						this.dataList = res.data.content;
					}
				})
				.catch(err => {
					console.error(err);
					this.loading = 'error';
					this.loadMoreText = '加载失败，请下拉刷新！';
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
	display: flex;
	flex-direction: column;
	padding: 24rpx 0;
	padding-bottom: 144rpx;
}
.loading-wrap {
	padding: 24rpx;
}
</style>
