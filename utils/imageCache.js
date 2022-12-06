/**
 * 图片缓存
 */

/*
 * @description 获取文件的缓存路径，如果文件未缓存，则直接返回网络路径，并下载缓存
 * @method getImageCache
 * @param {String} filePath 完整的图片下载路径，如果没有从缓存中获取到，则用这个路径去下载
 * @param {String} fileMd5 文件md5，必须唯一
 * @return {Object} promise对象
 */
const getImageCache = (filePath, fileMd5) => {
	// 图片缓存key值
	let storageKey = 'IMAGE_CACHE_INFO_' + fileMd5
	// 首先获取本地存储的数据，查询是否有对应文件路径，如果有缓存内容，直接返回
	const cacheFileInfo = uni.getStorageSync(storageKey)
	if (cacheFileInfo) {
		// console.log("已缓存为：" + cacheFileInfo)
		return cacheFileInfo
	} else {
		// console.log("未缓存,进行下载保存")
		// 如果没有，执行下载，并存储起来后
		uni.downloadFile({
			url: filePath,
			success: (res) => {
				if (res.statusCode === 200) {
					// console.log('下载成功');
					// 再进行本地保存
					uni.saveFile({
						tempFilePath: res.tempFilePath,
						success: function(res2) {
							uni.setStorageSync(storageKey, res2.savedFilePath)
							return res2.savedFilePath
						},
						fail: function(res2) {
							return filePath
						}
					})
				} else {
					return filePath
				}
			},
			fail: (res) => {
				return filePath
			}
		})
	}
}

export default {
	getImageCache
}
