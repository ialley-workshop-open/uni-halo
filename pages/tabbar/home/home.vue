<template>
	<view class="app-page">
		<tm-menubars iconColor="white" color="white" :flat="true" :showback="false">
			<image slot="left" class="logo ml-24 round-24" :src="bloggerInfo.avatar" mode="scaleToFill" @click="$tm.toast('以后会放一个彩蛋~')"></image>
			<view class="search-input round-12 pt-12 pb-12 flex pl-24" @click="fnToSearch">
				<text class="search-input_icon iconfont text-size-m icon-search text-grey"></text>
				<view class="search-input_text pl-12 text-size-m text-grey">搜索文章...</view>
			</view>
			<!-- #ifdef APP-PLUS || H5 -->
			<view slot="right" class="mr-24 text-size-m text-grey">uni-halo</view>
			<!-- #endif -->
		</tm-menubars>
		<view v-if="loading != 'success'" class="loading-wrap">
			<tm-skeleton model="card"></tm-skeleton>
			<tm-skeleton model="cardActions"></tm-skeleton>
			<tm-skeleton model="list"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
		</view>
		<block v-else>
			<view class="bg-white pb-24">
				<!-- 轮播图+广告 -->
				<view class="banner bg-white ml-24 mr-24 mt-12 round-3" v-if="bannerList.length != 0">
					<e-swiper :dotPosition="globalAppSettings.banner.dotPosition" :autoplay="true" :useDot="globalAppSettings.banner.useDot" :list="bannerList" @on-click="fnOnBannerClick"></e-swiper>
				</view>
				<!-- 快捷导航 -->
				<!-- <view v-if="useQuickNav" class="quick-nav flex-between round-3 flex mt-12 ml-12 mr-12 pa-24">
					<view class="quick-nav-item flex flex-col flex-center" v-for="(nav, index) in quickNavList" :key="index" @click="fnToNavPage(nav)">
						<tm-icons :size="120" :name="nav.icon"></tm-icons>
						<view class="name text-size-s mt-4">{{ nav.text }}</view>
					</view>
				</view> -->
			</view>
			<!-- 精品分类 -->
			<view class="flex flex-between mt-16 mb-24 pl-24 pr-24">
				<view class="page-item_title text-weight-b ">精品分类</view>
				<view class="show-more flex flex-center bg-white round-3" @click="fnToCategoryPage">
					<text class="iconfont icon-angle-right text-size-s text-grey-darken-1"></text>
				</view>
				<view v-if="false" class="flex flex-center text-size-s text-grey-darken-1" @click="fnToCategoryPage">
					<text class=" text-size-m">查看更多</text>
					<text class="iconfont icon-angle-right  text-size-s "></text>
				</view>
			</view>
			<scroll-view class="category" scroll-x="true">
				<view v-if="categoryList.length == 0" class="cate-empty round-3 mr-5 flex flex-center text-grey">还没有任何文章分类~</view>
				<block v-else>
					<view class="content" v-for="(category, index) in categoryList" :key="category.createTime" @click="fnToCategoryBy(category)">
						<category-mini-card :category="category"></category-mini-card>
					</view>
				</block>
			</scroll-view>

			<!-- 最新文章 -->
			<view class="flex flex-between mt-24 mb-24 pl-24 pr-24">
				<view class="page-item_title text-weight-b">最新文章</view>
				<view class="show-more flex flex-center bg-white round-3" @click="fnToArticlesPage">
					<text class="iconfont icon-angle-right text-size-s text-grey-darken-1"></text>
				</view>
				<view v-if="false" class="flex flex-center text-size-s text-grey-darken-1" @click="fnToArticlesPage">
					<text class=" text-size-m ">查看更多</text>
					<text class="iconfont icon-angle-right text-size-s "></text>
				</view>
			</view>
			<view v-if="articleList.length == 0" class="article-empty"><tm-empty icon="icon-shiliangzhinengduixiang-" label="博主还没有发表任何文章~"></tm-empty></view>
			<block v-else>
				<view :class="globalAppSettings.layout.home">
					<block v-for="(article, index) in articleList" :key="article.createTime">
						<tm-translate class="ani-item" animation-name="fadeUp" :wait="calcAniWait(index)">
							<article-card from="home" :article="article" @on-click="fnToArticleDetail"></article-card>
							<!-- 广告区域 -->
							<view v-if="haloAdConfig.home.use && (index + 1) % haloAdConfig.frequency == 0" class="ad-wrap ma-24">
								<!-- #ifdef MP-WEIXIN -->
								<ad v-if="haloAdConfig.unitId" :unit-id="haloAdConfig.unitId"></ad>
								<!-- #endif -->
								<!-- #ifndef MP-WEIXIN -->
								<ad v-if="haloAdConfig.adpid" :adpid="haloAdConfig.adpid"></ad>
								<!-- #endif -->
							</view>
						</tm-translate>
					</block>
				</view>
				<view class="load-text mt-12">{{ loadMoreText }}</view>
				<tm-flotbutton v-if="articleList.length > 10" color="light-blue" @click="fnToTopPage" size="m" icon="icon-angle-up"></tm-flotbutton>
			</block>
		</block>
		<!-- 	<tm-flotbutton @click="fnChangeMode" size="m" color="light-blue" :icon="$tm.vx.state().tmVuetify.black ? 'icon-lightbulb' : 'icon-lightbulb-fill'"></tm-flotbutton> -->
	</view>
