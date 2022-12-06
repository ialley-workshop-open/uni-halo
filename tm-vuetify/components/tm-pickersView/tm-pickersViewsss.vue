<template>
	<view class="tm-pickersView flex-start px-24" :class="[black_tmeme?'grey-darken-5':bgColor]">

		<view  v-for="(item_data,index_pub) in listData" :key="index_pub" class="tm-pickersView-wk " :style="{
				height:itemHeight*5+'px',
				width:(100/gridNum-1)  + '%',
				marginLeft:index_pub==0?0:1.5 + '%',
			}">
			
			<scroll-view  :show-scrollbar='false' 
			v-if="dataType!==null&&item_data" 
			:scroll-top="listIndex[index_pub].wz" scroll-y 
			@touchend="scrllEnd"
			@scroll="scroll($event,index_pub)" 
			scroll-with-animation 
			class="tm-pickersView-showbg"  :style="{
				height:itemHeight*5+'px'
			}">

				<!-- #ifdef H5 -->
				<view :id='"_bar_"+(index4)+"_bar_"' v-for="(item4,index4) in 2" :key="index4+'_a'" class="tm-pickersView-item "
					:style="{height:itemHeight+'px'}">
					<text class="opacity-1"></text>
				</view>
				<!-- #endif -->
				<!-- #ifndef H5 -->
				<view :id='"_bar_"+(index4)+"_bar_"' v-for="(item4,index4) in 2" :key="index4" class="tm-pickersView-item "
					:style="{height:itemHeight+'px'}">
					<text class="opacity-1"></text>
				</view>
				<!-- #endif -->

				<view :id='"_bar_"+(index+2)+"_bar_"' v-for="(item,index) in item_data" :key="index"
					class="tm-pickersView-item flex-center " :style="{
					height:itemHeight+'px'
				}">
					<view class="text-size-n tm-pickersView-item-text " :class="[
						listIndex[index_pub].itemIndex==index? (black_tmeme?'text-white':'text-black'):(black_tmeme?'':'opacity-4'),
						listIndex[index_pub].itemIndex+1==index||listIndex[index_pub].itemIndex-1==index?'textLevel_1':'',
						listIndex[index_pub].itemIndex+2==index||listIndex[index_pub].itemIndex-2==index?'textLevel_2':'',
						
						]">
						<text v-if="dataType === 'string'">{{item}}</text>
						<text v-if="dataType === 'object'">{{item[rangKey]}}</text>
					</view>
				</view>

				<!-- #ifdef H5 -->
				<view v-for="(item4,index4) in 2" :key="index4+'_b'" class="tm-pickersView-item"
					:style="{height:itemHeight+'px'}">
					<text></text>
				</view>
				<!-- #endif -->
				<!-- #ifndef H5 -->
				<view v-for="(item4,index4) in 2" :key="index4" class="tm-pickersView-item"
					:style="{height:itemHeight+'px'}">
					<text></text>
				</view>
				<!-- #endif -->
				

			</scroll-view>
			<view class="tm-pickersView-fg overflow  round-5 shadow-10 flex-center" :class="[
				black_tmeme?'white opacity-1':'grey-darken-1 opacity-1'
			]" :style="{
				height:itemHeight+'px',
				top:itemHeight*2+'px'
			}">

			</view>
		</view>



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

				scrollEvent: 0,
				childrenIndex: 0,
				listIndex: [],
				listData: [],
				isTounch:false,
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
					
					this.setDefaultValue();
				}
			},
			list:{
				deep:true,
				handler:function(newV,oldV){
					this.chulisdata()
					this.setDefaultValue();
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
				if (typeof this.list !== 'object' && !Array.isArray(this.list) && !this.list.length) {
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
					let index = 1;

					function tests(obj) {
						t.listIndex.push({
							itemIndex: 0,
							childrenIndex: index,
							wz: 0
						})
						if (obj && typeof obj === 'object' && Array.isArray(obj)) {
							index++
							if (obj[0][t.childrenKey]) {
								tests(obj[0][t.childrenKey]);
							}

						}
					}
					this.listIndex = [{
						itemIndex: 0,
						childrenIndex: 0,
						wz: 0
					}]
					tests(this.list[0][this.childrenKey])
					return index;
				}
			},

		},
		methods: {
			// 获取当前选中的数据。
			getSelectedValue(){
				let t = this;
				// 总的级联数。
				let dNum = this.gridNum;
				let pd = this.listIndex;
				if(this.dataType === 'string'){
					// let ps = {...this.listData[0][this.listIndex[0].itemIndex]};
					
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
					return this.listData;
				}
				if (dNum === 1) {
					this.listData = [];
					this.listData.push([...this.list]);
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
					this.listData = p;
				}
				return this.listData;
			},
			async setDefaultValue(objSelected){
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
							this.$set(t.listIndex[0], 'wz', itemIndex * t.itemHeight);
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
								t.$set(t.listIndex[index], 'wz', itemIndex * t.itemHeight);
								t.chulisdata();
								index++;
								await tests();
							}	
						}
						
						let itemIndex = sjd[0];
						
						this.$set(this.listIndex[0], 'itemIndex', itemIndex);
						this.$set(t.listIndex[0], 'wz', itemIndex * t.itemHeight);
						
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
								this.$set(t.listIndex[0], 'wz', itemIndex * t.itemHeight);
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
								this.$set(t.listIndex[0], 'wz', itemIndex * t.itemHeight);
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
							this.$set(t.listIndex[0], 'wz', itemIndex * t.itemHeight);
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
			scroll(e, index) {
				this.scrollEvent = e;
				this.childrenIndex = index;
				
				
			},

			scrllEnd(e) {
				this.isTounch = false;
				if (!this.scrollEvent) return;
				let dNum = this.gridNum;
				let d;
				let t = this;
				let idb = 88;
				let srcllTop = this.scrollEvent.detail.scrollTop;
				
				if(srcllTop<=0){
					srcllTop = 0;
				}else if(srcllTop >= this.scrollEvent.detail.srcollHeigh){
					srcllTop = this.scrollEvent.detail.srcollHeigh;
				}
				
				
				d = Math.ceil((srcllTop - (this.itemHeight / 2)) / this.itemHeight);
				
				
				
				if(d>= t.listData[t.childrenIndex].length-1){
					d = t.listData[t.childrenIndex].length-1
				}
				
				this.$set(this.listIndex[this.childrenIndex], 'wz', srcllTop)
				let isNo = false;//是否相同（和上一次对比。）
				if(this.listIndex[this.childrenIndex].itemIndex == d){
					isNo = true;
				}
				if(!this.disabled){
					this.$set(this.listIndex[this.childrenIndex], 'itemIndex', d)
				}
				
				clearTimeout(idb)
				idb = setTimeout(function() {
					if(t.disabled){
						t.$tm.toast("已禁用")
						t.$set(t.listIndex[t.childrenIndex], 'wz', t.listIndex[t.childrenIndex].itemIndex * t.itemHeight)
						return;
					}else{
						t.$set(t.listIndex[t.childrenIndex], 'wz', d * t.itemHeight)
					}
					if(isNo) return;
					for(let i=0;i<t.listIndex.length;i++){
						if(i>t.childrenIndex && i < dNum){
							t.$set(t.listIndex[i],'itemIndex',0)
							t.$set(t.listIndex[i],'wz',0)
						}
					}

					t.chulisdata();
				}, 10);

			}
		},
	}
</script>

<style lang="scss" scoped>
	.tm-pickersView {
		.tm-pickersView-wk {
			position: relative;
			
			.tm-pickersView-showbg {
				position: absolute;
				left: 0;
				height: 0;
				z-index: 5;

				.tm-pickersView-item {
					.tm-pickersView-item-text {
						text {
							transition: all 0.5s;

						}

						&.textLevel_1 {
							text {
								font-size: 28upx !important;
							}
						}

						&.textLevel_2 {
							text {
								font-size: 26upx !important;
							}
						}

					}
				}
			}

			.tm-pickersView-fg {
				position: relative;
				z-index: 3;

			}
		}
	}
</style>
