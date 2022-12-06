<template>
	<view class="tm-avatarCrop fixed t-0 l-0 black" :style="{ width: `${width}px`, height: `${height}px` }">
		<tm-sticky model="bottom">
			<view class="fulled flex-center mb-32">
				<tm-button size="m" text @click="$emit('cancel')">取消</tm-button>
				<tm-button size="m" @click="selectedImage">选择图片</tm-button>
				<tm-button size="m" @click="saveImage">确定</tm-button>
			</view>
		</tm-sticky>

		<view class="flex-center"><canvas id="AvatarCrop" canvas-id="AvatarCrop" :style="{ width: `${area_width}px`, height: `${area_height}px` }"></canvas></view>
		<movable-area class="absolute t-0 l-0 zIndex-n1" :style="{ width: `${width}px`, height: `${height}px` }">
			<movable-view
				:out-of-bounds="false"
				@scale="movaScaleChange"
				@change="movaChange"
				:x="areview_x"
				:y="areview_y"
				direction="all"
				:scale="true"
				:style="{ width: `${scale_w}px`, height: `${scale_h}px` }"
			>
				<image v-show="image_src" @load="loadImage" :src="image_src" :style="{ width: `${scale_w}px`, height: `${scale_h}px` }"></image>
			</movable-view>
		</movable-area>
		<view :style="{ width: `${width}px`, height: `${height}px` }" class="absolute tm-avatarCrop-bodywk t-0 l-0 zIndex-n16">
			<view
				class="tm-avatarCrop-area relative"
				:class="[isArc ? 'rounded' : '']"
				:style="{
					width: `${area_width}px`,
					height: `${area_height}px`,
					top: `${posArray[0].y}px`,
					left: `${posArray[0].x}px`
				}"
			>
				<view class="flex-center text-size-s" :style="{ height: pos_size + 'px' }">宽:{{ Math.floor(area_width) }},高:{{ Math.floor(area_height) }}</view>
				<block v-for="(item, index) in 4" :key="index">
					<view
						v-if="(isRatio == true && index !== 3) || index == 3"
						:key="index"
						:style="{ width: `${pos_size}px`, height: `${pos_size}px` }"
						@touchstart.stop.prevent="m_start($event, index)"
						@touchmove.stop.prevent="m_move($event, index)"
						@touchend.stop.prevent="m_end($event, index)"
						@mousedown.stop.prevent="m_start($event, index)"
						@mousemove.stop.prevent="m_move($event, index)"
						@mouseup.stop.prevent="m_end($event, index)"
						@mouseleave="m_end($event, index)"
						class="tm-avatarCrop-pos  absolute black opacity-5"
						:class="[
							'tm-avatarCrop-pos-'+index,
							index == 0?'tm-avatarCrop-area-top-left':'',
							index == 1?'tm-avatarCrop-area-top-right': '',
							index == 2?'tm-avatarCrop-area-bottom-left': '',
							index == 3?'tm-avatarCrop-area-bottom-right': ''
						]"
						:id="`${index}`"
					>
					
						<tm-icons style="line-height: 0;" color="white" v-if="index !== 3" :size="22" dense name="icon-expand-alt"></tm-icons>
						<tm-icons style="line-height: 0;" color="white" v-else :size="22" dense name="icon-arrows-alt"></tm-icons>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 图片裁剪
 * @property {Number} area-width = [] 默认300,裁剪框的宽度
 * @property {Number} area-height = [] 默认300,裁剪框的高度
 * @property {Number} quality = [] 默认1,图片压缩质量0-1
 * @property {String} fileType = [jpg|png] 默认 png
 * @property {Boolean} is-ratio = [] 默认false,是否允许用户调整裁剪框的大小
 * @property {Boolean} is-arc = [] 默认false,是否圆形
 */
