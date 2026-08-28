/**
 * 从带换行的cookie原始串提取某一条cookie（带;结尾）
 * @param {string} cookieRaw set‑cookie原始字符串
 * @param {string} cookieKey cookie名称，例如 "comment-widget-captcha"
 * @returns {string} 清理换行后的cookie片段，没匹配返回''
 */
export function extractCookieItem(cookieRaw, cookieKey) {
	if (!cookieRaw || !cookieKey) return ''

	// 转义正则特殊字符
	function escapeRegExp(str) {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	}

	const keyEscaped = escapeRegExp(cookieKey)
	const reg = new RegExp(`${keyEscaped}=[\\s\\S]*?;`)
	const m = cookieRaw.match(reg)
	return m ? m[0].replace(/\r?\n/g, '') : ''
}

/**
 * 获取header中指定key的值，忽略大小写
 * @param {object} headers HTTP header对象
 * @param {string} name HTTP header键名
 * @returns {string} HTTP header值，没找到返回''
 */
export function getHeaderCaseInsensitive(headers, name) {
	if (!headers || typeof headers !== 'object') return '';
	const lowerName = name.toLowerCase();
	const key = Object.keys(headers).find(k => k.toLowerCase() === lowerName);
	return key ? headers[key] : '';
}