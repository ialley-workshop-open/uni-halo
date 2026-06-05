import {
	getPersonalToken
} from '@/utils/token.js'
import HttpHandler from '@/common/http/request.js'
import qs from 'qs'

import {
	getAppConfigs
} from '@/config/index.js'
import { getNologinEmail, getOpenid } from "@/utils/auth";

export default {
	getPostList: (params) => {
		return HttpHandler.Get(`/apis/api.content.halo.run/v1alpha1/posts`, params)
	},

	getPostByName: (name) => {
		return HttpHandler.Get(`/apis/api.content.halo.run/v1alpha1/posts/${name}`, {}, {
			header: {
				'Wechat-Session-Id': getOpenid(),
				'nologin-email': getNologinEmail()
			}
		})
	},

	getPostListByKeyword: (params) => {
		return HttpHandler.Post(`/apis/api.halo.run/v1alpha1/indices/-/search`, params)
	},

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

	getCategoryPostList: (name, params) => {
		return HttpHandler.Get(`/apis/api.content.halo.run/v1alpha1/categories/${name}/posts`, params)
	},


	getPostCommentList: (params) => {
		return HttpHandler.Get(`/apis/api.halo.run/v1alpha1/comments`, params)
	},

	getPostCommentReplyList: (commentName, params) => {
		return HttpHandler.Get(`/apis/api.halo.run/v1alpha1/comments/${commentName}/reply`, params)
	},

	addPostComment: (data) => {
		return HttpHandler.Post(`/apis/api.halo.run/v1alpha1/comments`, data)
	},

	addPostCommentReply: (commentName, data) => {
		return HttpHandler.Post(`/apis/api.halo.run/v1alpha1/comments/${commentName}/reply`, data)
	},

	getTagList: (params) => {
		return HttpHandler.Get(`/apis/api.content.halo.run/v1alpha1/tags`, params)
	},

	getPostByTagName: (tagName, params) => {
		return HttpHandler.Get(`/apis/api.content.halo.run/v1alpha1/tags/${tagName}/posts`, params)
	},

	getMomentList: (params) => {
		return HttpHandler.Get(`/apis/api.moment.halo.run/v1alpha1/moments`, params, {
			custom: {
				personalToken: getPersonalToken()
			}
		})
	},

	getMomentByName: (name) => {
		return HttpHandler.Get(`/apis/api.moment.halo.run/v1alpha1/moments/${name}`, {}, {
			custom: {
				personalToken: getPersonalToken()
			}
		})
	},

	getBlogStatistics: () => {
		return HttpHandler.Get(`/apis/api.halo.run/v1alpha1/stats/-`, {})
	},

	getPhotoGroupList: (params) => {
		return HttpHandler.Get(`/apis/api.photo.halo.run/v1alpha1/photogroups`, params)
	},

	getPhotoListByGroupName: (params) => {
		return HttpHandler.Get(`/apis/api.photo.halo.run/v1alpha1/photos`, params)
	},

	getFriendLinkGroupList: (params) => {
		return HttpHandler.Get(`/apis/api.link.halo.run/v1alpha1/linkgroups`, params)
	},

	getFriendLinkList: (params) => {
		return HttpHandler.Get(`/apis/api.link.halo.run/v1alpha1/links`, params)
	},

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
				'Wechat-Session-Id': getOpenid(),
				'nologin-email': getNologinEmail()
			}
		})
	},

	createVerificationCode: () => {
		return HttpHandler.Get(`/apis/tools.muyin.site/v1alpha1/restrict-read/create`, null, {
			header: {
				'Authorization': getAppConfigs().pluginConfig.toolsPlugin?.Authorization,
				'Wechat-Session-Id': getOpenid(),
			}
		})
	},

	submitLink(form) {
		return HttpHandler.Post(`/apis/linkssubmit.muyin.site/v1alpha1/submit`, form, {
			header: {
				'Authorization': getAppConfigs().pluginConfig.linksSubmitPlugin?.Authorization,
				'Wechat-Session-Id': getOpenid(),
			}
		})
	},

	getQRCodeInfo: (key) => {
		return HttpHandler.Get(`/apis/api.uni.uhalo.pro/v1alpha1/plugins/plugin-uni-halo/getQRCodeInfo/${key}`,
			null, {})
	},

	getQRCodeImg: (postId) => {
		return HttpHandler.Get(`/apis/api.uni.uhalo.pro/v1alpha1/plugins/plugin-uni-halo/getQRCodeImg/${postId}`,
			null, {})
	},

	submitUpvote(data) {
		return HttpHandler.Post(`/apis/api.halo.run/v1alpha1/trackers/upvote`, data, {})
	},

	getVoteList: (params) => {
		return HttpHandler.Get(`/apis/api.vote.kunkunyu.com/v1alpha1/votes`, params)
	},

	getVoteDetail: (name) => {
		return HttpHandler.Get(`/apis/api.vote.kunkunyu.com/v1alpha1/votes/${name}/detail`, {})
	},

	getVoteUserList: (name) => {
		return HttpHandler.Get(`/apis/api.vote.kunkunyu.com/v1alpha1/votes/${name}/user-list`, {})
	},

	submitVote: (name, data, canAnonymously = true) => {
		return HttpHandler.Post(`/apis/api.vote.kunkunyu.com/v1alpha1/votes/${name}/submit`, data, {
			custom: {
				personalToken: canAnonymously ? undefined : getPersonalToken()
			}
		})
	},

	checkPluginAvailable: (name) => {
		return HttpHandler.Get(`/apis/api.plugin.halo.run/v1alpha1/plugins/${name}/available`, {})
	},

	getDoubanDetail: (url) => {
		return HttpHandler.Get(`/apis/api.douban.moony.la/v1alpha1/doubanmovies/-/getDoubanDetail`, { url })
	},
	
	postTrackersCounter: (data) => {
		return HttpHandler.Post(`/apis/api.halo.run/v1alpha1/trackers/counter`, data)
	},
}