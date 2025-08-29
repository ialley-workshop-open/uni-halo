<template>
	<view class="app-page">
		<view v-if="loading != 'success'" class="loading-wrap">
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
		</view>
		<block v-else>
			<view v-if="!detail" class="empty">
				<tm-empty icon="icon-shiliangzhinengduixiang-" label="未查询到数据"></tm-empty>
			</view>
			<block v-else>
				<view class="vote-card vote-info-card">
					<view class="sub-title"> 投票信息 </view>
					<view class="vote-card-body flex flex-col uh-mt-8">
						<view class="">
							投票类型：<tm-tags color="light-blue" :shadow="0" size="xs" model="fill">
								{{ vote.spec._uh_type }} </tm-tags>
						</view>
						<view class="">
							投票状态：<tm-tags :color="vote.spec._uh_state.color" size="xs" :shadow="0"
								model="fill">{{vote.spec._uh_state.state}}</tm-tags>
						</view>
						<view class="">
							投票方式：<tm-tags v-if="vote.spec.canAnonymously" color="light-blue" size="xs" :shadow="0"
								model="fill">匿名</tm-tags>
							<tm-tags v-else color="red" size="xs" :shadow="0" model="fill">不匿名</tm-tags>
						</view>
						<view class="">
							开始时间：{{ {d: vote.spec.startDate, f: 'yyyy-MM-dd HH:mm'} | formatTime }}
						</view>
						<view class="">
							<text v-if="vote.spec.timeLimit==='permanent'">
								结束时间：永久有效
							</text>
							<text v-else>
								结束时间：{{ {d: vote.spec.endDate, f: 'yyyy-MM-dd HH:mm'} | formatTime }}
							</text>
						</view>
					</view>
				</view>

				<view class="vote-card">
					<view class="vote-card-head flex flex-col items-start mb-12">
						<view class="sub-title"> 投票内容 </view>
						<view class="sub-content">
							{{ vote.spec.title }}
						</view>
						<view v-if="vote.spec.remark" class="sub-remark">
							{{ vote.spec.remark  }}
						</view>
					</view>
					<view class="vote-card-body uh-mt-8">
						<view class="sub-title"> 投票选项 <text v-if="vote.spec.type==='multiple'"
								class="sub-title-count">（最多选择 {{ vote.spec.maxVotes }} 项）</text> </view>
						<view v-if="vote.spec.type==='single'" class="single">
							<view class="w-full flex flex-col uh-gap-8">
								<template v-if="vote.spec.isVoted || vote.spec.hasEnded">
									<view v-for="(option,optionIndex) in vote.spec.options" :key="optionIndex"
										class="is-voted-item" :class="[option.checked?'selected':'']" :style="{
											'--percent':option._uh_percent + '%'
										}">
										<view class="is-voted-item-content flex w-full flex-between uh-gap-8">
											<view class="flex-1 text-align-left text-break">
												{{option.title }}
											</view>
											<view class="flex-shrink">
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

						<view v-else-if="vote.spec.type==='multiple'" class="multiple">
							<view class="w-full flex flex-col uh-gap-8">
								<template v-if="vote.spec.isVoted || vote.spec.hasEnded">
									<view v-for="(option,optionIndex) in vote.spec.options" :key="optionIndex"
										class="is-voted-item" :class="[option.checked?'selected':'']" :style="{
											'--percent':option._uh_percent + '%'
										}">
										<view class="is-voted-item-content flex w-full flex-between uh-gap-8">
											<view class="flex-1 text-align-left text-break">
												{{option.title }}
											</view>
											<view class="flex-shrink">
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

						<view v-else-if="vote.spec.type==='pk'" class="pk">
							<view class="pk-container">
								<view class="radio-item" v-for="(option,optionIndex) in vote.spec.options"
									:key="optionIndex" :class="[optionIndex==0?'radio-left':'radio-right']"
									:style="{width: option._uh_percent + '%'}">
									<view class="option-item"
										:class="[optionIndex==0?'option-item-left':'option-item-right']">
										{{option._uh_percent }}%
									</view>
								</view>
							</view>
							<view class="option-foot w-full flex flex-col uh-gap-8">
								<template v-if="vote.spec.isVoted || vote.spec.hasEnded">
									<view v-for="(option,optionIndex) in vote.spec.options" :key="optionIndex"
										class="is-voted-item" :class="[option.checked?'selected':'']" :style="{
											'--percent': option._uh_percent + '%'
										}">
										<view class="is-voted-item-content flex w-full flex-between uh-gap-8">
											<view class="flex-1 text-align-left text-break">
												选项{{ optionIndex+1}}：{{option.title }}
											</view>
											<view class="flex-shrink">
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
				</view>

				<view class="vote-card">
					<view class="vote-card-body">
						<view class="sub-title"> 投票统计 </view>
						<view class="">
							<tm-tags color="grey-darken-4" size="s" model="text">{{ vote.stats.voteCount }}
								人已参与</tm-tags>
							<!-- <tm-tags v-if="vote.spec.isVoted" color="blue" rounded size="s" model="text">已投票</tm-tags> -->
						</view>
					</view>
				</view>

				<!-- 暂时不做,目前没有意义 -->
				<!-- <view v-if="vote.spec.canSeeVoters" class="vote-card">
					<view class="vote-card-body">
						<view class="sub-title"> 投票用户 </view>
						<view class="">
							
						</view>
					</view>
				</view> -->

				<view class="vote-submit flex w-full flex-center" :style="{
					paddingBottom:safeAreaBottom + 'rpx'
				}">
					<tm-button v-if="fnCalcIsVoted()" theme="white" text :block="true" class="w-full">您已参与投票</tm-button>
					<tm-button v-else-if="vote.spec._uh_state.state==='未开始'" theme="orange" text class="w-full"
						:block="true" @click="handleSubmitTip('投票未开始')">投票未开始</tm-button>
					<tm-button v-else-if="vote.spec._uh_state.state==='已结束'" theme="red" text class="w-full"
						:block="true" @click="handleSubmitTip('投票已结束')">投票已结束</tm-button>
					<tm-button v-else-if="!vote.spec.canAnonymously" theme="red" :shadow="0" class="w-full" text
						:block="true" @click="handleSubmit()">不支持匿名投票</tm-button>
					<tm-button v-else-if="submitForm.voteData.length===0" theme="white" text class="w-full"
						:block="true" @click="handleSubmitTip('请选择选项')">提交投票（请选择选项）</tm-button>
					<tm-button v-else theme="light-blue" class="w-full" :block="true" :loading="submitLoading"
						:disabled="submitLoading" @click="handleSubmit()">提交投票</tm-button>
				</view>
			</block>
		</block>
	</view>
