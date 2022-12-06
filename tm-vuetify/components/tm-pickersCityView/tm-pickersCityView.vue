<template>
	<view class="tm-pickersCityView">
		<tm-pickersView :bg-color="bgColor" :black="black_tmeme" :disabled="disabled" ref="cityApp" :default-value="defaultValue" :list="list" ></tm-pickersView>
	</view>
</template>

<script>
	import provinceData from '@/tm-vuetify/tool/util/province.js';
	import cityData from '@/tm-vuetify/tool/util/city.js';
	import areaData from '@/tm-vuetify/tool/util/area.js';
	/**
	 * 地区选择器（内嵌式）
	 * @description 地区选择器（内嵌式）,使用$refs 方式调用getSelectedValue取得选中的数据。
	 * @property {String} level = [province|city|area] ,默认area,显示的级别province:仅显示省，city仅显示省市，area：显示省市区。
	 * @property {Array} default-value = [] 同tm-pckerView格式，可以是数组内：序列，对象，字符串赋值。
	 * @property {String|Boolean} black = [true|false] 是否开启暗黑模式。 
	 * @property {String|Boolean} disabled = [true|false] 是否禁用
	 * @property {String} bg-color = [white|blue] 默认：white,白色背景；请填写背景的主题色名称。 
	 * @example <tm-pickersCityView ref="city" :defaultValue='["上海市", "市辖区", "徐汇区"]'></tm-pickersCityView>
	 * 
	 */
	import tmPickersView from "@/tm-vuetify/components/tm-pickersView/tm-pickersView.vue"
	export default {
		components:{tmPickersView},
		name:'tm-pickersCityView',
		props:{
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
			// 背景颜色，主题色名称。
			bgColor:{
				type:String,
				default:'white'
			},
		},
		data() {
			return {
				list:[],
			};
		},
		computed: {
		
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			}
		},
		mounted() {
			this.$nextTick(function(){
				this.chili_level();
			})
		},
		methods: {
			// 获取选中的资料。
			getSelectedValue(){
				let d = this.$refs.cityApp.getSelectedValue();
				
				let p = [];
				if(this.level=='province'){
					p = [d[0].data.text]
				}else if(this.level=='city'){
					p = [d[0].data.text,d[1].data.text]
				}else{
					p = [d[0].data.text,d[1].data.text,d[2].data.text]
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
			}
			
		},
	}
</script>

<style lang="scss">

</style>
