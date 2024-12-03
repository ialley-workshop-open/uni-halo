<template>
    <view class="comment-list">
        <!-- 顶部区域 -->
        <view class="comment-list_head">
            <view class="title">
                <text>评论列表</text>
                <text class="count">（{{ (result && result.total) || 0 }}条）</text>
            </view>
			<view class="refresh">
				<text class="icon iconfont icon-sync-alt text-weight-s text-grey-darken-1"></text>
				<text class="text-weight-s text-grey-darken-1 ml-6" style="font-size: 26rpx;" @click="fnGetData">刷新</text>
			</view>
        </view>
        <!-- 内容区域 -->
        <view class="comment-list_content">
            <view v-if="loading !== 'success'" class="loading-wrap flex">
                <view v-if="loading === 'loading'" class="loading flex flex-center flex-col">
                    <text class="e-loading-icon iconfont icon-loading text-blue"></text>
                    <view class="text-size-n text-grey-lighten-1 py-12 mt-12">加载中，请稍等...</view>
                </view>
                <view v-else-if="loading === 'error'" class="error">
                    <tm-empty icon="icon-wind-cry" label="加载失败">
                        <tm-button theme="bg-gradient-light-blue-accent" size="m" v-if="!disallowComment"
                                   @click="fnToComment()">刷新试试
                        </tm-button>
                    </tm-empty>
                </view>
            </view>
            <block v-else>
                <tm-alerts v-if="disallowComment && dataList.length !== 0" color="red" text :margin="[0, 0]" :shadow="0"
                           label="Ծ‸Ծ博主已设置该文章禁止评论!" :round="3"></tm-alerts>
                <view class="empty pt-50" v-if="dataList.length === 0">
                    <tm-empty v-if="disallowComment" icon="icon-shiliangzhinengduixiang-" label="暂无评论">
                        <text class="text-red text-size-s">- 文章已开启禁止评论 -</text>
                    </tm-empty>
                    <tm-empty v-else icon="icon-shiliangzhinengduixiang-" label="暂无评论">
                        <tm-button theme="light-blue" :dense="true" :shadow="0" size="m" @click="fnToComment(null)">抢沙发
                        </tm-button>
                    </tm-empty>
                </view>
                <block v-else>
                    <!-- 评论内容 : 目前仅支持二级评论 -->
                    <block v-for="(comment, index) in dataList" :key="comment.metadata.name">
                        <comment-item :useContentBg="false" :isChild="false" :comment="comment" :postName="postName"
                                      :disallowComment="disallowComment" @on-copy="fnCopyContent" @on-comment="fnToComment"
                                      @on-todo="fnToDo" @on-detail="fnShowCommentDetail"></comment-item>

                        <!-- 二级评论 -->
                        <block v-if="comment.replies && comment.replies.items.length !== 0">
                            <block v-for="(childComment, childIndex) in comment.replies.items"
                                   :key="childComment.metadata.name">
                                <comment-item :useContentBg="false" :isChild="true" :comment="childComment"
                                              :postName="postName" :disallowComment="disallowComment" @on-copy="fnCopyContent"
                                              @on-comment="fnToComment" @on-todo="fnToDo"
                                              @on-detail="fnShowCommentDetail"></comment-item>
                            </block>
                        </block>
                    </block>
                    <view v-if="false" class="to-more-comment">
                        <tm-button item-class="btn" :block="true" width="90vw" theme="bg-gradient-light-blue-lighten"
                                   size="m">点击查看全部评论
                        </tm-button>
                    </view>
                </block>
            </block>
        </view>
    </view>
</template>

<script>
import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
import tmAlerts from '@/tm-vuetify/components/tm-alerts/tm-alerts.vue';

export default {
    name: 'comment-list',
    components: {
        tmEmpty,
        tmButton,
        tmAlerts
    },
    props: {
        // 是否禁用评论
        disallowComment: {
            type: Boolean,
            default: false
        },
        postName: {
            type: String,
            default: ""
        },
        post: {
            type: Object,
            default: () => {
            }
        }
    },
    data() {
        return {
            loading: 'loading',
            queryParams: {
                group: "content.halo.run",
                kind: "Post",
                version: "v1alpha1",
                name: "",
                page: 1,
                size: 50,
                withReplies: true,
                replySize: 10
            },
            result: null,
            dataList: []
        };
    },
    created() {
        this.queryParams.name = this.postName;
        this.fnGetData();
        uni.$on('comment_list_refresh', () => {
            this.fnOnSort(true);
        });
    },
    methods: {
        fnOnSort(refresh = false) {
            if (refresh === false) return;
            this.fnGetData();
        },
        fnGetData() {
            this.loading = 'loading';
            this.$httpApi.v2.getPostCommentList(this.queryParams)
                .then(res => {
                    console.log("日志：", res)
                    this.result = res;
                    this.dataList = res.items;
                    this.loading = 'success';
                    this.$emit('on-loaded', this.dataList);
                })
                .catch(err => {
                    this.loading = 'error';
                })
                .finally(() => {
                    uni.hideLoading();
                });
        },
        fnToDo() {
            uni.$tm.toast('Halo暂未支持！');
        },
        fnToComment(data) {
            if (this.disallowComment) {
                return uni.$tm.toast('文章已禁止评论！');
            }
            let _comment = {};
            console.log('data', data)
            if (data) {
                let {type, comment} = data;
                // 来自用户
                _comment = {
                    isComment: false,
                    postName: comment.metadata.name,
                    title: comment.owner.displayName,
                    from: 'posts',
                    formPage: 'comment_list',
                    type: 'user'
                };
            } else {
                // 来自文章
                _comment = {
                    isComment: true,
                    postName: this.post.metadata.name,
                    title: '新增评论',
                    formPage: 'comment_list',
                    from: 'posts',
                    type: 'post'
                };
            }

            this.$emit("on-comment", _comment)
        },
        fnCopyContent(content) {
            uni.$tm.u.setClipboardData(content);
            uni.$tm.toast('内容已复制成功！');
        },

        fnShowCommentDetail(comment) {
            this.$emit('on-comment-detail', {
                postName: this.postName,
                comment: comment
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.comment-list {
    &_head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        box-sizing: border-box;
        padding-left: 24rpx;
        font-size: 30rpx;
        font-weight: bold;

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

        .title {
            .count {
                font-size: 28rpx;
                font-weight: normal;
            }
        }

        .filter {
            font-size: 26rpx;
            font-weight: normal;

            &-item {
                margin-left: 20rpx;
                color: #666;

                &.active {
                    font-weight: bold;
                    color: rgb(255, 152, 0);
                    font-size: 26rpx;
                }
            }
        }
    }

    &_content {
        margin-top: 24rpx;
        padding-bottom: 36rpx;
    }
}

.loading-wrap {
    width: 100%;
    height: 506rpx;

    .loading {
        width: 100%;
    }

    .e-loading-icon {
        font-size: 100rpx;
    }
}

.to-more-comment {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 80rpx;

    ::v-deep {
        .tm-button .tm-button-btn uni-button {
            height: 70rpx;
        }
    }
}
</style>
