<template>
	<view class="app-page flex flex-col">
		<view v-if="tab.list.length > 3" class="e-fixed shadow-2">
			<tm-tabs color="light-blue" :shadow="0" v-model="tab.activeIndex" :list="tab.list" align="center" @change="fnOnTabChange"></tm-tabs>
		</view>
		<!-- 占位区域 -->
		<view v-if="tab.list.length > 3" style="width: 100vw;height: 92rpx;"></view>

		<view v-if="loading != 'success'" class="loading-wrap">
			<block v-if="loading == 'loading'">
				<tm-skeleton model="listAvatr"></tm-skeleton>
				<tm-skeleton model="listAvatr"></tm-skeleton>
				<tm-skeleton model="listAvatr"></tm-skeleton>
				<tm-skeleton model="listAvatr"></tm-skeleton>
				<tm-skeleton model="listAvatr"></tm-skeleton>
			</block>
			<view v-else-if="loading == 'error'" class="loading-error flex flex-col flex-center">
				<tm-empty icon="icon-wind-cry" label="加载失败"><tm-button theme="light-blue" size="m" @click="fnGetData()">重新加载</tm-button></tm-empty>
			</view>
		</view>
		<view v-else class="app-page-content">
			<!-- 内容区域 -->
			<view v-if="filterList.lenght == 0" class="empty"><tm-empty icon="icon-wind-cry" label="无数据"></tm-empty></view>
			<block v-else>
				<block v-for="(item, index) in filterList" :key="index">
					<tm-translate animation-name="fadeUp" :wait="calcAniWait(index)">
						<view class="link-card round-3 bg-white flex flex-col mt-24 ml-24 mr-24 pa-24">
							<view class="head flex">
								<view class="left round-2 flex flex-col flex-center">
									<image class="logo round-2 " :src="item.logo" mode="aspectFill"></image>
								</view>
								<view class="right pl-24 text-size-m">
									<view class="title flex flex-between ">
										<view class="name flex text-overflow mr-6 text-weight-b">
											<tm-tags :dense="true" :shadow="0" color="bg-gradient-blue-accent" size="xs" model="fill">ID:{{ item.id }}</tm-tags>
											<text class="text-size-l ml-12">{{ item.name }}</text>
										</view>
										<view v-if="false" class="icon text-grey-darken-2">
											<tm-button :shadow="0" :round="2" theme="light-blue" text size="xs" @click="fnShowFormModal(item)">修改</tm-button>
											<tm-button :shadow="0" :round="2" theme="red" text size="xs" @click="fnDelete(item)">删除</tm-button>
										</view>
									</view>
									<view class="mt-6 flex text-size-m">
										<view class="label text-grey-darken-2">分组：</view>
										<view class="value">{{ item.team || '无分组' }}</view>
									</view>
									<view class="mt-6 flex text-size-m">
										<view class="label text-grey-darken-2">地址：</view>
										<view class="value">
											<text>{{ item.url }}</text>
											<text class="ml-6 text-grey-darken-1 iconfont icon-copy" @click="$utils.copyText(item.url, '网站地址已复制')"></text>
										</view>
									</view>
									<view class="mt-6 flex text-size-m">
										<view class="label text-grey-darken-2">描述：</view>
										<view class="value text-overflow">{{ item.description || '该博主很懒，没有提供描述' }}</view>
									</view>
								</view>
							</view>
							<view class="foot flex flex-between mt-20 pt-16 text-size-m">
								<view class="e-btn update-btn flex-1 round-2 pa-12 text-blue text-align-center mr-12" @click="fnShowFormModal(item)">修改</view>
								<view class="e-btn del-btn flex-1 round-2 pa-12 text-red text-align-center ml-12" @click="fnDelete(item)">删除</view>
							</view>
						</view>
					</tm-translate>
				</block>
			</block>
			<tm-flotbutton @click="fnToTopPage" :offset="[16, 80]" size="m" color="light-blue" icon="icon-angle-up"></tm-flotbutton>
			<tm-flotbutton @click="fnShowFormModal()" size="m" color="orange" icon="icon-plus"></tm-flotbutton>

			<!-- 编辑或新增 -->
			<tm-poup v-model="poupShow" position="bottom" height="85vh" @change="fnOnPoupChange">
				<view class="poup-content">
					<view class="poup-head text-align-center text-weight-b text-size-g ma-24">{{ form.id != undefined ? '编辑友链' : '新增友链' }}</view>
					<scroll-view class="poup-body pa-24 pt-0" :scroll-y="true" @touchmove.stop>
						<tm-input required :adjust-position="true" :round="3" :borderBottom="false" title="网站名称" bg-color="grey-lighten-5" v-model="form.name" placeholder="请输入网站名称"></tm-input>

						<tm-input required :borderBottom="false" :adjust-position="true" :round="3" title="网站地址" bg-color="grey-lighten-5" v-model="form.url" placeholder="请输入网站地址"></tm-input>
						<view class="pl-32 mb-24 input-tips text-grey text-size-s">填写提示：需要加上 http://</view>

						<tm-input :borderBottom="false" :round="3" bg-color="grey-lighten-5" title="网站分组" placeholder="请输入选择网站分组" :value="form.team">
							<template v-slot:rightBtn>
								<tm-pickers :default-value.sync="selectTeam" :list="teamList" @confirm="fnOnSelectTeam">
									<tm-button class="ml-12" theme="bg-gradient-blue-accent" :round="3" :font-size="24" :height="70" block :width="120">选择</tm-button>
								</tm-pickers>
							</template>
						</tm-input>
						<tm-input input-type="number" :borderBottom="false" :adjust-position="true" :round="3" title="排序编号" bg-color="grey-lighten-5" v-model.number="form.priority" placeholder="请输入排序"></tm-input>
						<tm-input :borderBottom="false" :vertical="true" :adjust-position="true" inputType="textarea" :round="3" title="网站描述" :height="120" bg-color="grey-lighten-5" v-model="form.description" placeholder="请输入描述"></tm-input>

						<tm-input :borderBottom="false" :adjust-position="true" :round="3" title="LOGO" bg-color="grey-lighten-5" v-model="form.logo" placeholder="请输入LOGO地址"></tm-input>
						<view class="ma-30 mt-12 pb-12 bg-grey">
							<image v-if="form.logo" class="thumbnail round-3" :src="form.logo" mode="aspectFill" @click="$utils.previewImage([form.logo])"></image>
							<view v-else class="thumbnail round-3 text-grey grey-lighten-5 flex flex-col flex-center ">
								<text class="iconfont icon-picture" style="font-size: 46rpx;"></text>
								<text class="mt-12 text-size-m">LOGO预览图</text>
							</view>
						</view>
					</scroll-view>
					<view class="btn-wrap flex flex-center">
						<tm-button size="m" theme="bg-gradient-blue-accent" @click="fnSubmit()">保存</tm-button>
						<tm-button v-if="form.id != undefined" size="m" theme="bg-gradient-red-accent" @click="fnDelete()">删除</tm-button>
						<tm-button size="m" theme="bg-gradient-blue-grey-accent" @click="poupShow = false">关 闭</tm-button>
					</view>
				</view>
			</tm-poup>
		</view>
	</view>
