<template>
	<view class="tm-pullBottom">
		<scroll-view 
		class="tm-pullBottom-sroll"
		:refresher-enabled="disabled"
		:refresher-threshold="pullY"
		:refresher-triggered="isRefresh"
		:scroll-y="true"
		refresher-default-style="none"
		:lower-threshold="bottomY"
		@scrolltolower="pullBottom"
		@refresherpulling="onPulling"
		@refresherrefresh="onRefresh" 
		@refresherrestore="onRestore"
		@refresherabort="onAbort"
		:style="{
			height:activeHeight+'px'
		}">
			<view v-if="bottomLoadding==true" class="tm-pullBottom-top flex-center flex-col">
				<view v-if="loading">
					
					<view>
						<slot name="pull" v-if="isPullDown==true&&showScrollPic">
							<view  class="tm-pullBottom-top-icon flex-center pull"
							>
								<tm-icons :color="color" name="icon-long-arrow-up"></tm-icons>
							</view>
							<view class="flex-center tm-pullBottom-top-text text-size-n"
							:class="[`text-${color}`]">继续下拉刷新</view>
						</slot>
						<slot name="pullReresh" v-if="isPullDown==false&&showScrollPic">
							<view  class="tm-pullBottom-top-icon flex-center "
							>
								<tm-icons :color="color" name="icon-long-arrow-up"></tm-icons>
							</view>
							<view class="flex-center tm-pullBottom-top-text text-size-n"
							:class="[`text-${color}`]" >松开刷新</view>
						</slot>
					</view>
					<tm-loadding v-if="showScrollPic==false" ></tm-loadding>
				</view>
			</view>
			<slot name="default"></slot>
			<tm-loadding v-if="bottomLoadding==false&&loading" ></tm-loadding>
		</scroll-view>
	</view>
</template>

<script>
	/**
	 * 上拉触底刷新
	 * @property {String|Number} height = [] 默认0，默认0使用父高度。
	 * @property {Number} pullY = [] 默认80，下拉多长的距离执行刷新。
	 * @property {Number} bottomY = [] 默认0，离底部多高度多少执行加载
	 * @property {String} color = [] 默认primary，主题色。
	 * @property {Boolean} loading = [] 默认 false，，需要loading.sync执行双向绑定，加载状态，true，加载中。false加载完成。
	 * @property {Boolean} disabled = [] 默认 true，，是否启用下拉刷新，不影响触底刷新功能。
	 * @property {Boolean} finish = [] 默认 false，是否数据没有了。如果为true，触底后将不会触发刷新操作。
	 * @property {Function} refresh 当下拉或者触底时，触发此函数。参数e=pull为下拉刷新，bottom为触底刷新。
	 * @example <tm-pullBottom :loading.sync="loading" @refresh="getdata"></tm-pullBottom>
	 */
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	import tmLoadding from "@/tm-vuetify/components/tm-loadding/tm-loadding.vue"
	
	export default {
		components:{tmIcons,tmLoadding},
		name:"tm-pullBottom",
		props:{
			// 高度，默认为0时，自动使用父组件的高度.
			height: {
				type: String | Number,
				default: 0
			},
			pullY:{
				type: Number,
				default: 80
			},
			bottomY:{
				type: Number,
				default: 0
			},
			color: {
				type: String,
				default: 'primary'
			},
			loading:{
				type:Boolean,
				default:false
			},
			// 是否没有更多数据了。
			finish:{
				type:Boolean,
				default:false
			},
			disabled:{
				type:Boolean,
				default:true
			}
			
		},
		watch:{
			loading:function(newval){
				
				if(newval==false){
					// 结束操作。
					this.susscess();
				}
			},
			
		},
		data() {
			return {
				activeHeight: 0,
				isRefresh:false,//是否触发了下拉刷新区域。
				freshing:false,//是否刷新 中。
				showScrollPic:false,//是否拖动了下拉区域，显示图标。停止不显示。
				isPullDown:false,//是否下正确的下拉刷新区域。
				bottomLoadding:true,//当前是底部还是顶部刷新操作。false为底部。true为顶部。
			};
		},
		computed:{

		},
		mounted() {
			this.guid = uni.$tm.guid();
			let t = this;
			this.$nextTick(async function() {
				this.activeHeight = uni.upx2px(this.height);
				if (!this.activeHeight) {
					let wsz = await this.$Querey(".tm-pullBottom",this).catch(e=>{})
					this.activeHeight = wsz[0].height||150;
				}
				if(this.loading===true){
					this.$emit('update:loading',false)
				}
			});
		},
		methods: {
			onRefresh(e) {
				let t = this;
				this.isRefresh = true;
				setTimeout(function() {
					t.isRefresh = false;
					t.showScrollPic = false;
					if(t.freshing==true) return;
					t.freshing = true;
					t.pullChangeOk();
				}, 200);
				
			},
			onPulling(e){
				
				if(this.loading === false){
					
					this.$emit('update:loading',true)
				}
				this.bottomLoadding = true;
				this.showScrollPic = true;//显示刷新 图标。
				let dy = e.target.dy || 0
				// #ifdef H5
					dy = e.target.deltaY;
				// #endif
				
				if(dy < this. pullY){
					this.isPullDown = true;
				}else{
					this.isPullDown = false;
				}
			},
			onAbort(e){
				this.$emit('update:loading',false)
				this.showScrollPic = false;//显示刷新 图标。
				
			},
			onRestore(e){
				this.isRefresh = 'restore'; // 需要重置
				
			},
			// 结束操作。
			susscess(){
				this.freshing = false;
				this.$emit('update:loading',false)
				
			},
			pullChangeOk(){
				
				this.$emit("refresh",'pull')
			},
			// 触底加载中。
			pullBottom(){
				if(this.finish) return;
				this.bottomLoadding = false;
				if(this.loading === false){
					this.$emit('update:loading',true)
					this.$emit("refresh",'bottom')
				}
				
			},
		},
	}
</script>

<style lang="scss" scoped>
.tm-pullBottom{
	height: 100%;
	.tm-pullBottom-sroll{
		position: relative;
		.tm-pullBottom-top{
			width: 100%;
			position: relative;
			
			.tm-pullBottom-top-icon{
				transition: all 0.5s;
				&.pull{
					transform: rotate(180deg);
				}
			}
		}
	}
	
}
</style>
