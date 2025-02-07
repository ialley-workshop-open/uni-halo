# liu-poster适用于uni-app项目的canvas海报画板、海报生成、海报图组件
### 本组件目前兼容微信小程序、H5
### 本组件是canvas海报画板、海报生成、海报图组件，配置简单，支持绘制背景色、绘制图片、绘制文本、绘制线条，自由生成海报图片
# --- 扫码预览、关注我们 ---

## 扫码关注公众号，查看更多插件信息，预览插件效果！ 

![](https://uni.ckapi.pro/uniapp/publicize.png)

### 属性说明
| 名称                         | 类型           | 默认值                | 描述            |
| ----------------------------|--------------- | -------------------- | ---------------|
| width                       | Number         | 750                  | 画布宽度(rpx)
| height                      | Number         | 750                  | 画布高度(rpx)
| fileType                    | String         | png                  | 生成的图片格式(jpg或png)
| @change                     | Function       |                      | 海报绘制成功回调事件

### 使用示例
``` 
<template>
	<view class="tab-box">
		<view class="btn-complete" @click="open">一键生成海报</view>
		<liu-poster ref="liuPoster" :width="750" :height="1300" @change="change"></liu-poster>
		<image class="success-img" :src="url" @click="previewImg(url)"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				canvasList: [{
					type: 'color', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
					width: 750, //宽度(rpx)
					height: 1300, //高度(rpx)
					x: 0, //x轴位置(离左边的距离rpx)
					y: 0, //y轴位置(离上边的距离rpx)
					radius: 100, //圆角(rpx)
					lineWidth: 40, //边框宽度(rpx)
					lineColor: '#000000', //边框颜色
					colorObj: {
						colorList: ['#6900FF', '#FFFFFF'], //传入1个值为纯色，2个值为渐变色
						direction: 2 //渐变色绘制方向(1:从左到右;2:从上到下;3:左上角到右下角;4:右上角到左下角)
					}, //type为color时必填
				}, {
					type: 'image', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
					width: 132, //宽度(rpx)
					height: 132, //高度(rpx)
					x: 40, //x轴位置(离左边的距离rpx)
					y: 120, //y轴位置(离上边的距离rpx)
					radius: 66, //圆角(rpx)
					lineWidth: 6, //边框宽度(rpx)
					lineColor: '#FFFFFF', //边框颜色
					path: 'https://img1.baidu.com/it/u=1471990434,2209509794&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400', //图片地址(type为image时必填)
				}, {
					type: 'text', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
					width: 400, //文本宽度(rpx)
					height: 40, //文本高度(rpx)
					x: 200, //x轴位置(离左边的距离rpx)
					y: 145, //y轴位置(离上边的距离rpx)
					color: '#FFFFFF', //文本颜色
					fontSize: 36, //文字大小(rpx)
					lineHeight: 36, //文字行高(rpx)
					bold: true, //文字是否加粗
					content: '好物分享猫猫虫', //文本内容(type为text时必填)
				}, {
					type: 'text', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
					width: 400, //文本宽度(rpx)
					height: 40, //文本高度(rpx)
					x: 200, //x轴位置(离左边的距离rpx)
					y: 195, //y轴位置(离上边的距离rpx)
					color: '#FFFFFF', //文本颜色
					fontSize: 28, //文字大小(rpx)
					lineHeight: 28, //文字行高(rpx)
					bold: false, //文字是否加粗
					content: '猫猫虫给你分享了一张美图', //文本内容(type为text时必填)
				}, {
					type: 'image', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
					width: 670, //宽度(rpx)
					height: 670, //高度(rpx)
					x: 40, //x轴位置(离左边的距离rpx)
					y: 300, //y轴位置(离上边的距离rpx)
					radius: 20, //圆角(rpx)
					lineWidth: 12, //边框宽度(rpx)
					lineColor: '#FFFFFF', //边框颜色
					path: 'https://img1.baidu.com/it/u=1471990434,2209509794&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400', //图片地址(type为image时必填)
					childs: [{
						type: 'text', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
						width: 400, //文本宽度(rpx)
						height: 40, //文本高度(rpx)
						x: 100, //x轴位置(离左边的距离rpx)
						y: 400, //y轴位置(离上边的距离rpx)
						color: '#FFFFFF', //文本颜色
						fontSize: 36, //文字大小(rpx)
						lineHeight: 36, //文字行高(rpx)
						bold: true, //文字是否加粗
						content: '好物分享猫猫虫', //文本内容(type为text时必填)
					}]
				}, {
					type: 'line', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
					width: 4, //线条宽度(rpx)
					color: '#FFFFFF', //线条颜色
					startX: 20, //起点x轴位置(离左边的距离rpx)
					startY: 270, //起点y轴位置(离上边的距离rpx)
					endX: 730, //终点x轴位置(离左边的距离rpx)
					endY: 270, //终点y轴位置(离上边的距离rpx)
					lineType: 'dash', //线条类型(solid:实线;dash:虚线)
				}, {
					type: 'line', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
					width: 4, //线条宽度(rpx)
					color: '#FFFFFF', //线条颜色
					startX: 20, //起点x轴位置(离左边的距离rpx)
					startY: 1000, //起点y轴位置(离上边的距离rpx)
					endX: 730, //终点x轴位置(离左边的距离rpx)
					endY: 1000, //终点y轴位置(离上边的距离rpx)
					lineType: 'dash', //线条类型(solid:实线;dash:虚线)
				}, {
					type: 'text', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
					width: 500, //文本宽度(rpx)
					height: 150, //文本高度(rpx)
					x: 40, //x轴位置(离左边的距离rpx)
					y: 1050, //y轴位置(离上边的距离rpx)
					color: '#9043FD', //文本颜色
					fontSize: 32, //文字大小(rpx)
					lineHeight: 45, //文字行高(rpx)
					bold: true, //文字是否加粗
					content: '这个是一段测试文字，这个是一段测试文字，这个是一段测试文字，这个是一段测试文字，这个是一段测试文字。', //文本内容(type为text时必填)
				}, {
					type: 'image', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
					width: 150, //宽度(rpx)
					height: 150, //高度(rpx)
					x: 550, //x轴位置(离左边的距离rpx)
					y: 1050, //y轴位置(离上边的距离rpx)
					radius: 4, //圆角(rpx)
					lineWidth: 6, //边框宽度(rpx)
					lineColor: '#FFFFFF', //边框颜色
					path: 'https://img1.baidu.com/it/u=1471990434,2209509794&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400', //图片地址(type为image时必填)
				}],
				url: ''
			};
		},
		methods: {
			//开始绘制
			open() {
				this.$nextTick(() => {
					this.$refs.liuPoster.init(this.canvasList)
				})
			},
			//绘制成功返回生成的海报图片地址
			change(e) {
				this.url = e
			},
			//预览生成的海报图片
			previewImg(url) {
				if (!url) return
				uni.previewImage({
					urls: [url]
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	.tab-box {
		width: 100%;
		height: 100vh;
		box-sizing: border-box;
		background-color: #f0f0f0;
		padding-top: 20rpx;

		.btn-reset {
			width: 100%;
			height: 72rpx;
			background: #FFFFFF;
			border-radius: 40rpx;
			border: 2rpx solid #FD430E;
			font-size: 30rpx;
			color: #3E3E3E;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.btn-complete {
			width: 98%;
			height: 76rpx;
			border-radius: 40rpx;
			font-size: 30rpx;
			color: #FFFFFF;
			background-color: #FD430E;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0 auto;
		}

		.success-img {
			width: 100%;
			height: 1300rpx;
			margin-top: 20rpx;
		}
	}
</style>
```

### 传入的canvasList参数说明
### 绘制类型有4种：color:背景色;image:图片;text:文字;line:线条
``` 
canvasList: [{
	type: 'color', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
	width: 750, //宽度(rpx)
	height: 1500, //高度(rpx)
	x: 0, //x轴位置(离左边的距离rpx)
	y: 0, //y轴位置(离上边的距离rpx)
	radius: 100, //圆角(rpx)
	lineWidth: 40, //边框宽度(rpx)
	lineColor: '#000000', //边框颜色
	colorObj: {
		colorList: ['#6900FF', '#FFFFFF'], //传入1个值为纯色，2个值为渐变色
		direction: 2 //渐变色绘制方向(1:从左到右;2:从上到下;3:左上角到右下角;4:右上角到左下角)
	}, //type为color时必填
	childs:[],//在背景色上绘制的内容放在childs里面即可
}, {
	type: 'image', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
	width: 132, //宽度(rpx)
	height: 132, //高度(rpx)
	x: 40, //x轴位置(离左边的距离rpx)
	y: 150, //y轴位置(离上边的距离rpx)
	radius: 66, //圆角(rpx)
	lineWidth: 2, //边框宽度(rpx)
	lineColor: '#FFFFFF', //边框颜色
	path: 'https://img1.baidu.com/it/u=1471990434,2209509794&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400', //图片地址(type为image时必填)
	childs:[],//如果在图片上绘制其他内容则将要绘制的内容放在childs里面即可
}, {
	type: 'text', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
	width: 400, //文本宽度(rpx)
	height: 100, //文本高度(rpx)
	x: 200, //x轴位置(离左边的距离rpx)
	y: 170, //y轴位置(离上边的距离rpx)
	color: '#FFFFFF', //文本颜色
	fontSize: 36, //文字大小(rpx)
	lineHeight: 45, //文字行高(rpx)
	bold: true, //文字是否加粗
	content: '好物分享猫猫虫好物分享猫猫虫好物分享猫猫虫好物分享猫猫虫好物分享猫猫虫好物分享猫猫虫好物分享猫猫虫', //文本内容(type为text时必填)
}, {
	type: 'line', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
	width: 2, //线条宽度(rpx)
	color: '#FFFFFF', //线条颜色
	startX: 0, //起点x轴位置(离左边的距离rpx)
	startY: 310, //起点y轴位置(离上边的距离rpx)
	endX: 750, //终点x轴位置(离左边的距离rpx)
	endY: 310, //终点y轴位置(离上边的距离rpx)
	lineType: 'dash', //线条类型(solid:实线;dash:虚线)
}]
```

### 注意
# 1、H5端使用网络图片需要解决跨域问题；
# 2、小程序使用网络图片需要在微信公众平台配置downloadFile合法域名。