</template>

<script>
	import tmMenubars from '@/tm-vuetify/components/tm-menubars/tm-menubars.vue';
	import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
	import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
	import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
	import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';
	import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';

	import eSwiper from '@/components/e-swiper/e-swiper.vue';

	export default {
		components: {
			tmMenubars,
			tmSkeleton,
			tmTranslate,
			tmFlotbutton,
			tmIcons,
			tmEmpty,
			eSwiper
		},
		data() {
			return {
				loading: 'loading',
				queryParams: {
					size: 10,
					page: 0
				},
				result: {},
				isLoadMore: false,
				loadMoreText: '加载中...',
				bannerCurrent: 0,
				bannerList: [],
				noticeList: [],
				articleList: [],
				categoryList: [],
				useQuickNav: false,
				quickNavList: []
			};
		},

		computed: {
			bloggerInfo() {
				let blogger = this.$tm.vx.getters().getBlogger;
				blogger.avatar = this.$utils.checkAvatarUrl(blogger.avatar, true);
				return blogger;
			},

		},
		onLoad() {
			this.fnSetPageTitle();
			this.useQuickNav = this.$haloConfig.quickNav.use;
		},

		created() {
			this.fnQuery();
		},
		onPullDownRefresh() {
			this.isLoadMore = false;
			this.queryParams.page = 0;
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
				this.fnGetBanner();
				this.fnGetArticleList();
				this.fnGetCategoryList();
				this.fnGetQuickNavList();
			},
			fnGetQuickNavList() {
				this.useQuickNav = this.$haloConfig.quickNav.use;
				if (!this.$haloConfig.quickNav.use) return;
				const _quickNavList = this.$haloConfig.quickNav.list;
				this.quickNavList = _quickNavList.map(item => {
					return item;
				});
			},
			fnGetCategoryList() {
				this.$httpApi
					.getCategoryList({ more: true })
					.then(res => {
						this.categoryList = res.data.sort((a, b) => {
							return b.postCount - a.postCount;
						});

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
			},
			// 获取轮播图
			fnGetBanner() {
				const _this = this;
				const _format = function(list, type) {
					return list.map((item, index) => {
						switch (type) {
							case 'list':
								return {
									id: index,
										nickname: _this.bloggerInfo.nickname,
										avatar: _this.bloggerInfo.avatar,
										address: item.href || '',
										title: item.title,
										image: _this.$utils.checkImageUrl(item.thumbnail)
								};
							case 'article':
								return {
									mp4: '',
										id: item.id,
										nickname: _this.bloggerInfo.nickname,
										avatar: _this.bloggerInfo.avatar,
										address: '',
										createTime: uni.$tm.dayjs(item.createTime).fromNow(),
										title: item.title,
										src: _this.$utils.checkImageUrl(item.thumbnail),
										image: _this.$utils.checkImageUrl(item.thumbnail)
								};
							case 'banner':
								return {
									id: '',
										src: item
								};
						}
					});
				};
				switch (this.$haloConfig.banner.type) {
					case 'list': // 手动配置的banner
						this.bannerList = _format(this.$haloConfig.banner.list, 'list');
						break;
					case 'article': // 来自热门文章的封面
						this.$httpApi.getPostList({ page: 0, size: 6, sort: 'topPriority,visits,desc' }).then(res => {
							this.bannerList = _format(res.data.content, 'article');
							if (this.bannerList.length == 0) {
								this.bannerList = _format(this.$haloConfig.banner.list, 'list');
							}
						});
						break;
					case 'banner': // 来自后台配置的banner（暂未开放）
						this.bannerList = _format([], 'banner');
						break;
				}
			},
			fnOnBannerChange(e) {
				this.bannerCurrent = e.current;
			},
			fnOnBannerClick(item) {
				if (item.id == '') return;
				this.fnToArticleDetail(item);
			},
			// 文章列表
			fnGetArticleList() {
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
						this.loading = 'success';
						this.loadMoreText = res.data.hasNext ? '上拉加载更多' : '呜呜，没有更多数据啦~';
						this.result = res.data;
						if (this.isLoadMore) {
							this.articleList = this.articleList.concat(res.data.content);
						} else {
							this.articleList = res.data.content;
						}
						this.loading = 'success';
					})
					.catch(err => {
						this.loading = 'error';
						this.loadMoreText = '加载失败，请下拉刷新！';
						uni.$tm.toast(err.message || '数据加载失败！');
					})
					.finally(() => {
						uni.hideLoading();
						uni.stopPullDownRefresh();
					});
			},

			//跳转文章详情
			fnToArticleDetail(article) {
				uni.navigateTo({
					url: '/pagesA/article-detail/article-detail?articleId=' + article.id,
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
					url: `/pagesA/category-detail/category-detail?slug=${category.slug}&name=${category.name}`
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