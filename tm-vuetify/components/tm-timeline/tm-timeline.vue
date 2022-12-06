<template>
	<view class="tm-timeline">
		
		<block v-if="model=='center'">
			<block v-for="(item,index) in listData" :key="index">
				<view v-if="(index+1)%2"  class="tm-timeline-item " >
					<view :style="{
						width: bwi(item)+'px',
						height: bwi(item)+'px'
					}" :class="[item['icon']?'pa-4':'',item.color?item.color:color_tmeme,`shadow-${item.color?item.color:color_tmeme}-4`,black_tmeme?'bk':'']"  class=" flex-center rounded tm-timeline-jidian   border-white-a-2">
					<tm-icons style="line-height: 0;" dense v-if="item.icon" color="white" :size="item.iconSize||24" :name="item.icon"></tm-icons>
					</view>
					<view class=" tm-timeline-item-content relative">
						<view :class="[`text-${(item.color?item.color:color_tmeme)}`]" v-if="item.time" class="tm-timeline-item-right pr-36 text-weight-b text-size-n  text-align-right">
							{{item.time}}
						</view>
						<!-- <tm-divider :vertical="true" :width="4" :height="100"></tm-divider> -->
						<view  :class="[`border-${item.borderColor?item.borderColor:borderColor}-l-1`,black_tmeme?'bk':'']" class="tm-timeline-item-right  pl-36 ">
							<view v-if="item.title" class="mb-12 text-align-left">
								<text class="text-weight-b text-size-n" :class="[`text-${(item.color?item.color:color_tmeme)}`]">{{item.title}}</text>
							</view>
							<view class="text-align-left pb-24">
								<text class="text-size-s text-grey-darken-1">
									{{item.content}}
								</text>
							</view>
						</view>
					</view>
					
				</view>
				<view v-if="(index+1)%2==0"  class="tm-timeline-item ">
					<view :style="{
						width: bwi(item)+'px',
						height: bwi(item)+'px'
					}"  :class="[item['icon']?'pa-4':'',item.color?item.color:color_tmeme,`shadow-${item.color?item.color:color_tmeme}-4`,black_tmeme?'bk':'']" class="flex-center rounded tm-timeline-jidian   border-white-a-2">
					 <tm-icons style="line-height: 0;" dense v-if="item.icon" color="white" :size="item.iconSize||24" :name="item.icon"></tm-icons>
					</view>
					<view class=" tm-timeline-item-content relative">
						<view :class="[index!==listData.length-1?(`border-${item.borderColor?item.borderColor:borderColor}-r-1`):'',black_tmeme?'bk':'']" class="tm-timeline-item-left  pr-36 ">
							<view v-if="item.title" class="mb-12 text-align-right">
								<text class="text-weight-b text-size-n" :class="[`text-${(item.color?item.color:color_tmeme)}`]">{{item.title}}</text>
							</view>
							<view class="text-align-right pb-24">
								<text class="text-size-s text-grey-darken-1">
									{{item.content}}
								</text>
							</view>
						</view>
						
						<view v-if="item.time"  :class="[`text-${(item.color?item.color:color_tmeme)}`]" class="tm-timeline-item-right pl-36 text-weight-b text-size-n ">
							{{item.time}}
						</view>
					</view>
					
				</view>
				
			</block>
		</block>
		<block v-if="model=='left'">
			<block v-for="(item,index) in listData" :key="index">
				<view   class="tm-timeline-item tm-timeline-item--leftDir">
					<view style="width: 160upx;">
						<view :style="{
							width: bwi(item)+'px',
							height: bwi(item)+'px'
						}"  :class="[item['icon']?'pa-4':'',item.color?item.color:color_tmeme,`shadow-${item.color?item.color:color_tmeme}-4`,black_tmeme?'bk':'']" class="flex-center rounded tm-timeline-jidian   border-white-a-2">
						 <tm-icons style="line-height: 0;" dense v-if="item.icon" color="white" :size="item.iconSize||24" :name="item.icon"></tm-icons>
						</view>
						<view :style="{
							marginTop:'-'+botop(item)+'px'
						}" :class="[index!==listData.length-1?'tm-timeline-item-boder':'',`${item.borderColor?item.borderColor:borderColor}`,black_tmeme?'bk':'']"></view>
					</view>
					<view class=" tm-timeline-item-content relative">
						
						<view  class="tm-timeline-item-left   ">
							<slot name="content" :data="item">
								<view v-if="item.time" :class="['text-'+(item.color?item.color:color_tmeme)]" class="mb-0 tm-timeline-item-right   text-size-s  ">
									{{item.time}}
								</view>
								<view v-if="item.title" class="mb-12 text-align-left">
									<text :class="['text-'+(item.color?item.color:color_tmeme)]" class="text-weight-b text-size-n ">{{item.title}}</text>
								</view>
								<view class="text-align-left pb-24 mb-32">
									<text class="text-size-s text-grey-darken-1">
										{{item.content}}
									</text>
								</view>
							</slot>
						</view>
						
						
					</view>
					
				</view>
				
			</block>
		</block>
		<block v-if="model=='right'">
			<block v-for="(item,index) in listData" :key="index">
				<view   class="tm-timeline-item tm-timeline-item--leftDir endright">
					
					<view class=" tm-timeline-item-content relative">
						
						<view  class="tm-timeline-item-left   ">
							<view v-if="item.time" :class="[`text-${(item.color?item.color:color_tmeme)}`]" class="mb-0 tm-timeline-item-right   text-size-s  text-align-right">
								{{item.time}}
							</view>
							<view v-if="item.title" class="mb-12 text-align-right">
								<text :class="[`text-${(item.color?item.color:color_tmeme)}`]" class="text-weight-b text-size-n ">{{item.title}}</text>
							</view>
							<view class="text-align-right pb-24 mb-32">
								<text class="text-size-s text-grey-darken-1">
									{{item.content}}
								</text>
							</view>
						</view>
						
						
					</view>
					<view style="width: 140upx;">
						<view :style="{
							width: bwi(item)+'px',
							height: bwi(item)+'px'
						}"  :class="[item['icon']?'pa-4':'',item.color?item.color:color_tmeme,`shadow-${item.color?item.color:color_tmeme}-4`,black_tmeme?'bk':'']" class="flex-center rounded tm-timeline-jidian   border-white-a-2">
						 <tm-icons style="line-height: 0;" dense v-if="item.icon" color="white" :size="item.iconSize||24" :name="item.icon"></tm-icons>
						</view>
						<view :style="{
							marginTop:'-'+botop(item)+'px'
						}" :class="[index!==listData.length-1?'tm-timeline-item-boder':'',`${item.borderColor?item.borderColor:borderColor}`,black_tmeme?'bk':'']"></view>
					</view>
				</view>
				
			</block>
		</block>
	</view>
