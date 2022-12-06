<template>
	<view class="tm-flowLayout relative">
		<view  class="tm-flowLayout-hidden absolute fulled" >
			<view v-for="(item, index) in list2" :key="index" style="width: 350rpx;" :class="'tm-flowLayout-hidden-'+index" >
				<tm-images  @error="loadimg($event,false,index)"  @load="loadimg($event,true,index)"  :src="item.image"></tm-images>
			</view>
		</view>
		<view class="tm-flowLayout-cm flex-between">
			<view class="tm-flowLayout-left" style="width: 48.6%;">
				<block v-for="(item, index) in dataList[0]" :key="index">
					<view @click.stop="onclick(index,0)" class="tm-flowLayout-item mb-20 fulled" :class="['tm-flowLayout-item_'+index]" >
						<slot name="left" :hdata="{item:item,dirIndex:0,childrenIndex:index}">
							<tm-images v-if="item.image" :src="item.image"></tm-images>
						</slot>
					</view>
				</block>
			</view>
			<view class="tm-flowLayout-right" style="width: 48.6%;">
				<block v-for="(item, index) in dataList[1]" :key="index">
					<view @click.stop="onclick(index,1)" class="tm-flowLayout-item mb-20 fulled"  :class="['tm-flowLayout-item_'+index]">
						<slot name="right" :hdata="{item:item,dirIndex:1,childrenIndex:index}">
							<tm-images v-if="item.image"  :src="item.image"></tm-images>
						</slot>
					</view>
				</block>
			</view>
			
		</view>
		<view v-if="isLoading" class="flex-shrink fulled">
			<tm-loadding></tm-loadding>
		</view>
	</view>
</template>

<script>
	
	/**
	 * 瀑布流组件
	 * @property {Function} click 点击项目时触发
	 * @property {Function} load 当前列表加载完成发出的事件。
	 * @property {String} model = [rank|desc] desc下正时排序，所有加载完成再进行显示,rank随机，哪个先加载哪个先排前面。
	 */
	import tmImages from "@/tm-vuetify/components/tm-images/tm-images.vue"
	import tmLoadding from "@/tm-vuetify/components/tm-loadding/tm-loadding.vue"
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	export default {
		components:{tmImages,tmLoadding,tmIcons},
	name: 'tm-flowLayout',
	props:{
		model:{
			type:String,
			default:'rank' //desc下正时排序，所有加载完成再进行显示,rank随机，哪个先加载哪个先排前面。
		}
	},
	data() {
		return {
			list2:[],
			dataList:[
				[],[]
			],
			colHeight:[0,0],
			minWidth:0,
			isLoading:true,
		};
	},
	async mounted() {
		let p = await this.$Querey('.tm-flowLayout-left').catch(e=>{});
		this.minWidth = p[0].width;
	},
	
	methods: {
		onclick(index,dirIndex){
			this.$emit('click',
			{
				childrenIndex:index,
				dirIndex:dirIndex,
				item:this.dataList[dirIndex][index]
			});
		},
		//修改或者替换列表数据
		changeItemData(dirIndex,childrenIndex,item){
			this.dataList[dirIndex].splice(childrenIndex,1,item);
		},
		//删除一项列表数据
		delItemData(dirIndex,childrenIndex){
			this.colHeight.splice(dirIndex,1,this.colHeight[dirIndex] - this.dataList[dirIndex][childrenIndex].height)
			this.dataList[dirIndex].splice(childrenIndex,1);
			this.list2.splice(this.dataList[dirIndex][childrenIndex].index,1);
			
			this.$nextTick(function(){
				this.sucessRank();
			})
		},
		//向列表添加数据
		pushData(list){
			let prIdx_i = this.list2.length;
			if(!Array.isArray(list)||typeof list =='undefined'){
				return false;
			}
			for(let i=0;i<list.length;i++){
				this.list2.push({
					index:i+prIdx_i,
					isLoad:false,
					image:"",
					width:0,
					height:0,
					...list[i]
				})
			}
		},
		//获取内部列表数据
		getDataList(){
			return this.dataList;
		},
		async loadimg(event,isLoad,index) {
			
			// console.log(event,index);
			this.isLoading = true;
			let ps = this.list2[index];
			ps.isLoad = true;
			if(isLoad==false){
				ps.width = this.minWidth;
				ps.height = this.minWidth;
				
			}else{
				ps.width = this.minWidth;
				ps.height = ps.height+event.height;
			}
			if(this.list2.length==0&&this.dataList[0].length==0&&this.dataList[1].length==0){
				this.isLoading = false;
				return;
			}
			this.list2.splice(index,1,ps);
			if(this.model=='desc'){
				this.sucessRank();
			}else if(this.model == 'rank'){
				let indexCol = this.colHeight[0]<=this.colHeight[1]?0:1;
				this.dataList[indexCol].push(this.list2[index]);
				this.colHeight.splice(indexCol,1,this.colHeight[indexCol]+this.list2[index].height);
				if(this.isAllLoading()===false) return;
				this.isLoading = false;
			}
		},
		isAllLoading(){
			let isAllload = true;
			for(let i=0;i<this.list2.length;i++){
				if(this.list2[i].isLoad===false){
					isAllload = false;
					break;
				}
			}
			if(isAllload===true){
				// 当前列表加载完成发出的事件。
				this.$emit('load',this.dataList)
			}
			return isAllload;
		},
		sucessRank(){
			if(this.isAllLoading()===false) return;
			this.isLoading = false;
			for(let i=0;i<this.list2.length;i++){
				// let p = await this.getLeftRightHeight();
				let index = this.colHeight[0]<=this.colHeight[1]?0:1;
				this.dataList[index].push(this.list2[i]);
				this.colHeight.splice(index,1,this.colHeight[index]+this.list2[i].height)
			}
			
		},
		//清空瀑布流数据 。
		clear(){
			this.list2 = [];
			this.dataList = [[],[]];
			this.isLoading = false;
		},
		getLeftRightHeight(index){
			let t = this;
			return new Promise((resolve,rejecvt)=>{
				let q = uni.createSelectorQuery().in(t);
				q.select(".tm-flowLayout-left").boundingClientRect();
				q.select(".tm-flowLayout-right").boundingClientRect();
				q.exec((res)=>{
					resolve([res[0].height,res[1].height])
				})
			})
		}
			
	},
};
</script>

<style lang="scss">
.tm-flowLayout {
	.tm-flowLayout-hidden{
		width: 100%;
		height: 100px;
		overflow-y: auto;
		left: -300%;
		top: 0;
	}
	.tm-flowLayout-cm{
		align-items: flex-start;
	}
	
	
}
</style>
