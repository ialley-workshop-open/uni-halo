<template>
	<view class="app-page">

		<view v-if="loading != 'success' && articleList.length===0" class="loading-wrap">
			加载中
		</view>
		<block v-else>

			<view v-if="articleList.length == 0" class="article-empty"><tm-empty icon="icon-shiliangzhinengduixiang-"
					label="博主还没有发表任何文章~"></tm-empty></view>
			<block v-else>

				<view style="width: 100%;text-align: center;display: flex;flex-direction: column;align-items: center;"
					v-for="(article, index) in articleList" :key="index">
					<image style="width: 100%;height: 250rpx;" :src="article.cover"></image>
					<view style="margin-top: 12rpx;">{{article.title}}</view>
				</view>
				<view class="load-text mt-12">{{ loadMoreText }}</view>
			</block>
		</block>
	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
				loading: 'loading',
				queryParams: {
					size: 30,
					page: 1
				},
				result: {},
				isLoadMore: false,
				loadMoreText: '加载中...',
				bannerCurrent: 0,
				bannerList: [],
				noticeList: [],
				articleList: [],
				categoryList: [],
			};
		},
		onLoad() {
			this.fnQuery();
		},

		onPullDownRefresh() {
			this.isLoadMore = false;
			this.queryParams.page = 1;
			this.fnQuery();
		},

		onReachBottom(e) {
			if (this.result.hasNext) {
				this.queryParams.page += 1;
				this.isLoadMore = true;
				this.fnGetArticleList();
			} else {
				uni.showToast({
					icon: 'none',
					title: '没有更多数据了'
				});
			}
		},
		methods: {
			fnQuery() {
				this.fnGetArticleList();
			},
			fnOnBannerChange(e) {
				this.bannerCurrent = e.current;
			},
			fnOnBannerClick(item) {
				if (item.id == '') return;
				this.fnToArticleDetail({
					metadata: {
						name: item.id
					}
				});
			},
			fnGetArticleList() {

				// 设置状态为加载中
				if (!this.isLoadMore) {
					this.loading = 'loading';
				}
				this.loadMoreText = '加载中...';
				const list = new Array(30).fill(10).map(item => {
					return {
						title: '红红火火恍恍惚惚哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈发放',
						cover: 'https://blog.925i.cn/upload/房间%20少女%20蓝色眼睛%20夏天的裙子%20室内绿色植物%20动漫壁纸_彼岸壁纸.webp'
					}
				})

				setTimeout(() => {
					setTimeout(() => {
						this.result = {
							hasNext: true
						};

						if (this.isLoadMore) {
							this.articleList = this.articleList.concat(list);
						} else {
							this.articleList = list;
						}
					}, 200)
					this.loading = 'success';
					this.loadMoreText = this.result ? '上拉加载更多' : '呜呜，没有更多数据啦~';
					uni.hideLoading();
					uni.stopPullDownRefresh();
				}, 300)


			},

			//跳转文章详情
			fnToArticleDetail(article) {
				uni.navigateTo({
					url: '/pagesA/article-detail/article-detail?name=' + article.metadata.name,
					animationType: 'slide-in-right'
				});
			},
			// 快捷导航页面跳转
			fnToNavPage(item) {
				switch (item.type) {
					case 'tabbar':
						uni.switchTab({
							url: item.path
						});
						break;
					case 'page':
						uni.navigateTo({
							url: item.path
						});
						break;
				}
			},
			// 分类页面
			fnToCategoryPage() {
				uni.switchTab({
					url: '/pages/tabbar/category/category'
				});
			},
			// 所有的文章列表页面
			fnToArticlesPage() {
				uni.navigateTo({
					url: '/pagesA/articles/articles'
				});
			},

			// 根据slug查询分类下的文章
			fnToCategoryBy(category) {
				uni.navigateTo({
					url: `/pagesA/category-detail/category-detail?name=${category.metadata.name}&title=${category.spec.displayName}`
				});
			},

			fnChangeMode() {
				const isBlackTheme = this.$tm.vx.state().tmVuetify.black;
				this.$tm.theme.setBlack(!isBlackTheme);
				uni.setNavigationBarColor({
					backgroundColor: !isBlackTheme ? '#0a0a0a' : '#ffffff',
					frontColor: !isBlackTheme ? '#ffffff' : '#0a0a0a'
				});
			},

			fnToSearch() {
				uni.navigateTo({
					url: '/pagesA/articles/articles'
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
		// background-color: #ffffff;

		.logo {
			width: 60rpx;
			height: 60rpx;
			box-sizing: border-box;
		}

		::v-deep {
			.tm-menubars .body .body_wk .left {
				min-width: initial;
			}
		}
	}

	.loading-wrap {
		padding: 24rpx;
	}

	.search-input {
		background-color: #f5f5f5;
		align-items: center;
		/* #ifdef MP-WEIXIN */
		margin-right: 24rpx;

		/* #endif */
		&_icon {}

		&_text {}
	}

	.show-more {
		width: 42rpx;
		height: 42rpx;
		box-sizing: border-box;
		box-shadow: 0rpx 0rpx 24rpx rgba(0, 0, 0, 0.03);
	}

	.banner {
		overflow: hidden;
	}

	.quick-nav {
		background-color: #fff;
		box-sizing: border-box;

		// box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.03);
		.name {
			color: var(--main-text-color);
		}
	}

	.category {
		width: 94vw;
		display: flex;
		height: 200rpx;
		white-space: nowrap;
		margin: 0 24rpx;

		.content {
			display: inline-block;
			padding-left: 24rpx;

			&:first-child {
				padding-left: 0;
			}
		}

		.cate-empty {
			height: inherit;
		}
	}

	.page-item {
		&_title {
			position: relative;
			padding-left: 24rpx;
			font-size: 32rpx;
			z-index: 1;
			color: var(--main-text-color);

			&:before {
				content: '';
				position: absolute;
				left: 0rpx;
				top: 8rpx;
				width: 8rpx;
				height: 30rpx;
				background-color: rgba(33, 150, 243, 1);
				border-radius: 6rpx;
				z-index: 0;
			}
		}
	}

	.h_row_col2 {
		display: flex;
		flex-wrap: wrap;
		box-sizing: border-box;
		padding: 0 12rpx;

		.ani-item {
			width: 50%;
		}
	}
</style>