/**
 *  功能：随机数工具
 *  作者：小莫唐尼
 *  邮箱：studio@925i.cn
 *  时间：2022年07月19日 11:34:02
 *  版本：v0.1.0
 *  修改记录：
 *  修改内容：
 *  修改人员：
 *  修改时间：
 */

/**
 * 指定范围生成随机数
 * @param {Number} m
 * @param {Number} n
 * @return {Number}
 */
export function GetRandomNumberByRange(m, n) {
	return Math.floor(Math.random() * (m - n) + n);
}

/**
 * 获取随机数组长度
 * @param {*} len 数组长度
 * @param {*} min 最小值
 * @param {*} max 最大值
 */
export function GetRandomNumberArray(len, min, max) {
	let arr = [];
	for (let index = 0; index < len; index++) {
		arr.push(GetRandomNumberByRange(min, max));
	}
	return arr;
}
