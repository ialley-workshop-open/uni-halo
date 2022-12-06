<template>
	<view class="app-page">
		<view class="e-fixed"><tm-tabs color="light-blue" v-model="tab.activeIndex" :list="tab.list" align="center" @change="fnOnTabChange"></tm-tabs></view>
		<!-- 占位区域 -->
		<view style="width: 100vw;height: 90rpx;"></view>

		<!-- 骨架屏：加载区域 -->
		<view v-if="loading != 'success'" class="loading-wrap">
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
		</view>

		<!-- 加载完成区域 -->
		<block v-else>
			<view v-if="dataList.length == 0" class="list-empty flex flex-center"><tm-empty icon="icon-shiliangzhinengduixiang-" label="暂无归档的文章"></tm-empty></view>
			<view v-else class="e-timeline tm-timeline mt-24">
				<block v-for="(item, index) in dataList" :key="index">
					<view class="tm-timeline-item tm-timeline-item--leftDir">
						<view style="width: 160rpx;">
							<view
								:style="{ width: '24rpx', height: '24rpx' }"
								:class="[black_tmeme ? 'bk' : '']"
								class="flex-center rounded tm-timeline-jidian border-white-a-2 grey-lighten-2 light-blue shadow-primary-4"
							></view>
							<view
								:style="{ marginTop: '-24rpx' }"
								:class="[index !== dataList.length - 1 ? 'tm-timeline-item-boder' : '', black_tmeme ? 'bk' : '']"
								class="grey-lighten-2"
							></view>
						</view>
						<view class="tm-timeline-item-content relative">
							<view class="tm-timeline-item-left">
								<view class="time text-weight-b mb-24">
									{{ item.year }}年
									<block v-if="tab.activeIndex == 0">{{ item.month }}月</block>
									<text class="text-size-s text-grey-darken-1 ml-24">（共发布 {{ item.posts.length }} 篇文章）</text>
								</view>
								<block v-if="item.posts.length != 0">
									<block v-for="(post, postIndex) in item.posts" :key="post.id">
										<tm-translate animation-name="fadeUp" :wait="(postIndex + 1) * 50">
											<view class="flex post shadow-3 pa-24 mb-24" :class="[globalAppSettings.layout.cardType]" @click="fnToArticleDetail(post)">
												<image class="post-thumbnail" :src="$utils.checkThumbnailUrl(post.thumbnail)" mode="aspectFill"></image>
												<view class="post-info pl-20">
													<view class="post-info_title text-overflow">{{ post.title }}</view>
													<view class="post-info_summary text-overflow-2 mt-12 text-size-s text-grey-darken-1">{{ post.summary }}</view>
													<view class="post-info_time mt-12  text-size-s text-grey-darken-1">
														<text class="iconfont icon-clock text-size-s mr-6"></text>
														<text class="time-label">发布时间：</text>
														{{ { d: post.createTime, f: 'yyyy年MM月dd日 星期w' } | formatTime }}
													</view>
												</view>
											</view>
										</tm-translate>
									</block>
								</block>
								<view v-else class="post-empty text-size-m text-grey-darken-1">该日期下暂无归档文章！</view>
							</view>
						</view>
					</view>
				</block>
			</view>
			<!-- 返回顶部 -->
			<tm-flotbutton @click="fnToTopPage" size="m" color="bg-gradient-light-blue-accent" icon="icon-angle-up"></tm-flotbutton>
		</block>
	</view>
</template>

<script>
import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
import tmTabs from '@/tm-vuetify/components/tm-tabs/tm-tabs.vue';
import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';

