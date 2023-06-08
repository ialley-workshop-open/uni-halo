<template>
	<view class="app-page flex flex-col">
		<view v-if="loading != 'success'" class="loading-wrap">
			<tm-skeleton model="list"></tm-skeleton>
			<tm-skeleton model="list"></tm-skeleton>
			<tm-skeleton model="list"></tm-skeleton>
			<tm-skeleton model="list"></tm-skeleton>
		</view>

		<view class="page-content pa-24 flex flex-col" v-else>
			<view v-if="dataList.length == 0" class="content-empty flex flex-center"><tm-empty icon="icon-shiliangzhinengduixiang-" label="暂无任何日志"></tm-empty></view>

			<block v-else>
				<block v-for="(item, index) in dataList" :key="index">
					<tm-translate animation-name="fadeUp" :wait="calcAniWait(index)">
						<view class="card mb-24 bg-white pa-24 round-3">
							<view class="border-b-1 pb-20 text-size-l text-weight-b">
								<tm-tags :dense="true" :shadow="0" color="bg-gradient-light-blue-accent" size="s" model="fill">ID：{{ item.id }}</tm-tags>
								<tm-tags class="ml-24" :shadow="0" :dense="true" color="bg-gradient-orange-accent" size="s" model="fill">
									类型：{{ item.type | formatLogType }}
								</tm-tags>
								<tm-tags class="ml-24" v-if="false" :shadow="0" :dense="true" color="bg-gradient-blue-grey-accent" size="s" model="fill">
									关键值：{{ item.logKey }}
								</tm-tags>
							</view>
							<view class="mt-20 text-size-m">
								<view v-if="false" class="desc-item flex  ">
									<view class="desc-label text-grey-darken-2">日志类型</view>
									<view class="desc-value">{{ item.type | formatLogType }}</view>
								</view>
								<view class="desc-item flex mt-12">
									<view class="desc-label text-grey-darken-2">关键值</view>
									<view class="desc-value">{{ item.logKey }}</view>
								</view>
								<view class="desc-item flex flex-top-start mt-12">
									<view class="desc-label text-grey-darken-2">IP地址</view>
									<view class="desc-value">{{ item.ipAddress }}</view>
								</view>

								<view class="desc-item flex mt-12">
									<view class="desc-label text-grey-darken-2">日志内容</view>
									<view class="desc-value">{{ item.content }}</view>
								</view>
								<view class="desc-item flex mt-12">
									<view class="desc-label text-grey-darken-2">操作时间</view>
									<view class="desc-value">{{ item.time }}</view>
								</view>
							</view>
						</view>
					</tm-translate>
				</block>

				<tm-flotbutton @click="fnToTopPage" :offset="[16, 80]" color="bg-gradient-light-blue-accent" size="m" icon="icon-angle-up"></tm-flotbutton>
				<tm-flotbutton size="m" icon="icon-delete" color="bg-gradient-red-accent" @click="fnOnClear"></tm-flotbutton>
				<view class="load-text ">{{ loadMoreText }}</view>
			</block>
		</view>
	</view>
</template>

<script>
	import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
	import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
	import tmTags from '@/tm-vuetify/components/tm-tags/tm-tags.vue';
	import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
	import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
	import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
	export default {
		components: {
			tmSkeleton,
			tmEmpty,
			tmButton,
			tmTags,
			tmFlotbutton,
			tmTranslate
		},
		data() {
			return {
				loading: 'loading',

				queryParams: {
					size: 8,
					page: 0,
					sort: undefined
				},

				result: {},
				dataList: [],
				total: 0,
				isLoadMore: false,
				loadMoreText: '加载中...'
			};
		},
		filters: {
			formatLogType(val) {
				const logTypes = {
					BLOG_INITIALIZED: {
						value: 0,
						text: '博客初始化'
					},
					POST_PUBLISHED: {
						value: 5,
						text: '文章发布'
					},
					POST_EDITED: {
						value: 15,
						text: '文章修改'
					},
					POST_DELETED: {
						value: 20,
						text: '文章删除'
					},
					LOGGED_IN: {
						value: 25,
						text: '用户登录'
					},
					LOGGED_OUT: {
						value: 30,
						text: '注销登录'
					},
					LOGIN_FAILED: {
						value: 35,
						text: '登录失败'
					},
					PASSWORD_UPDATED: {
						value: 40,
						text: '修改密码'
					},
					PROFILE_UPDATED: {
						value: 45,
						text: '资料修改'
					},
					SHEET_PUBLISHED: {
						value: 50,
						text: '页面发布'
					},
					SHEET_EDITED: {
						value: 55,
						text: '页面修改'
					},
					SHEET_DELETED: {
						value: 60,
						text: '页面删除'
					},
					MFA_UPDATED: {
						value: 65,
						text: '两步验证'
					},
					LOGGED_PRE_CHECK: {
						value: 70,
						text: '登录验证'
					}
				};
				return logTypes[val].text;
			}
		},

		onLoad() {
			this.fnSetPageTitle('日志管理');
		},
		created() {
			this.fnGetData();
		},
		onPullDownRefresh() {
			this.queryParams.page = 0;
			this.dataList = [];
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
					.getLogsListByPage(this.queryParams)
					.then(res => {
						if (res.status == 200) {
							this.loadMoreText = res.data.hasNext ? '上拉加载更多' : '呜呜，没有更多数据啦~';
							this.result = res.data;
							this.total = res.data.total;
							const _tempDataList = res.data.content.map(item => {
								item['time'] = uni.$tm.dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss');
								return item;
							});
							if (this.isLoadMore) {
								this.dataList = this.dataList.concat(_tempDataList);
							} else {
								this.dataList = _tempDataList;
							}
							this.loading = 'success';
						} else {
							uni.$tm.toast('加载失败，请重试！');
							thi.loading = 'error';
						}
					})
					.catch(err => {
						console.error(err);
						uni.$tm.toast('加载失败，请重试！');
						this.loading = 'error';
						this.loadMoreText = '加载失败，请下拉刷新！';
					})
					.finally(() => {
						setTimeout(() => {
							uni.hideLoading();
							uni.stopPullDownRefresh();
						}, 300);
					});
			},

			// 删除
			fnOnClear() {
				uni.$eShowModal({
						title: '提示',
						content: `您确定要清空所有的日志记录吗？`,
						showCancel: true,
						cancelText: '否',
						cancelColor: '#999999',
						confirmText: '是',
						confirmColor: '#03a9f4'
					})
					.then(res => {
						uni.showLoading({
							mask: true,
							title: '正在清空...'
						});
						this.$httpApi.admin
							.deleteAllLogs()
							.then(res => {
								if (res.status == 200) {
									uni.$tm.toast('操作成功！');
									setTimeout(() => {
										this.queryParams.page = 0;
										this.dataList = [];
										this.fnGetData();
									}, 1000);
								} else {
									uni.$tm.toast('操作失败，请重试！');
								}
							})
							.catch(err => {
								console.error(err);
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
	}

	.page-content {}

	.content-empty {
		width: 100vw;
		height: 65vh;
	}

	.card {
		box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.05);
	}

	.desc-item {
		.desc-label {
			width: 150rpx;
			position: relative;

			&::after {
				content: '：';
				position: absolute;
				right: 0px;
				top: 0rpx;
			}
		}

		.desc-value {
			word-wrap: break-word;
			word-break: break-all;
			padding-left: 6rpx;
		}
	}
</style>