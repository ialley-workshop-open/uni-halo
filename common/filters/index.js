/**
 *  功能：全局过滤器
 *  作者：小莫唐尼
 *  邮箱：studio@925i.cn
 *  时间：2022年07月21日 17:39:04
 *  版本：v0.1.0
 *  修改记录：
 *  修改内容：
 *  修改人员：
 *  修改时间：
 */

export default {
	/**
	 * 功能描述：时间格式化，将指定的时间戳（或正常的日期）转换为带格式的日期
	 * 
	 * 参数说明：
	 * 		1.支持格式化 yyyy年MM月dd日 HH点mm分ss秒 星期w q季
	 * 		2.对象形式传入 { d:'2021-06-04',f:'yyyy年' }  d是必传项，f可不传（默认yyyy-MM-dd HH:mm:ss）
	 * 使用示例：
	 * 		1：<view>{{ dateTimeParamName | formatTime }}</view>
	 * 		2：<view>{{ { d: '2021-06-04', f: 'yyyy' } | formatTime }}</view>
	 * 		3：<view>{{ { d: dateTimeParamName, f: 'yyyy年MM月dd日 HH点mm分ss秒 星期w q季' } | formatTime }}</view>
	 * 特别说明： 由于uniapp中的filter 不支持多参数，但是允许传入对象的形式，故以此方式实现！
	 */
	formatTime: function(data) {
		let _dateTime = new Date(data);
		let _fmt = 'yyyy-MM-dd HH:mm:ss';
		if (_dateTime == 'Invalid Date') {
			if (data.d == undefined || data.d == null || data.d == "") {
				console.error('日期参数不正确，传入的参数列表：', data);
				return ''
			};
			_dateTime = new Date(data.d);
			if (_dateTime == 'Invalid Date') {
				console.error('日期参数不正确，传入的参数列表：', data);
				return '111'
			}
			if (data.hasOwnProperty('f')) {
				_fmt = data.f
			}
		}
		const _weekDays = ["日", "一", "二", "三", "四", "五", "六"];
		const _seasons = ["冬", "春", "夏", "秋"];
		const o = {
			"M+": _dateTime.getMonth() + 1, //月份
			"d+": _dateTime.getDate(), //日
			"H+": _dateTime.getHours(), //小时
			"m+": _dateTime.getMinutes(), //分
			"s+": _dateTime.getSeconds(), //秒
			"w+": _weekDays[_dateTime.getDay()], // 星期几
			"q+": _seasons[Math.floor((_dateTime.getMonth() + 3) / 3)], //季度
			S: _dateTime.getMilliseconds(), //毫秒
		};
		if (/(y+)/.test(_fmt)) {
			_fmt = _fmt.replace(
				RegExp.$1,
				(_dateTime.getFullYear() + "").substr(4 - RegExp.$1.length)
			);
		}
		for (let k in o) {
			if (new RegExp("(" + k + ")").test(_fmt)) {
				_fmt = _fmt.replace(
					RegExp.$1,
					RegExp.$1.length == 1 ?
					o[k] :
					("00" + o[k]).substr(("" + o[k]).length)
				);
			}
		}
		return _fmt;
	},

};
