/**
 *  功能：博客作者信息
 *  作者：小莫唐尼
 *  邮箱：studio@925i.cn
 *  时间：2022年07月21日 18:41:44
 *  版本：v0.1.0
 *  修改记录：
 *  修改内容：
 *  修改人员：
 *  修改时间：
 */
import Blogger from '@/api/blogger.js'
export default {
	state: {
		blogger: {},
	},
	getters: {
		getBlogger(state) {
			return state.blogger
		},
	},
	mutations: {
		setBlogger(state, data) {
			state.blogger = data;
		},
	},
	actions: {
		//通过actions提交更新数据
		fnGetBlogger({
			commit
		}) {
			Blogger.getBloggerInfo().then((res) => {
				console.log('获取博主信息成功：');
				console.log(res);
				commit("setBlogger", res.data);
			}).catch((err) => {
				console.log('哈哈，获取博主信息失败啦！');
				console.log(err);
			});
		},
	},
};
