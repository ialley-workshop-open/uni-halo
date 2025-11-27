<template>
	<view class="app-page flex flex-col pa-24" :class="[uniHaloPluginPageClass]">
		<PluginUnavailable v-if="!uniHaloPluginAvailable" :pluginId="uniHaloPluginId" :error-text="uniHaloPluginAvailableError" />
		<template v-else>
			<!-- 加载区域 -->
			<view v-if="loading == 'loading'" class="loading-wrap pa-24">
				<tm-skeleton model="listAvatr"></tm-skeleton>
				<tm-skeleton model="listAvatr"></tm-skeleton>
				<tm-skeleton model="listAvatr"></tm-skeleton>
				<tm-skeleton model="listAvatr"></tm-skeleton>
			</view>
			<view v-else-if="loading == 'error'" class="content-empty flex flex-center">
				<tm-empty icon="icon-wind-cry" label="加载异常"></tm-empty>
			</view>
			<!-- 内容区域 -->
			<view v-else class="content flex flex-col uh-gap-y-12">
				<!-- 标签统计 -->
				<view class="card bg-white pa-24 round-4">
					<view class="card-head flex items-center justify-between">
						<view class="card-head_title flex items-end uh-gap-x-4">
							<text class="card-head_text">标签统计</text>
							<text class="card-head_subtext">(全部标签的文章数量占比)</text>
						</view>
						<view @click="tagChart.isExpand = !tagChart.isExpand">
							<tm-icons v-if="tagChart.isExpand" :size="24" name="icon-angle-down" color="gray"></tm-icons>
							<tm-icons v-else :size="24" name="icon-angle-up" color="gray"></tm-icons>
						</view>
					</view>
					<view v-show="tagChart.isExpand" class="card-body flex">
						<view class="chart-box">
							<qiun-data-charts :type="tagChart.type" :opts="tagChart.opts" :chartData="tagChart.data" :tooltipFormat="tagChart.tooltipFormat" />
						</view>
					</view>
				</view>
				<!-- 分类统计 -->
				<view class="card bg-white pa-24 round-4">
					<view class="card-head flex items-center justify-between">
						<view class="card-head_title flex items-end uh-gap-x-4">
							<text class="card-head_text">分类统计</text>
							<text class="card-head_subtext">(全部分类的文章数量占比)</text>
						</view>
						<view @click="categoryChart.isExpand = !categoryChart.isExpand">
							<tm-icons v-if="categoryChart.isExpand" :size="24" name="icon-angle-down" color="gray"></tm-icons>
							<tm-icons v-else :size="24" name="icon-angle-up" color="gray"></tm-icons>
						</view>
					</view>
					<view v-show="categoryChart.isExpand" class="card-body flex">
						<view class="chart-box">
							<qiun-data-charts :type="categoryChart.type" :opts="categoryChart.opts" :chartData="categoryChart.data" :tooltipFormat="categoryChart.tooltipFormat" />
						</view>
					</view>
				</view>
				<!-- 文章发布趋势 -->
				<view class="card bg-white pa-24 round-4">
					<view class="card-head flex items-center justify-between">
						<view class="card-head_title flex items-end uh-gap-x-4">
							<text class="card-head_text">文章发布趋势</text>
							<text class="card-head_subtext">(按日期统计文章发布数量)</text>
						</view>
						<view @click="trandArticleChart.isExpand = !trandArticleChart.isExpand">
							<tm-icons v-if="trandArticleChart.isExpand" :size="24" name="icon-angle-down" color="gray"></tm-icons>
							<tm-icons v-else :size="24" name="icon-angle-up" color="gray"></tm-icons>
						</view>
					</view>
					<view v-show="trandArticleChart.isExpand" class="card-body flex">
						<heatmap :chartData="trandArticleChart.data"></heatmap>
					</view>
				</view>
				<!-- 评论活跃用户 -->
				<view class="card bg-white pa-24 round-4">
					<view class="card-head flex items-center justify-between">
						<view class="card-head_title flex items-end uh-gap-x-4">
							<text class="card-head_text">评论活跃用户</text>
							<text class="card-head_subtext">(按评论作者统计评论数量)</text>
						</view>
						<view @click="userCommentsChart.isExpand = !userCommentsChart.isExpand">
							<tm-icons v-if="userCommentsChart.isExpand" :size="24" name="icon-angle-down" color="gray"></tm-icons>
							<tm-icons v-else :size="24" name="icon-angle-up" color="gray"></tm-icons>
						</view>
					</view>
					<view v-show="userCommentsChart.isExpand" class="card-body flex">
						<view class="chart-box">
							<qiun-data-charts
								:type="userCommentsChart.type"
								:opts="userCommentsChart.opts"
								:chartData="userCommentsChart.data"
								:tooltipFormat="userCommentsChart.tooltipFormat"
							/>
						</view>
					</view>
				</view>
				<!-- 热门文章 Top10 -->
				<view class="card bg-white pa-24 round-4">
					<view class="card-head flex items-center justify-between">
						<view class="card-head_title flex items-end uh-gap-x-4">
							<text class="card-head_text">热门文章前10</text>
							<text class="card-head_subtext">(按访问量排序的热门文章)</text>
						</view>
						<view @click="top10ArticlesChart.isExpand = !top10ArticlesChart.isExpand">
							<tm-icons v-if="top10ArticlesChart.isExpand" :size="24" name="icon-angle-down" color="gray"></tm-icons>
							<tm-icons v-else :size="24" name="icon-angle-up" color="gray"></tm-icons>
						</view>
					</view>
					<view v-show="top10ArticlesChart.isExpand" class="card-body flex">
						<view class="chart-box">
							<qiun-data-charts
								:type="top10ArticlesChart.type"
								:opts="top10ArticlesChart.opts"
								:chartData="top10ArticlesChart.data"
								:tooltipFormat="top10ArticlesChart.tooltipFormat"
							/>
						</view>
					</view>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
