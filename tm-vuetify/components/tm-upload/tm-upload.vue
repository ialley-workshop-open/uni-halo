<template>
	<view class="tm-upload flex-start relative" id="tm-upload">
		<view v-for="(item,index) in list" :key="index" class="tm-upload-item  " :class="[grid!=1?'ma-4':'']" :style="{
			width:itemWidth+'px',
			height:itemHeight+'px'
		}">
			<view v-if="!disabled" class="tm-upload-del " :class="[delDirection]">
				<slot name="del">
					<tm-icons @click="del(index)" :black="black_tmeme" name="icon-times-circle-fill" size="36" color="red"></tm-icons>
				</slot>
			</view>
			<view @click.stop="$tm.preview(item.url,list,'url')" class="tm-upload-item-ck text flex-center  overflow" 
			:class="[color_tmeme,black_tmeme?'grey-darken-4 bk':'',`round-${round}`]">
				<slot name="img" :info={itemWidth,itemHeight}>
					<tm-icons style="line-height: 0;" name="icon-exclamationcircle-f" v-if="item['loaderror']==true"></tm-icons>
					<image :mode="model" v-else :src="item.url" @error="errorFile(item,index)" :style="{
						width:itemWidth+'px',
						height:itemHeight+'px'
					}"></image>
				</slot>
			</view>
			<!-- 上传提示语。 -->
			<view v-if="tips&&!disabled" class="tm-upload-tips text-size-xs round-b-2"
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
			<!-- 上传的排序。 -->
			<view v-if="showSort" class="absolute  l-0 fulled flex-between" :class="[disabled?'b-0':'b-40']" :style="{height:'46rpx'}">
				<view @click.stop="prevSort(item,index,'prev')" class="round-r-24 flex-center px-16 py-6" :class="[index==0?'opacity-0':'']" style="background-color: rgba(0, 0, 0, 0.3);">
					<tm-icons name="icon-angle-left" size="24" :color="color_tmeme"></tm-icons>
				</view>
				<view @click.stop="prevSort(item,index,'next')" class="round-l-24 flex-center px-16 py-6" :class="[index==list.length-1?'opacity-0':'']" style="background-color: rgba(0, 0, 0, 0.3);">
					<tm-icons name="icon-angle-right" size="24" :color="color_tmeme"></tm-icons>
				</view>
			</view>
		</view>

		<view  @click="addfile" v-if="list.length<max&&!disabled" class="tm-upload-item  ma-4 grey-lighten-4 " :class="[`round-${round}`]" :style="{
			width:itemWidth+'px',
			height:itemHeight+'px'
		}">
			<view class="tm-upload-item-ck border-a-0 flex-center  text " :class="[color_tmeme,black_tmeme?'grey-darken-4 bk':'',`round-${round}`]">
				<slot name="upload">
					<tm-icons name="icon-plus" size="36" :color="color_tmeme"></tm-icons>
				</slot>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 上传图片组件
	 * @property {Function} change 每一张图片上传成功都传动触发，并返回上传成功的图片列表。
	 * @property {Function} del 删除一张图片时触发，返回当前删除的图片数据。
	 * @property {Number|String} grid = [1|2|3|4|5] 默认：5，一行排几个。
	 * @property {Number} code = [] 默认：0，服务器上传返回数据中表示成功的标志码。
	 * @property {Number} width = [] 默认：0，自定义组件宽度。如果0，自动获取。
	 * @property {Number|String} img-height = [0] 默认：0，宽高相等。单位upx,自定义图片高度。
	 * @property {Number|String} max = [9] 默认：9，最大上传数量
	 * @property {String} del-direction = [left|right|center] 默认：right， 删除按钮的方向。left,right,center
	 * @property {String|Boolean} disabled = [true|false] 默认：false， 如果禁用，会隐藏上传和删除按钮,只显示已上传的图片。
	 * @property {String} url = [] 默认：""，上传的地址。
	 * @property {Array} filelist = [] 默认：[]，默认上传显示的图片。如果加上filelist.sync的话，会自动更新数据实现双向绑定。类似于v-model;
	 * @property {String} url-key = [] 默认：""，返回数据时，如果返回的是对象。则需要提供对象图像地址的key。默认没有，返回的即是图片地址。
	 * @property {Object} header = [] 默认：{}，上传的头部参数。
	 * @property {String} file-name = [file] 默认：file，上传时的文件key名。
	 * @property {String} model = [scaleToFill|aspectFit|aspectFill|widthFix|heightFix|top|bottom|center|left|right|top left|top right|bottom left|bottom right] 默认：scaleToFill,图片展现模式，同官方。
	 * @property {String} name = [] 默认：''，提交表单时的的字段名称标识
	 * @property {Boolean|String} tips = [true|false] 默认：true，是否显示底部的上传提示语。上传中，失败等。
	 * @property {Boolean|String} black = [true|false] 默认：null，暗黑模式。
	 * @property {Boolean|String} auto-upload = [true|false] 默认：false，是否自动上传，即添加完图片后立即上传。
	 * @property {Number|String} round = [] 默认：3，圆角
	 * @property {Object} responseStu = [] 默认： {code:'code',//服务器返回的码的字段名称data:'data',//服务上传成功后返回 的数据字段名称msg:'msg'//服务器响应信息的字段名称。}，服务器响应结构字段映射表
	 * @property {Number|String} maxsize = [] 默认：10*1024*1024，最大上传的图片大小，10mb大小
	 * @example <tm-upload></tm-upload>
	 * @description 可以通过refs.组件获得：addfile主动触发添加文件，stopupload停止上传，startupload开始或者继续上传，del删除一张图片。
	 */
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	export default {
		components:{tmIcons},
		name: "tm-upload",
		props: {
			showSort:{
				type:Boolean|String,
				default:false
			},
			model:{
				type:String,
				default:'scaleToFill'
			},
			black:{
				type:Boolean|String,
				default:null
			},
			// 一行几个。
			grid: {
				type: String | Number,
				default: 5
			},
			// 默认0即为宽高相等。单位upx
			imgHeight: {
				type: String | Number,
				default: 0
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
			
			// 删除按钮的方向。left,right,center
			delDirection: {
				type: String,
				default: 'right'
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
			round:{
				type:Number|String,
				default:3
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
			width:{
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
				maxWidth: 0,
				itemWidth: 0,
				itemHeight: 0,
				list: [],
				
				upObje:null,
			};
		},
		created() {
			// #ifdef APP-VUE || APP-PLUS  || MP
			this.showSheet = false;
			// #endif
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
			this.getRect()
				

		},
		updated() {
			this.getRect()
		},
		methods: {
			prevSort(item,index,type){
				if((index==0&&type=='prev')||(index==this.list.length-1&&type=='next')){
					return;
				}
				let nowindex = type=='prev'?index-1:index+1
				let nowItem = this.list[index];
				let newnowItem = this.list[nowindex];
				let nowfilelist= [...this.list]
				nowfilelist.splice(index,1,newnowItem)
				nowfilelist.splice(nowindex,1,nowItem)
				this.list = [...nowfilelist]
				this.$emit('update:filelist', nowfilelist);
			},
			getRect(){
				let t = this;
				this.$Querey('.tm-upload', this,0).then(o=>{
						if(!o[0].width&&t.maxWidth) return;
						t.maxWidth = o[0].width||t.width;
						let itemWidth = (t.maxWidth - (parseInt(t.grid) - 1) * uni.upx2px(12)) / parseInt(t.grid);
						t.itemWidth = itemWidth;
						t.itemHeight = t.itemWidth;
						if (t.imgHeight > 0) {
							t.itemHeight = parseInt(uni.upx2px(t.imgHeight));
						}
					})
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
						responseStu:this.responseStu
					});
					// 添加已有的图片。
					this.upObje.addfile(this.list);
					this.upObje.success = function(item){
						t.changeSuccess();
					}
				}else{
					this.upObje.setConfig({maxsize:this.maxsize,maxfile:maxfile,code:this.code,responseStu:this.responseStu,opts:{header:this.header_obj,name:this.fileName}});
				}
				
				let clist = await this.upObje.chooesefile().catch(e=>{});
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
				if(this.disabled) return;
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
				if(this.disabled) return;
				this.$emit("clear",[])
				this.list=[];
				this.changeSuccess();
			}
		},
	}
</script>

<style lang="scss" scoped>
	.tm-upload {
		flex-flow: wrap;

		.tm-upload-item {
			position: relative;

			.tm-upload-tips {
				position: absolute;
				z-index: 10;
				left: 0;
				bottom: 0;
				height: 40upx;
				line-height: 40upx;
				text-align: center;
				font-size: 23upx;
				width: 100%;
			}

			.tm-upload-pro {
				position: absolute;
				z-index: 11;
				left: 0;
				bottom: 0;
				height: 6upx;
				width: 0%;
			}

			.tm-upload-del {
				position: absolute;
				z-index: 10;

				&.right {
					right: -6upx;
					top: -8upx;
				}

				&.left {
					left: -6upx;
					top: -8upx;
				}

				&.center {
					width: 100%;
					height: 100%;
					left: 0;
					top: 0;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}

			.tm-upload-item-ck {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
