<template>
    <view class="app-page">
        <view v-if="loading !== 'success'" class="loading-wrap">
            <tm-skeleton model="card"></tm-skeleton>
            <tm-skeleton model="card"></tm-skeleton>
            <tm-skeleton model="card"></tm-skeleton>
        </view>
        <block v-else>
            <!-- 顶部信息 -->
            <view class="head ma-24">
                <view class="title">{{ result.spec.title }}</view>
                <view class="detail">
                    <view class="author">
                        <text class="author-name">作者：{{ result.owner.displayName }}</text>
                        <text class="author-time">
                            时间：{{ {d: result.spec.publishTime, f: 'yyyy年MM月dd日 星期w'} | formatTime }}
                        </text>
                    </view>

                    <view class="cover" v-if="result.spec.cover">
                        <image class="cover-img" mode="aspectFill" :src="calcUrl(result.spec.cover)"></image>
                    </view>
                    <view class="count" :class="{ 'no-thumbnail': !result.spec.cover }">
                        <view class="count-item">
                            <text class="value">{{ result.stats.visit }}</text>
                            <text class="label">阅读</text>
                        </view>
                        <view class="count-item">
                            <text class="value">{{ result.stats.upvote }}</text>
                            <text class="label">喜欢</text>
                        </view>
                        <view v-if="postDetailConfig && postDetailConfig.showComment" class="count-item">
                            <text class="value">{{ result.stats.comment }}</text>
                            <text class="label">评论</text>
                        </view>
                        <view class="count-item">
                            <text class="value">{{ result.content.raw.length }}</text>
                            <text class="label">字数</text>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 分类 -->
            <view class="category">
                <view class="category-type">
                    <text class="text-weight-b">分类：</text>
                    <text v-if="result.categories.length === 0" class="category-tag is-empty">未选择分类</text>
                    <block v-else>
                        <text class="category-tag" v-for="(item, index) in result.categories" :key="index"
                              @click="fnToCate(item)">
                            {{ item.spec.displayName }}
                        </text>
                    </block>
                </view>
                <view class="mt-18 category-type">
                    <text class="text-weight-b">标签：</text>
                    <text v-if="result.tags.length === 0" class="category-tag is-empty">未选择标签</text>
                    <block v-else>
                        <text class="category-tag" :style="{ backgroundColor: item.color }"
                              v-for="(item, index) in result.tags" :key="index" @click="fnToTag(item)">
                            {{ item.spec.displayName }}
                        </text>
                    </block>
                </view>
                <view v-if="originalURL" class="mt-18 category-type original-url">
                    <view class="original-url_left text-weight-b">原文：</view>
                    <view class="original-url_right text-grey">
                        <text class="original-url_right__link" @click.stop="fnToOriginal(originalURL)">{{ originalURL }}
                        </text>
                        <text class="original-url_right__btn" @click.stop="fnToOriginal(originalURL)">阅读原文
                            <text class="iconfont icon-angle-right ml-5 text-size-s"></text>
                        </text>
                    </view>
                </view>
            </view>
            <!-- 内容区域 -->
            <view class="content ml-24 mr-24">
                <!-- markdown渲染 -->
                <view class="markdown-wrap">
                  <view v-if="checkPostRestrictRead(result)">
                    <view v-if="showContentArr.length == 0">
                      <restrict-read-skeleton
                          :loading="true"
                          :lines="3"
                          :tip-text="`此处内容已隐藏，「${getRestrictReadTypeName(result)}可见」`"
                          button-text="查看更多"
                          button-color="#1890ff"
                          skeleton-color="#f0f0f0"
                          skeleton-highlight="#e0e0e0"
                          animation-duration="2"
                          @refresh="readMore"
                      />
                    </view>
                    <view v-else v-for="showContent in showContentArr">
                      <mp-html class="evan-markdown" lazy-load :domain="markdownConfig.domain"
                               :loading-img="markdownConfig.loadingGif" :scroll-table="true" :selectable="true"
                               :tag-style="markdownConfig.tagStyle" :container-style="markdownConfig.containStyle"
                               :content="showContent" :markdown="true" :showLineNumber="true" :showLanguageName="true"
                               :copyByLongPress="true"/>
                      <restrict-read-skeleton
                          :loading="true"
                          :lines="3"
                          :tip-text="`此处内容已隐藏，「${getRestrictReadTypeName(result)}可见」`"
                          button-text="查看更多"
                          button-color="#1890ff"
                          skeleton-color="#f0f0f0"
                          skeleton-highlight="#e0e0e0"
                          animation-duration="2"
                          @refresh="readMore"
                      />
                    </view>
                  </view>
                  <view v-else>
                    <mp-html class="evan-markdown" lazy-load :domain="markdownConfig.domain"
                             :loading-img="markdownConfig.loadingGif" :scroll-table="true" :selectable="true"
                             :tag-style="markdownConfig.tagStyle" :container-style="markdownConfig.containStyle"
                             :content="result.content.raw" :markdown="true" :showLineNumber="true" :showLanguageName="true"
                             :copyByLongPress="true"/>
                  </view>
                </view>

                <!-- 版权声明 -->
                <view v-if="postDetailConfig && postDetailConfig.copyrightEnabled"
                      class="copyright-wrap bg-white mt-24 pa-24 round-4">
                    <view class="copyright-title text-weight-b">版权声明</view>
                    <view
                        class="copyright-content mt-12  grey-lighten-5 text-grey-darken-2 round-4 pt-12 pb-12 pl-24 pr-24 ">
                        <view v-if="postDetailConfig.copyrightAuthor" class="copyright-text text-size-s ">
                            版权归属：{{ postDetailConfig.copyrightAuthor }}
                        </view>
                        <view v-if="postDetailConfig.copyrightDesc" class="copyright-text text-size-s mt-12">
                            版权说明：{{ postDetailConfig.copyrightDesc }}
                        </view>
                        <view v-if="postDetailConfig.copyrightViolation"
                              class="copyright-text text-size-s mt-12 text-red">
                            侵权处理：{{ postDetailConfig.copyrightViolation }}
                        </view>
                    </view>
                </view>

                <!-- 评论展示区域 -->
                <block v-if="postDetailConfig && postDetailConfig.showComment">
                    <view v-if="result" id="CommentList" class="comment-wrap bg-white mt-24 pa-24 round-4">
                        <commentList ref="commentListRef" :disallowComment="!result.spec.allowComment"
                                     :postName="result.metadata.name" :post="result" @on-comment="fnOnComment"
                                     @on-comment-detail="fnOnShowCommentDetail" @on-loaded="fnOnCommentLoaded">
                        </commentList>
                    </view>
                </block>
            </view>

            <!-- 弹幕效果 -->
            <barrage ref="barrage" :maxTop="240" :type="globalAppSettings.barrage.type"></barrage>
            <!-- 返回顶部 -->
            <tm-flotbutton :offset="[16, 80]" icon="icon-angle-up" color="bg-gradient-light-blue-accent"
                           @click="fnToTopPage()"></tm-flotbutton>
            <tm-flotbutton :actions="flotButtonActions" :click-actions-hiden="false" actions-pos="left"
                           :show-text="true" color="bg-gradient-orange-accent" @change="fnOnFlotButtonChange"></tm-flotbutton>
        </block>

        <!-- 评论详情 -->
        <tm-poup v-model="commentDetail.show" height="auto" :round="6" :over-close="true" position="bottom">
            <view v-if="commentDetail.show && result" class="pa-24">
                <view class="poup-head pb-24">
                    <view class="poup-title text-align-center text-size-g text-weight-b mb-32">评论详情</view>
                    <comment-item :useContentBg="false" :useActions="false" :isChild="false"
                                  :comment="commentDetail.comment" :postName="result.metadata.name"></comment-item>
                </view>

                <scroll-view :scroll-y="true" class="poup-body">
                    <view v-if="commentDetail.loading !== 'success'" class="poup-loading-wrap flex flex-center">
                        <view v-if="commentDetail.loading === 'loading'" class="loading flex flex-center flex-col">
                            <text class="e-loading-icon iconfont icon-loading text-blue"></text>
                            <view class="text-size-n text-grey-lighten-1 py-12 mt-12">加载中，请稍等...</view>
                        </view>
                        <view v-else-if="commentDetail.loading === 'error'" class="error">
                            <tm-empty icon="icon-wind-cry" label="加载失败">
                                <tm-button theme="bg-gradient-light-blue-accent" size="m" @click="fnGetChildComments()">
                                    刷新试试
                                </tm-button>
                            </tm-empty>
                        </view>
                    </view>
                    <block v-else>
                        <view v-if="commentDetail.list.length === 0" class="poup-empty flex flex-center">
                            <tm-empty icon="icon-shiliangzhinengduixiang-" label="没有更多评论啦~"></tm-empty>
                        </view>

                        <block v-else>
                            <comment-item v-for="(comment, index) in commentDetail.list" :useContentBg="false"
                                          :useSolid="false" :useActions="false" :key="index" :isChild="false" :comment="comment"
                                          :postName="result.metadata.name"></comment-item>
                        </block>
                    </block>
                </scroll-view>
            </view>
        </tm-poup>

        <!-- 海报 -->
        <!--  <tm-poup v-model="poster.show" width="90vw" height="auto" :round="6" :over-close="true" position="center">
            <view class="poster-content pt-12 bg-white">
                <view v-if="poster.loading" class="poster-loading flex flex-center text-grey-darken-1">
                    <text class="e-loading-icon iconfont icon-loading"></text>
                    <text class="ml-6">海报正在生成...</text>
                </view>
                <block v-if="poster.showCanvas">
                    <r-canvas ref="rCanvas"></r-canvas>
                    <view class="poster-save ma-24 mt-0 pt-20 flex flex-center">
                        <tm-button theme="bg-gradient-light-blue-accent" size="m" @click="fnSavePoster()">
                            保存到相册
                        </tm-button>
                        <tm-button v-if="false" theme="bg-gradient-orange-accent" size="m" @click="fnShareTo()">
                            分享给好友
                        </tm-button>
                        <tm-button theme="bg-gradient-blue-grey-accent" size="m" @click="fnOnPosterClose()">
                            关 闭
                        </tm-button>
                    </view>
                </block>
            </view>
        </tm-poup> -->
        <tm-poup v-model="poster.show" width="90vw" height="auto" :round="6" :over-close="true" position="center">
            <view class="poster-content pt-12 bg-white">
                <liu-poster ref="liuPoster" :width="674" :height="940" @change="handleOnPosterChange"></liu-poster>
                <view v-if="poster.loading" class="poster-loading flex flex-center text-grey-darken-1">
                    <text class="e-loading-icon iconfont icon-loading"></text>
                    <text class="ml-6">海报正在生成...</text>
                </view>
                <block v-if="!poster.loading">
                    <image :style="{
						width:'100%',
						height:'940rpx'
					}" :src="poster.url"></image>
                    <view class="poster-save ma-24 mt-0 pt-20 flex flex-center">
                        <tm-button theme="bg-gradient-light-blue-accent" size="m" @click="fnSavePoster()">
                            保存到相册
                        </tm-button>
                        <tm-button v-if="false" theme="bg-gradient-orange-accent" size="m" @click="fnShareTo()">
                            分享给好友
                        </tm-button>
                        <tm-button theme="bg-gradient-blue-grey-accent" size="m" @click="fnOnPosterClose()">
                            关 闭
                        </tm-button>
                    </view>
                </block>
            </view>
        </tm-poup>

        <!-- 验证码弹窗 -->
        <tm-dialog v-model="verificationCodeModal.show" :disabled="true" title="验证提示"
                   :confirmText="verificationCodeModal.confirmText"
                   :showCancel="true" model="verificationCodeModal.model" theme="split" confirmColor="blue shadow-blue-0"
                   @cancel="verificationCodeModal.show = false"
                   @confirm="restrictReadCheckOrViewVideo">
          <template #default>
            <view class="pa-20">
              <!-- 扫码验证模式 -->
              <view v-if="verificationCodeModal.type === 'scan'" class="flex flex-col flex-center">
                <text class="mb-20">请扫描下方二维码获取验证码</text>
                <tm-images
                    :width="180"
                    :height="180"
                    :src="verificationCodeModal.imgUrl"
                    preview
                    round="5"
                ></tm-images>
                <tm-input bg-color="grey-lighten-5" required v-model="restrictReadInputCode" placeholder="请输入验证码"
                          :border-bottom="false" :flat="true"></tm-input>
              </view>

              <!-- 观看视频模式 -->
              <view v-else class="flex flex-col flex-center">
                <text class="mb-20">点击观看视频之后，可访问</text>
              </view>
            </view>
          </template>
        </tm-dialog>
        <!-- 密码弹窗 -->
        <tm-dialog v-model="passwordModal.show" :disabled="true" title="验证提示" confirmText="确定" content="请输入密码"
                   :showCancel="true" model="confirm" theme="split" confirmColor="blue shadow-blue-0"
                   :input-val.sync="restrictReadInputCode"
                   @cancel="passwordModal.show = false"
                   @confirm="restrictReadCheck"></tm-dialog>

        <!-- 评论弹窗 -->
        <block v-if="calcIsShowComment">
            <comment-modal :show="commentModal.show" :title="commentModal.title" :postName="commentModal.postName"
                           :isComment="commentModal.isComment" @on-close="fnOnCommentModalClose"></comment-modal>
        </block>
    </view>
