<template>
    <tm-poup v-model="isShow" width="80vw" height="70vh" position="center" :round="6" @change="fnOnChange">
        <view class="fulled pa-4">
            <view  class="mt-24 fulled text-weight-b text-size-sm text-align-center text-overflow-2 pb-12">{{ title }}</view>
            <view class="fulled mt-2">
                <scroll-view class="fulled" scroll-y :style="{
                    height: url? '52vh': '59vh'
                }">
                    <mp-html class="evan-markdown" lazy-load :domain="markdownConfig.domain"
                             :loading-img="markdownConfig.loadingGif" :scroll-table="true" :selectable="true"
                             :tag-style="markdownConfig.tagStyle" :container-style="markdownConfig.containStyle"
                             :content="content" :markdown="true" :showLineNumber="true" :showLanguageName="true"
                             :copyByLongPress="true"/>
                </scroll-view>
            </view>
            <view v-if="url" class="fulled mt-12 flex flex-center">
                <tm-button theme="bg-gradient-light-blue-accent" size="m" @click="fnToWebview()">
                    点击跳转内容链接
                </tm-button>
            </view>
        </view>
    </tm-poup>
</template>


<script>
import tmPoup from '@/tm-vuetify/components/tm-poup/tm-poup.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
import mpHtml from '@/components/mp-html/components/mp-html/mp-html.vue';

import MarkdownConfig from '@/common/markdown/markdown.config.js';

export default {
    name: 'notify-dialog',
    components: {
        tmPoup,
        tmButton,
        mpHtml
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        content: {
            type: String,
            default: ''
        },
        url: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isShow: false,
            markdownConfig: MarkdownConfig,
        };
    },
    created() {
        this.isShow = this.show;
    },
    methods: {
        fnToWebview() {
            if (this.$utils.checkIsUrl(this.url)) {
                uni.navigateTo({
                    url: '/pagesC/website/website?data=' +
                        JSON.stringify({
                            title: this.title,
                            url: encodeURIComponent(this.url)
                        }),
                    success: () => {
                        this.fnOnChange(false)
                    }
                });
            }
        },
        fnOnChange(e) {
            this.isShow = false;
            this.$emit('on-change', e);
        }
    }
}
</script>


<style scoped lang="scss">

</style>
