<template>
	<view class="app-page">
		<tm-menubars iconColor="white" color="white" :flat="true" :showback="false">
			<view slot="left">
				<image @click="fnOnLogoToPage" class="logo ml-24 round-24" :src="appInfo.logo" mode="scaleToFill" />
			</view>
			<view class="search-input round-12 pt-12 pb-12 flex pl-24" @click="fnToSearch">
				<text class="search-input_icon iconfont text-size-m icon-search text-grey"></text>
				<view class="search-input_text pl-12 text-size-m text-grey">搜索内容...</view>
			</view>
			<!-- #ifdef APP-PLUS || H5 -->
			<view slot="right" class="mr-24 text-size-m text-grey text-overflow">{{ appInfo.name }}</view>
			<!-- #endif -->
		</tm-menubars>
		<view v-if="loading !== 'success' && articleList.length===0" class="loading-wrap">
			<tm-skeleton model="card"></tm-skeleton>
			<tm-skeleton model="cardActions"></tm-skeleton>
			<tm-skeleton model="list"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
		</view>
		<block v-else>
			<view v-if="bannerConfig.enabled" class="bg-white pb-24">
				<view class="banner bg-white ml-24 mr-24 mt-12 round-3" v-if="bannerList.length !== 0">
					<e-swiper :height="bannerConfig.height" :dotPosition="bannerConfig.dotPosition" :autoplay="true"
						:useDot="bannerConfig.showIndicator" :showTitle="bannerConfig.showTitle"
						:type="bannerConfig.type" :list="bannerList" @on-click="fnOnBannerClick" />
				</view>
			</view>

			<!-- 金刚区 :v-if="navList.filter(x=>x.show).length>=4" -->
      <view v-if="calcIsShowQuickNavigationEnabled && !!navList.filter(x=>x.show).length" class="nav-box mt-16 mb-24 pl-24 pr-24 uh-py-12">
				<view class="page-item_title text-weight-b ">快捷导航</view>
				<view class="nav-list flex uh-mt-12">
					<template v-for="(item,index) in navList">
						<view v-if="item.show" class="nav-item" :key="index" @click="fnClickNav(item)">
							<!-- :class="[item.bgClass]" -->
							<view class="nav-item-icon" :style="{
								'--bgColor':item.bgColor,
								boxShadow: '0rpx 0rpx 6rpx ' + item.shadow,
								backgroundColor: item.bgColor
							}">
								<tm-icons :size="48" color="white" prefx="halocoloricon" :name="item.icon"></tm-icons>
							</view>
							<view class="nav-item-text">
								{{item.title}}
							</view>
						</view>
					</template>
				</view>
			</view>

			<!-- 精品分类 -->
			<block v-if="calcIsShowCategory">
				<view class="flex flex-between mt-16 mb-24 pl-24 pr-24">
					<view class="page-item_title text-weight-b ">精选分类</view>
					<view class="show-more flex flex-center bg-white round-3" @click="fnToCategoryPage">
						<text class="iconfont icon-angle-right text-size-s text-grey-darken-1"></text>
					</view>
					<view v-if="false" class="flex flex-center text-size-s text-grey-darken-1"
						@click="fnToCategoryPage">
						<text class=" text-size-m">查看更多</text>
						<text class="iconfont icon-angle-right  text-size-s "></text>
					</view>
				</view>
				<scroll-view class="category" scroll-x="true">
					<view v-if="categoryList.length === 0" class="cate-empty round-3 mr-5 flex flex-center text-grey">
						还没有任何分类~
					</view>
					<block v-else>
						<view class="content" v-for="(category, index) in categoryList" :key="category.metadata.name"
							@click="fnToCategoryBy(category)">
							<category-mini-card :category="category"></category-mini-card>
						</view>
					</block>
				</scroll-view>
			</block>

			<!-- 最新文章 -->
			<view class="flex flex-between mt-24 mb-24 pl-24 pr-24">
				<view class="page-item_title text-weight-b">最新列表</view>
				<view class="show-more flex flex-center bg-white round-3" @click="fnToArticlesPage">
					<text class="iconfont icon-angle-right text-size-s text-grey-darken-1"></text>
				</view>
				<view v-if="false" class="flex flex-center text-size-s text-grey-darken-1" @click="fnToArticlesPage">
					<text class=" text-size-m ">查看更多</text>
					<text class="iconfont icon-angle-right text-size-s "></text>
				</view>
			</view>
			<view v-if="articleList.length === 0" class="article-empty">
				<tm-empty icon="icon-shiliangzhinengduixiang-" label="博主还没有发表任何内容~"></tm-empty>
			</view>
			<block v-else>
				<view :class="globalAppSettings.layout.home">
					<tm-translate v-for="(article, index) in articleList" :key="index" class="ani-item"
						animation-name="fadeUp" :wait="calcAniWait(index)">
						<article-card from="home" :article="article" :post="article"
							@on-click="fnToArticleDetail"></article-card>
					</tm-translate>
				</view>
				<view class="load-text mt-12">{{ loadMoreText }}</view>
				<tm-flotbutton v-if="articleList.length > 10" :width="90" color="light-blue" @click="fnToTopPage"
					size="s" icon="icon-angle-up"></tm-flotbutton>
			</block>
		</block>


		<!-- 弹窗 -->
		<NotifyDialog v-if="notify.show" :show="notify.show" :title="notify.data.title" :content="notify.data.content"
			:url="notify.data.url" @on-change="fnOnNotifyChange"></NotifyDialog>
	</view>
