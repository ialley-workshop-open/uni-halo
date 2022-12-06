<template>
	<view class="tm-search fulled py-12"
	:class="[
		black_tmeme?'grey-darken-5':bgColor,
		`shadow-${shadow}`
	]"
	>
		<view @click="$emit('click')" class="tm-search-body flex-around">
			<view v-if="showLeft" class="flex-shrink  pl-32 flex-center">
				<slot name="left">
					<tm-icons @click="$emit('cancel')" :black="black_tmeme" :color="color_tmeme" dense :name="leftIcon"></tm-icons>
				</slot>
			</view>
			<view class="flex-between  fulled py-10  mx-32" :class="[
				black_tmeme?' grey-darken-5':'grey-lighten-4',
				`round-${round}`
			]">
				<view v-if="prefixText" class="px-16 flex-shrink flex-center text-size-n text-grey">
					{{prefixText}}
				</view>
				<view v-if="prefixIcon" class="pl-16 flex-shrink flex-center">
					<tm-icons :black="black_tmeme" :color="insertColor_thmeme" dense :name="prefixIcon"></tm-icons>
				</view>
				<input @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" confirm-type="search" type="search" @confirm="confirm" v-model="valData" :disabled="disabled" :placeholder="placeholder" class="flat fulled text-size-n pl-16 py-4 tm-search-body-searc" :class="[`text-align-${align}`]" />
				<view v-if="clear&&valData.length>0" class="px-16 flex-shrink flex-center">
					<tm-icons @click="valData='';$emit('clear',valData)" :size="24" :black="black_tmeme" :color="insertColor_thmeme" dense name="icon-times"></tm-icons>
				</view>
				<view v-if="suffixIcon" class="px-16 flex-shrink flex-center">
					<slot name="suffixIcon">
						<tm-icons @click="confirm" :black="black_tmeme" :color="insertColor_thmeme" dense :name="suffixIcon"></tm-icons>
					</slot>
				</view>
				
			</view>
			<view @click="confirm" v-if="showRight" class="flex-shrink mr-32 text-size-n" :class="[
				`text-${color_tmeme}`
			]">
				<slot name="right">
					<text class="text-size-n">{{confirmText}}</text>
				</slot>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 搜索框
	 * @property {String} value = [] 默认：'',建议valu.sync或者v-model双向绑定输入的词。
	 * @property {Boolean} disabled = [true|false] 默认：false,是否禁用。
	 * @property {String} left-icon = [] 默认：icon-angle-left,左边图标名称。
	 * @property {String} prefix-text = [] 默认：'',输入框内前缀文字。
	 * @property {String} prefix-icon = [] 默认：'icon-search',输入框内前缀图标。
	 * @property {String} insert-color = [] 默认：'primary',输入框内图标的主题色。
	 * @property {String} suffix-icon = [] 默认：'',输入框内后缀图标。
	 * @property {Boolean} show-left = [true|false] 默认：false,是否显示左边部分
	 * @property {String} confirm-text = [] 默认：搜索, 右边文字
	 * @property {Boolean} show-right = [] 默认：true ,是否显示右边
	 * @property {String} color = [] 默认：primary , 外部图标文字的主题色。
	 * @property {String} bg-color = [] 默认：white , 搜索框的背景。
	 * @property {Boolean} black = [true|false] 默认：null , 是否暗黑模式
	 * @property {Boolean} clear = [true|false] 默认：false , 是否显示清除图标
	 * @property {Number} round = [] 默认：2 , 输入框内圆角。
	 * @property {Number} shadow = [] 默认：2 , 搜索框的投影
	 * @property {String} placeholder = [] 默认：'请输入关键词' , 输入框的点位符
	 * @property {String} align = [left|right|center] 默认：'left' , 输入框输入对齐的方式。
	 * @property {Function} cancel 点击左边图标产生的事件。
	 * @property {Function} clear 点击清除图标时触发相关事件。
	 * @property {Function} confirm 输入法键盘上点击确认，输入框后缀图标，右边部分点击时产生的事件，含当前输入的内容。
	 * @property {Function} click 点击整体组件的事件。
	 */

	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	export default {
		components:{tmIcons},
		name:"tm-search",
		model:{
			prop:'value',
			event:'input'
		},
		props:{
			clear:{
				type:Boolean,
				default:false
			},
			value:{
				type:String,
				default:''
			},
			disabled:{
				type:Boolean|String,
				default:false
			},
			leftIcon:{
				type:String,
				default:'icon-angle-left'
			},
			// 输入框内的前缀文字
			prefixText:{
				type:String,
				default:''
			},
			//输入框内的前缀图标。
			prefixIcon:{
				type:String,
				default:'icon-search'
			},
			// 输入框内部主题
			insertColor:{
				type:String,
				default:'primary'
			},
			//输入框内的后缀图标。
			suffixIcon:{
				type:String,
				default:''
			},
			showLeft:{
				type:Boolean,
				default:false
			},
			confirmText:{
				type:String,
				default:'搜索'
			},
			showRight:{
				type:Boolean,
				default:true
			},
			color:{
				type:String,
				default:'primary'
			},
			
			bgColor:{
				type:String,
				default:'white'
			},
			black:{
				type:Boolean|String,
				default:null
			},
			round:{
				type:Number,
				default:2
			},
			shadow:{
				type:Number,
				default:4
			},
			placeholder:{
				type:String,
				default:"请输入关键词"
			},
			align:{
				type:String,
				default:'left' //left|right|center
			},
			// 跟随主题色的改变而改变。
			fllowTheme:{
				type:Boolean|String,
				default:true
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
			insertColor_thmeme:function(){
				if(this.$tm.vx.state().tmVuetify.color!==null&&this.$tm.vx.state().tmVuetify.color && this.fllowTheme){
					return this.$tm.vx.state().tmVuetify.color;
				}
				return this.insertColor;
			},
			valData:{
				get:function(){
					return this.value;
				},
				set:function(val){
					this.$emit('input',val)
				}
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			confirm(e) {
				this.$emit('confirm',this.value)
			}
		},
	}
</script>

<style lang="scss" scoped>

.tm-search-body-searc{
	 -webkit-appearance: none !important; 
}

</style>
