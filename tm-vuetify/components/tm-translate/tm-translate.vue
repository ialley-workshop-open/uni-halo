<template>
	<view v-show="show" :animation="animationData" class="tm-translate" >
		<slot></slot>
	</view>
</template>

<script>
	/**
	 * 动画
	 * @property {Function} start 动画开始触发.
	 * @property {Function} end 动画结束触发.
	 * @property {Number} duration 动画时长
	 * @property {Number} wait 延时
	 * @property {String} animation-name = [fadeUp|fadeDown|fadeLeft|fadeRight|zoomIn|zoomOut|fadeIn|fadeOut] 动画效果名称.
	 * @property {String|Boolean} auto = [true|false] 默认:true,是否自动播放动画.
	 * @example <tm-translate wait="500" animation-name="fadeDown"><tm-upload></tm-upload></tm-translate>
	 */
	export default {
		name:"tm-translate",
		props:{
			duration:{
				type:Number|String,
				default:600
			},//动画时长.
			wait:{
				type:Number|String,
				default:0
			},//延时动画.
			animationName:{
				type:String,
				default:"fadeUp"
			},
			auto:{//是否自动播放动画.
				type:Boolean,
				default:true
			}
		},
		data() {
			return {
				animationData:"",
				show:false,
				aniOff:true,//是否结束了动画.
			};
		},
		watch:{
			animationName:function(){
				this.play();
			}
		},
		mounted() {
			this.autoPlay();
		},
		destroyed() {
			this.$nextTick(function(){
				this[this.animationName]()
			})
		},
		methods: {
			play(){
				this.$nextTick(function(){
					this[this.animationName]()
				})
			},
			autoPlay(){
				if(!this.auto) return;
				
				this[this.animationName]()
			},
			fadeIn() {
				let t = this;
				if(!this.aniOff) {
					console.warn("未结束动画,不能连续点击.")
					return;
				}
				// 开始动画.
				this.$emit('start')
				this.show = true;
				
				this.$nextTick(function(){
					this.animationData = "";

					this.aniOff = false;
					let duration = parseInt(this.duration)?parseInt(this.duration):500;
					let wait = parseInt(this.wait)? parseInt(this.wait) : 50;
					var animation = uni.createAnimation({
					      duration: 0,
					        timingFunction: 'linear',
					    })
					    this.animation = animation
					    animation.opacity(0).step()
					    this.animationData = animation.export()
						
						uni.$tm.sleep(wait).then(()=>{
							animation.opacity(1).step({duration:duration})
							t.animationData = animation.export()
						}).then(()=>{
							return uni.$tm.sleep(duration);
						}).then(()=>{
							// 结束动画.
							t.$emit('end')
							t.aniOff = true;
						})
						
						
						
				})
			},
			fadeOut() {
				let t = this;
				if(!this.aniOff) {
					console.warn("未结束动画,不能连续点击.")
					return;
				}
				// 开始动画.
				this.$emit('start')
				this.show = true;
				
				this.$nextTick(function(){
					this.animationData = "";
					this.aniOff = false;
					let duration = parseInt(this.duration)?parseInt(this.duration):500;
					let wait = parseInt(this.wait)? parseInt(this.wait) : 50;
					var animation = uni.createAnimation({
					      duration: 0,
					        timingFunction: 'ease',
					    })
					    this.animation = animation
					    animation.opacity(1).step()
					    this.animationData = animation.export()
						
						
						uni.$tm.sleep(wait).then(()=>{
							animation.opacity(0).step({duration:duration})
							t.animationData = animation.export()
						}).then(()=>{
							return  uni.$tm.sleep(duration);;
						}).then(()=>{
							// 结束动画.
							t.$emit('end')
							t.aniOff = true;
						})
						
						
						
				})
			},
			fadeUp() {
				let t = this;
				if(!this.aniOff) {
					console.warn("未结束动画,不能连续点击.")
					return;
				}
				// 开始动画.
				this.$emit('start')
				this.show = true;
				
				this.animationData = "";
				this.aniOff = false;
				let duration = parseInt(this.duration)?parseInt(this.duration):500;
				let wait = parseInt(this.wait)? parseInt(this.wait) : 50;
				var animation = uni.createAnimation({
				      duration: 0,
				        timingFunction: 'ease',
				    })
				    this.animation = animation
				    animation.translateY(45).opacity(0).step()
				    this.animationData = animation.export()
					
					uni.$tm.sleep(wait).then(function(){
						animation.translateY(0).opacity(1).step({duration:duration})
						t.animationData = animation.export()
						 uni.$tm.sleep(duration).then(()=>{
							// 结束动画.
							t.$emit('end')
							t.aniOff = true;
						})
					})
			},
			fadeDown() {
				let t = this;
				if(!this.aniOff) {
					console.warn("未结束动画,不能连续点击.")
					return;
				}
				// 开始动画.
				this.$emit('start')
				this.show = true;
				
				this.$nextTick(function(){
					this.aniOff = false;
					let duration = parseInt(this.duration)?parseInt(this.duration):500;
					let wait = parseInt(this.wait)? parseInt(this.wait) : 50;
					var animation = uni.createAnimation({
					      duration: 0,
					        timingFunction: 'ease',
					    })
					    this.animation = animation
					    animation.translateY(-45).opacity(0).step()
					    this.animationData = animation.export()
						uni.$tm.sleep(wait).then(()=>{
							animation.translateY(0).opacity(1).step({duration:duration})
							t.animationData = animation.export()
						}).then(()=>{
							return uni.$tm.sleep(duration);
						}).then(()=>{
							// 结束动画.
							t.$emit('end')
							t.aniOff = true;
						})
						
				})
			},
			fadeLeft() {
				let t= this;
				if(!this.aniOff) {
					console.warn("未结束动画,不能连续点击.")
					return;
				}
				// 开始动画.
				this.$emit('start')
				this.show = true;
				this.$nextTick(function(){
					this.aniOff = false;
					let duration = parseInt(this.duration)?parseInt(this.duration):500;
					let wait = parseInt(this.wait)? parseInt(this.wait) : 50;
					var animation = uni.createAnimation({
					      duration: 0,
					        timingFunction: 'ease',
					    })
					    this.animation = animation
					    animation.translateX(45).opacity(0).step()
					    this.animationData = animation.export()
						uni.$tm.sleep(wait).then(()=>{
							animation.translateX(0).opacity(1).step({duration:duration})
							t.animationData = animation.export()
						}).then(()=>{
							return uni.$tm.sleep(duration);
						}).then(()=>{
							// 结束动画.
							t.$emit('end')
							t.aniOff = true;
						})
						
				})
			},
			fadeRight() {
				let t = this;
				if(!this.aniOff) {
					console.warn("未结束动画,不能连续点击.")
					return;
				}
				// 开始动画.
				this.$emit('start')
				this.show = true;
				this.$nextTick(function(){
					this.aniOff = false;
					let duration = parseInt(this.duration)?parseInt(this.duration):500;
					let wait = parseInt(this.wait)? parseInt(this.wait) : 50;
					var animation = uni.createAnimation({
					      duration: 0,
					        timingFunction: 'ease',
					    })
					    this.animation = animation
					    animation.translateX(-45).opacity(0).step()
					    this.animationData = animation.export()
						uni.$tm.sleep(wait).then(()=>{
							animation.translateX(0).opacity(1).step({duration:duration})
							t.animationData = animation.export()
						}).then(()=>{
							 return uni.$tm.sleep(duration);
						}).then(()=>{
							// 结束动画.
							t.$emit('end')
							t.aniOff = true;
						})
				})
			},
			zoomIn() {
				let t= this;
				if(!this.aniOff) {
					console.warn("未结束动画,不能连续点击.")
					return;
				}
				// 开始动画.
				this.$emit('start')
				this.show = true;
				this.$nextTick(function(){
					this.aniOff = false;
					let duration = parseInt(this.duration)?parseInt(this.duration):500;
					let wait = parseInt(this.wait)? parseInt(this.wait) : 50;
					var animation = uni.createAnimation({
					      duration: 0,
					        timingFunction: 'ease',
					    })
					    this.animation = animation
					    animation.scale(0.64).opacity(0).step()
					    this.animationData = animation.export()
						uni.$tm.sleep(wait).then(()=>{
							animation.scale(1).opacity(1).step({duration:duration})
							this.animationData = animation.export()
						}).then(()=>{
							return uni.$tm.sleep(duration);
						}).then(()=>{
							// 结束动画.
							t.$emit('end')
							t.aniOff = true;
						})
						
				})
			},
			zoomOut() {
				let t = this;
				if(!this.aniOff) {
					console.warn("未结束动画,不能连续点击.")
					return;
				}
				// 开始动画.
				this.$emit('start')
				this.show = true;
				this.$nextTick(function(){
					this.aniOff = false;
					let duration = parseInt(this.duration)?parseInt(this.duration):500;
					let wait = parseInt(this.wait)? parseInt(this.wait) : 50;
					var animation = uni.createAnimation({
					      duration: 0,
					        timingFunction: 'ease',
					    })
					    this.animation = animation
					    animation.scale(1).opacity(1).step()
					    this.animationData = animation.export()
						uni.$tm.sleep(wait).then(()=>{
							animation.scale(0.64).opacity(0).step({duration:duration})
							t.animationData = animation.export()
						}).then(()=>{
							return uni.$tm.sleep(duration);
						}).then(()=>{
							t.show = false;
							// 结束动画.
							t.$emit('end')
							t.aniOff = true;
						})
						
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
.tm-translate{
	// #ifdef H5
	opacity: 0;
	// #endif
}
</style>