</template>

<script>
import MarkdownConfig from '@/common/markdown/markdown.config.js';

import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
import tmPoup from '@/tm-vuetify/components/tm-poup/tm-poup.vue';
import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
import tmDialog from '@/tm-vuetify/components/tm-dialog/tm-dialog.vue';
import tmMore from '@/tm-vuetify/components/tm-more/tm-more.vue';

import mpHtml from '@/components/mp-html/components/mp-html/mp-html.vue';
import commentList from '@/components/comment-list/comment-list.vue';
import commentItem from '@/components/comment-item/comment-item.vue';
import commentModal from '@/components/comment-modal/comment-modal.vue';

import rCanvas from '@/components/r-canvas/r-canvas.vue';
import barrage from '@/components/barrage/barrage.vue';
import {getAppConfigs} from '@/config/index.js'
import {upvote} from '@/utils/upvote.js'
import {
  checkPostRestrictRead,
  copyToClipboard,
  getRestrictReadTypeName,
  getShowableContent
} from "@/utils/restrictRead";
import HaloTokenConfig from "@/config/uhalo.config";
import RestrictReadSkeleton from "@/components/restrict-read-skeleton/restrict-read-skeleton.vue";
import TmImages from "@/tm-vuetify/components/tm-images/tm-images.vue";
import TmInput from "@/tm-vuetify/components/tm-input/tm-input.vue";

