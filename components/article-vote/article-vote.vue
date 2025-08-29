<template>
	<view class="vote-card" :class="[loading]">
		<view v-if="loading !=='success'" class="vote-error" @click="fnGetData()">
			{{loadingText}}
		</view>
		<template v-else>
			<view class="vote-card-head flex flex-col">
				<view class="flex justify-between">
					<view class="flex">
						<tm-tags color="orange" style="min-width:40rpx;" :shadow="0" rounded size="s"
							model="fill">{{ index + 1 }}</tm-tags>
						<tm-tags color="light-blue" :shadow="0" rounded size="s"
							model="fill">{{ vote.spec._uh_type }}</tm-tags>
						<tm-tags :color="vote.spec._uh_state.color" size="s" rounded :shadow="0"
							model="fill">{{vote.spec._uh_state.state}}</tm-tags>
					</view>
					<view class="flex-shrink">
						<tm-button theme="light-blue" :shadow="0" dense size="s"
							@click="handleToVoteDetail(vote)">查看投票详情</tm-button>
					</view>
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
							<template v-if="vote.spec.isVoted || vote.spec.hasEnded">
								<view v-for="(option,optionIndex) in vote.spec.options" :key="optionIndex"
									class="is-voted-item" :class="[option.checked?'selected':'']" :style="{
										'--percent': option._uh_percent + '%'
									}">
									<view class="is-voted-item-content flex w-full flex-between uh-gap-4">
										<view class="text-align-left flex-1 text-break">
											{{option.title }}
										</view>
										<view class="flex-shrink ">
											{{option._uh_percent }}%
										</view>
									</view>
								</view>
							</template>
							<template v-else>
								<view v-for="(option,optionIndex) in vote.spec.options" :key="optionIndex"
									class="vote-select-option flex-1 w-full text-break"
									:class="[option.checked?'light-blue':'grey-lighten-3']"
									@click="handleSelectSingleOption(option)">
									{{option.title }}
								</view>
							</template>
						</view>
					</view>

					<!-- 多选 -->
					<view v-else-if="vote.spec.type==='multiple'" class="multiple">
						<view class="w-full flex flex-col uh-gap-8">
							<template v-if="vote.spec.isVoted || vote.spec.hasEnded">
								<view v-for="(option,optionIndex) in vote.spec.options" :key="optionIndex"
									class="is-voted-item" :class="[option.checked?'selected':'']" :style="{
										'--percent': option._uh_percent + '%'
									}">
									<view class="is-voted-item-content flex w-full flex-between uh-gap-4">
										<view class="text-align-left flex-1 text-break">
											{{option.title }}
										</view>
										<view class="flex-shrink ">
											{{option._uh_percent }}%
										</view>
									</view>
								</view>
							</template>
							<template v-else>
								<view v-for="(option,optionIndex) in vote.spec.options" :key="optionIndex"
									class="vote-select-option flex-1 w-full text-break"
									:class="[option.checked?'light-blue':'grey-lighten-3']"
									@click="handleSelectCheckboxOption(option)">
									{{option.title }}
								</view>
							</template>
						</view>
					</view>

					<!-- PK -->
					<view v-else-if="vote.spec.type==='pk'" class="pk">
						<view class="pk-container">
							<view class="radio-item" v-for="(option,optionIndex) in vote.spec.options"
								:key="optionIndex" :class="[optionIndex==0?'radio-left':'radio-right']"
								:style="{width:option._uh_percent + '%'}">
								<view class="option-item"
									:class="[optionIndex==0?'option-item-left':'option-item-right']">
									{{option._uh_percent }}%
								</view>
							</view>
						</view>
						<view class="option-foot w-full flex flex-between uh-mt-12">
							<view class="w-full flex flex-col uh-gap-8">
								<template v-if="vote.spec.isVoted || vote.spec.hasEnded">
									<view v-for="(option,optionIndex) in vote.spec.options" :key="optionIndex"
										class="is-voted-item" :class="[option.checked?'selected':'']" :style="{
											'--percent': option._uh_percent + '%'
										}">
										<view class="is-voted-item-content flex w-full flex-between uh-gap-4">
											<view class="text-align-left flex-1 text-break">
												{{option.title }}
											</view>
											<view class="flex-shrink ">
												{{option._uh_percent }}%
											</view>
										</view>
									</view>
								</template>
								<template v-else>
									<view v-for="(option,optionIndex) in vote.spec.options" :key="optionIndex"
										class="vote-select-option flex-1 w-full text-break"
										:class="[option.checked?'light-blue':'grey-lighten-3']"
										@click="handleSelectSingleOption(option)">
										选项{{ optionIndex+1}}：{{option.title }}
									</view>
								</template>
							</view>
						</view>
					</view>
				</template>
			</view>
			<view class="vote-card-foot flex flex-between">
				<view class="left flex">
					<tm-tags v-if="vote.spec.timeLimit==='permanent'" color="grey-darken-2" rounded size="s"
						model="text">结束：永久有效 </tm-tags>
					<tm-tags v-else color="grey-darken-2" rounded size="s" model="text">
						<template
							v-if="vote.spec._state=='未开始'">开始：{{ {d: vote.spec.startDate, f: 'yyyy-MM-dd HH:mm'} | formatTime }}
						</template>
						<template v-else>结束：{{ {d: vote.spec.endDate, f: 'yyyy-MM-dd HH:mm'} | formatTime }}
						</template>
					</tm-tags>
				</view>

				<view class="right flex flex-end">
					<tm-tags color="grey-darken-2" rounded size="s" model="text">{{ vote.stats.voteCount }}
						人已参与</tm-tags>
					<tm-tags v-if="vote.spec.isVoted" color="blue" rounded size="s" model="text">已投票</tm-tags>
				</view>
			</view>

			<view v-if="submitForm.voteData.length!==0" class="box-border uh-mt-12 w-full uh-px-2">
				<tm-button v-if="fnCalcIsVoted()" theme="white" text :block="true" class="w-full">您已参与投票</tm-button>
				<tm-button v-else-if="vote.spec._uh_state.state==='未开始'" theme="orange" text class="w-full" :height="72"
					:block="true" @click="handleSubmitTip('投票未开始')">投票未开始</tm-button>
				<tm-button v-else-if="vote.spec._uh_state.state==='已结束'" theme="red" text class="w-full" :height="72"
					:block="true" @click="handleSubmitTip('投票已结束')">投票已结束</tm-button>
				<tm-button v-else-if="!vote.spec.canAnonymously" theme="red" :shadow="0" class="w-full" :height="72"
					text :block="true" @click="handleSubmit()">不支持匿名投票</tm-button>
				<tm-button v-else-if="submitForm.voteData.length===0" theme="white" text class="w-full" :height="72"
					:block="true" @click="handleSubmitTip('请选择选项')">提交投票（请选择选项）</tm-button>
				<tm-button v-else theme="light-blue" class="w-full" :height="72" :block="true" :loading="submitLoading"
					:disabled="submitLoading" @click="handleSubmit()">提交投票</tm-button>
			</view>
		</template>
	</view>
