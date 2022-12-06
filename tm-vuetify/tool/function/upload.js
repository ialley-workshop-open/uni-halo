import guid from './guid';
/**
 * 上传文件。
 * 作者：tmzdy
 * 时间：‎2021‎年‎7‎月‎28‎日，‏‎9:14:53
 * 联系：zhongjihan@sina.com
 * @param {Function} chooesefile -- 选择图片上传
 * @param {Function} selected -- 选择图片成功后触发。返回选择后的图片。
 * @param {Function} addfile -- 动态加入预上传的文件。
 * @param {Function} progress -- 进度。
 * @param {Function} fail -- 失败。
 * @param {Function} success -- 成功。
 * @param {Function} complete -- 完成。
 * @param {Function} start -- 开始上传。
 * @param {Function} stop -- 停止上传。
 */
class uploadfile {
	filelist = [];
	isStop = false;
	index = 0;
	constructor({maxfile,uploadUrl,opts,responseStu,file_list,isAuto}) {
		let arg = {
			maxfile:9,
			uploadUrl:'',
			file_list:[],
			isAuto:true,
			opts:{},
			maxsize:10*1024*1024,
			code:0,//定义成功的标志码
			type:'image',//文件选择的类型
			extension:['*'],//后缀过滤。
			responseStu:{
						code:'code',//服务器返回的码的字段名称
						data:'data',//服务上传成功后返回 的数据字段名称
						msg:'msg'//服务器响应信息的字段名称。
					},
			...(arguments[0]??{})};
		let ots = {
				name:'file',header:{}
			}//配置{name: 'file', // 上传时的文件key名。默认file,header: {}, // 上传的头部参数。}
	    this.config={
			maxfile:arg.maxfile,
			uploadUrl:arg.uploadUrl,
			opts:{...ots,...arg.opts},
			file_list:arg.file_list,//默认提供的图片.
			maxsize:arg.maxsize,
			code:arg.code,
			isAuto:arg.isAuto,//自动上传
			type:arg.type,//文件选择的类型
			extension:arg.extension,//后缀过滤。
			responseStu:{...arg.responseStu,...(responseStu||{})}
		}
	}
	/**
	 * 成功后返回选择后的图片列表。
	 */
	async chooesefile(){
		let t = this;
		return new Promise((rs,rj)=>{
			
			uni.chooseImage({
				count:t.config.maxfile,
				type:t.config.type,
				extension:t.config.extension,
				fail: (e) => {
					console.error(e);
					uni.$tm.toast("已取消选择");
					rj(e);
				},
				success: (res) => {
					console.log(res);
					if(res.tempFilePaths.length==0){
						uni.$tm.toast("未选择");
						return;
					}
					console.log(res);
					let imgarray = res.tempFilePaths;
					let fielist = res.tempFiles;
					let jgsk = [];
					//0待上传，1上传中，2上传失败，3上传成功。4超过大小限制
					imgarray.forEach((item,index)=>{
						let isMaxsize = fielist[index].size>t.config.maxsize?true:false;
						jgsk.push({
							url:item,
							status:isMaxsize?'超过大小':"待上传",
							progress:isMaxsize?100:0,
							fileId:guid(),
							statusCode:isMaxsize?4:0,
							data:null,//上传成功后的回调数据。
						})
					})
					t.filelist.push(...jgsk)
					
					t.selected(t.filelist);
					if(t.config.isAuto){
						t.start();
					}
					
					rs(t.filelist)
				}
			})
			
		})
	}
	async chooseMPH5weixinFile(){
		let t = this;
		return new Promise((rs,rj)=>{
			var fs = uni.chooseFile;
			// #ifdef MP-WEIXIN || MP-QQ
			fs = uni.chooseMessageFile;
			// #endif
			var config = {
				count:t.config.maxfile,
				type:t.config.type,
				extension:t.config.extension,
			}
			if(!t.config.extension||!Array.isArray(t.config.extension)||t.config.extension?.length==0){
				delete config.extension
			}
			fs({
				...config,
				fail: (e) => {
					console.error(e);
					uni.$tm.toast("已取消选择");
					rj(e);
				},
				success: (res) => {
					if(res.tempFiles.length==0){
						uni.$tm.toast("未选择");
						return;
					}
					let fielist = res.tempFiles;
					let jgsk = [];
					//0待上传，1上传中，2上传失败，3上传成功。4超过大小限制
					fielist.forEach((item,index)=>{
						let isMaxsize = fielist[index].size>t.config.maxsize?true:false;
						let ftype = item.name||""
						if(ftype){
							ftype = ftype.substr(ftype.lastIndexOf(".")+1).toLocaleLowerCase();
						}
						jgsk.push({
							url:item.path,
							name:item.name||'默认文件名称',
							type:ftype,
							status:isMaxsize?'超过大小':"待上传",
							progress:isMaxsize?100:0,
							fileId:guid(),
							statusCode:isMaxsize?4:0,
							data:null,//上传成功后的回调数据。
						})
					})
					t.filelist.push(...jgsk)
					
					t.selected(t.filelist);
					if(t.config.isAuto){
						t.start();
					}
					
					rs(t.filelist)
				}
			})
			
		})
	}
	setConfig({maxfile,uploadUrl,opts,file_list,isAuto,responseStu}){
		let arg = arguments.length==0?{}:arguments[0];
		this.config={...this.config,...arg}
	}
	// 动态加入预上传的文件。
	/**
	 * 动态加入文件
	 * @param {Object} filelist
	 */
	addfile(filelist){
		if(typeof filelist !=='object'&&!Array.isArray(filelist)) return;
		this.filelist.push(...filelist)
	}
	// 选择图片成功后触发。返回选择后的图片。
	selected(filelist){}
	// 进度。
	progress(item){}
	// 失败
	fail(item){}
	// 成功
	success(item){}
	// 完成。
	complete (filelist){}
	// 开始上传。
	start(){
		if(this.filelist.length<=0){
			uni.$tm.toast("未选择图片");
			return;
		}
		let t = this;
		// t重新开始上传从头开始。
		this.index = 0;
		this.isStop = false;
		function startupload(){
			if(t.isStop) return;
			let item = t.filelist[t.index];
			if(!item || typeof item === 'undefined'){
				// 文件不存在。直接结束。
				t.complete(t.filelist);
				
				return;
			}
			
			if(item.statusCode==3||item.statusCode==1||item.statusCode==4){
				// 直接跳过。至下一个文件。
				t.index++;
				startupload();
				return;
			}
			
			const upObj = uni.uploadFile({
				url:t.config.uploadUrl,
				name:t.config.opts?.name??'file',
				header:t.config.opts?.header??{},
				filePath:item.url,
				formData:{file_name:item.name},
				success:(res)=>{
					if(res.statusCode !=200){
						item.statusCode = 2;
						item.status = "上传失败";
						uni.$tm.toast(String(res.statusCode))
						t.fail(item)
						t.index++;
						return;
					}
					let jsd={};
					let isOk = true;
					// 是否从服务器返回的是json。如果不是则表示fasle为string.
					let isJsonCallbackData = true;
					
					try{
						jsd = JSON.parse(res.data);
					}catch(e){
						isJsonCallbackData=false;
						jsd = res.data;
						item.data = res.data;
					}
					
					if(isJsonCallbackData){
						try{
							item.data = jsd[t.config.responseStu.data];
							if(typeof item.data == 'object'){
								item.data['name'] = item.name;
								item.data['id'] = item['id']||"";
							}
							let itecode = jsd[t.config.responseStu.code]
							if(itecode!==t.config.code){
								isOk = false;
							}
						}catch(e){
							isOk = false;
						}
					}
					
					
					if(!isOk){
						uni.$tm.toast(jsd[t.config.responseStu.msg]||"失败")
						item.statusCode = 2;
						item.status = "上传失败";
						t.fail(item)
						t.index++;
						return;
					}
					
					// 上传成功。
					item.statusCode = 3;
					item.status = "上传成功";
					uni.$tm.toast("上传成功")
					// t.filelist[t.index] = item;
					// t.filelist.splice(t.index,1,item)
					
					t.success(item)
					
				},
				fail:(res)=>{
					
					uni.$tm.toast(res.errMsg)
					item.statusCode = 2;
					item.status = "上传失败";
					// t.filelist[t.index] = item;
					t.fail(item)
					t.index++;
				},
				complete:(res)=>{
					// 直接下一个文件。
					
					startupload();
				}
			})
			if(upObj){
				upObj.onProgressUpdate((res)=>{
					t.filelist[t.index].statusCode = 1;
					t.filelist[t.index].status = "上传中";
					t.filelist[t.index].progress = res.progress;
					// t.filelist[t.index] = item;
					t.progress(item)
					
				})
			}
			
		}
		startupload();
	}
	// 停止上传
	stop(){
		this.isStop = true;
	}
	
}

