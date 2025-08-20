<template>
	<view class="app-page">
		<PluginUnavailable v-if="!uniHaloPluginAvailable" :pluginId="uniHaloPluginId"
			:error-text="uniHaloPluginAvailableError" />
		<template v-else>

			<!-- 顶部切换 -->
			<view class="e-fixed shadow-1">
				<tm-search v-model="queryParams.keyword" :round="24" :shadow="0" color="light-blue"
					insert-color="light-blue" :clear="true" @input="fnOnSearch" @confirm="fnOnSearch"></tm-search>
				<tm-tabs v-if="false" color="light-blue" :shadow="0" v-model="tab.activeIndex" :list="tab.list"
					align="center" @change="fnOnTabChange"></tm-tabs>
			</view>
			<!-- 占位区域 -->
			<view style="width: 100vw;height: 100rpx;"></view>
			<!-- 加载区域 -->
			<view v-if="loading == 'loading'" class="loading-wrap pa-24">
				<tm-skeleton model="listAvatr"></tm-skeleton>
				<tm-skeleton model="listAvatr"></tm-skeleton>
				<tm-skeleton model="listAvatr"></tm-skeleton>
				<tm-skeleton model="listAvatr"></tm-skeleton>
			</view>
			<view v-else-if="loading == 'error'" class="content-empty flex flex-center">
				<tm-empty icon="icon-wind-cry" label="搜索异常"></tm-empty>
			</view>
			<!-- 内容区域 -->
			<view v-else class="content">
				<view v-if="dataList.length == 0" class="content-empty flex flex-center">
					<!-- 空布局 -->
					<tm-empty v-if="!queryParams.keyword" icon="icon-shiliangzhinengduixiang-"
						label="请输入关键词搜索"></tm-empty>
					<tm-empty v-else icon="icon-shiliangzhinengduixiang-"
						:label="`未搜到 ${queryParams.keyword} 相关内容`"></tm-empty>
				</view>
				<block v-else>
					<tm-translate v-for="(item, index) in dataList" :key="item.metadataName" animation-name="fadeUp"
						:wait="calcAniWait(index)">
						<view class="article-card" @click="fnToDetail(item)">
							<view class="mb-12 flex flex-start">
								<view class="flex-shrink ml--12">
									<tm-tags v-if="isArticle(item)" color="blue" size="n" model="text">文章</tm-tags>
									<tm-tags v-else color="green" size="n" model="text">瞬间</tm-tags>
								</view>
								<text class="ml-2 text-overflow text-size-n text-weight-b"
									style="color: #333;">{{ item.title }}</text>
							</view>
							<mp-html class="evan-markdown" lazy-load :domain="markdownConfig.domain"
								:loading-img="markdownConfig.loadingGif" :scroll-table="true" :selectable="true"
								:tag-style="markdownConfig.tagStyle" :content="item.description || item.content"
								:markdown="true" :showLineNumber="true" :showLanguageName="true"
								:copyByLongPress="true" />
							<view class="mt-12 flex flex-center flex-between">
								<text style="font-size: 24rpx;color:#888">
									最近更新时间：{{ {d: item.updateTimestamp, f: 'yyyy年MM月dd日 HH点mm分ss秒'} | formatTime }}
								</text>
								<!-- <tm-tags v-if="isArticle(item)" color="blue" size="n" model="text">文章</tm-tags>
							<tm-tags v-else color="green" size="n" model="text">瞬间</tm-tags> -->
							</view>
						</view>
					</tm-translate>

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

	import MarkdownConfig from '@/common/markdown/markdown.config.js';
	import mpHtml from '@/components/mp-html/components/mp-html/mp-html.vue';

	import pluginAvailable from "@/common/mixins/pluginAvailable.js"
	export default {
		mixins: [pluginAvailable],
		components: {
			tmSkeleton,
			tmSearch,
			tmTranslate,
			tmTabs,
			tmFlotbutton,
			tmEmpty,
			tmTags,
			mpHtml
		},
		data() {
			return {
				markdownConfig: MarkdownConfig,
				loading: 'loading',
				tab: {
					activeIndex: 0,
					list: ['全部', '最新文章', '热门文章', '最近更新', '最多点赞']
				},
				queryParams: {
					keyword: "",
					limit: 50,
					highlightPreTag: "",
					highlightPostTag: ""
				},
				cache: {
					dataList: [],
					total: 0
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
			this.fnSetPageTitle('内容搜索');
			// 检查插件
			this.setPluginId(this.NeedPluginIds.PluginSearchWidget)
			this.setPluginError("阿偶，检测到当前插件没有安装或者启用，无法使用瞬间功能哦，请联系管理员")
			if (!await this.checkPluginAvailable()) return
			if (!this.queryParams.keyword) {
				this.loading = 'success'
			} else {
				this.fnGetData();
			}
		},

		onPullDownRefresh() {
			if (!this.uniHaloPluginAvailable) return;
			this.fnResetSetAniWaitIndex();
			this.fnGetData();
		},

		methods: {
			fnOnTabChange(index) {
				this.fnResetSetAniWaitIndex();
				this.dataList = [];
				this.fnToTopPage();
				this.fnGetData();
			},
			fnOnSearch() {
				this.fnResetSetAniWaitIndex();
				if (!this.queryParams.keyword) {
					this.dataList = []
				} else {
					this.fnGetData();
				}
			},
			fnGetData() {
				if (this.calcAuditModeEnabled) {
					return;
				}
				// 设置状态为加载中
				this.loading = 'loading';
				this.$httpApi.v2
					.getPostListByKeyword(this.queryParams)
					.then(res => {
						this.loading = 'success';
						this.dataList = res.hits;
					})
					.catch(err => {
						console.error(err);
						this.loading = 'error';
					})
					.finally(() => {
						setTimeout(() => {
							uni.hideLoading();
							uni.stopPullDownRefresh();
						}, 800);
					});
			},
			isArticle(item) {
				return item.type == 'post.content.halo.run'
			},
			//跳转详情
			fnToDetail(item) {
				if (this.calcAuditModeEnabled) return;
				if (this.isArticle(item)) {
					uni.navigateTo({
						url: '/pagesA/article-detail/article-detail?name=' + item.metadataName,
						animationType: 'slide-in-right'
					});
				} else {
					uni.navigateTo({
						url: '/pagesA/moment-detail/moment-detail?name=' + item.metadataName,
						animationType: 'slide-in-right'
					});
				}

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

	.article-card {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		margin: 0 24rpx;
		padding: 24rpx;
		border-radius: 12rpx;
		background-color: #ffff;
		box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.03);
		overflow: hidden;
		margin-bottom: 24rpx;
	}
</style>