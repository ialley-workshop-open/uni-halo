<template>
	<view class=" comment-item flex flex-col mt-30 pt-24" :class="{ 'child-comment-item': isChild, 'no-solid': !useSolid, classItem }">
		<view class="comment-item_user flex">
			<image
				v-if="comment.isAdmin"
				class="user-avatar"
				:class="{ 'is-radius': globalAppSettings.isAvatarRadius }"
				:src="bloggerInfo.avatar"
				mode="aspectFill"
				@error="fnOnImageError(comment)"
			></image>
			<image
				v-else
				class="user-avatar"
				:class="{ 'is-radius': globalAppSettings.isAvatarRadius }"
				:src="comment.avatar"
				mode="aspectFill"
				@error="fnOnImageError(comment)"
			></image>
			<view class="user-info pl-14">
				<view class="author">
					<text class="mr-6 text-grey-darken-1 text-size-m">{{ comment.author }}</text>
					<tm-tags v-if="comment.isAdmin" :dense="true" color="bg-gradient-amber-accent" size="xs" model="fill">博主</tm-tags>

					<tm-tags v-else :dense="true" color="bg-gradient-light-blue-lighten " size="xs" model="fill">游客</tm-tags>
				</view>
				<view class="flex mt-4">
					<view v-if="false" class="text-size-s text-grey mr-12">IP属地：暂无信息</view>
					<view class="time text-size-xs text-grey">
						<text class="">{{ $tm.dayjs(comment.createTime).format('YYYY年MM月DD日') }}</text>
						<text class="ml-12">{{ $tm.dayjs(comment.createTime).fromNow(true) }}前</text>
					</view>
				</view>
			</view>
			<view v-if="useActions" class="">
				<tm-button size="s" text theme="blue" @click="$emit('on-comment', { type: 'user', comment: comment })">回复</tm-button>
				<tm-button size="s" text theme="grey" @click="$emit('on-copy', comment.content)">复制</tm-button>
			</view>
		</view>

		<view class="comment-item_content mt-12" :class="{ 'has-bg': useContentBg, 'not-ml': isChild }" @click="$emit('on-detail', comment)" v-html="comment.content"></view>
		<!-- 	<view v-if="useActions" class="comment-item_info text-size-s text-grey">
			<text v-if="false" @click="$emit('on-todo')">点赞</text>
			<text @click="$emit('on-comment', { type: 'user', comment: comment })">回复</text>
			<text v-if="false" class="ml-24" @click="$emit('on-todo')">举报</text>
			<text class="ml-24" @click="$emit('on-copy', comment.content)">复制内容</text>
		</view> -->
	</view>
</template>

<script>
import tmTags from '@/tm-vuetify/components/tm-tags/tm-tags.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
export default {
	name: 'comment-item',
	components: { tmTags, tmButton },
	props: {
		classItem: {
			type: Array,
			default: () => []
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
		postId: {
			type: Number,
			default: null
		},
		comment: {
			type: Object,
			default: () => {}
		}
	},
	computed: {
		// 获取博主信息
		bloggerInfo() {
			let blogger = this.$tm.vx.getters().getBlogger;
			blogger.avatar = this.$utils.checkAvatarUrl(blogger.avatar, true);
			return blogger;
		}
	},
	methods: {
		fnOnImageError(data) {
			if (data.isAdmin) {
				data.avatar = this.$haloConfig.author.avatar;
			} else {
				data.avatar = `${this.$haloConfig.defaultAvatarUrl}&rt=${new Date().getTime()}`;
			}
		}
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
