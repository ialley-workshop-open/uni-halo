<template>
	<view class="app-page flex flex-col">
		<view class="e-fixed shadow-2 bg-white">
			<tm-search
				:clear="true"
				v-model="queryParams.keyword"
				:round="24"
				:shadow="0"
				confirmText="搜索"
				color="light-blue"
				insertColor="light-blue"
				align="center"
				@confirm="fnOnSearch()"
			></tm-search>
			<tm-tabs v-if="team.list.length != 0" color="light-blue" :shadow="0" v-model="team.activeIndex" :list="team.list" align="center" @change="fnOnTabChange"></tm-tabs>
		</view>

		<!-- 占位区域 -->
		<view v-if="team.list.length != 0" style="width: 100vw;height: 184rpx;"></view>
		<view v-else style="width: 100vw;height: 94rpx;"></view>

		<view v-if="loading != 'success'" class="loading-wrap">
			<block v-if="loading == 'loading'">
				<tm-skeleton model="card"></tm-skeleton>
				<tm-skeleton model="card"></tm-skeleton>
				<tm-skeleton model="card"></tm-skeleton>
				<tm-skeleton model="card"></tm-skeleton>
			</block>
			<view v-else-if="loading == 'error'" class="loading-error flex flex-col flex-center">
				<tm-empty icon="icon-wind-cry" label="加载失败"><tm-button theme="light-blue" size="m" @click="fnGetData()">重新加载</tm-button></tm-empty>
			</view>
		</view>

		<view class="page-content pa-24 flex flex-col" v-else>
			<view v-if="dataList.length == 0" class="content-empty flex flex-center"><tm-empty icon="icon-shiliangzhinengduixiang-" label="暂无任何图片"></tm-empty></view>
			<block v-else>
				<block v-for="(item, index) in dataList" :key="index">
					<tm-translate animation-name="fadeUp" :wait="(index + 1) * 50">
						<view class="card mb-24 flex flex-col bg-white pa-24 round-3">
							<view class="thumbnail round-2" @click="fnPreview(item, index)">
								<image class="thumbnail-img round-2" :src="item.showThumbnail" mode="aspectFill"></image>
							</view>
							<view class="info">
								<view class=" mt-12 text-size-m text-grey-darken-1">图片名称：{{ item.name }}</view>
								<view class=" mt-12 text-size-m text-grey-darken-1">图片分组：{{ item.team || '未分组' }}</view>
								<view class=" mt-8 text-size-m text-grey-darken-1">拍摄日期：{{ { d: item.takeTime, f: 'yyyy年MM月dd日 星期w' } | formatTime }}</view>

								<view class=" mt-12 text-size-m text-grey-darken-1">拍摄地点：{{ item.location || '未填写拍摄地点' }}</view>
							</view>
							<view class="flex flex-center pt-24 desc-box text-size-m">
								<tm-button theme="light-blue" :shadow="0" block :width="300" :height="70" @click="fnEdit(item)">编辑</tm-button>
								<tm-button class="ml-36" theme="red" :shadow="0" block :width="300" :height="70" @click="fnDelete(item, index)">删除</tm-button>
							</view>
						</view>
					</tm-translate>
				</block>

				<tm-flotbutton @click="fnToTopPage" :offset="[16, 80]" color="bg-gradient-light-blue-accent" size="m" icon="icon-angle-up"></tm-flotbutton>
				<view class="load-text ">{{ loadMoreText }}</view>
			</block>
			<tm-flotbutton :show-text="true" color="bg-gradient-orange-accent" @click="fnAdd()"></tm-flotbutton>
		</view>

		<!-- 编辑或新增 -->
		<tm-poup v-model="poupShow" position="bottom" height="85vh" @change="fnOnPoupChange">
			<view class="poup-content">
				<view class="poup-head text-align-center text-weight-b text-size-g ma-24">{{ form.id != undefined ? '编辑图片' : '新增图片' }}</view>
				<scroll-view :enable-flex="true" class="poup-body pa-24 pt-0 pb-0" :scroll-y="true" :scroll-top="poupBodyScrollTop" @touchmove.stop @scroll="fnOnPoupBodyScroll">
					<tm-input
						:adjust-position="true"
						:round="3"
						clear
						:borderBottom="false"
						title="图片名称"
						bg-color="grey-lighten-5"
						v-model="form.name"
						placeholder="请输入图片名称"
					></tm-input>

					<tm-input
						name="team"
						:adjust-position="true"
						:round="3"
						bg-color="grey-lighten-5"
						:borderBottom="false"
						title="图片分组"
						placeholder="请选择输入或分组"
						v-model="form.team"
					>
						<tm-pickers slot="rightBtn" rang-key="name" :default-value.sync="team.selected" :list="team.selectList" @confirm="fnOnSelectTeamConfirm">
							<tm-button size="m" :dense="true" :shadow="0" theme="bg-gradient-light-blue-accent">选择</tm-button>
						</tm-pickers>
					</tm-input>
					<view class="pl-32 mb-24 input-tips text-grey text-size-s">填写提示：图片分组可选择，也可以输入新的分组名称</view>
					<tm-pickersDate
						:full-number="true"
						:show-detail="{ year: true, month: true, day: true, hour: true, min: true, sec: true }"
						:default-value="takeTime"
						@confirm="fnOnTakeTimeConfirm"
					>
						<tm-input
							title="拍摄时间"
							:adjust-position="true"
							:round="3"
							bg-color="grey-lighten-5"
							:borderBottom="false"
							placeholder="请选择拍摄时间"
							disabled
							:value="takeTime"
						></tm-input>
					</tm-pickersDate>
					<tm-input
						:borderBottom="false"
						:adjust-position="true"
						:round="3"
						clear
						title="拍摄地点"
						bg-color="grey-lighten-5"
						v-model="form.location"
						placeholder="请输入拍摄地点"
					></tm-input>
					<tm-input
						:borderBottom="false"
						:vertical="false"
						clear
						:adjust-position="true"
						inputType="textarea"
						:round="3"
						title="图片描述"
						:height="160"
						bg-color="grey-lighten-5"
						v-model="form.description"
						placeholder="请输入图片描述"
					></tm-input>
					<tm-input
						name="url"
						clear
						:borderBottom="false"
						:adjust-position="true"
						:round="3"
						title="图片地址"
						bg-color="grey-lighten-5"
						v-model="form.url"
						placeholder="请输入或选择图片"
						@clear="fnOnUrlInputChange"
						@blur="fnOnUrlInputChange"
						@input="fnOnUrlInputChange"
					>
						<tm-button slot="rightBtn" size="m" :dense="true" :shadow="0" theme="bg-gradient-light-blue-accent" @click="fnShowAttachmentsSelect('url')">选择</tm-button>
					</tm-input>
					<tm-input
						name="thumbnail"
						:borderBottom="false"
						:adjust-position="true"
						:round="3"
						clear
						title="缩略图片"
						bg-color="grey-lighten-5"
						v-model="form.thumbnail"
						placeholder="请输入或选择缩略图"
					>
						<tm-button slot="rightBtn" size="m" :dense="true" :shadow="0" theme="bg-gradient-light-blue-accent" @click="fnShowAttachmentsSelect('thumbnail')">
							选择
						</tm-button>
					</tm-input>
					<view class="ma-30 mt-12 pb-12">
						<view class="mb-12"><text class="text-size-m">图片预览</text></view>
						<image :src="form.showThumbnail" mode="aspectFit"></image>
					</view>
				</scroll-view>
				<view class="btn-wrap flex flex-center bg-white">
					<tm-button :width="300" :height="72" theme="bg-gradient-blue-accent" @click="fnSave()">保存</tm-button>
					<tm-button :width="300" :height="72" theme="bg-gradient-blue-grey-accent" @click="poupShow = false">关 闭</tm-button>
				</view>
			</view>
		</tm-poup>

		<!-- 附件选择文件 -->
		<attachment-select selectType="image" v-if="attachmentsSelectShow" @on-select="fnOnAttachmentsSelect" @on-close="fnOnAttachmentsSelectClose"></attachment-select>
	</view>
