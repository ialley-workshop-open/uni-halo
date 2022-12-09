

/**
 * 验证电子邮箱格式
 */
function email(value) {
	return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value);
}

/**
 * 验证手机格式
 */
function mobile(value) {
	return /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(value)
}

/**
 * 验证URL格式
 */
function url(value) {
	return /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i.test(value)
}

/**
 * 验证日期格式
 */
function date(value) {
	return /^[1-2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9]$/.test(value)
}

/**
 * 验证身份证号码
 */
function idCard(value) {
	return /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(
		value)
}

/**
 * 是否车牌号
 */
function carNo(value) {
	// 新能源车牌
	const xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
	// 旧车牌
	const creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
	if (value.length === 7) {
		return creg.test(value);
	} else if (value.length === 8) {
		return xreg.test(value);
	} else {
		return false;
	}
}

/**
 * 中文
 */
function chinese(value) {
	let reg = /^[\u4e00-\u9fa5]+$/gi;
	return reg.test(value);
}

/**
 * 只能输入字母
 */
function letter(value) {
	return /^[a-zA-Z]*$/.test(value);
}

/**
 * 只能是字母或者数字
 */
function enOrNum(value) {
	//英文或者数字
	let reg = /^[0-9a-zA-Z]*$/g;
	return reg.test(value);
}

/**
 * 是否json字符串
 */
function jsonString(value) {
	if (typeof value == 'string') {
		try {
			var obj = JSON.parse(value);
			if (typeof obj == 'object' && obj) {
				return true;
			} else {
				return false;
			}
		} catch (e) {
			return false;
		}
	}
	return false;
}


/**
 * 是否对象
 */
function object(value) {
	return Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * 检查对象或者数组的值， true表示通过，没有空；false表示有空值。
 * @param {Object} obj 对象
 * @param {Array<String>} filter 需要排除的字段以数组提供。 对象
 */
function checkObject(obj,filter=[]){
	let istrue = true;
	function testObjec(obj){
		if(typeof obj !=='object' || Array.isArray(obj) || obj==null ){
			istrue = false;
			return false;
		}
		for(let item in obj){
			if(filter.indexOf(item)===-1){
				if(typeof obj[item] ==='undefined' || obj[item]  === null ){
					
					istrue = false;
					break;
					return false;
				}
				if(typeof obj[item]  === 'object'){
					if(Array.isArray(obj[item])){
						if(obj[item].length==0){
							istrue = false;
							
							break;
							return false;
						}
					}else{
						testObjec(obj[item]);
						
					}
					
				}else if(typeof obj[item]  === 'string'){
					
					if(!uni.$tm.trim(obj[item])){
						istrue = false;
						break;
						return false;
					}
				}
			}
			
		}
		
	}
	testObjec(obj);
	return istrue;
}
//中国邮政编码
function chinaPost(value) {
	return /[1-9]\d{5}(?!\d)/.test(value)
}
//中国银行卡号
function bankCard(value) {
	let p = /^([1-9]{1})(\d{15}|\d{16}|\d{18})$/;
	let str = value.replace(/\s+/g, "");
	return p.test(str);
}
//密码验证，只能字母字符和数字
//默认6位
function password(value,len=6) {
	let p = new RegExp(`^[\w+|\-|+\*\.\`!@#\$%\^\&\(\)\_\+\,\///]{`+len+`,}$`)
	return p.test(value);
}
//密码验证，只能字母字符和数字
//默认6位
//并且，大小写字母和数字必须至少要有1位。
function password2(value,len=6) {
	let p = new RegExp(`^[\w+|\-|+\*\.\`!@#\$%\^\&\(\)\_\+\,\///]{`+len+`,}$`)
	if(!p.test(value)) return false;
	if(!/[a-z]{1,}/.test(value)) return false;
	if(!/[A-Z]{1,}/.test(value)) return false;
	if(!/[0-9]{1,}/.test(value)) return false;
	return true;
}
            
export default {
	email,
	mobile,
	url,
	date,
	idCard,
	carNo,
	chinese,
	letter,
	enOrNum,
	jsonString,
	object,
	checkObject,
	chinaPost,
	password,
	password2,
	bankCard
}
