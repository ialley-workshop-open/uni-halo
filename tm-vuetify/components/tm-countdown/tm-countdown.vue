<template>
	<view class="tm-countdown d-inline-block text-size-n">
		<slot name="default" :timeData="{data:time_data,finish:isfinish}">{{text}}</slot>
	</view>
</template>

<script>
	/**
	 * 倒计时
	 * @description 倒计时。
	 * @property {Number} time = [] 默认 10*1000，单位毫秒，倒计时的总时长。
	 * @property {String} format = [] 默认 'DD天HH小时MM分SS秒'，格式。如果只想要秒：SS秒。
	 * @property {Boolean} autoStart = [] 默认 true，自动开始倒计时。
	 * @property {Function} change 时间变化时触发。
	 * @property {Function} finish 倒计时结束时触发。
	 * @example <tm-button size="s"><tm-countdown format="SS秒" :time="6*1000">
				<template v-slot:default="{timeData}">
					{{timeData.finish?'结束':timeData.data.seconds}}
				</template>
			</tm-countdown></tm-button>
	 */
	export default {
		name:"tm-countdown",
		props:{
			time:{
				type:Number,
				default:10 * 1000
			},
			format:{
				type:String,
				default:'DD天HH小时MM分SS秒'
			},
			autoStart:{
				type:Boolean,
				default:true
			}
		},
		data() {
			return {
				timid:null,
				now:0,
				time_data:{}
			};
		},
		computed:{
			text:function(){
				let minaox = this.formatTime(this.time - this.now);
				let ps = this.format;
				ps = ps.replace(/(DD)/g,minaox.day);
				ps = ps.replace(/(MM)/g,minaox.minutes);
				ps = ps.replace(/(HH)/g,minaox.hour);
				ps = ps.replace(/(SS)/g,minaox.seconds);
				return ps;
			},
			isfinish:function(){
				if(this.now == this.time||this.now==0) return true;
				return false;
			}
		},
		destroyed() {
			clearInterval(this.time);
		},
		mounted() {
			this.formatTime(this.time);
			if(this.autoStart){
				this.start();
			}
			
		},
		methods: {
			formatTime(my_time){
				var daysRound = Math.floor(my_time/1000/60/60/24);
				var hoursRound = Math.floor(my_time/1000/60/60%24);
				var minutesRound = Math.floor(my_time/1000/60%60);
				var secondsRound = Math.floor(my_time/1000%60);
				var millisecondRound = Math.floor(my_time % 1000);
				let time = {
						day:daysRound>9?daysRound:'0'+daysRound,//天
						hour:hoursRound>9?hoursRound:'0'+hoursRound,//小时,
						minutes:minutesRound>9?minutesRound:'0'+minutesRound,//分.
						seconds:secondsRound>9?secondsRound:'0'+secondsRound,//秒。
						millisecond:millisecondRound>9?millisecondRound:'0'+millisecondRound//毫秒。
					};
					this.time_data = time;
				return time;
			},
			// 开始或者继续。
			start() {
				let t = this;
				clearInterval(this.timid);
				this.timid = setInterval(()=>{
					let lst = t.now + 50;
					if(lst == t.time){
						t.$emit('finish')
					}
					if(lst > t.time){
						clearInterval(t.timid);
						return;
					}
					t.now =lst;
					t.$emit('change',t.time_data)
				},50)
			},
			// 停止，直接结束。
			stop(){
				clearInterval(this.timid);
				this.now = this.time;
			},
			// 暂停。
			pause(){
				clearInterval(this.timid);
			},
			// 重置。
			resinit(){
				clearInterval(this.timid);
				this.now = 0;
			}
		},
	}
</script>

<style lang="scss">

</style>
