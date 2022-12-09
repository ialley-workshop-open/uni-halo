<template>
	<view class="tm-signBoard" >
		<!-- @touchmove.stop.prevent="stopEvent" -->
		<!-- #ifdef H5 || APP-VUE || APP-PLUS -->
		
		<canvas
			:style="{
				width: ctx_w + 'px',
				height: ctx_h + 'px'
			}"
			:disable-scroll="true"
			@touchstart="touchstart"
			@touchmove.stop.prevent="touchsmove"
			@touchend="touchsend"
			@mousedown="touchstart"
			@mousemove.stop.prevent="touchsmove"
			@mouseup="touchsend"
			
			:canvas-id="uid"
			:id="uid"
		></canvas>
		<!-- #endif -->
		<!-- #ifdef MP -->
		<canvas
			:style="{
				width: ctx_w + 'px',
				height: ctx_h + 'px'
			}"
			:disable-scroll="true"
			@touchstart="touchstart"
			@touchmove="touchsmove"
			@touchend="touchsend"
			@mousedown="touchstart"
			@mousemove.stop.prevent="touchsmove"
			@mouseup="touchsend"
			canvas-id="tm-signBoard-id"
			id="tm-signBoard-id"
		></canvas>
		<!-- #endif -->
	</view>
</template>

<script>
/**
 * 手写签名板
 * @description 手写签名板,笔峰效果,通过ref执行clear和save功能。
 * @property {Number} line-width = [] 默认：6，线宽度。
 * @property {String} line-color = [] 默认：'#000000'，线颜色
 * @property {Number} width = [] 默认：0， 画布宽，默认使用父组件的宽高。单位upx
 * @property {Number} height = [] 默认：400， 画布高，单位upx
 * @example <tm-signBoard></tm-signBoard>
 */
export default {
	name: 'tm-signBoard',
	props: {
		lineWidth: {
			type: Number,
			default: 6
		},
		lineColor: {
			type: String,
			default: '#000000'
		},
		// 默认使用父组件的宽高。单位upx
		width: {
			type: Number,
			default: 0
		},
		// 单位upx
		height: {
			type: Number,
			default: 400
		}
	},
	data() {
		return {
			ctx: null,
			uid:"f",
			ctx_w: 0,
			ctx_h: 0
		};
	},
	created() {
		// #ifdef H5 || APP-VUE || APP-PLUS
		this.uid = this.$tm.guid();
		// #endif
	},
	async mounted() {
		let qins = await this.$Querey('.tm-signBoard',this,50).catch(e => {});
		
		this.ctx_w = uni.upx2px(this.width) || qins[0].width;
		this.ctx_h = uni.upx2px(this.height) || qins[0].height;
		this.$nextTick(function() {
			// #ifdef H5 || APP-VUE || APP-PLUS
			this.ctx = uni.createCanvasContext(this.uid, this);
			// #endif
			// #ifdef MP
			this.ctx = uni.createCanvasContext('tm-signBoard-id', this);
			// #endif
			this.handwriting = new uni.$tm.HandwritingSelf(this.ctx,this.ctx_w,this.ctx_h,this.lineWidth,this.lineColor)
		});
	},
	methods: {
		touchstart(event) {
			event.preventDefault()
			event.stopPropagation()
			
			if (event.type.indexOf('mouse')==-1&&event.changedTouches.length==1) {
				var touch = event.changedTouches[0];
				this.handwriting.down(touch.x,touch.y);
				
			}else{
				this.handwriting.down(event.pageX-event.currentTarget.offsetLeft,event.pageY-event.currentTarget.offsetTop);
			}
		},
		touchsmove(event) {
			event.preventDefault()
			event.stopPropagation()
			if (event.type.indexOf('mouse')==-1&&event.changedTouches.length == 1) {
				var touch = event.changedTouches[0];
				this.handwriting.move(touch.x,touch.y);
				
			}else{
				this.handwriting.move(event.pageX-event.currentTarget.offsetLeft,event.pageY-event.currentTarget.offsetTop);
			}
		},
		touchsend(event) {
			event.preventDefault()
			event.stopPropagation()
			if (event.type.indexOf('mouse')==-1&&event.changedTouches.length == 1) {
				var touch = event.changedTouches[0];
				this.handwriting.up(touch.x,touch.y);
			}else{
				this.handwriting.up(event.pageX-event.currentTarget.offsetLeft,event.pageY-event.currentTarget.offsetTop);
			}
		},
		clear() {
			if (!this.ctx) return;
			this.ctx.clearRect(0, 0, this.ctx_w, this.ctx_h);
			this.ctx.draw(false);
			this.$nextTick(function() {
				// #ifdef H5
				this.ctx = uni.createCanvasContext(this.uid, this);
				// #endif
				// #ifndef H5
				this.ctx = uni.createCanvasContext('tm-signBoard-id', this);
				// #endif
				this.handwriting = new uni.$tm.HandwritingSelf(this.ctx,this.ctx_w,this.ctx_h,this.lineWidth,this.lineColor)
			});
		},
		save() {
			let t = this;
			
			return new Promise((su, fa) => {
				if (!this.ctx) {
					fa('ctx未初始化');
					return;
				}
				let uid =this.uid;
				// #ifndef H5
				uid='tm-signBoard-id'
				// #endif
				uni.canvasToTempFilePath(
					{
						x: 0,
						y: 0,
						width: t.ctx_w,
						height: t.ctx_h,
						canvasId: uid,
						success: function(res) {
							// 在H5平台下，tempFilePath 为 base64
							su(res.tempFilePath);
						},
						fail: res => {
							fa(res);
						}
					},
					
				);
			});
		},
		stopEvent(event) {
			event.preventDefault()
			event.stopPropagation()
		}
	}
};
</script>

<style lang="scss"></style>
