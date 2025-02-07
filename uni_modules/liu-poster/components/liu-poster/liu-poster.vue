<template>
	<view class="canvas-main">
		<canvas :style="'width:'+width+'rpx;height:'+height+'rpx;'" class="canvas-item" disable-scroll="true"
			canvas-id="canvasId" @error="error"></canvas>
	</view>
</template>
<script>
	export default {
		props: {
			//画布宽度(rpx)
			width: {
				type: Number,
				default: 750
			},
			//画布高度(rpx)
			height: {
				type: Number,
				default: 750
			},
			//生成的图片格式(jpg或png)
			fileType: {
				type: String,
				default: 'png'
			},
		},
		data() {
			return {
				pixelRatio: 0,
				context: null,
				canvasList: []
			}
		},
		methods: {
			async init(list) {
				uni.showLoading({
					title: '正在绘制...'
				})
				if (this.context) {
					await this.clear()
					this.canvasList = []
					this.context = null
				}
				this.canvasList = JSON.parse(JSON.stringify(list))
				const systemInfo = uni.getSystemInfoSync()
				this.pixelRatio = systemInfo.pixelRatio
				this.context = uni.createCanvasContext('canvasId', this)
				this.start()
			},
			clear() {
				return new Promise(async (resolve, reject) => {
					await this.context.clearRect(0, 0, this.width, this.height)
					resolve()
				})
			},
			async start() {
				await Promise.all(this.canvasList.map(async res => {
					if (res.type == 'color') {
						await this.drawBg(res)
					} else if (res.type == 'image') {
						await this.drawImage(res)
					} else if (res.type == 'text') {
						await this.drawText(res)
					} else if (res.type == 'line') {
						await this.drawLine(res)
					}
				}))
				this.save()
			},
			drawBg(item) {
				return new Promise(async (resolve, reject) => {
					item.width = uni.upx2px(item.width)
					item.height = uni.upx2px(item.height)
					item.x = uni.upx2px(item.x)
					item.y = uni.upx2px(item.y)
					item.radius = uni.upx2px(item.radius)
					item.lineWidth = uni.upx2px(item.lineWidth)
					let gradient = ''
					if (item.colorObj && item.colorObj.colorList) {
						if (item.colorObj.colorList.length == 1) {
							this.context.fillStyle = item.colorObj.colorList[0]
						} else {
							if (item.colorObj.direction == 1) {
								gradient = this.context.createLinearGradient(0, 0, item.height, 0)
							} else if (item.colorObj.direction == 2) {
								gradient = this.context.createLinearGradient(0, 0, 0, item.height)
							} else if (item.colorObj.direction == 3) {
								gradient = this.context.createLinearGradient(0, 0, item.width, item.height)
							} else if (item.colorObj.direction == 4) {
								gradient = this.context.createLinearGradient(item.width, 0, 0, item.height)
							}
							gradient.addColorStop(0, item.colorObj.colorList[0])
							gradient.addColorStop(1, item.colorObj.colorList[1])
							this.context.fillStyle = gradient
						}
					} else {
						this.context.fillStyle = '#FFFFFF'
					}
					this.context.save()
					if (item.radius > 0) {
						this.context.beginPath()
						this.context.moveTo(item.x + item.radius, item.y)
						this.context.arcTo(item.x + item.width, item.y, item.x + item.width, item.y +
							item.radius, item.radius)
						this.context.lineTo(item.x + item.width, item.y + item.height - item.radius)
						this.context.arcTo(item.x + item.width, item.y + item.height, item.x + item
							.width - item.radius, item.y + item.height, item.radius)
						this.context.lineTo(item.x + item.radius, item.y + item.height)
						this.context.arcTo(item.x, item.y + item.height, item.x, item.y + item
							.height - item.radius, item.radius)
						this.context.lineTo(item.x, item.y + item.radius)
						this.context.arcTo(item.x, item.y, item.x + item.radius, item.y, item.radius)
						this.context.closePath()
						this.context.clip()
					}
					this.context.fillRect(item.x, item.y, item.width, item.height)
					if (item.lineWidth) {
						this.context.setLineDash([])
						this.context.lineWidth = item.lineWidth
						this.context.strokeStyle = item.lineColor
						this.context.beginPath()
						this.context.moveTo(item.x + item.radius, item.y)
						this.context.arcTo(item.x + item.width, item.y, item.x + item.width, item.y +
							item.radius, item.radius)
						this.context.lineTo(item.x + item.width, item.y + item.height - item.radius)
						this.context.arcTo(item.x + item.width, item.y + item.height, item.x + item
							.width - item.radius, item.y + item.height, item.radius)
						this.context.lineTo(item.x + item.radius, item.y + item.height)
						this.context.arcTo(item.x, item.y + item.height, item.x, item.y + item
							.height - item.radius, item.radius)
						this.context.lineTo(item.x, item.y + item.radius)
						this.context.arcTo(item.x, item.y, item.x + item.radius, item.y, item.radius)
						this.context.closePath()
						this.context.stroke()
					}
					this.context.restore()
					await this.context.draw(true)
					if (item.childs && item.childs.length > 0) {
						await Promise.all(item.childs.map(async res => {
							if (res.type == 'color') {
								await this.drawBg(res)
							} else if (res.type == 'image') {
								await this.drawImage(res)
							} else if (res.type == 'text') {
								await this.drawText(res)
							} else if (res.type == 'line') {
								await this.drawLine(res)
							}
						}))
					}
					resolve()
				})
			},
			drawImage(item) {
				return new Promise(async (resolve, reject) => {
					item.width = uni.upx2px(item.width)
					item.height = uni.upx2px(item.height)
					item.x = uni.upx2px(item.x)
					item.y = uni.upx2px(item.y)
					item.radius = uni.upx2px(item.radius)
					item.lineWidth = uni.upx2px(item.lineWidth)
					await this.getImageInfo(item.path).then(async res => {
						this.context.save()
						if (item.radius > 0) {
							this.context.beginPath()
							this.context.moveTo(item.x + item.radius, item.y)
							this.context.arcTo(item.x + item.width, item.y, item.x + item.width,
								item.y +
								item.radius, item.radius)
							this.context.lineTo(item.x + item.width, item.y + item.height - item
								.radius)
							this.context.arcTo(item.x + item.width, item.y + item.height, item.x +
								item
								.width - item.radius, item.y + item.height, item.radius)
							this.context.lineTo(item.x + item.radius, item.y + item.height)
							this.context.arcTo(item.x, item.y + item.height, item.x, item.y + item
								.height - item.radius, item.radius)
							this.context.lineTo(item.x, item.y + item.radius)
							this.context.arcTo(item.x, item.y, item.x + item.radius, item.y, item
								.radius)
							this.context.closePath()
							this.context.clip()
						}
						await this.context.drawImage(res, item.x, item.y, item.width, item
							.height)
						if (item.lineWidth) {
							this.context.setLineDash([])
							this.context.lineWidth = item.lineWidth
							this.context.strokeStyle = item.lineColor
							this.context.beginPath()
							this.context.moveTo(item.x + item.radius, item.y)
							this.context.arcTo(item.x + item.width, item.y, item.x + item.width,
								item.y +
								item.radius, item.radius)
							this.context.lineTo(item.x + item.width, item.y + item.height - item
								.radius)
							this.context.arcTo(item.x + item.width, item.y + item.height, item.x +
								item
								.width - item.radius, item.y + item.height, item.radius)
							this.context.lineTo(item.x + item.radius, item.y + item.height)
							this.context.arcTo(item.x, item.y + item.height, item.x, item.y + item
								.height - item.radius, item.radius)
							this.context.lineTo(item.x, item.y + item.radius)
							this.context.arcTo(item.x, item.y, item.x + item.radius, item.y, item
								.radius)
							this.context.closePath()
							this.context.stroke()
						}
						this.context.restore()
						await this.context.draw(true)
						if (item.childs && item.childs.length > 0) {
							await Promise.all(item.childs.map(async res => {
								if (res.type == 'color') {
									await this.drawBg(res)
								} else if (res.type == 'image') {
									await this.drawImage(res)
								} else if (res.type == 'text') {
									await this.drawText(res)
								} else if (res.type == 'line') {
									await this.drawLine(res)
								}
							}))
						}
						resolve()
					})
				})
			},
			drawText(item) {
				return new Promise(async (resolve, reject) => {
					item.width = uni.upx2px(item.width)
					item.height = uni.upx2px(item.height)
					item.x = uni.upx2px(item.x)
					item.y = uni.upx2px(item.y)
					item.fontSize = uni.upx2px(item.fontSize)
					item.lineHeight = uni.upx2px(item.lineHeight)
					await this.drawTextInfo(item.content, item.x, item.y, item.fontSize, item.color, item
						.width, item.height, item.lineHeight, item.bold, true)
					resolve()
				})
			},
			drawLine(item) {
				return new Promise(async (resolve, reject) => {
					item.width = uni.upx2px(item.width)
					item.startX = uni.upx2px(item.startX)
					item.startY = uni.upx2px(item.startY)
					item.endX = uni.upx2px(item.endX)
					item.endY = uni.upx2px(item.endY)
					this.context.setStrokeStyle(item.color)
					this.context.setLineWidth(item.width)
					this.context.setLineCap('round')
					if (item.lineType == 'dash') this.context.setLineDash([item.width * 5, item.width * 5], 0)
					else this.context.setLineDash([])
					this.context.beginPath()
					this.context.moveTo(item.startX, item.startY)
					this.context.lineTo(item.endX, item.endY)
					this.context.stroke()
					this.context.closePath()
					resolve()
				})
			},
			drawTextInfo(text, x, y, fontSize, color, width, height, lineHeight, bold, ellipsis) {
				return new Promise(async (resolve, reject) => {
					this.context.setFillStyle(color)
					if (bold) this.context.font = 'bold ' + fontSize + 'px Arial'
					else this.context.font = fontSize + 'px Arial'
					this.context.setTextBaseline('bottom')
					let textArray = text.split('')
					let line = ''
					let lines = []
					for (let i = 0; i < textArray.length; i++) {
						let testLine = line + textArray[i]
						let testWidth = this.context.measureText(testLine).width
						if (testWidth > width) {
							lines.push(line)
							line = textArray[i]
						} else {
							line = testLine
						}
					}
					lines.push(line)
					let firstWidth = this.context.measureText(lines[0]).width
					if (height >= lineHeight * lines.length) {
						await Promise.all(lines.map(async (res, i) => {
							let lineText = res
							let lineHeights = lineHeight * (i + 1)
							await this.context.fillText(lineText, x, y + lineHeights)
						}))
					} else {
						let sNum = parseInt(height / lineHeight)
						lines = lines.slice(0, sNum)
						await Promise.all(lines.map(async (res, i) => {
							let lineText = res
							let lineHeights = lineHeight * (i + 1)
							if (i == lines.length - 1) {
								if (this.context.measureText('...').width < fontSize) {
									lineText = lineText.substring(0, lineText.length - 1)
									lineText += '...'
								} else {
									lineText = lineText.substring(0, lineText.length - 2)
									lineText += '...'
								}
							}
							await this.context.fillText(lineText, x, y + lineHeights)
						}))
					}
					resolve()
				})
			},
			getImageInfo(src) {
				return new Promise(async (resolve, reject) => {
					if (src.indexOf('http') == -1) {
						setTimeout(() => {
							resolve(src)
						})
					} else {
						// #ifdef APP-PLUS
						uni.getImageInfo({
							src: src,
							success: (res) => {
								resolve(res.path)
							},
							fail(err) {
								resolve(src)
							}
						})
						// #endif
						// #ifndef APP-PLUS
						uni.downloadFile({
							url: src,
							success: (res) => {
								if (res.statusCode === 200) resolve(res.tempFilePath)
							},
							fail: (err) => {
								resolve(src)
							}
						})
						// #endif
					}
				})
			},
			save() {
				let timer = setTimeout(async () => {
					await this.context.draw(true, setTimeout(() => {
						uni.canvasToTempFilePath({
							canvasId: 'canvasId',
							fileType: this.fileType,
							quality: 1,
							width: this.width,
							height: this.height,
							destWidth: this.width * this.pixelRatio,
							destHeight: this.height * this.pixelRatio,
							success: (res) => {
								uni.hideLoading()
								this.$emit('change', res.tempFilePath)
							},
							fail: (err) => {
								console.log('生成图片失败:', err)
							}
						}, this)
					}, 500))
					clearTimeout(timer)
				}, 500)
			},
			error(e) {
				console.log('错误信息：', e)
			}
		}
	}
</script>
</script>
<style lang="scss" scoped>
	.canvas-main {
		position: fixed;
		z-index: -999999 !important;
		opacity: 0;
		top: -5000rpx;
	}
</style>