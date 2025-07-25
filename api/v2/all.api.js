/**
 * 所有的接口
 */
import {getPersonalToken} from '@/utils/token.js'
import HttpHandler from '@/common/http/request.js'
import qs from 'qs'

import {getAppConfigs} from '@/config/index.js'

export default {
    /**
     * 获取文章列表
     * @param {Object} params 参数
     */
    getPostList: (params) => {
        return HttpHandler.Get(`/apis/api.content.halo.run/v1alpha1/posts`, params)
    },

    /**
     * 根据名称获取文章
     * @param {String} name 分类名称
     */
    getPostByName: (name) => {
        return HttpHandler.Get(`/apis/api.content.halo.run/v1alpha1/posts/${name}`, {}, {
            header: {
                'Wechat-Session-Id': uni.getStorageSync('openid'),
            }
        })
    },

    /**
     * 搜索文章
     * @param {Object} params 数据
     */
    getPostListByKeyword: (params) => {
        // return HttpHandler.Get(`/apis/api.halo.run/v1alpha1/indices/post`, params)
        return HttpHandler.Post(`/apis/api.halo.run/v1alpha1/indices/-/search`, params)
    },

    /**
     * 查询分类列表
     * @param {Object} params  查询参数
     */
    getCategoryList: (params) => {
        const param = qs.stringify(params, {
            allowDots: true,
            encodeValuesOnly: true,
            skipNulls: true,
            encode: false,
            arrayFormat: 'repeat'
        })
        return HttpHandler.Get(`/apis/api.content.halo.run/v1alpha1/categories?${param}`, {})
    },
    /**
     * 查询分类下的文章
     * @param {String} name  分类名称
     * @param {Object} params  查询参数
     */
    getCategoryPostList: (name, params) => {
        return HttpHandler.Get(`/apis/api.content.halo.run/v1alpha1/categories/${name}/posts`, params)
    },


    /**
     * 获取评论列表接口（列表数据）
     * @param {Object} params  查询参数
     */
    getPostCommentList: (params) => {
        return HttpHandler.Get(`/apis/api.halo.run/v1alpha1/comments`, params)
    },

    /**
     * 获取回复列表
     * @param {String} commentName  名称
     * @param {Object} params  查询参数
     */
    getPostCommentReplyList: (commentName, params) => {
        return HttpHandler.Get(`/apis/api.halo.run/v1alpha1/comments/${commentName}/reply`, params)
    },

    // 提交评论
    addPostComment: (data) => {
        return HttpHandler.Post(`/apis/api.halo.run/v1alpha1/comments`, data)
    },
    // 提交回复
    addPostCommentReply: (commentName, data) => {
        return HttpHandler.Post(`/apis/api.halo.run/v1alpha1/comments/${commentName}/reply`, data)
    },

    /**
     * 获取标签列表
     * @param {Object} params  查询参数
     */
    getTagList: (params) => {
        return HttpHandler.Get(`/apis/api.content.halo.run/v1alpha1/tags`, params)
    },

    /**
     * 根据标签获取文章列表
     * @param {String} tagName  参数
     * @param {Object} params  查询参数
     */
    getPostByTagName: (tagName, params) => {
        return HttpHandler.Get(`/apis/api.content.halo.run/v1alpha1/tags/${tagName}/posts`, params)
    },

    /**
     * 获取瞬间列表
     */
    getMomentList: (params) => {
        return HttpHandler.Get(`/apis/moment.halo.run/v1alpha1/moments`, params, {
            custom: {
                personalToken: getPersonalToken()
            }
        })
    },
	
	/**
	 * 获取瞬间详情
     * @param {String} name 瞬间id
	 */
	getMomentByName: (name) => {
	    return HttpHandler.Get(`/apis/moment.halo.run/v1alpha1/moments/${name}`, {}, {
	        custom: {
	            personalToken: getPersonalToken()
	        }
	    })
	},

    /**
     * 查询站点统计信息
     */
    getBlogStatistics: () => {
        return HttpHandler.Get(`/apis/api.halo.run/v1alpha1/stats/-`, {})
    },


    /**
     * 获取相册分组
     */
    getPhotoGroupList: (params) => {
        return HttpHandler.Get(`/apis/core.halo.run/v1alpha1/photogroups`, params, {
            custom: {
                personalToken: getPersonalToken()
            }
        })
    },


    /**
     * 根据分组获取相册
     */
    getPhotoListByGroupName: (params) => {
        return HttpHandler.Get(`/apis/console.api.photo.halo.run/v1alpha1/photos`, params, {
            custom: {
                personalToken: getPersonalToken()
            }
        })
    },

    /**
     * 获取友链分组
     */
    getFriendLinkGroupList: (params) => {
        return HttpHandler.Get(`/apis/core.halo.run/v1alpha1/linkgroups`, params, {
            custom: {
                personalToken: getPersonalToken()
            }
        })
    },

    /**
     * 获取友链
     */
    getFriendLinkList: (params) => {
        return HttpHandler.Get(`/apis/api.plugin.halo.run/v1alpha1/plugins/PluginLinks/links`, params)
    },

    /**
     * 限制阅读校验
     * @param restrictType
     * @param code
     * @param keyId
     * @returns {HttpPromise<any>}
     */
    requestRestrictReadCheck: (restrictType, code, keyId) => {
        const params = {
            code: code,
            templateType: 'post',
            restrictType: restrictType,
            keyId: keyId
        }
        return HttpHandler.Post(`/apis/tools.muyin.site/v1alpha1/restrict-read/check`, params, {
            header: {
                'Authorization': getAppConfigs().pluginConfig.toolsPlugin?.Authorization,
                'Wechat-Session-Id': uni.getStorageSync('openid'),
            }
        })
    },

    /**
     * 获取文章验证码
     */
    createVerificationCode: () => {
        return HttpHandler.Get(`/apis/tools.muyin.site/v1alpha1/restrict-read/create`, null, {
            header: {
                'Authorization': getAppConfigs().pluginConfig.toolsPlugin?.Authorization,
                'Wechat-Session-Id': uni.getStorageSync('openid'),
            }
        })
    },

    /**
     * 提交友情链接
     */
    submitLink(form) {
        return HttpHandler.Post(`/apis/linksSubmit.muyin.site/v1alpha1/submit`, form, {
            header: {
                'Authorization': getAppConfigs().pluginConfig.linksSubmitPlugin?.Authorization,
                'Wechat-Session-Id': uni.getStorageSync('openid'),
            }
        })
    },
    /**
     * 获取二维码信息
     */
    getQRCodeInfo: (key) => {
        return HttpHandler.Get(`/apis/api.uni.uhalo.pro/v1alpha1/plugins/plugin-uni-halo/getQRCodeInfo/${key}`,
            null, {})
    },
    /**
     * 获取二维码图片
     */
    getQRCodeImg: (postId) => {
        return HttpHandler.Get(`/apis/api.uni.uhalo.pro/v1alpha1/plugins/plugin-uni-halo/getQRCodeImg/${postId}`,
            null, {})
    },
    /**
     * 点赞
     * @param {*} data ={group, plural, name}
     */
    submitUpvote(data) {
        return HttpHandler.Post(`/apis/api.halo.run/v1alpha1/trackers/upvote`, data, {})
    }

}
