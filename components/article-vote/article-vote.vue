<template>
	<view class="vote-card" :class="[loading]">
		<view v-if="loading !=='success'" class="vote-error" @click="fnGetData()">
			{{loadingText}}
		</view>
		<template v-else>
			<view class="vote-card-head flex flex-col">
				<view class="flex">
					<tm-tags color="orange" style="min-width:40rpx;" :shadow="0" rounded size="s"
						model="fill">{{ index+1 }}</tm-tags>

					<tm-tags v-if="vote.spec.type==='single'" color="light-blue" :shadow="0" rounded size="s"
						model="fill">单选</tm-tags>
					<tm-tags v-else-if="vote.spec.type==='multiple'" color="light-blue" :shadow="0" rounded size="s"
						model="fill">多选</tm-tags>
					<tm-tags v-else-if="vote.spec.type==='pk'" color="light-blue" :shadow="0" rounded size="s"
						model="fill">双选PK</tm-tags>

					<tm-tags v-if="vote.spec.hasEnded" color="red" rounded :shadow="0" size="s"
						model="text">已结束</tm-tags>
					<tm-tags v-else color="green" rounded size="s" :shadow="0" model="text">进行中</tm-tags>
				</view>
				<view class="title">
					{{ vote.spec.title }}
				</view>

			</view>
			<view class="vote-card-body">

				<view v-if="vote.spec.remark" class="remark text-size-s">
					{{vote.spec.remark}}
				</view>

				<template>
					<!-- 单选 -->
					<view v-if="vote.spec.type==='single'" class="single">
						<view class="w-full flex flex-col uh-gap-8">
							<tm-button v-for="(option,optionIndex) in vote.spec.options" :key="optionIndex" :shadow="0"
								:theme="option.checked?'light-blue':'grey-lighten-3'" :plan="false" size="m"
								:height="72" :block="true" class="flex-1 w-full"
								@click="handleSelectSingleOption(option)">
								<view class="flex flex-between w-full">
									<text class="text-align-left text-overflow">
										{{option.title }}
									</text>
									<text v-if="vote.spec.isVoted" class="flex-shrink ml-12">
										{{option.percent }}%
									</text>
								</view>
							</tm-button>
						</view>
					</view>

					<!-- 多选 -->
					<view v-else-if="vote.spec.type==='multiple'" class="multiple">
						<view class="w-full flex flex-col uh-gap-8">
							<tm-button v-for="(option,optionIndex) in vote.spec.options" :key="optionIndex" :shadow="0"
								:theme="option.checked?'light-blue':'grey-lighten-3'" :plan="false" size="m"
								:height="72" :block="true" class="flex-1 full"
								@click="handleSelectCheckboxOption(option)">
								<view class="flex flex-between w-full">
									<text class="text-align-left text-overflow">
										{{option.title }}
									</text>
									<text v-if="vote.spec.isVoted" class="flex-shrink ml-12">
										{{option.percent }}%
									</text>
								</view>
							</tm-button>
						</view>
					</view>

					<!-- PK -->
					<view v-else-if="vote.spec.type==='pk'" class="pk">
						<view class="pk-container">
							<view class="radio-item" v-for="(option,optionIndex) in vote.spec.options"
								:key="optionIndex" :class="[optionIndex==0?'radio-left':'radio-right']"
								:style="{width:option.percent + '%'}">
								<view class="option-item"
									:class="[optionIndex==0?'option-item-left':'option-item-right']">
									{{option.percent }}%
								</view>
							</view>
						</view>
						<view class="option-foot w-full flex flex-between uh-mt-12">
							<view class="w-full flex flex-col uh-gap-8">
								<tm-button v-for="(option,optionIndex) in vote.spec.options" :key="optionIndex"
									:shadow="0" :theme="option.checked?'light-blue':'grey-lighten-3'" :plan="false"
									size="m" :height="72" :block="true" class="flex-1"
									@click="handleSelectSingleOption(option)">
									<view class="flex flex-between w-full">
										<text class="text-align-left text-overflow">
											选项{{ optionIndex+1}}：{{option.title }}
										</text>
									</view>
								</tm-button>
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
					<tm-tags color="grey-darken-2" rounded size="s" model="text">{{ vote.stats.voteCount }}
						人已参与</tm-tags>
					<tm-tags v-if="vote.spec.isVoted" color="blue" rounded size="s" model="text">已投票</tm-tags>
				</view>
			</view>

			<view v-if="submitForm.voteData.length!==0" class="box-border uh-mt-12 w-full uh-px-2">
				<tm-button v-if="!vote.spec.canAnonymously" theme="red" :shadow="0" class="w-full" text :block="true"
					:height="72" @click="handleSubmit()">不允许匿名投票</tm-button>
				<tm-button v-else-if="fnCalcIsVoted()" theme="white" text :block="true" :height="72"
					class="w-full">您已参与投票</tm-button>
				<tm-button v-else theme="light-blue" class="w-full" :block="true" :height="72"
					@click="handleSubmit()">提交投票</tm-button>
			</view>
		</template>
	</view>
</template>

