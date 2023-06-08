<template>
	<view class="app-page flex flex-col pt-24">
		<view v-if="loading != 'success'" class="loading-wrap pa-24 pt-0">
			<block v-if="loading == 'loading'">
				<tm-skeleton model="listAvatr"></tm-skeleton>
				<tm-skeleton model="listAvatr"></tm-skeleton>
				<tm-skeleton model="listAvatr"></tm-skeleton>
			</block>
			<view v-else-if="loading == 'error'" class="loading-error flex flex-col flex-center">
				<tm-empty icon="icon-wind-cry" label="加载失败"><tm-button theme="light-blue" size="m" @click="fnGetData()">重新加载</tm-button></tm-empty>
			</view>
		</view>
		<view v-else class="app-page-content pa-24 pt-0">
			<view v-if="dataList.length == 0" class="content-empty flex flex-center">
				<!-- 空布局 -->
				<tm-empty icon="icon-shiliangzhinengduixiang-" label="博主还没有写任何日记"></tm-empty>
			</view>
			<block v-else>
				<block v-for="(journal, index) in dataList" :key="journal.id">
					<tm-translate animation-name="fadeUp" :wait="calcAniWait(index)">
						<journal-card :isAdmin="true" :journal="journal" :useLike="false" :useEdit="true" :useDel="true" @on-del="fnOnJournalDel" @on-edit="fnOnJournalEdit"></journal-card>
					</tm-translate>
				</block>
				<tm-flotbutton :offset="[16, 80]" @click="fnToTopPage" color="light-blue" size="m" icon="icon-angle-up"></tm-flotbutton>
				<view class="load-text">{{ loadMoreText }}</view>
			</block>
		</view>
		<tm-flotbutton @click="fnOnJournalEdit(null)" color="orange" size="m" icon="icon-plus"></tm-flotbutton>
	</view>
</template>

<script>
	import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
	import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
	import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
	import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
	import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';

	export default {
		components: {
			tmSkeleton,
			tmButton,
			tmEmpty,
			tmTranslate,
			tmFlotbutton
		},
		data() {
			return {
				loading: 'loading',
				queryParams: {
					size: 10,
					page: 0
				},
				form: {
					status: true,
					content: '',
					keepRaw: true,
					sourceContent: '',
					type: 'PUBLIC'
				},
				result: {},
				dataList: [],
				isLoadMore: false,
				loadMoreText: '加载中...'
			};
		},

		onLoad() {
			this.fnSetPageTitle('日记管理');
		},
		created() {
			this.fnGetData();
			uni.$on('journals_refresh', () => {
				this.isLoadMore = false;
				this.queryParams.page = 0;
				this.fnGetData(false);
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
			// 调用编辑操作
			fnOnToolBarEdit(e) {
				this.$refs.article[e.currentTarget.dataset.method]();
			},
			fnGetData(useTip = true) {
				if (useTip) {
					uni.showLoading({
						mask: true,
						title: '加载中...'
					});
				}
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
			},
			fnOnJournalDel(journal) {
				this.dataList.splice(this.dataList.findIndex(x => x.id == journal.id), 1);
			},
			fnOnJournalEdit(data) {
				uni.$tm.vx.commit('journal/setJournalInfo', data);
				this.$Router.push({
					path: '/pagesB/journal/journal-edit',
					query: data
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.app-page {
		width: 100vw;
		min-height: 100vh;
	}

	.loading-wrap {
		padding: 24rpx;

		.loading-error {
			height: 40vh;
		}
	}

	.edit-wrap {
		box-sizing: border-box;
		box-shadow: 0rpx 4rpx 24rpx rgba(0, 0, 0, 0.05);
	}
</style>