<template>
	<view  class="tm-swiperList">
		
		<swiper @change="swiperChange" :style="{width:width+'rpx',height:height+'rpx'}">
			<swiper-item v-for="(item,index2) in list_data" :key="index2" :style="{width:width+'rpx',height:height+'rpx'}">
				<view 
				v-if="(selectedWipeIndex==index2+1)||(selectedWipeIndex==index2-1)||selectedWipeIndex==index2" @scroll="scroll($event,index2)"  :style="{width:width+'rpx',height:height+'rpx',overflowY:'auto'}">
					<view :style="{height:itemHeight_px*item.length+'px'
					}" :key="index2" class="relative">
						
						<view :style="{marginTop:sctop+'px'}" class="absolute fulled">
							<view :style="{height: '100rpx'}"
							v-for="(item,index) in chiledrenData.listData" :key="index"
							>
							
							<slot name="default" :itemdata="item">
							</slot>
							</view>
						</view>
						
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		name:'tm-swiperList',
		props: {
			list:{
				type:Array,
				default:()=>[]
			},
			width:{
				type:Number,
				default:400
			},
			height:{
				type:Number,
				default:600
			},
			itemHeight:{
				type:Number,
				default:100
			}
		},
		data() {
			return {
				selectedWipeIndex:0,
				timed:96536,
				timed1:965361,
				showNum:0,//当前视图内可容纳的条数
				sctop:0,
				chiledrenData:{
					scroll:{
						showNum:6,//当前视图内可容纳的条数
						totalSum:40,//总条数
						topIndex:0,//顶部位置条目的索引
						preateIndex:0,
						top:0
					},
					
					listData:[]//列表可以渲染的数据。
				}
			};
		},
		watch:{
			list:{
				deep:true,
				handler(){
					this.setDefault();
				}
			}
		},
		computed: {
			showSlotData:function () {
				console.log(this.chiledrenData);
				return JSON.stringify(this.chiledrenData)
				
			},
			itemHeight_px:function () {
				return uni.upx2px(this.itemHeight)
			},
			list_data:function () {
				return this.list;
			},
			total_rx() {
				return this.total; 
			}
		},
		mounted(){
		},
		created(){
			//计算当前视图内可容纳的条数
			this.showNum = Math.floor(uni.upx2px(this.height)/uni.upx2px(this.itemHeight));
		},
		methods: {
			swiperChange(e){
				let t =this;
				clearTimeout(this.timed)
				this.timed = setTimeout(function() {
					t.selectedWipeIndex = e.detail.current;
				}, 50);
			},
			scroll(e){
				let t = this;
				let sp = Math.floor(parseInt(e.detail.scrollTop));
				this.sctop = e.detail.scrollTop
				let to =  Math.floor(parseInt(e.detail.scrollHeight));
				//计算总的条数。
				let totalSum = Math.floor(to / uni.upx2px(this.itemHeight));
				//计算当前top位置的index.
				let topIndex= Math.floor(sp/uni.upx2px(this.itemHeight));
				topIndex = topIndex-1;
				topIndex = topIndex<=0?0:topIndex;
				//当前视图内可容纳的条数
				let nowViewBoxnum = this.showNum;
				let chiledrenData = {
					scroll:{
						showNum:nowViewBoxnum,//当前视图内可容纳的条数
						totalSum:totalSum,//总条数
						topIndex:topIndex,//顶部位置条目的索引
						top:sp,
					}
				}
				
				clearTimeout(this.timed1)
				this.timed1 = setTimeout(function() {
					t.setDefault(chiledrenData,e.detail.deltaY)
				}, 50);
			},
			setDefault(chiledrenData,dy){
				let t  = this;
				if(this.list.length==0) return;
				if(!Array.isArray(this.list[this.selectedWipeIndex])) return;
				if(this.list[this.selectedWipeIndex].length==0) return;
				if(!chiledrenData) chiledrenData = this.chiledrenData;
				//计算当前显示的条数。
				let p = this.list[this.selectedWipeIndex];
				let start = chiledrenData.scroll.topIndex;
				let end = start+this.showNum
				
				let d_endIndex = chiledrenData.scroll.topIndex%this.showNum;
				
				
				
				
				let s = chiledrenData.scroll.topIndex 
				let e = s+(this.showNum-d_endIndex);
				
				let sholist = p.slice(s,e);
				
				//补齐的数据。
				let bu = p.slice(e,e+d_endIndex)
				
				let oslist = [...sholist,...bu];
				oslist = oslist.map((el,index)=>{
					console.log(chiledrenData.scroll.top,chiledrenData.scroll.top+index*t.itemHeight_px);
					return {src:el,top:chiledrenData.scroll.top+index*t.itemHeight_px};
				})
				
				this.chiledrenData = {
					scroll:{...chiledrenData.scroll,preateIndex:this.selectedWipeIndex},
					listData:oslist
				}
				
			},
			findChildren(){
				let t = this;
				let box = [];
				function findchild(p,index){
					let preat = p;
					if(preat.$options?.name==='tm-swiperListItem'){
						preat.test.call(preat,t.index)
					}else{
						if(preat.$children.length>0){
							preat.$children.forEach(item=>{
								findchild(item,index++);
							})
						}
					}
				};
				findchild(this.$children[0],0);
			},
		},
	}
</script>

<style lang="scss">

</style>
