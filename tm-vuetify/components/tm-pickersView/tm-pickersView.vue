<template>
	<view class="tm-pickersView flex-start px-24" :class="[black_tmeme?'grey-darken-5':bgColor]">
		<!-- @change="bindChange" -->
		
		<picker-view  @change="change" @pickstart='$emit("aniStart")' @pickend='$emit("aniEnd")'  v-if="listData.length>0" :value="value_default"  
		:mask-style='black_tmeme?"opacity:0;":""'
		indicator-style='height:50px;' 
		indicator-class="tm-pickersBView-item-h" 
		class="tm-pickersBView-wk">
			<picker-view-column v-for="(item,index) in listData" :key="index">
				<view class="tm-pickersBView-item fulled-height flex-center " style="margin: 0 5px;" :class="[value_default[index]==index_pub?'text-size-n text-weight-b active':'',black_tmeme?'bk':'']"  v-for="(item_data,index_pub) in listData[index]" :key="index_pub">
					<text v-if="dataType == 'string'" >{{item_data}}</text>
					<text v-if="dataType == 'object'">{{item_data[rangKey]}}</text>
				</view>
			</picker-view-column>
			
		</picker-view>


	</view>
</template>

<script>
	/**
	 * 普通级联拉选择器(嵌入式)
	 * @description 多级关联，单级关联选择
	 * @property {Array} default-value = [] 默认：[],默认赋值项。可选三种赋值方式，名称赋值，对象赋值，数字序列赋值
	 * @property {String|Number} item-height = [34|42|50|58|62] 项目的高度单位px
	 * @property {Array} list = [] 选择器的数据，可选格式：Array<string>,Array<object>.如果为object格式需要提供rangKey.如果为多级需要提供children.key值
	 * @property {String} rang-key = [text|title] 默认：text,如果List格式为对象数组，需要提供此值
	 * @property {String} children-key = [children] 默认：children,如果List格式为对象数组且为多级联选择，需要提供此值，理论上无限级联数据
	 * @property {String|Boolean} black = [true|false] 是否开启暗黑模式。 
	 * @property {String|Boolean} disabled = [true|false] 是否禁用
	 * @property {String} bg-color = [white|blue] 默认：white,白色背景；请填写背景的主题色名称。 
	 * @property {Function} change 列数被选中改变时触发。
	 * 
	 */

	export default {
		name: "tm-pickersView",
		props: {
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
			rangKeyId: {
				type: String,
				default: "id"
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
			}
		
		},
		data() {
			return {
				value_default:[],
				pre_value:[],
				scrollEvent: 0,
				childrenIndex: 0,
				listIndex: [],
				listData: [],
			
				idx:9123
			};
		},
		mounted() {
			this.$nextTick(function(){
				this.chulisdata()
				this.setDefaultValue();
				
			})
		},
		watch:{
			defaultValue:{
				deep:true,
				handler: function(newV,oldV){
					this.chulisdata()
					this.$nextTick(function(){
						this.inits();
					})
				}
			},
			list:{
				deep:true,
				handler:async function(newV,oldV){
					this.chulisdata()
					this.$nextTick(async function(){
						await this.inits();
					})
				}
			},
		},
		computed: {
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			},
			dataType: function() {
				// 数据有误
				if (typeof this.list !== 'object' && !Array.isArray(this.list) && !this.list.length) return null;
				if (typeof this.list[0] === 'string') return 'string';
				if (typeof this.list[0] === 'object') return 'object';
			},
			
			gridNum: function() {
				let t = this;
				if (
				(typeof this.list !== 'object' && !Array.isArray(this.list) && this.list.length==0)||
				typeof this.list[0] === 'undefined'
				) {
					this.listIndex = [{
						itemIndex: 0,
						childrenIndex: 0,
						wz: 0
					}]
					return 0
				};
				if (typeof this.list[0] === 'string') {
					this.listIndex = [{
						itemIndex: 0,
						childrenIndex: 0,
						wz: 0
					}]
					return 1
				}
				if (typeof this.list[0] === 'object') {
					let index = 0;
					let cindex = 1;
					let pds = []
					function tests(obj) {
						if(!obj||obj?.length==0){
							return;
						}
						cindex = cindex+1;
						index +=1;
						pds.push({
							itemIndex: 0,
							childrenIndex: index,
							wz: 0
						})
						if (obj && typeof obj === 'object' && Array.isArray(obj)) {
							if (obj[0][t.childrenKey]) {
								tests(obj[0][t.childrenKey]);
							}
						}
					}
					pds.push({
						itemIndex: 0,
						childrenIndex: index,
						wz: 0
					})
					tests(this.list[0][this.childrenKey])
					t.listIndex = pds;
					return cindex;
				}
			},

		},
		methods: {
			SeletecdeIndexdefault(){
				let d = []
				
				for(let i=0;i<this.gridNum;i++){
					d.push(this.listIndex[i].itemIndex)
				}
				this.value_default = d;
			},
			// 获取当前选中的数据。
			getSelectedValue(){
				let t = this;
				// 总的级联数。
				let dNum = this.gridNum;
				let pd = this.listIndex;
				
				if(this.dataType === 'string'){
					return [{
						index:this.listIndex[0].itemIndex,
						data:this.listData[0][this.listIndex[0].itemIndex]
					}]
				}else if(this.dataType === 'object'){
					
					if(dNum===1){
						
						let ps = {...this.listData[0][this.listIndex[0].itemIndex]};
						delete ps.children;
						return [{
							index:this.listIndex[0].itemIndex,
							data:ps
						}]
						
					}else if(dNum>1){
						let p = [];
						this.listIndex.forEach((item,index)=>{
							if(t.listData[index]){
								let ps = {...t.listData[index][item.itemIndex]};
								delete ps.children;
								p.push({
									index:item.itemIndex,
									data:ps
								})
							}
							
						})
						
						return p;
					}
				}
				return [];
			},
			chulisdata() {
				// 总的级联数。
				let dNum = this.gridNum;
				
				let t = this;
				if (dNum === 0) {
					this.listData = [];
					this.$forceUpdate()
					return this.listData;
				}
				if (dNum === 1) {
					this.listData = [this.list];
					// this.listData.push([...this.list]);
					this.$forceUpdate()
					
					return this.listData;
				}
				
				if (dNum > 1) {
					
					let index = 1;
					let list = [];
					let p = [];
					function tests(obj) {
						if(index > dNum) return;
						list.push([...obj])
						if(obj[t.listIndex[index]?.itemIndex]){
							let cl = obj[t.listIndex[index].itemIndex][t.childrenKey];
							if (cl && typeof cl === 'object' && Array.isArray(cl)) {
								index++;
							
								tests(cl);
							}
						}

					}
					p.push([...this.list])
					
					if(this.list[t.listIndex[0].itemIndex][this.childrenKey]){
						tests(this.list[t.listIndex[0].itemIndex][this.childrenKey])
					}
					p.push(...list);
					this.$forceUpdate()
					this.listData = p;
				}
				
				return this.listData;
			},
			setDefaultValue(objSelected){
				let t = this;
				uni.$tm.sleep(50).then(()=>t.inits(objSelected))
				.then(()=>uni.$tm.sleep(50))
				.then(()=>t.SeletecdeIndexdefault())
				
			},
			async inits(objSelected){
				// 总的级联数。
				let dNum = this.gridNum;
				let t = this;
				var sjd = null;
				if(typeof objSelected ==='object' && Array.isArray(objSelected)){
					sjd = objSelected;
				}else{
					if(!this.defaultValue||this.defaultValue.length==0) return;
					sjd = this.defaultValue;
				}
				let typeindex = typeof sjd[0];
				
				if(dNum===0) return;
				
				if(typeindex === 'number'){
					if (dNum === 1) {
						let itemIndex = sjd[0];
						if(typeof itemIndex === 'number' && !isNaN(itemIndex) ){
							this.$set(this.listIndex[0], 'itemIndex', itemIndex);
							
						}
						
						return 
					}else if(dNum > 1){
						
						let index = 1;
						async function tests() {
							if(index > dNum) return;
							
							let itemIndex = t.defaultValue[index];
							
							if(typeof itemIndex === 'number' && !isNaN(itemIndex) &&typeof t.listIndex[index] === 'object' && typeof t.listIndex[index] !=='undefined'){
								await uni.$tm.sleep(30)
								t.$set(t.listIndex[index], 'itemIndex', itemIndex);
								
								t.chulisdata();
								index++;
								await tests();
							}	
						}
						
						let itemIndex = sjd[0];
						
						this.$set(this.listIndex[0], 'itemIndex', itemIndex);
						
						
						this.chulisdata();
						
						await tests()
						
					}
					
				}else if(typeindex === 'string'){
					
					if(this.dataType==='string'){
						if (dNum === 1) {
							let valueStr = sjd[0];
							if(typeof valueStr !=='string' || typeof valueStr ==='undefined' || valueStr ==null){
								return;
							}
							let itemIndex = this.listData[0].indexOf(valueStr)
							if(itemIndex>-1){
								this.$set(this.listIndex[0], 'itemIndex', itemIndex);
								
							}
							
							return 
						}
					}else if(this.dataType === 'object'){
						if (dNum === 1) {
							let valueStr = sjd[0];
							if(typeof valueStr !=='string' || typeof valueStr ==='undefined' || valueStr ==null){
								return;
							}
							let itemIndex = this.listData[0].findIndex(item=>{
								return item[t.rangKey] ==  valueStr;
							})
							if(itemIndex>-1){
								this.$set(this.listIndex[0], 'itemIndex', itemIndex);
								
							}
							return 
						}else if(dNum>1){
							let index = 0;
							async function tests() {
								if(index > dNum) return;
								
								if(typeof t.listIndex[index] === 'object' && typeof t.listIndex[index] !=='undefined'){
									let valueStr = t.defaultValue[index];
									if(typeof valueStr !=='string' || typeof valueStr ==='undefined' || valueStr ==null){
										return;
									}
									let itemIndex = t.listData[index].findIndex(item=>{
										return item[t.rangKey] ==  valueStr;
									})
									if(itemIndex>-1){
										await uni.$tm.sleep(30)
										t.$set(t.listIndex[index], 'itemIndex', itemIndex);
										
										t.chulisdata();
										
									}
									
									index++;
									await tests();
									
								}	
							}
							
							await tests()

						}
						
						
						
						
					}
				}else if(typeindex === 'object'){
					
					if (dNum === 1) {
						let valueStr = sjd[0];
						if(typeof  valueStr[t.rangKey] ==='undefined' || typeof valueStr !=='object' || typeof valueStr ==='undefined' || valueStr ==null){
							return;
						}
						
						let itemIndex = this.listData[0].findIndex(item=>{
							return (item[t.rangKey] ==  valueStr[t.rangKey])||(parseInt(item[t.rangKeyId]) ==  parseInt(valueStr[t.rangKeyId]));;
						})
						if(itemIndex>-1){
							this.$set(this.listIndex[0], 'itemIndex', itemIndex);
							
						}
						
						return 
					}else if(dNum>1){
						let index = 0;
						async function tests() {
							if(index > dNum) return;
							
							if(typeof t.listIndex[index] === 'object' && typeof t.listIndex[index] !=='undefined'){
								let valueStr = t.defaultValue[index];
								if(typeof  valueStr[t.rangKey] ==='undefined' || typeof valueStr !=='object' || typeof valueStr ==='undefined' || valueStr ==null){
									return;
								}
								let itemIndex = t.listData[index].findIndex(item=>{
									return (item[t.rangKey] ==  valueStr[t.rangKey])||(parseInt(item[t.rangKeyId]) ==  parseInt(valueStr[t.rangKeyId]));
								})
								if(itemIndex>-1){
									await uni.$tm.sleep(30)
									t.$set(t.listIndex[index], 'itemIndex', itemIndex);
									t.$set(t.listIndex[index], 'wz', itemIndex * t.itemHeight);
									t.chulisdata();
								}
								
								index++;
								await tests();
								
							}	
						}
						await tests()
					
					}
				}
			},
			change(e) {
				let pl = [...e.detail.value];
				
				this.pre_value =[...this.value_default];
				
				if(this.disabled){
					this.value_default = this.pre_value;
					
					return;
				}
				let childrenIndex = 0;
				for(let i=0;i<pl.length;i++){
					if(this.listIndex[i].itemIndex !== pl[i]){
						childrenIndex = this.listIndex[i].childrenIndex;
						break;
					}
				}
				
				this.childrenIndex = childrenIndex;
				
				for(let i=childrenIndex;i<pl.length;i++){
					if(this.listIndex[i]?.itemIndex !== pl[i]){
						this.$set(this.listIndex[i],'itemIndex',pl[i])
					}else{
						this.$set(this.listIndex[i],'itemIndex',0)
						pl[i] = 0;
					}
				}
				
				this.chulisdata()
				this.$nextTick(function(){
					this.value_default = pl;
					this.$emit("change",pl)
				})
				
			},

		},
	}
</script>

<style >
	.tm-pickersView .tm-pickersBView-item-h{
		height: 50px;
		background-color: rgba(0,0,0,0.03);
		width: calc(100% - 10px);
		margin-left: 5px;
		border-radius: 20rpx;
		border: none;
	}
	.tm-pickersView .tm-pickersBView-item-h::after,.tm-pickersView .tm-pickersBView-item-h::before{
		border: none;
	}
	.tm-pickersView .tm-pickersBView-wk{
		position: relative;
		width: 750rpx;
		height: 500rpx;
		
	}
	.tm-pickersView .tm-pickersBView-wk .tm-pickersBView-item.bk{
		opacity: 0.4;
	}
	.tm-pickersView .tm-pickersBView-wk .tm-pickersBView-item.active{
		opacity: 1;
		border-radius: 20rpx;
		border: none;
		background-color: rgba(0,0,0,0.06);
	}
	.tm-pickersView .tm-pickersBView-wk .tm-pickersBView-item.active.bk{
		background-color: rgba(255,255,255,0.06);
	}
</style>
