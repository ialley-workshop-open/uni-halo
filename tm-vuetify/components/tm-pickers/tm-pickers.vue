<template>
	<view class="tm-pickers d-inline-block fulled">
		<view  @click.stop.prevent="openPoup"><slot></slot></view>
		<tm-poup @change="toogle" ref="pop" v-model="showpop" :height="750" :bg-color="black_tmeme?'grey-darken-5':bgColor">
			<view class="tm-pickers-title pa-32 pb-16">
				<view class="text-size-n text-align-center" style="min-height: 48rpx;">{{title}}</view>
				<view class="tm-pickers-close  rounded flex-center " :class="black_tmeme?'grey-darken-3':'grey-lighten-3'">
					<tm-icons @click="close" name="icon-times" size="24" :color="black_tmeme?'white':'grey'"></tm-icons>
				</view>
			</view>
			<tm-pickersView v-if="showpop" @change="$emit('change',$event)" @aniStart="aniisTrue=false" @aniEnd="aniisTrue=true" ref="tmPicKersTest" :defaultValue="dataValue"
			:itemHeight="itemHeight" :list="list" :rangKey="rangKey"
			:childrenKey="childrenKey" :black="black_tmeme" :disabled="disabled"
			:bgColor="bgColor"
			></tm-pickersView>
			<view class="pa-32">
				<tm-button :black="black_tmeme" @click="confirm"  block itemeClass="round-24"  :fllowTheme="fllowTheme" :theme="colorBtn_tmeme" fontSize="32">{{btnText}}</tm-button>
			</view>
		</tm-poup>
	</view>
</template>

<script>
	/**
	 * 普通级联拉选择器(弹层式)
	 * @description 多级关联，单级关联选择
	 * @property {String} title = [] 弹层层标题
	 * @property {String} btn-text = [] 底部按钮确认的文字
	 * @property {String} btn-color = [primary|green|orange|red|blue|bg-gradient-blue-lighten] 默认：bg-gradient-blue-lighten底部按钮确认的背景颜色仅支持主题色名称
	 * @property {Array} default-value = [] 默认：[],默认赋值项。可选三种赋值方式，名称赋值，对象赋值，数字序列赋值
	 * @property {String|Number} item-height = [34|42|50|58|62] 项目的高度单位px
	 * @property {Array} list = [] 选择器的数据，可选格式：Array<string>,Array<object>.如果为object格式需要提供rangKey.如果为多级需要提供children.key值
	 * @property {String} rang-key = [text|title] 默认：text,如果List格式为对象数组，需要提供此值
	 * @property {String} children-key = [children] 默认：children,如果List格式为对象数组且为多级联选择，需要提供此值，理论上无限级联数据
	 * @property {String|Boolean} black = [true|false] 是否开启暗黑模式。 
	 * @property {String|Boolean} disabled = [true|false] 是否禁用
	 * @property {String} bg-color = [white|blue] 默认：white,白色背景；请填写背景的主题色名称。 
	 * @property {Function} change 列数被选中改变时触发。
	 * @property {Function} confirm = [] 返回当前选中的数据
	 * 
	 */
	import tmButton from "@/tm-vuetify/components/tm-button/tm-button.vue"
	import tmPoup from "@/tm-vuetify/components/tm-poup/tm-poup.vue"
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	import tmPickersView from "@/tm-vuetify/components/tm-pickersView/tm-pickersView.vue"
	export default {
		components:{tmButton,tmPoup,tmIcons,tmPickersView},
		name:"tm-pickers",
		model:{
			prop:'value',
			event:'input'
		},
		props: {
			// 等同v-model,或者value.sync
			value: {
				type: String | Number,
				default: false
			},
			// 默认选中的项
			// 格式有三种分别是[string,string...]
			// [数字序列，数字序列....]
			// 和list同等对象结构[{},{},...],此格式需要提供rangKey字段否则报错。
			defaultValue:{
				type:Array,
				default:()=>{return []}
			},
			// 行高。
			itemHeight: {
				type: String | Number,
				default: 40
			},
			list: {
				type: Array,
				default: () => {
					return []
				}
			},
			// 如果数据是对象，则需要提供key值。
			rangKey: {
				type: String,
				default: "text"
			},
			// 如果是联级，则需要提供子集key值。
			childrenKey: {
				type: String,
				default: "children"
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
			// 顶部标题。
			title:{
				type:String,
				default:'请选择选项' 
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
			// 跟随主题色的改变而改变。
			fllowTheme:{
				type:Boolean|String,
				default:true
			}
			
		
		},
		data() {
			return {
				showpop:false,
				dataValue:[],
				aniisTrue:true,
			};
		},
		computed: {
		
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			},
			colorBtn_tmeme:function(){
				if(this.$tm.vx.state().tmVuetify.color!==null&&this.$tm.vx.state().tmVuetify.color && this.fllowTheme){
					return this.$tm.vx.state().tmVuetify.color;
				}
				return this.btnColor;
			},

		},
		mounted() {
			this.showpop = this.value;
			this.$nextTick(function(){
				uni.hideKeyboard();
			})
		},
		watch:{
			value:function(val){
				
				this.showpop = val;
				
			}
		},
		methods: {
			confirm() {
				
				if(!this.aniisTrue){
					console.log('no');
					return ;
				}
				let sdata = this.$refs.tmPicKersTest.getSelectedValue();
				
				let saray = [];
				sdata.forEach(item=>{
					saray.push(item.data)
				})
				this.$emit('confirm',sdata)
				this.$emit('update:defaultValue',saray)
				this.showpop=false;
			},
			close(){
				this.showpop=false;
			},
			openPoup(){
				if(this.disabled==true) return;
				this.showpop=true;
			},
			toogle(e){
				console.log(this.showpop);
				if(e){
					this.$nextTick(function(){
						
						if(this.dataValue != this.defaultValue){
							this.dataValue = this.defaultValue;
						}
						this.$refs.tmPicKersTest.setDefaultValue(this.dataValue)
					})
				}
				this.$emit('input',e);
				this.$emit('update:value',e);
			}
		},
	}
</script>

<style lang="scss" scoped>
	.tm-pickers-title {
		position: relative;
		.tm-pickers-close {
			position: absolute;
			top: 32upx;
			right: 32upx;
			width: 50upx;
			height: 50upx;
			
		}
	}
.tm-pickers{
	
}
</style>