export default {
	components: {
		tmSkeleton,
		tmTranslate,
		tmFlotbutton,
		tmTabs,
		tmEmpty
	},
	data() {
		return {
			loading: 'loading',
			tab: {
				activeIndex: 0,
				list: ['按月份查看', '按年份查看']
			},
			queryParams: {
				size: 10,
				page: 0
			},
			result: null,
			dataList: [],
			api: 'getMonthArchives'
		};
	},
	computed: {
		black_tmeme: function() {
			return this.$tm.vx.state().tmVuetify.black;
		},
		color_tmeme: function() {
			return this.$tm.vx.state().tmVuetify.color;
		}
	},
	created() {
		this.fnGetData();
	},
	onPullDownRefresh() {
		this.fnGetData();
		this.queryParams.page = 0;
	},

	methods: {
		fnOnTabChange(index) {
			// todo:
			const _api = ['getMonthArchives', 'getYearArchives'];
			this.api = _api[index];
			this.queryParams.page = 0;
			this.fnGetData();
		},
		fnGetData() {
			this.loading = 'loading';
			uni.showLoading({
				mask: true,
				title: '加载中...'
			});
			this.$httpApi[this.api](this.queryParams)
				.then(res => {
					this.result = res.data;
					this.dataList = res.data;
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
	background-color: #fafafd;
}
.loading-wrap {
	padding: 24rpx;
}
.list-empty {
	width: 100vw;
	height: 100vh;
}
.statistics {
	background-color: #ffffff;
}
.e-timeline {
	::v-deep {
		.tm-timeline-item > view:first-child {
			width: 110rpx !important;
		}
		.tm-timeline-item-left {
			max-width: 580rpx !important;
			width: 100% !important;
		}
	}
}

.tm-timeline {
	.tm-timeline-item {
		.tm-timeline-item-left,
		.tm-timeline-item-right {
			width: 200rpx;
			flex-shrink: 0;
		}

		.tm-timeline-item-content {
			display: flex;
			justify-content: center;
			align-items: flex-start;
			align-content: flex-start;
		}
		.tm-timeline-jidian {
			margin: auto;
		}
		&.tm-timeline-item--leftDir {
			display: flex;
			flex-flow: row;
			&.endright {
				justify-content: flex-end;
			}
			.tm-timeline-item-left,
			.tm-timeline-item-right {
				width: auto;
				max-width: 400rpx;
			}
			.tm-timeline-item-boder {
				height: 100%;
				width: 1px;
				margin: auto;
			}
			.tm-timeline-jidian {
				position: relative;
				margin: auto;
				z-index: 2;
			}
			.tm-timeline-item-content {
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;
				align-content: flex-start;
			}
		}
	}
}

.post {
	width: 560rpx;
	border-radius: 12rpx;
	background-color: #fff;
	&.lr_image_text {
	}
	&.lr_text_image {
		.post-thumbnail {
			order: 2;
		}
		.post-info {
			order: 1;
			padding-left: 0;
			padding-right: 24rpx;
		}
	}
	&.tb_image_text {
		flex-direction: column;
		.post-thumbnail {
			width: 100%;
			height: 220rpx;
		}
		.post-info {
			width: 100%;
			padding-left: 0;
			&_title {
				margin-top: 12rpx;
			}
			&_time {
				.iconfont {
					display: none;
				}
				.time-label {
					display: inline-block;
				}
			}
		}
	}
	&.tb_text_image {
		flex-direction: column;
		.post-thumbnail {
			order: 2;
			width: 100%;
			height: 220rpx;
			margin-top: 12rpx;
		}
		.post-info {
			order: 1;
			width: 100%;
			padding-left: 0;

			&_time {
				.iconfont {
					display: none;
				}
				.time-label {
					display: inline-block;
				}
			}
		}
	}
	&.only_text {
		.post-info {
			padding: 6rpx;
			&_time {
				margin-top: 20rpx;
				.iconfont {
					display: none;
				}
				.time-label {
					display: inline-block;
				}
			}
		}
		.post-thumbnail {
			display: none;
		}
	}
}
.post-thumbnail {
	border-radius: 6rpx;
	width: 200rpx;
	height: 170rpx;
}
.post-info {
	width: 0;
	flex-grow: 1;
	&_title {
		color: #303133;
		font-size: 28rpx;
		font-weight: bold;
	}
	&_summary {
		display: -webkit-box;
		line-height: 1.6;
	}
	&_time {
		.time-label {
			display: none;
		}
	}
}
</style>