import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
import tmSticky from '@/tm-vuetify/components/tm-sticky/tm-sticky.vue';
import tmImages from '@/tm-vuetify/components/tm-images/tm-images.vue';
export default {
	name: 'tm-avatarCrop',
	props: {
		areaWidth: {
			type: Number,
			default: 300
		},
		areaHeight: {
			type: Number,
			default: 300
		},
		//是否允许用户调整距形区域的大小 。
		isRatio: {
			type: Boolean,
			default: false
		},
		//是否圆形。
		isArc: {
			type: Boolean,
			default: false
		},
		quality: {
			type: Number,
			default: 1
		},
		fileType:{
			type:String,
			default:'png'
		},
		confirm: {
			type: Function,
			default: function(data) {
				return function(data) {};
			}
		}
	},
	computed: {},
	components: {
		tmIcons,
		tmButton,
		tmSticky,
		tmImages
	},
	data() {
		return {
			width: 0,
			height: 0,
			canvanid: 'AvatarCrop',
			showCanva: false,
			area_width: 0,
			area_height: 0,
			prevent_left: 0,
			prevent_top: 0,
			old_x: 0,
			old_y: 0,
			posArray: [],
			endDrage: true,
			pos_size: 24,
			image_src: '',
			scale_w: 0, //图片缩放的宽，
			scale_h: 0, //图片缩放的高。
			scale: 1,
			real_w: 0,
			real_h: 0,
			scale_areview_x: 0,
			scale_areview_y: 0,
			areview_x: 0,
			areview_y: 0,
			areview_new_x: 0,
			areview_new_y: 0,

			isAddImage: false
		};
	},
	destroyed() {},
	created() {
		let sys = uni.getSystemInfoSync();
		this.width = sys.windowWidth;
		this.height = sys.screenHeight;
		this.area_width = uni.upx2px(this.areaWidth);
		this.area_height = uni.upx2px(this.areaHeight);
		let dr = [];
		for (let i = 0; i < 4; i++) {
			dr.push({
				x: 0,
				y: 0
			});
		}
		dr[0].x = (this.width - this.area_width) / 2;
		dr[0].y = (this.height - this.area_height) / 2;
		this.posArray = [...dr];
	},
	async mounted() {
		let t = this;
		await this.jishunTopData();
		
	},
	methods: {
		async jishunTopData() {
			let t =this;
			this.$nextTick(async function() {
				this.listData = [];
				uni.$tm.sleep(100).then(s=>{
					let psd = uni.createSelectorQuery().in(t);
					psd.select('.tm-avatarCrop-pos-0').boundingClientRect()
					.select('.tm-avatarCrop-pos-1').boundingClientRect()
					.select('.tm-avatarCrop-pos-2').boundingClientRect()
					.select('.tm-avatarCrop-pos-3').boundingClientRect()
					.exec(function(p){
						let list = p;
						let dr = [...t.posArray];
						for (let i = 0; i < list.length; i++) {
							
							if(list[i]){
								dr.splice(parseInt(list[i].id), 1, {
									x: list[i].left,
									y: list[i].top
								});
							}
						}
						t.posArray = [...dr];
					})
				})
			});
		},
		async loadImage(e) {
			this.isAddImage = true;

			this.posArray.splice(0, 1, {
				x: (this.width - this.area_width) / 2,
				y: (this.height - this.area_height) / 2
			});
			
			await this.jishunTopData();
			this.$nextTick(async function() {
				let img_w = e.detail.width;
				let img_h = e.detail.height;
				this.real_w = img_w;
				this.real_h = img_h;
				let ratio_w = img_w >= this.width ? this.width : img_w;
				let ratio_h = ratio_w / (img_w / img_h);
				this.scale_w = ratio_w;
				this.scale_h = ratio_h;
				//图片宽大于高度时，
				this.areview_y = (this.height - this.scale_h) / 2;
				this.areview_x = (this.width - this.scale_w) / 2;

				this.areview_new_x = this.areview_x;
				this.areview_new_y = this.areview_y;
			});
		},
		selectedImage() {
			let t = this;
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				success: function(res) {
					t.image_src = res.tempFilePaths[0];
				}
			});
		},
		saveImage() {
			if (!this.image_src) {
				uni.$tm.toast('未选择图片');
				return;
			}
			let t = this;
			this.$nextTick(async function() {
				let scale_x = this.posArray[0].x - this.areview_new_x;
				let scale_y = this.posArray[0].y - this.areview_new_y;
				//计算真实的xy时，需要通过原有的缩放的大小通过比例来放大或者缩小到真实在源图片上的坐标。
				let real_x = (this.real_w / (this.scale_w * this.scale)) * scale_x;
				let real_y = (this.real_h / (this.scale_h * this.scale)) * scale_y;
				let real_w = (this.real_w / (this.scale_w * this.scale)) * this.area_width;
				let real_h = real_w;
				if (this.isRatio) {
					real_h = (this.real_h / (this.scale_h * this.scale)) * this.area_height;
				}
				const ctx = uni.createCanvasContext('AvatarCrop', this);
				if (!ctx) return;
				//如果把框移动到图片外，则不要截取。
				if (real_x < 0 || real_y < 0) {
					uni.$tm.toast('请把框移入图片中');
					return;
				}

				if (this.isArc) {
					ctx.beginPath();
					ctx.arc(this.area_width / 2, this.area_width / 2, this.area_width / 2, 0, 2 * Math.PI);
					ctx.clip();
				}

				ctx.drawImage(this.image_src, real_x, real_y, real_w, real_h, 0, 0, this.area_width, this.area_height);

				uni.showLoading({ title: '...' });
				function getimage() {
					let rtx = uni.getSystemInfoSync().pixelRatio;
					let a_w =  t.area_width * rtx;
					let a_h =  t.area_height * rtx;
					console.log(a_w,a_h);
					uni.canvasToTempFilePath(
						{
							x: 0,
							y: 0,
							width: a_w,
							height: a_h,
							canvasId: 'AvatarCrop',
							quality:t.quality,
							fileType:t.fileType,
							success: function(res) {
								// 在H5平台下，tempFilePath 为 base64
								uni.hideLoading();
								t.$nextTick(function() {
									t.$emit('confirm', { width:a_w, height: a_h, src: res.tempFilePath });
									t.confirm({ width: a_w, height: a_h, src: res.tempFilePath });
								});
							},
							fail: function(res) {
								uni.$tm.toast('请重试');
							}
						},
						t
					);
				}
				ctx.draw(true, function() {
					getimage();
				});
			});
		},
		movaChange(e) {
			//当添加新图片时，这里的执行要比添加时的慢。因此会覆盖前面设置的xy
			if (!this.isAddImage) {
				//移动后，真实的x,y已经得到，不需要再计算缩放的xy
				//(因为uniapp的bug缩放后返回 的xy始终是原有的xy而不是真实的)
				this.scale_areview_x = 0;
				this.scale_areview_y = 0;
				this.areview_new_x = e.detail.x;
				this.areview_new_y = e.detail.y;
			} else {
				this.isAddImage = false;
			}
		},
		movaScaleChange(e) {
			//通过缩放，计算出缩放后的x,y的和原有的x,y之间的差值得到真实的x,y。
			//(因为uniapp的bug缩放后返回 的xy始终是原有的xy而不是真实的)
			let scale_x = -(this.scale_w - this.scale_w * e.detail.scale) / 2;
			let scale_y = (this.scale_h - this.scale_h * e.detail.scale) / 2;
			this.areview_new_x = -scale_x;
			this.areview_new_y = this.posArray[0].y - Math.abs(scale_y);
			// 保存缩放的比例。
			this.scale = e.detail.scale;
		},
		m_start(event, index) {
			event.preventDefault();
			event.stopPropagation();
			const ctx = uni.createCanvasContext('AvatarCrop', this);
			if (ctx) {
				ctx.clearRect(0, 0, this.area_width, this.area_height);
				ctx.draw();
			}
			var touch;
			if (event.type.indexOf('mouse') == -1 && event.changedTouches.length == 1) {
				touch = event.changedTouches[0];
			} else {
				touch = {
					pageX:event.pageX,
					pageY:event.pageY
				}
			}
			// #ifdef APP-VUE
			if (index == 0 || index == 2) {
				this.old_x = touch.pageX;
			} else if (index == 1 || index == 3) {
				this.old_x = touch.pageX + this.area_width;
			}
			if (index == 0 || index == 1) {
				this.old_y = touch.pageY;
			} else if (index == 2 || index == 3) {
				this.old_y = touch.pageY+ this.area_height;
			}
			// #endif

			// #ifndef APP-VUE
			if (index == 0 || index == 2) {
				this.old_x = touch.pageX - event.currentTarget.offsetLeft - this.posArray[index].x;
			} else if (index == 1 || index == 3) {
				this.old_x = touch.pageX - event.currentTarget.offsetLeft - this.posArray[index].x + this.area_width - this.pos_size;
			}
			if (index == 0 || index == 1) {
				this.old_y = touch.pageY - event.currentTarget.offsetTop - this.posArray[index].y;
			} else if (index == 2 || index == 3) {
				this.old_y = touch.pageY - event.currentTarget.offsetTop - this.posArray[index].y + this.area_height - this.pos_size;
			}
			// #endif
			
			
			this.endDrage = false;
		},
		m_move(event, index) {
			if (this.endDrage) return;
			let t = this;
			event.preventDefault();
			event.stopPropagation();
			var touch;
			if (event.type.indexOf('mouse') == -1 && event.changedTouches.length == 1) {
				var touch = event.changedTouches[0];
			} else {

				touch = {
					pageX:event.pageX,
					pageY:event.pageY
				}
			}
			// #ifdef APP-VUE
			let ch = touch.pageY - this.pos_size/2;
			let chx = touch.pageX - this.pos_size/2;
			// #endif
			// #ifndef APP-VUE
			let ch = touch.pageY - t.old_y;
			let chx = touch.pageX - t.old_x;
			// #endif
			
			
			let pos_size = this.pos_size;
			let x_cha_len = chx - t.posArray[index].x;
			let y_cha_len = ch - t.posArray[index].y;
			t.posArray.splice(index, 1, {
				x: chx,
				y: ch
			});
			
			let w = 0;
			let h = 0;
			
			if (index == 0) {
				
				
				t.posArray.splice(1, 1, {
					x: t.posArray[1].x,
					y: ch
				});
				t.posArray.splice(2, 1, {
					x: chx,
					y: t.posArray[2].y
				});
				w = t.posArray[1].x + pos_size - t.posArray[0].x;
				h = t.posArray[2].y + pos_size - t.posArray[0].y;
				
				
			} else if (index == 1) {
				t.posArray.splice(0, 1, {
					x: t.posArray[0].x,
					y: ch
				});
				t.posArray.splice(3, 1, {
					x: chx,
					y: t.posArray[3].y
				});
				w = t.posArray[1].x + pos_size - t.posArray[0].x;
				h = t.posArray[2].y + pos_size - t.posArray[1].y;
			} else if (index == 2) {
				t.posArray.splice(0, 1, {
					x: chx,
					y: t.posArray[0].y
				});
				t.posArray.splice(3, 1, {
					x: t.posArray[3].x,
					y: ch
				});
				w = t.posArray[3].x + pos_size - t.posArray[2].x;
				h = t.posArray[2].y + pos_size - t.posArray[1].y;
			}
			if (index !== 3) {
				this.area_width = w < 30 ? 30 : w;
				this.area_height = h < 30 ? 30 : h;
			} else {
				let top_x = chx - this.area_width + pos_size;
				let top_y = ch - this.area_height + pos_size;
				t.posArray.splice(0, 1, {
					x: top_x,
					y: top_y
				});
				t.posArray.splice(1, 1, {
					x: top_x + this.area_width - pos_size,
					y: top_y
				});
				t.posArray.splice(2, 1, {
					x: top_x,
					y: top_y + this.area_height - pos_size
				});
			}
		},
		m_end(event, index) {
			if (this.disabled) return;
			let t = this;
			event.preventDefault();
			event.stopPropagation();

			this.endDrage = true;
		}
	}
};
</script>

<style lang="scss" scoped>
.tm-avatarCrop {
	.tm-avatarCrop-bodywk {
		pointer-events: none;
	}

	.tm-avatarCrop-area {
		background-color: rgba(0, 0, 0, 0.3);
		border: 1px dotted rgba(255, 255, 255, 0.7);
		pointer-events: none;
		.tm-avatarCrop-pos {
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: grey;
			pointer-events: auto;
			&.tm-avatarCrop-area-top-left {
				left: 0;
				top: 0;
				transform: rotate(90deg);
			}
			&.tm-avatarCrop-area-top-right {
				right: 0;
				top: 0;
			}
			&.tm-avatarCrop-area-bottom-right {
				right: 0;
				bottom: 0;
			}
			&.tm-avatarCrop-area-bottom-left {
				left: 0;
				bottom: 0;
			}
		}
	}
}
</style>
