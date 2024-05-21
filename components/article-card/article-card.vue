<template>
	<view class="article-card " :class="cardType" @click="fnClickEvent('card')">
		<view class="left">
			<cache-image class="thumbnail" radius="6rpx" :url="$utils.checkThumbnailUrl(article.spec.cover)" :fileMd5="article.spec.cover" mode="aspectFill"></cache-image>
			<!-- <image class="thumbnail" lazy-load :src="$utils.checkThumbnailUrl(article.spec.cover)" mode="aspectFill"></image> -->
		</view>
		<view class="right">
			<view class="title">
				<text class="is-top bg-gradient-blue-accent" v-if="article.spec.pinned">置顶</text>
				<text class="title-text text-overflow">{{ article.spec.title }}</text>
			</view>
			<view class="content text-overflow-2">{{ article.status.excerpt }}</view>
			<view class="foot">
				<view class="create-time">
					<text class="time-label">发布时间：</text>
					{{ { d: article.spec.publishTime, f: 'yyyy-MM-dd' } | formatTime }}
				</view>
				<view class="visits">
					浏览
					<text class="number">{{ article.stats.visit }}</text>
					次
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import tmTags from '@/tm-vuetify/components/tm-tags/tm-tags.vue';
	export default {
		name: 'article-card',
		components: { tmTags },
		props: {
			from: {
				type: String,
				default: ''
			},
			article: {
				type: Object,
				default: () => {}
			}
		},
		computed: {
			cardType() {
				// tb_image_text=上图下文
				// tb_text_image=上文下图
				if (this.from == 'home' && this.globalAppSettings.layout.home == 'h_row_col2') {
					if (!['tb_image_text', 'tb_text_image', 'only_text'].some(x => x == this.globalAppSettings.layout.cardType)) {
						return [this.from, this.globalAppSettings.layout.home, 'tb_image_text'];
					}
					return [this.from, this.globalAppSettings.layout.home, this.globalAppSettings.layout.cardType];
				}
				return [this.globalAppSettings.layout.home, this.globalAppSettings.layout.cardType];
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
	.article-card {
		display: flex;
		box-sizing: border-box;
		margin: 0 24rpx;
		padding: 24rpx;
		border-radius: 12rpx;
		background-color: #ffff;
		box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.03);
		overflow: hidden;
		margin-bottom: 24rpx;

		&.h_row_col1 {
			display: flex;
			align-items: center;
		}

		&.home {
			&.h_row_col2 {
				margin: 12rpx;

				.left {
					width: 100%;
					height: 200rpx;

					.thumbnail {

						::v-deep uni-image {
							border-radius: 6rpx 6rpx 0 0 !important;
						}
					}
				}

				.right {
					.title {
						display: flex;
						align-items: center;
						font-size: 26rpx;
						font-weight: bold;

						.is-top {
							height: 36rpx;
							margin-right: 10rpx;
							line-height: 36rpx;
							vertical-align: 4rpx;
							transform: scale(0.9);
						}
					}

					.foot {
						justify-content: space-between;

						.create-time {
							font-size: 24rpx;

							.time-label {
								display: none;
							}
						}

						.visits {
							font-size: 24rpx;
							margin-left: 0;
						}
					}
				}

				&.tb_text_image {
					padding: 12rpx;

					.left .thumbnail {
						::v-deep {
							uni-image {
								border-radius: 6rpx !important;
							}
						}
					}
				}

				&.only_text {
					padding: 24rpx;

					.right .foot {
						.create-time {
							.time-label {
								display: none;
							}
						}

						.visits {
							font-size: 24rpx;
						}
					}
				}
			}
		}

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
			padding: 24rpx;

			.left {
				width: 100%;
				height: 340rpx;

				.thumbnail {
					::v-deep uni-image {
						border-radius: 6rpx 6rpx 0 0 !important;
					}
				}
			}

			.right {
				padding-left: 0;
				padding: 24rpx 0;
				padding-bottom: 0;
				width: 100%;

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
				height: 340rpx;
				order: 2;
				margin-top: 24rpx;
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
			padding: 36rpx;

			.left {
				display: none;
			}

			.right {
				padding-left: 0;

				.content {
					margin-top: 24rpx;
				}

				.foot {
					justify-content: flex-start;
					margin-top: 24rpx;

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
			width: 240rpx;
			height: 180rpx;

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
			padding-left: 30rpx;
			box-sizing: border-box;

			.title {
				display: flex;
				align-items: center;
				font-size: 30rpx;
				color: var(--main-text-color);

				.is-top {
					height: 40rpx;
					padding: 0 12rpx;
					margin-right: 10rpx;
					line-height: 40rpx;
					font-size: 24rpx;
					white-space: nowrap;
					vertical-align: 4rpx;
					color: #fff;
					// background-image: -webkit-linear-gradient(0deg, #3ca5f6 0, #a86af9 100%);
					border-radius: 6rpx 12rpx;
					box-shadow: none !important;
				}

				&-text {
					color: #303133;
				}
			}

			.content {
				display: -webkit-box;
				font-size: 26rpx;
				color: #909399;
				height: 80rpx;
				margin-top: 14rpx;
				line-height: 42rpx;
			}

			.foot {
				display: flex;
				font-size: 24rpx;
				justify-content: space-between;
				align-items: center;
				color: #909399;
				margin-top: 18rpx;

				.create-time {
					font-size: 26rpx;

					.time-label {
						display: none;
					}
				}

				.visits {
					.number {
						padding: 0 6rpx;
						font-size: 26rpx;
					}
				}
			}
		}
	}
</style>