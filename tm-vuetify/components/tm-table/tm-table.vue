<template>
	<view class="tm-table"  >
		<scroll-view v-if="fixedHeader" :scroll-with-animation="true" :scroll-left="scrollx_px_header" @scroll="scrollChange($event,'header')" scroll-x="" class="tm-table-scroll tm-table-scroll-body fulled">
			<view class="  tm-table-scroll-header">
				<tm-row v-if="listdata.header.length>0" preatClass="tm-table-header " style="white-space: nowrap;">
					<block v-for="(item,index) in listdata.header" :key="index">
						<tm-col :maxCol="maxGrid" :grid="item['grid']?item.grid:col"
							:color="(listdata.headerBgcolor?listdata.headerBgcolor:item.color)+ (black_tmeme?' bk ':'')"
							custom-class="" :padding="5">
							<view @click="rank(index)" class="text-size-s vertical-align-middle text-weight-b text-overflow-1 flex-center"
								style="white-space: initial;height: 36px;">
								<view class="flex-center vertical-align-middle fulled-height">
									<text>{{item[rangKey]}}</text>
									<view v-if="item['sort']" class="flex-col flex-center pl-10 flex-shrink"  style="line-height: 0;">
										<text :class="[index==rank_index&&rank_type==0?'':'opacity-6']" class="iconfont icon-sort-up text-size-xs "></text>
										<text :class="[index==rank_index&&rank_type==1?'':'opacity-6']" class="iconfont icon-sort-down text-size-xs mt-14"></text>
									</view>
								</view>
			
							</view>
						</tm-col>
					</block>
				</tm-row>
			</view>
		</scroll-view>
		<scroll-view :scroll-with-animation="true" :scroll-left="scrollx_px_body" @scroll="scrollChange($event,'body')" scroll-x :scroll-y="height_s?true:false" class="tm-table-scroll tm-table-scroll-body fulled"
			:style="{
			height:height_s?`${height_s}px`:'auto'
			}">
			<view v-if="!fixedHeader" class="  tm-table-scroll-header">
				<tm-row v-if="listdata.header.length>0" preatClass="tm-table-header " style="white-space: nowrap;">
					<block v-for="(item,index) in listdata.header" :key="index">
						<tm-col :maxCol="maxGrid" :grid="item['grid']?item.grid:col"
							:color="(listdata.headerBgcolor?listdata.headerBgcolor:item.color)+ (black_tmeme?' bk ':'')"
							custom-class="" :padding="5">
							<view @click="rank(index)" class="text-size-s vertical-align-middle text-weight-b text-overflow-1 flex-center"
								style="white-space: initial;height: 36px;">
								<view class="flex-center vertical-align-middle fulled-height">
									<text>{{item[rangKey]}}</text>
									<view v-if="item['sort']" class="flex-col flex-center pl-10 flex-shrink"  style="line-height: 0;">
										<text :class="[index==rank_index&&rank_type==0?'':'opacity-6']" class="iconfont icon-sort-up text-size-xs "></text>
										<text :class="[index==rank_index&&rank_type==1?'':'opacity-6']" class="iconfont icon-sort-down text-size-xs mt-14"></text>
									</view>
								</view>

							</view>
						</tm-col>
					</block>
				</tm-row>
			</view>
			<block v-for="(item,index) in listdata.col" :key="index">
				<tm-row v-if="listdata.col.length>0" preatClass="tm-table-header" style="white-space: nowrap;">

					<block v-for="(item2,index2) in item" :key="index2">
						<tm-col
							
							:maxCol="maxGrid"
							:grid="item2['grid']?item2['grid']:(listdata.header[index2]['grid']?listdata.header[index2]['grid']:col)"
							:color="item2.color?item2.color:(listdata.header[index2].color?listdata.header[index2].color+' text':(item2.color?item2.color+' text':((index+1)%2?activeCellColorRow+' text':'white'))) + (black_tmeme?' bk ':'')">
							<view @click="onclick(index,index2,item2)"
								class="text-size-s   border-grey-lighten-3-b-1 flex-center  wrap fulled-height overflow"
								:class="black_tmeme?' bk ':''"
								:style="{height: `${rowHeight}rpx`}">
								<view class=" overflow fulled fulled-height " :class="(item2['rowAlign']||listdata.header[index2]['rowAlign']||rowAlign)">
									<slot name="cell" :data="{parentIndex:index,childrenIndex:index2,data:item2}">
										<text class="pa-10">{{item2[rangKey]}}</text>
									</slot>
								</view>
							</view>
						</tm-col>
					</block>
				</tm-row>
			</block>
		</scroll-view>
	</view>
</template>

