<template>
	<view class="app-page" :class="{ 'is-balck grey-darken-6': isBlackTheme }">
		<!-- 顶部切换 -->
		<view class="e-fixed shadow-2">
			<tm-search v-model="queryParams.keyword" :round="24" :shadow="0" color="light-blue" insert-color="light-blue" :clear="true">
				<view slot="right" class="flex flex-center">
					<tm-pickers title="请选择分类" :default-value="category.selected" :list="category.list" rang-key="name" btn-color="blue" @confirm="fnOnCategoryConfirm">
						<text class="iconfont icon-filter text-size-lg text-grey-darken-2"></text>
					</tm-pickers>
					<text class="ml-16 text-size-g" style="min-width: 70rpx;" @click="fnOnSearch">搜索</text>
				</view>
			</tm-search>
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
		<view v-else class="app-page-content pl-24 pr-24">
			<view v-if="dataList.length == 0" class="content-empty flex flex-center">
				<!-- 空布局 -->
				<tm-empty icon="icon-shiliangzhinengduixiang-" label="该分类下暂无数据"></tm-empty>
			</view>
			<block v-else>
				<block v-for="(article, index) in dataList" :key="index">
					<tm-translate animation-name="fadeUp" :wait="(index + 1) * 50">
						<!-- 文章卡片 -->
						<view class="article-card mt-24 bg-white pa-24 round-3">
							<view class="thumbnail round-2" @click="fnToArticleDetail(article)">
								<image v-if="article.hasThumbnail" class="thumbnail-img round-2" :src="article.thumbnail" mode="aspectFill"></image>
								<view v-else class="thumbnail-not round-2 flex flex-center text-grey-darken-2">无封面图</view>
							</view>
							<view class="title mt-16 text-bg-gradient-blue-accent">{{ article.title }}</view>
							<view class="summary mt-16 text-grey-darken-2 text-size-m">{{ article.summary }}</view>
							<view class="flex mt-12 flex-start desc-box text-size-m">
								<view class="label text-grey-darken-2">分类：</view>
								<view class="value">
									<block v-if="article.categories.length != 0">
										<tm-tags v-for="(category, categoryIndex) in article.categories" :key="category.slug" color="light-blue" size="s" model="text">
											{{ category.name }}
										</tm-tags>
									</block>
									<text v-else class="ml-12 text-grey-darken-2">未选择分类</text>
								</view>
							</view>
							<view class="flex flex-start desc-box text-size-m" :class="{ 'mt-12': article.tags.length == 0 }">
								<view class="label text-grey-darken-2">标签：</view>
								<view class="value">
									<block v-if="article.tags.length != 0">
										<tm-tags v-for="(tag, tagIndex) in article.tags" :key="tag.slug" color="orange" size="s" model="text">{{ tag.name }}</tm-tags>
									</block>
									<text v-else class="ml-12 text-grey-darken-2 ">未选择标签</text>
								</view>
							</view>
							<view class="flex flex-start desc-box text-size-m" :class="{ 'mt-12': article.tags.length == 0 }">
								<view class="label text-grey-darken-2">状态：</view>
								<view class="value">
									<tm-tags v-if="article.status == 'PUBLISHED'" color="green" size="s" model="text">已发布（访客可见）</tm-tags>
									<tm-tags v-else-if="article.status == 'INTIMATE'" color="light-blue" size="s" model="text">私密（访客不可见）</tm-tags>
									<tm-tags v-else-if="article.status == 'DRAFT'" color="blue-grey" size="s" model="text">草稿（未发布）</tm-tags>
									<tm-tags v-else-if="article.status == 'RECYCLE'" color="deep-orange" size="s" model="text">回收站</tm-tags>
								</view>
							</view>
							<view class="flex mt-12 flex-start desc-box text-size-m">
								<view class="label text-grey-darken-2">日期：</view>
								<view class="value ml-12 text-grey-darken-2">{{ $tm.dayjs(article.createTime).format('YYYY年MM月DD日 HH点mm分ss秒') }}</view>
							</view>
							<view class="flex mt-12 flex-start desc-box text-size-m ">
								<view class="label text-grey-darken-2">统计：</view>
								<view class="value ml-12 text-grey-darken-2">
									<text class="">
										<text class="text-size-m text-weight-b text-bg-gradient-blue-accent">{{ article.wordCount }}</text>
										<text class="ml-6 text-size-s">字</text>
									</text>
									<text class="ml-20">
										<text class="text-size-m text-weight-b text-bg-gradient-light-blue-accent">{{ article.visits }}</text>
										<text class="ml-6 text-size-s">浏览</text>
									</text>
									<text class="ml-20">
										<text class="text-size-m text-weight-b text-bg-gradient-cyan-accent">{{ article.likes }}</text>
										<text class="ml-6 text-size-s">点赞</text>
									</text>
									<text class="ml-20">
										<text class="text-size-m  text-weight-b text-bg-gradient-blue-grey-accent">{{ article.commentCount }}</text>
										<text class="ml-6 text-size-s">评论</text>
									</text>
								</view>
							</view>
							<view class="foot flex flex-between mt-20 pt-24 desc-box text-size-m">
								<tm-button theme="light-blue" :shadow="0" block :width="200" :height="60" size="m" @click="fnOnEditArticle(article)">编辑</tm-button>
								<tm-button theme="red" :shadow="0" block :width="200" :height="60" size="m" @click="fnOnDelArticle(article, index)">删除</tm-button>
								<tm-button theme="blue-grey" :shadow="0" block :width="200" :height="60" size="m" @click="fnOnSetArticle(article, index)">设置</tm-button>
							</view>
						</view>
					</tm-translate>
				</block>

				<tm-flotbutton @click="fnToTopPage" :offset="[16, 80]" color="bg-gradient-light-blue-accent" size="m" icon="icon-angle-up"></tm-flotbutton>
				<tm-flotbutton :show-text="true" color="bg-gradient-orange-accent" @click="fnOnAddArticle()"></tm-flotbutton>
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
import tmTags from '@/tm-vuetify/components/tm-tags/tm-tags.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
import tmPickers from '@/tm-vuetify/components/tm-pickers/tm-pickers.vue';

