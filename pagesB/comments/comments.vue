<template>
	<view class="app-page flex flex-col">
		<view class="e-fixed bg-white"><tm-tabs color="light-blue" v-model="tab.activeIndex" :list="tab.list" align="center" @change="fnOnTabChange"></tm-tabs></view>
		<!-- 占位区域 -->
		<view style="width: 100vw;height: 90rpx;"></view>
		<view v-if="loading != 'success'" class="loading-wrap">
			<block v-if="loading == 'loading'">
				<tm-skeleton model="listAvatr"></tm-skeleton>
				<tm-skeleton model="listAvatr"></tm-skeleton>
				<tm-skeleton model="listAvatr"></tm-skeleton>
				<tm-skeleton model="listAvatr"></tm-skeleton>
				<tm-skeleton model="listAvatr"></tm-skeleton>
			</block>
			<view v-else-if="loading == 'error'" class="loading-error flex flex-col flex-center">
				<tm-empty icon="icon-wind-cry" label="加载失败"><tm-button theme="light-blue" size="m" @click="fnGetData()">重新加载</tm-button></tm-empty>
			</view>
		</view>
		<view v-else class="app-page-content pa-24">
			<view v-if="dataList.length == 0" class="content-empty flex flex-center"><tm-empty icon="icon-shiliangzhinengduixiang-" label="无数据"></tm-empty></view>
			<block v-else>
				<block v-for="(comment, index) in dataList" :key="index">
					<tm-translate animation-name="fadeUp" :wait="calcAniWait(index)">
						<view class="comment-card bg-white round-3 pt-24 pb-24">
							<view class="head flex flex-between pl-24 pr-24">
								<view class="left flex flex-center">
									<image class="avatar round-24" :src="comment.avatar" mode="aspectFill"></image>
									<text class=" ml-12 text-weight-b text-grey-darken-2">{{ comment.author }}</text>
									<tm-tags v-if="comment.isAdmin" color="bg-gradient-orange-lighten" size="s" model="fill" :shadow="0">博主</tm-tags>
								</view>
								<view class="right flex">
									<!-- 待审核 -->
									<block v-if="comment.status == 'AUDITING'">
										<tm-button theme="light-blue" :shadow="0" size="s" @click="fnReplyPass(comment)">通过</tm-button>
										<tm-button theme="light-blue" :shadow="0" size="s" @click="fnShowReplyModal(comment)">回复</tm-button>
										<tm-button theme="orange" :shadow="0" size="s" @click="fnRecycle(comment)">回收站</tm-button>
									</block>
									<!-- 已发布 -->
									<block v-if="comment.status == 'PUBLISHED'">
										<tm-button theme="light-blue" :shadow="0" size="s" @click="fnShowReplyModal(comment)">回复</tm-button>
										<tm-button theme="orange" :shadow="0" size="s" @click="fnRecycle(comment)">回收站</tm-button>
									</block>
									<!-- 回收站 -->
									<block v-if="comment.status == 'RECYCLE'">
										<tm-button theme="light-blue" :shadow="0" size="s" @click="fnRestore(comment)">还原</tm-button>
										<tm-button theme="red" :shadow="0" size="s" @click="fnDelete(comment)">删除</tm-button>
									</block>
								</view>
							</view>
							<view class="body pl-24 pr-24 mt-24 text-size-m">
								<view v-if="queryType == 'Posts'" class="text-grey-darken-1">文章：{{ comment.post.title }}</view>
								<view v-else-if="queryType == 'Sheets'" class="text-grey-darken-1">页面：{{ comment.sheet.title }}</view>
								<view v-else-if="queryType == 'Journals'" class="text-grey-darken-1">日记：{{ comment.journal.title }}</view>
								<view class="mt-16 comment-content">评论：{{ comment.content }}</view>
							</view>
							<view class="foot flex mt-24  pl-14 pr-14">
								<tm-tags color="bg-gradient-orange-accent" size="s" :round="6" model="text">ID：{{ comment.id }}</tm-tags>

								<tm-tags v-if="comment.status == 'AUDITING'" color="bg-gradient-blue-accent" size="s" :round="6" model="text">状态：审核中</tm-tags>
								<tm-tags v-else-if="comment.status == 'PUBLISHED'" color="bg-gradient-green-accent" size="s" :round="6" model="text">状态：已发布</tm-tags>
								<tm-tags v-if="comment.status == 'RECYCLE'" color="bg-gradient-red-accent" size="s" :round="6" model="text">状态：回收站</tm-tags>

								<tm-tags size="s" :round="6" color="bg-gradient-blue-grey-accent" model="text">
									{{ $tm.dayjs(comment.createTime).format('YYYY年MM月DD日 HH点mm分') }}
								</tm-tags>
							</view>
						</view>
					</tm-translate>
				</block>

				<tm-flotbutton @click="fnToTopPage" size="m" color="light-blue" icon="icon-angle-up"></tm-flotbutton>
				<view class="load-text">{{ loadMoreText }}</view>
			</block>

			<!-- 回复框 -->
			<tm-poup v-model="reply.show" position="bottom" height="75vh">
				<view class="poup-content">
					<view class="poup-head text-align-center text-weight-b text-size-g ma-24">回复评论</view>
					<scroll-view class="poup-body pa-24" :scroll-y="true" @touchmove.stop>
						<view class="text-size-m pa-30 pt-0 flex flex-center">
							<view class="pr-12">访客昵称</view>
							<view class="flex-1 pa-24 pt-12 pb-12 grey-lighten-5 text-grey round-3">{{ reply.data.author }}</view>
						</view>
						<view class="text-size-m pa-30 pt-0 flex flex-center">
							<view class="pr-12">邮箱地址</view>
							<view class="flex-1 pa-24 pt-12 pb-12 grey-lighten-5 text-grey round-3" @click="$utils.copyText(reply.data.email, '邮箱地址复制成功！')">
								{{ reply.data.email }}
							</view>
						</view>
						<view class="text-size-m pa-30 pt-0 flex flex-center">
							<view class="pr-12">网站地址</view>
							<view class="flex-1 pa-24 pt-12 pb-12 grey-lighten-5 text-grey round-3" @click="$utils.copyText(reply.data.authorUrl, '网站地址复制成功！')">
								{{ reply.data.authorUrl || '该访客未填写网站地址' }}
							</view>
						</view>
						<view class="text-size-m pa-30 pt-0">
							<view class="mb-24">评论内容</view>
							<view class="pa-24 pt-12 pb-12 grey-lighten-5 text-grey round-3">{{ reply.data.content }}</view>
						</view>
						<tm-input :vertical="true" :borderBottom="false" input-type="textarea" title="我的回复" bg-color="grey-lighten-5" v-model="reply.form.content" :height="150" :focus="true" :adjustPosition="true"></tm-input>
					</scroll-view>
					<view class="btn-wrap flex flex-center">
						<!-- 审核状态 -->
						<block v-if="reply.data.status == 'AUDITING'">
							<tm-button size="m" navtie-type="form" theme="bg-gradient-blue-accent" @click="fnReplyPass()">通过</tm-button>
							<tm-button size="m" navtie-type="form" theme="bg-gradient-blue-accent" @click="fnReplySubmit()">通过并回复</tm-button>
						</block>
						<!-- 已发布状态 -->
						<block v-else-if="reply.data.status == 'PUBLISHED'">
							<tm-button size="m" navtie-type="form" theme="bg-gradient-blue-accent" @click="fnReplySubmit()">回复</tm-button>
						</block>
						<!-- 回收站 -->
						<block v-else-if="reply.data.status == 'RECYCLE'">暂无操作</block>
						<tm-button size="m" theme="bg-gradient-blue-grey-accent" @click="reply.show = false">关 闭</tm-button>
					</view>
				</view>
			</tm-poup>
		</view>
	</view>
