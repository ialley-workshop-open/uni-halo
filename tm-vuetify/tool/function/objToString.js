// 把对象转换为string，提供对象 和 分割符。
function objToString(obj, split=';') {
  if(typeof obj !=="object") return '';
  let a='';
  for(let i in obj){
	  a+=i+':'+obj[i]+split;
  }
  return a;
}

module.exports.objToString = objToString;