export default {
	components: {
		tmSkeleton,
		tmSearch,
		tmTranslate,
		tmTabs,
		tmFlotbutton,
		tmEmpty,
		tmTags,
		tmButton,
		tmPickers
	},
	data() {
		return {
			isBlackTheme: false,
			loading: 'loading',
			tab: {
				activeIndex: 0,
				list: ['全部', '已发布', '私密', '草稿', '回收站']
			},
			queryParams: {
				size: 10,
				page: 0,
				status: '',
				keyword: '',
				categoryId: undefined
			},
			cache: {
				dataList: [],
				total: 0
			},
			isLoadMore: false,
			loadMoreText: '加载中...',
			result: {},
			dataList: [],
			category: {
				loading: 'loading',
				show: false,
				list: [],
				selected: [0]
			}
		};
	},
	onLoad() {
		this.fnSetPageTitle('文章管理');
		this.fnGetCategoryList();
	},
	created() {
		this.fnGetData();
		uni.$on('refresh-article-list', () => {
			this.isLoadMore = false;
			this.queryParams.page = 0;
			this.fnGetData();
		});
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
			this.dataList = [];
			const _status = {
				0: '',
				1: 'PUBLISHED',
				2: 'INTIMATE',
				3: 'DRAFT',
				4: 'RECYCLE'
			};
			this.queryParams.status = _status[index];
			this.queryParams.page = 0;
			this.fnToTopPage();
			this.fnGetData();
		},
		// 获取分类列表
		fnGetCategoryList() {
			this.category.loading = 'loading';
			this.$httpApi.admin
				.getCategoryList()
				.then(res => {
					if (res.status == 200) {
						let _list = res.data;
						_list.unshift({ id: undefined, name: '全部' });
						this.category.list = _list;
						this.category.loading = 'success';
					} else {
						this.category.loading = 'error';
					}
				})
				.catch(err => {
					this.category.loading = 'error';
				});
		},
		// 显示分类选择
		fnOnCategoryConfirm(e) {
			this.category.selected = [e[0].index];
			this.queryParams.categoryId = e[0].data.id;
		},
		fnOnSearch() {
			this.queryParams.page = 0;
			this.isLoadMore = false;
			this.fnToTopPage();
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
			this.$httpApi.admin
				.getPostsByPage(this.queryParams)
				.then(res => {
					console.log('请求结果：');
					console.log(res);
					if (res.status == 200) {
						// 处理数据
						this.result = res.data;
						const _dataList = res.data.content.map(item => {
							item.hasThumbnail = item.thumbnail != '';
							if (item.thumbnail) {
								item.thumbnail = this.$utils.checkThumbnailUrl(item.thumbnail);
							}
							return item;
						});
						if (this.isLoadMore) {
							this.dataList = this.dataList.concat(_dataList);
						} else {
							this.dataList = _dataList;
						}

						this.loading = 'success';
						this.loadMoreText = res.data.hasNext ? '上拉加载更多' : '呜呜，没有更多数据啦~';
					} else {
						this.loading = 'error';
						this.loadMoreText = '呜呜，加载失败了~';
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

		// 跳转文章详情（预览）
		fnToArticleDetail(article) {
			uni.navigateTo({
				url: '/pagesA/article-detail/article-detail?articleId=' + article.id,
				animationType: 'slide-in-right'
			});
		},
		// 新增
		fnOnAddArticle() {
			this.$Router.push({ path: '/pagesB/articles/article-edit', query: {} });
		},
		// 文章编辑
		fnOnEditArticle(article) {
			this.$Router.push({ path: '/pagesB/articles/article-edit', query: { postsId: article.id } });
		},
		// 设置文章信息
		fnOnSetArticle(article, index) {
			this.$Router.push({ path: '/pagesB/articles/article-setting', query: { postsId: article.id, postTitle: article.title, isEdit: true, from: 'list' } });
		},
		// 删除文章
		fnOnDelArticle(article, index) {
			uni.$eShowModal({
				title: '提示',
				content: '是否确定要删除该文章？',
				showCancel: true,
				cancelText: '否',
				cancelColor: '#999999',
				confirmText: '是',
				confirmColor: '#03a9f4'
			})
				.then(res => {
					uni.showLoading({
						mask: true,
						title: '删除中...'
					});
					this.$httpApi.admin
						.deletePostsByIds([article.id])
						.then(res => {
							if (res.status == 200) {
								uni.$tm.toast('文章已删除成功！');
								this.dataList.splice(index, 1);
							} else {
								uni.$tm.toast('操作失败，请重试！');
							}
						})
						.catch(err => {
							uni.$tm.toast('操作失败，请重试！');
						});
				})
				.catch(err => {});
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
.app-page-content {
	box-sizing: border-box;
	.content-empty {
		height: 60vh;
	}
}

.article-card {
	box-sizing: border-box;
	box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.05);
	.thumbnail {
		width: 100%;
		height: 280rpx;
		&-img {
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.03);
		}
		&-not {
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.03);
		}
	}
	.title {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		word-wrap: break-word;
		word-break: break-all;
	}
	.summary {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		overflow: hidden;
		word-wrap: break-word;
		word-break: break-all;
	}
	.foot {
		box-sizing: border-box;
		border-top: 2rpx solid rgba(0, 0, 0, 0.03);
	}
}
</style>