</template>

<script>
	import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
	import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
	import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
	import tmTabs from '@/tm-vuetify/components/tm-tabs/tm-tabs.vue';
	import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
	import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
	import tmTags from '@/tm-vuetify/components/tm-tags/tm-tags.vue';
	import tmPoup from '@/tm-vuetify/components/tm-poup/tm-poup.vue';
	import tmInput from '@/tm-vuetify/components/tm-input/tm-input.vue';

	export default {
		components: {
			tmSkeleton,
			tmButton,
			tmEmpty,
			tmTabs,
			tmTranslate,
			tmFlotbutton,
			tmTags,
			tmPoup,
			tmInput
		},
		data() {
			return {
				loading: 'loading',
				tab: {
					adtiveIndex: 0,
					list: ['文章评论', '页面评论', '日记评论']
				},
				queryParams: {
					size: 10,
					page: 0
				},
				result: {},
				dataList: [],
				queryType: 'Posts',
				isLoadMore: false,
				loadMoreText: '加载中...',
				reply: {
					show: false,
					data: {},
					form: {
						allowNotification: true,
						author: '',
						authorUrl: '',
						content: '',
						email: '',
						parentId: 0,
						postId: 0
					}
				}
			};
		},
		computed: {
			// 获取博主信息
			bloggerInfo() {
				return this.$tm.vx.getters().getBlogger;
			}
		},
		onLoad() {
			this.fnSetPageTitle('评论管理');
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
			fnOnTabChange(index) {
				this.fnResetSetAniWaitIndex();
				this.fnResetReply();
				this.dataList = [];
				this.queryType = ['Posts', 'Sheets', 'Journals'][index];
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
				this.$httpApi.admin[`get${this.queryType}Comments`](this.queryParams)
					.then(res => {
						console.log('请求结果：');
						console.log(res);

						this.loading = 'success';
						this.loadMoreText = res.data.hasNext ? '上拉加载更多' : '呜呜，没有更多数据啦~';
						const _list = res.data.content.map(x => {
							x.avatar = this.$utils.checkAvatarUrl(x.avatar, x.isAdmin);
							return x;
						});
						// 处理数据
						this.result = res.data;
						if (this.isLoadMore) {
							this.dataList = this.dataList.concat(_list);
						} else {
							this.dataList = _list;
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
			fnShowReplyModal(comment) {
				this.reply.data = comment;
				this.reply.form.parentId = comment.id;
				switch (this.queryType) {
					case 'Posts':
						this.reply.form.postId = comment.post.id;
						break;
					case 'Sheets':
						this.reply.form.postId = comment.sheet.id;
						break;
					case 'Journals':
						this.reply.form.postId = comment.journal.id;
						break;
				}
				this.reply.show = true;
			},
			fnResetReply() {
				this.reply = {
					show: false,
					data: {},
					form: {
						allowNotification: true,
						author: '',
						authorUrl: '',
						content: '',
						email: '',
						parentId: 0,
						postId: 0
					}
				};
			},
			// 审核通过
			fnReplyPass(comment) {
				uni.$eShowModal({
						title: '提示',
						content: `您是否要通过 ${comment.author} 的评论？`,
						showCancel: true,
						cancelText: '否',
						cancelColor: '#999999',
						confirmText: '是',
						confirmColor: '#03a9f4'
					})
					.then(res => {
						this.$httpApi.admin[`update${this.queryType}CommentsStatus`](comment.id, 'PUBLISHED')
							.then(res => {
								if (res.status == 200) {
									uni.$tm.toast(`操作成功！`);
									comment.status = 'PUBLISHED';
									// uni.startPullDownRefresh();
								} else {
									uni.$tm.toast('操作失败，请重试！');
								}
							})
							.catch(err => {
								uni.$tm.toast('操作失败，请重试！');
							});
					})
					.catch(err => {});
			},
			// 回复评论
			fnReplySubmit() {
				this.reply.form.author = this.bloggerInfo.nickname;
				this.reply.form.authorUrl = this.$haloConfig.social.blog || this.$haloConfig.apiUrl;
				this.reply.form.email = this.bloggerInfo.email;

				uni.showLoading({
					title: '正在回复中...'
				});
				this.$httpApi.admin[`post${this.queryType}Comments`](this.reply.form)
					.then(res => {
						if (res.status == 200) {
							uni.$tm.toast('回复成功');
							this.fnResetReply();
							this.fnToTopPage();
							uni.startPullDownRefresh();
						} else {
							uni.$tm.toast('回复失败，请重试！');
						}
					})
					.catch(err => {
						uni.$tm.toast('回复失败，请重试！');
					});
			},
			// 还原
			fnRestore(comment) {
				uni.$eShowModal({
						title: '提示',
						content: `您是否要将 ${comment.author} 的评论还原？`,
						showCancel: true,
						cancelText: '否',
						cancelColor: '#999999',
						confirmText: '是',
						confirmColor: '#03a9f4'
					})
					.then(res => {
						this.$httpApi.admin[`update${this.queryType}CommentsStatus`](comment.id, 'PUBLISHED')
							.then(res => {
								if (res.status == 200) {
									uni.$tm.toast(`已将 ${comment.author} 的评论还原！`);
									// uni.startPullDownRefresh();
									comment.status = 'PUBLISHED';
								} else {
									uni.$tm.toast('操作失败，请重试！');
								}
							})
							.catch(err => {
								uni.$tm.toast('操作失败，请重试！');
							});
					})
					.catch(err => {});
			},
			// 移到回收站
			fnRecycle(comment) {
				uni.$eShowModal({
						title: '提示',
						content: `您是否要将 ${comment.author} 的评论移到回收站？`,
						showCancel: true,
						cancelText: '否',
						cancelColor: '#999999',
						confirmText: '是',
						confirmColor: '#03a9f4'
					})
					.then(res => {
						this.$httpApi.admin[`update${this.queryType}CommentsStatus`](comment.id, 'RECYCLE')
							.then(res => {
								if (res.status == 200) {
									uni.$tm.toast(`已将 ${comment.author} 的评论移到回收站！`);
									comment.status = 'RECYCLE';
									// uni.startPullDownRefresh();
								} else {
									uni.$tm.toast('操作失败，请重试！');
								}
							})
							.catch(err => {
								uni.$tm.toast('操作失败，请重试！');
							});
					})
					.catch(err => {});
			},
			// 删除评论（永久删除）
			fnDelete(comment) {
				uni.$eShowModal({
						title: '提示',
						content: `您是否要将 ${comment.author} 的评论删除？`,
						showCancel: true,
						cancelText: '否',
						cancelColor: '#999999',
						confirmText: '是',
						confirmColor: '#03a9f4'
					})
					.then(res => {
						this.$httpApi.admin[`delete${this.queryType}CommentsById`](comment.id)
							.then(res => {
								if (res.status == 200) {
									uni.$tm.toast(`${comment.author} 的评论已删除！`);
									const delIndex = this.dataList.findIndex(x => x.id == comment.id);
									this.dataList.splice(delIndex, 1);
									// uni.startPullDownRefresh();
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
	}

	.loading-wrap {
		padding: 24rpx;

		.loading-error {
			height: 65vh;
		}
	}

	.content-empty {
		width: 100%;
		height: 60vh;
	}

	.comment-card {
		box-sizing: border-box;
		box-shadow: 0rpx 0rpx 24rpx rgba(0, 0, 0, 0.05);
		margin-bottom: 24rpx;

		.avatar {
			width: 56rpx;
			height: 56rpx;
			box-sizing: border-box;
			border: 4rpx solid #fff;
			box-shadow: 0rpx 0rpx 24rpx rgba(0, 0, 0, 0.15);
		}

		.comment-content {
			line-height: 1.6;
		}
	}

	.poup-content {
		overflow: hidden;
	}

	.poup-body {
		height: 60vh;
		box-sizing: border-box;
	}
</style>