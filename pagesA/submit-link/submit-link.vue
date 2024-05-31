<template>
	<tm-fullView>
		<view class="ma-32"><tm-coupon :hdata="d_3" color="blue" @click="blogDetailPoupShow=true"></tm-coupon></view>
		<view class="pb-50">
			<tm-form @submit="fnOnSubmit">
				<tm-sheet color="blue" :shadow="24">
					<view class="text-size-s text-weight-b mb-24">友链信息提交</view>
					<tm-sheet :margin="[0,0]" :padding="[0,0]" classname="overflow" :shadow="24">
						<tm-input name="displayName" required title="名称" v-model="form.displayName" placeholder="请输入网站名称" align="right"></tm-input>
						<tm-input name="url" required title="网址" v-model="form.url" placeholder="请输入网站地址" align="right"></tm-input>
            <tm-input name="logo" required title="Logo" v-model="form.logo" placeholder="请输入网站Logo" align="right"></tm-input>
            <tm-input name="email" required title="邮箱" v-model="form.email" placeholder="请输入邮箱" align="right"></tm-input>
						<tm-input name="linkPageUrl" title="友链页面" v-model="form.linkPageUrl" placeholder="请输入友链页面地址" align="right"></tm-input>
            <view class="py-12 px-24 mx-12 round-3 border-b-1 grey text">
              <text class="text-grey text-size-xs px-10">
                <tm-helpTips color="bg-gradient-blue-lighten-b"
                             :show="true" direction="bottom" tip-direction="left"
                             label="展示本站链接的页面地址，用于校验是否添加本站友链" ment-direction="left">
                  <tm-icons :fllowTheme="true" name="icon-question-circle"></tm-icons>
                </tm-helpTips>
                （贵站友情链接页面地址，即包含本站链接也页面）
              </text>
            </view>
            <tm-input name="rssUrl" title="RSS地址" v-model="form.rssUrl" placeholder="请输入RSS地址" align="right"></tm-input>
            <view class="py-12 px-24 mx-12 round-3 border-b-1 grey text">
              <text class="text-grey text-size-xs px-10">
                <tm-helpTips color="bg-gradient-blue-lighten-b"
                             :show="true" direction="bottom" tip-direction="left"
                             label="用于抓取文章" ment-direction="left">
                  <tm-icons :fllowTheme="true" name="icon-question-circle"></tm-icons>
                </tm-helpTips>
                （用于抓取文章）
              </text>
            </view>
						<tm-input name="description" :border-bottom="false" :vertical="true" required :height="100"
							input-type="textarea" bg-color="grey-lighten-5" :maxlength="30" title="网站描述"
							placeholder="请输入网站描述,不超过30字符" v-model="form.description"></tm-input>
						<view class="px-24">
							<tm-button navtie-type="form" theme="bg-gradient-blue-accent" block>提交数据</tm-button>
							<view class="py-32 text-size-s text-grey text-align-center">友链申请</view>
						</view>
					</tm-sheet>
				</tm-sheet>
			</tm-form>

			<tm-poup v-model="blogDetailPoupShow" :width="640" height="auto" position="center" :round="6">
				<view class="poup pa-36">
					<view class="info flex">
						<view class="poup-logo bg-gradient-amber-accent pa-4 shadow-24">
							<image class="poup-logo_img" :src="blogDetail.logo" mode="aspectFill"></image>
						</view>
						<view class="pl-24 info-detail">
							<view class="poup-name text-size-lg text-weight-b">{{ blogDetail.name }}</view>
							<view class="poup-tag ml--10">
								<tm-tags color="bg-gradient-amber-accent" size="n"
									model="fill">{{ blogDetail.description }}</tm-tags>
							</view>
							<view class="poup-link text-size-m" @click="fnCopyLink(blogDetail.url)">
								<text class="text-orange">点击复制友链交换信息</text>
								<text class="iconfont icon-copy text-size-s ml-6 text-grey"></text>
							</view>
						</view>
					</view>

					<view class="poup-desc mt-20">
						<text>{{ blogDetail.content}}</text>
					</view>

					<!-- 博客预览图 -->
					<view class="mt-24"><tm-images :width="568" :round="2" :src="caclSiteThumbnail(blogDetail.url)"
							mode="aspectFill"></tm-images></view>
				</view>
			</tm-poup>
		</view>
	</tm-fullView>


</template>

