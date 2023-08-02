<template>
	<view class="article-min-card" :class="[globalAppSettings.layout.cardType]" @click="fnClickEvent('card')">
		<view class="left">
			<cache-image class="thumbnail" radius="6rpx" :url="$utils.checkThumbnailUrl(article.thumbnail)" :fileMd5="$utils.checkThumbnailUrl(article.thumbnail)" mode="aspectFill"></cache-image>
		</view>
		<view class="right">
			<view class="title text-overflow">{{ article.title }}</view>
			<view class="content text-overflow">{{ article.summary }}</view>
			<view class="foot">
				<view class="create-time">
					<!-- <text class="icon iconfont icon-clock"></text> -->
					<text class="time-label">发布时间：</text>
					{{ { d: article.createTime, f: 'yyyy-MM-dd' } | formatTime }}
				</view>
				<view class="visits">
					<!-- <text class="icon iconfont icon-eye"></text> -->
					浏览
					<text class="number">{{ article.visits }}</text>
					次
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'article-min-card',
		props: {
			article: {
				type: Object,
				default: () => {}
			}
		},
		methods: {
			fnClickEvent() {
				this.$emit('on-click', this.article);
			}
		}
	};
</script>

<style scoped lang="scss">
	.article-min-card {
		display: flex;
		box-sizing: border-box;
		border-radius: 12rpx;
		background-color: #ffff;
		overflow: hidden;
		margin: 12rpx 24rpx;
		margin-bottom: 24rpx;
		padding: 16rpx;
		box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.03);

		&.lr_image_text {}

		&.lr_text_image {
			.left {
				order: 2;
				padding-left: 30rpx;
			}

			.right {
				order: 1;
				padding-left: 0;
			}
		}

		&.tb_image_text {
			flex-direction: column;

			.left {
				width: 100%;
				height: 220rpx;
			}

			.right {
				padding-left: 0;
				width: 100%;

				.title {
					margin-top: 24rpx;
				}

				.foot {
					justify-content: flex-start;

					.create-time {
						.time-label {
							display: inline-block;
						}
					}

					.visits {
						margin-left: 24rpx;
					}
				}
			}
		}

		&.tb_text_image {
			flex-direction: column;

			.left {
				width: 100%;
				height: 220rpx;
				order: 2;
				margin-top: 20rpx;
			}

			.right {
				padding-left: 0;
				width: 100%;
				order: 1;

				.foot {
					justify-content: flex-start;

					.create-time {
						.time-label {
							display: inline-block;
						}
					}

					.visits {
						margin-left: 24rpx;
					}
				}
			}
		}

		&.only_text {
			.left {
				display: none;
			}

			.right {
				padding-left: 0;

				.foot {
					justify-content: flex-start;

					.create-time {
						.time-label {
							display: inline-block;
						}
					}

					.visits {
						margin-left: 24rpx;
					}
				}
			}
		}

		.left {
			width: 180rpx;
			height: 130rpx;

			.thumbnail {
				width: 100%;
				height: 100%;
				border-radius: 12rpx;
			}
		}

		.right {
			width: 0;
			flex-grow: 1;
			display: flex;
			flex-direction: column;
			padding-left: 20rpx;

			.title {
				font-size: 28rpx;
				font-weight: 600;
				color: var(--main-text-color);
			}

			.content {
				font-size: 26rpx;
				color: #909399;
				margin-top: 14rpx;
			}

			.foot {
				display: flex;
				font-size: 24rpx;
				justify-content: space-between;
				align-items: center;
				color: #909399;
				margin-top: 14rpx;

				.create-time {
					font-size: 24rpx;

					.time-label {
						display: none;
					}

					.icon {
						font-size: 24rpx;
						padding-right: 4rpx;
					}
				}

				.visits {
					.icon {
						font-size: 28rpx;
					}

					.number {
						padding: 0 6rpx;
						font-size: 24rpx;
					}
				}
			}
		}
	}
</style>