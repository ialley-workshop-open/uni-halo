/**
 *  功能：工具类
 *  作者：小莫唐尼
 *  邮箱：studio@925i.cn
 *  时间：2022年07月21日 17:30:14
 *  版本：v0.1.0
 *  修改记录：
 *  修改内容：
 *  修改人员：
 *  修改时间：
 */

import HaloConfig from '@/config/halo.config.js';

const utils = {
	/**
	 * 检查是否为http/https链接
	 */
	checkIsUrl: function(s) {
		var reg = /^(http(s)?:\/\/)/i;
		return reg.test(s)
	},

	// 检查链接
	checkUrl: function(url) {
		if (!url) return '';
		if (!this.checkIsUrl(url)) return HaloConfig.apiUrl + url;
		return url
	},

	// 检查封面图
	checkThumbnailUrl: function(thumbnail) {
		if (!thumbnail) return HaloConfig.defaultThumbnailUrl + `&r=${new Date().getTime()}`;
		if (!this.checkIsUrl(thumbnail)) return HaloConfig.apiUrl + thumbnail;
		return thumbnail
	},

	// 检查图片
	checkImageUrl: function(image) {
		if (!image) return HaloConfig.defaultImageUrl + `&r=${new Date().getTime()}`;
		if (!this.checkIsUrl(image)) return HaloConfig.apiUrl + image;
		return image
	},

	// 检查头像
	checkAvatarUrl: function(avatar, isAdmin = false) {
		if (isAdmin) return HaloConfig.author.avatar;
		if (!avatar) {
			return HaloConfig.defaultAvatarUrl + `&r=${new Date().getTime()}`;
		}
		if (!this.checkIsUrl(avatar)) return HaloConfig.apiUrl + avatar;
		return avatar
	},

	// 检查文件类型
	fnCheckIsFileType(type, attachment) {
		if (!attachment) return false;
		if (!attachment.mediaType) return false;
		if (type == 'video') return attachment.mediaType.indexOf('video/') != -1;
		else if (type == 'image') return attachment.mediaType.indexOf('image/') != -1;
		else return false;
	},
	groupData: function(arr, fun) {
		const groups = {}
		arr.forEach((el) => {
			const group = fun(el)
			groups[group] = groups[group] || []
			groups[group].push(el)
		})
		return Object.keys(groups).map((group) => {
			// 更改data的数据结构  可以改变新数据的结构 data即为newData的数组中每个数据的结构
			let data = {
				groupName: group,
				data: groups[group]
			}
			return data
		})
	},
	/**
	 * 数据分组
	 * @param {Object} oldData 数据源
	 * @param {Object} prop 分组属性
	 */
	arrayGroupBy: function(oldData, prop) {
		const newData = this.groupData(oldData, (item) => {
			return item[prop]
		})
		return newData
	},
	/**
	 * 深克隆
	 * @param {Object} obj 数据源
	 */
	deepClone(obj) {
		var objClone = Array.isArray(obj) ? [] : {};
		if (obj && typeof obj === "object") {
			for (const key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (obj[key] && typeof obj[key] === "object") {
						objClone[key] = this.deepClone(obj[key]);
					} else {
						objClone[key] = obj[key];
					}
				}
			}
		}
		return objClone;
	},
	/**
	 * 复制内容到剪贴板
	 * @param {Object} obj 数据源
	 */
	copyText(content, tips = '复制成功') {
		uni.setClipboardData({
			data: content,
			showToast: false,
			success: () => {
				if (tips) {
					uni.showToast({
						icon: 'none',
						title: tips
					})
				}
			}
		})
	},
	previewImage(list) {
		list = list.map(item => {
			return this.checkUrl(item)
		})
		uni.previewImage({
			urls: list,
			loop: true
		})
	}
};


export default utils;
