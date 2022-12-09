import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

let moduleTrue = {};
// 为了兼容如果用户，不按规范创建，或者不使用vuex时就可略过导入用户的模块。
try {
	const modulesList = require.context('@/store', true, /\.js$/);

	if (typeof modulesList === 'function' && typeof modulesList !== 'undefined') {
		// 加载modules目录下所有文件(分模块)
		const modules = modulesList.keys().reduce((modules, modulePath) => {
			const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
			const value = modulesList(modulePath)
			modules[moduleName] = { namespaced: true, ...value.default }

			return modules

		}, {});
		moduleTrue = modules;
	}

} catch (e) {
	//TODO handle the exception
	// console.warn('tmui提醒：用户未使用vuex')
	console.error('如果未使用vuex，不用理会，如果使用了vuex报错请检错误信息：',e);
}
let pdefault_cookies_color = uni.getStorageSync('setTmVuetifyColor')
let pdefault_cookies_black = uni.getStorageSync('setTmVuetifyBlack')



const store = new Vuex.Store({
	modules: {
		...moduleTrue
	},
	state: {
		tmVuetify: {
			color: typeof pdefault_cookies_color === 'string' ? pdefault_cookies_color : '',
			black: typeof pdefault_cookies_black === 'boolean' ? pdefault_cookies_black : false,
			tmVueTifly_pages: '',
			tmVueTifly_pagesIndex: '',
			//这里是微信小程序和微信H5的配置资料。
			wxshareConfig_miniMp: {
				title: '', 		// 分享标题
				desc: '', 		// 描述
				imageUrl: '', 		// 分享图片
				path: '', 		// 分享路径
				copyLink: '', 	// 复制链接
				query: {},		// 分享参数
			}
		},
	},
	getters: {
		// $tm:state=>{
		// 	return $tm;
		// }
		
	},
	mutations: {
		setTmVuetifyColor(state, color) {
			Vue.set(state.tmVuetify, 'color', color)
		},
		setPageNow(state, url) {
			Vue.set(state.tmVuetify, 'tmVueTifly_pages', url);
		},
		setPageNowIndex(state, index) {
			Vue.set(state.tmVuetify, 'tmVueTifly_pagesIndex', index);
		},
		setTmVuetifyBlack(state, black) {
			Vue.set(state.tmVuetify, 'black', black)
			if (black === true) {
				uni.setTabBarStyle({
					backgroundColor: "#212121"
				})
			} else {
				uni.setTabBarStyle({
					backgroundColor: "#FFFFFF"
				})
			}
		},
		setWxShare(state, cfg) {
			
			let pcf = cfg||{};
			if(typeof pcf !=='object' || Array.isArray(cfg)) pcf = {}; 
			Vue.set(state.tmVuetify, 'wxshareConfig_miniMp', { ...state.tmVuetify.wxshareConfig_miniMp,...pcf});
			
		}
	}
})

export default store;