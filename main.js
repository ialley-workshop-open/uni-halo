import App from "./App";
import Vue from "vue";

// 挂载全局工具类
import utils from "./utils/index.js";
Vue.prototype.$utils = utils;
uni.$utils = utils;

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
 
// 引入请求库
import {
	http
} from "./common/http/index.js";
Vue.prototype.$http = http;

// 全局api管理
import ApiManager from '@/api/index.js'
Vue.use(ApiManager);

import HaloTokenConfig from '@/config/uhalo.config.js'
Vue.prototype.$baseApiUrl = HaloTokenConfig.BASE_API

Vue.config.productionTip = false;
App.mpType = "app";
const app = new Vue({
	...App,
});

app.$mount();
