<template>
	<view class="canvasId-wk">
		<!-- #ifdef H5 || APP -->
		
		<canvas
			:style="{
				width: w,
				height: h
			}"
			v-if="cid"
			class="ec-canvas"
			:id="cid"
			:canvasId="cid"
			@touchstart="touchStart"
			@touchmove="touchMove"
			@touchend="touchEnd"
			@error="$emit('error',$event)"
		></canvas>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN || H5 || APP || MP-ALIPAY -->
		
		<canvas
			:style="{
				width: w,
				height: h
			}"
			v-if="canvasId"
			class="ec-canvas"
			id="ec-canvas"
			canvasId="ec-canvas"
			@touchstart="touchStart"
			@touchmove="touchMove"
			@touchend="touchEnd"
			@error="$emit('error',$event)"
		></canvas>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN || MP-ALIPAY-->
		
		<canvas
			:style="{
				width: w,
				height: h
			}"
			v-if="canvasId"
			type="2d"
			class="ec-canvas"
			id="ec-canvas"
			canvasId="ec-canvas"
			@touchstart="touchStart"
			@touchmove="touchMove"
			@touchend="touchEnd"
			@error="$emit('error',$event)"
		></canvas>
		<!-- #endif -->
	</view>
</template>

<script>
	
/**
 * Echart图表
 * @param {Number|String} width = [] 默认100%,纯数字时，单位为rpx
 * @param {Number|String} height = [] 默认500,纯数字时，单位为rpx,不允许百分比。
 * @param {Object} echarts = [] 默认null,百度echart.js插件，默认可以使用本库自带，详见文档。
 * @param {Function} init 图表初始化后执行触发事件返回{width,height,chart}
 * @param {Function} error 出错时触发。
 */

import WxCanvas from '@/tm-vuetify/tool/function/uni-echarts-canvas.js';
import * as echarts from '@/tm-vuetify/tool/function/echarts.min.js';
function wrapTouch(e) {
	for (let i = 0; i < e.mp.touches.length; i += 1) {
		const touch = e.mp.touches[i];
		touch.offsetX = touch.x;
		touch.offsetY = touch.y;
	}
	return e;
}