</template>

<script>
	/**
	 * timeline 时间轴
	 * @property {Boolean} reverse = [] 默认：false ,是否反转数据。
	 * @property {String} border-color = [] 默认：grey-lighten-2 ,默认线的颜色。
	 * @property {String} color = [] 默认：primary ,认主题和节点颜色如果。
	 * @property {Number} size = [] 默认：32 ,默认的节点大小，单位upx
	 * @property {String} model = [left|center|right] 默认：center ,时间轴的方向。
	 * @property {Array} list = [] 默认：[] ,数据。{
						title:'',
						content:'我是内容我是内容我是内容',
						time:"2020年7月",
						color:"blue",
						icon:'icon-position-fill',
						iconSize:36,
						borderColor:'blue'
					},
	 */
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	export default {
		components:{tmIcons},
	name: 'tm-timeline',
	props:{
		list:{
			type:Array,
			default:()=>{
				return [];
			}
		},
		// 是否反转内容
		reverse:{
			type:Boolean,
			default:false
		},
		// 默认线的颜色，
		borderColor:{
			type:String,
			default:'grey-lighten-2'
		},
		// 默认主题和节点颜色如果
		color:{
			type:String,
			default:'primary'
		},
		size:{
			type:Number,
			default:36
		},
		black:{
			type:Boolean|String,
			default:null
		},
		model:{
			type:String,
			default:'center' // left|center|right
		},
		// 跟随主题色的改变而改变。
		fllowTheme:{
			type:Boolean|String,
			default:true
		}
	},
	
	data() {
		return {
			listData:[],
		};
	},
	watch:{
		list:{
			deep:true,
			handler(){
				this.jsList = this.list;
			}
		}
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
		jsList:{
			get:function(){
				return this.listData;
			},
			set:function(val){
				if(this.reverse){
					this.listData = this.list.reverse();
				}else{
					this.listData = this.list;
				}
			}
		}
	},
	mounted() {
		this.jsList = this.list;
	},
	methods: {
		botop(d){
			return uni.upx2px(d.size+8||32)
		},
		bwi(item){
			if(!item||!item['size']){
				return uni.upx2px(this.size||24)
			}else if(item['size']){
				return uni.upx2px(item['size']||24)
			}
			return uni.upx2px(24)
		}
	}
};
</script>

<style lang="less" scoped>
.tm-timeline {
	.tm-timeline-item {
		.tm-timeline-item-left,
		.tm-timeline-item-right {
			width: 200upx;
			flex-shrink: 0;
			// transform: translateY(-34upx);	
			
		}
		
		.tm-timeline-item-content{
			display: flex;
			justify-content: center;
			align-items: flex-start;
			align-content: flex-start;	
		}
		.tm-timeline-jidian {
			
			margin: auto;
		}
		&.tm-timeline-item--leftDir{
			display: flex;
			flex-flow: row;
			&.endright{
				justify-content: flex-end;
			}
			.tm-timeline-item-left,
			.tm-timeline-item-right {
				width:auto;
				max-width: 400upx;
				
			}
			.tm-timeline-item-boder{
				height: 100%;
				width: 1px;margin: auto;
			}
			.tm-timeline-jidian {
				position: relative;
				margin: auto;
				z-index: 2;
			}
			.tm-timeline-item-content{
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;
				align-content: flex-start;	
				
			}
			
		}
	}
}
</style>
