<template>
	<view class="tm-password ">
		
		<view @click="show=!show" class="flex-center flex-between">
			<view class="tm-password-item flex-center  "
			 :class="[
				 width>0?'':'mx-12',
				 `round-${round}`,
				 `shadow-${color_tmeme}-${shadow}`,
				 model==='line'?black_tmeme?(strVal.length==index?' grey-darken-3 ':'border-grey-a-1 grey-darken-3 '):`border-${color_tmeme}-b-3`:'',
				 model==='box'?(black_tmeme?(strVal.length==index?'grey-darken-3 ':'border-grey-a-1 grey-darken-3 '):(strVal.length==index?'':`border-${color_tmeme}-a-1 `)):'',
				 model==='fill'?black_tmeme?'grey-darken-3 ':bgColor:'',
				 
			 ]"
			v-for="(item,index) in strLength" 
			:key="index"
			:style="{
				width:width>0?'auto':(100/strLength)+'%',
				height:height+'rpx'
			}"
			>
				<view
				 :style="{width:width>0?width+'rpx':'atuo'}"
				 :class="[
					`round-${round}`,
					strVal.length==index?'aniOn '+(model!=='line'&&model!=='box'?`border-${color_tmeme}-a-2 shadow-${color_tmeme}-6`:''):'',
					strVal.length==index?(model=='box'?`border-${color_tmeme}-a-2  shadow-${color_tmeme}-6`:''):'',
					strVal.length==index?(model=='line'&&black_tmeme?`border-${color_tmeme}-a-2  shadow-${color_tmeme}-6`:''):'',
				]"  class=" fulled fulled-height flex-center">
					<text v-if="strVal[index]&&showVal"
					class="text-weight-b text-size-lg"
					:class="[
						
						black_tmeme?'text-white':`text-${textColor_tmeme}`
					]"
					>
						{{strVal[index]?strVal[index]:""}}
					</text>
					<view
					v-if="(strVal[index]&&!showVal)||(!strVal[index]&&showVal)"
					class="tm-password-item-middle  "
					:class="[
						noval==='mline'?'mline round-5  ':'',
						noval==='round'?'mround rounded':'',
						'tm-password-item-middle-w',
						textColor_tmeme
					]"
					></view>
				</view>
			</view>
		</view>
		<tm-keyborad @confirm="$emit('confirm',strVal)" :ok-color="color_tmeme" :model="keyboradModel" :black="black_tmeme" v-model="strVal" :decimal="false" :show.sync="show"></tm-keyborad>
	</view>
</template>

<script>
	/**
	 * ???????????????????????????
	 * @property {String|Number} value = [] ?????????'',??????????????????????????????v-model,??????value.sync
	 * @property {String|Number} round = [] ?????????4,??????
	 * @property {String|Number} width = [] ?????????0,????????????????????????????????????????????????
	 * @property {String|Number} height = [] ?????????100,????????????
	 * @property {String|Number} shadow = [] ?????????0,??????
	 * @property {Number} code-length = [] ?????????4,????????????
	 * @property {String} model = [line|box|fill] ?????????fill,??????????????????line|box|fill
	 * @property {String} noval = [mline|round] ?????????round,????????????????????????????????????mline|round
	 * @property {Boolean} show-val = [] ?????????false,????????????/??????????????????
	 * @property {Boolean} black = [] ?????????false,????????????
	 * @property {String} color = [] ?????????primary,?????????
	 * @property {String} bg-color = [] ?????????grey-lighten-4,?????????????????????
	 * @property {String} text-color = [] ?????????primary,???????????????
	 * @property {String} keyborad-model = [number|password] ?????????number,????????????:number|password
	 * @property {Function} input ????????????????????????
	 * @property {Function} confirm ???????????????????????????????????????
	 * @example <tm-password v-model="num"></tm-password>
	 */
	import tmKeyborad from "@/tm-vuetify/components/tm-keyborad/tm-keyborad.vue"
	export default {
		components:{tmKeyborad},
		name:"tm-password",
		model:{
			prop:'value',
			event:'input'
		},
		props:{
			value:{
				type:String|Number,
				default:''
			},
			codeLength:{
				type:Number,
				default:4
			},
			round:{
				type:Number,
				default:4
			},
			shadow:{
				type:Number,
				default:0
			},
			bgColor:{
				type:String,
				default:'grey-lighten-4'
			},
			height:{
				type:Number,
				default:100
			},
			width:{
				type:Number,
				default:0
			},
			// ??????????????????
			model:{
				type:String,
				default:'fill' //???????????? line|box|fill
			},
			// ?????????????????????????????????
			noval:{
				type:String,
				default:'round' //mline|round
			},
			// ??????????????????
			showVal:{
				type:Boolean,
				default:false
			},
			black:{
				type:Boolean|String,
				default:null
			},
			color:{
				type:String,
				default:'primary' 
			},
			textColor:{
				type:String,
				default:'grey-darken-3' 
			},
			keyboradModel:{
				type:String,
				default:'number' //number|password
			},
			// ????????????????????????????????????
			fllowTheme:{
				type:Boolean|String,
				default:false
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
			textColor_tmeme:function(){
				if(this.$tm.vx.state().tmVuetify.color!==null&&this.$tm.vx.state().tmVuetify.color && this.fllowTheme){
					return this.$tm.vx.state().tmVuetify.color;
				}
				return this.textColor;
			},
			strLength:function(){
				if(this.codeLength==0||!this.codeLength) return 1;
				return this.codeLength;
			},
			strVal:{
				get:function(){
					return this.value;
				},
				set:function(val){
					let p = val;
					if(val.length > this.strLength){
						p = val.substr(0,this.strLength);;
					}
					this.$emit("input",p )
					this.$emit("update:value",p )
				}
			},
			// strCode:function(){
			// 	let val = this.strVal;
			// 	let strlen = this.strLength - this.strVal.length;
			// 	for(let i=0;i<strlen;i++){
					
			// 	}
			// }
		},
		data() {
			return {
				show:false
			};
		}
	}
</script>

<style lang="scss">
.tm-password{
	.tm-password-item{
		height: 100rpx;
		.aniOn{
			animation: easinOut 1.5s infinite linear;
		}
		.tm-password-item-middle{
			&.mline{
				width: 100%;
				height: 10upx;
			}
			&.mround{
				width: 20upx;
				height: 20upx;
			}
			&.tm-password-item-middle-w{
				width: 20upx;
			}
		}
	}
}

	@keyframes easinOut {
		0% {
			opacity: 1;
			
		}

		50% {
			opacity: 0.4;
			
		}

		100% {
			opacity: 1;
			
		}
	}
</style>
