<template>
	<view class="tm-steps" v-if="listLen>0">

		<block v-for="(item,index) in list" :key="index">

			<view class="tm-steps-item" :style="{
				width:(100/listLen)+'%'
			}">

				<view class="tm-steps-item-text flex-center flex-col ">
					<view :style="{
						 width:sizePx + 'px',
						 height:sizePx + 'px',
						 lineHeight:0
					 }" :class="[
						 
						 index < value ? color_tmeme:'grey-lighten-4',
						 black_tmeme?'bk':'',
						  index < value?`shadow-${color_tmeme}-3`:''
					 ]" @click.stop="itemclick(index)" class="tm-steps-item-text-icon rounded text-size-s flex-center  ">
						<block v-if="model=='number'">
							<slot name="number"
								:data="{icon:icon,activeIcon:activeIcon,index:index+1,active:index < value?true:false}">
								<text :class="index < value ? '':'text-'+fontColor">{{index+1}}</text>
							</slot>
						</block>
						<block v-if="model=='icon'">
							<slot name="icon"
								:data="{icon:icon,activeIcon:activeIcon,index:index+1,active:index < value?true:false}">
								<tm-icons style="line-height: 0;" :color="fontColor" size="22" v-if="index >= value" :name="icon"></tm-icons>
								<tm-icons style="line-height: 0;" color="white" size="22" v-if="index < value" :name="activeIcon"></tm-icons>
							</slot>
						</block>
					</view>
					<view :class="[
						index < value ? `text-${activeFontColor_theme}`:`text-${fontColor}`,
					]" class="tm-steps-item-text-icon-label text-size-s text-align-center px-10 py-16">
						<slot name="default" :data="item">
							{{item[rangeKey]?item[rangeKey]:item}}
						</slot>
					</view>
				</view>

				<view :style="{
					width:` calc(100% - ${sizePx}px)`,
					height:sizePx+'px',
					top:`0`,
					left: `calc(50% + ${sizePx/2}px)`,
				 }" v-if="index!==listLen-1" class="tm-steps-item-driver flex-center">
					<!-- <tm-icons color="white" size="22"  name="icon-angle-right"></tm-icons> -->
					<view class="fulled flex-center"
					:style="{borderTopStyle:lineStyle,borderTopWidth:lineWidth+'rpx',height:'1px'}"
						:class="[index < value ? `border-${lineColor_theme}-t-1`:black_tmeme?'border-grey-darken-4-t-1':'border-grey-lighten-4-t-1']">
							<view style="line-height: 0;">
								<tm-icons v-if="lineInIcon" style="line-height: 0;" dense :color="index < value ? color_tmeme:'grey-lighten-4'" :black="black_tmeme" size="22"  :name="lineInIcon"></tm-icons>
							</view>
					</view>
				</view>
			</view>


		</block>
	</view>
</template>

