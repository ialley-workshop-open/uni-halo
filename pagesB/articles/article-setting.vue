<template>
	<view class="app-page" :class="{ 'is-balck grey-darken-6': isBlackTheme }">
		<!-- 文章设置页面 -->
		<view class="e-fixed shadow-2"><tm-tabs color="light-blue" :shadow="0" v-model="tab.activeIndex" :list="tab.list" align="center"></tm-tabs></view>
		<!-- 占位区域 -->
		<view style="width: 100vw;height: 90rpx;"></view>
		<view class="pa-24" v-if="loading != 'success'">
			<block v-if="loading == 'loading'">
				<tm-skeleton model="list"></tm-skeleton>
				<tm-skeleton model="list"></tm-skeleton>
				<tm-skeleton model="list"></tm-skeleton>
				<tm-skeleton model="list"></tm-skeleton>
			</block>
			<view v-else class="flex flex-center" style="height:60vh;">
				<tm-empty color="blue"><tm-button theme="blue" @click="fnGetSettings()">刷新试试</tm-button></tm-empty>
			</view>
		</view>
		<view v-else class="app-page-content ma-24 bg-white round-3 ">
			<!-- 表单区域 -->
			<tm-form ref="formData">
				<!-- 基本设置 -->
				<view v-show="tab.activeIndex == 0">
					<tm-input name="title" required title="文章标题" placeholder="请输入文章标题..." v-model="article.title"></tm-input>
					<tm-input name="slug" required title="文章别名" v-model="article.slug" placeholder="请输入文章别名..."></tm-input>
					<tm-pickers
						title="选择文章的状态"
						btn-color="light-blue"
						:default-value.sync="articleStatus.status"
						rang-key="name"
						:list="articleStatus.list"
						@confirm="fnOnArticleStatusConfirm"
					>
						<tm-input
							name="status"
							required
							title="文章状态"
							placeholder="请选择文章状态"
							disabled
							:value="articleStatus.selectText"
							right-icon="icon-angle-right"
						></tm-input>
					</tm-pickers>
					<tm-input
						v-if="articleStatus.selectValue == 'INTIMATE'"
						name="password"
						:password="true"
						required
						title="文章密码"
						placeholder="请输入密码..."
						v-model="article.password"
					></tm-input>
					<view v-if="articleStatus.selectValue == 'INTIMATE'" class="pl-32 mt-12 mb-24 input-tips text-grey text-size-s">
						填写提示：文章状态为【私有】的时候需要填写密码。
					</view>
					<view class="mx-32 my-24 pb-24 border-b-1">
						<view class="text-size-m required flex-between">
							<text>选择分类</text>
							<tm-button size="xs" theme="light-blue" :fab="true" :shadow="0" icon="icon-plus" @click="catePoupShow = true">新增</tm-button>
						</view>
						<view>
							<tm-groupcheckbox name="categoryIds">
								<tm-checkbox :dense="true" :name="item.id" v-for="(item, index) in categories" :key="index" v-model="item.checked">
									<tm-button v-slot:default :flat="true" size="s" :theme="item.checked ? 'light-blue' : 'grey-lighten-4'" :plan="true">{{ item.name }}</tm-button>
								</tm-checkbox>
							</tm-groupcheckbox>
						</view>
					</view>

					<view class="mx-32 my-24 pb-24">
						<view class="text-size-m required flex-between">
							<text>选择标签</text>
							<tm-button size="xs" theme="light-blue" :fab="true" :shadow="0" icon="icon-plus" @click="tagPoupShow = true">新增</tm-button>
						</view>
						<view>
							<tm-groupcheckbox name="tagIds">
								<tm-checkbox :dense="true" :name="item.id" v-for="(item, index) in tags" :key="index" v-model="item.checked">
									<tm-button v-slot:default :flat="true" size="s" :theme="item.checked ? 'light-blue' : 'grey-lighten-4'" :plan="true">{{ item.name }}</tm-button>
								</tm-checkbox>
							</tm-groupcheckbox>
						</view>
					</view>
				</view>
				<!-- 高级设置 -->
				<view v-show="tab.activeIndex == 1" class="pt-6">
					<view class="mx-32 my-24 border-b-1  pb-24 flex-between">
						<text class="text-size-m ">禁止评论</text>
						<tm-switch v-model="article.disallowComment" color="light-blue" :text="['是', '否']"></tm-switch>
					</view>
					<view class="mx-32 my-24 border-b-1  pb-24 flex-between">
						<text class="text-size-m ">是否置顶</text>
						<tm-switch v-model="topPriority" color="light-blue" :text="['是', '否']"></tm-switch>
					</view>
					<tm-pickersDate
						@confirm="fnOnConfirmPublishTime"
						:default-value="createTime"
						:show-detail="{ year: true, month: true, day: true, hour: false, min: false, sec: false }"
					>
						<tm-input name="createTime" title="发表时间" placeholder="请选择发表时间" disabled :value="createTime" right-icon="icon-angle-right"></tm-input>
					</tm-pickersDate>
					<tm-input
						:vertical="true"
						:height="150"
						input-type="textarea"
						bg-color="grey-lighten-5"
						:maxlength="200"
						title=" 文章摘要"
						placeholder="如不填写，会从文章中自动截取"
						v-model="article.summary"
					></tm-input>
					<view class="ma-30 mt-12 pb-12">
						<view class="mb-12">
							<text class="text-size-m">封面图</text>
							<text class="text-grey text-size-s">（点击下方图片区域选择封面）</text>
						</view>
						<image v-if="article.showThumbnail" class="thumbnail round-3" :src="article.showThumbnail" mode="aspectFill" @click="attachmentsSelectShow = true"></image>
						<view v-else class="thumbnail round-3 text-grey grey-lighten-5 flex flex-col flex-center " @click="attachmentsSelectShow = true">
							<text class="iconfont icon-picture" style="font-size: 46rpx;"></text>
							<text class="mt-12 text-size-m">选择文章封面图</text>
						</view>
					</view>
				</view>
				<view v-show="tab.activeIndex == 2" class="pt-12">
					<tm-input
						:vertical="true"
						:height="150"
						input-type="textarea"
						bg-color="grey-lighten-5"
						:maxlength="200"
						title="自定义关键字"
						placeholder="多个关键词以英文逗号隔开，如不填写，将自动使用标签作为关键词"
						v-model="article.metaKeywords"
					></tm-input>
					<tm-input
						:vertical="true"
						:height="200"
						:borderBottom="false"
						input-type="textarea"
						bg-color="grey-lighten-5"
						:maxlength="200"
						title="自定义描述"
						placeholder="如不填写，会从文章中自动截取"
						v-model="article.metaDescription"
					></tm-input>
				</view>
			</tm-form>

			<!-- 操作区域 -->
			<view class="btn-bar flex flex-center bg-white">
				<tm-button theme="blue" :shadow="0" block :height="70" @click="fnOnSave(false, false)">立即保存</tm-button>
				<tm-button v-if="isEdit" theme="light-blue" :shadow="0" block :height="70" @click="fnOnSave(false, true)">保存并返回</tm-button>
				<!-- 	<block v-if="from == 'edit' && isEdit">
					<tm-button
						v-if="article.status == 'DRAFT' || article.status == 'INTIMATE' || article.status == 'RECYCLE'"
						theme="light-blue"
						:shadow="0"
						block
						:height="60"
						size="m"
						@click="fnOnChangeStatus('PUBLISHED')"
					>
						转为发布
					</tm-button>
					<tm-button
						v-if="article.status == 'PUBLISHED' || article.status == 'RECYCLE'"
						theme="red"
						:shadow="0"
						block
						:height="60"
						size="m"
						@click="fnOnChangeStatus('DRAFT')"
					>
						转为草稿
					</tm-button>
				</block>
				<block v-else-if="from == 'edit' && isEdit == false">
					<tm-button theme="light-blue" :shadow="0" block :height="60" size="m" @click="fnOnChangeCreateStatus('PUBLISHED')">立即发布</tm-button>
					<tm-button theme="red" :shadow="0" block :height="60" size="m" @click="fnOnChangeCreateStatus('DRAFT')">存为草稿</tm-button>
				</block>
				<block v-else>
					<tm-button
						v-if="article.status == 'DRAFT' || article.status == 'RECYCLE'"
						theme="light-blue"
						:shadow="0"
						block
						:height="60"
						size="m"
						@click="fnOnChangeStatus('PUBLISHED')"
					>
						转为发布
					</tm-button>
					<tm-button
						v-if="article.status == 'PUBLISHED' || article.status == 'RECYCLE'"
						theme="red"
						:shadow="0"
						block
						:height="60"
						size="m"
						@click="fnOnChangeStatus('DRAFT')"
					>
						转为草稿
					</tm-button>
				</block> -->

				<tm-button theme="blue-grey" :shadow="0" block :height="70" @click="fnOnBack()">{{ from == 'list' ? '返回列表' : '返回编辑' }}</tm-button>
			</view>
			<!-- 附件选择文件 -->
			<attachment-select selectType="image" v-if="attachmentsSelectShow" @on-select="fnOnAttachmentsSelect" @on-close="attachmentsSelectShow = false"></attachment-select>

			<!-- 新增分类 -->
			<tm-poup v-model="catePoupShow" position="bottom" @change="fnOnCatePoupChange" height="45vh">
				<view class="poup-content">
					<view class="poup-head text-align-center text-weight-b text-size-g ma-24">新增分类</view>
					<scroll-view class="poup-body pa-24 pt-0" style="height: 28vh;" :scroll-y="true" @touchmove.stop>
						<tm-input
							required
							:adjust-position="true"
							:round="3"
							:borderBottom="false"
							title="名称"
							bg-color="grey-lighten-5"
							v-model="cateForm.name"
							placeholder="请输入分类名称"
						></tm-input>
						<view class="pl-32 mb-24 input-tips text-grey text-size-s">填写提示：页面上所显示的名称</view>
						<tm-input
							:borderBottom="false"
							:adjust-position="true"
							:round="3"
							title="别名"
							bg-color="grey-lighten-5"
							v-model="cateForm.slug"
							placeholder="请输入分类别名"
						></tm-input>
						<view class="pl-32 mb-24 input-tips text-grey text-size-s">填写提示：一般为单个分类页面的标识，最好为英文</view>
						<!-- <tm-input
							:borderBottom="false"
							:adjust-position="true"
							:round="3"
							title="密码"
							bg-color="grey-lighten-5"
							v-model="cateForm.password"
							placeholder="请输入分类密码"
						></tm-input>
						<view class="pl-32 mb-24 input-tips text-grey text-size-s">填写提示：分类的访问密码</view>
						<tm-input
							:borderBottom="false"
							:vertical="true"
							:adjust-position="true"
							inputType="textarea"
							:round="3"
							title="描述"
							:height="160"
							bg-color="grey-lighten-5"
							v-model="cateForm.description"
							placeholder="请输入分类描述"
						></tm-input>
						<view class="pl-32 mb-24 input-tips text-grey text-size-s">填写提示：分类的描述信息</view> -->
					</scroll-view>

					<view class="btn-wrap flex flex-center">
						<tm-button size="m" theme="bg-gradient-blue-accent" @click="fnOnCateSave()">保 存</tm-button>
						<tm-button size="m" theme="bg-gradient-blue-grey-accent" @click="fnOnCatePoupHide()">关 闭</tm-button>
					</view>
				</view>
			</tm-poup>

			<!-- 新增标签 -->
			<tm-poup v-model="tagPoupShow" position="bottom" @change="fnOnTagPoupChange" height="45vh">
				<view class="poup-content">
					<view class="poup-head text-align-center text-weight-b text-size-g ma-24">新增标签</view>
					<scroll-view class="poup-body pa-24 pt-0" style="height: 28vh;" :scroll-y="true" @touchmove.stop>
						<tm-input
							required
							:adjust-position="true"
							:round="3"
							:borderBottom="false"
							title="标签名称"
							bg-color="grey-lighten-5"
							v-model="tagForm.name"
							placeholder="请输入标签名称"
						></tm-input>
						<view class="pl-32 mb-24 input-tips text-grey text-size-s">填写提示：页面上所显示的名称</view>
						<tm-input
							:borderBottom="false"
							:adjust-position="true"
							:round="3"
							title="标签别名"
							bg-color="grey-lighten-5"
							v-model="tagForm.slug"
							placeholder="请输入分类别名"
						></tm-input>
						<view class="pl-32 mb-24 input-tips text-grey text-size-s">填写提示：一般为单个标签页面的标识，最好为英文</view>
					</scroll-view>
					<view class="btn-wrap flex flex-center">
						<tm-button size="m" theme="bg-gradient-blue-accent" @click="fnOnTagSave()">保 存</tm-button>
						<tm-button size="m" theme="bg-gradient-blue-grey-accent" @click="fnOnTagPoupHide()">关 闭</tm-button>
					</view>
				</view>
			</tm-poup>
		</view>
	</view>
