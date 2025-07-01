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

import HaloTokenConfig from '@/config/uhalo.config.js'
import {getAppConfigs} from '@/config/index.js'

const utils = {
    /**
     * 检查是否为http/https链接
     */
    checkIsUrl: function (s) {
        var reg = /^(http(s)?:\/\/)/i;
        return reg.test(s)
    },

    // 检查链接
    checkUrl: function (url) {
        if (!url) return '';
        if (!this.checkIsUrl(url)) return HaloTokenConfig.BASE_API + url;
        return url
    },

    // 检查封面图
    checkThumbnailUrl: function (thumbnail, mustRealUrl = false) {
        if (!thumbnail && mustRealUrl) {
            return this.checkUrl(getAppConfigs().imagesConfig.defaultStaticThumbnailUrl);
        }
        let _url = this.checkUrl(getAppConfigs().imagesConfig.defaultThumbnailUrl);
        if (_url) {
            if (_url.indexOf('?') === -1) {
                _url += `?next-v=${new Date().getTime()}`
            } else {
                _url += `&next-v=${new Date().getTime()}`
            }
        }
        if (!thumbnail) return _url;
        if (!this.checkIsUrl(thumbnail)) return HaloTokenConfig.BASE_API + thumbnail;
        return thumbnail
    },

    // 检查图片
    checkImageUrl: function (image) {
        let _url
        this.checkUrl(getAppConfigs().imagesConfig.defaultImageUrl);
        if (_url) {
            if (_url.indexOf('?') === -1) {
                _url += `?next-v=${new Date().getTime()}`
            } else {
                _url += `&next-v=${new Date().getTime()}`
            }
        }
        if (!image) return _url;
        if (!this.checkIsUrl(image)) return HaloTokenConfig.BASE_API + image;
        return image
    },

    // 检查头像
    checkAvatarUrl: function (avatar) {
        if (!avatar) {
            let _url = this.checkUrl(getAppConfigs().imagesConfig.defaultAvatarUrl);
            if (_url) {
                if (_url.indexOf('?') === -1) {
                    _url += `?next-v=${new Date().getTime()}`
                } else {
                    _url += `&next-v=${new Date().getTime()}`
                }
            }
            return _url;
        }
        if (!this.checkIsUrl(avatar)) return HaloTokenConfig.BASE_API + avatar;
        return avatar
    },

    // 检查文件类型
    fnCheckIsFileType(type, attachment) {
        if (!attachment) return false;
        if (!attachment.mediaType) return false;
        if (type === 'video') return attachment.mediaType.indexOf('video/') !== -1;
        else if (type === 'image') return attachment.mediaType.indexOf('image/') !== -1;
        else return false;
    },
    groupData: function (arr, fun) {
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
    arrayGroupBy: function (oldData, prop) {
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
    },
    /**
     * 检查是否为json字符串
     * @param {Object} jsonStr 数据源
     */
    checkJsonAndParse(jsonStr) {
        try {
            const jsonResult = JSON.parse(jsonStr);
            return {
                ok: true,
                jsonData: jsonResult,
            }
        } catch (e) {
            return {
                ok: false,
                jsonData: {},
            }
        }
    },
    isObject(obj) {
        return obj && typeof obj === 'object' && !Array.isArray(obj);
    },
    deepMerge(target, source) {
        let output = Object.assign({}, target);

        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                const targetValue = target[key];
                const sourceValue = source[key];

                if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
                    output[key] = targetValue.concat(sourceValue);
                } else if (this.isObject(targetValue) && this.isObject(sourceValue)) {
                    output[key] = this.deepMerge(targetValue, sourceValue);
                } else {
                    output[key] = sourceValue;
                }
            });
        }
        return output;
    }

};


export default utils;
