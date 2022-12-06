
// 混淆函数库
import mixin from './tool/mixin/mixin.js'


import dayjs from './tool/function/dayjs/index'
import util from './tool/function/util'

// 生成全局唯一guid字符串
import guid from './tool/function/guid.js'
// 延迟函数
import sleep from './tool/function/sleep.js'
// 打乱数组的顺序
import randomArray from './tool/function/randomArray.js'
// 对象和数组的深度克隆
import deepClone from './tool/function/deepClone.js'
// 对象深度拷贝
import deepMerge from './tool/function/deepMerge.js'


// 规则检验
import test from './tool/function/test.js'
// 随机数
import random from './tool/function/random.js'
// 去除空格
import trim from './tool/function/trim.js'
// toast提示，对uni.showToast的封装
import toast from './tool/function/toast.js'
// 获取父组件参数
import getParent from './tool/function/getParent.js'
// -----自定获取组件上的属性。
import getParentAttr from './tool/function/getParentAttr.js'
// -----自定获取单个父组件
import getParentAls from './tool/function/getParentAls.js'
// 上传文件库
import upload from './tool/function/upload.js'
// 预览文件
import preview from './tool/function/preview.js'

// obj转字样式style符串。  // -----自定
import {objToString} from './tool/function/objToString.js'
// 日历库
import calendar from './tool/function/calendar.js'

import HandwritingSelf from './tool/function/signBoard.js'
//抽奖模型。
import choujiang from './tool/function/choujianggailv.js'


// 配置信息
import config from './tool/config/config.js'
import store from './tool/store/tm-vuetify'  
import vx from './tool/function/vuex.js'  
import theme from './tool/function/theme.js'  
import request from './tool/request/index'  


const $tm = {
	
	sleep,
	request,
	objToString,
	dayjs:dayjs.dayjs,
	guid,
	upload,
	preview,
	randomArray,
	test,
	random,
	deepClone,
	deepMerge,
	getParent,
	getParentAttr,
	getParentAls,
	trim,
	toast,
	config, 
	calendar,
	HandwritingSelf,
	choujiang,
	vx:new vx(store),
	theme,
	u: util,

}



uni.$tm = $tm
const install = Vue => {
	Vue.mixin(mixin) 
	Vue.prototype.$tm = {...$tm}
	
	// Vue.prototype.$store = store
	
}

export default {
	install
}