import dataStatisticsApi from '@/api/v2/plugin.data-statistics.js';
import { NeedPluginIds, NeedPlugins, checkNeedPluginAvailable } from '@/utils/plugin.js';
import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';

import pluginAvailableMixin from '@/common/mixins/pluginAvailable.js';
import PluginUnavailable from '@/components/plugin-unavailable/plugin-unavailable.vue';

import heatmap from '@/components/heatmap/heatmap.vue';

export default {
	mixins: [pluginAvailableMixin],
	name: 'DataVisual',
	components: {
		tmSkeleton,
		tmTranslate,
		tmEmpty,
		tmButton,
		tmIcons,
		heatmap,
		PluginUnavailable
	},
	data() {
		return {
			loading: 'loading',
			statistics: null,
			tagChart: {
				isExpand: true,
				type: 'ring',
				data: {},
				tooltipFormat: 'tooltipTag',
				opts: {
					rotate: false,
					rotateLock: false,
					color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#ea7ccc', '#0EA5E9'],
					padding: [5, 5, 5, 5],
					dataLabel: false,
					enableScroll: true,
					legend: {
						show: false,
						position: 'right',
						lineHeight: 18,
						fontSize: 12
					},
					title: {
						name: '',
						fontSize: 16,
						color: '#666666'
					},
					subtitle: {
						name: '',
						fontSize: 12,
						color: '#eee'
					},
					extra: {
						ring: {
							ringWidth: 36,
							activeOpacity: 0.5,
							activeRadius: 10,
							offsetAngle: -90,
							labelWidth: 15,
							border: true,
							borderWidth: 1,
							borderColor: '#FFFFFF'
						},
						tooltip: {
							legendShape: 'circle',
							fontSize: 11
						}
					}
				}
			},
			categoryChart: {
				isExpand: true,
				type: 'line',
				data: {},
				tooltipFormat: 'tooltipCategory',
				opts: {
					color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#ea7ccc', '#0EA5E9'],
					padding: [20, 15, 10, 15],
					enableScroll: false,
					legend: {
						show: false
					},
					xAxis: {
						disableGrid: true,
						fontSize: 11,
						boundaryGap: 'center'
					},
					yAxis: {
						gridType: 'dash',
						dashLength: 4,
						data: [
							{
								fontSize: 11
							}
						]
					},
					extra: {
						line: {
							type: 'curve',
							width: 2,
							activeType: 'hollow'
						},
						tooltip: {
							legendShape: 'circle',
							fontSize: 11
						}
					}
				}
			},
			trandArticleChart: {
				isExpand: true,
				type: 'hotmap',
				data: [],
				opts: {}
			},
			userCommentsChart: {
				isExpand: true,
				loading: true,
				type: 'column',
				data: {},
				tooltipFormat: 'tooltipUserComments',
				opts: {
					color: ['#EF4444', '#F59E0B', '#14B8A6', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#F97316', '#ea7ccc', '#0EA5E9'],
					padding: [20, 15, 10, 10],
					touchMoveLimit: 24,
					enableScroll: true,
					legend: {
						show: false
					},
					xAxis: {
						disableGrid: true,
						boundaryGap: 'justify',
						fontSize: 10,
						scrollShow: true,
						itemCount: 5,
						format: 'xAxisUserComments'
					},
					yAxis: {
						gridType: 'dash',
						dashLength: 4,
						data: [
							{
								min: 0,
								fontSize: 11
							}
						]
					},
					extra: {
						column: {
							type: 'group',
							width: 22,
							activeBgColor: '#000000',
							activeBgOpacity: 0.08,
							linearType: 'custom',
							seriesGap: 5,
							linearOpacity: 0.7,
							barBorderCircle: true,
							customColor: ['#F59E0B']
						},
						tooltip: {
							legendShape: 'circle',
							fontSize: 11
						}
					}
				}
			},
			top10ArticlesChart: {
				isExpand: true,
				type: 'column',
				data: {},
				tooltipFormat: 'tooltipTop10Articles',
				opts: {
					color: ['#EF4444', '#F59E0B', '#14B8A6', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#F97316', '#ea7ccc', '#0EA5E9'],
					padding: [20, 15, 10, 10],
					touchMoveLimit: 24,
					enableScroll: true,
					legend: {
						show: false
					},
					xAxis: {
						disableGrid: true,
						boundaryGap: 'justify',
						fontSize: 10,
						scrollShow: true,
						itemCount: 5,
						format: 'xAxisTop10Article'
					},
					yAxis: {
						gridType: 'dash',
						dashLength: 4,
						data: [
							{
								min: 0,
								fontSize: 11
							}
						]
					},
					extra: {
						column: {
							type: 'group',
							width: 22,
							activeBgColor: '#000000',
							activeBgOpacity: 0.08,
							linearType: 'custom',
							seriesGap: 5,
							linearOpacity: 0.7,
							barBorderCircle: true,
							customColor: ['#F59E0B']
						},
						tooltip: {
							legendShape: 'circle',
							fontSize: 11
						}
					}
				}
			}
		};
	},
	async onReady() {
		// 检查插件
		this.setPluginId(this.NeedPluginIds.PluginDataStatistics);
		this.setPluginError('阿偶，检测到当前插件没有安装或者启用，无法使用功能哦，请联系管理员');
		if (!(await this.checkPluginAvailable())) return;
		this.fnGetData();
	},
	onPullDownRefresh() {
		if (!this.uniHaloPluginAvailable) {
			uni.hideLoading();
			uni.stopPullDownRefresh();
			return;
		}
		this.fnGetData();
	},
	methods: {
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
			dataStatisticsApi
				.getChartData()
				.then((res) => {
					console.log('获取到统计数据：', res);
					this.statistics = res;
					this.handleTagChart();
					this.handleCategoriesChart();
					this.handleTrendArticlesChart();
					this.handleUserCommentsChart();
					this.handleTop10ArticlesChart();
					this.loading = 'success';
				})
				.catch((err) => {
					console.error(err);
					this.loading = 'error';
					this.loadMoreText = '加载失败，请下拉刷新！';
				})
				.finally(() => {
					setTimeout(() => {
						uni.hideLoading();
						uni.stopPullDownRefresh();
					}, 100);
				});
		},
		// 处理标签统计
		handleTagChart() {
			const data = this.statistics.tags.sort((a, b) => b.count - a.count);
			this.tagChart.data = {
				series: [
					{
						data: data.map((item) => {
							return {
								name: item.name,
								value: item.count
							};
						})
					}
				]
			};
		},
		// 处理分类统计
		handleCategoriesChart() {
			const data = this.statistics.categories.sort((a, b) => a.total - b.total);
			const seriesItemData = data.map((item) => item.total);
			if (Math.max(...seriesItemData) < 10) {
				this.categoryChart.opts.yAxis.data[0].max = 10;
			}
			this.categoryChart.data = {
				categories: data.map((item) => item.name),
				series: [
					{
						name: '分类',
						data: seriesItemData
					}
				]
			};
		},
		// 处理文章趋势
		handleTrendArticlesChart() {
			this.trandArticleChart.data = this.statistics.articles;
		},
		// 处理评论活跃用户
		handleUserCommentsChart() {
			this.userCommentsChart.loading = true;
			const data = this.statistics.comments.sort((a, b) => b.count - a.count).slice(0, 10);
			const seriesItemData = data.map((item) => item.count);
			if (Math.max(...seriesItemData) < 10) {
				this.userCommentsChart.opts.yAxis.data[0].max = 10;
			}
			this.userCommentsChart.data = {
				categories: data.map((item) => item.username),
				series: [
					{
						name: '评论',
						data: seriesItemData
					}
				]
			};
			this.userCommentsChart.loading = false;
		},
		// 处理热门文章TOP10
		handleTop10ArticlesChart() {
			const data = this.statistics.top10Articles.sort((a, b) => b.views - a.views).slice(0, 10);
			const seriesItemData = data.map((item) => item.views);
			if (Math.max(...seriesItemData) < 10) {
				this.top10ArticlesChart.opts.yAxis.data[0].max = 10;
			}
			this.top10ArticlesChart.data = {
				categories: data.map((item) => item.name),
				series: [
					{
						name: '评论',
						data: seriesItemData
					}
				]
			};
		}
	}
};
</script>

<style lang="scss" scoped>
.app-page {
	box-sizing: border-box;
	width: 100vw;
	min-height: 100vh;
	color: #353437;
}
.card {
	box-sizing: border-box;
	background-color: rgba(255, 255, 255, 0.95);
	box-shadow: 0 0 12rpx rgba(226, 232, 240, 0.35);
	backdrop-filter: blur(6rpx);
	// border: 2rpx solid #e8edf4;
}
.card-head {
	font-size: 32rpx;
	font-weight: bold;

	&_title {
	}
	&_text {
		box-sizing: border-box;
		position: relative;
		padding-left: 24rpx;
		font-size: 30rpx;
		&:before {
			content: '';
			position: absolute;
			left: 0;
			top: 50%;
			transform: translateY(-50%);
			width: 8rpx;
			height: 70%;
			background-color: #03a9f4;
			border-radius: 12rpx;
		}
	}
	&_subtext {
		font-size: 26rpx;
		font-weight: normal;
		color: #6b7280;
	}
}

.card-body {
	box-sizing: border-box;
	margin-top: 24rpx;
	width: 100%;
	overflow: hidden;
	background-color: #fcfdfe;
	border: 2rpx solid #e9eef3;
	border-radius: 12rpx;
}
.chart-box {
	width: 100%;
	height: 320rpx;
}
</style>
