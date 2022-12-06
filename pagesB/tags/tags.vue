<template>
	<view class="app-page flex flex-col">
		<view v-if="loading != 'success'" class="loading-wrap pa-24 pt-36">
			<block v-if="loading == 'loading'">
				<tm-skeleton model="listAvatr"></tm-skeleton>
				<tm-skeleton model="listAvatr"></tm-skeleton>
				<tm-skeleton model="listAvatr"></tm-skeleton>
			</block>
			<view v-else-if="loading == 'error'" class="loading-error flex flex-col flex-center">
				<tm-empty icon="icon-wind-cry" label="加载失败"><tm-button theme="light-blue" size="m" @click="fnGetData()">重新加载</tm-button></tm-empty>
			</view>
		</view>
		<view v-else class="app-page-content pa-24">
			<view v-if="dataList.length == 0" class="content-empty flex flex-center"><tm-empty icon="icon-shiliangzhinengduixiang-" label="无数据"></tm-empty></view>
			<block v-else>
				<block v-for="(tag, index) in dataList" :key="index">
					<tm-translate animation-name="fadeUp" :wait="(index + 1) * 50">
						<view class="tags-card flex round-3 bg-white pa-24 mb-24" @click="fnShowFormModal(tag)">
							<text class="del-icon flex flex-center" @click.stop="fnDelete(tag, index)">×</text>
							<view class="left">
								<image v-if="tag.showThumbnail" class="cover round-3" :src="tag.showThumbnail" mode="aspectFill"></image>
								<view v-else class="cover  round-3 flex flex-center text-weight-b text-white text-size-m">无封面</view>
							</view>
							<view class="right pl-24 text-size-m">
								<view class="text-weight-b">名称：{{ tag.name }}</view>
								<view class="mt-12">
									<text class="text-grey-darken-1">别名：</text>
									{{ tag.slug }}
								</view>
								<view class="mt-12">
									<text class="text-grey-darken-1">颜色：</text>
									<text class="color round-2 text-size-s" :style="{ color: tag.color }">{{ tag.color }}</text>
								</view>
							</view>
						</view>
					</tm-translate>
				</block>

				<tm-flotbutton @click="fnToTopPage" :offset="[16, 80]" size="m" color="light-blue" icon="icon-angle-up"></tm-flotbutton>
				<tm-flotbutton @click="fnShowFormModal()" size="m" color="orange" icon="icon-plus"></tm-flotbutton>
			</block>
		</view>

		<!-- 编辑或新增 -->
		<tm-poup v-model="poupShow" position="bottom" height="73vh" @change="fnOnPoupChange">
			<view class="poup-content">
				<view class="poup-head text-align-center text-weight-b text-size-g ma-24">{{ form.id != undefined ? '编辑标签' : '新增标签' }}</view>
				<scroll-view class="poup-body pa-24 pt-0" :scroll-y="true" @touchmove.stop>
					<tm-input
						required
						:adjust-position="true"
						:round="3"
						:borderBottom="false"
						title="名称"
						bg-color="grey-lighten-5"
						v-model="form.name"
						placeholder="请输入标签名称"
					></tm-input>
					<view class="pl-32 mb-24 input-tips text-grey text-size-s">填写提示：页面上所显示的名称</view>
					<tm-input
						:borderBottom="false"
						:adjust-position="true"
						:round="3"
						title="别名"
						bg-color="grey-lighten-5"
						v-model="form.slug"
						placeholder="请输入标签别名"
					></tm-input>
					<view class="pl-32 mb-24 input-tips text-grey text-size-s">填写提示：一般为单个标签页面的标识，最好为英文</view>
					<tm-input
						bg-color="grey-lighten-5"
						:border-bottom="false"
						:adjust-position="true"
						:round="3"
						title="颜色"
						placeholder="点击右侧选择标签颜色"
						v-model="form.color"
					>
						<template v-slot:rightBtn>
							<tm-button class="ml-12" theme="bg-gradient-blue-accent" :round="3" :font-size="24" :height="66" block :width="120" @click="fnSelectColor">
								选择颜色
							</tm-button>
						</template>
					</tm-input>
					<view class="ma-30 mt-12 pb-12">
						<view class="mb-12">
							<text class="text-size-m">封面图</text>
							<text class="text-grey text-size-s">（点击下方图片区域选择封面）</text>
						</view>
						<image v-if="form.showThumbnail" class="thumbnail round-3" :src="form.showThumbnail" mode="aspectFill" @click="attachmentsSelectShow = true"></image>
						<view v-else class="thumbnail round-3 text-grey grey-lighten-5 flex flex-col flex-center " @click="attachmentsSelectShow = true">
							<text class="iconfont icon-picture" style="font-size: 46rpx;"></text>
							<text class="mt-12 text-size-m">选择封面图</text>
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
		<t-color-picker ref="colorPicker" :color="selectColor" @confirm="fnOnConfirmSelectColor"></t-color-picker>
		<!-- 附件选择文件 -->
		<attachment-select selectType="image" v-if="attachmentsSelectShow" @on-select="fnOnAttachmentsSelect" @on-close="fnOnAttachmentsSelectClose"></attachment-select>
	</view>
</template>

