<template>
	<view class="tm-monthCalendar " :class="[inline?'d-inline-block':'d-block']">
		<view  @click.stop.prevent="showpop=!showpop"><slot></slot></view>
		<tm-poup :black="black_tmeme"  @change="toogle" ref="pop" v-model="showpop" height="900" >
			
			<view class="tm-monthCalendar-wk">
				<view class="shadow-10">
					<view class="tm-monthCalendar-title ">
						<view class="text-size-g text-align-left pl-32 py-32" :class="[color_tmeme,black_tmeme?'bk':'']">
							<view class="text-size-g text-white" style="font-size: 42upx;">{{ selectedDay?selectedDay.year:'' }}年</view>
							<view class="text-size-lg text-white" style="font-size: 72upx;">
								{{ selectedDay?selectedDay.month:'' }}
								<text class="text-size-g pl-10">月</text>
							</view>
						</view>
						<view class="tm-monthCalendar-close"><tm-icons @click="$refs.pop.close()" name="icon-times" :color="'white'"></tm-icons></view>
					</view>
					<view class="flex-between pa-24 " style="width: 50%;margin: auto;">
						<view><tm-icons @click="preYear" name="icon-angle-left" color="grey-lighten-1"></tm-icons></view>
						<view class="text-size-g text-weight-b">{{ titleVale }}</view>
						<view><tm-icons @click="nextYear" name="icon-angle-right" color="grey-lighten-1"></tm-icons></view>
					</view>
				</view>
			</view>

			<view class="tm-monthCalendar-body">
				<view class="tm-monthCalendar-bg flex-center">
					<text class="text" :class="[black_tmeme ? ' opacity-5 ' : '']">{{ selectedDay?selectedDay.year:'' }}</text>
				</view>
				<view class="tm-monthCalendar-content">
					<view style="height: 32upx;"></view>
					<tm-row>
						<tm-col
							@click="day_danxuanclick(item, index)"
							
							align="center"
							grid="3"
							v-for="(item, index) in nowData"
							:key="index"
							:round="6"
						>
							<view class="tm-monthCalendar-col flex-center flex-col round-6" :class="[item.checked === true ? color_tmeme : '']">
								<text class="text-size-g" :class="[item.checked ? 'text-white' : '']">{{ item.text }}</text>
							</view>
						</tm-col>
					</tm-row>
				</view>

				<view class="pa-32">
					<tm-button @click="confirm" block itemeClass="round-24" :theme="btnColor ? btnColor : color_tmeme" fontSize="32">{{ btnText }}</tm-button>
				</view>
			</view>
		</tm-poup>
	</view>
</template>

