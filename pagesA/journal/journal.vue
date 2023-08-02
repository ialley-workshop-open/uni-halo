<template>
	<view class="app-page">
		<view v-if="loading != 'success'" class="loading-wrap pa-24">
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
		</view>
		<!-- 内容区域 -->
		<view v-else class="app-page-content pa-24">
			<view v-if="dataList.length == 0" class="content-empty flex flex-center">
				<!-- 空布局 -->
				<tm-empty icon="icon-shiliangzhinengduixiang-" label="博主还没有写任何日记"></tm-empty>
			</view>
			<block v-else>
				<block v-for="(journal, index) in dataList" :key="index">
					<tm-translate animation-name="fadeUp" :wait="calcAniWait(index)">
						<!-- 日记卡片 -->
						<journal-card :journal="journal" :useLike="true"></journal-card>
					</tm-translate>
				</block>

				<tm-flotbutton @click="fnToTopPage" color="light-blue" size="m" icon="icon-angle-up"></tm-flotbutton>
				<view class="load-text">{{ loadMoreText }}</view>
			</block>
		</view>
	</view>
</template>

<script>
	import MarkdownConfig from '@/common/markdown/markdown.config.js';
	import mpHtml from '@/components/mp-html/components/mp-html/mp-html.vue';
	import journalCard from '@/components/journal-card/journal-card.vue';

	import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
	import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
	import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
	import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';

	export default {
		components: { mpHtml, tmSkeleton, tmEmpty, tmTranslate, tmFlotbutton, journalCard },
		data() {
			return {
				loading: 'loading',
				markdownConfig: MarkdownConfig,
				queryParams: {
					size: 10,
					page: 0
				},
				result: null,
				dataList: [],
				isLoadMore: false,
				loadMoreText: '加载中...'
			};
		},

		onLoad() {
			this.fnSetPageTitle('个人日记');
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
			fnGetData() {
				// uni.showLoading({
				// 	mask: true,
				// 	title: '加载中...'
				// });
				// 设置状态为加载中
				if (!this.isLoadMore) {
					this.loading = 'loading';
				}
				this.loadMoreText = '加载中...';
				this.$httpApi
					.getJournals(this.queryParams)
					.then(res => {
						this.loading = 'success';
						this.loadMoreText = res.data.hasNext ? '上拉加载更多' : '呜呜，没有更多数据啦~';
						// 处理数据
						this.result = res.data;
						if (this.isLoadMore) {
							this.dataList = this.dataList.concat(res.data.content);
						} else {
							this.dataList = res.data.content;
						}
						this.loading = 'success';
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
						}, 500);
					});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.app-page {
		width: 100vw;
		display: flex;
		flex-direction: column;
	}

	.loading-wrap {}

	.app-page-content {}

	.content-empty {
		height: 60vh;
	}
</style>