<template>
	<view class="tm-quickIndex " :style="{
			height: activeHeight_watch + 'px'
		}">
		<view :style="{
			height: activeHeight_watch + 'px'
		}">
			<tm-loadding v-if="loadding" label="处理中..."></tm-loadding>
			<scroll-view scroll-y :class="[black_tmeme?'grey-darken-4':'white']" :style="{
					height: activeHeight_watch + 'px',
				}" @scroll="scrollIn" :scroll-into-view="guid+'_'+(isScroll?'':active_value)">
				<view v-for="(item,index) in dataList" :key="index" :id="guid+'_'+index" class="tm-quickIndex-item">
					
					<view :class="[black_tmeme?'grey-darken-5':'grey-lighten-4 text']" class="  text-size-s text-weight-b px-32 py-12">{{item.title}}</view>
					<view>
						
						<view v-for="(item2,index2) in item.children" :key="index2">
							
							<slot name="cell" :data="{prevent:index,children:index2,total:item.children.length,item:item2,title:item2[rangKey],color:color_tmeme,black:black_tmeme}">
								<view :class="[index2!==item.children.length-1?'border-grey-lighten-4-b-1 ':'',black_tmeme?'bk':'']" class="mx-32 py-24  flex-start" @click="changeIndex(index,index2,item2)">
									<view  v-if="item2['icon']" style="width: 48rpx;height: 48rpx;" class="mr-24 rounded flex-center overflow">
										<tm-icons :size="48" :name="item2['icon']"></tm-icons>
									</view>
									<view class="text-size-n">
										{{item2[rangKey]}}
									</view>
								</view>
								
							</slot>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<view class="tm-quickIndex-index flex-center flex-col pr-16" :style="{
				height: activeHeight_watch + 'px'
			}">
			<view v-if="showtips"
				:class="[`text-${color_tmeme}`,black_tmeme?'bk':'']"
				class="tm-quickIndex-index-Tips absolute rounded shadow-10 flex-center white text-size-g text-weight-b">
				{{ returnIndexStr(scrollIndx) }}
			</view>
			<!-- <view v-if="scrollInBarIndex"
				:class="[`text-${color}`]"
				class="tm-quickIndex-index-Tips absolute rounded shadow-10 flex-center white text-size-g text-weight-b">
				{{returnIndexStr(scrollIndx)}} :class="[scrollIndx==index?`text-${color} text-weight-b`:'']"
			</view> -->
			<view v-if="activeHeight_watch>0" @touchend.stop.prevent="indexMove($event,'end')" @touchmove.stop.prevent="indexMove($event,'scroll')"
				class="tm-quickIndex-index-Bk  round-24  shadow-3 " :class="[black_tmeme?'grey-darken-5 bk':'white']">
				<view @click.stop="acitveItemClick($event,index)"
					class="tm-quickIndex-index-item   text-size-xxs  flex-center  px-2"
					
					v-for="(item,index) in dataList" :key="index">
					{{
						returnIndexStr(index)
					}}
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	/**
	 * 快速索引
	 * @property {Array} list = [] 默认：[],列表数据，格式：[{title:"汽车品牌",children:[{title:"宝马"},{title:"奔驰"}]}]
	 * @property {String} rang-key = [] 默认：'title',列表对象key，
	 * @property {String | Number} height = [] 默认：0,高度，默认为0时，自动使用屏幕的高度。
	 * @property {Number} value = [] 默认：0,当前滚动的索引位置,推荐使用v-model或者value.sync
	 * @property {String} color = [] 默认：primary,主题色。
	 * @property {Function} change 点击列表项时产生的事件，返回参数：{prent:父Index,children:子index,data:项数据。}
	 * @example <tm-quickIndex :list='[{title:"汽车品牌",children:[{title:"宝马"},{title:"奔驰"}]}]'></tm-quickIndex>
	 * 如果 不提供index索引字符将截取title第一个字符作为索引。如果title第一个没有将使用自建的数字索引。
	 */

	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	import tmLoadding from "@/tm-vuetify/components/tm-loadding/tm-loadding.vue"
	export default {
		components:{tmIcons,tmLoadding},
		name: 'tm-quickIndex',
		model: {
			prop: 'value',
			event: 'input'
		},
		props: {
			// 高度，默认为0时，自动使用屏幕的高度。
			height: {
				type: String | Number,
				default: 0
			},
			// 当前滚动的位置。
			value: {
				type: Number,
				default: 0
			},
			// 当前滚动的位置。
			color: {
				type: String,
				default: "primary"
			},
			list: {
				type: Array,
				default: () => {
					return [];
				}
			},
			rangKey: {
				type: String,
				default: "title"
			},
			black: {
				type: String|Boolean,
				default: null
			},
			// 跟随主题色的改变而改变。
			fllowTheme:{
				type:Boolean|String,
				default:true
			}
		},
		watch: {
			value: function() {
				
				this.active = this.value;
				this.isScroll=false;
				this.scrollIndx = this.value;
			},
			list:{
				deep:true,
				handler(){
					this.dataList = this.list;
				}
			}
		},
		computed: {
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
			active: {
				get: function() {
					return this.active_value;
				},
				set: async function(val) {
					this.active_value = val;
					this.$emit('input', val);
					this.$emit('update:value', val);
					let t = this;
					this.showtips = true;
					let idx = 5655555
					clearTimeout(idx)
					idx = setTimeout(function(){
						t.showtips = false;
					},500)
					
				}
			},
			activeHeight_watch: {
				get: function() {
					return this.activeHeight;
				},
				set: function(val) {
					this.activeHeight = val;
				}
			}
		},
		data() {
			return {
				minTop:0,
				activeHeight: 0,
				guid: "",
				active_value: 0,
				listBound: [],
				nowIndex: 0,
				showtips: false,
				isScroll: true,
				quinkBar: null,
				scrollIndx: 0,
				scrollInBarIndex: false,
				dataList:[],
				loadding:true
			};
		},
		async mounted() {
			this.guid = uni.$tm.guid();
			let t = this;
			this.activeHeight_watch = uni.upx2px(this.height);
			this.loadding=true;
			await uni.$tm.sleep(50)
			this.dataList = [...this.list];
			
			this.$nextTick(async function() {
				if (!this.activeHeight_watch) {
					let sysinfo = uni.getSystemInfoSync();
					this.activeHeight_watch = sysinfo.windowHeight;
					
				}
				let df = await this.$Querey(".tm-quickIndex",this).catch(e=>{});
				
				this.minTop = df[0].top;
				let indexbar = await t.$Querey(".tm-quickIndex-index-Bk", t).catch(e => {})
				t.quinkBar = indexbar[0]
				await uni.$tm.sleep(100)
				t.active = t.value;
				uni.createSelectorQuery().in(t).selectAll('.tm-quickIndex-item')
				.boundingClientRect(res => {
					res.forEach(item => {
						t.listBound.push(item.top)
					})
					t.loadding=false;
				}).exec()
			});
		},
		methods: {
			returnIndexStr(index){
				let item = this.list[index];
				if(!item || typeof item === 'undefined') return;
				if(item['index']&& typeof item['index'] !=='undefined'){
					
					return item['index'];
				}else{
					if(item[this.rangKey][0]&& typeof item[this.rangKey][0] !=='undefined'){
						return item[this.rangKey][0];
					}
				}
				return index+1
				
			},
			scrollIn(e) {
				let t = this;
				let y = e.detail.scrollTop;
				this.isScroll = true;

				function chatIndex(min) {
					let index = 0;
					
					for (let i = 0; i < t.listBound.length; i++) {
						if (t.listBound[i] >= min + t.minTop+1) {
							index = i;
							break;
						}
					}
					
					return index;
				}
				
				this.nowIndex = chatIndex(y) - 1;
				
			},
			changeIndex(prentindex, childrenindex, item) {
				this.$emit('change', {
					prent: prentindex,
					children: childrenindex,
					data: item
				})
			},
			async acitveItemClick(e, indx) {
				this.isScroll = false;
				if (this.list.length <= 0) return;
				this.active = indx;
			},
			async indexMove(e, type) {
				let t = this;
				if (this.list.length <= 0) return;
				if (e.changedTouches.length > 1) return;
				let y = e.changedTouches[0].clientY;
				let itemHeight = uni.upx2px(40);
				let ClickTop = e.target.offsetTop;
				let index = 0;
				if (y <= this.quinkBar.top) {
					index = 0;
				} else if (y >= this.quinkBar.bottom) {
					index = this.list.length - 1;
				} else {
					let xy = y - this.quinkBar.top
					index = Math.floor(xy / itemHeight);
				}
				if(index>=this.list.length-1) index = this.list.length-1
				if(index<=0) index = 0;
				this.isScroll = false;
				
				if(this.scrollIndx!==index){
					this.scrollIndx = index
				}
				if(this.active!==index){
					this.active = index;
				}
				if (type == 'end') {
					t.scrollInBarIndex = false;
				} else {
					t.scrollInBarIndex = true;
				}
			}
		},
	};
</script>

<style lang="scss" scoped>
	.tm-quickIndex {
		position: relative;

		.tm-quickIndex-index {
			position: absolute;
			right: 0upx;
			top: 0;
			
			.tm-quickIndex-index-item {
				width: 40rpx;
				height: 40rpx;
				// background: rgba(255,255,255,0.1);
			}

			.tm-quickIndex-index-Tips {
				right: 160rpx;
				width: 100rpx;
				height: 100rpx;
			}
		}
	}
</style>
