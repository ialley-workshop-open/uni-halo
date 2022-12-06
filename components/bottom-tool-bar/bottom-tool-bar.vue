<template>
	<view class="bottom-tool-bar">
		<tm-translate :auto="true" animation-name="fadeUp">
			<view class="content flex">
				<view class="input" @click="fnToComment()">
					<text class="icon iconfont icon-edit"></text>
					<text class="text">(*^▽^*)说点啥吧~</text>
				</view>
				<view class="right flex">
					<!-- 点赞 -->
					<view class="item likes" @click="fnDoLikes()">
						<view class="iconfont icon-like"></view>
						<view class="text">{{ tempPost.likes }}</view>
					</view>
					<!-- 评论 -->
					<view class="item comment">
						<view class="iconfont icon-comment-dots"></view>
						<view class="text">{{ tempPost.commentCount }}</view>
					</view>
					<!-- 分享 -->
					<view class="item share" @click="fnOnShare()"><text class="iconfont icon-share1"></text></view>
				</view>
			</view>
		</tm-translate>

		<tm-shareSheet @change="fnOnShareChange" :actions="share.list" title="分享文章" v-model="share.show"></tm-shareSheet>
	</view>
</template>

<script>
import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
import tmShareSheet from '@/tm-vuetify/components/tm-shareSheet/tm-shareSheet.vue';
export default {
	name: 'bottom-tool-bar',
	components: {
		tmTranslate,
		tmShareSheet
	},
	props: {
		// 文章数据
		post: {
			type: Object,
			default: () => {}
		},
		// 其他参数
		params: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			share: {
				show: false,
				list: [
					[
						{ name: '微信好友', bgcolor: '#07c160', icon: 'icon-weixin', color: 'white' },
						{ name: '朋友圈', bgcolor: '#04c887', icon: 'icon-pengyouquan', color: 'white' },
						{ name: '生成海报', bgcolor: '#1dc0fd', icon: 'icon-QQ', color: 'white' }
					]
				]
			},
			tempPost: {}
		};
	},
	watch: {
		post: {
			deep: true,
			handler(val) {
				console.log('watch', val);
				this.tempPost = this.$utils.deepClone(val);
			}
		}
	},
	created() {
		console.log(this.post);
		this.tempPost = this.$utils.deepClone(this.post);
		console.log(this.tempPost);
	},
	methods: {
		fnToComment() {
			this.$Router.push({
				path: '/pagesA/comment/comment',
				query: {
					postId: this.post.id,
					parentId: 0,
					title: this.post.title,
					formPage: 'comment_list',
					type: 'post'
				}
			});
		},
		fnDoLikes() {
			this.$httpApi
				.postLikePost(this.post.id)
				.then(res => {
					if (res.status == 200) {
						uni.showToast({
							icon: 'none',
							title: '点赞成功'
						});
						this.tempPost.likes += 1;
					} else {
						uni.showToast({
							icon: 'none',
							title: res.message
						});
					}
				})
				.catch(err => {
					console.log(err);
					uni.showToast({
						icon: 'none',
						title: err.message
					});
				});
		},
		fnOnShare() {
			// this.$emit('on-share');
			this.share.show = true;
		},
		fnOnShareChange(e) {
			console.log(e);
		}
	}
};
</script>

<style scoped lang="scss">
.bottom-tool-bar {
	width: 100vw;
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 401;

	::v-deep {
		.tm-shareSheet-wk .uni-scroll-view-content {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	.content {
		width: 100%;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 24rpx;
		background-color: #ffffff;
		box-shadow: 0rpx -4rpx 24rpx rgba(0, 0, 0, 0.07);
		border-radius: 24rpx 24rpx 0 0;
		.input {
			width: 280rpx;
			padding: 12rpx 24rpx;
			background-color: #f5f5f5;
			border-radius: 60rpx;
			font-size: 24rpx;
			color: #666;
			.icon {
			}
			.text {
				padding-left: 8rpx;
			}
		}

		.right {
			width: 0;
			flex-grow: 1;
			align-items: center;
			justify-content: space-between;
			padding-left: 24rpx;
			.item {
				margin-left: 24rpx;
				text-align: center;
				display: flex;
				align-items: center;
				&.share {
					.iconfont {
						font-size: 36rpx;
					}
				}
				.iconfont {
					font-size: 36rpx;
					color: #333;
				}
				.text {
					padding-left: 6rpx;
					font-size: 32rpx;
				}
			}
		}
	}
}
</style>
