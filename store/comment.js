/**
 *  功能：临时存储评论用户信息（用于评论）
 *  作者：小莫唐尼
 *  邮箱：studio@925i.cn
 *  时间：2022年07月21日 18:41:44
 *  版本：v0.1.0
 *  修改记录：
 *  修改内容：
 *  修改人员：
 *  修改时间：
 */
export default {
	namespaced: true,
	state: {
		commentInfo: {},
	},
	getters: {
		getCommentInfo(state) {
			return state.commentInfo
		},
	},
	mutations: {
		setCommentInfo(state, data) {
			state.commentInfo = data;
		},
	},
};
