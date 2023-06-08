<template>
	<view class="app-page" :class="{ 'is-balck grey-darken-6': isBlackTheme }">
		<!-- 顶部切换 -->
		<view class="e-fixed shadow-2">
			<tm-search v-model="queryParams.keyword" :round="24" :shadow="0" color="light-blue" insert-color="light-blue" :clear="true" @confirm="fnOnSearch"></tm-search>
			<tm-tabs color="light-blue" :shadow="0" v-model="tab.activeIndex" :list="tab.list" align="center" @change="fnOnTabChange"></tm-tabs>
		</view>
		<!-- 占位区域 -->
		<view style="width: 100vw;height: 184rpx;"></view>
		<!-- 加载区域 -->
		<view v-if="loading != 'success'" class="loading-wrap pa-24">
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
		</view>
		<!-- 内容区域 -->
		<view v-else class="content">
			<view v-if="dataList.length == 0" class="content-empty flex flex-center">
				<!-- 空布局 -->
				<tm-empty icon="icon-shiliangzhinengduixiang-" label="该分类下暂无数据"></tm-empty>
			</view>
			<block v-else>
				<block v-for="(article, index) in dataList" :key="article.id">
					<!-- 文章卡片 -->
					<tm-translate animation-name="fadeUp" :wait="calcAniWait(index)">
						<article-card :article="article" @on-click="fnToArticleDetail"></article-card>
						<!-- 广告区域 -->
						<view v-if="haloAdConfig.articles.use && (index + 1) % haloAdConfig.frequency == 0" class="ad-wrap ma-24">
							<!-- #ifdef MP-WEIXIN -->
							<ad v-if="haloAdConfig.unitId" :unit-id="haloAdConfig.unitId"></ad>
							<!-- #endif -->
							<!-- #ifndef MP-WEIXIN -->
							<ad v-if="haloAdConfig.adpid" :adpid="haloAdConfig.adpid"></ad>
							<!-- #endif -->
						</view>
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
	import tmSearch from '@/tm-vuetify/components/tm-search/tm-search.vue';
	import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
	import tmTabs from '@/tm-vuetify/components/tm-tabs/tm-tabs.vue';
	import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
	import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';

	export default {
		components: {
			tmSkeleton,
			tmSearch,
			tmTranslate,
			tmTabs,
			tmFlotbutton,
			tmEmpty
		},
		data() {
			return {
				isBlackTheme: false,
				loading: 'loading',
				tab: {
					activeIndex: 0,
					list: ['全部', '最新文章', '热门文章', '最近更新', '最多点赞']
				},
				queryParams: {
					size: 10,
					page: 0,
					sort: 'topPriority,createTime,desc',
					keyword: ''
				},
				cache: {
					dataList: [],
					total: 0
				},
				isLoadMore: false,
				loadMoreText: '加载中...',
				result: {},
				dataList: []
			};
		},
		onLoad() {
			this.fnSetPageTitle('文章列表');
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
			fnOnTabChange(index) {
				this.fnResetSetAniWaitIndex();
				this.dataList = [];
				const _sorts = {
					0: '',
					1: 'topPriority,createTime,desc',
					2: 'topPriority,visits,desc',
					3: 'topPriority,updateTime,desc',
					4: 'topPriority,likes,desc'
				};
				this.queryParams.sort = _sorts[index];
				this.queryParams.page = 0;
				this.dataList = [];
				this.fnToTopPage();
				this.fnGetData();
			},
			fnOnSearch() {
				this.fnResetSetAniWaitIndex();
				this.queryParams.page = 0;
				this.isLoadMore = false;
				this.fnGetData();
			},
			fnGetData() {
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
					.getPostList(this.queryParams)
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
						}, 800);
					});
			},

			//跳转文章详情
			fnToArticleDetail(article) {
				uni.navigateTo({
					url: '/pagesA/article-detail/article-detail?articleId=' + article.id,
					animationType: 'slide-in-right'
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.app-page {
		width: 100vw;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		padding-bottom: 24rpx;
		background-color: #fafafd;

		&.is-balck {
			background-color: #212121;
		}
	}

	.content {
		padding-top: 24rpx;

		.content-empty {
			height: 60vh;
		}
	}
</style>