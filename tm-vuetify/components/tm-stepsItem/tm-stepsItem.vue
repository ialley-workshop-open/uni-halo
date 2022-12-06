<template>
	<view class="tm-stepsItem ">
		<view @click="onclick" class="px-10 flex-center flex-col tm-stepsItem-wk" >
			<view class="tm-stepsItem-dian rounded  flex-center"
			:class="[
				isSu&&!isFa&&model=='icon'?' su  '+ color +' shadow-'+color+'-5':'',
				isSu&&!isFa&&model=='number'?' su '+color +' shadow-'+color+'-5' :'',
				isFa?'fa red' +' shadow-red-5':'',
				isWa&&!isFa&&!isSu?(black_tmeme?'wa bk grey-lighten-4 text-grey':`wa grey-lighten-4 text text-grey`):'',
				
			]"
			>
				<text v-if="model=='number'">{{setNum}}</text>
				<view v-if="model=='icon'">
					<tm-icons size="20" v-if="isSu&&!isFa" name="icon-check"></tm-icons>
					<tm-icons size="20" v-if="isFa" name="icon-times"></tm-icons>
					<view v-if="isWa&&!isFa&&!isSu" class="tm-stepsItem-dian-quan rounded " :class="[color]"></view>
				</view>
			</view>
			<view class="tm-stepsItem-text text-size-xs py-10 "><slot></slot></view>
		</view>
		
	</view>
</template>

<script>
	/**
	 * 步骤条子组件
	 * @description 只能在tm-steps中使用。默认插槽显示底部内容。
	 * @property {String} model = [number|icon] 默认：number，两种模式，number:数字，icon:图标模式。
	 * @property {String} color = [] 默认：primary，主题色。
	 * @property {Boolean} wait = [true|false] 默认：true，待流转。显示错误状态。优先级最低
	 * @property {Boolean} fail = [true|false] 默认：false，显示错误状态。优先级最高
	 * @property {Boolean} success = [true|false] 默认：false，显示错误状态。优先级高于wait.
	 * @property {Number|String} step = [] 默认：0，model=number时，显示的数字文本。
	 * @property {Boolean} black = [true|false] 默认：false，暗黑模式。
	 * @property {Function} click 点击事件。
	 * @example <tm-stepsItem :fail="true" model="icon" ></tm-stepsItem>
	 */
	export default {
		name:"tm-stepsItem",
		props:{
			black:{
				type:Boolean|String,
				default:null
			},
			step:{
				type:Number|String,
				default:0
			},
			success:{
				type:Boolean,
				default:false
			},
			fail:{
				type:Boolean,
				default:false
			},
			wait:{
				type:Boolean,
				default:true
			},
			color:{
				type:String,
				default:'primary'
			},
			// number|icon
			model:{
				type:String,
				default:'number'
			}
		},
		data() {
			return {
				width:0,
				su_selft:false,
				fa_selft:false,
				wa_selft:false,
			};
		},
		watch:{
			
			success:function(newval){
				this.isSu = newval;
			},
			fail:function(newval){
				this.isFa = newval;
			},
			wait:function(newval){
				this.isWa = newval;
			},
		},
		computed:{
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			},
			setNum:function(){
				
				return this.step;
			},
			isSu:{
				get:function(){
					return this.su_selft;
				},
				set:function(val){
					this.su_selft = val;
				}
			},
			isFa:{
				get:function(){
					return this.fa_selft;
				},
				set:function(val){
					this.fa_selft = val;
				}
			},
			isWa:{
				get:function(){
					return this.wa_selft;
				},
				set:function(val){
					this.wa_selft = val;
				}
			},
		},
		async mounted() {
			this.isSu = this.success;
			this.isFa = this.fail;
			this.isWa = this.wait;
			this.$nextTick(async function (){
				let tbs = await this.$Querey(".tm-stepsItem");
				this.width = tbs[0].width;
			})
		},
		methods: {
			setActive({success,fail,wait}) {
				
				this.isSu = success;
				
				if(typeof fail !=='undefined'){
					this.isFa = fail;
				}
				this.isWa = wait;
			},
			onclick(e){
				this.$emit('click',e)
			},
		},
	}
</script>

<style lang="scss" scoped>
.tm-stepsItem{
	flex-shrink: 0;
	
	.tm-stepsItem-wk{
		position: relative;
		top: -18upx;
		
	}
	.tm-stepsItem-dian{
		width: 36upx;
		height: 36upx;
		font-size: 22upx;

		line-height: 12upx;
		.tm-stepsItem-dian-quan{
			width: 12upx;
			height: 12upx;
			
		}
	}
	.tm-stepsItem-text{
		flex-shrink: 0;
		
		width: 100upx;
		text-align: center;
		
	}
}
</style>