</template>

<script>
	import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
	import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
	import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
	import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
	import tmPoup from '@/tm-vuetify/components/tm-poup/tm-poup.vue';
	import tmInput from '@/tm-vuetify/components/tm-input/tm-input.vue';
	import tmPickers from '@/tm-vuetify/components/tm-pickers/tm-pickers.vue';
	import tmTags from '@/tm-vuetify/components/tm-tags/tm-tags.vue';
	import tmTabs from '@/tm-vuetify/components/tm-tabs/tm-tabs.vue';
	import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';

	export default {
		components: {
			tmSkeleton,
			tmButton,
			tmEmpty,
			tmFlotbutton,
			tmPoup,
			tmInput,
			tmPickers,
			tmTags,
			tmTabs,
			tmTranslate
		},
		data() {
			return {
				loading: 'loading',
				queryParams: {
					size: 10,
					page: 0
				},
				dataList: [],
				filterList: [],
				poupShow: false,
				form: {
					id: undefined,
					description: '',
					logo: '',
					name: '',
					team: '',
					url: '',
					priority: 0
				},
				tab: {
					activeIndex: 0,
					list: []
				},
				selectTeam: [],
				teamList: []
			};
		},

		onLoad() {
			this.fnSetPageTitle('友链管理');
			this.fnGetTeamData();
		},
		created() {
			this.fnGetData();
		},
		onPullDownRefresh() {
			this.fnGetData();
		},
		methods: {
			fnOnTabChange(index) {
				this.fnResetSetAniWaitIndex();
				this.fnToTopPage();
				let _filterData = [];
				if (index == 0) {
					_filterData = this.dataList;
				} else {
					_filterData = this.dataList.filter(x => x.team == this.teamList[index - 1]);
				}
				this.filterList = JSON.parse(JSON.stringify(_filterData));
			},
			fnGetTeamData() {
				this.$httpApi.admin
					.getLinkTeamList()
					.then(res => {
						if (res.status == 200) {
							this.tab.list = ['全部', ...res.data];
							this.teamList = res.data;
						} else {
							uni.$tm.toast('友链分组数据加载失败！');
						}
					})
					.catch(err => {
						uni.$tm.toast('友链分组数据加载失败！');
					});
			},
			fnGetData() {
				this.loading = 'loading';
				uni.showLoading({
					mask: true,
					title: '加载中...'
				});
				this.tab.activeIndex = 0;
				this.$httpApi.admin
					.getLinkList(this.queryParams)
					.then(res => {
						if (res.status == 200) {
							const _dataList = res.data.map(item => {
								item.logo = this.$utils.checkUrl(item.logo);
								return item;
							});
							this.dataList = _dataList;
							this.filterList = _dataList;
							this.loading = 'success';
						} else {
							this.loading = 'error';
							uni.$tm.toast('加载失败，请重试！');
						}
					})
					.catch(err => {
						console.error(err);
						this.loading = 'error';
						uni.$tm.toast('加载失败，请重试！');
					})
					.finally(() => {
						uni.hideLoading();
						uni.stopPullDownRefresh();
					});
			},
			fnOnPoupChange(e) {
				if (!e) {
					this.fnResetForm();
				}
			},
			fnShowFormModal(link) {
				if (link) {
					this.form = Object.assign({}, {}, link);
					if (link.team) {
						this.selectTeam = [link.team];
					}
				} else {
					this.fnResetForm();
				}
				this.poupShow = true;
			},
			fnOnSelectTeam(e) {
				this.form.team = e[0].data;
				this.selectTeam = [e[0].data];
			},
			fnResetForm() {
				this.form = {
					id: undefined,
					description: '',
					logo: '',
					name: '',
					team: '',
					url: '',
					priority: 0
				};
			},
			fnSubmit() {
				if (this.form.name.trim() == '') {
					return uni.$tm.toast('友链名称未填写！');
				}
				if (this.form.id == undefined) {
					this.$httpApi.admin
						.addLink(this.form)
						.then(res => {
							if (res.status == 200) {
								uni.$tm.toast(`保存成功！`);
								setTimeout(() => {
									uni.startPullDownRefresh();
								}, 1200);
							} else {
								uni.$tm.toast('操作失败，请重试！');
							}
						})
						.catch(err => {
							uni.$tm.toast('操作失败，请重试！');
						});
				} else {
					this.$httpApi.admin
						.updateLink(this.form.id, this.form)
						.then(res => {
							if (res.status == 200) {
								uni.$tm.toast(`保存成功！`);
								let updateIndex = this.dataList.findIndex(x => x.id == this.form.id);
								this.$set(this.dataList, updateIndex, this.form);
							} else {
								uni.$tm.toast('操作失败，请重试！');
							}
						})
						.catch(err => {
							uni.$tm.toast('操作失败，请重试！');
						});
				}
			},
			// 删除
			fnDelete(link) {
				const _link = link || this.form;
				uni.$eShowModal({
						title: '提示',
						content: `您是否要将 ${_link.name} 删除？`,
						showCancel: true,
						cancelText: '否',
						cancelColor: '#999999',
						confirmText: '是',
						confirmColor: '#03a9f4'
					})
					.then(res => {
						this.$httpApi.admin
							.deleteLink(_link.id)
							.then(res => {
								if (res.status == 200) {
									uni.$tm.toast(`${_link.name} 已删除！`);
									const delIndex = this.dataList.findIndex(x => x.id == _link.id);
									this.dataList.splice(delIndex, 1);
								} else {
									uni.$tm.toast('操作失败，请重试！');
								}
							})
							.catch(err => {
								uni.$tm.toast('操作失败，请重试！');
							});
					})
					.catch(err => {});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.app-page {
		width: 100vw;
		min-height: 100vh;
	}

	.loading-wrap {
		padding: 24rpx;

		.loading-error {
			height: 65vh;
		}
	}

	.link-card {
		box-sizing: border-box;
		box-shadow: 0rpx 4rpx 24rpx rgba(0, 0, 0, 0.03);

		.head {
			.left {
				width: 166rpx;
				height: 166rpx;

				.logo {
					width: 100%;
					height: 100%;
				}
			}

			.right {
				width: 0;
				flex-grow: 1;

				.name {
					width: 0;
					flex-grow: 1;
					display: flex;
					align-items: center;
				}

				.label {
					width: 84rpx;
				}

				.value {
					width: 0;
					flex-grow: 1;
				}
			}
		}

		.foot {
			box-sizing: border-box;
			// border-top: 2rpx solid rgba(0, 0, 0, 0.03);
		}
	}

	.poup-content {
		overflow: hidden;
	}

	.poup-body {
		height: 71vh;
		box-sizing: border-box;
		touch-action: none;
	}

	.thumbnail {
		width: 100%;
		height: 260rpx;
	}

	.update-btn {
		background-color: rgba(240, 250, 255, 1);
	}

	.del-btn {
		background-color: rgba(254, 241, 240, 1) !important;
	}
</style>