/**
 * 上传文件。
 * 作者：tmzdy
 * 时间：‎2021‎年‎7‎月‎28‎日，‏‎9:14:53
 * 联系：zhongjihan@sina.com
 * 选择图片上传，相册或者拍照。
 * @param {Number} maxfile 最大上传的文件数量，默认为 9 ;
 * @param {String} uploadUrl -- ""
 * @param {Object} opts -- {}
 * @param {Function} progress  {} --上传中调用
 * @param {Function} success  {} --上传成功才会调用。
 * @param {Function} selected  {} --选完图片待上传调用。
 * @param {Function} fail  {} --上传失败时调用，返回文件相关
 * @param {Function} complete  {} -- 完成上传时触发，失败与成功都触发。
 */
function chooseImgUpload(maxfile=9,uploadUrl="",opts={},progress,success,selected,fail,complete){
	uni.chooseImage({
		count:maxfile,
		fail: (e) => {
			uni.$tm.toast("用户取消选择图片");
		},
		success: (res) => {
			
			if(res.tempFilePaths.length==0){
				uni.$tm.toast("未选择图片");
				return;
			}
			let imgarray = res.tempFilePaths;
			let jgsk = [];
			//0待上传，1上传中，2上传失败，3上传成功。
			imgarray.forEach((item,index)=>{
				jgsk.push({
					url:item,
					status:"待上传",
					progress:0,
					fileId:guid(),
					statusCode:0,
					data:null,//上传成功后的回调数据。
				})
			})
			if(selected){
				selected(jgsk);
			}
			
			let index = 0;
			function startupload(){
				let item = jgsk[index];
				if(!item){
					// 文件不存在。直接结束。
					if(complete){
						complete(jgsk);
					}
					return;
				}
				if(item.statusCode==2||item.statusCode==1){
					// 直接跳过。至下一个文件。
					index++;
					startupload();
				}
				
				const upObj = uni.uploadFile({
					url:uploadUrl,
					name:opts?.name??'file',
					header:opts?.header??{},
					filePath:item.url,
					success:(res)=>{
						if(res.statusCode !=200){
							item.statusCode = 2;
							item.status = "上传失败";
							uni.$tm.toast(res.errMsg)
							if(fail){
								fail(item)
							}
							return;
						}
						try{
							item.data = JSON.parse(res.data).data;
						}catch(e){
							item.statusCode = 2;
							item.status = "上传失败";
							uni.$tm.toast(res.errMsg)
							if(fail){
								fail(item)
							}
							return;
						}
						
						// 上传成功。
						item.statusCode = 3;
						item.status = "上传成功";
						item.data = JSON.parse(res.data).data;
						uni.$tm.toast("上传成功")
						if(success){
							success(item)
						}
						
					},
					fail:(res)=>{
						
						uni.$tm.toast(res.errMsg)
						item.statusCode = 2;
						item.status = "上传失败";
						if(fail){
							fail(item)
						}
					},
					complete:(res)=>{
						// 直接下一个文件。
						index++;
						startupload();
					}
				})
				if(upObj){
					upObj.onProgressUpdate((res)=>{
						item.statusCode = 1;
						item.status = "上传中";
						item.progress = res.progress
						if(progress){
							progress(item)
						}
						
					})
				}
				
			}
			startupload();
		}
	})
}

export default {
	chooseImgUpload,uploadfile
}