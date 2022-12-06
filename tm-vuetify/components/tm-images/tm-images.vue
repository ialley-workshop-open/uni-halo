<template>
	<view @click="click" class="tm-images overflow fulled " :class="[round=='rounded'?'rounded':`round-${round}`]">
		<view class="fulled fulled-height tm-images-load flex-center">
			<view class="d-inline-block load">
				<text v-if="isLoad" class="iconfont icon-loading text-size-n text-grey"></text>
			</view>
			<view class="d-inline-block" v-if="isError">
				<slot name="error">
					<text class="iconfont icon-exclamationcircle-f text-size-xl text-grey-lighten-2"></text>
				</slot>
			</view>
			
			<image v-show="!isLoad"  @error="error"  
			:class="[round=='rounded'?'rounded':`round-${round}`]" 
			:style="{
				width:w+'px',
				height:h+'px'
			}" 
			@load="loadPic" :src="src_path" :mode="model"></image>
			
		</view>
		
	</view>
</template>

<script>
	/**
	 * 图片
	 * @property {Function} load 加载成功时触发返回图片宽高。
	 * @property {Function} click 点击图片事件，返回图片地址参数。
	 * @property {Function} error 图片加载出错时触发。
	 * @property {String} src = [] 默认："",必填。图片地址。测试图片：https://picsum.photos/300
	 * @property {Number} width = [] 默认：0,宽度，非必填,单位rpx
	 * @property {Number} height = [] 默认：0,高度，非必填,单位rpx
	 * @property {Number} round = [] 默认：0,圆角，非必填
	 * @property {Boolean|String} previmage = [true|false] 默认：true,点击图片是否预览。
	 * @property {String} model = [scaleToFill|aspectFit|aspectFill|widthFix|heightFix|top|bottom|center|left|right|top left|top right|bottom left|bottom right] 默认：scaleToFill,图片展现模式，同官方。
	 * @example <tm-images src="https://picsum.photos/300"></tm-images>
	 */
	export default {
		name: "tm-images",
		props: {
			src: {
				type: String,
				default: ""
			},
			//自动，宽度撑满容器宽度，高度自动。
			// 自定宽度，
			width: {
				type: Number,
				default: 0
			},
			// 自定高度。
			height: {
				type: Number,
				default: 0
			},
			// 是否开启预览模式，即点击图片可以预览。
			previmage: {
				type: Boolean | String,
				default: true
			},
			model: {
				type: String,
				default: 'scaleToFill'
			},
			round: {
				type: Number|String,
				default: 0
			}
		},
		data() {
			return {
				w: 0,
				h: 0,
				isLoad:false,
				isError:false
				
			};
		},
		computed:{
			w_px:function(){
				return uni.upx2px(this.width);
			},
			h_px:function(){
				return uni.upx2px(this.height);
			},
			src_path:function(){
				if(
				this.src.substring(0,4)=='http'||
				this.src.substring(0,4)=='blob'||
				this.src.substring(0,5)=='https'||
				this.src.substring(0,3)=='ftp'||
				this.src.indexOf('data:image')>-1
				){
					return this.src;
				}
				return '/'+this.src;
				
			}
		},
		mounted() {
			this.isLoad = true;
			
		},
		methods: {
			error(e) {
				this.isLoad = false;
				this.isError = true;
				this.$emit('error', e);
			},
			async loadPic(e) {
				let wh = e.detail;
				this.isLoad = false;
				this.isError = false;
				this.$nextTick(async function(){
					this.$Querey(".tm-images",this,30).then(tb=>{
						let sw = tb[0].width||wh.width;
						let sh = tb[0].height||wh.height;
						let bl = wh.width / wh.height;
						if (this.w_px == 0 && this.h_px == 0) {
							
							this.w = sw;
							this.h = sw / bl;
							this.$emit('load', {
								width: this.w,
								height: this.h
							})
							return;
						}
						if (this.w_px == 0 && this.h_px > 0) {
							this.w = this.h_px * bl;
							this.h = this.h_px
							this.$emit('load', {
								width: this.w,
								height: this.h
							})
							return;
						}
						if (this.w_px > 0 && this.h_px == 0) {
							this.w = this.w_px;
							this.h = this.w_px / bl
							this.$emit('load', {
								width: this.w,
								height: this.h
							})
							return;
						}
						if (this.w_px > 0 && this.h_px > 0) {
							this.w = this.w_px;
							this.h = this.h_px;
							this.$emit('load', {
								width: this.w,
								height: this.h
							})
							
							return;
						}
					})
					
				})
				
			},
			click(e) {
				this.$emit("click", this.src_path);
				if (this.previmage&&!this.isError) {
					uni.previewImage({
						current: this.src_path,
						urls: [this.src_path],
						fail:(res)=>{
							
						}
					})
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
.tm-images{
	line-height: 0;
	
	.tm-images-load{
		min-width: 60rpx;
		min-height: 60rpx;
		.load{
			animation: xhRote 0.8s infinite linear;
		}
	}
}
@keyframes xhRote{
	0%{
		transform: rotate(0deg);
	}
	
	100%{
		transform: rotate(360deg);
	}
}
</style>
