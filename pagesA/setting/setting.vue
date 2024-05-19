<template>
	<view class="app-page" :class="{ 'is-balck grey-darken-6': isBlackTheme }">
		<tm-form v-if="!loading" ref="formData">
			<!-- <tm-sheet :shadow="24" :padding="[12, 24]" :margin="[24, 24]">
					<view class="py-12 px-24 mx-12 round-3 border-b-1 grey text">
						<text class="text-size-n text-weight-b ">标题</text>
						<text class="text-grey text-size-xs px-10">副标题/描述</text>
					</view>
					<view class="sheet-content">内容区域</view>
				</tm-sheet> -->
			<tm-sheet :shadow="6" :padding="[12, 24]" :margin="[24, 24]">
				<view class="py-12 px-24 mx-12 round-3  grey text">
					<text class="text-size-n text-weight-b text-grey-darken-3">布局</text>
					<text class="text-grey text-size-xs px-10 ml-12">应用以及文章列表布局设置</text>
				</view>
				<view class="sheet-content">
					<tm-pickers title="请选择首页布局" btn-color="light-blue" :default-value.sync="homeLayout.selectDefault"
						rang-key="name" :list="homeLayout.list" @confirm="fnOnHomeLayoutConfirm">
						<tm-input name="status" required title="首页文章布局" placeholder="请选择首页文章布局" disabled align="right"
							:value="homeLayout.selectLabel" right-icon="icon-angle-right"></tm-input>
					</tm-pickers>
					<tm-pickers title="请选择文章卡片样式" btn-color="light-blue"
						:default-value.sync="articleCardStyle.selectDefault" rang-key="name"
						:list="articleCardStyle.list" @confirm="fnOnArticleCardStyleConfirm">
						<tm-input name="status" required title="文章卡片样式" placeholder="请选择文章卡片样式" disabled align="right"
							:value="articleCardStyle.selectLabel" right-icon="icon-angle-right"></tm-input>
					</tm-pickers>
				</view>
			</tm-sheet>

			<tm-sheet v-if="false" :shadow="24" :padding="[12, 24]" :margin="[24, 24]">
				<view class="py-12 px-24 mx-12 round-3 grey text">
					<text class="text-size-n text-weight-b ">外观</text>
					<text class="text-grey text-size-xs px-10">设置应用主题色/暗黑模式等</text>
				</view>
				<view class="sheet-content">
					<!-- 内容区域 -->
					<text class="ma-24">todo</text>
				</view>
			</tm-sheet>

			<tm-sheet :shadow="6" :padding="[12, 24]" :margin="[24, 24]">
				<view class="py-12 px-24 mx-12 round-3 grey text">
					<text class="text-size-n text-weight-b text-grey-darken-3">功能</text>
					<text class="text-grey text-size-xs px-10  ml-12">一些常用的功能性设置</text>
				</view>
				<view class="sheet-content">
					<view class="mx-32 my-24 border-b-1  pb-24 flex-between">
						<text class="text-size-m">图库瀑布流模式</text>
						<tm-switch v-model="appSettings.gallery.useWaterfull" color="light-blue"
							:text="['是', '否']"></tm-switch>
					</view>
					<view class="mx-32 my-24 border-b-1  pb-24 flex-between">
						<text class="text-size-m">友链简洁模式</text>
						<tm-switch v-model="appSettings.links.useSimple" color="light-blue"
							:text="['是', '否']"></tm-switch>
					</view>
					<!-- 	<view class="mx-32 mt-24 mb-0 border-b-1 pb-24 flex-between">
						<text class="text-size-m">启用评论弹幕</text>
						<tm-switch v-model="appSettings.barrage.use" color="light-blue" :text="['是', '否']"></tm-switch>
					</view>
					<tm-pickers
						v-if="appSettings.barrage.use"
						title="评论弹幕位置"
						btn-color="light-blue"
						:default-value.sync="barrage.selectDefault"
						rang-key="name"
						:list="barrage.list"
						@confirm="fnOnBarrageConfirm"
					>
						<tm-input
							name="status"
							title="评论弹幕位置"
							placeholder="请选择评论弹幕位置"
							disabled
							align="right"
							:value="barrage.selectLabel"
							right-icon="icon-angle-right"
						></tm-input>
					</tm-pickers> -->
					<view class="mx-32 my-24 border-b-1  pb-24 flex-between">
						<text class="text-size-m">是否圆形头像</text>
						<tm-switch v-model="appSettings.isAvatarRadius" color="light-blue"
							:text="['是', '否']"></tm-switch>
					</view>
					<view class="mx-32 my-24 border-b-1  pb-24 flex-between">
						<text class="text-size-m ">轮播图指示器</text>
						<tm-switch v-model="appSettings.banner.useDot" color="light-blue"
							:text="['是', '否']"></tm-switch>
					</view>
					<view v-if="appSettings.banner.useDot" class="mx-32 my-24 border-b-1  pb-24 flex-between">
						<text class="text-size-m ">轮播图指示器位置</text>
						<tm-groupradio name="dotPosition" @change="fnOnBannerDotChange">
							<tm-radio :name="item.name" :size="28" color="light-blue"
								v-for="(item, index) in dotPositionList" :key="index" v-model="item.checked"
								:label="item.name"></tm-radio>
						</tm-groupradio>
					</view>

					<!-- 	<view class="mx-32 my-24 border-b-1  pb-24 flex-between">
						<text class="text-size-m">显示完整统计</text>
						<tm-switch v-model="appSettings.about.showAllCount" color="light-blue" :text="['是', '否']"></tm-switch>
					</view>
					<view class="mx-32 my-24 border-b-1  pb-24 flex-between">
						<text class="text-size-m ">链接直接打开</text>
						<tm-switch v-model="appSettings.contact.isLinkCopy" color="light-blue" :text="['是', '否']"></tm-switch>
					</view>
					<view v-if="false" class="mx-32 my-24 border-b-1  pb-24 flex-between">
						<text class="text-size-m ">显示后台入口</text>
						<tm-switch v-model="appSettings.about.showAdmin" color="light-blue" :text="['是', '否']"></tm-switch>
					</view> -->
				</view>
			</tm-sheet>
		</tm-form>

		<!-- 操作区域 -->
		<view v-if="!loading" class="btn-bar flex flex-center bg-white">
			<tm-button theme="light-blue" :shadow="0" block :height="70" @click="fnOnSave()">保存设置</tm-button>
			<tm-button theme="red" :shadow="0" block :height="70" @click="fnOnSaveDefault()">恢复默认设置</tm-button>
			<tm-button theme="blue-grey" :shadow="0" block :height="70" @click="fnOnBack()">返回</tm-button>
		</view>
	</view>