</template>

<script>
import { getAdminAccessToken } from '@/utils/auth.js';

import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
import tmTabs from '@/tm-vuetify/components/tm-tabs/tm-tabs.vue';
import tmForm from '@/tm-vuetify/components/tm-form/tm-form.vue';
import tmGroupcheckbox from '@/tm-vuetify/components/tm-groupcheckbox/tm-groupcheckbox.vue';
import tmCheckbox from '@/tm-vuetify/components/tm-checkbox/tm-checkbox.vue';
import tmPickers from '@/tm-vuetify/components/tm-pickers/tm-pickers.vue';
import tmInput from '@/tm-vuetify/components/tm-input/tm-input.vue';
import tmPickersDate from '@/tm-vuetify/components/tm-pickersDate/tm-pickersDate.vue';
import tmPoup from '@/tm-vuetify/components/tm-poup/tm-poup.vue';
import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
import tmSwitch from '@/tm-vuetify/components/tm-switch/tm-switch.vue';

import AttachmentSelect from '@/components/attachment-select/attachment-select.vue';

export default {
	components: {
		tmButton,
		tmTabs,
		tmForm,
		tmGroupcheckbox,
		tmCheckbox,
		tmPickers,
		tmInput,
		tmPickersDate,
		tmPoup,
		tmSkeleton,
		tmEmpty,
		tmSwitch,
		AttachmentSelect
	},
	data() {
		return {
			isBlackTheme: false,
			loading: 'loading',
			uploadAvatarShow: false,
			attachmentsSelectShow: false,
			postsId: undefined,
			postTitle: undefined,
			createTime: undefined,
			isEdit: true,
			from: 'list',
			topPriority: false,
			sfList: [{ title: '是', checked: null }, { title: '否', checked: null }],
			tab: {
				activeIndex: 0,
				list: ['常规', '高级', 'SEO']
			},
			article: {
				title: '',
				slug: '',
				status: '',
				content: '',
				keepRaw: true,
				topPriority: 0,
				summary: '',
				password: '',
				originalContent: '',
				metaDescription: '',
				formatContent: '',
				editorType: 'MARKDOWN',
				createTime: '',
				categoryIds: [],
				tagIds: []
			},
			articleStatus: {
				list: [{ name: '发布', value: 'PUBLISHED' }, { name: '私有', value: 'INTIMATE' }, { name: '草稿', value: 'DRAFT' }, { name: '回收站', value: 'RECYCLE' }],
				status: ['PUBLISHED'],
				selectText: '发布',
				selectValue: 'PUBLISHED'
			},
			// 分类
			categories: [],
			catePoupShow: false,
			cateForm: {
				name: undefined,
				slug: undefined,
				password: undefined,
				description: undefined
			},
			// 标签
			tags: [],
			tagPoupShow: false,
			tagForm: {
				name: undefined,
				slug: undefined
			}
		};
	},
	onLoad(e) {
		const postsId = this.$Route.query.postsId;
		const postTitle = this.$Route.query.postTitle;
		const isEdit = this.$Route.query.isEdit;
		const from = this.$Route.query.from;
		this.postsId = postsId;
		this.postTitle = postTitle || '';
		this.isEdit = isEdit == 1 ? true : false;
		this.from = from;
		this.createTime = uni.$tm.dayjs(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
		this.fnGetSettings();
	},
	onPullDownRefresh() {
		if (this.isEdit == false) {
			uni.stopPullDownRefresh();
			return;
		}
		this.fnGetSettings();
	},
	methods: {
		fnOnCatePoupChange(e) {
			if (!e) {
				this.fnResetCateForm();
			}
		},
		fnResetCateForm() {
			this.cateForm = {
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
		fnOnCatePoupHide() {
			this.catePoupShow = false;
			this.fnResetCateForm();
		},
		fnOnCateSave() {
			if (this.cateForm.name.trim() == '') {
				return uni.$tm.toast('分类名称未填写！');
			}
			this.$httpApi.admin
				.createCategory(this.cateForm)
				.then(res => {
					if (res.status == 200) {
						uni.$tm.toast(`保存成功！`);
						this.fnResetCateForm();
						// 将数据填充到列表
						this.categories.push({
							id: res.data.id,
							name: res.data.name,
							checked: false
						});
					} else {
						uni.$tm.toast('添加成功！');
					}
				})
				.catch(err => {
					uni.$tm.toast('添加失败，请重试！');
				});
		},
		fnOnTagPoupChange(e) {
			if (!e) {
				this.fnResetTagForm();
			}
		},
		fnResetTagForm() {
			this.tagForm = {
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
		fnOnTagPoupHide() {
			this.tagPoupShow = false;
			this.fnResetTagForm();
		},
		fnOnTagSave() {
			if (this.tagForm.name.trim() == '') {
				return uni.$tm.toast('标签名称未填写！');
			}
			this.$httpApi.admin
				.createTags(this.tagForm)
				.then(res => {
					if (res.status == 200) {
						uni.$tm.toast(`保存成功！`);
						this.fnResetTagForm();
						// 将数据填充到列表
						this.tags.push({
							id: res.data.id,
							name: res.data.name,
							checked: false
						});
					} else {
						uni.$tm.toast('添加成功！');
					}
				})
				.catch(err => {
					uni.$tm.toast('添加失败，请重试！');
				});
		},
		fnOnArticleStatusConfirm(e) {
			const status = e[0].data;
			this.articleStatus.status = [status.value];
			this.articleStatus.selectText = status.name;
			this.articleStatus.selectValue = status.value;
		},
		// 获取文章的设置
		fnGetSettings() {
			// this.loading = 'loading';
			this.loading = 'success';
			const _post = this.isEdit ? this.$httpApi.admin.getPostsById(this.postsId) : Promise.resolve();
			const _cate = this.$httpApi.admin.getCategoryList({ more: true });
			const _tags = this.$httpApi.admin.getTagsList({ more: true });

			const _apis = Promise.all([_post, _cate, _tags]);
			uni.showLoading({
				title: '加载中，请稍等...',
				mask: true
			});
			_apis
				.then(res => {
					if (this.isEdit) {
						const _postRes = res[0];
						this.article = _postRes.data;
						// 设置文章状态
						let _articleStatus = this.articleStatus.list.find(x => x.value == this.article.status);
						if (_articleStatus) {
							this.articleStatus.status = [_articleStatus.value];
							this.articleStatus.selectText = _articleStatus.name;
							this.articleStatus.selectValue = _articleStatus.value;
						}
						this.topPriority = this.article.topPriority == 0 ? false : true;
						if (this.article.thumbnail) {
							this.$set(this.article, 'showThumbnail', this.$utils.checkThumbnailUrl(this.article.thumbnail));
						}
						this.createTime = uni.$tm.dayjs(new Date(this.article.createTime).getTime()).format('YYYY-MM-DD HH:mm:ss');
						if (this.postTitle) {
							this.$set(this.article, 'title', this.postTitle);
						}
					}
					const _cateRes = res[1];
					let _tempCategories = _cateRes.data.map((item, index) => {
						let _isCateCheck = false;
						if (this.isEdit) {
							_isCateCheck = this.article.categoryIds.some(x => x == item.id);
						}
						return {
							index: _isCateCheck ? 0 : index + 1,
							id: item.id,
							name: item.name,
							checked: _isCateCheck
						};
					});
					if (this.isEdit) {
						this.categories = _tempCategories.sort((a, b) => a.index - b.index);
					} else {
						this.categories = _tempCategories;
					}
					const _tagRes = res[2];
					let _tempTags = _tagRes.data.map((item, index) => {
						let _isTagCheck = false;
						if (this.isEdit) {
							_isTagCheck = this.article.tagIds.some(x => x == item.id);
						}
						return {
							index: _isTagCheck ? 0 : index + 1,
							id: item.id,
							name: item.name,
							checked: _isTagCheck
						};
					});
					if (this.isEdit) {
						this.tags = _tempTags.sort((a, b) => a.index - b.index);
					} else {
						this.tags = _tempTags;
					}
					this.loading = 'success';
					uni.hideLoading();
				})
				.catch(err => {
					this.$tm.toast('数据加载失败，请重试！');
					this.loading = 'error';
				})
				.finally(() => {
					uni.stopPullDownRefresh();
				});
		},

		// 监听附件选择
		fnOnAttachmentsSelect(file) {
			this.article.thumbnail = file.path;
			this.$set(this.article, 'showThumbnail', this.$utils.checkThumbnailUrl(file.path));
			this.attachmentsSelectShow = false;
		},
		fnOnConfirmPublishTime(e) {
			this.createTime = `${e.year}-${e.month}-${e.day} 00:00:00`;
			this.article.createTime = new Date(`${e.year}-${e.month}-${e.day}`).getTime();
		},
		// 修改文章的状态
		fnOnChangeStatus(status) {
			if (this.article.status == 'INTIMATE') {
				this.article['password'] = '';
			}
			this.article.status = status;
			this.fnOnSave(true);
		},
		fnOnChangeCreateStatus(status) {
			this.article.status = status;
			this.fnOnSave();
		},
		// 保存文章设置
		fnOnSave(isChangeStatus = false, isBack = true) {
			// 校验数据
			if (!this.article.title) {
				return uni.$tm.toast('请输入文章标题！');
			}
			if (!this.article.slug) {
				return uni.$tm.toast('请输入文章别名！');
			}
			if (this.articleStatus.selectValue == 'INTIMATE' && !this.article.password) {
				return uni.$tm.toast('文章私有状态，缺少密码！');
			}

			uni.showLoading({
				title: '保存中...',
				mask: true
			});
			// 设置文章内容
			if (this.from == 'edit') {
				this.article.content = uni.getStorageSync('posts-content');
				this.article.formatContent = uni.getStorageSync('posts-content');
				this.article.originalContent = uni.getStorageSync('posts-content-source');
			}
			if (this.articleStatus.selectValue != 'INTIMATE') {
				this.article.password = '';
			}
			this.article.status = this.articleStatus.selectValue;
			this.article.topPriority = this.topPriority ? 1 : 0;
			this.article.tagIds = this.tags.filter(item => item.checked == true).map(item => item.id);
			this.article.categoryIds = this.categories.filter(item => item.checked == true).map(item => item.id);

			if (this.isEdit) {
				this.$httpApi.admin
					.updatePostsById(this.postsId, this.article)
					.then(res => {
						if (res.status == 200) {
							this.$tm.toast('保存成功！');
							uni.setStorageSync('posts-html-edit', '');
							uni.setStorageSync('posts-content', '');
							uni.setStorageSync('posts-content-source', '');
							setTimeout(() => {
								if (isBack) {
									uni.navigateBack({
										delta: 1
									});
								}
								// uni.$emit('refresh-article-list');
							}, 1000);
						} else {
							uni.$tm.toast('保存失败，请重试!');
							if (isChangeStatus) {
								this.article.status = this.article.status == 'DRAFT' ? 'PUBLISHED' : 'DRAFT';
							}
						}
					})
					.catch(err => {
						uni.$tm.toast(`保存失败，${err.message}!`);
						if (isChangeStatus) {
							this.article.status = this.article.status == 'DRAFT' ? 'PUBLISHED' : 'DRAFT';
						}
					});
			} else {
				this.$httpApi.admin
					.createPosts(this.article)
					.then(res => {
						if (res.status == 200) {
							uni.$tm.toast('发布成功!');
							uni.setStorageSync('posts-html-edit', '');
							uni.setStorageSync('posts-content', '');
							uni.setStorageSync('posts-content-source', '');
							setTimeout(() => {
								uni.navigateBack({
									delta: 2
								});
								uni.$emit('refresh-article-list');
							}, 1000);
						} else {
							uni.$tm.toast('发布失败，请重试!');
						}
					})
					.catch(err => {
						uni.$tm.toast(`发布失败：${err.message}`);
					});
			}
		},
		fnOnBack() {
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
				})
				.catch(err => {});
		}
	}
};
</script>

<style scoped lang="scss">
.app-page {
	padding-bottom: 110rpx;
	.app-page-content {
		min-height: calc(100vh - 340rpx);
		box-shadow: 0rpx 0rpx 24rpx rgba(0, 0, 0, 0.03);
	}
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
	.thumbnail {
		width: 100%;
		height: 260rpx;
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
.poup-content {
	overflow: hidden;
}
.poup-body {
	height: 60vh;
	box-sizing: border-box;
	touch-action: none;
}
</style>
