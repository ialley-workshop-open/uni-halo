<template>
	<view class="tm-pickersDate d-inline-block fulled">
		<view  @click.stop.prevent="openPoup"><slot></slot></view>
		<tm-poup @change="toogle" ref="pop" v-model="showpop" :height="750" :bg-color="black_tmeme?'grey-darken-5':bgColor">
			<view class="tm-pickersDate-title pa-32 pb-16">
				<view class="text-size-n text-align-center" style="min-height: 48rpx;">{{title}}</view>
				<view class="tm-pickersDate-close  rounded flex-center " :class="black_tmeme?'grey-darken-3':'grey-lighten-3'">
					<tm-icons @click="close" name="icon-times" size="24" :color="black_tmeme?'white':'grey'"></tm-icons>
				</view>
			</view>
			<tm-pickersDateView ref="gg" 
			@aniStart="aniisTrue=false" @aniEnd="aniisTrue=true" 
			:modeValue="modeValue"
			:black="black_tmeme"   
			:start="start" 
			:end="end" 
			:defaultValue="dataValue"
			:itemHeight="itemHeight"
			:disabled="disabled"
			:bgColor="bgColor"
			:showDetail="showDetail"
			:mode="mode"
			:fullNumber="fullNumber"
			></tm-pickersDateView>
			<view class="pa-32">
				<tm-button :black="black_tmeme" @click="confirm"  block itemeClass="round-24" :theme="btnColor" fontSize="32">{{btnText}}</tm-button>
			</view>
			
		</tm-poup>
	</view>
</template>

<script>
	/**
	 * 日期下拉选择器(弹层)
	 * @description 日期下拉选择器(弹层)
	 * @property {Array} default-value = [] 默认：当前的时间，初始显示的时间
	 * @property {String|Number} item-height = [34|42|50|58|62] 项目的高度单位px
	 * @property {String|Boolean} black = [true|false] 是否开启暗黑模式。 
	 * @property {String|Boolean} disabled = [true|false] 是否禁用
	 * @property {String} bg-color = [white|blue] 默认：white,白色背景；请填写背景的主题色名称。 
	 * @property {Object} show-detail = [{year:true,month:true,day:true,hour:false,min:false,sec:false}] 默认：{year:true,month:true,day:true,hour:false,min:false,sec:false}
	 * @property {String} start = [1900-1-1 00:00:00] 默认：1900-1-1 00:00:00，开始的时间
	 * @property {String} end = [] 默认：当前，结束的时间
	 * @property {String|Boolean} mode = [true|false] 默认：true，是否显示中文年，月后缀
	 * @property {String|Boolean} full-number = [true|false] 默认：true，是否把个位数补齐双位数
	 * @property {String} title = [] 弹层层标题
	 * @property {String} btn-text = [] 底部按钮确认的文字
	 * @property {String} btn-color = [primary|green|orange|red|blue|bg-gradient-blue-lighten] 默认：bg-gradient-blue-lighten底部按钮确认的背景颜色仅支持主题色名称
	 * @property {Function} confirm 返回当前选中的数据
	 */
	import tmButton from "@/tm-vuetify/components/tm-button/tm-button.vue"
	import tmPoup from "@/tm-vuetify/components/tm-poup/tm-poup.vue"
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	import tmPickersDateView from "@/tm-vuetify/components/tm-pickersDateView/tm-pickersDateView.vue"
	export default {
		components:{tmButton,tmPoup,tmIcons,tmPickersDateView},
		name:"tm-pickersDate",
		model:{
			prop:'value',
			event:'input'
		},
		mounted() {
			this.showpop = this.value;
		},
		props: {
			// 行高。
			itemHeight: {
				type: String | Number,
				default: 40
			},
			// 等同v-model,或者value.sync
			value: {
				type: String | Number,
				default: false
			},
			black:{
				type:String|Boolean,
				default:null
			},
			// 是否禁用
			disabled:{
				type:String|Boolean,
				default:false
			},
			// 背景颜色，主题色名称。
			bgColor:{
				type:String,
				default:'white'
			},
			//要展示的时间。
			showDetail:{
				type:Object,
				default:()=>{
					return {
						year:true,//年
						month:true,//月
						day:true,//天
						hour:false,//小时
						min:false,//分
						sec:false//秒
					}
				}
			},
			start:{
				type:String,
				default:'1949-1-1 00:00:00'
			},
			end:{
				type:String,
				default:''
			},
			defaultValue:'',
			// 是否显示中文年，月后缀
			mode:{
				type:String|Boolean,
				default:true
			},
			// 是否把个位数补齐双位数
			fullNumber:{
				type:String|Boolean,
				default:true
			},
			// 顶部标题。
			title:{
				type:String,
				default:'请选择时间' 
			},
			// 底部按钮文件
			btnText:{
				type:String,
				default:'确认' 
			},
			// 底部按钮背景主题色名称
			btnColor:{
				type:String,
				default:'primary' 
			},
			//要展示的时间。
			modeValue:{
				type:Object,
				default:()=>{
					return {
						year:'年',//年
						month:'月',//月
						day:'日',//天
						hour:'时',//小时
						min:'分',//分
						sec:'秒'//秒
					}
				}
			},
		
		},
		data() {
			return {
				showpop:false,
				dataValue:'1949',
				aniisTrue:true,
				
			};
		},
		computed: {
		
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			}
		},
		watch:{
			value:function(val){
				this.showpop = val;
				if(val){
					this.$nextTick(function(){
						setTimeout(function() {
							uni.hideKeyboard();
							
						}, 20);
					})
				}
			}
		},
		mounted() {
			this.$nextTick(function(){
				this.$refs.gg.resetVal(this.dataValue)
			})
		},
		methods: {
			confirm() {
				if(!this.aniisTrue){
					console.log('no');
					return ;
				}
				let value = this.$refs.gg.getSelectedValue();
				this.$emit('confirm',value)
				// this.$emit('update:defaultValue',this.$refs.gg.getSelectedValue())
				
				this.$refs.pop.close();
			},
			close(){
				this.$refs.pop.close();
			},
			openPoup(){
				if(this.disabled==true) return;
				this.showpop=!this.showpop
			},
			toogle(e){
				let t = this;
				if(e){
					if(this.dataValue != this.defaultValue){
						t.dataValue = t.defaultValue;
					}
					// #ifdef APP-VUE
					this.$nextTick(function(){
						setTimeout(function(){
							t.$refs.gg.resetVal(t.dataValue)
						},500)
					})
					// #endif
					
					// #ifndef APP-VUE
					t.$refs.gg.resetVal(t.dataValue)
					// #endif
				}
				this.$emit('input',e);
				this.$emit('update:value',e);
			}
		},
	}
</script>

<style lang="scss" scoped>
	.tm-pickersDate-title {
		position: relative;
		.tm-pickersDate-close {
			position: absolute;
			top: 32upx;
			right: 32upx;
			width: 50upx;
			height: 50upx;
			
		}
	}
</style>
