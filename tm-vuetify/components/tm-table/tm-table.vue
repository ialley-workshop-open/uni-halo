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
	 * ??????
	 * @property {Number} height = [] ?????????0???????????????????????????????????????????????????????????????????????????
	 * @property {Number} col = [] ?????????0??????????????????????????????1-12???
	 * @property {Boolean} fixedHeader = [] ?????????false???????????????????????????
	 * @property {String} activeCellColorRow = [] ?????????blue???????????????????????????
	 * @property {String} rang-key = [] ?????????text???list???????????????????????????????????????text
	 * @property {Number} rowHeight = [] ?????????72??????????????????????????????rpx
	 * @property {Array} rowAlign = [] ?????????'flex-center'???
	 * ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
	 * @property {Number} maxGrid = [] ?????????12,????????????????????????????????????5??????????????????????????????????????????10?????????grid=2?????????
	 * @property {String} sort-key = [] ?????????text?????????text???rangKey?????????????????????????????????????????????
	 * @property {Object} list = [] ?????????{}???list?????????????????????
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
			// ???????????????
			col: {
				type: Number,
				default: 3
			},
			// ???????????????????????????
			activeCellColorRow: {
				type: String,
				default: 'primary'
			},
			// ???????????????????????????????????????text
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
			//?????????????????????12????????????
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
					header: [], //????????????
					col: [], //????????????
					headerBgcolor: 'primary', //?????????????????????
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
