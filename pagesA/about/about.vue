<template>
    <view class="app-page bg-white flex flex-col">
        <view class="logo mt-40 pt-40">
            <image class="logo-img round-3" src="https://uni-halo.925i.cn/logo.png" mode="aspectFill"></image>
        </view>
        <view class="mt-12 text-weight-b text-size-lg">uni-halo</view>
        <view class="mt-12 text-size-s text-grey-darken-3"></view>
        <view class="list-group mt-48" style="width: 100%;">
            <tm-grouplist :shadow="0" :margin="0" :borderBottom="true">
                <tm-listitem title="开源组织" :font-size="28" @click="$utils.copyText('https://www.ialley.cn', '巷子工坊官网已复制成功！')">
                    <text class="text-size-s" slot="rightValue">巷子工坊</text>
                </tm-listitem>
                <tm-listitem title="开源作者" :font-size="28" @click="$utils.copyText('https://www.xiaoxiaomo.cn', '作者主页地址已复制')">
                    <text class="text-size-s" slot="rightValue">小莫唐尼</text>
                </tm-listitem>
                <tm-listitem title="作者博客" :font-size="28" @click="$utils.copyText('https://blog.xiaoxiaomo.cn', '作者博客地址已复制')">
                    <text class="text-size-s text-overflow" slot="rightValue">https://blog.xiaoxiaomo.cn</text>
                </tm-listitem>
                <tm-listitem title="文档地址" :font-size="28" @click="$utils.copyText('https://uni-halo.925i.cn', '项目码云仓库已复制')">
                    <text class="text-size-s text-overflow" slot="rightValue">https://uni-halo.925i.cn</text>
                </tm-listitem>
                <tm-listitem title="码云仓库" :font-size="28"
                             @click="$utils.copyText('https://gitee.com/ialley-workshop-open/uni-halo', '码云仓库地址已复制')">
                    <text class="text-size-s text-overflow" slot="rightValue">https://gitee.com/ialley-workshop-open/uni-halo</text>
                </tm-listitem>
                <tm-listitem title="Github" :font-size="28"
                             @click="$utils.copyText('https://github.com/ialley-workshop-open/uni-halo', 'Github地址已复制')">
                    <text class="text-size-s text-overflow" slot="rightValue">https://github.com/ialley-workshop-open/uni-halo</text>
                </tm-listitem>
            </tm-grouplist>
        </view>
        <view class="copyright bg-white text-size-xs text-align-center text-grey-darken-1 pa-36">
            <view class="">根据 AGPL-3.0 协议开源</view>
            <view class="mt-8">「 2022 uni-halo 丨 开源项目丨巷子工坊@小莫唐尼 」</view>
        </view>
    </view>
</template>

<script>
import tmGrouplist from '@/tm-vuetify/components/tm-grouplist/tm-grouplist.vue';
import tmListitem from '@/tm-vuetify/components/tm-listitem/tm-listitem.vue';

export default {
    components: {
        tmGrouplist,
        tmListitem
    },
    onLoad() {
        this.fnSetPageTitle('关于项目');
    },
    methods: {}
};
</script>

<style scoped lang="scss">
.app-page {
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    align-items: center;

    .logo-img {
        width: 160rpx;
        height: 160rpx;
    }

    .info {
        margin-left: 90rpx;
        margin-right: 90rpx;
    }

    .copyright {
        width: 100vw;
        position: fixed;
        bottom: 0;
        left: 0;
        box-sizing: border-box;
    }

    .label {
        display: inline-block;
        min-width: 140rpx;
    }
}

.text-overflow {
    width: calc(100vw - 300rpx);
    text-align: right;
}

.list-group {
    ::v-deep {
        .left {
            width: 160rpx;
            min-width: 160rpx;
        }
    }
}
</style>
