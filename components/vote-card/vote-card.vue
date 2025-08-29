<template>
	<view class="vote-card" @click="$emit('on-click',vote)">
		<view class="vote-card-head flex">
			<view class="left flex flex-center w-full">
				<view class="flex-shrink">
					<tm-tags color="light-blue" :shadow="0" rounded size="s" model="fill">{{ vote.spec._uh_type}}</tm-tags>
				</view>
				<view class="title text-overflow">
					{{ vote.spec.title }}
				</view>
			</view>
		</view>
		<view class="vote-card-body w-full">
			<view v-if="vote.spec.remark" class="remark text-overflow-2 text-size-s">
				{{vote.spec.remark}}
			</view>
		</view>
		<view class="vote-card-foot flex flex-between">
			<view class="left flex">
				<tm-tags :color="vote.spec._uh_state.color" size="s" rounded :shadow="0"
					model="text">{{vote.spec._uh_state.state}}</tm-tags>

				<tm-tags v-if="vote.spec.isVoted" color="blue" rounded size="s" model="text">已投票</tm-tags>

				<tm-tags v-if="vote.spec.timeLimit==='permanent'" color="grey-darken-2" rounded size="s"
					model="text">结束时间：永久有效 </tm-tags>
				<tm-tags v-else color="grey-darken-2" rounded size="s" model="text">
					<template
						v-if="vote.spec._uh_state.state=='未开始'">开始时间：{{ {d: vote.spec.startDate, f: 'yyyy-MM-dd HH:mm'} | formatTime }}
					</template>
					<template v-else>结束时间：{{ {d: vote.spec.endDate, f: 'yyyy-MM-dd HH:mm'} | formatTime }}
					</template>
				</tm-tags>
			</view>

			<view v-if="false" class="right flex flex-end">
				<tm-tags v-if="false" color="grey-darken-2" rounded size="s" model="text">{{ vote.stats.voteCount }}
					人已参与</tm-tags>
			</view>
		</view>
	</view>
</template>

<script>
	import tmGroupradio from '@/tm-vuetify/components/tm-groupradio/tm-groupradio.vue';
	import tmRadio from '@/tm-vuetify/components/tm-radio/tm-radio.vue';
	import tmGroupcheckbox from '@/tm-vuetify/components/tm-groupcheckbox/tm-groupcheckbox.vue';
	import tmCheckbox from '@/tm-vuetify/components/tm-checkbox/tm-checkbox.vue';
	import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
	import tmTags from '@/tm-vuetify/components/tm-tags/tm-tags.vue';

	export default {
		name: "VoteCard",
		options: {
			virtualHost: true,
			styleIsolation: 'shared'
		},
		components: {
			tmGroupradio,
			tmRadio,
			tmGroupcheckbox,
			tmCheckbox,
			tmButton,
			tmTags
		},
		props: {
			vote: {
				type: Object,
				default: () => ({})
			},
			index: {
				type: Number,
				default: 0
			},
			showOptions: {
				type: Boolean,
				default: false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.w-full {
		width: 100%;
	}

	.wp-50 {
		width: 50%;
	}

	.vote-card {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		margin: 0 24rpx;
		padding: 24rpx;
		border-radius: 12rpx;
		background-color: #ffff;
		box-shadow: 0rpx 2rpx 12rpx rgba(0, 0, 0, 0.035);
		overflow: hidden;
		margin-bottom: 24rpx;
		// border: 1px solid #eee;
	}

	.vote-card-head {
		margin-bottom: 12rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.left {
			.title {
				font-size: 28rpx;
				font-weight: bold;
			}
		}
	}

	.vote-card-body {

		.remark {
			box-sizing: border-box;
			padding-top: 0;
			color: rgba(0, 0, 0, 0.75);
			margin-bottom: 12rpx;
		}
	}

	.vote-card-foot {
		box-sizing: border-box;
		padding-top: 6px;
		margin-top: 6px;
		border-top: 2rpx solid #F7F7F7;

		.left {}
	}


	.single {
		::v-deep {
			.tm-groupradio {
				width: 100%;
				box-sizing: border-box;
				display: flex;
				flex-wrap: wrap;
				gap: 12rpx 0;
			}

			.tm-checkbox {
				box-sizing: border-box;
				display: block;
				padding: 0 12rpx;
				width: 50%;
			}

			.tm-button-label {
				width: 100%;
			}
		}
	}

	.multiple {
		::v-deep {
			.tm-groupcheckbox {
				width: 100%;
				box-sizing: border-box;
				display: flex;
				flex-wrap: wrap;
				gap: 12rpx 0;
			}

			.tm-checkbox {
				box-sizing: border-box;
				display: block;
				padding: 0 12rpx;
				width: 50%;
			}

			.tm-button-label {
				width: 100%;
			}
		}
	}

	.pk {
		box-sizing: border-box;
		width: 100%;
		padding: 0 12rpx;

		::v-deep {
			.tm-groupradio {
				display: flex;
				width: 100%;
			}

			.tm-checkbox {
				flex-grow: 1;
				min-width: 30% !important;
				max-width: 70% !important;
			}

			.radio-item {
				position: relative;

				.selected {
					z-index: 10;
				}
			}

			.radio-left {}

			.radio-right {}

			.option-item {
				width: 100%;
				padding: 12rpx 24rpx;
				border-radius: 12rpx;
			}

			.option-item-left {
				background: linear-gradient(90deg, #3B82F6, #60A5FA);
				color: white;
				clip-path: polygon(0 0, calc(100% - 40rpx) 0, 100% 100%, 0 100%);
			}

			.option-item-right {
				background: linear-gradient(90deg, #F87171, #EF4444);
				color: white;
				clip-path: polygon(0 0, 100% 0, 100% 100%, 40rpx 100%);
				text-align: right;
			}

			.option-foot {
				width: 100%;
				margin-top: 6rpx;
				font-size: 24rpx;
				color: #666;

				.left {
					box-sizing: border-box;
					padding-right: 24rpx;
				}

				.right {
					box-sizing: border-box;
					padding-left: 24rpx;
				}
			}
		}
	}
</style>