<script>
	/**
	 * 步骤条
	 * @description 只能搭配tm-stepsItem组件使用。内部需要放入：tm-stepsItem组件。
	 * @property {Number} value = [] 默认：1，当前第几步同步需要valu.snyc 推荐使用v-model.
	 * @property {Boolean} black = [true|false] 默认：false，暗黑模式。
	 * @property {String} model = [number|icon] 默认：number，两种模式，number:数字，icon:图标模式。
	 * @property {String} color = [] 默认：primary，主题色。
	 * @property {String} range-key = [] 默认：text，数据为对象数组时，需要提供对应的文字key。
	 * @property {String} size = [] 默认：42，节点大小。
	 * @property {String} line-color = [] 默认：primary，激活时的线条主题色。
	 * @property {String} font-color = [] 默认：grey，文字主题色。
	 * @property {String} active-font-color = [] 默认：primary，激活后的文字主题色。
	 * @property {String} active-icon = [] 默认：icon-check，激活后的图标。
	 * @property {String} icon = [] 默认：icon-clock-fill，未激活的图标。
	 * @property {String} lineInIcon = [] 默认：''，节点间线中间内部的图标，填写后显示，不填写不显示。
	 * @property {String} lineStyle = [] 默认：solid，标准的css边线类型
	 * @property {String} lineWidth = [] 默认：1，连接线的厚度，单位rpx
	 * @property {Function} input 等同v-model参数
	 * @property {Function} change 步骤变化时触发。等同input,v-model参数
	 * @property {Function} click 点击步骤节点时触发，返回当前步骤位置。
	 * @example <tm-steps v-model="star"><block v-for="(item,index) in 4" :key="index"><tm-stepsItem :fail="index+1==3" model="icon" :step="index+1"></tm-stepsItem><tm-divider :color="index > star-1 ? '#eeeeee':'#1976d2'" v-if="index!==3" ></tm-divider></block></tm-steps>
	 */
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	export default {
		components: {
			tmIcons
		},
		name: "tm-steps",
		model: {
			prop: "value",
			event: "input"
		},
		props: {
			value: {
				type: Number,
				default: 1
			},
			list: {
				type: Array,
				default: () => {
					return []
				}
			},
			rangeKey: {
				type: String,
				default: 'text'
			},
			// 主题色。
			color: {
				type: String,
				default: 'primary'
			},
			// 激活时的颜色值，16进制。
			lineColor: {
				type: String,
				default: 'primary'
			},
			lineStyle:{
				type:String,
				default:'solid',//solid,dashed
			},
			lineWidth:{
				type:String|Number,
				default:1,
			},
			//显示线上面的图标
			lineInIcon:{
				type:String,
				default:'',
			},
			fontColor: {
				type: String,
				default: 'grey'
			},
			activeFontColor: {
				type: String,
				default: 'primary'
			},
			model: {
				type: String,
				default: 'icon'
			},
			black: {
				type: Boolean | String,
				default: null
			},
			size: {
				type: Number,
				default: 46
			},
			icon: {
				type: String,
				default: 'icon-clock-fill'
			},
			activeIcon: {
				type: String,
				default: 'icon-check'
			},
			// 跟随主题色的改变而改变。
			fllowTheme: {
				type: Boolean | String,
				default: true
			},

		},
		data() {
			return {


			};
		},
		computed: {
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			},
			color_tmeme: function() {
				if (this.$tm.vx.state().tmVuetify.color !== null && this.$tm.vx.state().tmVuetify.color && this
					.fllowTheme) {
					return this.$tm.vx.state().tmVuetify.color;
				}
				return this.color;
			},
			lineColor_theme: function() {
				if (this.$tm.vx.state().tmVuetify.color !== null && this.$tm.vx.state().tmVuetify.color && this
					.fllowTheme) {
					return this.$tm.vx.state().tmVuetify.color;
				}
				return this.lineColor;
			},
			activeFontColor_theme: function() {
				if (this.$tm.vx.state().tmVuetify.color !== null && this.$tm.vx.state().tmVuetify.color && this
					.fllowTheme) {
					return this.$tm.vx.state().tmVuetify.color;
				}
				return this.activeFontColor;
			},
			listLen: function() {
				if (!Array.isArray(this.list)) return 0;
				return this.list.length;
			},
			sizePx: function() {
				return uni.upx2px(this.size);
			}
		},
		watch: {
			value: async function() {
				let bz = this.value;
				if (this.value > this.listLen || this.value < 0) {
					bz = 0
				}
				if (this.value == this.listLen - 1) {
					bz = this.listLen - 1
				}

				await this.setActive(bz);
			}
		},
		async mounted() {
			this.UpdateItem();
		},
		methods: {
			//如果需要动态插入步骤，需要调用此函数更新。
			async UpdateItem() {

				await this.setActive(this.value)
			},
			async setActive(index) {
				this.$emit("input", index)
				this.$emit("change", index)
				this.$emit("update:value", index)
			},
			itemclick(index) {
				this.$emit('click', index + 1)
			}

		},
	}
</script>

<style lang="scss" scoped>
	.tm-steps {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		// border-style: dashed;
		
		.tm-steps-item {
			position: relative;

			.tm-steps-item-text {
				.tm-steps-item-text-icon {}
			}

			.tm-steps-item-driver {
				position: absolute;

			}
		}

	}
</style>