let videoAd = null;
export default {
    components: {
      TmInput,
      TmImages,
      RestrictReadSkeleton,
        tmSkeleton,
        tmPoup,
        tmFlotbutton,
        tmButton,
        tmEmpty,
        tmDialog,
        tmMore,
        mpHtml,
        commentList,
        commentItem,
        rCanvas,
        barrage,
        commentModal
    },
    data() {
        return {
            loading: 'loading',
            markdownConfig: MarkdownConfig,

            flotButtonActions: [],
            queryParams: {
                name: null
            },
            result: null,

            commentDetail: {
                loading: 'loading',
                show: false,
                comment: {},
                postName: undefined,
                list: []
            },
            poster: {
                show: false,
                showCanvas: false,
                loading: true,
                res: null,
                url: "",
                configs: []
            },

            metas: [], // 自定义元数据
            showContentArr: [],
            restrictReadInputCode: '',
            verificationCodeModal: {
              show: false,
              model: 'confirm',
              confirmText: '确定',
              type: '',
              imgUrl: '',
              adId: ''
            },
            passwordModal: {
              show: false
            },
            commentModal: {
                show: false,
                isComment: false,
                postName: "",
                title: ""
            },

            commentListScrollTop: 0
        };
    },
    computed: {
        haloConfigs() {
            return this.$tm.vx.getters().getConfigs;
        },
        postDetailConfig() {
            return this.haloConfigs.basicConfig.postDetailConfig;
        },
        calcUrl() {
            return url => {
                if (this.$utils.checkIsUrl(url)) {
                    return url;
                }
                return getApp().globalData.baseApiUrl + url;
            };
        },
        // 获取博主信息
        bloggerInfo() {
            const blogger = this.$tm.vx.getters().getConfigs.authorConfig.blogger;
            blogger.avatar = this.$utils.checkAvatarUrl(blogger.avatar, true);
            return blogger;
        },

        // 原文链接：个人资质=可以打开公众号文章；非个人：任意链接地址（需在小程序后台配置）
        originalURL() {
            return this.result?.metadata?.annotations?.unihalo_originalURL || ""
        },

        calcIsShowComment() {
            return this.postDetailConfig.showComment
        },
        calcUpvoted() {
            return upvote.has("post", this.result?.metadata?.name)
        }
    },
    watch: {
        haloConfigs: {
            deep: true,
            immediate: true,
            handler: function (newVal) {
                if (!newVal) return;
                this.fnHandleSetFlotButtonItems(newVal);
            }
        }
    },
    onLoad(e) {
        this.fnSetPageTitle('文章加载中...');
        this.queryParams.name = e.name;
        this.fnGetData();
    },

    onPullDownRefresh() {
        this.fnGetData();
    },
    onShareAppMessage() {
        const cover = this.result.spec.cover ? this.calcUrl(this.result.spec.cover) : ""
        return {
            path: '/pagesA/article-detail/article-detail?name=' + this.result.metadata.name,
            title: this.result.spec.title,
            imageUrl: cover
        }
    },
    onShareTimeline() {
        const cover = this.result.spec.cover ? this.calcUrl(this.result.spec.cover) : ""
        return {
            title: this.result.spec.title,
            query: {
                name: this.result.metadata.name
            },
            imageUrl: cover
        }
    },
    methods: {
      getRestrictReadTypeName,
      checkPostRestrictRead,
        fnGetData() {
            this.loading = 'loading';
            this.$httpApi.v2
                .getPostByName(this.queryParams.name)
                .then(res => {
                    console.log('详情', res);
                    this.result = res;

                    const openid = uni.getStorageSync('openid');
                    if (openid === '' || openid === null) {
                        this.fnGetOpenid();
                    }

                    const toolsPluginEnabled = getAppConfigs().pluginConfig.toolsPlugin?.enabled;
                    const restrictRead = checkPostRestrictRead(this.result);

                    if (restrictRead && toolsPluginEnabled) {
                      let verifyCodeType = getAppConfigs().pluginConfig.toolsPlugin?.verifyCodeType;
                      const postVerifyCodeType = this.result?.metadata?.annotations?.verifyCodeType;
                      if (postVerifyCodeType) {
                        verifyCodeType = postVerifyCodeType;
                      }
                      if (verifyCodeType === 'scan') {
                        const scanCodeUrl = getAppConfigs().pluginConfig.toolsPlugin?.scanCodeUrl;
                        this.verificationCodeModal.type = 'scan';
                        this.verificationCodeModal.imgUrl = this.$utils.checkImageUrl(scanCodeUrl);
                        this.verificationCodeModal.model = 'confirm';
                        this.verificationCodeModal.confirmText = '立即验证';
                      } else if (verifyCodeType === 'advert') {
                        const rewardedVideoAdId = getAppConfigs().pluginConfig.toolsPlugin?.rewardedVideoAdId;
                        this.verificationCodeModal.type = 'advert';
                        this.verificationCodeModal.adId = rewardedVideoAdId;
                        this.verificationCodeModal.model = 'dialog';
                        this.verificationCodeModal.confirmText = '观看视频';
                        // #ifdef MP-WEIXIN
                        this.adLoad();
                        // #endif
                      }

                      const showableContentArr = getShowableContent(this.result);
                      this.showContentArr = showableContentArr;
                    }

                    this.fnSetPageTitle('文章详情');
                    this.loading = 'success';
                    this.fnHandleSetFlotButtonItems(this.haloConfigs);
                    this.handleQueryCommentListScrollTop()
                })
                .catch(err => {
                    console.log("错误", err)
                    this.loading = 'error';
                })
                .finally(() => {
                    uni.hideLoading();
                    uni.stopPullDownRefresh();
                });
        },
        fnHandleSetFlotButtonItems(configs) {
            const actions = [{
                icon: 'icon-share1',
                color: 'bg-gradient-blue-accent',
                use: true,
            },
                {
                    icon: upvote.has("post", this.result?.metadata?.name) ? 'icon-heart-fill' : 'icon-like',
                    color: upvote.has("post", this.result?.metadata?.name) ? 'bg-gradient-red-accent' :
                        'bg-gradient-orange-accent',
                    use: true,
                },
                {
                    icon: 'icon-commentdots-fill',
                    color: 'bg-gradient-green-accent',
                    use: configs?.basicConfig?.postDetailConfig?.showComment
                }
            ]

            this.flotButtonActions = actions.filter(x => x.use === true)
        },
        // 浮动按钮点击
        fnOnFlotButtonChange(index) {
            switch (index) {
                case 0:
                    this.fnShowShare();
                    break;
                case 1:
                    this.fnDoLikes();
                    break;
                case 2:
                    this.fnToComment();
                    break;
            }
        },

        fnToComment() {
            if (!this.calcIsShowComment) {
                return;
            }
            if (!this.result.spec.allowComment) {
                return uni.$tm.toast('文章已开启禁止评论！');
            }
            this.commentModal.isComment = true;
            this.commentModal.postName = this.result.metadata.name;
            this.commentModal.title = "新增评论";
            this.commentModal.show = true;

            setTimeout(() => {
                uni.pageScrollTo({
                    scrollTop: this.commentListScrollTop,
                    duration: 100
                })
            }, 300)
        },
        fnOnComment(data) {
            this.commentModal.isComment = data.isComment;
            this.commentModal.postName = data.postName;
            this.commentModal.title = data.title;
            this.commentModal.show = true;
        },
        fnOnCommentModalClose({
                                  refresh,
                                  isSubmit
                              }) {
            console.log("refresh", refresh)
            console.log("isSubmit", isSubmit)
            if (refresh && isSubmit && this.$refs.commentListRef) {
                this.$refs.commentListRef.fnGetData()
            }
            this.commentModal.show = false;
            this.commentModal.isComment = false;
            this.commentModal.postName = "";
            this.commentModal.title = "";
        },
        fnDoLikes() {
            if (upvote.has("post", this.result?.metadata?.name)) {
                uni.$tm.toast('已经点过赞啦!');
                return;
            }
            this.$httpApi.v2.submitUpvote({
                group: "content.halo.run",
                plural: "posts",
                name: this.result?.metadata?.name
            })
                .then(res => {
                    uni.$tm.toast('点赞成功!');
                    upvote.set("post", this.result?.metadata?.name)
                    this.fnHandleSetFlotButtonItems(this.haloConfigs);
                })
                .catch(err => {
                    uni.$tm.toast('点赞失败');
                });
        },
        async fnShowShare() {
            this.poster.show = true;
            await this.handleCreatePoster()
            setTimeout(() => {
                this.poster.showCanvas = true;
                // this.fnCreatePoster(res => {
                //     this.poster.res = res;
                // });
                this.$nextTick(() => {
                    this.$refs.liuPoster.init(this.poster.configs)
                })
            }, 500);
        },
        handleOnPosterChange(url) {
            this.poster.url = url;
            this.poster.loading = false
        },
        async handleCreatePoster() {
            const systemInfo = await uni.getSystemInfoSync();
            const _bloggerAvatar = this.$utils.checkAvatarUrl(this.bloggerInfo.avatar, true);
            const _articleCover = this.$utils.checkThumbnailUrl(this.result.spec.cover, true);
            const _qrCodeImageUrl = await this.qrCodeImageUrl();
            this.poster.configs = [{
                type: 'color',
                width: 674,
                height: 940,
                x: 0,
                y: 0,
                radius: 24,
                lineWidth: 0,
                lineColor: '#ffffff',
                colorObj: {
                    colorList: ['#FFFFFF'],
                    direction: 2
                },
            }, {
                type: 'image',
                width: 96,
                height: 96,
                x: 24,
                y: 24,
                radius: 48,
                lineWidth: 2,
                lineColor: '#FFFFFF',
                path: _bloggerAvatar
            }, {
                type: 'text',
                width: 400,
                height: 40,
                x: 140,
                y: 42,
                color: '#000000',
                fontSize: 30,
                lineHeight: 30,
                bold: true,
                content: this.bloggerInfo.nickname
            }, {
                type: 'text',
                width: 400,
                height: 40,
                x: 140,
                y: 90,
                color: '#666666',
                fontSize: 24,
                lineHeight: 24,
                bold: false,
                content: this.bloggerInfo.description,
            }, {
                type: 'image',
                width: 624,
                height: 360,
                x: 24,
                y: 152,
                radius: 12,
                lineWidth: 0,
                lineColor: '#FFFFFF',
                path: _articleCover

            }, {
                type: 'text',
                width: 626,
                height: 40,
                x: 24,
                y: 562,
                color: '#333333',
                fontSize: 28,
                lineHeight: 28,
                bold: true,
                content: this.result.spec.title
            }, {
                type: 'text',
                width: 626,
                height: 80,
                x: 24,
                y: 612,
                color: '#333333',
                fontSize: 24,
                lineHeight: 40,
                bold: false,
                content: this.result?.status?.excerpt || "文章暂无摘要信息"
            }, {
                type: 'line',
                width: 2,
                color: '#999999',
                startX: 24,
                startY: 722,
                endX: 646,
                endY: 722,
                lineType: 'dash',
            }, {
                type: 'image',
                width: 160,
                height: 160,
                x: 24,
                y: 752,
                radius: 12,
                lineWidth: 0,
                lineColor: '#FFFFFF',
                path: this.$utils.checkImageUrl(_qrCodeImageUrl),
            }, {
                type: 'text',
                width: 300,
                height: 44,
                x: 320,
                y: 772,
                color: '#333333',
                fontSize: 32,
                lineHeight: 44,
                bold: true,
                content: '长按识别小程序',
            }, {
                type: 'text',
                width: 442,
                height: 24,
                x: 234,
                y: 872,
                color: '#333333',
                fontSize: 24,
                lineHeight: 24,
                bold: false,
                content: '关注我，给你分享更多有趣的知识',
            }]
        },

        // 绘制虚线：https://blog.csdn.net/a460550542/article/details/124821248
        drawDashedLine(ctx, x, y, w, h, pattern, color) {
            ctx.lineWidth = h;
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.setLineDash(pattern);
            ctx.moveTo(x, y);
            ctx.lineTo(w, y);
            ctx.stroke();
            y += 20;
        },
        fnCreatePoster(callback) {
            this.$nextTick(async () => {
                const systemInfo = await uni.getSystemInfoSync();
                const _bloggerAvatar = this.$utils.checkAvatarUrl(this.bloggerInfo.avatar, true);
                const _articleCover = this.$utils.checkThumbnailUrl(this.result.spec.cover, true);
                // 初始化
                await this.$refs.rCanvas.init({
                    canvas_id: 'rCanvas',
                    // canvas_width: systemInfo.windowWidth - uni.upx2px(76),
                    canvas_width: 337,
                    canvas_height: 460,
                    background_color: 'rgba(255,255,255,0)'
                });
                // 画圆角背景
                await this.$refs.rCanvas
                    .fillRoundRect({
                        x: 0,
                        y: 0,
                        w: 337,
                        h: 460,
                        radius: 12,
                        fill_color: '#fff'
                    })
                    .catch(err_msg => {
                        uni.showToast({
                            title: err_msg,
                            icon: 'none'
                        });
                    });
                // 博主信息
                await this.$refs.rCanvas
                    .drawImage({
                        url: _bloggerAvatar,
                        x: 12,
                        y: 12,
                        w: 48,
                        h: 48,
                        border_radius: 24
                    })
                    .catch(err_msg => {
                        uni.showToast({
                            title: err_msg,
                            icon: 'none'
                        });
                    });

                await this.$refs.rCanvas
                    .drawText({
                        text: this.bloggerInfo.nickname,
                        max_width: 0,
                        x: 70,
                        y: 30,
                        font_color: '#000',
                        font_size: 15
                    })
                    .catch(err_msg => {
                        uni.showToast({
                            title: err_msg,
                            icon: 'none'
                        });
                    });
                await this.$refs.rCanvas
                    .drawText({
                        text: this.bloggerInfo.description,
                        max_width: 0,
                        x: 70,
                        y: 52,
                        font_color: '#666',
                        font_size: 12
                    })
                    .catch(err_msg => {
                        uni.showToast({
                            title: err_msg,
                            icon: 'none'
                        });
                    });
                // 文章封面图
                await this.$refs.rCanvas
                    .drawImage({
                        url: _articleCover,
                        x: 12,
                        y: 75,
                        w: 312,
                        h: 180,
                        border_radius: 6
                    })
                    .catch(err_msg => {
                        uni.showToast({
                            title: err_msg,
                            icon: 'none'
                        });
                    });

                // 文章标题
                await this.$refs.rCanvas
                    .drawText({
                        text: this.result.spec.title,
                        max_width: 312,
                        line_clamp: 1,
                        x: 12,
                        y: 285,
                        font_weight: 'bold',
                        font_color: '#333',
                        font_size: 14
                    })
                    .catch(err_msg => {
                        uni.showToast({
                            title: err_msg,
                            icon: 'none'
                        });
                    });
                await this.$refs.rCanvas
                    .drawText({
                        text: this.result?.status?.excerpt || "文章暂无摘要信息",
                        max_width: 312,
                        line_clamp: 2,
                        x: 12,
                        y: 310,
                        font_color: '#333',
                        font_size: 13,
                        line_height: 20
                    })
                    .catch(err_msg => {
                        uni.showToast({
                            title: err_msg,
                            icon: 'none'
                        });
                    });

                this.drawDashedLine(this.$refs.rCanvas.ctx, 14, 356, 332, 0.5, [8, 5, 5, 5], '#999');
                // 小程序信息
                const _qrCodeImageUrl = await this.qrCodeImageUrl();
                await this.$refs.rCanvas
                    .drawImage({
                        url: this.$utils.checkImageUrl(_qrCodeImageUrl),
                        x: 20,
                        y: 360,
                        w: 80,
                        h: 80
                    })
                    .catch(err_msg => {
                        uni.showToast({
                            title: err_msg,
                            icon: 'none'
                        });
                    });

                await this.$refs.rCanvas
                    .drawText({
                        text: '长按识别小程序',
                        x: 150,
                        y: 390,
                        font_color: '#333',
                        font_size: 15,
                        font_weight: 'bold',
                        line_height: 22
                    })
                    .catch(err_msg => {
                        uni.showToast({
                            title: err_msg,
                            icon: 'none'
                        });
                    });
                await this.$refs.rCanvas
                    .drawText({
                        text: '关注我，给你分享更多有趣的知识',
                        x: 115,
                        y: 425,
                        font_color: '#333',
                        font_size: 12,
                        line_height: 22
                    })
                    .catch(err_msg => {
                        uni.showToast({
                            title: err_msg,
                            icon: 'none'
                        });
                    });
                // 生成海报
                await this.$refs.rCanvas.draw(res => {
                    //res.tempFilePath：生成成功，返回base64图片
                    // 保存图片
                    this.poster.loading = false;
                    callback(res);
                });
            });
        },
        fnOnPosterClose() {
            this.poster.show = false;
            this.poster.showCanvas = false;
            this.poster.loading = true;
        },
        fnSavePoster() {
            // this.$refs.rCanvas.saveImage(this.poster.res.tempFilePath);
            uni.saveImageToPhotosAlbum({
                filePath: this.poster.url,
                success: () => {
                    uni.$tm.toast('保存成功');
                }, fail: (e) => {
                    uni.$tm.toast('保存失败，请重试');
                }
            })
        },
        fnShareTo() {
            // #ifdef MP-WEIXIN
            uni.$tm.toast('点击右上角分享给好友！');
            // #endif
        },
        fnOnShowCommentDetail(data) {
            const {
                postName,
                comment
            } = data;
            this.commentDetail.comment = comment;
            this.commentDetail.postName = postName;
            this.commentDetail.list = [];
            this.commentDetail.show = true;
            this.fnGetChildComments();
        },
        fnGetChildComments() {
            this.commentDetail.loading = 'loading';
            this.$httpApi.v2
                .getPostCommentReplyList(this.commentDetail.postName, {
                    page: 1,
                    size: 100
                })
                .then(res => {
                    console.log('getPostChildrenCommentList res', res);
                    this.commentDetail.loading = 'success';
                    this.commentDetail.list = res.items;
                })
                .catch(err => {
                    console.log('getPostChildrenCommentList err', err);
                    this.commentDetail.loading = 'error';
                });
        },
        fnToCate(category) {
            uni.navigateTo({
                url: `/pagesA/category-detail/category-detail?name=${category.metadata.name}&title=${category.spec.displayName}`
            });
        },
        fnToTag(tag) {
            uni.navigateTo({
                url: `/pagesA/tag-detail/tag-detail?name=${tag.metadata.name}&title=${tag.spec.displayName}`
            });
        },
        async fnOnCommentLoaded(data) {
            const _list = [];
            const _handleData = list => {
                return new Promise(resolve => {
                    if (list.length === 0) {
                        resolve();
                    } else {
                        list.forEach(item => {
                            _list.push(item);
                            if (item.replies && item.replies.length !== 0) {
                                _handleData(item.replies.items);
                            }
                            resolve();
                        });
                    }
                });
            };
            await _handleData(data);
            // if (this.globalAppSettings.barrage.use) {
            // 	this.$nextTick(() => {
            // 		if (_list.length != 0) {
            // 			_handleAddBarrage();
            // 		}
            // 	});
            // }
            // const _handleRemove = () => {
            // 	this.$refs['barrage'] && this.$refs['barrage'].remove({
            // 		duration: 5000, // 延迟关闭的时间
            // 		speed: 600 // 弹幕消失的速度
            // 	});
            // };
            // let index = 0;
            // const _handleAddBarrage = () => {
            // 	setTimeout(() => {
            // 		this.$refs['barrage'] && this.$refs['barrage'].add(_list[index]);
            // 		index += 1;
            // 		if (index < _list.length - 1) {
            // 			_handleAddBarrage();
            // 		} else {
            // 			_handleRemove();
            // 		}
            // 	}, 1000);
            // };
        },
        fnToWebview(data) {
            uni.navigateTo({
                url: '/pagesC/website/website?data=' +
                    JSON.stringify({
                        title: data.title,
                        url: encodeURIComponent(data.url)
                    })
            });
        },
        fnToOriginal(originalURL) {
            this.fnToWebview({
                title: this.result.title,
                url: originalURL
            });
        },
        readMore() {
          const annotations = this.result?.metadata?.annotations;
          const restrictReadEnable = annotations?.restrictReadEnable;
          if (restrictReadEnable === 'password') {
            this.passwordModal.show = true;
            return;
          } else if (restrictReadEnable === 'code') {
            this.verificationCodeModal.show = true;
            return;
          } else if (restrictReadEnable === 'comment') {
            uni.showToast({
              title: '前往web端评论后访问',
              icon: 'none'
            });
          } else if (restrictReadEnable === 'login') {
            uni.showToast({
              title: '前往web端登录后访问',
              icon: 'none'
            });
          } else if (restrictReadEnable === 'pay') {
            uni.showToast({
              title: '前往web端支付后访问',
              icon: 'none'
            });
          }
          // 两秒后执行
          setTimeout(() => {
            copyToClipboard(`${HaloTokenConfig.BASE_API + this.result.status.permalink}`);
          }, 2000);
        },
        //   获取openid
        fnGetOpenid() {
            // #ifdef MP-WEIXIN
            uni.login({
                provider: 'weixin',
                success: function (loginRes) {
                    try {
                        // todo 因为没有获取openid，所以先使用code代替
                        uni.setStorageSync('openid', loginRes.code)
                    } catch (error) {
                        console.log(error)
                    }
                }
            })
            // #endif
        },
        restrictReadCheckOrViewVideo() {
          console.log('restrictReadCheckOrViewVideo', this.verificationCodeModal.type)
          if (this.verificationCodeModal.type === 'advert') {
            this.openVideoAd();
          } else {
            this.restrictReadCheck();
          }
        },
        //   校验密码
        restrictReadCheck() {
          if (!this.restrictReadInputCode) {
            uni.showToast({
              title: '请输入内容',
              icon: 'none'
            });
            return;
          }
          this.$httpApi.v2.requestRestrictReadCheck(this.result?.metadata?.annotations?.restrictReadEnable, this.restrictReadInputCode, this.result?.metadata?.name)
              .then(res => {
                if (res.code === 200) {
                  this.passwordModal.show = false;
                  this.verificationCodeModal.show = false;
                  this.fnGetData();
                } else {
                  uni.showToast({
                    title: '密码错误',
                    icon: 'none'
                  });
                }
              })
              .catch(err => {
                console.error(err);
              });
        },
        adLoad() {
          if (wx.createRewardedVideoAd) {
            videoAd = wx.createRewardedVideoAd({
              adUnitId: this.verificationCodeModal.adId
            })
            videoAd.onError(err => {
            })
            videoAd.onClose((status) => {
              if (status && status.isEnded || status === undefined) {
                //这里写广告播放完成后的事件
                this.getVerificationCode();
              } else {
                // 广告播放未完成
              }
            })
          }
        },
        openVideoAd: function () {
          if (videoAd && this.verificationCodeModal.adId !== '') {
            videoAd.show().catch(err => {
              // 失败重试
              console.log("广告拉取失败")
              videoAd.load().then(() => videoAd.show())
            })
          } else {
            this.getVerificationCode();
          }
        },
        getVerificationCode() {
          uni.showLoading({
            title: '正在获取...'
          });
          this.$httpApi.v2.createVerificationCode()
              .then(res => {
                if (res.code === 200) {
                  this.verificationCodeModal.show = false;
                  this.restrictReadInputCode = res.data;
                  this.restrictReadCheck();
                } else {
                  uni.$tm.toast('操作失败，请重试！');
                }
              })
              .catch(err => {
                uni.$tm.toast(err.message);
              });
        },
        async qrCodeImageUrl() {
            const useDynamicQRCode = this.haloConfigs?.appConfig?.appInfo?.useDynamicQRCode;
            if (useDynamicQRCode) {
                const qrCodeImg = await this.$httpApi.v2.getQRCodeImg(this.result.metadata.name);
                return qrCodeImg;
            } else {
                return this.haloConfigs?.appConfig?.appInfo?.qrCodeImageUrl;
            }
        },
        handleQueryCommentListScrollTop() {
            if (!this.postDetailConfig) return;
            if (!this.postDetailConfig.showComment) return;
            this.$nextTick(() => {
                setTimeout(() => {
                    uni.createSelectorQuery().in(this).select('#CommentList').boundingClientRect(
                        res => {
                            this.commentListScrollTop = res.top - 12;
                        }).exec();
                }, 2 * 1000)
            })
        }

    }
};
</script>

