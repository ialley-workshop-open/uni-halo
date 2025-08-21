<template>
	<view class="vote-card" @click="$emit('on-click',vote)">
		<view class="vote-card-head flex">
			<view class="left flex flex-center">
				<view class="flex-shrink">
					<tm-tags v-if="vote.spec.type==='single'" color="light-blue" :shadow="0" rounded size="s"
						model="fill">单选</tm-tags>
					<tm-tags v-else-if="vote.spec.type==='multiple'" color="light-blue" :shadow="0" rounded size="s"
						model="fill">多选</tm-tags>
					<tm-tags v-else-if="vote.spec.type==='pk'" color="light-blue" :shadow="0" rounded size="s"
						model="fill">双选PK</tm-tags>
				</view>
				<view class="title text-overflow">
					{{ vote.spec.title }}
				</view>
			</view>
			<view class="flex-shrink right flex flex-end">
				<tm-tags v-if="vote.spec.hasEnded" color="red" rounded :shadow="0" size="s" model="text">已结束</tm-tags>
				<tm-tags v-else color="green" rounded size="s" :shadow="0" model="text">进行中</tm-tags>
			</view>
		</view>
		<view class="vote-card-body">

			<view v-if="vote.spec.remark" class="remark text-overflow-2 text-size-s">
				{{vote.spec.remark}}
			</view>

			<template v-if="showOptions">
				<!-- 单选 -->
				<view v-if="vote.spec.type==='single'" class="single">
					<tm-groupradio @change="onOptionRadioChange">
						<tm-radio v-for="(option,optionIndex) in vote.spec.options" :key="optionIndex" dense
							:disabled="vote.spec.disabled" v-model="option.checked" :extendData="option">
							<template v-slot:default="{checkData}">
								<tm-button :shadow="0" :theme="checkData.checked?'light-blue':'grey-lighten-3'"
									:plan="false" :block="true" class="w-full" size="m" :height="72">
									<view class="flex flex-between w-full">
										<text class="text-align-left text-overflow"> {{ checkData.extendData.title }}
										</text>
										<text class="flex-shrink"> {{checkData.extendData.percent }}% </text>
									</view>
								</tm-button>
							</template>
						</tm-radio>
					</tm-groupradio>
				</view>

				<!-- 多选 -->
				<view v-else-if="vote.spec.type==='multiple'" class="multiple">
					<tm-groupcheckbox @change="onOptionCheckboxChange">
						<tm-checkbox v-for="(option,optionIndex) in vote.spec.options" :key="optionIndex" dense
							:disabled="vote.spec.disabled" v-model="option.checked" :extendData="option">
							<template v-slot:default="{checkData}">
								<tm-button :shadow="0" :theme="checkData.checked?'light-blue':'grey-lighten-3'"
									:plan="false" :block="true" class="w-full" size="m" :height="72">
									<view class="flex flex-between w-full">
										<text class="text-align-left text-overflow"> {{ checkData.extendData.title }}
										</text>
										<text class="flex-shrink"> {{checkData.extendData.percent }}% </text>
									</view>
								</tm-button>
							</template>
						</tm-checkbox>
					</tm-groupcheckbox>
				</view>

				<!-- PK -->
				<view v-else-if="vote.spec.type==='pk'" class="pk">
					<tm-groupradio @change="onOptionPkChange">
						<tm-radio v-for="(option,optionIndex) in vote.spec.options" :key="optionIndex" dense
							:disabled="vote.spec.disabled" v-model="option.checked" :extendData="option"
							class="radio-item" :class="[optionIndex==0?'radio-left':'radio-right']"
							:style="{width:option.percent + '%'}">
							<template v-slot:default="{checkData}">
								<view class="option-item"
									:class="[optionIndex==0?'option-item-left':'option-item-right']">
									{{checkData.extendData.percent }}%
								</view>
							</template>
						</tm-radio>
					</tm-groupradio>
					<view class="option-foot w-full flex flex-between">
						<view v-for="(option,optionIndex) in vote.spec.options" :key="optionIndex">
							<view v-if="optionIndex==0" class="left flex-1 flex-shrink text-overflow">
								{{option.title}}
							</view>
							<view v-else class="right flex-1 flex-shrink text-overflow text-align-right">
								{{option.title}}
							</view>
						</view>
					</view>
				</view>
			</template>
		</view>
		<view class="vote-card-foot flex flex-between">
			<view class="left flex">
				<tm-tags color="grey-darken-2" rounded size="s"
					model="text">{{ {d: vote.spec.endDate, f: 'yyyy-MM-dd HH:mm'} | formatTime }} 结束</tm-tags>
			</view>

			<view class="right flex flex-end">
				<tm-tags color="grey-darken-2" rounded size="s" model="text">{{ vote.stats.voteCount }} 人已参与</tm-tags>
				<tm-tags v-if="vote.spec.isVoted" color="blue" rounded size="s" model="text">已投票</tm-tags>
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
		},

		methods: {
			onOptionRadioChange(e) {
				console.log("onOptionRadioChange", e)
			},
			onOptionCheckboxChange(e) {
				console.log("onOptionCheckboxChange", e)
			},
			onOptionPkChange(e) {
				console.log("onOptionPkChange", e)
			},
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
			padding: 12rpx 6rpx;
			padding-top: 0;
			color: rgba(0, 0, 0, 0.75);
		}
	}

	.vote-card-foot {
		box-sizing: border-box;
		padding-top: 6px;
		margin-top: 6px;
		border-top: 2rpx solid #F7F7F7;
		
		.left{
			
		}
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