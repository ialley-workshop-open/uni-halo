<template>
	<view @click="onclick" class="tm-card " :class="['mx-32', 'my-24', 
	black_tmeme ? 'grey-darken-5' : propsAttr.bgColor, `round-${propsAttr.round}`, `shadow-${propsAttr.bgColor}-${propsAttr.shadow}`]">
		<view :class="['pa-24']">
			<view :class="[propsAttr.img?'flex-start':'']">
				<view v-if="propsAttr.img" class="flex-shrink mr-24">
					<slot name="img" :text="{data:propsAttr.img}">
						<tm-images :round="propsAttr.imgRound" :width="90" :src="propsAttr.img"></tm-images>
					</slot>
				</view>
				<view class="fulled">
					<view class="subtitle_wk flex-between ">
						<view v-if="propsAttr.subTitle" class="subtitle text-size-s text-grey">
							<slot name="subTitle" :text="{data:propsAttr.subTitle}">{{ propsAttr.subTitle }}</slot>
						</view>
						<view class="px-12"></view>
						<view v-if="propsAttr.statusText" class="substatus flex-shrink text px-12 py-6 text-size-xs round-6 text-weight-b" :class="[black_tmeme ? 'bk' : '', propsAttr.statusColor]">
							<slot name="statusText" :text="{data:propsAttr.statusText}">{{ propsAttr.statusText }}</slot>
						</view>
					</view>
					<view v-if="propsAttr.title" :class="[`text-size-${titleSize}`]" class=" my-16 text-weight-b text-overflow-2">
						<slot name="title" :text="{data:propsAttr.title}">{{ propsAttr.title }}</slot>
					</view>
					<view v-if="propsAttr.subText" class="text-size-s text-grey text-overflow-2">
						<slot name="subText" :text="{data:propsAttr.subText}">{{ propsAttr.subText }}</slot>
					</view>
				</view>
			</view>
			<view class=" py-24 flex-center" v-if="titleBorder">
				<view class="border-t-1 fulled" :class="[black_tmeme?'bk':'']"></view>
			</view>
			<view class="text-size-n " :class="[black_tmeme ? 'bk' : '']">
				<slot name="content" :text="{data:propsAttr.content}">
					<view selectable >{{ propsAttr.content }}</view>
				</slot>
			</view>
			<view class=" py-24 flex-center" v-if="propsAttr.actionBorder">
				<view class="border-t-1 fulled" :class="[black_tmeme?'bk':'']"></view>
			</view>
			<view class="flex-end" :class="[black_tmeme ? 'bk' : '']" v-if="btnColorToarrays.length > 0">
				<slot name="action" :action="{ btn: action, color: btnColorToarrays }">
					<view v-for="(item, index) in action" @click.stop="actionClick(item, index)" :key="index" class="d-inline-block">
						<tm-button   :round="propsAttr.actionRound" :theme="btnColorToarrays[index]" :key="index" :black="black_tmeme" size="m">
							{{ item }}
						</tm-button>
					</view>
				</slot>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 卡片
	 * @param {String}  title-size= [xxs|s|n|g|lg|xl] 默认：g，对应的文本尺寸:xxs,xs,s,n,g,lg,xl
	 * @param {String}  img= [] 默认：''，头像图片地址。
	 * @param {Number}  imgRound= [] 默认：4，头像圆角
	 * @param {Number}  round= [] 默认：4，卡片圆角
	 * @param {Number}  shadow= [] 默认：4，卡片投影
	 * @param {Array|String}  btnColor= [] 默认：white，按钮颜色，可以是string,或者数组['white,'red']按钮组就会依次使用该颜色，如只是一颜色，第一个使用，后面的使用默认的white.
	 * @param {Array}  action= [] 默认：[]，操作按钮组
	 * @param {Number}  action-round= [] 默认：2，操作按钮组的圆角，
	 * @param {Boolean}  action-border= [] 默认：true，是否显示操作按钮上方的边线
	 * @param {String}  status-color= [] 默认：black，卡片右上角状态文件的主题色
	 * @param {String}  status-text= [] 默认：''，卡片右上角状态文本
	 * @param {String}  sub-title= [] 默认：''，卡片左上角的卡片名称
	 * @param {String}  title= [] 默认：''，标题
	 * @param {String}  sub-text= [] 默认：''，副标题
	 * @param {Boolean}  title-border= [] 默认：true，标题下方的边线。
	 * @param {String}  content= [] 默认：''，卡片的正方内容
	 * @param {Boolean}  black= [] 默认：null，是否暗黑
	 * @param {String}  bg-color= [] 默认：'white'，卡片的背景色
	 * @param {Function} click 点击卡片触发的事件
	 * @param {Function} action-click 点击按钮组触发的事件
	 * @example <tm-card title="简单示例" content="内容" :action="['操作按钮']"></tm-card>
	 */
	
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
export default {
	name: 'tm-card',
	components: { tmButton },
	props: {
		img:{
			type:String,
			default:''
		},
		imgRound:{
			type:Number | String,
			default:4
		},
		//卡片的圆角
		round: {
			type: Number | String,
			default: 4
		},
		shadow: {
			type: Number | String,
			default: 4
		},
		btnColor: {
			type: Array | String,
			default: () => 'white'
		},
		
		action: {
			type: Array,
			default: () => []
		},
		actionRound: {
			type: Number | String,
			default: 2
		},
		
		actionBorder:{
			type:Boolean|String,
			default:true
		},
		statusColor: {
			type: String,
			default: 'black'
		},
		statusText: {
			type: String,
			default: ''
		},
		//卡片名称
		subTitle: {
			type: String,
			default: ''
		},
		//标题
		title: {
			type: String,
			default: ''
		},
		titleSize: {
			type: String,
			default: 'g'
		},
		titleBorder:{
			type:Boolean|String,
			default:true
		},
		//标题介绍
		subText: {
			type: String,
			default: ''
		},
		content: {
			type: String,
			default: ''
		},
		black: {
			type: Boolean | String,
			default: null
		},
	
		bgColor: {
			type: String,
			default: 'white'
		}
	},
	computed: {
		propsAttr:function(){
			return {
				bgColor:this.bgColor,
				statusColor:this.statusColor,
				title:this.title,
				subTitle:this.subTitle,
				content:this.content,
				actionRound:this.actionRound,
				actionBorder:this.actionBorder,
				round:this.round,
				shadow:this.shadow,
				img:this.img,
			}
		},
		black_tmeme: function() {
			if (this.black !== null) return this.black;
			return this.$tm.vx.state().tmVuetify.black;
		},
		btnColorToarrays: function() {
			let al = this.action.length;
			if (this.action.length == 0 || !this.action) return [];
			let colors = this.btnColor;
			colors = Array.isArray(colors) ? colors : [colors];
			for (let i = 0; i < al; i++) {
				if (!colors[i]) {
					colors.push('white');
				}
			}
			return colors;
		}
	},
	data() {
		return {};
	},
	methods:{
		actionClick(item,index){
			this.$emit('action-click',index);
		},
		onclick(e){
			this.$emit('click',e);
		}
	}
};
</script>

<style lang="scss" scoped></style>
