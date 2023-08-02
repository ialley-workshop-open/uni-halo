<template>
	<view class="app-page">
		<view v-if="loading != 'success'" class="loading-wrap pa-24">
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
		</view>
		<!-- 内容区域 -->
		<view v-else class="app-page-content pa-24" :class="{ 'bg-white': dataList.length !== 0 }">
			<view v-if="dataList.length == 0" class="content-empty flex flex-center">
				<!-- 空布局 -->
				<tm-empty icon="icon-shiliangzhinengduixiang-" label="啊偶,博主还没有留言~"></tm-empty>
			</view>
			<block v-else>
				<block v-for="(item, index) in dataList" :key="index">
					<tm-translate animation-name="fadeUp" :wait="calcAniWait(index)">
						<!-- 列表项 -->
						<comment-item class="mb-12" :isChild="false" :comment="item" :postId="sheetId" :useSolid="false" @on-copy="fnCopyContent" @on-comment="fnToComment" @on-detail="fnOnShowCommentDetail"></comment-item>
					</tm-translate>
				</block>
				<tm-flotbutton :offset="[16, 80]" @click="fnToTopPage" size="m" color="light-blue" icon="icon-angle-up"></tm-flotbutton>
				<view class="load-text">{{ loadMoreText }}</view>
			</block>
			<tm-flotbutton actions-pos="left" :show-text="true" color="bg-gradient-orange-accent" @click="fnToComment(null)"></tm-flotbutton>
		</view>

		<!-- 评论详情 -->
		<tm-poup v-model="commentDetail.show" height="auto" :round="6" :over-close="true" position="bottom">
			<view class="pa-24">
				<view class="poup-head pb-24">
					<view class="poup-title text-align-center text-size-g text-weight-b mb-32">留言详情</view>
					<comment-item :useActions="false" :isChild="false" :comment="commentDetail.comment" :postId="sheetId"></comment-item>
				</view>

				<scroll-view :scroll-y="true" class="poup-body">
					<view v-if="commentDetail.loading != 'success'" class="poup-loading-wrap flex flex-center">
						<view v-if="commentDetail.loading == 'loading'" class="loading flex flex-center flex-col">
							<text class="e-loading-icon iconfont icon-loading text-blue"></text>
							<view class="text-size-n text-grey-lighten-1 py-12 mt-12">加载中，请稍等...</view>
						</view>
						<view v-else-if="commentDetail.loading == 'error'" class="error">
							<tm-empty icon="icon-wind-cry" label="加载失败">
								<tm-button theme="bg-gradient-light-blue-accent" size="m" @click="fnGetChildComments()">刷新试试</tm-button>
							</tm-empty>
						</view>
					</view>
					<block v-else>
						<view v-if="commentDetail.list.length == 0" class="poup-empty flex flex-center">
							<tm-empty icon="icon-shiliangzhinengduixiang-" label="没有更多评论啦~"></tm-empty>
						</view>

						<block v-else>
							<comment-item v-for="(comment, index) in commentDetail.list" :useSolid="false" :useActions="false" :key="index" :isChild="false" :comment="comment" :postId="sheetId"></comment-item>
						</block>
					</block>
				</scroll-view>
			</view>
		</tm-poup>
	</view>
</template>

<script>
	import AppKeys from '@/config/keys.js';
	import SheetConfig from '@/config/sheets.config.js';

	import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
	import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
	import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
	import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
	import tmPoup from '@/tm-vuetify/components/tm-poup/tm-poup.vue';
	import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
	import commentItem from '@/components/comment-item/comment-item.vue';

	export default {
		components: {
			tmSkeleton,
			tmFlotbutton,
			tmTranslate,
			tmEmpty,
			tmPoup,
			tmButton,
			commentItem
		},
		data() {
			return {
				loading: 'loading',
				queryParams: {
					size: 10,
					page: 0
				},
				result: null,
				dataList: [],
				isLoadMore: false,
				loadMoreText: '加载中...',
				sheetId: SheetConfig[AppKeys.SHEET_LEAVING],
				commentDetail: {
					loading: 'loading',
					show: false,
					comment: {},
					postId: undefined,
					list: []
				}
			};
		},

		onLoad() {
			this.fnSetPageTitle('留言板');
		},
		created() {
			this.fnGetData();
			uni.$on('leaving_refresh', () => {
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
					.getSheetsCommentsTreeBySheetId(this.sheetId, this.queryParams)
					.then(res => {
						if (res.status == 200) {
							this.loading = 'success';
							// return;
							this.loadMoreText = res.data.hasNext ? '上拉加载更多' : '呜呜，没有更多数据啦~';
							// 处理数据
							this.result = res.data;
							if (this.isLoadMore) {
								this.dataList = this.dataList.concat(res.data.content);
							} else {
								this.dataList = res.data.content;
							}
						} else {
							this.loading = 'error';
							this.loadMoreText = '加载失败，请下拉刷新！';
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
						}, 500);
					});
			},
			fnToComment(data) {
				let _comment = {};
				if (data) {
					_comment = {
						id: this.sheetId,
						parentId: data.comment.id,
						title: data.comment.author,
						from: 'sheets',
						formPage: 'leaving',
						type: 'user'
					};
				} else {
					_comment = {
						id: this.sheetId,
						parentId: 0,
						title: '留言板留言',
						from: 'sheets',
						formPage: 'leaving',
						type: 'post'
					};
				}

				uni.$tm.vx.commit('comment/setCommentInfo', _comment);
				this.$Router.push({
					path: '/pagesA/comment/comment',
					query: _comment
				});
			},
			fnCopyContent(content) {
				uni.$tm.u.setClipboardData(content);
				uni.$tm.toast('内容已复制成功！');
			},
			fnOnShowCommentDetail(comment) {
				this.commentDetail.comment = comment;
				this.commentDetail.list = [];
				this.commentDetail.show = true;
				this.fnGetChildComments();
			},
			fnGetChildComments() {
				this.commentDetail.loading = 'loading';
				this.$httpApi
					.getSheetsChildrenCommentList(this.sheetId, this.commentDetail.comment.id, {})
					.then(res => {
						if (res.status == 200) {
							this.commentDetail.loading = 'success';
							this.commentDetail.list = res.data;
						} else {
							this.commentDetail.loading = 'error';
						}
					})
					.catch(err => {
						this.commentDetail.loading = 'error';
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
		background-color: #fafafd;
	}

	.app-page-content {
		box-sizing: border-box;
		// box-shadow: 0rpx 0rpx 24rpx rgba(0, 0, 0, 0.05);
	}

	.content-empty {
		width: 100%;
		height: 60vh;
	}

	.loading-wrap {
		box-sizing: border-box;
		padding: 24rpx;
	}
</style>