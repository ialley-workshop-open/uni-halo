<template>
	<view class="app-page">
		<view v-if="loading != 'success'" class="loading-wrap">
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
		</view>
		<view v-else class="content flex">
			<view v-if="categoryList.length == 0" class="category-empty flex flex-center">
				<tm-empty icon="icon-shiliangzhinengduixiang-" label="博主还没有文章分类~"></tm-empty>
			</view>
			<block v-else>
				<tm-sliderNav :list="categoryList" color="light-blue" rang-key="name" @change="fnOnCategoryChange"></tm-sliderNav>
				<scroll-view
					class="right-content pt-12 pb-12"
					:scroll-y="true"
					:scroll-top="scrollTop"
					:scroll-with-animation="true"
					:refresher-enabled="true"
					:refresher-triggered="triggered"
					:refresher-threshold="60"
					@refresherrefresh="fnGetData(true)"
					@scrolltolower="fnGetData(false)"
					@scroll="fnOnScroll"
				>
					<view v-if="dataList.length == 0" class="article-empty flex flex-center">
						<tm-empty icon="icon-shiliangzhinengduixiang-" label="该分类下暂无文章~"></tm-empty>
					</view>

					<block v-else>
						<block v-for="(article, index) in dataList" :key="article.createTime">
							<!-- 文章卡片 -->
							<tm-translate animation-name="fadeUp" :wait="(index + 1) * 50">
								<article-min-card :article="article" @on-click="fnToArticleDetail"></article-min-card>
							</tm-translate>
						</block>
						<view class="load-text">{{ loadMoreText }}</view>
					</block>
				</scroll-view>
			</block>
		</view>
		<tm-flotbutton v-if="dataList.length > 10" color="light-blue" @click="fnToTopScroll" size="m" icon="icon-angle-up"></tm-flotbutton>
	</view>
</template>

<script>
import throttle from '@/utils/throttle.js';
import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
import tmFlowLayout from '@/tm-vuetify/components/tm-flowLayout/tm-flowLayout.vue';
import tmSliderNav from '@/tm-vuetify/components/tm-sliderNav/tm-sliderNav.vue';

import ArticleMinCard from '@/components/article-min-card/article-min-card.vue';
export default {
	components: {
		tmSkeleton,
		tmTranslate,
		tmFlotbutton,
		tmEmpty,
		tmFlowLayout,
		tmSliderNav,
		ArticleMinCard
	},
	data() {
		return {
			loading: 'loading',
			queryParams: {
				size: 10,
				page: 0,
				slug: ''
			},
			categoryList: [],
			result: null,
			dataList: [],
			isLoadMore: false,
			loadMoreText: '',
			scrollTop: 0,
			triggered: false
		};
	},

	onLoad() {
		this.fnSetPageTitle('文章分类');
		this.fnGetAllCategory();
	},
	onPullDownRefresh() {
		this.queryParams.page = 0;
		this.isLoadMore = false;
		this.fnGetData();
	},
	onReachBottom(e) {
		if (this.result.hasNext) {
			this.queryParams.page += 1;
			this.isLoadMore = true;
			this.fnGetData(false);
		} else {
			uni.showToast({
				icon: 'none',
				title: '没有更多数据了'
			});
		}
	},
	methods: {
		fnOnCategoryChange(e) {
			this.queryParams.slug = this.categoryList[e].slug;
			this.fnToTopScroll();
			this.dataList = [];
			this.fnGetData();
		},

		fnGetAllCategory() {
			this.loading = 'loading';
			uni.showLoading({
				mask: true,
				title: '加载中...'
			});
			this.$httpApi
				.getCategoryList({ more: true })
				.then(res => {
					this.categoryList = res.data;
					if (res.data.length != 0) {
						this.queryParams.slug = res.data[0].slug;
						this.triggered = false;
						this.loading = 'success';
						this.fnGetData(true, false);
					}
				})
				.catch(err => {
					console.error(err);
					this.loading = 'error';
				})
				.finally(() => {
					uni.hideLoading();
					uni.stopPullDownRefresh();
				});
		},
		fnGetData(isPulldownRefresh = true, triggered = true) {
			if (!isPulldownRefresh) {
				if (this.result.hasNext) {
					this.queryParams.page += 1;
				} else {
					return uni.showToast({
						icon: 'none',
						title: '没有更多数据了'
					});
				}
			} else {
				this.queryParams.page = 0;
				if (triggered) {
					this.triggered = true;
				}
			}

			this.$httpApi
				.getCategoryPostList(this.queryParams.slug, this.queryParams)
				.then(res => {
					this.result = res.data;

					if (!isPulldownRefresh) {
						this.dataList = this.dataList.concat(res.data.content);
					} else {
						this.dataList = res.data.content;
					}
					this.loadMoreText = res.data.hasNext ? '上拉加载更多' : '呜呜，没有更多数据啦~';
				})
				.catch(err => {
					this.loadMoreText = '加载失败！';
				})
				.finally(() => {
					this.triggered = false;
				});
		},
		//跳转文章详情
		fnToArticleDetail(article) {
			uni.navigateTo({
				url: '/pagesA/article-detail/article-detail?articleId=' + article.id,
				animationType: 'slide-in-right'
			});
		},
		fnOnScroll(e) {
			throttle(() => {
				this.scrollTop = e.detail.scrollTop;
			}, 1000);
		},
		fnToTopScroll() {
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 500
			});
			this.scrollTop = 0;
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
	background-color: #fff;
}
.content {
	height: 100vh;
	background-color: #fafafa;
}
.category-empty {
	width: 100%;
	height: 70vh;
}
.article-empty {
	width: 100%;
	height: 70vh;
}
.right-content {
	// width: calc(100vw - 144rpx);
	width: calc(100vw - 190rpx);
	height: 100vh;
	background-color: #fff;
	white-space: nowrap;
}
.loading-wrap {
	padding: 24rpx;
}
</style>