function compareVersion(v1, v2) {
	v1 = v1.split('.');
	v2 = v2.split('.');
	const len = Math.max(v1.length, v2.length);

	while (v1.length < len) {
		v1.push('0');
	}
	while (v2.length < len) {
		v2.push('0');
	}

	for (let i = 0; i < len; i++) {
		const num1 = parseInt(v1[i]);
		const num2 = parseInt(v2[i]);

		if (num1 > num2) {
			return 1;
		} else if (num1 < num2) {
			return -1;
		}
	}
	return 0;
}
export default {
	name:"tm-echarts",
	props: {
		width: {
			type: String | Number,
			default: '100%'
		},
		height: {
			type: String | Number,
			default: '500'
		},
		canvasId: {
			type: String,
			default: 'ec-canvas'
		},
		lazyLoad: {
			type: Boolean,
			default: false
		},
		disableTouch: {
			type: Boolean,
			default: false
		},
		throttleTouch: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			echarts,
			cid:'ec-canvas'
		};
	},
	created() {
		this.cid = this.$tm.guid();
	},
	destroyed() {
		try{
			this.echarts=null;
			this.chart.clear()
			this.chart = null;
		
		}catch(e){
			//TODO handle the exception
		}
	},
	computed: {
		w: function() {
			if (this.width == 0 || this.width == '') {
				return '100%';
			}
			let reg = /(vw|vh|rem|em|\%|upx|rpx|auto|px)/g;
			if (reg.test(this.width)) {
				return this.width;
			}
			return this.width + 'rpx';
		},
		h: function() {
			let reg = /(vw|vh|rem|em|\%|upx|rpx|auto|px)/g;
			if (reg.test(this.height)) {
				return this.height;
			}
			return this.height + 'rpx';
		}
		
	},
	
	mounted() {
		if (!this.echarts) {
			console.warn('未引用echarts');
			return;
		}
		if (!this.lazyLoad) {
			this.$nextTick(function() {
				try{
					this.init();
				}catch(e){
					//TODO handle the exception
					console.error("echarts错误提醒:",e)
				}
			});
		}
	},
	methods: {
		//初始化
		init() {
			// #ifdef MP-WEIXIN
			const version = wx.version.version.split('.').map(n => parseInt(n, 10));
			const isValid = version[0] > 1 || (version[0] === 1 && version[1] > 9) || (version[0] === 1 && version[1] === 9 && version[2] >= 91);
			if (!isValid) {
				console.error(
					'微信基础库版本过低，需大于等于 1.9.91。' + '参见：https://github.com/ecomfe/echarts-for-weixin' + '#%E5%BE%AE%E4%BF%A1%E7%89%88%E6%9C%AC%E8%A6%81%E6%B1%82'
				);
				return;
			}
			// #endif
			let canvasId = this.canvasId;
			// #ifdef H5 || APP-PLUS || APP-VUE
			canvasId = this.cid;
			// #endif
			// #ifndef MP-WEIXIN || MP-ALIPAY
			
			this.ctx = uni.createCanvasContext(canvasId, this);
			const canvas = new WxCanvas(this.ctx, canvasId, false);
			
			this.echarts.setCanvasCreator(() => canvas);
			const query = uni.createSelectorQuery().in(this);
			query.select(`#${canvasId}`)
				.boundingClientRect(res => {
					if (!res) {
						setTimeout(() => this.init(), 100);
						return;
					}
					const { width, height } = res;
					const canvasDpr = uni.getSystemInfoSync().pixelRatio
					this.chart = this.echarts.init(canvas, null, {
						width: width,
						height: height
					});
			
					canvas.setChart(this.chart);
			
					const { handler } = this.chart.getZr();
					this.handler = handler;
					this.processGesture = handler.proxy.processGesture || (() => {});
			
					this.$emit('init', {
						width: res.width,
						height: res.height,
						chart: this.chart
					});
				})
				.exec();
			// #endif
			
			// #ifdef MP-WEIXIN || MP-ALIPAY
			
			 const query = uni.createSelectorQuery().in(this)
			  query
				.select('.ec-canvas')
				.fields({ node: true, size: true })
				.exec(res => {
				  const canvasNode = res[0].node
				  this.canvasNode = canvasNode
		
				  const canvasDpr = uni.getSystemInfoSync().pixelRatio
				  const canvasWidth = res[0].width
				  const canvasHeight = res[0].height
		
				  const ctx = canvasNode.getContext('2d')
				 
				  const canvas = new WxCanvas(ctx, canvasId, true,canvasNode);
				  this.echarts.setCanvasCreator(() => {
					return canvas
				  })
					this.chart = this.echarts.init(canvas, null, {
						width: canvasWidth,
						height: canvasHeight,
						devicePixelRatio:canvasDpr
					});
					canvas.setChart(this.chart);		
					const { handler } = this.chart.getZr();
					this.handler = handler;
					this.processGesture = handler.proxy.processGesture || (() => {});
					this.$emit('init', {
						width: canvasWidth,
						height: canvasHeight,
						chart: this.chart
					});
				  
				})
			
			// #endif
		},
		//配置图表数据
		setOption(dJson) {
			if (!this.chart){
				uni.$tm.toast("chart未初始化")
				return false;
			}
			this.chart.setOption({...dJson},{notMerge:true});
			return true;
		},
		//获取图表对象。
		getChart(FunName,arg){
			if (!this.chart){
				uni.$tm.toast("chart未初始化")
				 return false;
			}
			return this.chart;
		},
		resize(){
			
			let t = this;
			return new Promise((res,rej)=>{
				if (!t.chart){
					uni.$tm.toast("chart未初始化")
					rej(false);
					return false;
				}
				let canvasId = t.canvasId;
				// #ifdef H5 || APP-PLUS || APP-VUE
				canvasId = t.cid;
				// #endif
				
				const query = uni.createSelectorQuery().in(t);
				query.select(`.canvasId-wk`)
					.boundingClientRect(op => {
						const { width, height } = op;
						t.chart.resize({width:width,height:height})
						res(true);
				}).exec()
			})
		},
		canvasToTempFilePath(opt) {
			const { canvasId } = this;
			this.ctx.draw(true, () => {
				wx.canvasToTempFilePath({
					canvasId,
					...opt
				});
			});
		},
		touchStart(e) {
			const { disableTouch, chart } = this;
			if (disableTouch || !chart || !e.mp.touches.length) return;
			const touch = e.mp.touches[0];
			this.handler.dispatch('mousedown', {
				zrX: touch.x,
				zrY: touch.y
			});
			this.handler.dispatch('mousemove', {
				zrX: touch.x,
				zrY: touch.y
			});
			this.processGesture(wrapTouch(e), 'start');
		},
		touchMove(e) {
			const { disableTouch, throttleTouch, chart, lastMoveTime } = this;
			if (disableTouch || !chart || !e.mp.touches.length) return;
			if (throttleTouch) {
				const currMoveTime = Date.now();
				if (currMoveTime - lastMoveTime < 240) return;
				this.lastMoveTime = currMoveTime;
			}
			const touch = e.mp.touches[0];
			this.handler.dispatch('mousemove', {
				zrX: touch.x,
				zrY: touch.y
			});
			this.processGesture(wrapTouch(e), 'change');
		},
		touchEnd(e) {
			const { disableTouch, chart } = this;
			if (disableTouch || !chart) return;
			const touch = e.mp.changedTouches ? e.mp.changedTouches[0] : {};
			this.handler.dispatch('mouseup', {
				zrX: touch.x,
				zrY: touch.y
			});
			this.handler.dispatch('click', {
				zrX: touch.x,
				zrY: touch.y
			});
			this.processGesture(wrapTouch(e), 'end');
		}
	}
};
</script>

<style scoped>
.ec-canvas {
	width: 100%;
	height: 375rpx;
}
</style>
