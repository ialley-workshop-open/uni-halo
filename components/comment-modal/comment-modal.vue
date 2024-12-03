<template>
    <tm-poup v-model="isShow" position="bottom" height="71vh" @change="handleOnChange">
        <view class="title text-align-center">{{ calcTitle }}</view>
        <tm-form @submit="fnOnSubmit">
            <tm-input name="content" :vertical="true" required :height="220" input-type="textarea"
                      bg-color="grey-lighten-5" :maxlength="200" :borderBottom="false" placeholder="请输入内容,不超过200字符..."
                      v-model="form.content"></tm-input>
            <tm-input name="author" align="right" required title="我的昵称" placeholder="请输入您的昵称..."
                      v-model="form.author"></tm-input>
            <tm-input name="avatar" align="right" title="我的头像" placeholder="请输入您的头像..."
                      v-model="form.avatar"></tm-input>
            <tm-input name="email" align="right" title="邮箱地址" placeholder="请输入您的邮箱..." v-model="form.email"></tm-input>
            <tm-input name="authorUrl" align="right" title="我的网站" placeholder="请输入您的网址..."
                      v-model="form.authorUrl"></tm-input>
            <view class="pa-24 pl-30 pr-30">
                <tm-button navtie-type="form" theme="bg-gradient-blue-accent" block>提交
                </tm-button>
            </view>
        </tm-form>
    </tm-poup>
</template>

<script>
import tmPoup from '@/tm-vuetify/components/tm-poup/tm-poup.vue';
import tmForm from '@/tm-vuetify/components/tm-form/tm-form.vue';
import tmInput from '@/tm-vuetify/components/tm-input/tm-input.vue';
import tmSwitch from '@/tm-vuetify/components/tm-switch/tm-switch.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';

export default {
    name: 'CommentModal',
    components: {
        tmPoup,
        tmForm,
        tmInput,
        tmSwitch,
        tmButton
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        isComment: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ""
        },
        postName: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            isShow: false,
            params: {
                postName: '',
                title: '', // 被回复的标题 type=user =用户名  否则为文章标题
                form: '',
                formPage: '', // 来自哪个页面
                type: 'post' // 来源文章/页面 还是用户  user=用户
            },
            form: {
                allowNotification: true,
                author: '', // 作者
                avatar: '',
                authorUrl: '', // 作者主页
                content: '', // 评论内容
                email: '', // 邮件
                postName: ""
            }
        }
    },
    computed: {
        calcTitle() {
            if (this.isComment) {
                return this.title
            }
            return `回复用户：${this.title}`
        }
    },
    watch: {
        show: {
            immediate: true,
            handler: function (newVal) {
                if (!newVal) return;
                this.isShow = true;
                this.handleResetForm();
                this.form.postName = this.postName;
                let visitor = uni.getStorageSync('Visitor')
                if (!visitor) return;
                visitor = JSON.parse(visitor)
                this.form.author = visitor.author;
                this.form.avatar = visitor.avatar;
                this.form.email = visitor.email;
                this.form.authorUrl = visitor.authorUrl;
            }
        }
    },
    methods: {
        handleResetForm() {
            this.params = {
                postName: '',
                title: '',
                form: '',
                formPage: '',
                type: 'post'
            }
            this.form = {
                allowNotification: true,
                author: '',
                avatar: '',
                authorUrl: '',
                content: '',
                email: '',
                postName: ""
            }
        },
        fnOnSubmit(e) {
            if (e === false) {
                return uni.$tm.toast('请检查所有的必填项是否填写完整！');
            }
            // if (!this.form.email) {
            // 	return uni.$tm.toast('未填写邮箱地址，将无法接收提醒！');
            // }
            // if (this.form.email && !uni.$tm.test.email(this.form.email)) {
            // 	return uni.$tm.toast('请填写正确的邮箱地址！');
            // }
            // if (this.form.authorUrl && !uni.$tm.test.url(this.form.authorUrl)) {
            // 	return uni.$tm.toast('请输入正确的Url地址！');
            // }
            this.fnHandle();
        },
        handleSetVisitor() {
            uni.setStorageSync('Visitor', JSON.stringify({
                author: this.form.author,
                avatar: this.form.avatar,
                email: this.form.email,
                authorUrl: this.form.authorUrl,
            }))
        },
        fnHandle() {
            uni.showLoading({
                title: '正在提交...'
            });

            // 评论
            if (this.isComment) {
                const commentForm = {
                    allowNotification: true,
                    raw: this.form.content,
                    content: this.form.content,
                    owner: {
                        avatar: this.form.avatar,
                        displayName: this.form.author,
                        email: this.form.email,
                        website: this.form.authorUrl,
                    },
                    subjectRef: {
                        group: "content.halo.run",
                        kind: "Post",
                        name: this.form.postName,
                        version: "v1alpha1",
                    }
                }
                this.$httpApi.v2.addPostComment(commentForm)
                    .then(res => {
                        uni.$tm.toast('评论成功，可能需要审核！');
                        // 更新评论者信息
                        this.handleSetVisitor();
                        this.handleClose(true)
                        this.handleResetForm()
                    })
                    .catch(err => {
                        uni.$tm.toast("评论失败");
                    });
                return;
            }

            // 回复
            const replyForm = {
                allowNotification: true,
                raw: this.form.content,
                content: this.form.content,
                owner: {
                    avatar: this.form.avatar,
                    displayName: this.form.author,
                    email: this.form.email,
                    website: this.form.authorUrl,
                },
                quoteReply: this.form.postName
            }
            this.$httpApi.v2.addPostCommentReply(this.form.postName, replyForm)
                .then(res => {
                    uni.$tm.toast('回复成功，可能需要审核！');
                    // 更新评论者信息
                    this.handleSetVisitor();
                    this.handleClose(true)
                    this.handleResetForm()
                })
                .catch(err => {
                    uni.$tm.toast("回复失败");
                });
        },
        handleOnChange(isOpen) {
            this.isShow = isOpen;
			if(!isOpen){
				this.$emit("on-close", {
					isSubmit:false,
					refresh: false
				})
			}
        },
        handleClose(refresh = false) {
            this.isShow = false;
            this.$emit("on-close", {
				isSubmit:true,
                refresh: refresh
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.title {
    margin: 24rpx 0;
}
</style>
