<template>
	<view class="app-page">
		<view class="love-card">
			<view class="head">
				<image class="avatar" :src="loveConfig.boy.avatar" mode="scaleToFill"></image>
				<view class="love-days">
					<view class="tip-text">相恋</view>
					<view class="number">
						<text class="boy">-</text>
						<text class="days">{{ calcLoveDays }}</text>
						<text class="girl">-</text>
					</view>
					<view class="tip-text">天</view>
				</view>
				<image class="avatar" :src="loveConfig.girl.avatar" mode="scaleToFill"></image>
			</view>
			<view class="foot">
				<view class="text" v-if="false">
					我们已经相恋
					<text class="number">- {{ calcLoveDays }} -</text>
					天啦
				</view>
				看看我们的恋爱清单都完成了哪些吧
			</view>
		</view>
		<view v-if="list.length == 0" class="list empty">
			<view class="card">
				<image class="empty-image" :src="loveConfig.loveImageUrl" mode="scaleToFill"></image>
				<view class="empty-text">暂时还没有恋爱清单，快去制定你们的恋爱清单吧~</view>
			</view>
		</view>
		<view v-else class="list">
			<block v-for="(item, index) in list" :key="index">
				<view class="card" :style="{ '--delay': calcCardDelay(index) }">
					<view class="head">
						<view class="status">
							<view v-if="!item.finish" class="text">进行中</view>
							<view v-else class="text finish">已完成</view>
						</view>
						<view class="title">
							<view class="title-name">{{ item.title }}</view>
							<view class="title-desc">{{ item.desc }}</view>
						</view>
						<view class="actions" @click="fnOnItemOpen(item)">
							<text class="icon">{{ item.open ? '-' : '+' }}</text>
						</view>
					</view>
					<view v-if="item.open" class="body">
						<view class="desc">
							<view class="desc-label">开始时间：</view>
							<view class="desc-value">{{ item.detail.start || '暂无计划' }}</view>
						</view>
						<view class="desc" v-if="item.detail.desc">
							<view class="desc-label">事件描述：</view>
							<view class="desc-value">{{ item.detail.desc }}</view>
						</view>
						<view class="desc">
							<view class="desc-label">完成时间：</view>
							<view class="desc-value">{{ item.detail.end || '未开始或正在进行中...' }}</view>
						</view>
						<view class="desc">
							<view class="desc-label">完成打卡：</view>
							<view class="desc-value">{{ item.detail.moment || '未开始或正在进行中...' }}</view>
						</view>
						<view class="desc" v-if="item.detail.other">
							<view class="desc-label">爱心备注：</view>
							<view class="desc-value">{{ item.detail.other }}</view>
						</view>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
import LoveConfig from '@/config/love.config.js';
export default {
	data() {
		return {
			loveConfig: LoveConfig,
			list: []
		};
	},
	computed: {
		calcLoveDays() {
			const start = new Date(this.loveConfig.loveStartDate),
				now = new Date();
			const T = now.getTime() - start.getTime();
			const i = 24 * 60 * 60 * 1000;
			const d = T / i;
			const D = Math.floor(d);
			return D;
		},
		calcCardDelay() {
			return index => {
				return Math.random() * index + 1 + 's';
			};
		}
	},
	created() {
		this.fnGetList();
	},
	methods: {
		fnGetList() {
			if (LoveConfig.loveList.useApi && LoveConfig.loveList.api) {
				uni.request({
					url: LoveConfig.loveList.api,
					header: {
						ContentType: 'application/json'
					},
					method: 'GET',
					dataType: 'json',
					success: res => {
						if (res.statusCode == 200 && res.data.status == 200) {
							this.list = res.data.data.map(item => {
								item['open'] = false;
								return item;
							});
						} else {
							uni.$tm.toast('数据请求失败，请检查接口！');
						}
					},
					fail: err => {
						uni.$tm.toast('数据请求失败，请检查接口！');
					}
				});
			} else {
				this.list = LoveConfig.loveList.data.map(item => {
					item['open'] = false;
					return item;
				});
			}
		},
		fnOnItemOpen(item) {
			item.open = !item.open;
			this.$forceUpdate();
		}
	}
};
</script>

