<template>
    <view class="app-page bg-white round-3 pa-46">
        <!-- 通过配置 -->
        <view v-if="disclaimersContent" style="min-height: 100%;" v-html="disclaimersContent"></view>

        <!-- 静态写法 -->
        <block v-else>
            <view class="text-weight-b text-size-lg text-align-center">《 本博客免责声明 》</view>
            <view v-if="false" class="text-size-s text-align-center mt-12 text-grey-darken-1">—— 博主：{{ bloggerInfo.nickname }} ——</view>
            <view class="mt-32">1、本博客属于个人非盈利性质的网站，所有转载的文章都以遵循原作者的版权声明注明了文章来源。</view>
            <view class="mt-24">2、如果原文没有版权声明，按照目前互联网开放的原则，本博客将在不通知作者的情况下转载文章。</view>
            <view class="mt-24">3、如果原文明确注明“禁止转载”，本博客将不会转载。</view>
            <view class="mt-24">
                4、如果本博客转载的文章不符合作者的版权声明或者作者不想让本博客转载您的文章，请邮件告知
                <text class="text-bg-gradient-light-blue-accent ml-12 mr-12 " @click="$utils.copyText(bloggerInfo.email, '电子邮箱已复制到剪贴板！')">
                    <text class="iconfont icon-mail-fill text-size-m mr-6"></text>
                    {{ bloggerInfo.email }}
                </text>
                ，博主将会在第一时间删除相关信息！
            </view>
            <view class="mt-24">5、本博客转载文章仅为留作备份和知识点分享的目的。</view>
            <view class="mt-24">
                6、本博客将尽力确保所提供信息的准确性及可靠性，但不保证信息的正确性和完整性，且不对因信息的不正确或遗漏导致的任何损失或损害承担相关责任。
            </view>
            <view class="mt-24">
                7、本博客所发布、转载的文章，其版权均归原作者所有。如其他自媒体、网站或个人从本博客下载使用，请在转载有关文章时务必尊重该文章的著作权，保留本博客注明的“原文来源”或者自行去原文处复制版权声明，并自负版权等法律责任。
            </view>
            <view class="mt-24">8、本博客的所有原创文章皆可以任意转载，但转载时务必请注明出处。</view>
            <view class="mt-24">9、尊重原创，知识共享！</view>
        </block>
    </view>
</template>

<script>
export default {
    computed: {
        haloConfigs() {
            return this.$tm.vx.getters().getConfigs
        },
        disclaimersContent() {
            const basicConfig = this.haloConfigs.basicConfig;
            return basicConfig?.disclaimers.content
        },
        bloggerInfo() {
            const blogger = this.haloConfigs.authorConfig.blogger;
            blogger.avatar = this.$utils.checkAvatarUrl(blogger.avatar)
            return blogger;
        },
    }
};
</script>

<style scoped lang="scss">
.app-page {
    line-height: 1.65;
    font-size: 30rpx;
    color: var(--main-text-color);
}
</style>
