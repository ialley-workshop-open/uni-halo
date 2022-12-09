<!-- 列表项目，类似单元格。 -->
<template>
	<view class="tm-listitem " :hover-class="url?'opacity-6':''">
		<view

			@click="click"
			:style="[
				bgColor?{background:bgColor}:''
			]"
			:class="[
				
				classStyle,
				`mx-${pz_themeCus.margin[0]} my-${pz_themeCus.margin[1]}`,
				disabled===true?(disabledColor + (black_tmeme?' bk ':'')) :(black_tmeme?'grey-darken-4 bk ':(bgColor?'':color)),
				dense?'nom':'',
				`shadow-${pz_themeCus.shadow}`,
				`round-${pz_themeCus.round}`,
				border?'border-a-1':''
			]"
		>
			<view :class="['px-' + pz_themeCus.padding[0], 'py-' + pz_themeCus.padding[1]]">
				<view class="flex-between ">
					<view class="left flex-start ">
						<view class="left-tm-content mr-24 flex-center" v-if="showLeftIcon">
							<slot name="left" :icon="{ icon: leftIcon, color: color_tmeme, fontsize: leftIconSize }">
								<tm-icons v-if="!group" :color="color_tmeme" :name="leftIcon" :size="leftIconSize"></tm-icons>
								<tm-icons v-if="group" :color="color_tmeme" :name="!showContent ? 'icon-caret-right' : 'icon-sort-down'" :size="24"></tm-icons>
							</slot>
						</view>
						<view class="tm-content  flex-col" style="width: 90%;">
							<view
							class="fulled flex-shrink"
								:class="[disabled===true?' text-grey-darken-1 ':(black_tmeme ? 'text-white' : `text-${titleColor}`)]"
								:style="{
									fontSize: fontSize + 'rpx'
								}"
							>
								<slot name="default" :title="title">{{ title }}</slot>
							</view>
							<view vif="label" class="fulled  text-size-s text-weight-xs text-overflow-1  text-grey-lighten-1" :class="[label ? (dense ? 'pt-0' : 'pt-4') : '']">
								<slot name="label" :label="label">{{ label }}</slot>
							</view>
						</view>
					</view>
					<view class="right text-grey-lighten-1 flex-end vertical-align-middle" :class="[black_tmeme ? 'bk' : '']">
						<view class="text-size-s pr-10 d-inline-block">
							<slot name="rightValue" :value="value">{{ value }}</slot>
						</view>
						<slot name="rightIcon" :icon="rightIcon">
							<tm-icons style="line-height: normal;" :color="rightIconColor" dense v-if="showRightIcon" :size="rightIconSize" :name="!showContent ? rightIcon : 'icon-angle-down'"></tm-icons>
						</slot>
					</view>
				</view>
				<view @click.stop="" class="group pt-24" v-if="showContent && group === true"><slot name="group" :show="showContent"></slot></view>
			</view>
			<view class="tm-listitem-border" :class="[pz_themeCus.borderBottom ? 'border-grey-lighten-4-b-1 ' : '',color, 'mx-' + pz_themeCus.padding[0], black_tmeme ? 'bk' : '']"></view>
		</view>
	</view>
</template>