<style scoped lang="scss">
.app-page {
	width: 100vw;
	min-height: 100vh;
	box-sizing: border-box;
	padding: 36rpx;
	/* #ifdef H5 */
	padding-top: 60rpx;
	/* #endif */
	/* #ifndef H5 */
	padding-top: 180rpx;
	/* #endif */

	background: linear-gradient(
		135deg,
		rgba(247, 149, 51, 0.1),
		rgba(243, 112, 85, 0.1) 15%,
		rgba(239, 78, 123, 0.1) 30%,
		rgba(161, 102, 171, 0.1) 44%,
		rgba(80, 115, 184, 0.1) 58%,
		rgba(16, 152, 173, 0.1) 72%,
		rgba(7, 179, 155, 0.1) 86%,
		rgba(109, 186, 130, 0.1)
	);
	// background: rgba(247, 246, 242, 1);
	// color: #55423b;
}
.love-card {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-sizing: border-box;
	padding: 0 24rpx;
	padding-top: 66rpx;
	padding-bottom: 52rpx;
	border-radius: 50rpx;
	border: 4rpx solid rgba(96, 77, 68, 0.9);
	border-color: #faf8eb;
	background-color: rgba(255, 199, 184, 0.9);
	margin-bottom: 52rpx;
	box-shadow: 0rpx 4rpx 24rpx rgba(0, 0, 0, 0.1);
	transition: transform 0.5s ease-in-out;
	&:hover {
		transform: translateY(-6rpx);
	}
	.head {
		display: flex;
		.avatar {
			width: 150rpx;
			height: 150rpx;
			box-sizing: border-box;
			border-radius: 50%;
			border: 6rpx solid rgba(255, 255, 255, 0.7);

			&.boy {
				border-color: #56bbf9;
			}
			&.girl {
				border-color: #f88ca2;
			}
		}
		.love-days {
			margin: 0 12rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: 26rpx;
			.tip-text {
				color: #333;
			}
			.number {
				font-size: 46rpx;
				padding: 12rpx 0;
				> .boy {
					color: #56bbf9;
					margin-right: 12rpx;
				}
				> .girl {
					color: #f88ca2;
					margin-left: 12rpx;
				}
			}
			.days {
				animation: daysAni 6s ease-in-out infinite;
				font-weight: bold;
			}
		}
	}
	.foot {
		display: none;
		margin-top: 36rpx;
		font-size: 24rpx;
	}
}
@keyframes daysAni {
	0% {
		color: #f88ca2;
	}
	50% {
		color: #56bbf9;
	}
	100% {
		color: #f88ca2;
	}
}
.list {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
}
.empty {
	height: calc(100vh - 180rpx - 280rpx - 36rpx);
	.card {
		height: 100%;
		padding: 100rpx;
		margin-bottom: 0;
		text-align: center;
		justify-content: center;
		color: rgba(96, 77, 68, 0.9);
	}
	&-image {
		width: 300rpx;
		height: 300rpx;
	}
	&-text {
		margin-top: 36rpx;
		line-height: 50rpx;
	}
}
.card {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-sizing: border-box;
	padding: 24rpx;
	border-radius: 50rpx;
	border: 4rpx solid rgba(96, 77, 68, 0.9);
	border-color: #fff;
	// background-color: #faf8eb;
	background-color: #ffffff;
	margin-bottom: 36rpx;
	box-shadow: 0rpx 4rpx 24rpx rgba(0, 0, 0, 0.1);
	transition: transform 0.3s ease-in-out;
	animation: cardAni 3s ease-in-out infinite;
	animation-delay: var(--delay);
	&:hover {
		transform: translateY(-8rpx);
	}
	.head {
		width: 100%;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		.status {
			width: 100rpx;
			display: flex;
			.text {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				background-color: #ffc6ba;
				font-size: 24rpx;
				line-height: 100rpx;
				text-align: center;
				&.finish {
					background-color: #bfe9ef;
				}
			}
		}
		.title {
			width: 0;
			flex-grow: 1;
			box-sizing: border-box;
			padding-left: 30rpx;
			padding-right: 24rpx;
			&-name {
				font-weight: bold;
				font-size: 30rpx;
				color: #333;
			}
			&-desc {
				margin-top: 8rpx;
				font-size: 26rpx;
				color: rgba(96, 77, 68, 1);
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
			}
		}
		.actions {
			width: 50rpx;
			.icon {
				display: inline-block;
				width: 45rpx;
				height: 45rpx;
				background-color: rgba(96, 77, 68, 0.2);
				border-radius: 50%;
				text-align: center;
				line-height: 45rpx;
				font-size: 32rpx;
				font-weight: bold;
			}
		}
	}

	.body {
		margin-top: 24rpx;
		width: 100%;
		background-color: #ffffff;
		// background-color: #faf8eb;
		background-color: rgba(96, 77, 68, 0.05);
		border-radius: 24rpx;
		box-sizing: border-box;
		padding: 24rpx;
		padding-bottom: 12rpx;
		font-size: 26rpx;
	}
}
@keyframes cardAni {
	0% {
		transform: translateY(0rpx);
	}

	50% {
		transform: translateY(-10rpx);
	}

	100% {
		transform: translateY(0rpx);
	}
}
.desc {
	display: flex;
	margin-bottom: 12rpx;
	&-label {
		color: #333;
		width: 140rpx;
		// font-weight: bold;
	}
	&-value {
		width: 0;
		flex-grow: 1;
		line-height: 1.5;
	}
}
</style>
