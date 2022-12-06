<!-- 长宽比例组件 -->
<template>
	<view class="tm-ratio--wk d-inline-block">
		<view  class="tm-ratio" :class="[color,black=='true'||black===true?'bk':'']" :style="style">
			<slot name="default" :data="style"></slot>
		</view>
	</view>
</template>
<script>

	 /**
	  * 
	  * 长宽比例组件
	  * @property {String} ratio = [] 默认：4/3，比例
	  * @property {Number | String} width = [] 默认：NaN，默认会根据父组件自动计算宽高，指定宽。
	  * @property {Number | String} height = [] 默认：NaN，默认会根据父组件自动计算宽高，指定高。
	  * @property {String} color = [white] 默认：white，背景色，主题名称。
	  * @property {Boolean} black = [true|false] 默认：false，暗黑模式
	  * @example <tm-ratio  height="240" ratio="16/9" ><template v-slot="{data}">{{data.width}}</template></tm-ratio>
	  * 
	  */
	export default {
		props: {
			// 比例如:16/9,4/3,5/4
			ratio: {
				type: String,
				default: '4/3'
			},
			width: {
				type: Number | String,
				default: NaN
			},
			height: {
				type: Number | String,
				default: NaN
			},
			color: {
				type: String,
				default: "white"
			},
			black: {
				type: String|Boolean,
				default: false
			},
		},
		data() {
			return {
				style: '',
				style_obj:{}
			};
		},
		mounted() {
			let t = this;
			const query = uni.createSelectorQuery().in(this);
			
			query.select('.tm-ratio--wk').boundingClientRect().exec(dsd => {
				var ds = dsd[0];
				
				let wsys = uni.getSystemInfoSync();
				let maxWidth = wsys.windowWidth - ds.left - ds.right;
				if (maxWidth <= 0) maxWidth = ds.width;
				query.select('.tm-ratio').boundingClientRect(data => {

					let rt = t.ratio;
					if (!rt || rt.indexOf('/') == -1 || rt.split('/').length !== 2) {
						rt = '4/3'
					}
					let ro = rt.split('/');
					let ws = !isNaN(parseInt(ro[0])) ? parseInt(ro[0]) : 4;
					let hs = !isNaN(parseInt(ro[1])) ? parseInt(ro[1]) : 3;

					let bl = hs / ws;
					
				
					if (isNaN(t.width) && isNaN(t.height)) {
						
						t.style ={
							width: data.width + 'px',
							height: data.width * bl + 'px',
							minHeight: data.width + 'px',
							minWidth: data.width + 'px'
						};
						t.style_obj = uni.$tm.objToString({
							width: data.width,
							height: data.width * bl,
							minHeight: data.width ,
							minWidth: data.width
						});
						return;
					}
					if (!isNaN(t.width) && isNaN(t.height)) {
						let width = uni.upx2px(t.width)
						t.style = {
							width: (width > maxWidth ? maxWidth : width) + 'px',
							height: width * bl + 'px',
							minHeight: width * bl + 'px',
							minWidth: (width > maxWidth ? maxWidth : width) + 'px'
						};
						t.style_obj = uni.$tm.objToString({
							width: (width > maxWidth ? maxWidth : width) ,
							height: width * bl,
							minHeight: width * bl ,
							minWidth: (width > maxWidth ? maxWidth : width)
						});
						return;
					}
					if (isNaN(t.width) && !isNaN(t.height)) {
						let height = uni.upx2px(t.height)
						let xsw = height / bl;
						
						t.style = {
							width: (xsw > maxWidth ? maxWidth : xsw) + 'px',
							height: height + 'px',
							minHeight: height + 'px',
							minWidth: (xsw > maxWidth ? maxWidth : xsw) + 'px'
						};
						t.style_obj = uni.$tm.objToString({
							width: (xsw > maxWidth ? maxWidth : xsw) ,
							height: height,
							minHeight: height ,
							minWidth: (xsw > maxWidth ? maxWidth : xsw) 
						});
						return;
					}

					// 如果同时提供了宽高，那么按比例。以最长边为第一值。
					if (!isNaN(t.width) && !isNaN(t.height)) {
						// 第一值，默认为宽度。
						let xnh = uni.upx2px(t.width);
						let isW = true;
						if (xnh < uni.upx2px(t.height)) {
							xnh = uni.upx2px(t.height);
							isW = false;
						}
						let w = 0;
						let h = 0;
						if (isW) {
							w = xnh;
							h = xnh * bl;
						} else {
							w = xnh / bl;
							h = xnh;
						}

						t.style = {
							width: w + 'px',
							height: h + 'px',
							minHeight: h + 'px',
							minWidth: w + 'px'
						};
						t.style_obj = uni.$tm.objToString({
							width: w ,
							height: h ,
							minHeight: h ,
							minWidth: w 
						});
						return;
					}
				
					
				}).exec();
			})

		}
	}
</script>

<style lang="scss" scoped>

</style>