<script>
/**
 * 月份日历
 * @description 日历组件，提供节气、农历公历显示，时间范围选择等功能。
 * @property {Function} confirm = [] 当选择日期确认后触发，如果未选择确认后不会触发事件。
 * @property {String} btn-text = [] 底部按钮确认的文字
 * @property {Boolean} inline = [] 默认true,是否内联或者块状block,内联有助于单行内想快速显示操作多个日历。非内联，适合独占一行。
 * @property {String} btn-color = [primary|green|orange|red|blue|bg-gradient-blue-lighten] 默认：bg-gradient-blue-lighten底部按钮确认的背景颜色仅支持主题色名称
 * @property {String} color = [primary|green|orange|red|blue] 主题默认:primary，提供是请写主题色名称
 * @property {String} default-value = [] 默认时间默认:当前时间，格式：'2021-7-21'
 * @property {Boolean|String} disabled = [true|false] 是否禁用，只读，默认false
 * @property {Boolean|String} black = [true|false] 是否开启暗黑模式
 */

	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	import tmCol from "@/tm-vuetify/components/tm-col/tm-col.vue"
	import tmRow from "@/tm-vuetify/components/tm-row/tm-row.vue"
	import tmButton from "@/tm-vuetify/components/tm-button/tm-button.vue"
	import tmPoup from "@/tm-vuetify/components/tm-poup/tm-poup.vue"
	export default {
		components:{tmIcons,tmCol,tmRow,tmButton,tmPoup},
	name: 'tm-monthCalendar',
	props: {
		black: {
			type: Boolean | String,
			default: null
		},
		disabled: {
			type: Boolean | String,
			default: false
		},
		// 默认年月2020-7
		defaultValue: {
			type: String,
			default: ''
		},

		// 底部按钮文件
		btnText: {
			type: String,
			default: '确认'
		},
		// 底部按钮背景主题色名称
		btnColor: {
			type: String,
			default: ''
		},
		// 主题色。
		color: {
			type: String,
			default: 'primary'
		},

		value: {
			type: Boolean,
			default: false
		},
		// 跟随主题色的改变而改变。
		fllowTheme:{
			type:Boolean|String,
			default:true
		},
		inline:{
			type:Boolean|String,
			default:true
		}

	},
	model: {
		prop: 'value',
		event: 'input'
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
	},
	watch: {
		value:function(val){
			this.showpop = val;
		},


		defaultValue: function(val) {
			let d = new Date().toLocaleDateString();
			
			if (this.defaultValue) {
				d = this.defaultValue.replace(/-/g,'/');
			}
			this.selectedDay = null;
			this.cal = new Date(d);
			this.titleVale = this.cal.getFullYear() + '年';
			this.getData();
		}
	},
	data() {
		return {
			showpop:false,
			nowData: [], //当前月份数据。
			cal: null, //日历对象数据。
			selectedDay: null,
			titleVale: '',
			dataValue:null,
		};
	},
	mounted() {
		let d = new Date().toLocaleDateString();
		if (this.defaultValue) {
			d = this.defaultValue.replace(/-/g,'/');
			this.dataValue = this.defaultValue;
		}
		
		this.cal = new Date(d);
		this.titleVale = this.cal.getFullYear() + '年';
		this.getData();
		this.showpop = this.value;
	},
	methods: {
		// 取当前年份的月数据。
		getData() {
			let text = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
			let year = this.cal.getFullYear();
			let month = this.cal.getMonth();
			this.nowData = [];
			for (let i = 0; i < 12; i++) {
				let checked = false;
				if (this.selectedDay) {
					checked = this.selectedDay.year == year && this.selectedDay.index == i ? true : false;
				} else {
					checked = month == i ? true : false;
				}
				let obj = {
					month: i + 1,
					text: text[i],
					index: i,
					year: year,
					checked: checked
				};
				this.nowData.push(obj);
				if (checked) {
					this.selectedDay = obj;
				}
			}
		},
		
		confirm() {
			this.$emit('confirm', this.selectedDay);
			this.$refs.pop.close();
		},
		close(){
			this.$refs.pop.close();
		},
		toogle(e){
			let t = this;
			if(e){
				this.$nextTick(function(){
					if(this.dataValue != this.defaultValue){
						this.dataValue = this.defaultValue.replace(/-/g,'/');
					}
				})
			}
			this.$emit('input',e);
			this.$emit('update:value',e);
		},


		preYear() {
			if (!this.cal) return;
			this.cal.setFullYear(this.cal.getFullYear() - 1);
			this.titleVale = this.cal.getFullYear() + '年';
			this.getData();
		},
		nextYear() {
			if (!this.cal) return;
			this.cal.setFullYear(this.cal.getFullYear() + 1);
			this.titleVale = this.cal.getFullYear() + '年';
			this.getData();
		},
		day_danxuanclick(item, index) {
			if (this.disabled) {
				this.$tm.toast('不可选择');
				return;
			}
			let d = { ...item };
			this.selectedDay = item;
			this.getData();
		}
	}
};
</script>

<style lang="scss" scoped>
.tm-monthCalendar-col {
	width: 100%;
	height: 120upx;
	// text-align: center;
	// line-height: 80upx;
	line-height: 0;
	position: relative;
	.text {
		position: absolute;
		bottom: 14upx;
	}
}
.textOn {
	color: #1976d2 !important;
}
.tm-monthCalendar-wk {
	width: 100%;
	.tm-monthCalendar-title {
		position: relative;

		.tm-monthCalendar-close {
			position: absolute;
			top: 32upx;
			right: 32upx;
		}
	}
}
.tm-monthCalendar-body {
	position: relative;

	.tm-monthCalendar-bg {
		height: 400upx;

		.text {
			font-size: 200upx;
			color: rgba(225, 225, 225, 0.4);
		}
	}

	.tm-monthCalendar-content {
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}
}
</style>
