<template>
    <tm-fullView>
        <view class="ma-32">
            <tm-coupon :hdata="calcBlogCoupon" color="blue" @click="blogDetailPoupShow=true"></tm-coupon>
        </view>
        <view class="pb-50">
            <tm-form @submit="fnOnSubmit">
                <tm-sheet :shadow="24" color="blue">
                    <view class="text-size-s text-weight-b mb-24">友链信息提交</view>
                    <tm-sheet :margin="[0,0]" :padding="[0,0]" :shadow="24" classname="overflow">
                        <tm-input v-model="form.displayName" align="right" name="displayName" placeholder="请输入网站名称"
                                  required title="名称"></tm-input>
                        <tm-input v-model="form.url" align="right" name="url" placeholder="请输入网站地址" required
                                  title="网址"></tm-input>
                        <tm-input v-model="form.logo" align="right" name="logo" placeholder="请输入网站Logo" required
                                  title="Logo"></tm-input>
                        <tm-input v-model="form.email" align="right" name="email" placeholder="请输入邮箱" required
                                  title="邮箱"></tm-input>
                        <tm-input v-model="form.linkPageUrl" align="right" name="linkPageUrl" placeholder="请输入友链页面地址"
                                  title="友链页面"></tm-input>
                        <view class="py-12 px-24 mx-12 round-3 border-b-1 grey text">
                            <text class="text-grey text-size-xs px-10">
                                <tm-helpTips :show="true" color="bg-gradient-blue-lighten-b" direction="bottom"
                                             label="展示本站链接的页面地址，用于校验是否添加本站友链" ment-direction="left" tip-direction="left">
                                    <tm-icons :fllowTheme="true" name="icon-question-circle"></tm-icons>
                                </tm-helpTips>
                                （贵站友情链接页面地址，即包含本站链接也页面）
                            </text>
                        </view>
                        <tm-input v-model="form.rssUrl" align="right" name="rssUrl" placeholder="请输入RSS地址"
                                  title="RSS地址"></tm-input>
                        <view class="py-12 px-24 mx-12 round-3 border-b-1 grey text">
                            <text class="text-grey text-size-xs px-10">
                                <tm-helpTips :show="true" color="bg-gradient-blue-lighten-b" direction="bottom"
                                             label="用于抓取文章" ment-direction="left" tip-direction="left">
                                    <tm-icons :fllowTheme="true" name="icon-question-circle"></tm-icons>
                                </tm-helpTips>
                                （用于抓取文章）
                            </text>
                        </view>
                        <tm-input v-model="form.description" :border-bottom="false" :height="100" :maxlength="30"
                                  :vertical="true" bg-color="grey-lighten-5" input-type="textarea" name="description"
                                  placeholder="请输入网站描述,不超过30字符" required title="网站描述"></tm-input>
                        <view class="px-24">
                            <tm-button block navtie-type="form" theme="bg-gradient-blue-accent">提交数据</tm-button>
                            <view class="py-32 text-size-s text-grey text-align-center">友链申请</view>
                        </view>
                    </tm-sheet>
                </tm-sheet>
            </tm-form>

            <tm-poup v-model="blogDetailPoupShow" :round="6" :width="640" height="auto" position="center">
                <view class="poup pa-36" scroll-y="auto">
                    <view class="info flex">
                        <view class="poup-logo pa-4 shadow-24">
                            <image :src="blogDetail.blogLogo" class="poup-logo_img" mode="aspectFill"></image>
                        </view>
                        <view class="pl-24 info-detail">
                            <view class="poup-name text-size-lg text-weight-b">{{ blogDetail.blogName }}</view>
                            <view class="poup-tag ml--10 text-size-n mt-10 text-grey">
                                {{ blogDetail.blogDesc }}
                            </view>
                        </view>
                    </view>

                    <view class="poup-desc">
                        <text>{{ calcBlogContent }}</text>
                    </view>

                    <!-- 博客预览图 -->
                    <view class="mt-24">
                        <tm-images :round="2" :src="calcSiteThumbnail(blogDetail.blogUrl)" :width="568"
                                   mode="aspectFill"></tm-images>
                    </view>
                </view>
                <view class="poup-link flex flex-center mb-24">
                    <tm-button theme="light-blue" size="n" @click="fnCopyLink(blogDetail.blogUrl)">复制友链交换信息</tm-button>
                    <tm-button text theme="white" @click="blogDetailPoupShow = false">关闭</tm-button>
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
            form: {
                url: '', // 网址
                name: '', // 名称
                logo: '', // Logo
                linkPageUrl: '', // 友链页面
                team: '自助提交', // 分组
                description: '' // 描述
            }
        };
    },
    computed: {
        haloPluginConfigs(){
            return this.$tm.vx.getters().getConfigs.pluginConfig;
        },
        blogDetail() {
            return this.haloPluginConfigs.submitLink;
        },
        calcSiteThumbnail(val) {
            return val => {
                if (!val) return '';
                if (val.charAt(val.length - 1) !== '/') {
                    val = val + '/';
                }
                return 'https://image.thum.io/get/width/1000/crop/800/' + val;
            };
        },
        calcBlogContent() {
            return `
				   博客名称：${this.blogDetail.blogName}
				   博客地址：${this.blogDetail.blogUrl}
				   博客logo：${this.blogDetail.blogLogo}
				   博客简介：${this.blogDetail.blogDesc}
				`
        },
        calcBlogCoupon() {
            return {
                img: this.blogDetail.blogLogo,
                title: this.blogDetail.blogName,
                time: this.blogDetail.blogDesc,
                btnText: '友链详情'
            }
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
                    if (res.code === 200) {
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
                data: this.calcBlogContent,
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
    border-radius: 24rpx;
    overflow: hidden;

    &_img {
        width: 100%;
        height: 100%;
    }
}

.poup-desc {
    margin-top: -20rpx;
    font-size: 28rpx;
    line-height: 1.8;
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