<style lang="scss" scoped>
.app-page {
    width: 100vw;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    background-color: #fafafd;
    padding-bottom: 24rpx;
}

.bg-image {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
}

.loading-wrap {
    padding: 0 24rpx;
    height: inherit;
    background-color: #fff;
}

.head {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 36rpx 24rpx;
    background-color: #ffffff;
    box-shadow: 0rpx 4rpx 24rpx rgba(0, 0, 0, 0.03);
    // box-shadow: 0rpx 6rpx 30rpx rgba(182, 223, 255, 0.3);
    border-radius: 12rpx;

    .title {
        font-size: 36rpx;
        font-weight: 600;
        text-align: center;
    }

    .detail {
        width: 100%;
        margin-top: 24rpx;
        font-size: 26rpx;

        .author {
            text-align: center;
            font-size: 24rpx;
            color: #666;

            &-name {
            }

            &-time {
                margin-left: 36rpx;
            }
        }

        .cover {
            margin-top: 24rpx;
            width: 100%;
            height: 280rpx;

            &-img {
                width: 100%;
                height: 100%;
                border-radius: 12rpx;
            }
        }

        .count {
            margin-top: 24rpx;
            display: flex;
            justify-content: space-between;

            &.no-thumbnail {
                border-top: 2rpx solid #f2f2f2;
                padding-top: 12rpx;

                .count-item {
                    position: relative;
                    color: #666;

                    &::after {
                        content: '';
                        position: absolute;
                        right: 0;
                        background-color: #eee;
                        width: 2rpx;
                        height: 32rpx;
                    }

                    &:last-child {
                        &::after {
                            display: none;
                        }
                    }
                }
            }

            &-item {
                flex: 1;
                display: flex;
                align-items: flex-end;
                justify-content: center;
                color: #666;

                .label {
                    font-size: 24rpx;
                    padding-left: 8rpx;
                }

                .value {
                    font-size: 32rpx;
                }
            }
        }
    }
}

