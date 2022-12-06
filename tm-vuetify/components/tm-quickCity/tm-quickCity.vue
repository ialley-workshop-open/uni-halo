<template>
	<view class="tm-quickCity fulled">
		
		<view @click="qiehuan"><slot ></slot></view>
		<view @click.stop="qiehuan" v-if="showbgOpen" class="tm-quickCity-fullbg fulled  fixed b-0 l-0" :style="{height:sysHeight+'px'}">
			
			<view :style="{height:(height+250+content_jian_height)+'rpx'}"  @click.stop="" :class="[black_tmeme?'grey-darken-5 bk':'white']"  class=" tm-quickCity-wk absolute fulled round-t-10" >
				<view class="tm-quickCity-title px-32 pt-32 shadow-4 relative">
					<view class="text-size-g text-weight-b mb-32 relative">
						<view>
							请选择城市位置
						</view>
						<view @click.stop="qiehuan" class="tm-calendar-close  rounded flex-center"  :class="black_tmeme?'grey-darken-3':'grey-lighten-3'">
							<tm-icons dense name="icon-times" size="24" :color="black_tmeme?'white':'grey'"></tm-icons>
						</view>
					</view>
					<view class="flex-start pb-24">
						
						<view :class="[pageIndex==0?`outlined ${color_tmeme} text-weight-b`:'outlined grey',black_tmeme?'bk':'']" @click="indexChange(0)" class=" px-12 py-6 round-10 flex-center text-size-s  mr-24   flex-shrink">
							<text>{{childrenIndx[0]!==null?childrenIndx[0].title:'请选择省'}}</text>
							
						</view>
						<view v-if="childrenIndx[0]!==null" class="flex-center pr-24">
							<tm-icons :color="black_tmeme?'white':'grey'" :size="24" dense name="icon-angle-right"></tm-icons>
						</view>
						<view style="max-width: 120rpx;" :class="[pageIndex==1?`outlined ${color_tmeme} text-weight-b`:'outlined grey',black_tmeme?'bk':'']" @click="indexChange(1)" v-if="childrenIndx[0]!==null" class="px-12 py-6 round-10 flex-center text-size-s  mr-24 pb-10 ">
							
							<text class="text-overflow">{{childrenIndx[1]!==null?childrenIndx[1].title:'请选择市'}}</text>
						</view>
						<view v-if="childrenIndx[1]!==null" class="flex-center pr-24">
							<tm-icons :color="black_tmeme?'white':'grey'" :size="24" dense name="icon-angle-right"></tm-icons>
						</view>
						<view  style="max-width: 220rpx;" :class="[pageIndex==2?`outlined ${color_tmeme} text-weight-b`:'outlined grey',black_tmeme?'bk':'']" @click="indexChange(2)" v-if="childrenIndx[1]!==null" class="px-12 py-6 round-10 flex-center text-size-s  mr-24 pb-10 "> 
						
						<text class="text-overflow">{{childrenIndx[2]!==null?childrenIndx[2].title:'请选择县/区'}}</text>
						</view>
					</view>
				</view>
				<view v-if="hotCity_chuli.length>0" class="tm-quickCity-jg  py-24">
					<view :class="[black_tmeme?'grey-darken-5':'grey-lighten-4 text']" class="text-size-s text-weight-b py-12 px-32">热门城市</view>
					<view class="px-20 pt-12">
						<tm-tags model="text" rounded :black="black_tmeme" @click="selectedDefaultHot(index)" v-for="(item,index) in hotCity_chuli" :key="index"  color="white" :fllowTheme="fllowTheme">
						{{item[1]?item[1]:item[0]}}
						</tm-tags>
					</view>
					
				</view>
				<view v-show="pageIndex==0">
					<tm-quickIndex :black="black_tmeme" :fllowTheme="false"  :color="color_tmeme" key="ref_k_1" v-model="active" :height="content_height" :list="list">
						<template v-slot:cell="{data}">
							<view @click="cityClick_pr(data,0)" :class="[data.black?'bk':'',data.children!==data.total-1?'border-grey-lighten-4-b-1':'']" class="py-24 mx-32  flex-between">
								<view class="text-size-n flex-start" >
									<view v-if="data.item['checked']" class="mr-24">
										<tm-icons :color="data.color" dense name="icon-check"></tm-icons>
									</view>
									<text  :class="[data.item['checked']?'text-'+data.color+' text-weight-b':'']" class="text-size-n">
										{{data.title}}
									</text>
								</view>
							</view>
						</template>
					</tm-quickIndex>
				</view>
				<view v-if="pageIndex==1">
					<tm-quickIndex :black="black_tmeme" :fllowTheme="false" :color="color_tmeme" key="ref_k_2" v-model="active_2" v-if="childrenIndx[0]" :height="content_height" :list="childrenIndx[0].children">
						<template #cell="{data}">
							<view @click="cityClick_pr(data,1)" :class="[data.black?'bk':'',data.children!==data.total-1?'border-grey-lighten-4-b-1':'']" class="py-24 mx-32 border-grey-lighten-4-b-1 flex-between">
								<view class="text-size-n flex-start" >
									<view v-if="data.item['checked']" class="mr-24">
										<tm-icons :color="data.color" dense name="icon-check"></tm-icons>
									</view>
									<text  :class="[data.item['checked']?'text-'+data.color+' text-weight-b':'']" class="text-size-n">
										{{data.title}}
									</text>
								</view>
							</view>
							
						</template>
					</tm-quickIndex>
				</view>
				<view v-if="pageIndex==2">
					<tm-quickIndex :black="black_tmeme" :fllowTheme="false"  :color="color_tmeme" key="ref_k_3" v-model="active_3" v-if="childrenIndx[1]" :height="content_height" :list="childrenIndx[1].children">
						<template #cell="{data}">
							<view @click="cityClick_pr(data,2)" :class="[data.black?'bk':'',data.children!==data.total-1?'border-grey-lighten-4-b-1':'']" class="py-24 mx-32 border-grey-lighten-4-b-1 flex-between">
								<view class="text-size-n flex-start" >
									<view v-if="data.item['checked']" class="mr-24">
										<tm-icons :color="data.color" dense name="icon-check"></tm-icons>
									</view>
									<text  :class="[data.item['checked']?'text-'+data.color+' text-weight-b':'']" class="text-size-n">
										{{data.title}}
									</text>
								</view>
							</view>
							
						</template>
					</tm-quickIndex>
				</view>
			
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 城区索引选择
	 * @property {Boolean} value = [true|false] 显示和隐藏组件，请使用v-model或者value.sync你也可以不提供些参数，使用默认插槽也可打开，请见示例。
	 * @property {Array} default-value = [] 默认选择的地址:[],字符串数组，如["江西省","南昌市"]。使用.sync双向绑定。
	 * @property {Array} hot-city = [] 默认选择的地址:[],格式同default-value
	 * @property {String} color = [] 默认：primary,主题色
	 * @property {Number} height = [] 默认：1000,组件高度，单位rpx
	 * @property {Boolean} black = [true|false] 默认：false,是否深色模式
	 * @property {Function} change 选中地址时触发，返回当前选中的地区数组。
	 */
	import provinceData from '@/tm-vuetify/tool/util/province.js';
	import cityData from '@/tm-vuetify/tool/util/city.js';
	import areaData from '@/tm-vuetify/tool/util/area.js';
	import queryCnChart from "@/tm-vuetify/tool/function/findCnChart.js";

	
	import tmQuickIndex from "@/tm-vuetify/components/tm-quickIndex/tm-quickIndex.vue"
	import tmListitem from "@/tm-vuetify/components/tm-listitem/tm-listitem.vue"
	import tmGrouplist from "@/tm-vuetify/components/tm-grouplist/tm-grouplist.vue"
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	import tmTags from "@/tm-vuetify/components/tm-tags/tm-tags.vue"
	export default {
		components:{tmQuickIndex,tmListitem,tmGrouplist,tmIcons,tmTags
		},
		name:"tm-quickCity",
		model:{
			event:'input',
			prop:'value'
		},
		props:{
			defaultValue:{
				type:Array,
				default:()=>{
					return [];
				}
			},
			hotCity:{
				type:Array,
				default:()=>[["江西省","南昌市"],["北京市"],["广东省","广州市"],["浙江省","杭州市"],["重庆市"],["湖南省","长沙市"],["湖北省","武汉市"],["四川省","成都市"]]
			},
			color:{
				type:String,
				default:"primary"
			},
			height:{
				type:String|Number,
				default:900
			},
			value:{
				type:Boolean,
				default:false
			},
			black:{
				type:Boolean,
				default:null
			},
			// 跟随主题色的改变而改变。
			fllowTheme:{
				type:Boolean|String,
				default:true
			}
		},
		data() {
			return {
				
				list:[],
				active:0,
				active_2:0,
				active_3:0,
				childrenIndx:[null,null,null],
				indexobj:{
					pr:null,
					ar:null,
					co:null
				},
				pageIndex:0,
				sysHeight:0,
				showbgOpen:false,
				
				content_height:0,
				content_jian_height:0,
				hotCity_chuli:[]
			};
		},
		watch:{
			value:function(val){
				this.show = val;
				
			}
		},
		destroyed() {
			this.list=[];
			this.childrenIndx=[];
		},
		computed:{
			
			
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			},
			color_tmeme:function(){
				if(this.$tm.vx.state().tmVuetify.color!==null&&this.$tm.vx.state().tmVuetify.color && this.fllowTheme){
					return this.$tm.vx.state().tmVuetify.color;
				}
				return this.color;
			},
			show:{
				get:function(){
					return this.showbgOpen;
				},
				set:function(val){
					this.showbgOpen = val;
					this.$emit('input',val);
					this.$emit('update:value',val);
					
				}
			}
		},
		async mounted() {
			this.sysHeight = uni.getSystemInfoSync().windowHeight;
			this.show = this.value;
			this.content_height = this.height;
			this.hotCity_chuli_fun();
			await this.chiliFormatCity_area()
			await this.setDefaultValue();
			await this.content_heightToh();
		},
		methods: {
			hotCity_chuli_fun(){
				let hot = uni.$tm.deepClone(this.hotCity);
				let hostar = [];
				hot.forEach(item=>{
					if(item.length==1) hostar.push([item[0],null,null])
					if(item.length==2) hostar.push([item[0],item[1],null])
					if(item.length==3) hostar.push([item[0],item[1],item[2]])
				})
				this.hotCity_chuli = [...hostar];
			},
			async qiehuan(){
				this.show = !this.showbgOpen
				await this.content_heightToh();
				
			},
			async content_heightToh(){
				// if(!this.showbgOpen) return;
				if(this.hotCity_chuli.length==0){
					return this.height;
				}
				this.$nextTick(async function(){
					let h = await this.$Querey(".tm-quickCity-jg",this).catch(e=>{});
					
					if(!h[0]) return;
					h = h[0].height;
					
					let blv = uni.upx2px(4) / 4;
					this.content_jian_height = (h+h*blv)
					this.content_height = parseInt(this.height - this.content_jian_height);
				})
			},
			async selectedDefaultHot(index){
				
				this.$emit('update:defaultValue',this.hotCity[index]);
				let chl = this.childrenIndx[0];
				if(chl){
					this.$set(this.list[chl.index].children[chl.childrenIndex],'checked',false)
				}
				this.childrenIndx=[null,null,null];
				this.$nextTick(async function(){
					
					await this.setDefaultValue()
					
					this.cityClick_pr(this.list[this.childrenIndx[0]],this.childrenIndx[0])
				})
			},
			async setDefaultValue(){
				let t = this;
				function chuili(ix){
					let pitem = null;
					let chilIndex=-1;
					let pdindex = -1;
					if(ix==0&&t.defaultValue[ix]){
						 pdindex = t.list.findIndex((item)=>{
							let citem = item.children
							
							let index = citem.findIndex(ditem=>{
								if(ditem.title == t.defaultValue[ix]){
									pitem = ditem;
								}
								return ditem.title == t.defaultValue[ix]
							})
							if(index>-1){
								chilIndex = index;
							}
							return index>-1;
						})
					}else if(t.defaultValue[ix]){
						let dsst = t.childrenIndx[ix-1].children
						
						 pdindex = dsst.findIndex((item)=>{
							let citem = item.children
							
							let index = citem.findIndex(ditem=>{
								if(ditem.title == t.defaultValue[ix]){
									pitem = ditem;
								}
								return ditem.title == t.defaultValue[ix]
							})
							if(index>-1){
								chilIndex = index;
							}
							return index>-1;
						})
					}
					return {prevent:pdindex,chileIndex:chilIndex,item:pitem};
				}
				let d = chuili(0)
				if(d.prevent>-1){
					let chl = this.childrenIndx[0];
					if(chl){
						this.$set(this.list[chl.index].children[chl.childrenIndex],'checked',false)
					}
					t.childrenIndx.splice(0,1,{
						index:d.prevent,
						childrenIndex:d.chileIndex,
						title:d.item.title,
						children:t.chuliKey(d.item.children)
					})
					
					t.active = d.prevent;
					this.$set(this.list[d.prevent].children[d.chileIndex],'checked',true)
				}
				if(t.defaultValue[1]){
					let d = chuili(1)
					let chl = this.childrenIndx[1];
					if(chl){
						this.$set(this.childrenIndx[0].children[chl.index].children[chl.childrenIndex],'checked',false)
					}
					t.childrenIndx.splice(1,1,{
						index:d.prevent,
						childrenIndex:d.chileIndex,
						title:d.item.title,
						children:t.chuliKey(d.item.children)
					})
					this.$set(this.childrenIndx[0].children[d.prevent].children[d.chileIndex],'checked',true)
				}else{
					
				}
				await uni.$tm.sleep(50)
				if(t.defaultValue[2]){
					let d = chuili(2)
					
					let chl = this.childrenIndx[2];
					
					if(chl){
						this.$set(this.childrenIndx[1].children[chl.index].children[chl.childrenIndex],'checked',false)
					}
					t.childrenIndx.splice(2,1,{
						index:d.prevent,
						childrenIndex:d.chileIndex,
						title:d.item.title,
						children:[]
					})
					
					this.$set(this.childrenIndx[1].children[d.prevent].children[d.chileIndex],'checked',true)
					
				}
			},
			indexChange(index){
				let t= this;
				this.pageIndex = index;
				this.childrenIndx.forEach((item,idx)=>{
					if(idx===index && item!==null){
						if(t.defaultValue[idx]==item.title){
							if(idx==0){
								t.active = item.index;
							}else if(idx==1){
								t.active_2 = item.index;
							}else if(idx==2){
								t.active_3 = item.index;
							}
							
						}
					}
				})
				
			},
			cityClick_pr(data_item,tindex){
				if(tindex===0){
					let chl = this.childrenIndx[0];
					if(chl){
						this.$set(this.list[chl.index].children[chl.childrenIndex],'checked',false)
					}
					this.childrenIndx=[{
						index:data_item.prevent,
						childrenIndex:data_item.children,
						title:data_item.title,
						children:this.chuliKey(data_item.item.children)
					},null,null]
					this.$set(this.indexobj,'pr',data_item.prevent)
					this.$set(this.indexobj,'ar',null)
					this.$set(this.indexobj,'co',null)
					this.pageIndex=1;
					
					this.$set(this.list[data_item.prevent].children[data_item.children],'checked',true)
				}else if(tindex===1){
					let chl = this.childrenIndx[1]
					
					if(chl){
						this.$set(this.childrenIndx[0].children[chl.index].children[chl.childrenIndex],'checked',false)
					}
					this.childrenIndx.splice(1,1,{
						index:data_item.prevent,
						childrenIndex:data_item.children,
						title:data_item.title,
						children:this.chuliKey(data_item.item.children)
					})
					this.childrenIndx.splice(2,1,null)
					this.$set(this.indexobj,'pr',data_item.prevent)
					this.$set(this.indexobj,'ar',data_item.prevent)
					this.$set(this.indexobj,'co',null)
					this.pageIndex=2;
					this.$set(this.childrenIndx[0].children[data_item.prevent].children[data_item.children],'checked',true)
				}else if(tindex===2){
					let chl = this.childrenIndx[2]
					
					if(chl){
						this.$set(this.childrenIndx[1].children[chl.index].children[chl.childrenIndex],'checked',false)
					}
					this.childrenIndx.splice(2,1,{
						index:data_item.prevent,
						childrenIndex:data_item.children,
						title:data_item.title,
						children:[]
					})
					this.$set(this.indexobj,'pr',data_item.prevent)
					this.$set(this.indexobj,'ar',data_item.prevent)
					this.$set(this.indexobj,'co',data_item.prevent)
					this.$set(this.childrenIndx[1].children[data_item.prevent].children[data_item.children],'checked',true)
				}
				let cdite = this.defaultValue;
				this.childrenIndx.forEach((item,index)=>{
					if(item){
						cdite.splice(index,1,item.title)
					}else{
						cdite.splice(index,1,null)
					}
				})
				this.$emit("update:defaultValue",cdite)
				this.$emit("change",cdite)
			},
			//处理地区数据以便符合规范。
			async chiliFormatCity_area() {
				
				let list = [];
				let list_index_Str = []
				provinceData.forEach((item,index)=>{
					let quick = queryCnChart(item.label[0])["0"];
					
					if(item.label=='重庆市'){
						quick = 'C'
						
					}
					list.push({
						id:item.value,
						text:item.label,
						quick:quick,
						children:[]
					})
					
				})
				cityData.forEach((item,index)=>{
					item.forEach((citem,cindex)=>{
						list[index].children.push({
							id:citem.value,
							text:citem.label,
							quick:queryCnChart(citem.label[0])["0"],
							children:[]
						})
					})
				})
				list.forEach((item,index)=>{
					item.children.forEach((citem,cindex)=>{
						areaData[index][cindex].forEach(jitem=>{
							list[index].children[cindex].children.push({
								id:jitem.value,
								quick:queryCnChart(jitem.label[0])["0"],
								text:jitem.label
							})
						})
					})
				})
				
				
				function  sortFun(a,b){
					  var nameA = a.quick.toUpperCase(); // ignore upper and lowercase
					  var nameB = b.quick.toUpperCase(); // ignore upper and lowercase
					 
					  if (nameA < nameB) {
							return -1;
					  }
					  if (nameA > nameB) {
							return 1;
					  }
					  // names must be equal
					  return 0;
				}
				
				function sort(itemArray){
					if(typeof itemArray === 'object' && Array.isArray(itemArray)){
						itemArray.sort(sortFun)
					}else{
						return itemArray;
					}
					
					for(let i=0;i<itemArray.length;i++){
						let cl = itemArray[i]['children'];
						if(typeof cl === 'object' && Array.isArray(cl)){
							
							itemArray[i]['children'] = sort(cl);
						}
						
					}
					return itemArray;
				}
				
				let plst = sort(list);
				
				function fenzu(ar){
					let jg = {};
					for(let i=0;i<ar.length;i++){
						let cl = ar[i]['children'];
						if(typeof cl === 'object' && Array.isArray(cl)){
							if(typeof jg[ar[i].quick] !=='undefined'){
								jg[ar[i].quick].push({
									title:ar[i].text,
									index:ar[i].quick,
									children:fenzu(cl)
								})
							}else{
								jg[ar[i].quick] = [];
								
								jg[ar[i].quick].push({
									title:ar[i].text,
									index:ar[i].quick,
									children:fenzu(cl)
								})
							}
						}else{
							if(typeof jg[ar[i].quick] !=='undefined'){
								jg[ar[i].quick].push({
									title:ar[i].text,
									index:ar[i].quick,
									children:ar[i]
								})
							}else{
								jg[ar[i].quick] = [];
								
								jg[ar[i].quick].push({
									title:ar[i].text,
									index:ar[i].quick,
									children:ar[i]
								})
							}
						}
						
					}
					return jg;
				}
				let ruslt = fenzu(plst);
				let tddd = this.chuliKey(ruslt);
				this.list = tddd;
				
				return tddd;
				
			},
			
			chuliKey(arritem){
				let ruslt = arritem;
				let zuihojg = [];
				let keyarray = Object.keys(arritem);
				for(let i=0;i<keyarray.length;i++){
					zuihojg.push({
						title:keyarray[i],
						index:keyarray[i],
						children:ruslt[keyarray[i]]
					})
					
				}
				return zuihojg;
			}
		},                             
	}
</script>

<style lang="scss" scoped>
.tm-quickCity{
	.tm-quickCity-fullbg{
		background-color: rgba(0,0,0,0.3);
	
		z-index: 501;
		.tm-quickCity-wk{
			bottom: 0;
			left: 0;
			.tm-quickCity-title{
				z-index: 10;
				.tm-calendar-close {
					position: absolute;
					top: 0rpx;
					right: 0rpx;
					height: 50rpx;
					line-height: 50rpx;
					width: 50rpx;
				}
			}
		}
	}
	
}
</style>
