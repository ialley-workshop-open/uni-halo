<template>
	<view class="tm-dragGrid relative fulled" :style="{height:totalH+'px'}">
		
		<view class="absolute  "
		:class="[ani&&!disabled?'aniOn':'',nowMove_index==index||endDrage?'':'tranAni']"
		:style="{
			width:itemWidth+'px',
			height:h+'px',
			left:item.left+'px',
			top:item.top+'px',
			zIndex:nowMove_index==index?5:0
		}"
		v-for="(item,index) in listData"
		:key="index"
		:id="'tm-dragGrid-' + index"
		@touchstart="m_start($event,index)"
		@mousedown="m_start($event,index)"
		@touchmove.stop.prevent="m_move($event,index)" 
		@mousemove.stop.prevent="m_move($event,index)"
		@touchend="m_end($event,index)" 
		@mouseup="m_end($event,index)"
		@longpress="startEdit"
		>
		<slot name="default" :item="item.data">
			<view v-if="model==0" class="flex-center flex-col" style="width:70%">
				<view style="width:100%"><tm-badges @click.stop="delitem(item)" v-if="!disabled" :offset="[0,-5]" icon="icon-times"></tm-badges></view>
				<tm-icons :size="45" :name="item.data.icon" :color="item.data.color"></tm-icons>
				<text class="text-size-s pt-10">{{item.data.text}}</text>
			</view>
			<view v-if="model==1" style="width:100%;height:100%">
				<tm-badges @click.stop="delitem(item)" v-if="!disabled" :offset="[-5,-5]" icon="icon-times"></tm-badges>
				<view :class="['bg-gradient-'+item.data.color+'-accent']" class=" flex-center  round-4 text-size-s" style="width: 90%;height:100rpx">
					{{item.data.text}}
				</view>
			</view>
		</slot>
		</view>
	</view>
</template>