</template>

<script>
	import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
	import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
	import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
	import tmTags from '@/tm-vuetify/components/tm-tags/tm-tags.vue';

	import {
		VOTE_TYPES,
		calcVoteState,
		calcVotePercent,
		voteCacheUtil
	} from '@/utils/vote.js'

	export default {
		components: {
			tmSkeleton,
			tmEmpty,
			tmButton,
			tmTags,
		},
		data() {
			return {
				safeAreaBottom: 24,
				loading: 'loading',
				submitLoading: false,
				pageTitle: '加载中...',

				name: '',
				detail: null,
				vote: null,
				submitForm: {
					voteData: []
				}
			};
		},

		onLoad(e) {
			this.name = e.name;
			this.fnGetData();
			// this.fnGetVoteUserList();
			// #ifndef H5
			const systemInfo = uni.getSystemInfoSync();
			this.safeAreaBottom = systemInfo.safeAreaInsets.bottom + 12;
			// #endif
		},
		onPullDownRefresh() {
			this.fnGetData();
			// this.fnGetVoteUserList();
		},
		onShareAppMessage() {
			return {
				path: '/pagesA/vote-detail/vote-detail?name=' + this.name,
				title: this.vote?.spec?.title ?? "来投个票吧",
				imageUrl: ""
			}
		},
		onShareTimeline() {
			return {
				title: this.vote?.spec?.title ?? "来投个票吧",
				query: {
					name: this.name
				},
				imageUrl: ""
			}
		},
		methods: {
			fnGetData() {
				// 设置状态为加载中 
				this.loading = 'loading';
				this.pageTitle = "加载中..."
				this.$httpApi.v2
					.getVoteDetail(this.name)
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
						this.pageTitle = "加载失败，请重试..."
					})
					.finally(() => {
						setTimeout(() => {
							uni.hideLoading();
							uni.stopPullDownRefresh();
							this.fnSetPageTitle(this.pageTitle);
						}, 200);
					});
			},
			fnGetVoteUserList() {
				this.$httpApi.v2
					.getVoteUserList(this.name)
					.then(res => {
						console.log("查询投票用户列表")
					})
					.catch(err => {
						console.log("err")
					})
			},
			fnCalcIsVoted() {
				return voteCacheUtil.has(this.name)
			},

			fnCalcIsChecked(option) {
				const data = voteCacheUtil.get(this.name)
				if (!data) return false;
				const checked = data.selected.includes(option.id)
				return checked
			},
			onOptionRadioChange(e) {
				this.submitForm.voteData = e.map(item => this.vote.spec.options[item.index]?.id);
			},
			onOptionCheckboxChange(e) {
				this.submitForm.voteData = e.map(item => this.vote.spec.options[item.index]?.id);
			},
			onOptionPkChange(e) {
				this.submitForm.voteData = e.map(item => this.vote.spec.options[item.index]?.id);
			},
			formatJsonStr(jsonStr) {
				return jsonStr ? JSON.parse(jsonStr) : {}
			},
			handleSubmitTip(text) {
				this.showToast(text)
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
								this.$utils.copyText(this.$baseApiUrl, "复制成功")
							}
						}
					})
					return
				}

				this.submitLoading = true
				uni.showLoading({
					title: "正在保存..."
				})

				this.$httpApi.v2
					.submitVote(this.name, this.submitForm, this.vote.spec.canAnonymously)
					.then(res => {

						this.showToast("提交成功")
						voteCacheUtil.set(this.name, {
							selected: [...this.submitForm.voteData],
							data: this.vote
						})

						setTimeout(() => {
							uni.startPullDownRefresh()
							this.submitLoading = false
						}, 1500);
					})
					.catch(err => {
						console.error(err);
						this.showToast("提交失败，请重试")
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
			showToast(content) {
				uni.showToast({
					icon: "none",
					title: content,
					mask: true
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	.app-page {
		box-sizing: border-box;
		width: 100vw;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		padding: 24rpx 0;
		padding-bottom: 160rpx;
		background-color: #fafafd;
	}

	.loading-wrap {
		padding: 0 24rpx;
		min-height: 100vh;
	}

	.empty {
		height: 60vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

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
		box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.03);
		overflow: hidden;
		margin-bottom: 24rpx;
	}

	.vote-info-card {
		.vote-card-body {
			font-size: 28rpx;
			gap: 12rpx 0;
			background: #F3F4F6;
			color: #3F3F3F;
			padding: 24rpx;
			border-radius: 12rpx;
		}
	}

	.vote-card-head {
		margin-bottom: 12rpx;
		display: flex;
		align-items: flex-satrt;
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
		margin-top: 12px;
		padding-top: 6px;
		border-top: 2rpx solid #eee;
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


	::v-deep {
		.tm-button-label {
			width: 100%;
		}
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
				margin-top: 24rpx;
				width: 100%;
				font-size: 24rpx;
				color: #666;

				.tm-groupradio {
					display: flex;
					gap: 12rpx;
				}

				.tm-checkbox {
					// width: 100%;
					max-width: initial !important;
				}

				.tm-button {
					width: 100%;
				}

				.left {
					box-sizing: border-box;
				}

				.right {
					box-sizing: border-box;

					.flex-start.fulled {
						justify-content: flex-end;
					}
				}
			}
		}
	}

	.sub-content {
		margin-bottom: 12rpx;
		padding: 12rpx 0;
		font-weight: bold;
		color: #2B2F33;
		font-size: 30rpx;
	}

	.sub-remark {
		margin-bottom: 36rpx;
		padding-top: 12rpx;
		color: #3F3F3F;
		font-size: 28rpx;
	}

	.sub-title {
		box-sizing: border-box;
		position: relative;
		margin-bottom: 12rpx;
		padding-left: 24rpx;
		// font-weight: bold;
		font-size: 30rpx;

		&:before {
			content: "";
			width: 8rpx;
			height: 28rpx;
			position: absolute;
			left: 0;
			top: 6rpx;
			background: #03A9F4;
			border-radius: 6rpx;
		}

		.sub-title-count {
			font-size: 24rpx;
			font-weight: normal;
		}
	}

	.vote-submit {
		box-sizing: border-box;
		padding: 24rpx 36rpx;
		position: fixed;
		left: 0;
		width: 100vw;
		bottom: 0;
		background-color: rgba(255, 255, 255, 0.98);
		box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.03);
		border-top: 2rpx solid #eee;
		z-index: 99;

		::v-deep {
			.tm-button {
				text-align: center;
			}

			.tm-button-btn {
				margin: 0;
				width: 100%;
			}
		}
	}
</style>