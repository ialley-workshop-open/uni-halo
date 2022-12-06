
// #ifdef H5
var clipboardJS = require('./clipboardJS');

// #endif

/**
 * 预览图片。
 @param {Object} url 必填 当前预览的图片链接。
 @param {Object} list 可以是url数组，也可以是对象，数据比如：["http:url"] or [{url:"https:url",...}]
 @param {Object} rangKey 如果list是对象数组，需要提供url字段。
 */
import { previewImg } from "./preview.js"

/**
* 数据分组
* @param {Array} oArr - 原数组列表
* @param {Number} length - 单个数组长度
* @return {Array}  arr - 分组后的新数组
*/
function splitData(oArr = [], length = 1) {
	let arr = [];
	let minArr = [];
	oArr.forEach(c => {
		if (minArr.length === length) {
			minArr = [];
		}
		if (minArr.length === 0) {
			arr.push(minArr);
		}
		minArr.push(c);
	});

	return arr;
}

/**
* 剩余时间格式化
* @param {Number} t - 剩余多少秒
* @return {Object}  format - 格式后的天时分秒对象
*/
function timeMuch(t) {
	let format = {
		d: '00',
		h: '00',
		m: '00',
		s: '00'
	};
	if (t > 0) {
		let d = Math.floor(t / 86400);
		let h = Math.floor((t / 3600) % 24);
		let m = Math.floor((t / 60) % 60);
		let s = Math.floor(t % 60);
		format.d = d < 10 ? '0' + d : d;
		format.h = h < 10 ? '0' + h : h;
		format.m = m < 10 ? '0' + m : m;
		format.s = s < 10 ? '0' + s : s;
	}
	return format;
}
/**
* 打电话
* @param {String<Number>} phoneNumber - 数字字符串
* @return {Promise}
*/
function callPhone(phoneNumber = '') {
	let num = phoneNumber.toString()
	return new Promise((rs,rj)=>{
		uni.makePhoneCall({
			phoneNumber: num,
			success:()=> rs(),
			fail:(err)=> rj(err)
		});
	})
}

/**
 * 调起客户端相机扫码。
 * @param {Boolean} onlyFromCamera true 是否只允许相机扫码识别
 * @param {Array<string>} scanType ['barCode', 'qrCode', 'datamatrix','datamatrix']
 * @returns Promise 成功返回相关数据结构
 */
function scanCode(onlyFromCamera = true, scanType = ['barCode', 'qrCode', 'datamatrix','datamatrix']){
	// #ifdef H5
	return Promise.reject('不支持H5');
	// #endif
	return new Promise((rs,rj)=>{
		uni.scanCode({
			onlyFromCamera: onlyFromCamera,
			scanType: scanType,
			success: (res) => rs(res),
			fail:(error)=>rj(error)
		});
	})
}

/**
 * 设置剪切板内容。
 * @param {String} data 
 * @returns Promise true/false
 */
function setClipboardData(data){

	// #ifndef H5
	return new Promise((rs,rj)=>{
		uni.setClipboardData({
			data: data,
			success:()=>rs(true),
			fail:(error)=>rj(error)
		});
	})
	// #endif
	// #ifdef H5
	return new Promise((rs,rj)=>{
		let btn = document.createElement('button');
		btn.style.display = 'none';
		btn.className='hi-test-hi';
		document.body.appendChild(btn);
		clipboardJS = clipboardJS.bind(window);
		let cb = new clipboardJS('.hi-test-hi', {
			text: () => data
		})
		
		cb.on('success', function (res) {
			rs(true);
		})
		cb.on('error', function (err) {
			rj(err)
		})
		btn.click = btn.click.bind(window.document.body.querySelector('.hi-test-hi'))
		btn.click()
	})
	// #endif
}
/**
 * 获取剪切板内容
 * @returns Promise 剪切板内容
 */
function getClipboardData(){
	// #ifndef H5
	return new Promise((rs, rj) => {
		uni.getClipboardData({
			success: (res) => rs(res.data),
			fail: (error) => rj(error)
		});
	})
	// #endif
	// #ifdef H5
	return Promise.reject('H5无法获取剪切板内容')
	// #endif
}

/**
 * 设置cookie数据
 * @param {String} key 键值
 * @param {String} data 值
 * @returns Boolean
 */
function setCookie(key, data) {
	try {
		uni.setStorageSync(key, data);
		return true;
	} catch (e) {
		return false;
	}
}
/**
 * 删除一个本地cookie
 * @param {String} key 键值
 * @returns Boolean
 */
function delCookie(key) {
	try {
		uni.removeStorageSync(key);
		return true;
	} catch (e) {
		return false;
	}
}

/**
 * 获取一个cookie数据
 * 如果存入的是对象，返回的也是对象。如果是string返回的也是字符串。
 * @param {String} key 键
 * @returns json/string
 */
function getCookie(key) {
	try {
		const value = uni.getStorageSync(key);
		try {
			let val = JSON.parse(value)
			return val;
		} catch (e) {
			return value;
		}
	} catch (e) {
		return undefined;
	}
}


/**
 * 向地址连接追加参数。
 * @param {string} uri 网址
 * @param {string} key 字段
 * @param {string} value 字段值
 * @returns 
 */
function httpUrlAddKey(uri, key, value) {
	if (!value) {
		return uri;
	}
	var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
	var separator = uri.indexOf("?") !== -1 ? "&" : "?";
	if (uri.match(re)) {
		return uri.replace(re, "$1" + key + "=" + value + "$2");
	} else {
		return uri + separator + key + "=" + value;
	}
}

export default {
	previewImg,//预览图片。
	splitData,//数据分组
	timeMuch,//剩余时间格式化
	callPhone,//打电话
	scanCode,//调起客户端相机扫码。
	setClipboardData, //设置剪切板内容。
	getClipboardData,//获取剪切板内容
	setCookie,//设置cookie数据
	delCookie,//删除一个本地cookie
	getCookie,//获取一个cookie数据
	httpUrlAddKey,//向地址连接追加参数
}
