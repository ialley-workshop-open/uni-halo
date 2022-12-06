/**
 *  功能：临时存储日记信息（用于编辑）
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
		journalInfo: null,
	},
	getters: {
		getJournalInfo(state) {
			return state.journalInfo
		},
	},
	mutations: {
		setJournalInfo(state, data) {
			state.journalInfo = data;
		},
	},
};
