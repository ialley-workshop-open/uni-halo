/**
 * 作者：tmzdy
 * 延时操作
 * @param {Number} wait = [500] 延时
 */
function sleep(wait=500){
	let timid = null;
	if(wait==0) return Promise.resolve(true)
	clearTimeout(timid);
	return new Promise((res,rej)=>{
		timid = setTimeout(function() {
			res();
		}, wait);
	})
}

export default sleep;