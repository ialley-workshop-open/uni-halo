<template>
	<view class="tm-shareSheet">
		<tm-poup :black="black_tmeme"  @change="toogle" ref="pop" v-model="showpop" height="auto" >
			<view class="tm-shareSheet-title pa-32 pb-32 relative" :class="[black_tmeme?'grey-darken-5':'white']">
				<view class="text-size-s text-align-center text-grey-lighten-1">{{title}}</view>
				<view class="tm-shareSheet-close  rounded flex-center absolute" :class="black_tmeme?'grey-darken-3':'grey-lighten-3'">
					<tm-icons @click="close" name="icon-times" size="24" :color="black_tmeme?'white':'grey'"></tm-icons>
				</view>
			</view>
			<block v-for="(item2,index2) in actions" :key="index2">
				<view class="py-32 pa-32">
					<scroll-view scroll-x class="tm-shareSheet-wk flex-start">
						<view @click="onclick(index,item)" v-for="(item,index) in item2" :key="index" class="tm-shareSheet-zuti  ">
							<view class="tm-shareSheet-zuti-img flex-center rounded"  :style="{
								background:black_tmeme?'#424242':item.bgcolor
							}">
								<tm-icons :black="black_tmeme" :name="item.icon" size="45" :color="black_tmeme?'white':item.color"></tm-icons>
							</view>
							<view class="tm-shareSheet-zuti-text text-size-xs my-10 text-grey">{{item.name}}</view>
						</view>
					</scroll-view>
				</view>
				<view v-if="(index2+1)%2!=0&&actions.length>1" class="my-5 mx-32" >
					<view class=" border-b-1" :class="[black_tmeme?'bk':'']"></view>
				</view>
			</block>
			
			<view class="safe--hei"></view>
		</tm-poup>
	</view>
</template>

<script>
	/**
	 * 分享面板
	 * @description 动作面板,从底部弹出的操作菜单。
	 * @property {Boolean} black = [true|false] 默认：false，暗黑模式 
	 * @property {Boolean} click-close = [true|false] 默认：true，点击图标后是否立即关闭弹层。
	 * @property {Boolean} value = [true|false] 默认：false，显示菜单，推荐使用v-model,使用value.sync达到双向绑定。
	 * @property {String} title = [] 默认：'请操作',弹出层的标题。
	 * @property {Array} actions = [] 默认：[],格式见文档，操作数组。{name:"微信",bgcolor:"#07c160",icon:"icon-weixin",color:"white"}
	 * @property {Function} change 点击项目时触发,返回：{index:项目索引,data:actions的对象数据}
	 * @property {Function} input 弹层显示和隐藏时，将会触发。
	 * @example <tm-shareSheet ></tm-shareSheet>
	 */
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	import tmPoup from "@/tm-vuetify/components/tm-poup/tm-poup.vue"
	
	export default {
		components:{tmIcons,tmPoup},
		name:"tm-shareSheet",
		model:{
			prop:'value',
			event:'input'
		},
		props:{
			value:{
				type:Boolean,
				default:false
			},
			black:{
				type:Boolean,
				default:null
			},
			clickClose:{
				type:Boolean,
				default:true
			},
			title:{
				type:String,
				default:'立即分享给好友吧'
			},
			actions:{
				type:Array,
				default:()=>{
					return [
						
						[
							{name:"微信",bgcolor:"#07c160",icon:"icon-weixin",color:"white"},
							{name:"朋友圈",bgcolor:"#04c887",icon:"icon-pengyouquan",color:"white"},
							{name:"微博",bgcolor:"#e91e38",icon:"icon-weibo",color:"white"},
							{name:"QQ",bgcolor:"#1dc0fd",icon:"icon-QQ",color:"white"},
							{name:"小程序",bgcolor:"#1893fd",icon:"icon-xiaochengxu",color:"white"},
						],
						[
							{name:"复制链接",bgcolor:"#f5f5f5",icon:"icon-connection",color:"grey-darken-1"},
							{name:"分享海报",bgcolor:"#f5f5f5",icon:"icon-picture",color:"grey-darken-1"},
							{name:"二维码",bgcolor:"#f5f5f5",icon:"icon-qrcode",color:"grey-darken-1"},
							{name:"分享",bgcolor:"#f5f5f5",icon:"icon-share1",color:"grey-darken-1"}
						]
					]
				}
			}
		},
		watch:{
			value:function(){
				this.showpop = this.value;
			}
		},
		data() {
			return {
				showpop:false,
			};
		},
		
		computed: {

			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			}
		},
		mounted() {
			this.showpop = this.value;
		},
		methods: {
			close(){
				this.$refs.pop.close();
			},
			toogle(e){
				let t = this;
				if(e){
					this.$nextTick(function(){
						if(this.dataValue != this.defaultValue){
							this.dataValue = this.defaultValue;
						}
					})
				}
				this.$emit('input',e);
				this.$emit('update:value',e);
			},
			onclick(index,item){
				this.$emit('change',{index:index,data:item})
				if(this.clickClose === true){
					this.$refs.pop.close();
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
.tm-shareSheet-title {
		.tm-shareSheet-close {
			top: 32upx;
			right: 32upx;
			width: 50upx;
			height: 50upx;
		}
	}
.tm-shareSheet-wk{
	white-space: nowrap;
	width: 100%;
	.tm-shareSheet-zuti{
		width: 140upx;
		flex-shrink: 0;
		text-align: center;
		display: inline-block;
		.tm-shareSheet-zuti-img{
			margin: auto;
			width: 100upx;
			height: 100upx;
		}
	}
}

</style>
