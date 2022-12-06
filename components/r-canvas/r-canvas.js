export default{
	data(){
		return{
			system_info:{}, //system info
			canvas_width:0, //canvas width px
			canvas_height:0, //canvas height px
			ctx:null, //canvas object
			canvas_id:null, //canvas id
			hidden:false,//Whether to hide canvas
			scale:1,//canvas scale
			r_canvas_scale:1,
			if_ctx:true
		}
	},
	methods:{
		/**
		 * save r-canvas.vue object
		 * @param {Object} that
		 */
		// saveThis(that){
		// 	rCanvasThis = that
		// },
		/**
		 * Draw round rect text
		 * @param {Object} config
		 * @param {Number} config.x x坐标
		 * @param {Number} config.y y坐标
		 * @param {Number} config.w 宽度
		 * @param {Number} config.h 高度
		 * @param {Number} config.radius 圆角弧度
		 * @param {String} config.fill_color 矩形颜色
		 */
		fillRoundRect(config) {
			return new Promise((resolve,reject)=>{
				let x = this.compatibilitySize(parseFloat(config.x)*this.scale)
				let y = this.compatibilitySize(parseFloat(config.y)*this.scale)
				let w = this.compatibilitySize(parseFloat(config.w)*this.scale)
				let h = this.compatibilitySize(parseFloat(config.h)*this.scale)
				let radius = config.radius?parseFloat(config.radius)*this.scale:10*this.scale
				
				let fill_color = config.fill_color || "black"
				// The diameter of the circle must be less than the width and height of the rectangle
				if (2 * radius > w || 2 * radius > h) { 
					reject("The diameter of the circle must be less than the width and height of the rectangle")
					return false; 
				}
				this.ctx.save();
				this.ctx.translate(x, y);
				//  
				this.drawRoundRectPath({
					w: w, 
					h: h, 
					radius: radius
				});
				this.ctx.fillStyle = fill_color
				this.ctx.fill();
				this.ctx.restore();
				resolve()
			})
		},
		/**
		 * Draws the sides of a rounded rectangle
		 * @param {Object} config
		 * @param {Number} config.w 宽度
		 * @param {Number} config.h 高度
		 * @param {Number} config.radius 圆角弧度
		 */
		drawRoundRectPath(config) {
			this.ctx.beginPath(0);
			this.ctx.arc(config.w - config.radius, config.h - config.radius, config.radius, 0, Math.PI / 2);
			this.ctx.lineTo(config.radius, config.h);
			this.ctx.arc(config.radius, config.h - config.radius, config.radius, Math.PI / 2, Math.PI);
			this.ctx.lineTo(0, config.radius);
			this.ctx.arc(config.radius, config.radius, config.radius, Math.PI, Math.PI * 3 / 2);
			this.ctx.lineTo(config.w - config.radius, 0);
			this.ctx.arc(config.w - config.radius, config.radius, config.radius, Math.PI * 3 / 2, Math.PI * 2);
			this.ctx.lineTo(config.w, config.h - config.radius);
			this.ctx.closePath();
		},
		/**
		 * Draw special Text,line wrapping is not supported
		 * @param {Object} config
		 * @param {String} config.text 文字
		 * @param {Number} config.x x坐标
		 * @param {Number} config.y y坐标
		 * @param {String} config.font_color 文字颜色
		 * @param {String} config.font_family 文字字体
		 * @param {Number} config.font_size 文字大小（px）
		 */
		drawSpecialText(params){
			let general = params.general
			let list = params.list
			return new Promise(async (resolve,reject)=>{
				if(!general){
					reject("general cannot be empty:101")
					return;
				}else if(list && list.length>0){
					for(let i in list){
						if(i != 0){
							let font_size = list[i-1].font_size?parseFloat(list[i-1].font_size):20
							this.ctx.setFontSize(font_size)
							general.x = parseFloat(general.x) + this.ctx.measureText(list[i-1].text).width
						}
						list[i].x = general.x
						list[i].y = general.y + (list[i].margin_top?parseFloat(list[i].margin_top):0)
						await this.drawText(list[i])
					}
					resolve()
				}else{
					reject("The length of config arr is less than 0")
					return;
				}
				
			})
		},
		/**
		 * array delete empty
		 * @param {Object} arr
		 */
		arrDeleteEmpty(arr){
			let newArr = []
			for(let i in arr){
				if(arr[i]){
					newArr.push(arr[i])
				}
			}
			return newArr
		},
		/**
		 * Draw Text,support line
		 * @param {Object} config
		 * @param {String} config.text 文字
		 * @param {Number} config.max_width 文字最大宽度（大于宽度自动换行）
		 * @param {Number} config.line_height 文字上下行间距
		 * @param {Number} config.x x坐标
		 * @param {Number} config.y y坐标
		 * @param {String} config.font_color 文字颜色
		 * @param {String} config.font_family 文字字体 默认值：Arial
		 * @param {String} config.text_align 文字对齐方式（left/center/right）
		 * @param {Number} config.font_size 文字大小（px）
		 * @param {Boolean} config.line_through_height 中划线大小
		 * @param {Boolean} config.line_through_color 中划线颜色
		 * @param {String} config.font_style 规定文字样式
		 * @param {String} config.font_variant 规定字体变体
		 * @param {String} config.font_weight 规定字体粗细
		 * @param {String} config.line_through_cap 线末端类型
		 * @param {String} config.line_clamp 最大行数
		 * @param {String} config.line_clamp_hint 超过line_clamp后，尾部显示的自定义标识 如 ...
		 * @param {String} config.is_line_break 是否开启换行符换行
		 * 
		 */
		drawText(config,configuration = {}){
			
			configuration['line_num'] = configuration.line_num?configuration.line_num:0
			configuration['text_width'] = configuration.text_width?configuration.text_width:0
			
			return new Promise(async (resolve,reject)=>{
				
				if(config.text){
					
					let draw_width = 0,draw_height = 0,draw_x = config.x,draw_y = config.y
					let font_size = config.font_size?(parseFloat(config.font_size)*this.scale):(20*this.scale)
					let font_color = config.font_color || "#000"
					let font_family = config.font_family || "Arial"
					let line_height = config.line_height || config.font_size || 20
					let text_align = config.text_align || "left"
					let font_weight = config.font_weight || "normal"
					let font_variant = config.font_variant || "normal"
					let font_style = config.font_style || "normal"
					let line_clamp_hint = config.line_clamp_hint || '...'
					let lineBreakJoinText = ""
					let max_width = config.max_width?parseFloat(config.max_width)*this.scale:0
					// checkout is line break
					if(config.is_line_break){
						let splitTextArr = config.text.split(/[\n]/g)
						if(splitTextArr && splitTextArr.length > 0){
							let newSplitTextArr = this.arrDeleteEmpty(splitTextArr)
							if(newSplitTextArr && newSplitTextArr.length > 0){
								lineBreakJoinText = newSplitTextArr.slice(1).join("\n")
								config.text = newSplitTextArr[0]
							}else{
								reject("Text cannot be empty:103")
								return
							}
						}else{
							reject("Text cannot be empty:102")
							return
						}
					}
					
					this.ctx.setFillStyle(font_color) // color
					this.ctx.textAlign = text_align;
					this.ctx.font = `${font_style} ${font_variant} ${font_weight} ${parseInt(font_size)}px ${font_family}`
					if(configuration.text_width >= this.ctx.measureText(config.text).width){
						draw_width = configuration.text_width
					}else if(max_width > 0){
						draw_width = max_width < this.ctx.measureText(config.text).width ? this.resetCompatibilitySize(max_width) : this.resetCompatibilitySize(this.ctx.measureText(config.text).width)
					}else{
						draw_width = this.ctx.measureText(config.text).width
					}
					configuration.text_width = draw_width / this.scale
					if( max_width && this.compatibilitySize(this.ctx.measureText(config.text).width) > this.compatibilitySize(max_width)){
						let current_text = ""
						let text_arr = config.text.split("")
						for(let i in text_arr){
							if( this.compatibilitySize(this.ctx.measureText(current_text+text_arr[i]).width) > this.compatibilitySize(max_width) ){
								// Hyphenation that is greater than the drawable width continues to draw
								if(config.line_clamp && parseInt(config.line_clamp) == 1){
									// Subtracting the current_text tail width from the line_clamp_hint width
									let current_text_arr = current_text.split('')
									let json_current_text = ''
									while(true){
										current_text_arr = current_text_arr.slice(1)
										json_current_text = current_text_arr.join('')
										if(this.compatibilitySize(this.ctx.measureText(json_current_text).width) <= this.compatibilitySize(this.ctx.measureText(line_clamp_hint).width)){
											current_text = current_text.replace(json_current_text,'')
											break;
										}
									}
									configuration.line_num += 1
									this.ctx.setFontSize(parseInt(this.compatibilitySize(font_size))) // font size
									this.ctx.fillText(current_text + line_clamp_hint, this.compatibilitySize(parseFloat(config.x)*this.scale), this.compatibilitySize(parseFloat(config.y)*this.scale));
								}else{
									configuration.line_num += 1
									this.ctx.setFontSize(parseInt(this.compatibilitySize(font_size))) // font size
									this.ctx.fillText(current_text, this.compatibilitySize(parseFloat(config.x)*this.scale), this.compatibilitySize(parseFloat(config.y)*this.scale));
									config.text = text_arr.slice(i).join("")
									config.y = config.y + line_height
									if(config.line_clamp){
										config.line_clamp = parseInt(config.line_clamp) - 1
									}
									await this.drawText(config,configuration)
								}
								
								break;
							}else{
								current_text = current_text+text_arr[i]
							}
						}
					}else{
						if(config.line_through_height){
							let x = parseFloat(config.x)*this.scale
							let w
							let y = parseFloat(config.y)*this.scale - (font_size / 2.6) 
							if(text_align == "left"){
								w = this.ctx.measureText(config.text).width/1.1 + parseFloat(config.x)*this.scale
							}else if(text_align == "right"){
								w = parseFloat(config.x)*this.scale - this.ctx.measureText(config.text).width/1.1
							}else if(text_align == "center"){
								x = parseFloat(config.x)*this.scale - this.ctx.measureText(config.text).width / 1.1 / 2
								w = parseFloat(config.x)*this.scale + this.ctx.measureText(config.text).width / 1.1 / 2
							}
							this.drawLineTo({
								x:x,
								y:y,
								w:w,
								h:y,
								line_width:config.line_through_height,
								line_color:config.line_through_color,
								line_cap:config.line_through_cap
							})
						}
						configuration.line_num += 1
						this.ctx.setFontSize(parseInt(this.compatibilitySize(font_size))) // font size
						this.ctx.fillText(config.text, this.compatibilitySize(parseFloat(config.x)*this.scale), this.compatibilitySize(parseFloat(config.y)*this.scale));
						if(config.line_clamp){
							config.line_clamp = parseInt(config.line_clamp) - 1
						}
					}
					if(lineBreakJoinText){
						await this.drawText({...config,text:lineBreakJoinText,y:config.y + line_height},configuration)
					}
					draw_height = config.font_size * configuration.line_num
					draw_width = configuration.text_width
					resolve({draw_width,draw_height,draw_x,draw_y})
				}else{
					reject("Text cannot be empty:101")
				}
			})
		},
		/**
		 * Draw Line
		 * @param {Object} config
		 * @param {Object} config.x x坐标
		 * @param {Object} config.y y坐标
		 * @param {Object} config.w 线的宽度
		 * @param {Object} config.h 线的高度
		 * @param {Object} config.line_width 线的宽度
		 * @param {Object} config.line_color 线条颜色
		 */
		drawLineTo(config){
			let x = this.compatibilitySize(config.x)
			let y = this.compatibilitySize(config.y)
			let w = this.compatibilitySize(config.w)
			let h = this.compatibilitySize(config.h)
			let line_width = config.line_width?parseFloat(config.line_width)*this.scale:1*this.scale
			let line_color = config.line_color || "black"
			let line_cap = config.line_cap || "butt"
			this.ctx.beginPath()
			this.ctx.lineCap = line_cap
			this.ctx.lineWidth = line_width
			this.ctx.strokeStyle = line_color
			this.ctx.moveTo(x,y)
			this.ctx.lineTo(w,h)
			this.ctx.stroke()
		},
		/** 
		 * Compatibility px
		 * @param {Object} size
		 */
		compatibilitySize(size) {
		  let canvasSize = (parseFloat(size) / 750) * this.system_info.windowWidth
		  canvasSize = parseFloat(canvasSize * 2)
		  return canvasSize
		},
		/**
		 * Restore compatibility px
		 * @param {Object} size
		 */
		resetCompatibilitySize(size) {
		  let canvasSize = (parseFloat(size/2)/this.system_info.windowWidth) * 750
		  return canvasSize
		},
		/**
		 * Init canvas
		 */
		init(config){
			return new Promise(async (resolve,reject)=>{
				if(!config.canvas_id){
					reject("Canvas ID cannot be empty, please refer to the usage example")
					return;
				}
				this.hidden = config.hidden
				this.canvas_id = config.canvas_id
				let system_info = await uni.getSystemInfoSync()
				this.system_info = system_info
				this.scale = config.scale&&parseFloat(config.scale)>0?parseInt(config.scale):1
				this.canvas_width = (config.canvas_width ? this.compatibilitySize(config.canvas_width) : system_info.windowWidth) * this.scale
				this.canvas_height = (config.canvas_height ? this.compatibilitySize(config.canvas_height) : system_info.windowHeight) * this.scale,
				this.r_canvas_scale = 1/this.scale
				this.ctx = uni.createCanvasContext(this.canvas_id,this)
				this.setCanvasConfig({
					global_alpha:config.global_alpha?parseFloat(config.global_alpha):1,
					backgroundColor:config.background_color?config.background_color:"#fff"
				})
				resolve()
			})
		},
		/**
		 * clear canvas all path
		 */
		clearCanvas(){
			return new Promise(async (resolve,reject)=>{
				if(!this.ctx){
					reject("canvas is not initialized:101")
					return
				}else{
					this.ctx.clearRect(0,0,parseFloat(this.canvas_width)*this.scale,parseFloat(this.canvas_height)*this.scale)
					await this.draw()
					resolve()
				}
			})
		},
		/**
		 * Set canvas config
		 * @param {Object} config
		 */
		setCanvasConfig(config){
			this.ctx.globalAlpha = config.global_alpha
			this.ctx.fillStyle = config.backgroundColor
			this.ctx.fillRect(0, 0, parseFloat(this.canvas_width)*this.scale, parseFloat(this.canvas_height)*this.scale)
		},
		/**
		 * set canvas width
		 * @param {Object} width
		 */
		setCanvasWidth(width){
			if(!width){
				uni.showToast({
					title:'setCanvasWidth：width error',
					icon:'none'
				})
			}
			this.canvas_width = this.compatibilitySize(parseFloat(width)) * this.scale
			this.ctx.width = this.canvas_width
		},
		/**
		 * set canvas height
		 * @param {Object} height
		 */
		setCanvasHeight(height){
			if(!height){
				uni.showToast({
					title:'setCanvasWidth：height error',
					icon:'none'
				})
			}
			this.canvas_height = this.compatibilitySize(parseFloat(height)) * this.scale
			this.ctx.height = this.canvas_height
		},
		/**
		 * Draw to filepath
		 */
		draw(callback){
			return new Promise((resolve,reject)=>{
				let stop = setTimeout(()=>{
					this.ctx.draw(false,setTimeout(()=>{
					    uni.canvasToTempFilePath({
					    	canvasId: this.canvas_id,
					    	quality: 1,
					    	success: (res)=>{
					    		console.log('res',res)
					    		resolve(res)
					    		callback && callback(res)
					    	},
					    	fail:(err)=>{
					    		reject(JSON.stringify(err)|| "Failed to generate poster:101")
					    	}
					    },this)
					},300))
					clearTimeout(stop)
				},300)
			})
		},
		/**
		 * draw rect
		 * @param {Number} config.x x坐标
		 * @param {Number} config.y y坐标
		 * @param {Number} config.w 图形宽度(px)
		 * @param {Number} config.h 图形高度(px)
		 * @param {Number} config.color 图形颜色
		 * @param {Number} config.is_radius 是否开启圆图（1.1.6及以下版本废弃，请使用border_radius）
		 * @param {Number} config.border_width 边框大小
		 * @param {Number} config.border_color 边框颜色
		 * 
		 */
		drawRect(config){
			return new Promise(async (resolve,reject)=>{
				if(!config.border_width || config.border_width <=0){
					config.border_width = 0
				}else{
					config.border_width = parseFloat(config.border_width)
				}
				if(parseFloat(config.border_width) > 0){
					let sub_config = JSON.parse(JSON.stringify(config))
					sub_config.border_width = 0
					sub_config.w = config.w + config.border_width
					sub_config.h = config.h + config.border_width
					sub_config.color = config.border_color || 'black'
					if(sub_config.border_radius){
						sub_config.border_radius = parseFloat(sub_config.border_radius) + parseFloat(config.border_width) / 2
					} 
					await this.drawRect(sub_config)
				}
				
				let color = config.color || 'white'
				config.x =  (parseFloat(config.x) + config.border_width / 2)
				config.y = (parseFloat(config.y) + config.border_width / 2)
				config['color'] = color
				this.ctx.fillStyle = color;
				if(config.is_radius || config.border_radius){
					this.setNativeBorderRadius(config)
					this.ctx.fill()
				}else{
					console.log('config.border_width',config.border_width)
					this.ctx.fillRect(this.compatibilitySize(config.x*this.scale),this.compatibilitySize(config.y*this.scale),this.compatibilitySize(parseFloat(config.w)*this.scale),this.compatibilitySize(parseFloat(config.h)*this.scale))
				}
				resolve()
			})
		},
		/**
		 * Draw image
		 * @param {Object} config
		 * @param {String} config.url 图片链接
		 * @param {Number} config.x x坐标
		 * @param {Number} config.y y坐标
		 * @param {Number} config.w 图片宽度(px)
		 * @param {Number} config.h 图片高度(px)
		 * @param {Number} config.border_width 边大小
		 * @param {Number} config.border_color 边颜色
		 * @param {Number} config.is_radius 是否开启圆图（1.1.6及以下版本废弃，请使用border_radius）
		 * @param {Number} config.border_radius 圆角弧度
		 */
		drawImage(config){
			return new Promise(async (resolve,reject)=>{
				if(config.url){
					let type = 0 // 1、network image  2、native image  3、base64 image
					let image_url
					let reg = /^https?/ig;
					if(reg.test(config.url)){
						type = 1
					}else{
						if((config.url.indexOf("data:image/png;base64") != -1) || config.url.indexOf("data:image/jpeg;base64") != -1 || config.url.indexOf("data:image/gif;base64") != -1){
							type = 3
						}else{
							type = 2
						}
					}
					if(type == 1){
						// network image
						await this.downLoadNetworkFile(config.url).then(res=>{ // two function
							image_url = res
						}).catch(err=>{
							reject(err)
							return;
						})
					}else if(type == 2){
						// native image
						const imageInfoResult = await uni.getImageInfo({
							src: config.url
						});
						try{
							if(imageInfoResult.length <= 1){
								reject(imageInfoResult[0].errMsg + ':404')
								return
							}
						}catch(e){
							reject(e+':500')
							return
						}
						let base64 = await this.urlToBase64({url:imageInfoResult[1].path})
						// #ifdef MP-WEIXIN
						await this.base64ToNative({url:base64}).then(res=>{
							image_url = res
						}).catch(err=>{
							reject(JSON.stringify(err)+":501")
							return;
						})
						// #endif
						// #ifndef MP-WEIXIN
						image_url = base64
						// #endif
						
					}else if(type == 3){
						// #ifdef MP-WEIXIN
						await this.base64ToNative({url:config.url}).then(res=>{
							image_url = res
						}).catch(err=>{
							reject(JSON.stringify(err)+":500")
							return;
						})
						// #endif
						// #ifndef MP-WEIXIN
						image_url = config.url
						// #endif
					}else{
						reject("Other Type Errors:101")
						return
					}
					if(config.border_width){
						let border_radius = 0
						if(config.border_radius){
							let multiple = config.w / config.border_radius
							border_radius = (parseFloat(config.w) + parseFloat(config.border_width)) / multiple
						}
						// drawRect
						await this.drawRect({
							x:parseFloat(config.x) - parseFloat(config.border_width)/2,
							y:parseFloat(config.y) - parseFloat(config.border_width)/2,
							w:parseFloat(config.w) + parseFloat(config.border_width),
							h:parseFloat(config.h) + parseFloat(config.border_width),
							color:config.border_color,
							border_radius:border_radius,
							border_width:config.border_width,
							is_radius:config.is_radius
						})
					}
					
					

					if(config.border_radius){
						config.color =  config.color?config.color:'rgba(0,0,0,0)'
						
						// 圆角有白边,+0.5的误差
						config.w = config.w + 0.3
						config.h = config.h + 0.3
						
						this.setNativeBorderRadius(config)
					}else if(config.is_radius){
						//已废弃 is_radius
						this.ctx.setStrokeStyle("rgba(0,0,0,0)")
						this.ctx.save()
						this.ctx.beginPath()
						this.ctx.arc(this.compatibilitySize(parseFloat(config.x)*this.scale+parseFloat(config.w)*this.scale/2), this.compatibilitySize(parseFloat(config.y)*this.scale+parseFloat(config.h)*this.scale/2), this.compatibilitySize(parseFloat(config.w)*this.scale/2), 0, 2 * Math.PI, false)
						this.ctx.stroke();
						this.ctx.clip()
					}
					
					await this.ctx.drawImage(image_url,this.compatibilitySize(parseFloat(config.x)*this.scale),this.compatibilitySize(parseFloat(config.y)*this.scale),this.compatibilitySize(parseFloat(config.w)*this.scale),this.compatibilitySize(parseFloat(config.h)*this.scale))
					this.ctx.restore() //Restore previously saved drawing context
					resolve()
				}else{
					let err_msg = "Links cannot be empty:101"
					reject(err_msg)
				}
			})
		},
		/**
		 * base64 to native available path
		 * @param {Object} config
		 */
		base64ToNative(config){
			return new Promise((resolve,reject)=>{
				let fileName = new Date().getTime()
				var filePath = `${wx.env.USER_DATA_PATH}/${fileName}_rCanvas.png`
				wx.getFileSystemManager().writeFile({
					filePath: filePath,
					data: config.url.replace(/^data:\S+\/\S+;base64,/, ''),
					encoding: 'base64',
					success: function() {
						resolve(filePath)
					},
					fail: function(error) {
						reject(error)
					}
				})
			})
		},
		/**
		 * native url to base64
		 * @param {Object} config
		 */
		urlToBase64(config){
			return new Promise(async (resolve,reject)=>{
				if (typeof window != 'undefined') {
					await this.downLoadNetworkFile(config.url).then(res=>{ // two function
						resolve(res)
					}).catch(err=>{
						reject(err)
					})
				}else if (typeof plus != 'undefined') {
					plus.io.resolveLocalFileSystemURL(config.url,(obj)=>{
						obj.file((file)=>{
							let fileReader = new plus.io.FileReader()
							fileReader.onload = (res)=>{
								resolve(res.target.result)
							}
							fileReader.onerror = (err)=>{
								reject(err)
							}
							fileReader.readAsDataURL(file)
						}, (err)=>{
							reject(err)
						})
					},(err)=>{
						reject(err)
					})
				}else if(typeof wx != 'undefined'){
					wx.getFileSystemManager().readFile({
						filePath: config.url,
						encoding: 'base64',
						success: function(res) {
							resolve('data:image/png;base64,' + res.data)
						},
						fail: function(error) {
							reject(error)
						}
					})
				}
			})
		},
		setNativeBorderRadius(config){
			let border_radius = config.border_radius?(parseFloat(config.border_radius)*this.scale):(20*this.scale)
			if ((parseFloat(config.w)*this.scale) < 2 * border_radius) border_radius = (parseFloat(config.w)*this.scale) / 2;
			if ((parseFloat(config.h)*this.scale) < 2 * border_radius) border_radius = (parseFloat(config.h)*this.scale) / 2;
			this.ctx.beginPath();
			this.ctx.moveTo(this.compatibilitySize((parseFloat(config.x)*this.scale) + border_radius), this.compatibilitySize((parseFloat(config.y)*this.scale)));
			this.ctx.arcTo(this.compatibilitySize((parseFloat(config.x)*this.scale) + (parseFloat(config.w)*this.scale)), this.compatibilitySize((parseFloat(config.y)*this.scale)), this.compatibilitySize((parseFloat(config.x)*this.scale) + (parseFloat(config.w)*this.scale)), this.compatibilitySize((parseFloat(config.y)*this.scale) + (parseFloat(config.h)*this.scale)), this.compatibilitySize(border_radius));
			this.ctx.arcTo(this.compatibilitySize((parseFloat(config.x)*this.scale) + (parseFloat(config.w)*this.scale)), this.compatibilitySize((parseFloat(config.y)*this.scale) + (parseFloat(config.h)*this.scale)), this.compatibilitySize((parseFloat(config.x)*this.scale)), this.compatibilitySize((parseFloat(config.y)*this.scale) + (parseFloat(config.h)*this.scale)), this.compatibilitySize(border_radius));
			this.ctx.arcTo((this.compatibilitySize(parseFloat(config.x)*this.scale)), this.compatibilitySize((parseFloat(config.y)*this.scale) + (parseFloat(config.h)*this.scale)), this.compatibilitySize((parseFloat(config.x)*this.scale)), this.compatibilitySize((parseFloat(config.y)*this.scale)), this.compatibilitySize(border_radius));
			this.ctx.arcTo(this.compatibilitySize((parseFloat(config.x)*this.scale)), this.compatibilitySize((parseFloat(config.y)*this.scale)), this.compatibilitySize((parseFloat(config.x)*this.scale) + (parseFloat(config.w)*this.scale)), this.compatibilitySize((parseFloat(config.y)*this.scale)), this.compatibilitySize(border_radius));
			this.ctx.closePath();
			this.ctx.strokeStyle = config.color || config.border_color || 'rgba(0,0,0,0)'; // 设置绘制边框的颜色
			this.ctx.stroke();
			this.ctx.save()
			this.ctx.clip();
			
		},
		/**
		 * Download network file
		 * @param {Object} url : download url
		 */
		downLoadNetworkFile(url){
			return new Promise((resolve,reject)=>{
				uni.downloadFile({
					url,
					success:(res)=>{
						if(res.statusCode == 200){
							resolve(res.tempFilePath)
						}else{
							reject("Download Image Fail:102")
						}
					},
					fail:(err)=>{
						reject("Download Image Fail:101")
					}
				})
			})
		},
		/**
		 * Save image to natice
		 * @param {Object} filePath ： native imageUrl
		 */
		saveImage(filePath){
			return new Promise((resolve,reject)=>{
				if(!filePath){
					reject("FilePath cannot be null:101")
					return;
				}
				
				// #ifdef H5
					var createA = document.createElement("a");
					createA.download = filePath;
					createA.href = filePath;
					document.body.appendChild(createA);
					createA.click();
					createA.remove();
					resolve()
				// #endif
				
				// #ifndef H5
				uni.saveImageToPhotosAlbum({
					filePath: filePath,
					success:(res)=>{
						resolve(res)
					}, 
					fail:(err)=>{
						reject(err)
					}
				})
				// #endif
			})
		}
	}
}
