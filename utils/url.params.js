/**
 * 对象转换为url参数形式
 * @param {Object} param 将要转换为URL参数的字符串对象
 * @param {String} key URL 参数字符串的前缀
 * @param {Boolean} encode 是否进行URL编码，默认为true
 * @return {String} URL参数字符串
 */
export function jsonToUrlParams(param, key, encode) {
	if (param == null) return '';
	let paramStr = '';
	let t = typeof(param);
	if (t == 'string' || t == 'number' || t == 'boolean') {
		paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
	} else {
		for (var i in param) {
			var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
			paramStr += jsonToUrlParams(param[i], k, encode);
		}
	}
	return paramStr;
}


/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
	const newArray = []
	for (let i = 0; i < actual.length; i++) {
		if (actual[i]) {
			newArray.push(actual[i])
		}
	}
	return newArray
}


/**
 * json对象转Url参数2
 * @param {Object} json
 * @returns {Array}
 */
export function jsonToUrlParams2(json) {
	if (!json) return ''
	return cleanArray(
		Object.keys(json).map(key => {
			if (json[key] === undefined) return ''
			return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
		})
	).join('&')
}