<script>
/**
 * 列表
 * @description 配合tm-grouplist使用时，可以组合成手风琴模式。
 * @property {Boolean} black = [true|false] 默认：null，暗黑模式
 * @property {Number} round = [] 默认：4，单位upx, 外部圆角
 * @property {Array} margin = [] 默认：[0,0]，单位upx,外间距。
 * @property {Array} padding = [] 默认：[32,32]，单位upx,内间距。
 * @property {Number} shadow = [] 默认：6，单位upx,投影
 * @property {String} url = [] 默认：''，打开的链接。不空空时，将会打开链接，如果发生错误，会触发error事件。
 * @property {String} open-type = [navigate | navigateBack |reLaunch | redirect | switchTab] 默认：'navigate'，打开的链接的方式。navigate | navigateBack |reLaunch | redirect | switchTab
 * @property {String} class-style = [] 默认：''，自定义类。
 * @property {Boolean} dense = [true|false] 默认：false，去除外间距。
 * @property {Boolean} border = [true|false] 默认：false，开启边线模式。
 * @property {Boolean} border-bottom = [true|false] 默认：false，是否显示下划线。
 * @property {String} bg-color = [] 默认：""，自定义背景色。
 * @property {String} disabled-color = [] 默认：""，禁用时的背景色
 * @property {String} color = [] 默认："white"，主题色
 * @property {String|Number} left-icon-size = [] 默认："38"，左边图标 大小 。
 * @property {String|Number} right-icon-size = [] 默认："24"，右边图标 大小 。
 * @property {String|Number} left-icon = [] 默认："icon-gem"，左边图标
 * @property {Boolean} show-left-icon = [true|false] 默认：false，是否显示左边图标。
 * @property {String} left-icon-color = [] 默认："primary"，左图标 主题色。
 * @property {String} right-icon = [] 默认："icon-angle-right"，左图标
 * @property {String} right-icon-color = [] 默认："primary"，右图标颜色。
 * @property {Boolean} show-right-icon = [] 默认：false， 是否显示右边图标。
 * @property {String} value = [] 默认：""， 右边文字。
 * @property {String} title = [] 默认：""，标题。
 * @property {String} title-color = [] 默认："grey-darken-3"，标题颜色。
 * @property {String} font-size = [] 默认：32，标题文字大小。
 * @property {String} label = [] 默认：""，下方文字说明。
 * @property {Boolean} group = [true|false] 默认：false，是否开启拓展功能，点击展开内容。slot:group的内容。
 * @property {Boolean} disabled = [true|false] 默认：false，是否禁用
 * @property {Function} click 点击组件时触发
 * @property {Function} error (当url不为空时，打开出错时发出)
 * @property {Function} change (当group为true时才会触发事件，显示和隐藏扩展内容。)
 * @example <tm-listitem  title="而退役"  value="9"></tm-listitem>
 */