<script>
	/**
	 * 表格
	 * @property {Number} height = [] 默认：0，表格的整体高度，如果设定了高度，超过后变为滚动。
	 * @property {Number} col = [] 默认：0，默认的列宽，记住是1-12列
	 * @property {Boolean} fixedHeader = [] 默认：false，是否固定顶部表头
	 * @property {String} activeCellColorRow = [] 默认：blue，默认高亮的行颜色
	 * @property {String} rang-key = [] 默认：text，list对象时读取文本的字段，默认text
	 * @property {Number} rowHeight = [] 默认：72，单元格的高度。单位rpx
	 * @property {Array} rowAlign = [] 默认：'flex-center'，
	 * 单元格对齐方式本库类，也可能通过单元格数据对齐覆盖此全局变量，以控制单个的对齐方式
	 * @property {Number} maxGrid = [] 默认：12,布局的列表，比如我想一行5个，就可以用到此属性，设置为10，然后grid=2即可。
	 * @property {String} sort-key = [] 默认：text，默认text即rangKey字段进行排序。排序的字段名称。
	 * @property {Object} list = [] 默认：{}，list数据格式见文档
	 * @example <tm-table :list="list2"></tm-table>
	 */
	import tmRow from "@/tm-vuetify/components/tm-row/tm-row.vue"
	import tmCol from "@/tm-vuetify/components/tm-col/tm-col.vue"
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	export default {
		components: {
			tmRow,
			tmCol,
			tmIcons
		},
		name: "tm-table",
		props: {
			height: {
				type: Number,
				default: 0
			},
			black: {
				type: Boolean | String,
				default: null
			},
			// 默认的列宽
			col: {
				type: Number,
				default: 3
			},
			// 默认高亮的单元格。
			activeCellColorRow: {
				type: String,
				default: 'primary'
			},
			// 对象时读取文本的字段，默认text
			rangKey: {
				type: String,
				default: 'text'
			},
			sortKey:{
				type:String,
				default:'text'
			},
			list: {
				type: Object,
				default: () => {
					return {};
				}
			},
			//默认计算方式是12列布局。
			maxGrid:{
				type:Number,
				default:12
			},
			fixedHeader:{
				type:Boolean|String,
				default:false,
			},
			rowHeight:{
				type:Number,
				default:72
			},
			rowAlign:{
				type:String,
				default:'flex-center'
			}
		},
		data() {
			return {
				scrollx_px_header: 0,
				scrollx_px_body: 0,
				scrollx_obj: null,
				orderlist: null,
				rank_index:null,
				rank_type:2,
				list_default: {
					header: [], //头部数据
					col: [], //行的数据
					headerBgcolor: 'primary', //头部的背景颜色
				}
			};
		},
		created() {
			this.listdata = this.list;
		},
		watch:{
			list:{
				deep:true,
				handler(){
					this.listdata = this.list;
				}
			}
		},
		computed: {

			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			},
			listdata: {
				get: function() {
					return this.orderlist||this.list_default;
				},
				set: function(val) {
					let list = {
						...this.list_default,
						...val
					};
					this.orderlist = uni.$tm.deepClone(list);
				}
			},
			height_s: function() {
				return uni.upx2px(this.height);
			}
		},
		methods: {
			rank(index, type) {
				if(!this.listdata.header[index]['sort']){
					return;
				}
				let t = this;
				let list = uni.$tm.deepClone(this.listdata);
				this.rank_index = index;
				if(this.rank_type==0){
					let str = this.listdata.col[0][index][t.rangKey]
					if(/^[0-9]+(.[0-9]{0,})?$/g.test(str)){
						list.col.sort((a,b)=>b[index][t.sortKey]-a[index][t.sortKey])
						this.rank_type = 1
					}else{
						list = this.list
						this.rank_type = 2
					}
					
					this.listdata =  list;
					
					return;
				}else if(this.rank_type==1){
					this.listdata =  this.list;
					this.rank_type = 2
					return;
				}else{
					this.rank_type = 0
					let str = this.listdata.col[0][index][t.rangKey]
					
					if(/^[0-9]+(.[0-9]{0,})?$/g.test(str)){
						list.col.sort((a,b)=>a[index][t.sortKey]-b[index][t.sortKey])
					}else{
						list.col.reverse()
					}
					
					this.listdata = list;
					return;
				}
				
			},
			scrollChange(e,type){
				
				if(type=='header'){
					this.scrollx_px_body = e.detail.scrollLeft
				}else if(type=="body"){
					this.scrollx_px_header = e.detail.scrollLeft
				}
			},
			onclick(index, index2, item) {
				this.$emit("click", {
					row: index,
					col: index2,
					data: item
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.tm-table {
		.tm-table-scroll-header {
			position: relative;
			z-index: 2;

			.tm-header-body {}
		}

		.tm-table-scroll-body {
			position: relative;
			z-index: 1;
		}


	}

	.tm-table-header {
		flex-flow: nowrap !important;
		white-space: nowrap !important;
		display: flex;
		flex-flow: row nowrap;

		.tm-col {
			flex-shrink: 0;
			height: 100%;
		}
	}
</style>
