<template>
	<view class="comment-list">
		<!-- 顶部区域 -->
		<view class="comment-list_head">
			<view class="title">
				评论列表
				<text class="count">（{{ result.total || 0 }}条）</text>
			</view>
			<view class="filter">
				<text class="filter-item " :class="{ active: sort == 0 }" @click="fnOnSort(0)">默认</text>
				<text class="filter-item  " :class="{ active: sort == 1 }" @click="fnOnSort(1)">热评</text>
				<!-- <text class="filter-item">全部</text> -->
			</view>
		</view>
		<!-- 内容区域 -->
		<view class="comment-list_content">
			<view v-if="loading != 'success'" class="loading-wrap flex">
				<view v-if="loading == 'loading'" class="loading flex flex-center flex-col">
					<text class="e-loading-icon iconfont icon-loading text-blue"></text>
					<view class="text-size-n text-grey-lighten-1 py-12 mt-12">加载中，请稍等...</view>
				</view>
				<view v-else-if="loading == 'error'" class="error">
					<tm-empty icon="icon-wind-cry" label="加载失败">
						<tm-button theme="bg-gradient-light-blue-accent" size="m" v-if="!disallowComment" @click="fnToComment()">刷新试试</tm-button>
					</tm-empty>
				</view>
			</view>
			<block v-else>
				<tm-alerts
					v-if="disallowComment && dataList.length !== 0"
					color="red"
					text
					:margin="[0, 0]"
					:shadow="0"
					label="Ծ‸Ծ博主已设置该文章禁止评论!"
					:round="3"
					close
				></tm-alerts>
				<view class="empty pt-50" v-if="dataList.length == 0">
					<tm-empty v-if="disallowComment" icon="icon-shiliangzhinengduixiang-" label="暂无评论">
						<text class="text-red text-size-s">- 文章已开启禁止评论 -</text>
					</tm-empty>
					<tm-empty v-else icon="icon-shiliangzhinengduixiang-" label="暂无评论">
						<tm-button theme="bg-gradient-light-blue-accent" size="m" @click="fnToComment(null)">抢沙发</tm-button>
					</tm-empty>
				</view>
				<block v-else>
					<!-- 评论内容 : 目前仅支持二级评论 -->
					<block v-for="(comment, index) in dataList" :key="comment.id">
						<comment-item
							:useContentBg="false"
							:isChild="false"
							:comment="comment"
							:postId="postId"
							:disallowComment="disallowComment"
							@on-copy="fnCopyContent"
							@on-comment="fnToComment"
							@on-todo="fnToDo"
							@on-detail="fnShowCommetnDetail"
						></comment-item>

						<!-- 二级评论 -->
						<block v-if="comment.children && comment.children.length != 0">
							<block v-for="(childComment, childIndex) in comment.children" :key="childComment.id">
								<comment-item
									:useContentBg="false"
									:isChild="true"
									:comment="childComment"
									:postId="postId"
									:disallowComment="disallowComment"
									@on-copy="fnCopyContent"
									@on-comment="fnToComment"
									@on-todo="fnToDo"
									@on-detail="fnShowCommetnDetail"
								></comment-item>
							</block>
						</block>
					</block>
					<view v-if="false" class="to-more-comment">
						<tm-button item-class="btn" :block="true" width="90vw" theme="bg-gradient-light-blue-lighten" size="m">点击查看全部评论</tm-button>
					</view>
				</block>
			</block>
		</view>
	</view>
</template>

<script>
import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
import tmAlerts from '@/tm-vuetify/components/tm-alerts/tm-alerts.vue';

export default {
	name: 'comment-list',
	components: { tmEmpty, tmButton, tmAlerts },
	props: {
		// 是否禁用评论
		disallowComment: {
			type: Boolean,
			default: false
		},
		postId: {
			type: Number,
			default: null
		},
		post: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			loading: 'loading',
			sort: 0,
			queryParams: {
				sort: '',
				more: true
			},
			api: 'getPostCommentTree',
			result: {},
			dataList: []
		};
	},
	created() {
		this.fnGetData();
		uni.$on('comment_list_refresh', () => {
			this.fnOnSort(this.sort, true);
		});
	},
	methods: {
		fnOnSort(type, refresh = false) {
			if (this.sort == type && refresh == false) return;
			const _api = ['getPostCommentTree', 'getPostTopCommentList'];
			this.sort = type;
			this.api = _api[type];
			this.fnGetData();
		},
		fnGetData() {
			this.loading = 'loading';
			this.$httpApi[this.api](this.postId, {})
				.then(res => {
					if (res.status == 200) {
						this.result = res.data;
						this.dataList = res.data.content;
						this.loading = 'success';
					} else {
						this.loading = 'error';
					}
				})
				.catch(err => {
					this.loading = 'error';
				})
				.finally(() => {
					uni.hideLoading();
				});
		},
		fnToDo() {
			uni.$tm.toast('Halo暂未支持！');
		},
		fnToComment(data) {
			if (this.disallowComment) {
				return uni.$tm.toast('文章已禁止评论！');
			}
			console.log(data);
			let _comment = {};
			if (data) {
				let { type, comment } = data;
				// 来自用户
				_comment = {
					id: this.post.id,
					parentId: comment.id,
					title: comment.author,
					from: 'posts',
					formPage: 'comment_list',
					type: 'user'
				};
			} else {
				// 来自文章
				_comment = {
					id: this.post.id,
					parentId: 0,
					title: '评论文章：' + this.post.title,
					formPage: 'comment_list',
					from: 'posts',
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

		fnShowCommetnDetail(comment) {
			this.$emit('on-comment-detail', {
				postId: this.postId,
				comment: comment
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.comment-list {
	&_head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		box-sizing: border-box;
		padding-left: 24rpx;
		font-size: 30rpx;
		font-weight: bold;

		&:before {
			content: '';
			position: absolute;
			left: 0rpx;
			top: 8rpx;
			width: 8rpx;
			height: 26rpx;
			background-color: rgb(3, 174, 252);
			border-radius: 6rpx;
		}
		.title {
			.count {
				font-size: 28rpx;
				font-weight: normal;
			}
		}
		.filter {
			font-size: 26rpx;
			font-weight: normal;

			&-item {
				margin-left: 20rpx;
				color: #666;
				&.active {
					font-weight: bold;
					color: rgb(255, 152, 0);
					font-size: 26rpx;
				}
			}
		}
	}
	&_content {
		margin-top: 24rpx;
		padding-bottom: 36rpx;
	}
}
.loading-wrap {
	width: 100%;
	height: 506rpx;
	.loading {
		width: 100%;
	}

	.e-loading-icon {
		font-size: 100rpx;
	}
}

.to-more-comment {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 80rpx;
	::v-deep {
		.tm-button .tm-button-btn uni-button {
			height: 70rpx;
		}
	}
}
</style>