<script>
	/**
	 * 宫格拖动排序
	 * @property {Number} col = [] 4，一行排列几个
	 * @property {Number} width = [] 0，组件宽度，可以不设置默认取父组件宽度
	 * @property {Number} itemHeight = [] 120，项目的高度
	 * @property {Boolean} ani = [] true，是否开启拖动显示内容抖动动画
	 * @property {Boolean} disabled = [] false，是否开启拖动
	 * @property {Boolean} longTap = [] true，是否允许长按启动编辑模式。
	 * @property {Number} model = [0|1] 0，0图标模式，1方块样式。
	 * @property {Array} list = [] []，排序的列表，只要是数组就可，至于内容是什么格式无所谓。
	 * @property {Function} change 拖放排序时触发，返回更改后的列表数据。
	 * @property {Function} remove 删除一个项目时触发。
	 */
	import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';
	import tmBadges from '@/tm-vuetify/components/tm-badges/tm-badges.vue';
	export default {
		name:"tm-dragGrid",
		components:{tmBadges,tmIcons},
		props:{
			//几列，一行排几个。
			col:{
				type:Number,
				default:4
			},
			//组件宽度，可以不设置默认取父组件宽度
			width:{
				type:Number,
				default:0
			},
			//项目的高度
			itemHeight:{
				type:Number,
				default:120
			},
			//是否开启拖动显示内容抖动动画
			ani:{
				type:Boolean,
				default:true
			},
			disabled: {
				type: String | Boolean,
				default: false
			},
			list:{
				type:Array,
				default:()=>{}
			},
			//是否开户长按开始编辑。
			longTap:{
				type:Boolean,
				default:true
			},
			model:{
				type:Number,
				default:0,
			}
		},
		data() {
			return {
				w:0,
				h:0,
				row:0,
				totalH:0,
				listData:[],
				itemWidth:0,
				endDrage: false,
				Drage__id: '', //正在被拖动的id;
				nowMove_index: null, //现在正在移动的索引
				x:0,
				y:0,
				prarentTop:0,
				prarentLeft:0,
				grid:0,
				isDrage:false,
				
			};
		},
		computed:{
		},
		created() {
			this.grid = this.list.length;
		},
		mounted() {
			this.inits();
		},
		watch:{
			list:{
				deep:true,
				handler(){
					this.inits();
				}
			}
		},
		methods: {
			startEdit(){
				if(this.longTap==false) return;
				this.$emit("update:disabled",false)
			},
			delitem(item){
				this.list.splice(item.index,1)
				this.$emit('remove',item)
				this.$emit('change', this.listData);
			},
			m_start(event,index){
				event.preventDefault()
				event.stopPropagation()
				if (this.disabled) return;
				this.nowMove_index = index;
				this.endDrage = false;
				this.isDrage = true;
				if (event.type.indexOf('mouse') == -1 && event.changedTouches.length == 1) {
					var touch = event.changedTouches[0];
					this.y = touch.pageY - event.currentTarget.offsetTop - this.prarentTop
					this.x = touch.pageX - event.currentTarget.offsetLeft - this.prarentLeft
					
				} else {
					this.y = event.pageY - event.currentTarget.offsetTop - this.prarentTop
					this.x = event.pageX - event.currentTarget.offsetLeft - this.prarentLeft
					
				}
				
				// #ifdef MP
				uni.vibrateShort({})
				// #endif
			},
			m_move(event,index){
				let t = this
				if (this.disabled) return;
				event.preventDefault()
				event.stopPropagation()
				if(!this.isDrage) return;
				if (t.endDrage==true) return;
				
				//当前元素的top位置。
				let chy = 0;
				let chx = 0;
				if (event.type.indexOf('mouse') == -1 && event.changedTouches.length == 1) {
					var touch = event.changedTouches[0];
					chy = touch.pageY - t.y - this.prarentTop
					chx = touch.pageX - t.x - this.prarentLeft
				
				} else {
					chy = event.pageY - t.y - this.prarentTop
					chx = event.pageX - t.x - this.prarentLeft
				}
				
				t.listData.splice(index, 1, {
					...t.listData[index],
					top: chy,
					left: chx,
				})
				t.nowMove_index = index;
				
				const currenit_index = index;
				const currentSort = t.listData[currenit_index].sort;
				const currenit_id = t.listData[currenit_index].__id;
				
				// 计算当前移动的index.
				let moveIndex = Math.round(chx / t.itemWidth) + Math.round(chy / t.h)*t.col;
				
				moveIndex = moveIndex < 0 ? 0 : moveIndex;
				moveIndex  = moveIndex > t.listData.length - 1 ? t.listData.length - 1 : moveIndex;
				
				moveIndex = Math.abs(moveIndex)
				
				index = moveIndex;
				let elList = [...t.listData]
				for (let i = 0; i < elList.length; i++) {
					if (currentSort < moveIndex) {
						if (elList[i].sort > currentSort && elList[i].sort <= moveIndex) {
							elList[i].sort -= 1;
						};
					} else if (currentSort > moveIndex) {
						if (elList[i].sort < currentSort && elList[i].sort >= moveIndex) {
							elList[i].sort += 1;
						};
					}
				};
				elList[currenit_index].sort = moveIndex;
				elList = elList.map(el => {
					if (el.__id != currenit_id) {
						el.left = el.sort % t.col * t.itemWidth;
						el.top = parseInt(el.sort / t.col) * t.h;
						
					}
					return el;
				})
				t.listData = elList;
			
			},
			m_end(event,index){
				
				if (this.disabled) return;
				let t = this;
				event.preventDefault()
				event.stopPropagation()
				this.isDrage = false;
				this.endDrage = true;
				if (this.nowMove_index == null) return;
				let elList = [...t.listData]
				elList = this.setTL(elList);
				elList.sort((a,b)=>a.sort-b.sort)
				t.listData = [...elList]
				this.nowMove_index = null;
				this.moveChange();
			},
			moveChange(e, index) {
				if (this.disabled) return;
				//change后修改的数据 。
				const elList = [...this.listData]
				elList.sort((a,b)=>a.sort-b.sort-b)
				this.$emit('change',elList);
			},
			inits() {
				this.grid = this.list.length;
				if(this.grid==0) return;
				this.$nextTick(async function() {
					let p = await this.$Querey(".tm-dragGrid", this).catch(e => {})
					this.listData = [];
					//组件的宽度
					this.w = uni.upx2px(this.width) || p[0].width || 300;
					this.prarentTop = p[0].top;
					this.prarentLeft = p[0].left;
					
					//项目的高度。
					this.h = uni.upx2px(this.itemHeight)
					//项目的宽度
					this.itemWidth = this.w / this.col
					//行数。
					this.row = Math.ceil(this.grid / this.col);
					
					//总高度
					this.totalH = this.h * this.row
					//构造一个list宫格列表出来。
					for(let i=0;i<this.grid;i++){
						this.listData.push({
							"data":this.list[i],
							"__id":uni.$tm.guid(),
							"top":0,
							"left":0,
							"sort":i,
							"index":i
						})
					}
					let list = this.setTL([...this.listData]);
					this.listData = [...list];
				})
			},
			//计算位置。
			setTL(el){
				for(let i = 0;i < el.length;i++){
					el[i].left = el[i].sort % this.col * this.itemWidth;
					el[i].top = parseInt(el[i].sort / this.col) * this.h;
				}
				return el;
			}
		},
	}
</script>

<style lang="scss" scoped>
	.aniOn{
		animation:doudong 0.5s linear infinite;
		background:linear-gradient();
		background: -webkit-linear-gradient();
		
	}
	.tranAni{
		transition:all 0.15s
	}
	@keyframes doudong {
		0%{
			transform: rotate(-2deg) translateX(2rpx) translateY(2rpx);
		}
		25%{
			transform: rotate(0deg) translateX(-2rpx) translateY(-2rpx);
		}
		50%{
			transform: rotate(0deg) translateX(0rpx) translateY(-2rpx);
		}
		75%{
			transform: rotate(0deg) translateX(0rpx) translateY(2rpx);
		}
		100%{
			transform: rotate(-2deg) translateX(2rpx) translateY(2rpx);
		}
	}
</style>
