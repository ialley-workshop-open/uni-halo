<template>

	<view class="tm-pickersCity d-inline-block fulled">
		<view  @click.stop.prevent="openPoup"><slot></slot></view>
		<tm-poup @change="toogle" ref="pop" v-model="showpop" :height="750" :bg-color="black_tmeme?'grey-darken-5':bgColor">
			<view class="tm-pickersCity-title pa-32 pb-16">
				<view class="text-size-g text-align-center" style="min-height: 48rpx;">{{title}}</view>
				<view class="tm-pickersCity-close  rounded flex-center " :class="black_tmeme?'grey-darken-3':'grey-lighten-3'">
					<tm-icons @click="close" name="icon-times" size="24" :color="black_tmeme?'white':'grey'"></tm-icons>
				</view>
			</view>
			<tm-pickersView v-if="showpop" @aniStart="aniisTrue=false" @aniEnd="aniisTrue=true"  :default-value="dataValue" :bg-color="bgColor" :black="black_tmeme" :disabled="disabled" ref="tmPicKersTest"  :list="list" ></tm-pickersView>
			
			<view class="pa-32">
				<tm-button @click="confirm"  block itemeClass="round-24" :black="black_tmeme" :theme="btnColor" fontSize="32">{{btnText}}</tm-button>
			</view>
		</tm-poup>
	</view>
</template>

<script>
	import provinceData from '@/tm-vuetify/tool/util/province.js';
	import cityData from '@/tm-vuetify/tool/util/city.js';
	import areaData from '@/tm-vuetify/tool/util/area.js';
	/**
	 * 地区选择器（弹层试）
	 * @description 地区选择器（弹层试）
	 * @property {String} title = [] 弹层层标题
	 * @property {String} btn-text = [] 底部按钮确认的文字
	 * @property {String} btn-color = [primary|green|orange|red|blue|bg-gradient-blue-lighten] 默认：bg-gradient-blue-lighten底部按钮确认的背景颜色仅支持主题色名称
	 * @property {String} bg-color = [white|blue] 默认：white,白色背景；请填写背景的主题色名称。 
	 * @property {Function} confirm = [] 返回当前选中的数据
	 * @property {String} level = [province|city|area] ,默认area,显示的级别province:仅显示省，city仅显示省市，area：显示省市区。
	 * @property {Array} default-value = [] 同tm-pckerView格式，可以是数组内：序列，对象，字符串赋值。
	 * @property {String|Boolean} black = [true|false] 是否开启暗黑模式。 
	 * @property {String|Boolean} disabled = [true|false] 是否禁用
	 * @example <tm-pickersCityView ref="city" :defaultValue='["上海市", "市辖区", "徐汇区"]'></tm-pickersCityView>
	 * 
	 * 
	 */
	import tmButton from "@/tm-vuetify/components/tm-button/tm-button.vue"
	import tmPoup from "@/tm-vuetify/components/tm-poup/tm-poup.vue"
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	import tmPickersView from "@/tm-vuetify/components/tm-pickersView/tm-pickersView.vue"
	export default {
		components:{tmButton,tmPoup,tmIcons,tmPickersView},
		name:"tm-pickersCity",
		model:{
			prop:'value',
			event:'input'
		},
		props: {
			defaultValue:{
				type:Array,
				default:()=>{return []}
			},
			// 显示的级别。province，city，area。
			level:{
				type:String,
				default:'area'
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
			
			
			// 等同v-model,或者value.sync
			value: {
				type: String | Number,
				default: false
			},

			// 背景颜色，主题色名称。
			bgColor:{
				type:String,
				default:'white'
			},
			show:{
				type:Boolean,
				default:true
			},
			// 顶部标题。
			title:{
				type:String,
				default:'请选择地址' 
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
		
		},
		data() {
			return {
				showpop:false,
				dataValue:[],
				list:[],
				aniisTrue:true,
			};
		},
		computed: {
		
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			}
		},
		mounted() {
			this.showpop = this.value;
			this.$nextTick(function(){
				this.chili_level();
				uni.hideKeyboard();
			})
		},
		watch:{
			value:function(val){
				this.showpop = val;
			}
		},
		methods: {
			// 获取选中的资料。
			getSelectedValue(){
				let d = this.$refs.tmPicKersTest.getSelectedValue();
				let p = [];
				if(this.level=='province'){
					p = [d[0].data.text]
				}else if(this.level=='city'){
					p = [d[0].data.text,d[1].data.text]
				}else{
					p = [d[0].data.text,d[1].data.text,d[2].data.text]
				}
				//返回对象数组
				if(typeof this.defaultValue[0] === 'object'){
					this.$emit("update:defaultValue",[d[0].data,d[1].data,d[2].data])
				//返回索引数组
				}else if(typeof this.defaultValue[0] === 'number'){
					this.$emit("update:defaultValue",[d[0].index,d[1].index,d[2].index])
				//返回字符串数组
				}else{
					this.$emit("update:defaultValue",p)
				}
				
				return p;
			},
			chili_level(){
				if(this.level=='province'){
					this.chiliFormatCity_pro();
				}else if(this.level=='city'){
					this.chiliFormatCity_city();
				}else{
					this.chiliFormatCity_area();
				}
			},
			chiliFormatCity_area() {
				let list = [];
				provinceData.forEach((item,index)=>{
					list.push({
						id:item.value,
						text:item.label,
						children:[]
					})
				})
				cityData.forEach((item,index)=>{
					item.forEach((citem,cindex)=>{
						list[index].children.push({
							id:citem.value,
							text:citem.label,
							children:[]
						})
					})
				})
				list.forEach((item,index)=>{
					item.children.forEach((citem,cindex)=>{
						areaData[index][cindex].forEach(jitem=>{
							list[index].children[cindex].children.push({
								id:jitem.value,
								text:jitem.label
							})
						})
					})
				})
				
				this.list = list;
			},
			chiliFormatCity_pro() {
				let list = [];
				provinceData.forEach((item,index)=>{
					list.push({
						id:item.value,
						text:item.label
					})
				})
				
				this.list = list;
			},
			chiliFormatCity_city() {
				let list = [];
				provinceData.forEach((item,index)=>{
					list.push({
						id:item.value,
						text:item.label,
						children:[]
					})
				})
				cityData.forEach((item,index)=>{
					item.forEach((citem,cindex)=>{
						list[index].children.push({
							id:citem.value,
							text:citem.label
						})
					})
				})
				
				this.list = list;
			},
			
			confirm() {
				if(!this.aniisTrue){
					console.log('no');
					return ;
				}
				this.$emit('confirm',this.getSelectedValue())
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
				
				if(e){
					this.$nextTick( function(){
						
						if(this.dataValue != this.defaultValue){
							
							this.dataValue = this.defaultValue;
							this.$refs.tmPicKersTest.setDefaultValue(this.dataValue)
						}else{
							
							if(!this.dataValue || this.dataValue?.length==0){
								this.$refs.tmPicKersTest.setDefaultValue([0,0,0])
							}else{
								this.$refs.tmPicKersTest.setDefaultValue(this.dataValue)
							}
							
						}
						
						this.$emit('input',e);
						this.$emit('update:value',e);
					})
				}
				
			}
		},
	}
</script>

<style lang="scss" scoped>
	.tm-pickersCity-title {
		position: relative;
		.tm-pickersCity-close {
			position: absolute;
			top: 32upx;
			right: 32upx;
			width: 50upx;
			height: 50upx;
			
		}
	}
</style>