<script>
import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
import tmTabs from '@/tm-vuetify/components/tm-tabs/tm-tabs.vue';
import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
import tmTags from '@/tm-vuetify/components/tm-tags/tm-tags.vue';
import tmPoup from '@/tm-vuetify/components/tm-poup/tm-poup.vue';
import tmInput from '@/tm-vuetify/components/tm-input/tm-input.vue';
import tColorPicker from '@/components/t-color-picker/t-color-picker.vue';
import AttachmentSelect from '@/components/attachment-select/attachment-select.vue';
export default {
	components: {
		tmSkeleton,
		tmButton,
		tmEmpty,
		tmTabs,
		tmTranslate,
		tmFlotbutton,
		tmTags,
		tmPoup,
		tmInput,
		tColorPicker,
		AttachmentSelect
	},
	data() {
		return {
			loading: 'loading',
			queryParams: {
				size: 10,
				page: 0,
				more: true
			},
			dataList: [],
			poupShow: false,
			selectColor: { r: 255, g: 255, b: 255, a: 1 },
			attachmentsSelectShow: false,
			form: {
				color: undefined,
				createTime: undefined,
				fullPath: undefined,
				id: undefined,
				name: '',
				slug: undefined,
				thumbnail: undefined,
				showThumbnail: undefined
			}
		};
	},

	onLoad() {
		this.fnSetPageTitle('标签管理');
	},
	created() {
		this.fnGetData();
	},
	onPullDownRefresh() {
		this.isLoadMore = false;
		this.queryParams.page = 0;
		this.fnGetData();
	},

	methods: {
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
				.getTagsList(this.queryParams)
				.then(res => {
					this.loading = 'success';
					this.dataList = res.data.map(item => {
						if (item.thumbnail) {
							item['showThumbnail'] = this.$utils.checkThumbnailUrl(item.thumbnail);
						} else {
							item['showThumbnail'] = '';
						}
						return item;
					});
				})
				.catch(err => {
					console.error(err);
					this.loading = 'error';
					this.loadMoreText = '加载失败，请下拉刷新！';
				})
				.finally(() => {
					setTimeout(() => {
						uni.hideLoading();
						uni.stopPullDownRefresh();
					}, 800);
				});
		},

		fnSelectColor() {
			this.$refs.colorPicker.open();
		},

		fnOnConfirmSelectColor(e) {
			this.selectColor = e.rgba;
			this.$set(this.form, 'color', e.hex);
		},
		fnOnAttachmentsSelectClose() {
			this.attachmentsSelectShow = false;
			console.log('this.attachmentsSelectShow', this.attachmentsSelectShow);
		},
		fnOnPoupChange(e) {
			if (!e) {
				this.fnResetForm();
			}
		},
		// 监听附件选择
		fnOnAttachmentsSelect(file) {
			this.form.thumbnail = file.path;
			this.form.showThumbnail = this.$utils.checkThumbnailUrl(file.path);
			this.attachmentsSelectShow = false;
		},
		fnShowFormModal(tag) {
			if (tag) {
				this.form = Object.assign({}, {}, tag);
				if (tag.thumbnail) {
					this.form.showThumbnail = this.$utils.checkThumbnailUrl(tag.thumbnail);
				}
			} else {
				this.fnResetForm();
			}
			this.poupShow = true;
		},
		fnResetForm() {
			this.form = {
				color: undefined,
				createTime: undefined,
				fullPath: undefined,
				id: undefined,
				name: '',
				slug: undefined,
				thumbnail: undefined,
				showThumbnail: undefined
			};
		},
		fnSubmit() {
			if (this.form.name.trim() == '') {
				return uni.$tm.toast('标签名称未填写！');
			}
			if (this.form.id == undefined) {
				this.$httpApi.admin
					.createTags(this.form)
					.then(res => {
						if (res.status == 200) {
							uni.$tm.toast(`保存成功！`);
							uni.startPullDownRefresh();
						} else {
							uni.$tm.toast('操作失败，请重试！');
						}
					})
					.catch(err => {
						uni.$tm.toast('操作失败，请重试！');
					});
			} else {
				this.$httpApi.admin
					.updateTagsById(this.form.id, this.form)
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
		fnDelete(tag) {
			const _tag = tag || this.form;
			uni.$eShowModal({
				title: '提示',
				content: `您是否要将 ${_tag.name} 的标签删除？`,
				showCancel: true,
				cancelText: '否',
				cancelColor: '#999999',
				confirmText: '是',
				confirmColor: '#03a9f4'
			})
				.then(res => {
					this.$httpApi.admin
						.deleteTagsById(_tag.id)
						.then(res => {
							if (res.status == 200) {
								uni.$tm.toast(`${_tag.name} 标签已删除！`);
								const delIndex = this.dataList.findIndex(x => x.id == _tag.id);
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
	.loading-error {
		height: 65vh;
	}
}
.content-empty {
	width: 100%;
	height: 60vh;
}

.poup-content {
	overflow: hidden;
}
.poup-body {
	height: 58vh;
	box-sizing: border-box;
}
.thumbnail {
	width: 100%;
	height: 260rpx;
}
.tags-card {
	position: relative;
	box-sizing: border-box;
	box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.03);
	.del-icon {
		width: 46rpx;
		height: 46rpx;
		position: absolute;
		right: 24rpx;
		top: 24rpx;
		border-radius: 50%;
		box-sizing: border-box;
		border: 4rpx solid #fff;
		background-color: #ff8177;
		box-shadow: 0rpx 0rpx 24rpx rgba(0, 0, 0, 0.05);
		font-size: 32rpx;
		color: #fff;
	}
	.left {
		width: 160rpx;
		height: 140rpx;

		.cover {
			width: 100%;
			height: inherit;
			// background-color: #788ea7;
			background-color: #607d8b;
		}
	}
	.right {
		box-sizing: border-box;
		.color {
			color: #fff;
		}
	}
}
</style>
