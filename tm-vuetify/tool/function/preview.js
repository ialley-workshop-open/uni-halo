/**
 * 上传文件。
 * 作者：tmzdy
 * 时间：‎2021‎年‎7‎月‎28‎日，‏‎9:14:53
 * 联系：zhongjihan@sina.com
 * 预览图片。
 * @param {Object} url 必填 当前预览的图片链接。
 * @param {Object} list 可以是url数组，也可以是对象，数据比如：["http:url"] or [{url:"https:url",...}]
 * @param {Object} rangKey 如果list是对象数组，需要提供url字段。
 */
function previewImg(url,list,rangKey){
	
	if(!url){
		uni.$tm.toast("参数有误");
		return;
	}
	
	if(arguments.length==1){
		uni.previewImage({
			current:url,
			urls:list?list:[url]
		})
	}else if(arguments.length===3){
		
		if(typeof list[0] === 'object' && typeof list[0] !== 'undefined'){
			
			let urls = [];
			list.forEach(item=>{
				urls.push(item[rangKey]);
			})
			
			uni.previewImage({
				current:url,
				urls:urls,
				fail: (er) => {
					console.warn(er)
				}
			})
		}else if(typeof list[0] === 'string'){
			uni.previewImage({
				current:url,
				urls:list
			})
		}
	}else{
		uni.$tm.toast("参数有误");
	}
	
	
	
}

export default  previewImg