.category {
    margin: 0 24rpx;
    padding: 24rpx;
    background-color: #ffffff;
    border-radius: 12rpx;
    // box-shadow: 0rpx 0rpx 24rpx rgba(182, 223, 255, 0.3);
    box-shadow: 0rpx 4rpx 24rpx rgba(0, 0, 0, 0.03);
    // border: 2rpx solid #f8f8f8;
    font-size: 28rpx;

    &-type {
        line-height: 55rpx;
    }

    &-tag {
        background-color: #5bb8fa;
        color: #fff;
        padding: 6rpx 12rpx;
        border-radius: 6rpx;
        font-size: 24rpx;

        &.is-empty {
            background-color: #607d8b;
        }
    }
}

.category-tag + .category-tag {
    margin-left: 12rpx;
}

.content {
    margin-top: 24rpx;
}

.markdown-wrap,
.evan-markdown,
.ad-wrap,
.copyright-wrap,
.comment-wrap {
    box-shadow: 0rpx 0rpx 24rpx rgba(0, 0, 0, 0.03);
}

.markdown-wrap {
    overflow: hidden;
    border-radius: 12rpx;
}

.copyright-title {
    position: relative;
    box-sizing: border-box;
    padding-left: 24rpx;
    font-size: 30rpx;

    &:before {
        content: '';
        position: absolute;
        left: 0rpx;
        top: 8rpx;
        width: 8rpx;
        height: 26rpx;
        background-color: rgb(3, 174, 252);
        border-radius: 6rpx;
    }
}

.poup-head {
    border-bottom: 2rpx solid #f5f5f5;
}

.poup-body {
    height: 50vh;
}

.poup-empty {
    width: 100%;
    height: 40vh;
}

.poup-loading-wrap {
    width: 100%;
    height: 40vh;

    .e-loading-icon {
        font-size: 80rpx;
    }
}

.poster-content {
    width: 100%;
    min-height: 60vh;
    overflow: hidden;
}

.copyright-text {
    line-height: 1.7;
}

.poster-loading {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    // background-color: rgba(0, 0, 0, 0.1);
    z-index: 666;
}

.poster-save {
    box-sizing: border-box;
    border-top: 2rpx dashed #eee;
}

.original-url {
    display: flex;

    &_left {
        flex-shrink: 0;
        width: 84rpx;
    }

    &_right {
        flex-grow: 1;
        display: inline-flex;
        align-items: center;

        &__link {
            width: 410rpx;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        &__btn {
            flex-grow: 1;
            flex-shrink: 0;
            display: block;
            text-align: right;
        }
    }
}
</style>