</template>

<script>
import throttle from '@/utils/throttle.js';
import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
import tmSearch from '@/tm-vuetify/components/tm-search/tm-search.vue';
import tmTabs from '@/tm-vuetify/components/tm-tabs/tm-tabs.vue';
import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
import tmPoup from '@/tm-vuetify/components/tm-poup/tm-poup.vue';
import tmInput from '@/tm-vuetify/components/tm-input/tm-input.vue';
import tmPickersDate from '@/tm-vuetify/components/tm-pickersDate/tm-pickersDate.vue';
import tmPickers from '@/tm-vuetify/components/tm-pickers/tm-pickers.vue';

import AttachmentSelect from '@/components/attachment-select/attachment-select.vue';
export default {
	components: {
		tmSkeleton,
		tmButton,
		tmSearch,
		tmTabs,
		tmEmpty,
		tmFlotbutton,
		tmTranslate,
		tmPoup,
		tmInput,
		tmPickersDate,
		tmPickers,
		AttachmentSelect
	},
	data() {
		return {
			loading: 'loading',
			team: {
				activeIndex: 0,
				list: [],
				selected: [],
				selectList: []
			},
			queryParams: {
				size: 10,
				page: 0,
				sort: 'createTime,desc',
				sort: 'id,asc'
			},
			result: null,
			dataList: [],
			total: 0,
			isLoadMore: false,
			loadMoreText: '加载中...',

			poupShow: false,
			attachmentsSelectShow: false,
			selectAttachmentsType: 'url',
			takeTime: undefined,
			form: {
				id: undefined,
				location: undefined,
				name: undefined,
				takeTime: undefined,
				team: undefined,
				thumbnail: undefined,
				url: undefined,
				description: undefined
			},
			poupBodyScrollTop: 0
		};
	},

	onLoad() {
		this.fnSetPageTitle('图库管理');
		this.fnGetTeamList();
	},
	created() {
		this.fnGetData();
	},
	onPullDownRefresh() {
		this.queryParams.page = 0;
		this.dataList = [];
		this.fnGetData();
	},
	onReachBottom(e) {
		if (this.result.hasNext) {
			this.queryParams.page += 1;
			this.isLoadMore = true;
			this.fnGetData();
		} else {
			uni.showToast({
				icon: 'none',
				title: '没有更多数据了'
			});
		}
	},
	methods: {
		// 获取分类列表
		fnGetTeamList() {
			this.$httpApi.admin
				.getPhotosTeams()
				.then(res => {
					if (res.status == 200) {
						let _list = res.data;
						this.team.selectList = _list.map((item, index) => {
							return {
								id: index,
								name: item,
								value: item
							};
						});
						if (_list.length > 1) {
							_list.unshift('全部');
							this.team.list = _list;
						}
					}
				})
				.catch(err => {});
		},
		fnOnSearch() {
			this.queryParams.page = 0;
			this.isLoadMore = false;
			this.fnToTopPage();
			this.fnGetData();
		},
		fnOnTabChange(index) {
			this.queryParams.team = index == 0 ? undefined : this.team.list[index];
			this.queryParams.page = 0;
			this.dataList = [];
			this.fnToTopPage();
			this.fnGetData();
		},
		fnOnTakeTimeConfirm(e) {
			this.takeTime = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.min}:${e.sec}`;
			this.form.takeTime = new Date(this.takeTime).getTime();
		},
		fnOnSelectTeamConfirm(e) {
			const _select = e[0].data;
			this.form.team = _select.value;
		},
		fnGetData() {
			uni.showLoading({
				mask: true,
				title: '加载中...'
			});
			// 设置状态为加载中
			if (!this.isLoadMore) {
				this.loading = 'loading';
			}
			this.loadMoreText = '加载中...';
			this.$httpApi.admin
				.getPhotos(this.queryParams)
				.then(res => {
					if (res.status == 200) {
						this.loadMoreText = res.data.hasNext ? '上拉加载更多' : '呜呜，没有更多数据啦~';
						this.result = res.data;
						this.total = res.data.total;
						let _list = res.data.content.map(item => {
							// 处理显示的图片
							item['showThumbnail'] = this.$utils.checkThumbnailUrl(item.thumbnail);
							return item;
						});

						if (this.isLoadMore) {
							this.dataList = this.dataList.concat(_list);
						} else {
							this.dataList = _list;
						}
						this.loading = 'success';
					} else {
						uni.$tm.toast('加载失败，请重试！');
						this.loading = 'error';
					}
				})
				.catch(err => {
					console.error(err);
					uni.$tm.toast('加载失败，请重试！');
					this.loading = 'error';
					this.loadMoreText = '加载失败，请下拉刷新！';
				})
				.finally(() => {
					setTimeout(() => {
						uni.hideLoading();
						uni.stopPullDownRefresh();
					}, 300);
				});
		},
		fnOnAttachmentsSelectClose() {
			this.attachmentsSelectShow = false;
		},
		fnOnPoupBodyScroll(e) {
			throttle(() => {
				this.poupBodyScrollTop = e.detail.scrollTop;
			}, 1000);
		},
		fnOnPoupChange(e) {
			if (!e) {
				this.fnResetForm();
			}
		},
		fnOnUrlInputChange() {
			if (this.form.url) {
				this.$set(this.form, 'showThumbnail', this.$utils.checkThumbnailUrl(this.form.url));
			}
		},
		fnShowAttachmentsSelect(type) {
			this.selectAttachmentsType = type;
			this.attachmentsSelectShow = true;
		},
		// 监听附件选择
		fnOnAttachmentsSelect(file) {
			if (this.selectAttachmentsType == 'url') {
				this.form.url = file.path;
				this.form.showThumbnail = this.$utils.checkThumbnailUrl(file.path);
				if (!this.form.thumbnail) {
					this.form.thumbnail = file.path;
				}
			} else {
				this.form.thumbnail = file.path;
			}
			this.attachmentsSelectShow = false;
		},
		fnResetForm() {
			this.form = { id: undefined, location: undefined, name: undefined, takeTime: undefined, team: undefined, thumbnail: undefined, url: undefined, description: undefined };
			this.takeTime = uni.$tm.dayjs(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
		},
		fnEdit(item) {
			this.poupBodyScrollTop = 0;
			if (!item.takeTime) {
				item.takeTime = new Date().getTime();
			}
			this.takeTime = uni.$tm.dayjs(item.takeTime).format('YYYY-MM-DD HH:mm:ss');
			this.form = item;
			if (this.form.team) {
				this.team.selected = [this.team.selectList.findIndex(x => x.name == this.form.team)];
			} else {
				this.team.selected = [];
			}
			this.poupShow = true;
		},
		// 新增
		fnAdd() {
			this.fnResetForm();
			this.poupBodyScrollTop = 0;
			this.poupShow = true;
		},
		// 保存
		fnSave() {
			if (!this.form.name) {
				return uni.$tm.toast('请填写图片名称！');
			}
			if (!this.$utils.checkIsUrl(this.form.url)) {
				return uni.$tm.toast('请选择或输入正确的图片地址！');
			}
			if (!this.$utils.checkIsUrl(this.form.thumbnail)) {
				return uni.$tm.toast('请选择或输入正确的缩略图地址！');
			}
			if (this.form.id == undefined) {
				this.$httpApi.admin
					.createPhotos(this.form)
					.then(res => {
						if (res.status == 200) {
							uni.$tm.toast(`保存成功！`);
							this.poupShow = false;
							setTimeout(() => {
								this.fnResetForm();
								this.fnGetTeamList();
								uni.startPullDownRefresh();
							}, 1000);
						} else {
							uni.$tm.toast('操作失败，请重试！');
						}
					})
					.catch(err => {
						uni.$tm.toast('操作失败，请重试！');
					});
			} else {
				this.$httpApi.admin
					.updatePhotosById(this.form.id, this.form)
					.then(res => {
						if (res.status == 200) {
							uni.$tm.toast(`保存成功！`);
							let updateIndex = this.dataList.findIndex(x => x.id == this.form.id);
							this.$set(this.dataList, updateIndex, this.form);
							setTimeout(() => {
								this.fnGetTeamList();
							}, 500);
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
		fnDelete(item, index) {
			uni.$eShowModal({
				title: '提示',
				content: `您是否删除名为 ${item.name} 的图片？`,
				showCancel: true,
				cancelText: '否',
				cancelColor: '#999999',
				confirmText: '是',
				confirmColor: '#03a9f4'
			})
				.then(res => {
					this.$httpApi.admin
						.deletePhotosById(item.id)
						.then(res => {
							if (res.status == 200) {
								uni.$tm.toast(`${item.name} 分类已删除！`);
								this.dataList.splice(index, 1);
							} else {
								uni.$tm.toast('操作失败，请重试！');
							}
						})
						.catch(err => {
							uni.$tm.toast('操作失败，请重试！');
						});
				})
				.catch(err => {});
		},
		// 预览
		fnPreview(item, index) {
			uni.previewImage({
				current: index,
				urls: this.dataList.map(x => x.url),
				indicator: 'number',
				loop: true
			});
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
.btn-wrap {
	box-sizing: border-box;
	padding-top: 12rpx;
	padding-bottom: 12rpx;
	box-shadow: 0rpx -4rpx 24rpx rgba(0, 0, 0, 0.05);
}
.card {
	box-shadow: 0rpx 4rpx 24rpx rgba(0, 0, 0, 0.05);
}
.thumbnail {
	width: 100%;
	&-img {
		width: 100%;
		height: 300rpx;
	}
}

.poup-content {
	overflow: hidden;
}
.poup-body {
	height: 69vh;
	box-sizing: border-box;
	touch-action: none;
}
</style>