</template>

<script>
	import tmMenubars from '@/tm-vuetify/components/tm-menubars/tm-menubars.vue';
	import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
	import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
	import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
	import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';
	import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
	import tmGrid from '@/tm-vuetify/components/tm-grid/tm-grid.vue';

	import eSwiper from '@/components/e-swiper/e-swiper.vue';
	import NotifyDialog from "@/components/notify-dialog/notify-dialog.vue";
	import qs from 'qs'

	export default {
		components: {
			tmMenubars,
			tmSkeleton,
			tmTranslate,
			tmFlotbutton,
			tmIcons,
			tmEmpty,
			tmGrid,
			eSwiper,
			NotifyDialog
		},
		data() {
			return {
				loading: 'loading',
				queryParams: {
					size: 5,
					page: 1,
					sort: ['spec.pinned,desc', 'spec.publishTime,desc']
				},
				result: {},
				isLoadMore: false,
				loadMoreText: '加载中...',
				bannerCurrent: 0,
				bannerList: [],
				noticeList: [],
				articleList: [],
				categoryList: [],
				notify: {
					show: false,
					data: {}
				},
				navList: []
			};
		},
		computed: {
			haloConfigs() {
				return this.$tm.vx.getters().getConfigs;
			},
			bloggerInfo() {
				const blogger = this.$tm.vx.getters().getConfigs.authorConfig.blogger;
				blogger.avatar = this.$utils.checkAvatarUrl(blogger.avatar, true);
				return blogger;
			},
			appInfo() {
				const appInfo = this.haloConfigs.appConfig.appInfo;
				appInfo.logo = this.$utils.checkImageUrl(appInfo.logo)
				return appInfo;
			},
			mockJson() {
				return this.$tm.vx.getters().getMockJson;
			},
			calcAuditModeEnabled() {
				return this.haloConfigs.auditConfig.auditModeEnabled
			},
			calcIsShowQuickNavigationEnabled() {
				console.log('this.haloConfigs?.pageConfig?.homeConfig', this.haloConfigs?.pageConfig?.homeConfig, !!this.haloConfigs?.pageConfig?.homeConfig?.useQuickNavigation)
				return !!this.haloConfigs?.pageConfig?.homeConfig?.useQuickNavigation
			},
			calcIsShowCategory() {
				if (this.calcAuditModeEnabled && this.categoryList.length !== 0) {
					return false
				}
				if (this.calcAuditModeEnabled) {
					return false
				}
				return this.haloConfigs.pageConfig.homeConfig.useCategory
			},
			bannerConfig() {
				return this.haloConfigs.pageConfig.homeConfig.bannerConfig
			}
		},
		watch: {
			haloConfigs: {
				handler(val) {
					if (!val) return;
					this.fnGetNavList();
				},
				deep: true,
				immediate: true,
			}
		},
		onLoad() {
			this.fnSetPageTitle();
		},
		created() {
			this.fnQuery();
		},
		onPullDownRefresh() {
			this.isLoadMore = false;
			this.queryParams.page = 1;
			this.fnQuery();
		},
		onReachBottom(e) {
			if (this.calcAuditModeEnabled) {
				uni.showToast({
					icon: 'none',
					title: '没有更多数据了'
				});
				return
			}
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
			},
			fnGetCategoryList() {
				if (this.calcAuditModeEnabled) {
					this.categoryList = this.mockJson.home.categoryList.map((item) => {
						return {
							metadata: {
								name: Date.now() * Math.random(),
							},
							spec: {
								displayName: item.title,
								cover: item.cover
							},
							postCount: 0
						}
					});
					return;
				}

				if (!this.calcIsShowCategory) {
					return;
				}

				this.$httpApi.v2
					.getCategoryList({
						fieldSelector: ['spec.hideFromList=false']
					})
					.then(res => {
						this.categoryList = res.items.sort((a, b) => {
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
				if (this.calcAuditModeEnabled) {
					this.bannerList = this.mockJson.home.bannerList.map((item) => {
						return {
							mp4: '',
							id: Date.now() * Math.random(),
							nickname: this.haloConfigs.authorConfig.blogger.nickname,
							avatar: this.$utils.checkAvatarUrl(this.haloConfigs.authorConfig.blogger.avatar),
							address: '',
							createTime: item.time,
							title: item.title,
							src: this.$utils.checkThumbnailUrl(item.cover),
							image: this.$utils.checkThumbnailUrl(item.cover),
							type: "custom",
							content: "",
							url: ""
						}
					});
					return;
				}


				if (!this.bannerConfig.enabled) return;

				if (this.bannerConfig.type === 'custom') {
					this.bannerList = this.bannerConfig.list.map((item) => {
						return {
							mp4: '',
							id: Date.now() * Math.random(),
							nickname: this.haloConfigs.authorConfig.blogger.nickname,
							avatar: this.$utils.checkAvatarUrl(this.haloConfigs.authorConfig.blogger.avatar),
							address: '',
							createTime: "",
							title: item.title,
							src: this.$utils.checkThumbnailUrl(item.cover),
							image: this.$utils.checkThumbnailUrl(item.cover),
							type: "custom",
							content: item.content,
							url: item.url
						}
					})
					return;
				}

				const paramsStr = qs.stringify(this.queryParams, {
					allowDots: true,
					encodeValuesOnly: true,
					skipNulls: true,
					encode: true,
					arrayFormat: 'repeat'
				})
				uni.request({
					url: this.$baseApiUrl + '/apis/api.content.halo.run/v1alpha1/posts?' + paramsStr,
					method: 'GET',
					success: (res) => {
						this.bannerList = res.data.items.map((item, index) => {
							return {
								mp4: '',
								id: item.metadata.name,
								nickname: item.owner.displayName,
								avatar: this.$utils.checkAvatarUrl(item.owner.avatar),
								address: '',
								createTime: uni.$tm.dayjs(item.spec.publishTime).fromNow(),
								title: item.spec.title,
								src: this.$utils.checkThumbnailUrl(item.spec.cover),
								image: this.$utils.checkThumbnailUrl(item.spec.cover),
								type: "post",
								content: item.status.excerpt,
								url: ""
							};
						});
					},
					fail: (err) => {}
				})

			},
			fnOnNotifyChange(e) {
				this.notify.show = e;
			},
			fnOnBannerClick(item) {
				if (this.calcAuditModeEnabled) {
					return;
				}
				if (item.type === 'custom') {
					if (item.content) {
						this.notify.data = item
						this.notify.show = true
						return;
					}
					if (uni.$utils.checkIsUrl(item.url)) {
						uni.navigateTo({
							url: '/pagesC/website/website?data=' +
								JSON.stringify({
									title: item.title || "加载中...",
									url: encodeURIComponent(item.url)
								})
						});
					}
					return;
				}

				if (item.id === '') return;
				this.fnToArticleDetail({
					metadata: {
						name: item.id
					}
				});
			},
			// 文章列表
			fnGetArticleList() {
				if (this.calcAuditModeEnabled) {
					this.articleList = this.mockJson.home.postList.map((item) => {
						return {
							metadata: {
								name: Date.now() * Math.random(),
							},
							spec: {
								pinned: false,
								cover: item.cover,
								title: item.title,
								publishTime: item.time
							},
							status: {
								excerpt: item.desc
							},
							stats: {
								visit: 0
							}
						}
					});
					this.loading = 'success';
					this.loadMoreText = '呜呜，没有更多数据啦~';
					uni.hideLoading();
					uni.stopPullDownRefresh();
					return;
				}
				// 设置状态为加载中
				if (!this.isLoadMore) {
					this.loading = 'loading';
				}
				this.loadMoreText = '加载中...';

				const paramsStr = qs.stringify(this.queryParams, {
					allowDots: true,
					encodeValuesOnly: true,
					skipNulls: true,
					encode: true,
					arrayFormat: 'repeat'
				})
				uni.request({
					url: this.$baseApiUrl + '/apis/api.content.halo.run/v1alpha1/posts?' + paramsStr,
					method: 'GET',
					success: (res) => {
						const data = res.data;
						this.result.hasNext = data.hasNext;
						if (this.isLoadMore) {
							this.articleList = this.articleList.concat(data.items);
						} else {
							this.articleList = data.items;
						}
						this.loading = 'success';
						this.loadMoreText = data.hasNext ? '上拉加载更多' : '呜呜，没有更多数据啦~';
						uni.hideLoading();
						uni.stopPullDownRefresh();
					},
					fail: (err) => {
						this.loading = 'error';
						this.loadMoreText = '加载失败，请下拉刷新！';
						uni.$tm.toast(err.message || '数据加载失败！');
						uni.stopPullDownRefresh();
					}
				})
			},
			//跳转文章详情
			fnToArticleDetail(article) {
				if (this.calcAuditModeEnabled) {
					return;
				}
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
				if (this.calcAuditModeEnabled) {
					return;
				}
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
			},
			fnOnLogoToPage() {
				uni.switchTab({
					url: '/pages/tabbar/about/about'
				})
			},
			fnClickNav(data) {
				uni.navigateTo({
					url: data.path
				});
			},
			fnGetNavList() {
				this.navList = [{
					key: 'archives',
					title: this.calcAuditModeEnabled ? '内容归档' : '文章归档',
					bgColor: "rgba(3, 169, 244, 0.95)",
					shadow: "rgba(3, 169, 244, 0.4)",
					bgClass: 'bg-gradient-blue-accent',
					icon: 'icon-news',
					iconColor: '',
					path: '/pagesA/archives/archives',
					type: 'page',
					show: true
				}, {
					key: 'vote',
					title: '投票中心',
					bgColor: "rgba(0, 188, 212,0.95)",
					shadow: "rgba(0, 188, 212, 0.4)",
					bgClass: 'bg-gradient-blue-accent',
					icon: 'icon-box',
					iconColor: '',
					path: '/pagesA/votes/votes',
					type: 'page',
					show: !this.calcAuditModeEnabled
				}, {
					key: 'disclaimers',
					title: '友情链接',
					bgColor: "rgba(0, 150, 136, 0.95)",
					shadow: "rgba(0, 150, 136, 0.4)",
					bgClass: 'bg-gradient-blue-accent',
					icon: 'icon-lianjie',
					iconColor: '',
					path: '/pagesA/friend-links/friend-links',
					type: 'page',
					show: true
				}, {
					key: 'love',
					title: '恋爱日记',
					bgColor: "rgba(255,76,103, 0.95)",
					shadow: "rgba(255,76,103, 0.4)",
					bgClass: 'bg-gradient-blue-accent',
					icon: 'icon-like',
					iconColor: '',
					path: '/pagesA/love/love',
					type: 'page',
					show: this.haloConfigs.loveConfig.loveEnabled
				}, {
					key: 'contact-blogger',
					title: '联系博主',
					bgColor: "rgba(255, 152, 0, 0.95)",
					shadow: "rgba(255, 152, 0, 0.4)",
					bgClass: 'bg-gradient-blue-accent',
					icon: 'icon-paper-plane',
					iconColor: '',
					rightText: '博主主常用常用联系方式',
					path: '/pagesA/contact/contact',
					type: 'page',
					show: this.haloConfigs.authorConfig.social.enabled
				}]
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

	.nav-box {
		background-color: #ffff;
		overflow: hidden;
		margin-bottom: 24rpx;
	}

	.nav-list {
		flex-wrap: wrap;
		align-items: center;
		// justify-content: space-between;
		justify-content: space-around;
	}

	.nav-item {
		font-size: 26rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12rpx;
	}

	.nav-item-icon {
		padding: 24rpx;
		// border-radius: 24rpx 32rpx 24rpx 32rpx;
		border-radius: 24rpx;
		// border: 2rpx solid #fff;
	}

	.nav-item-text {
		font-size: 24rpx;
	}
</style>