import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
export default {
	components:{tmIcons},
	name: 'tm-listitem',
	props: {
		
		disabled: {
			type: Boolean,
			default: false
		},
		// 是否开启嵌套内容。
		group: {
			type: Boolean,
			default: false
		},
		// 打开的链接。不空空时，将会打开链接，如果发生错误，会触发error事件。
		url: {
			type: String,
			default: ''
		},
		// 打开的链接的方式。navigate | navigateBack |reLaunch | redirect | switchTab
		openType: {
			type: String,
			default: 'navigate'
		},
		black: {
			type: String | Boolean,
			default: null
		},
		//class.
		classStyle: {
			type: String,
			default: ''
		},
		// 去除外间距。
		dense: {
			type: Boolean,
			default: false
		},
		// false
		border: {
			type: String | Boolean,
			default: false
		},
		// 是否显示下划线
		borderBottom: {
			type: Boolean,
			default: false
		},
		// 自定义背景色。
		bgColor: {
			type: String,
			default: ''
		},
		// 主题色名称。
		color: {
			type: String,
			default: 'white'
		},
		// 主题色名称。
		disabledColor: {
			type: String,
			default: 'grey-lighten-3 text'
		},
		
		round: {
			type: String | Number,
			default: 3
		},
		leftIconSize: {
			type: String | Number,
			default: '32'
		},
		leftIcon: {
			type: String,
			default: 'icon-gem'
		},
		// 是否显示左边图标。
		showLeftIcon: {
			type: Boolean | String,
			default: false
		},
		leftIconColor: {
			type: String,
			default: 'primary'
		},
		rightIcon: {
			type: String,
			default: 'icon-angle-right'
		},
		rightIconSize: {
			type: String | Number,
			default: '24'
		},
		rightIconColor: {
			type: String,
			default: 'grey-lighten-1'
		},
		// 是否显示右边图标。
		showRightIcon: {
			type: Boolean | String,
			default: true
		},
		// 右边文字。
		value: {
			type: String,
			default: ''
		},
		// 标题。
		title: {
			type: String,
			default: ''
		},
		titleColor:{
			type:String,
			default:'grey-darken-3'
		},
		// 询部的文字说明
		label: {
			type: String,
			default: ''
		},
		
		shadow: {
			type: String | Number,
			default: 2
		},
		fontSize: {
			type: String | Number,
			default: '32'
		},
		// 单位upx
		margin: {
			type: Array,
			default: () => {
				return [32, 20];
			}
		},
		padding: {
			type: Array,
			default: () => {
				return [24, 20];
			}
		},
		flat:{
			type:String|Boolean,
			default:false,
		},
		// 跟随主题色的改变而改变。
		fllowTheme:{
			type:Boolean|String,
			default:true
		}
	},
	computed: {
		pz_themeCus: {
			get: function() {
				if(this.flat===true){
					return {
						margin: [0, 0],
						padding: [0, 0],
						shadow: 0,
						round: 0,
						borderBottom: false
					};
				}
				return this.pz_theme;
			},
			set: function(val) {
				val = val || {};
				
				this.pz_theme = {...val}
			}
		},
		
		black_tmeme:function(){
			if(this.black!==null) return this.black;
			return this.$tm.vx.state().tmVuetify.black;
		},
		color_tmeme:function(){
			if(this.$tm.vx.state().tmVuetify.color!==null&&this.$tm.vx.state().tmVuetify.color && this.fllowTheme){
				return this.$tm.vx.state().tmVuetify.color;
			}
			return this.leftIconColor;
		},
		groupPublickStyle:function(){
			if(!this.GroupListStyles) return null
			return this.GroupListStyles()
		}
	},
	inject:{
		GroupListStyles:{default:null}
	},
	data() {
		return {
			pz_theme: {
				margin: [0, 0],
				padding: [0, 0],
				shadow: 0,
				round: 0,
				borderBottom: false
			},
			showContent: false
		};
	},
	created() {
		if(this.groupPublickStyle){
			this.pz_themeCus = {
				margin: this.groupPublickStyle.margin,
				padding: this.groupPublickStyle.padding,
				shadow: this.groupPublickStyle.shadow,
				round: this.groupPublickStyle.round,
				borderBottom: this.groupPublickStyle.borderBottom||this.borderBottom
			};
		}else{
			this.pz_themeCus = {
				margin: this.margin,
				padding: this.padding,
				shadow: this.shadow,
				round: this.round,
				borderBottom: this.borderBottom
			};
		}
		
		
	},
	mounted() {
		
	},
	methods: {
		click(e) {
			if(this.disabled===true) return;
			let t = this;
			
			
			
			if (this.group === true && typeof this.group === 'boolean') {
				this.showContent = !this.showContent;
				if (!this.$tm.getParentAls('tm-listitem', this.$parent)) {
					let preat = this.$tm.getParentAls('tm-grouplist', this.$parent);
					
					if(preat){
						preat.change(t._uid);
					}

				}

				this.$emit('change', this.showContent);
				return;
			}
			if (!this.url) {
				this.$emit('click', e);
				
				return ;
			}
			if (this.openType === 'switchTab') {
				uni.switchTab({
					url: this.url,
					fail: er => {
						t.$emit('error', er);
					}
				});
			}else{
				uni.navigateTo({
					url:this.url
				})
			}
		},
		setConfig(val){
			
			this.$nextTick(function(){
				this.pz_themeCus = {...this.pz_themeCus,...val};
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.tm-listitem {
	position: relative;
	.tm-listitem-border {
	}
	.nom{
		margin: 0 !important;
		padding: 0 !important;
	}
}
.left {
	max-width: 400upx;
	width: 400upx;

	.left-tm-content {
		max-width: 100upx;
		line-height: 0;
	}

	.tm-content {
		max-width: 290upx;
		justify-content: center;
		align-content: center;
		display: flex;
	}
}
.right{
	// #ifdef MP
	line-height: 0;
	// #endif
}
.group {
	transition: all 0.6s;
}
</style>
