<template>
	<view class="tm-upload  ">
		<tm-dialog v-model="showalert" title="视频预览" :showCancel="false" confirmText="关闭预览" confirmColor="primary text">
			<view>
				<video :src="vedioUrl" style="width: 500rpx;height: 300rpx;" objectFit="contain"></video>
			</view>
		</tm-dialog>
		<view class="flex-col">
			<view v-for="(item,index) in list" :key="index" class="text  border-b-2"  :class="[color_tmeme,black_tmeme?'grey-darken-4 bk ':'',]">
				<view class="flex-between px-24">
					<view 
					class="flex-6 py-18 flex-start  text-overflow text-size-m " 
					>
						<view class="d-inline-block pr-12">
							<tm-icons v-if="item.statusCode==3" :black="black_tmeme" name="icon-check" size="28" color="green"></tm-icons>
							<tm-icons v-if="item.statusCode==0" :black="black_tmeme" name="icon-arrow-alt-from-botto" size="28" color="primary"></tm-icons>
							<tm-icons v-if="item.statusCode==2" :black="black_tmeme" name="icon-times-circle" size="28" color="red"></tm-icons>
							<tm-icons v-if="item.statusCode==4" :black="black_tmeme" name="icon-exclamation-circle" size="28" color="red"></tm-icons>
							<tm-icons v-if="item.statusCode==1" :black="black_tmeme" name="icon-loading" size="28" color="primary"></tm-icons>
						</view>
						<slot name="file" :info="{item}">
							{{item['name']||item['file_name']||item['filename']||item.path}}
						</slot>
					</view>
					<view v-if="!disabled" class="flex-end flex-6" >
						<slot name="right" :info="{data:item,index:index}">
							<view class="d-inline-block pr-24">
									<tm-icons @click="opendoc(item)" :black="black_tmeme" name="icon-eye-fill" size="36" :color="color"></tm-icons>
							</view>
							<view class="d-inline-block pl-12">
									<tm-icons @click="del(index)" :black="black_tmeme" name="icon-times" size="32" color="red"></tm-icons>
							</view>
						</slot>
						
					</view>
				</view>
				<!-- 上传提示语。 -->
				<view v-if="tips&&!disabled" class=" text-size-xs round-b-2 px-24 py-8"
				 :class="[
					 item.statusCode==2||item.statusCode==4?'red text':'',
					 item.statusCode==1||item.statusCode==0?'black text':'',
					 item.statusCode==3?color_tmeme+' text':'',
					 black_tmeme?'bk':''
				 ]"
				 >{{item.status}}</view>
				<!-- 上传的进度。 -->
				<view v-if="item.progress>0&&item.progress!=100&&!disabled" class="tm-upload-pro green"
					:style="{width:item.progress+'%'}"></view>
			</view>
			
			<view  @click="addfile" v-if="list.length<max&&!disabled" class=" grey-lighten-4 ">
				<view class="tm-upload-item-ck border-a-0 flex-center  text py-50" :class="[color_tmeme,black_tmeme?'grey-darken-4 bk':'']">
					<slot name="upload">
						<tm-icons name="icon-plus" size="36" :color="color_tmeme"></tm-icons>
						<text class="text-size-n pl-12">添加文件</text>
					</slot>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 上传图片组件
	 * @property {Function} change 每一张图片上传成功都传动触发，并返回上传成功的图片列表。
	 * @property {Function} del 删除一张图片时触发，返回当前删除的图片数据。
	 * @property {Number} code = [] 默认：0，服务器上传返回数据中表示成功的标志码。
	 * @property {Number|String} max = [9] 默认：9，最大上传数量
	 * @property {String} fileType = [all|image|file|vedio] 默认：all，上传的文件类型
	 * @property {Array} extension = [*] 默认：[]，上传的文件后缀过滤比如:[".jpg",".doc"]
	 * @property {String|Boolean} disabled = [true|false] 默认：false， 如果禁用，会隐藏上传和删除按钮,只显示已上传的图片。
	 * @property {String} url = [] 默认：""，上传的地址。
	 * @property {Array} filelist = [] 默认：[]，默认上传显示的图片。如果加上filelist.sync的话，会自动更新数据实现双向绑定。类似于v-model;
	 * @property {String} url-key = [] 默认：""，返回数据时，如果返回的是对象。则需要提供对象图像地址的key。默认没有，返回的即是图片地址。
	 * @property {Object} header = [] 默认：{}，上传的头部参数。
	 * @property {String} file-name = [file] 默认：file，上传时的文件key名。
	 * @property {String} name = [] 默认：''，提交表单时的的字段名称标识
	 * @property {Boolean|String} tips = [true|false] 默认：true，是否显示底部的上传提示语。上传中，失败等。
	 * @property {Boolean|String} black = [true|false] 默认：null，暗黑模式。
	 * @property {Boolean|String} auto-upload = [true|false] 默认：false，是否自动上传，即添加完图片后立即上传。
	 * @property {Object} responseStu = [] 默认： {code:'code',//服务器返回的码的字段名称data:'data',//服务上传成功后返回 的数据字段名称msg:'msg'//服务器响应信息的字段名称。}，服务器响应结构字段映射表
	 * @property {Number|String} maxsize = [] 默认：10*1024*1024，最大上传的图片大小，10mb大小
	 * @example <tm-uploadfile></tm-uploadfile>
	 * @description 可以通过refs.组件获得：addfile主动触发添加文件，stopupload停止上传，startupload开始或者继续上传，del删除一张图片。
	 */
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	import tmDialog from "@/tm-vuetify/components/tm-dialog/tm-dialog.vue"
	export default {
		components:{tmIcons,tmDialog},
		name: "tm-uploadfile",
		props: {
			black:{
				type:Boolean|String,
				default:null
			},
			// 最大上传数量，默认9
			max: {
				type: String | Number,
				default: 9
			},
			// 最大上传数量，默认9
			maxsize: {
				type: String | Number,
				default: 10*1024*1024
			},
			// 主题色
			color: {
				type: String,
				default: 'primary'
			},
			
			// 如果禁用，会隐藏上传和删除按钮。
			disabled: String | Boolean,
			// 上传的地址。
			url: {
				type: String,
				default: ''
			},
			// 默认上传显示的图片。如果加上filelist.sync的话，会自动更新数据实现双向绑定。类似于v-model;
			filelist: {
				type: Array,
				default: () => {
					return [];
				}
			},
			
			//返回数据时，如果返回的是对象。则图像地址的key名。默认没有，返回的即是图片地址。
			urlKey:{
				type:String,
				default:''
			},
			// 上传的头部参数。
			header:{
				type:Object,
				default:()=>{
					return {};
				}
			},
			fileType:{
				type:String,//上传的文件类型，默认所有。
				default:'all'
			},
			extension:{
				type:Array,//上传的文件类型，默认所有。
				default:()=>[]
			},
			// 上传时的文件key名。默认file
			fileName:{
				type:String,
				default:'file'
			},
			// 是否显示底部的上传提示语。上传中，失败等。
			tips: {
				type: Boolean|String,
				default: true,
			},
			// 是否自动上传，即添加完图片后立即上传。
			autoUpload: {
				type: Boolean,
				default: false,
			},
			//提交表单时的的字段名称
			name:{
				type:String,
				default:''
			},
			// 跟随主题色的改变而改变。
			fllowTheme:{
				type:Boolean|String,
				default:true
			},
			//定义上传成功返回的code码，默认是0表示上传成功 。
			code:{
				type:Number,
				default:0
			},
			//上成功后，服务器顺应数据的字段映射表。
			responseStu:{
				type:Object,
				default:()=>{
					return {
						code:'code',//服务器返回的码的字段名称
						data:'data',//服务上传成功后返回 的数据字段名称
						msg:'msg'//服务器响应信息的字段名称。
					}
				}
			}
		},
		computed: {
			header_obj:function () {
				return this.header;
			},
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			},
			color_tmeme:function(){
				if(this.$tm.vx.state().tmVuetify.color!==null&&this.$tm.vx.state().tmVuetify.color && this.fllowTheme){
					return this.$tm.vx.state().tmVuetify.color;
				}
				return this.color;
			},
		},
		data() {
			return {
				showalert:false,
				list: [],
				vedioUrl:'',
				upObje:null,
			};
		},
		created() {
			
		},
		async mounted() {
			let t = this;
			if (typeof t.filelist === 'object' && Array.isArray(t.filelist)) {
				let plist = [...t.filelist];
				plist.forEach((item, index) => {
					let url = "";
					if (typeof item === 'string') {
						url = item;
					} else if (typeof item === 'object') {
						url = item[t.urlKey]
					}
					t.list.push({
						url: url,
						status: "上传成功",
						progress: 100,
						fileId: t.$tm.guid(),
						statusCode: 3,
						data: item,
					})
				})
			
			}
		},
		methods: {
			opendoc(item){
				this.url="";
				let type = item.type;
				let image = ['jpg','png','jpeg','gif'];
				let video = ['mp4','avi','mov','webm','ogg','flv','m3u8'];
				let doc = ['doc', 'xls', 'ppt', 'pdf', 'docx', 'xlsx', 'pptx','text','txt'];
				let isSou = [...image,...video,...doc].filter(el=>el==item.type);
				if(isSou.length==0){
					uni.showToast({
						title:"未知文件格式，不支持预览",icon:'none'
					})
					return;
				}
				let imageOpen = image.filter(el=>el==item.type);
				if(imageOpen.length>0){
					this.$tm.preview.previewImg(item.url,[item.url],'url')
					return;
				}
				let videoOpen = video.filter(el=>el==item.type);
				if(videoOpen.length>0){
					this.url = item.url;
					this.showalert = true;
					return;
				}
				let docOpen = doc.filter(el=>el==item.type);
				// #ifdef H5
				uni.showToast({
					title:"不支持预览稿件",icon:'none'
				})
				return;
				// #endif
				if(docOpen.length>0){
					if(item.url.indexOf('http://tmp/')>-1){
						uni.openDocument({
							filePath:item.url
						})
					}else{
						uni.showLoading({
							title:'下载中',
							mask:true
						})
						uni.downloadFile({
							url: item.url, 
							success: (res) => {
								if (res.statusCode !== 200) {
									uni.hideLoading()
									uni.showToast({
										title:"下载失败",
										icon:'error'
									})
									return;
								}
								uni.hideLoading()
								let url = res.tempFilePath;
								uni.openDocument({
									filePath:url
								})
							},
							fail:()=>{
								uni.hideLoading()
								uni.showToast({
									title:"下载失败",
									icon:'error'
								})
							}
						});
					}
					
					
					return;
				}
				
			},
			errorFile(item,index){
				let id = item;
				id['loaderror'] = true;
				this.list.splice(index,1,id)
			},
			//动态添加默认已上传的文件。
			pushFile(list){
				let t= this;
				let plist = list||[];
				plist.forEach((item, index) => {
					let name = "";
					let type = "";
					let url = "";
					if (typeof item === 'string') {
						url = item;
						name = item;
						type = item.substr(item.lastIndexOf(".")+1);
					} else if (typeof item === 'object') {
						url = item[t.urlKey];
						name = item['name']||url;
						type = name.substr(name.lastIndexOf(".")+1);
					}
					t.list.push({
						url: url,
						type:type,
						name:name,
						status: "上传成功",
						progress: 100,
						fileId: t.$tm.guid(),
						statusCode: 3,
						data: item,
					})
				})
			},
			async addfile() {
				if(this.disabled) return;
				let t = this;
				let maxfile = parseInt(this.max) - this.list.length;
				if (maxfile <= 0) {
					this.$tm.toast("已达上传上限");
					return;
				};
				let url = this.url;
				if(!this.upObje){
					this.upObje = new this.$tm.upload.uploadfile({
						opts:{header:this.header_obj,name:this.fileName},
						maxfile:maxfile,
						uploadUrl:url,
						isAuto:this.autoUpload,
						maxsize:this.maxsize,
						code:this.code,
						responseStu:this.responseStu,
						type:this.fileType,
						extension:this.extension
					});
					// 添加已有的图片。
					this.upObje.addfile(this.list);
					this.upObje.success = function(item){
						t.changeSuccess();
					}
				}else{
					this.upObje.setConfig({
						type:this.fileType,
						extension:this.extension,
						maxsize:this.maxsize,maxfile:maxfile,code:this.code,responseStu:this.responseStu,opts:{header:this.header_obj,name:this.fileName}});
				}
				
				let clist = await this.upObje.chooseMPH5weixinFile().catch(e=>{
					console.error(e);
				});
				if(clist){
					t.list = clist;
				}
			},
			// 停止下载
			stopupload(){
				if(this.disabled) return;
				if(this.upObje){
					this.upObje.stop();
				}
			},
			// 继续上传或者开始上传。
			startupload(){
				if(this.disabled) return;
				if(this.upObje){

					this.upObje.start();
				}
			},
			// 删除一张图片。
			del(index) {
				this.$emit("del",this.list[index])
				this.list.splice(index, 1);
				this.changeSuccess();
			},
			// 只有上传成功才会触发change。并更新发送数据。
			changeSuccess() {
				let filelist = [];
				this.list.forEach((item, index) => {
					if (item.statusCode === 3) {
						filelist.push(item.data);
					}
				})
				this.$emit('change', filelist);
				this.$emit('update:filelist', filelist);
			},
			//获取已经上传的图像。
			getFile(){
				let filelist = [];
				this.list.forEach((item, index) => {
					if (item.statusCode === 3) {
						filelist.push(item.data);
					}
				})
				return filelist;
			},
			//清除所有已上传的文件。
			clearAllFile(){
				this.$emit("clear",[])
				this.list=[];
				this.changeSuccess();
			}
		},
	}
</script>

<style lang="scss" scoped>
	
</style>
