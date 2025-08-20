<template>
	<view class="app-page">
		<PluginUnavailable v-if="!uniHaloPluginAvailable" :pluginId="uniHaloPluginId"
			:error-text="uniHaloPluginAvailableError" />
		<template v-else>
			<!-- 顶部切换 -->
			<view class="e-fixed">
				<tm-search v-model="queryParams.keyword" :round="24" :shadow="0" color="light-blue"
					insert-color="light-blue" :clear="true" @input="fnOnSearch" @confirm="fnOnSearch"></tm-search>
				<tm-dropDownMenu :shadow="1" color="light-blue" active-color="light-blue"
					:default-selected="filterOption.selected" :list="filterOption.list"
					@confirm="fnOnFilterConfirm"></tm-dropDownMenu>
			</view>
			<!-- 占位区域 -->
			<view style="width: 100vw;height: 210rpx;"></view>
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
			<view v-else class="content">
				<view v-if="dataList.length == 0" class="content-empty flex flex-center">
					<tm-empty icon="icon-shiliangzhinengduixiang-" label="暂无数据"></tm-empty>
				</view>
				<block v-else>
					<tm-translate v-for="(item, index) in dataList" :key="item.metadata.name" animation-name="fadeUp"
						:wait="calcAniWait(index)">
						<VoteCard :vote="item" :index="index" @on-click="fnToDetail"></VoteCard>
					</tm-translate>
					<view class="load-text">{{ loadMoreText }}</view>
					<tm-flotbutton @click="fnToTopPage" size="m" color="light-blue"
						icon="icon-angle-up"></tm-flotbutton>

				</block>
			</view>
		</template>
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
	import tmDropDownMenu from '@/tm-vuetify/components/tm-dropDownMenu/tm-dropDownMenu.vue';

	import VoteCard from '@/components/vote-card/vote-card.vue'

	import {
		voteCacheUtil
	} from '@/utils/vote.js'
	import pluginAvailable from "@/common/mixins/pluginAvailable.js"

	export default {
		options: { 
			styleIsolation: 'shared'
		},
		mixins: [pluginAvailable], 
		components: {
			tmSkeleton,
			tmSearch,
			tmTranslate,
			tmTabs,
			tmFlotbutton,
			tmEmpty,
			tmTags,
			tmDropDownMenu,
			VoteCard
		},
		data() {
			return {
				loading: 'loading',
				hasNext: false,
				isLoadMore: false,
				loadMoreText: '加载中...',
				filterOption: {
					selected: [],
					list: [{
						title: '类型',
						children: [{
							title: "",
							model: "list",
							name: "type",
							children: [{
									title: "全部",
									id: undefined
								},
								{
									title: "单选",
									id: 'single'
								},
								{
									title: "多选",
									id: 'multiple'
								},
								{
									title: "双选PK",
									id: 'pk'
								}
							]
						}]
					}, {
						title: '状态',
						children: [{
							title: "",
							model: "list",
							name: "hasEnded",
							children: [{
									title: "全部",
									id: undefined
								},
								{
									title: "进行中",
									id: false
								},
								{
									title: "已结束",
									id: true
								}
							]
						}]
					}, {
						title: '排序',
						children: [{
							title: "",
							model: "list",
							name: "sort",
							children: [{
									title: "默认排序",
									id: undefined
								},
								{
									title: "较近创建",
									id: 'metadata.creationTimestamp,desc'
								},
								{
									title: "较早创建",
									id: 'metadata.creationTimestamp,asc'
								}
							]
						}]
					}, {
						title: '是否已投',
						children: [{
							title: "",
							model: "list",
							name: "isVoted",
							children: [{
									title: "全部",
									id: undefined
								},
								{
									title: "未投票",
									id: false
								},
								{
									title: "已投票",
									id: true
								}
							]
						}]
					}]
				},
				filterIsVoted: undefined,
				queryParams: {
					keyword: "",
					page: 1,
					size: 10,
					sort: undefined,
					type: undefined,
					hasEnded: undefined
				},
				dataList: []
			};
		},
		computed: {
			haloConfigs() {
				return this.$tm.vx.getters().getConfigs;
			},
			calcAuditModeEnabled() {
				return this.haloConfigs.auditConfig.auditModeEnabled
			},
		},
		async onLoad() {
			this.fnSetPageTitle('投票列表');
			// 检查插件
			this.setPluginId(this.NeedPluginIds.PluginVote)
			this.setPluginError("阿偶，检测到当前插件没有安装或者启用，无法使用投票功能哦，请联系管理员")
			if (!await this.checkPluginAvailable()) return
			this.fnGetData();
		},
		onPullDownRefresh() {
			if (!this.uniHaloPluginAvailable) return;
			this.fnResetSetAniWaitIndex();
			this.isLoadMore = false;
			this.queryParams.page = 0;
			this.fnGetData();
		},
		onReachBottom(e) {
			if (!this.uniHaloPluginAvailable) return;
			if (this.calcAuditModeEnabled) {
				uni.showToast({
					icon: 'none',
					title: '没有更多数据了'
				});
				return
			}
			if (this.hasNext) {
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
			fnOnSearch() {
				this.fnResetSetAniWaitIndex();
				this.fnToTopPage();
				this.fnGetData();
			},
			fnGetData() {
				if (this.calcAuditModeEnabled) {
					return;
				}
				uni.showLoading({
					mask: true,
					title: '加载中...'
				});
				// 设置状态为加载中
				if (!this.isLoadMore) {
					this.loading = 'loading';
				}
				this.loadMoreText = '加载中...';
				this.$httpApi.v2
					.getVoteList(this.queryParams)
					.then(res => {
						this.loading = 'success';
						this.loadMoreText = res.hasNext ? '上拉加载更多' : '呜呜，没有更多数据啦~';
						this.hasNext = res.hasNext;

						const tempItems = res.items.map(item => {
							item.spec.disabled = true
							item.spec.isVoted = this.fnCalcIsVoted(item.metadata.name)

							item.spec.options.map((option, index) => {

								option.checked = this.fnCalcIsChecked(item.metadata.name, option)
								option.value = option.id
								option.label = option.title

								// todo：计算当前的选择占比
								if (item.spec.type === 'single') {
									option.percent = this.fnCalcPercent(option, item.stats);
								} else if (item.spec.type === 'multiple') {
									option.percent = this.fnCalcPercent(option, item.stats);
								} else if (item.spec.type === 'pk') {
									option.percent = this.fnCalcPercent(option, item.stats);
								}

								return option
							})

							return item;
						})

						if (this.isLoadMore) {
							this.dataList = this.dataList.concat(tempItems);
						} else {
							this.dataList = tempItems;
						}

						this.dataList = this.dataList.sort((a, b) => {
							return a.spec.isVoted - b.spec.isVoted
						})

						if (this.filterIsVoted != undefined) {
							this.dataList = this.dataList.filter(x => x.spec.isVoted == this.filterIsVoted)
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
						}, 100);
					});
			},

			fnCalcPercent(voteOption, stats) {
				if (!stats?.voteDataList) return 0;
				const option = stats.voteDataList.find(x => x.id == voteOption.id)
				if (!option) return 0;
				const percent = (option.voteCount / stats.voteCount) * 100
				return Math.round(percent)
			},

			fnCalcIsVoted(name) {
				return voteCacheUtil.has(name)
			},
			fnCalcIsChecked(name, option) {
				const data = voteCacheUtil.get(name)
				if (!data) return false;
				const checked = data.selected.includes(option.id)
				return checked
			},
			//跳转详情
			fnToDetail(item) {
				if (this.calcAuditModeEnabled) return;
				uni.navigateTo({
					url: '/pagesA/vote-detail/vote-detail?name=' + item.metadata.name,
					animationType: 'slide-in-right'
				});
			},
			fnOnFilterConfirm(e) {
				// 类型
				const type = e.find(x => x.name == 'type')
				if (type.children.length == 0) {
					this.queryParams.type = undefined
				} else {
					this.queryParams.type = type.children[0]?.id
				}

				// 状态
				const hasEnded = e.find(x => x.name == 'hasEnded')
				if (hasEnded.children.length == 0) {
					this.queryParams.hasEnded = undefined
				} else {
					this.queryParams.hasEnded = hasEnded.children[0]?.id
				}

				// 排序
				const sort = e.find(x => x.name == 'sort')
				if (sort.children.length == 0) {
					this.queryParams.sort = undefined
				} else {
					this.queryParams.sort = sort.children[0]?.id
				}

				// 是否已经投
				const isVoted = e.find(x => x.name == 'isVoted')
				if (isVoted.children.length == 0) {
					this.filterIsVoted = undefined
				} else {
					this.filterIsVoted = isVoted.children[0]?.id
				}

				this.queryParams.page = 0;
				this.isLoadMore = false;
				this.fnResetSetAniWaitIndex();
				this.fnToTopPage();
				this.fnGetData();
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
	}

	.content-empty {
		height: 60vh;
	}
</style>