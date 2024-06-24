<template>
	<view v-if="comment" class=" comment-item flex flex-col mt-30 pt-24"
		:class="{ 'child-comment-item': isChild, 'no-solid': !useSolid, classItem }">
		<view class="comment-item_user flex">
			<image class="user-avatar" :class="{ 'is-radius': globalAppSettings.isAvatarRadius }"
				:src="$utils.checkAvatarUrl(comment.owner.avatar, false)" mode="aspectFill"
				@error="fnOnImageError(comment)"></image>
			<view class="user-info pl-14">
				<view class="author">
					<text class="mr-6 text-grey-darken-1 text-size-m">{{ comment.owner.displayName }}</text>
				</view>
				<view class="flex mt-4">
					<view class="time text-size-xs text-grey">
						<text class="">{{ $tm.dayjs(comment.spec.creationTime).format('YYYY年MM月DD日') }}</text>
						<text class="ml-12">{{ $tm.dayjs(comment.spec.creationTime).fromNow(true) }}前</text>
					</view>
				</view>
			</view>
			<view v-if="useActions" class="">
				<tm-button v-if="!disallowComment" size="s" text theme="blue"
					@click="$emit('on-comment', { type: 'user', comment: comment })">回复</tm-button>
				<tm-button size="s" text theme="grey" @click="$emit('on-copy', comment.spec.raw)">复制</tm-button>
			</view>
		</view>

		<view class="comment-item_content mt-12" :class="{ 'has-bg': useContentBg, 'not-ml': isChild }"
			@click="$emit('on-detail', comment)" v-html="comment.spec.raw"></view>
	</view>
</template>

<script>
	import tmTags from '@/tm-vuetify/components/tm-tags/tm-tags.vue';
	import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
	export default {
		name: 'comment-item',
		components: {
			tmTags,
			tmButton
		},
		props: {
			classItem: {
				type: Array,
				default: () => []
			},
			disallowComment: {
				type: Boolean,
				default: false
			},
			useActions: {
				type: Boolean,
				default: true
			},
			useSolid: {
				type: Boolean,
				default: true
			},
			useContentBg: {
				type: Boolean,
				default: true
			},
			isChild: {
				type: Boolean,
				default: false
			},
			postName: {
				type: String,
				default: ""
			},
			comment: {
				type: Object,
				default: () => null
			}
		},
		computed: {
			imageConfigs() {
				return this.$tm.vx.getters().getConfigs.imagesConfig;
			},
			bloggerInfo() {
				let blogger = this.$tm.vx.getters().getConfigs.authorConfig.blogger;
				blogger.avatar = this.$utils.checkAvatarUrl(blogger.avatar, true);
				return blogger;
			}
		},
		methods: {
			fnOnImageError(data) {
				if (data && data.owner) {
					if (this.imageConfigs.defaultAvatarUrl.indexOf('?') == -1) {
						data.owner.avatar = `${this.imageConfigs.defaultAvatarUrl}?next-v=${new Date().getTime()}`
					} else {
						data.owner.avatar = `${this.imageConfigs.defaultAvatarUrl}&next-v=${new Date().getTime()}`
					}
				}
			}
		},
		created() {
			console.log("comment", this.comment)
		}
	};
</script>

<style scoped lang="scss">
	.comment-item {
		box-sizing: border-box;
		border-top: 2rpx solid #f5f5f5;

		&.child-comment-item {
			padding-top: 0;
			margin-left: 80rpx;
			border: 0;
		}

		&.no-solid {
			border: 0;
			margin-top: 0 !important;
		}

		&_user {
			display: flex;
			align-items: center;

			.user-avatar {
				width: 70rpx;
				height: 70rpx;
				box-sizing: border-box;
				box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.05);
				border: 4rpx solid #ffffff;
				border-radius: 12rpx;

				&.is-radius {
					border-radius: 50%;
				}
			}

			.user-info {
				width: 0;
				flex-grow: 1;
			}
		}

		&_content {
			font-size: 28rpx;
			margin-left: 80rpx;
			box-sizing: border-box;
			border-radius: 10rpx;
			line-height: 1.8;
			color: var(--main-text-color);

			&.has-bg {
				background-color: #fafafa;
				padding: 6rpx 24rpx;
			}

			&.not-ml {
				margin-left: 80rpx;
			}
		}

		&_info {
			margin-top: 6rpx;
			display: flex;
			align-items: center;
			margin-left: 80rpx;
		}
	}
</style>