</template>

<script>
	import {
		_DefaultAppSettings
	} from '@/utils/app.js';
	import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
	import tmForm from '@/tm-vuetify/components/tm-form/tm-form.vue';
	import tmPickers from '@/tm-vuetify/components/tm-pickers/tm-pickers.vue';
	import tmInput from '@/tm-vuetify/components/tm-input/tm-input.vue';
	import tmSwitch from '@/tm-vuetify/components/tm-switch/tm-switch.vue';
	import tmSheet from '@/tm-vuetify/components/tm-sheet/tm-sheet.vue';
	import tmGroupradio from '@/tm-vuetify/components/tm-groupradio/tm-groupradio.vue';
	import tmRadio from '@/tm-vuetify/components/tm-radio/tm-radio.vue';

	export default {
		components: {
			tmButton,
			tmForm,
			tmPickers,
			tmInput,
			tmSwitch,
			tmSheet,
			tmGroupradio,
			tmRadio
		},
		data() {
			return {
				isBlackTheme: false,
				loading: true,
				appSettings: {},
				isSaved: true,
				firstLoad: true,
				homeLayout: {
					list: [{
						name: '一行一列',
						value: 'h_row_col1'
					}, {
						name: '一行两列',
						value: 'h_row_col2'
					}],
					selectDefault: ['一行一列'],
					selectLabel: '一行一列',
					selectValue: 'h_row_col1'
				},
				articleCardStyle: {
					list: [{
							name: '左图右文',
							value: 'lr_image_text'
						},
						{
							name: '左文右图',
							value: 'lr_text_image'
						},
						{
							name: '上图下文',
							value: 'tb_image_text'
						},
						{
							name: '上文下图',
							value: 'tb_text_image'
						},
						{
							name: '只有文字',
							value: 'only_text'
						}
					],
					selectDefault: ['左图右文'],
					selectLabel: '左图右文',
					selectValue: 'lr_image_text'
				},
				dotPositionList: [{
					name: '右边',
					value: 'right',
					checked: true
				}, {
					name: '下边',
					value: 'bottom',
					checked: false
				}],
				barrage: {
					list: [{
						name: '顶部',
						value: 'rightToLeft'
					}, {
						name: '左下',
						value: 'leftBottom'
					}],
					selectDefault: ['顶部'],
					selectLabel: '顶部',
					selectValue: 'rightToLeft'
				}
			};
		},

		watch: {
			appSettings: {
				deep: true,
				handler() {
					if (this.firstLoad) {
						this.firstLoad = false;
					} else {
						this.isSaved = false;
					}
				}
			}
		},

		onLoad(e) {
			this.fnSetPageTitle('应用设置');
		},
		created() {
			this.appSettings = Object.assign({}, _DefaultAppSettings, uni.$tm.vx.getters().getSettings);
			this.fnHandleFormatSelect();
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			setTimeout(() => {
				this.loading = false;
				uni.hideLoading();
			}, 500);
		},

		methods: {
			// 统一处理选择框的内容
			fnHandleFormatSelect() {
				// 首页布局
				const _homeLayout = this.fnFindObjInList(this.homeLayout.list, 'value', this.appSettings.layout.home);
				this.homeLayout.selectDefault = [_homeLayout.name];
				this.homeLayout.selectLabel = _homeLayout.name;
				this.homeLayout.selectValue = _homeLayout.value;

				const _articleCardStyle = this.fnFindObjInList(this.articleCardStyle.list, 'value', this.appSettings.layout
					.cardType);
				this.articleCardStyle.selectDefault = [_articleCardStyle.name];
				this.articleCardStyle.selectLabel = _articleCardStyle.name;
				this.articleCardStyle.selectValue = _articleCardStyle.value;

				const _barrage = this.fnFindObjInList(this.barrage.list, 'value', this.appSettings.barrage.type);
				this.barrage.selectDefault = [_barrage.name];
				this.barrage.selectLabel = _barrage.name;
				this.barrage.selectValue = _barrage.value;
			},
			// 在集合中找匹配的对象
			fnFindObjInList(list, key, value) {
				return list.find(x => x[key] == value);
			},
			fnOnBannerDotChange(e) {
				const _select = e[0];
				if (_select.index == 0 && _select.checked) {
					this.appSettings.banner.dotPosition = 'right';
				}
				if (_select.index == 1 && _select.checked) {
					this.appSettings.banner.dotPosition = 'bottom';
				}
			},
			// 首页布局
			fnOnHomeLayoutConfirm(e) {
				const _select = e[0].data;
				this.homeLayout.selectDefault = [_select.name];
				this.homeLayout.selectLabel = _select.name;
				this.homeLayout.selectValue = _select.value;
				this.appSettings.layout.home = _select.value;
			},
			// 文章卡片样式
			fnOnArticleCardStyleConfirm(e) {
				const _select = e[0].data;
				this.articleCardStyle.selectDefault = [_select.name];
				this.articleCardStyle.selectLabel = _select.name;
				this.articleCardStyle.selectValue = _select.value;
				this.appSettings.layout.cardType = _select.value;
			},
			// 弹幕设置
			fnOnBarrageConfirm(e) {
				const _select = e[0].data;
				this.barrage.selectDefault = [_select.name];
				this.barrage.selectLabel = _select.name;
				this.barrage.selectValue = _select.value;
				this.appSettings.barrage.type = _select.value;
			},
			// 保存
			fnOnSave() {
				this.isSaved = true;
				this.$tm.vx.commit('setting/setSettings', this.appSettings);
				uni.$tm.toast('保存成功，部分设置在重启后生效！');
			},
			// 使用默认配置
			fnOnSaveDefault() {
				uni.$eShowModal({
						title: '提示',
						content: '您确定要恢复为默认的设置吗？',
						showCancel: true,
						cancelText: '否',
						cancelColor: '#999999',
						confirmText: '是',
						confirmColor: '#03a9f4'
					})
					.then(res => {
						this.isSaved = true;
						uni.$tm.vx.actions('setting/updateDefaultAppSettings');
						uni.$tm.toast('系统设置已恢复为默认配置，部分设置在重启后生效！');
					})
					.catch(err => {});
			},
			fnOnBack() {
				if (this.isSaved) {
					uni.navigateBack();
					return;
				}
				uni.$eShowModal({
						title: '提示',
						content: '您当前可能有未保存的数据，确定返回吗？',
						showCancel: true,
						cancelText: '否',
						cancelColor: '#999999',
						confirmText: '是',
						confirmColor: '#03a9f4'
					})
					.then(res => {
						uni.navigateBack();
						this.isSaved = true;
					})
					.catch(err => {});
			}
		}
	};
</script>

<style scoped lang="scss">
	.app-page {
		box-sizing: border-box;
		padding-bottom: 120rpx;

		.btn-bar {
			width: 100vw;
			position: fixed;
			left: 0;
			bottom: 0;
			box-sizing: border-box;
			padding: 24rpx;
			gap: 0 24rpx;
			box-shadow: 0rpx -6rpx 24rpx rgba(0, 0, 0, 0.03);
		}
	}

	.required {
		position: relative;
		padding-left: 18rpx;

		&:before {
			content: '*';
			position: absolute;
			left: -4rpx;
			top: 50%;
			transform: translateY(-50%);
			font-size: 34rpx;
			color: rgba(244, 67, 54, 1);
		}
	}
</style>