<script>
	import tmFullView from "@/tm-vuetify/components/tm-fullView/tm-fullView.vue"
	import tmMenubars from "@/tm-vuetify/components/tm-menubars/tm-menubars.vue"
	import tmSheet from "@/tm-vuetify/components/tm-sheet/tm-sheet.vue"
	import tmForm from "@/tm-vuetify/components/tm-form/tm-form.vue"
	import tmActionSheet from "@/tm-vuetify/components/tm-actionSheet/tm-actionSheet.vue"
	import tmButton from "@/tm-vuetify/components/tm-button/tm-button.vue"
	import tmInput from "@/tm-vuetify/components/tm-input/tm-input.vue"
	import tmHelpTips from "@/tm-vuetify/components/tm-helpTips/tm-helpTips.vue"
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	import tmPoup from '@/tm-vuetify/components/tm-poup/tm-poup.vue'
	import tmImages from '@/tm-vuetify/components/tm-images/tm-images.vue'
	import tmTags from '@/tm-vuetify/components/tm-tags/tm-tags.vue'
	import tmCoupon from '@/tm-vuetify/components/tm-coupon/tm-coupon.vue'
	export default {
		components: {
			tmFullView,
			tmSheet,
			tmMenubars,
			tmForm,
			tmActionSheet,
			tmButton,
			tmInput,
			tmHelpTips,
			tmIcons,
			tmPoup,
			tmImages,
			tmTags,
			tmCoupon
		},
		data() {
			return {
				blogDetailPoupShow: false,
				blogDetail: {
					name: "柳意梧情博客",
					url: "https://lywq.muyin.site",
					logo: "https://lywq.muyin.site/logo.png",
					description: "心在哪里收获就在哪里",
					content: "博客名称：柳意梧情博客 \n博客地址：https://lywq.muyin.site \n博客logo：https://lywq.muyin.site/logo \n博客简介：柳意梧情博客-心在哪里收获就在哪里"
				},
				form: {
					url: '', // 网址
					name: '', // 名称
					logo: '', // Logo
					linkPageUrl: '', // 友链页面
					team: '自助提交', // 分组
					description: '' // 描述
				},
				d_3: {
					img: 'https://lywq.muyin.site/logo.png',
					title: '柳意梧情博客',
					time: '心在哪里收获就在哪里',
					btnText: '友链详情'
				}
			};
		},
		computed: {
			caclSiteThumbnail(val) {
				return val => {
					if (!val) return '';
					if (val.charAt(val.length - 1) != '/') {
						val = val + '/';
					}
					return 'https://image.thum.io/get/width/1000/crop/800/' + val;
				};
			}

		},
		onLoad() {
			this.fnSetPageTitle('友链申请');
		},
		methods: {
			fnOnSubmit(e) {
				if (e === false) {
					return uni.$tm.toast('请检查所有的必填项是否填写完整！');
				}
				if (this.form.url && !uni.$tm.test.url(this.form.url)) {
					return uni.$tm.toast('请输入正确的网站地址！');
				}
        if (this.form.logo && !uni.$tm.test.url(this.form.logo)) {
          return uni.$tm.toast('请输入正确的Logo地址！');
        }
        if (this.form.email && !uni.$tm.test.email(this.form.email)) {
          return uni.$tm.toast('请输入正确的邮箱地址！');
        }
        if (this.form.linkPageUrl && !uni.$tm.test.url(this.form.linkPageUrl)) {
          return uni.$tm.toast('请输入正确的友链页面地址！');
        }
        if (this.form.rssUrl && !uni.$tm.test.url(this.form.rssUrl)) {
          return uni.$tm.toast('请输入正确的RSS地址！');
        }
				this.fnHandle();
			},
			fnHandle() {
				uni.showLoading({
					title: '正在提交...'
				});
        this.$httpApi.v2.submitLink(this.form)
					.then(res => {
						if (res.code == 200) {
							uni.$tm.toast('友链提交成功！');
							setTimeout(() => {
								uni.navigateTo({
									url: '/pagesA/friend-links/friend-links',
									success() {
										let page = getCurrentPages().pop(); //跳转页面成功之后
										if (!page) return;
										page.onLoad(); //如果页面存在，则重新刷新页面
									}
								});
							}, 1000);
						} else {
							uni.$tm.toast('操作失败，请重试！');
						}
					})
					.catch(err => {
						uni.$tm.toast(err.msg);
					});
			},
			fnCopyLink() {
				uni.setClipboardData({
					data: this.blogDetail.content,
					showToast: false,
					success: () => {
						uni.showToast({
							icon: 'none',
							title: '复制成功！'
						});
					},
					fail: () => {
						uni.showToast({
							icon: 'none',
							title: '复制失败！'
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.poup-logo {
		width: 140rpx;
		height: 140rpx;
		border-radius: 50%;

		&_img {
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
	}

	.poup-desc {
		font-size: 28rpx;
		line-height: 1.6;
		color: #555 !important;
	}

	.info-detail {
		width: 0;
		flex-grow: 1;
		justify-content: center;
	}

	pre {
		//方法一：保留空白符序列，但是正常地进行换行。
		white-space: pre-wrap;
		//方法二：添加横向滚动条
		overflow-x: auto;
	}
</style>