</template>

<script>
	import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
	import tmTags from '@/tm-vuetify/components/tm-tags/tm-tags.vue';
	import {
		VOTE_TYPES,
		calcVoteState,
		calcVotePercent,
		voteCacheUtil
	} from '@/utils/vote.js'

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
			},
			article: {
				type: Object,
				default: () => ({})
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
				submitLoading: false
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
						this.pageTitle = "投票详情" + `（${VOTE_TYPES[res.vote.spec.type]}）`

						const tempVoteRes = res;

						tempVoteRes.vote.spec.isVoted = this.fnCalcIsVoted()
						tempVoteRes.vote.spec.disabled = this.fnCalcIsVoted()
						tempVoteRes.vote.spec._uh_state = calcVoteState(tempVoteRes.vote)
						tempVoteRes.vote.spec._uh_type = VOTE_TYPES[tempVoteRes.vote.spec.type]

						tempVoteRes.vote.spec.options.map((option, index) => {
							option.value = option.id
							option.label = option.title
							option.isVoted = this.fnCalcIsVoted()
							option.checked = this.fnCalcIsChecked(option)
							option._uh_percent = calcVotePercent(tempVoteRes.vote, option);
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
			handleSubmitTip(text) {
				uni.showToast({
					icon: "none",
					title: text
				})
			},
			handleSubmit() {
				if (!this.vote.spec.canAnonymously) {
					uni.showModal({
						icon: "none",
						title: "提示",
						content: "该投票不支持匿名，请到博主的 网站端 进行投票！",
						cancelColor: "#666666",
						cancelText: "关闭",
						confirmText: "复制地址",
						success: (res) => {
							if (res.confirm) {
								console.log("this.article", this.article)
								const articleUrl = this.$baseApiUrl + (this.article?.status?.permalink ?? "")
								this.$utils.copyText(articleUrl, "原文地址复制成功")
							}
						}
					})
					return
				}

				uni.showLoading({
					title: "正在保存..."
				})
				this.submitLoading = true
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
					}).finally(() => {
						this.submitLoading = false
					})
			},

			handleSelectSingleOption(option) {
				if (this.vote.spec._uh_state.state == '未开始') {
					this.showToast(`投票未开始`)
					return
				}
				if (this.vote.spec.hasEnded) return
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
				if (this.vote.spec._uh_state.state == '未开始') {
					this.showToast(`投票未开始`)
					return
				}

				if (this.vote.spec.hasEnded) return
				if (this.vote.spec.disabled) return

				const checkedList = this.vote.spec.options.filter(x => x.checked && x.id != option.id)

				if (this.vote.spec.type === 'multiple' && checkedList.length >= this.vote.spec.maxVotes) {
					this.showToast(`最多选择 ${this.vote.spec.maxVotes} 项`)
					return
				}

				this.vote.spec.options.map(item => {
					if (option.id == item.id) {
						item.checked = !item.checked
					}
				})
				this.submitForm.voteData = this.vote.spec.options.filter(x => x.checked).map(item => item.id)
			},
			handleToVoteDetail(vote) {
				uni.navigateTo({
					url: `/pagesA/vote-detail/vote-detail?name=${vote.metadata.name}`
				});
			},
			showToast(content) {
				uni.showToast({
					icon: "none",
					title: content,
					mask: true
				})
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

	.is-voted-item {
		min-height: 72rpx;
		box-sizing: border-box;
		position: relative;
		border-radius: 12rpx;
		background-color: rgba(229, 229, 229, 0.75);
		font-size: 24rpx;
		overflow: hidden;

		&::before {
			content: "";
			width: var(--percent);
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			background-color: rgba(208, 208, 208, 1);
			z-index: 0;
			border-radius: 6rpx;
		}

		&.selected {
			background-color: rgba(3, 169, 244, 0.35);
			color: #ffffff;

			&::before {
				background-color: rgba(3, 169, 244, 1);
			}
		}
	}

	.is-voted-item-content {
		box-sizing: border-box;
		min-height: 72rpx;
		padding: 12rpx 24rpx;
		position: relative;
		z-index: 2;
	}

	.vote-select-option {
		box-sizing: border-box;
		padding: 20rpx 24rpx;
		font-size: 24rpx;
		border-radius: 12rpx;
		transition: all 0.1s ease-in-out;
	}

	.single {
		::v-deep {}
	}

	.multiple {
		::v-deep {}
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