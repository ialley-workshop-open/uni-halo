import App from "./App";
import Vue from "vue";

// 挂载全局工具类
import utils from "./utils/index.js";
Vue.prototype.$utils = utils;

// 全局统一样式的对话框
import Fy from '@/js_sdk/fy-showModal/index.js'
uni.$eShowModal = (e = {}) => {
	return Fy.showModal(e)
};

// 全局混入
import AppMixin from "@/common/mixins/index.js";
Vue.use(AppMixin);

// 全局过滤器
import AppFilters from "@/common/filters/index.js";
for (let fKey in AppFilters) {
	Vue.filter(fKey, AppFilters[fKey]);
}

// 引用tmUI2.x框架
import tmVuetify from "./tm-vuetify";
Vue.use(tmVuetify);

// i18n部分的配置
// 引入语言包，注意路径
import Chinese from "@/common/locales/zh.js";
import English from "@/common/locales/en.js";

// 引入并使用vue-i18n
import VueI18n from "vue-i18n";
Vue.use(VueI18n);

// 构造i18n对象
const i18n = new VueI18n({
	// 默认语言，这里的local属性，对应message中的zh、en属性
	locale: uni.getStorageSync("Default_Lang") || "zh",
	// 引入语言文件
	messages: {
		// 这里的属性名是任意的，您也可以把zh设置为cn等，只是后续切换语言时
		// 要标识这里的语言属性，如：this.$i18n.locale = zh|en|cn|xxx
		zh: Chinese,
		en: English,
	},
});

// 引入请求库
import {
	http
} from "./common/http/index.js";
Vue.prototype.$http = http;

// 全局api管理
import ApiManager from '@/api/index.js'
Vue.use(ApiManager);

import HaloTokenConfig from '@/config/token.config.js'
Vue.prototype.$baseApiUrl = HaloTokenConfig.BASE_API

// 由于微信小程序的运行机制问题，需声明如下一行，H5和APP非必填
Vue.prototype._i18n = i18n;

Vue.config.productionTip = false;
App.mpType = "app";
const app = new Vue({
	i18n,
	...App,
});

app.$mount();