<script>
	import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
	import tmTags from '@/tm-vuetify/components/tm-tags/tm-tags.vue';
	import {
		voteCacheUtil
	} from '@/utils/vote.js'

	const types = {
		"pk": "双选PK",
		"multiple": "多选",
		"single": "单选"
	}

	export default {
		name: "ArticleVote",
		components: {
			tmButton,
			tmTags
		},
		props: {
			voteId: {
				type: String,
				default: ""
			},
			index: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				loading: "loading",
				loadingText: "加载中，请稍等...",
				detail: null,
				vote: null,
				submitForm: {
					voteData: []
				},
			}
		},
		created() {
			this.fnGetData();
		},
		methods: {
			fnGetData() {
				this.loadingText = "加载中，请稍等...";
				this.loading = "loading";
				this.$httpApi.v2
					.getVoteDetail(this.voteId)
					.then(res => {
						this.pageTitle = "投票详情" + `（${types[res.vote.spec.type]}）`

						const tempVoteRes = res;

						tempVoteRes.vote.spec.isVoted = this.fnCalcIsVoted()
						tempVoteRes.vote.spec.disabled = this.fnCalcIsVoted()

						tempVoteRes.vote.spec.options.map((option, index) => {
							option.value = option.id
							option.label = option.title
							option.isVoted = this.fnCalcIsVoted()
							option.checked = this.fnCalcIsChecked(option)

							if (tempVoteRes.vote.spec.type === 'single') {
								option.percent = this.fnCalcPercent(option, tempVoteRes.vote.stats);
							} else if (tempVoteRes.vote.spec.type === 'multiple') {
								option.percent = this.fnCalcPercent(option, tempVoteRes.vote.stats);
							} else if (tempVoteRes.vote.spec.type === 'pk') {
								option.percent = this.fnCalcPercent(option, tempVoteRes.vote.stats);
							}

							option.dataStr = JSON.stringify(option)

							return option
						})

						this.vote = tempVoteRes.vote
						this.detail = tempVoteRes;

						setTimeout(() => {
							this.loading = 'success';
						}, 200);
					})
					.catch(err => {
						console.error(err);
						this.loading = 'error';
						this.loadingText = "投票内容加载失败，点击重试"
					})
			},
			fnCalcPercent(voteOption, stats) {
				if (!this.fnCalcIsVoted()) return 0;
				if (!stats?.voteDataList) return 0;
				const option = stats.voteDataList.find(x => x.id == voteOption.id)
				if (!option) return 0;
				const percent = (option.voteCount / stats.voteCount) * 100
				return Math.round(percent)
			},

			fnCalcIsVoted() {
				return voteCacheUtil.has(this.voteId)
			},

			fnCalcIsChecked(option) {
				const data = voteCacheUtil.get(this.voteId)
				if (!data) return false;
				const checked = data.selected.includes(option.id)
				return checked
			},

			formatJsonStr(jsonStr) {
				return jsonStr ? JSON.parse(jsonStr) : {}
			},
			handleSubmit() {
				if (!this.vote.spec.canAnonymously) {
					uni.showModal({
						icon: "none",
						title: "提示",
						content: "该投票不允许匿名，请到博主的 网站端 进行投票！",
						cancelColor: "#666666",
						cancelText: "关闭",
						confirmText: "复制地址",
						success: (res) => {
							if (res.confirm) {
								this.$utils.copyText(this.$baseApiUrl, "复制成功")
							}
						}
					})
					return
				}

				uni.showLoading({
					title: "正在保存..."
				})

				this.$httpApi.v2
					.submitVote(this.voteId, this.submitForm, this.vote.spec.canAnonymously)
					.then(res => {
						uni.showToast({
							icon: "none",
							title: "提交成功"
						})

						voteCacheUtil.set(this.voteId, {
							selected: [...this.submitForm.voteData],
							data: this.vote
						})

						this.fnGetData()
					})
					.catch(err => {
						console.error(err);
						uni.showToast({
							icon: "none",
							title: "提交失败，请重试"
						})
					})
			},

			handleSelectSingleOption(option) {
				if (this.vote.spec.disabled) return
				this.vote.spec.options.map(item => {
					if (option.id == item.id) {
						item.checked = true
					} else {
						item.checked = false
					}
				})
				this.submitForm.voteData = this.vote.spec.options.filter(x => x.checked).map(item => item.id)
			},

			handleSelectCheckboxOption(option) {
				if (this.vote.spec.disabled) return
				this.vote.spec.options.map(item => {
					if (option.id == item.id) {
						item.checked = !item.checked
					}
				})
				this.submitForm.voteData = this.vote.spec.options.filter(x => x.checked).map(item => item.id)
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
		padding: 24rpx;
		border-radius: 12rpx;
		background-color: #ffff;
		overflow: hidden;
		margin-bottom: 12rpx;
		border: 1px solid #eee;

		&.error {
			padding: 0;
			border-style: dashed;
			border-color: #e88080;
			color: #e88080;
			background-color: rgba(232, 128, 128, 0.075);
		}

		&.loading {
			padding: 0;
			border-style: dashed;
			border-color: rgba(3, 174, 252, 1);
			color: rgba(3, 174, 252, 1);
			background-color: rgba(3, 174, 252, 0.075);
		}
	}


	.vote-error {
		padding: 50rpx 24rpx;
		font-size: 24rpx;
		border-radius: 12rpx;
		text-align: center;
	}

	.vote-card-head {
		margin-bottom: 12rpx;

		.title {
			padding: 12rpx 0;
			font-size: 28rpx;
			font-weight: bold;
		}
	}

	.vote-card-body {

		.remark {
			box-sizing: border-box;
			color: rgba(0, 0, 0, 0.75);
			margin-bottom: 24rpx;
		}
	}

	.vote-card-foot {
		box-sizing: border-box;
		padding-top: 6px;
		margin-top: 12px;
		border-top: 2rpx solid #eee;

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
			.pk-container {
				box-sizing: border-box;
				width: 100%;
				display: flex;
			}

			.radio-item {
				flex-grow: 1;
				min-width: 30% !important;
				max-width: 70% !important;
			}

			.radio-left {}

			.radio-right {}

			.option-item {
				box-sizing: border-box;
				width: 100%;
				padding: 24rpx;
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