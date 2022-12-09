<template>
	<view class="d-block tm-input overflow"
	:class="[
		
		black_tmeme?(bgTheme?'grey-darken-5':''):bgTheme,
		flat?'':`px-${padding[0]}`,
		'round-'+ bgRound,
		`shadow-${color}-${bgShadow}`
	]"
	>
		<view 
			:class="(flat?'':`  py-${padding[1]} `)+` ${borderBottom?black_tmeme?'border-grey-darken-4-b-1 ':'border-grey-lighten-4-b-1':''}`"
			>
			<view @click="onclickInput" :class="[vertical?'tm-input-col':'flex-between ']" :style="{
				width: '100%',height: 'auto',
				alignItems:inputType=='textarea'?'flex-start':'center'
			}">
				<!-- 左边内容。 -->
				<view v-if="leftIcon||title" class="tm-input-left flex-start flex-shrink" :class="[vertical?'pb-24':'']">
					<!-- icon -->
					<view v-if="leftIcon" class="pr-16 vertical-align-middle flex-center">
						<tm-icons dense  :name="leftIcon" :color="color_tmeme"></tm-icons>
					</view>
					<!-- 标题 -->
					<view v-if="title" class="d-inline-block  "
					:style="{fontSize:title_size}"
						:class="[titleClass,black_tmeme?'bk  text-grey-lighten-3':'']">
						<text v-if="_required" class="text-red">*</text>
						<slot name="default" :title="title">
							{{title}}
						</slot>
					</view>
				</view>
				<view  class="flex-between " :class="[disabled?'opacity-6':'',]" style="width: 100%;">

					<!-- input主体 -->
					<view class="tm-input-center relative fulled" >
						<view class="flex-start   tm-input-center-wk"
							:class="['round-'+round,showIndent?'px-16':'',
							black_tmeme?(bgColor?'grey-darken-4  text-grey-lighten-3':'text-grey-lighten-3'):bgColor,
							`text-${textColor}`,isFocus&&focusShow?(black_tmeme?`border-${color_tmeme}-a-1`:`${color_tmeme} outlined `):``,
							`border-${black_tmeme?(borderColor?'grey-darken-4':''):borderColor}-a-1`,
							
							]">
							<view class="flex-shrink px-16 flex-center" v-if="prefixpIcon" style="line-height: 0;">
								<tm-icons dense  :name="prefixpIcon" :size="28" :color="(prefixpIconColor||color_tmeme)" ></tm-icons>
							</view>
							<view :style="{fontSize:font_size}" class="flex-shrink pr-24" :class="[titleClass,black_tmeme?'bk  text-grey-lighten-3':'']" v-if="prefixpText">
								{{prefixpText}}
							</view>
							
							
							<input 	always-embed v-if="inputType!='textarea'"  @confirm="$emit('confirm',$event)" @input="input"
								@keyboardheightchange="$emit('keyboardheightchange',$event)" @blur="blur"
								@focus="focusFun" :focus="focus_fs" :maxlength="maxlength" :adjust-position="adjustPosition"
								:auto-focus="autoFocus" :confirm-type="confirmType" :disabled="disabled" 
								:password="password"  :type="inputType" :value="value" class="tm-input-center-input "
								:class="['text-align-'+align,showError?'text-red':'',' py-5 ']" :placeholder="placeholder"
								:placeholder-class="black_tmeme? 'text-grey-darken-1 ':'  ' +` text-size-n ` + placeholderClass"
								 :style="{
									fontSize:font_size,
								 	height:height_rpx+'rpx'
								 }"
								/>
								<!-- uniapp的bug，当输入框禁用时，点击此处来获取新的焦点，以让键盘收起。 -->
							<view v-if="disabled" class="absolute fulled t-0 r-0" :style="{
								 	height:height_rpx+'rpx'
								 }"></view>
							
							<textarea always-embed v-if="inputType=='textarea'"  @confirm="$emit('confirm',$event)" @input="input"
								@keyboardheightchange="$emit('keyboardheightchange',$event)" @blur="blur"
								@focus="focusFun" :focus="focus_fs" :maxlength="maxlength" :adjust-position="adjustPosition"
								:auto-focus="autoFocus"  :confirm-type="confirmType" :disabled="disabled"
								:value="value"  class="tm-input-center-input " :style="{
									height:height_rpx+'rpx',
									fontSize:font_size,
								}"
								:class="[maxlength>0?'pb-46':'','text-align-'+align,showError?'text-red':'','pt-16 fulled']" :placeholder="placeholder"
								:placeholder-class="black_tmeme? 'text-grey-darken-1 ':' text-grey-lighten-1 ' +` text-size-n `+ placeholderClass" >	
							</textarea>
							<!-- 清除图标 -->
							<view v-if="clear&&valdata.length!=''" class="flex-center pl-16">
								<tm-icons @click.stop="clearVal" name="icon-times-circle-fill" :color="color_tmeme"></tm-icons>
							</view>
							
							<view v-if="suffixIcon" class="flex-center">
								<tm-icons :size="26" :name="suffixIcon" :color="(suffixIconColor||color_tmeme)"></tm-icons>
							</view>
						</view>
						<view v-if="maxlength>0&&inputType=='textarea'" 
						:style="{bottom:'16rpx',right:'16rpx'}"
						class="tm-input-center-numXz text-align-right text-size-xxs pt-12 text-grey absolute fulled">{{valueLen}}/{{maxlength}}</view>

					</view>
					<!-- 右边。 -->
					<view class="tm-input-right flex-end flex-shrink">
						<!-- 后缀文字，比如单位，等 -->
						<text v-if="suffix" class=" text-grey-darken-4 pl-10" :style="{fontSize:font_size}">{{suffix}}</text>
						<!-- 后台图标。 -->
						<view v-if="rightIcon" class="pl-10" style="line-height: 0;">
							<tm-icons dense  :name="rightIcon" color="grey-lighten-1"></tm-icons>
						</view>
						<!-- 插入的按钮等内容。 -->
						<slot name="rightBtn"></slot>
					</view>
				</view>


			</view>
			<!-- detail出错成功等信息。 -->
			<view v-if="showError" class="text-size-xs text-red pt-12">{{errorText}}</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 输入框
	 * @property {Number} maxlength = [-1] 默认：-1，最大输入字符数。
	 * @property {Boolean} black = [] 默认：false，暗黑模式。
	 * @property {Function} verify = [] 默认： (val) => {check: val.length <= 0 ? false : true,text: "必填项不能为空。"}，校验规则函数。
	 * @property {String} title-class = [] 默认： text-grey-darken-4,自定左边标题或者上标题的类。
	 * @property {Boolean} required = [] 默认： false, 是否是必填。如果必填写将会触发基础的校验，不能为空。
	 * @property {Boolean} adjust-position = [] 默认： false, 是否上推键盘。
	 * @property {Boolean} auto-focus = [] 默认： false, 自动获得焦点。
	 * @property {String} confirm-type = [done|go|next|send|search] 默认： done, 键盘右下角确认按钮文字。
	 * @property {Boolean} disabled = [] 默认： false, 禁用。
	 * @property {Boolean} focus-show = [] 默认： false, 是否显示聚焦状态。
	 * @property {Boolean} show-indent = [] 默认： false, 是滞使输入框内容两边缩进。默认是。
	 * @property {Boolean} password = [] 默认： false, 密码模式
	 * @property {String} input-type = [digit|text|number|password|idcard|textarea] 默认： text, 输入模式 
	 * @property {String} value = [] 默认： "", 输入内容，同v-model
	 * @property {String} right-icon = [] 默认： "", 后缀图标
	 * @property {String} left-icon = [] 默认： "", 外层前缀图标
	 * @property {String} prefixp-icon = [] 默认： "", 输入框内部前缀图标
	 * @property {String} prefixp-icon-color = [] 默认： "", 默认空，使用主题color颜色
	 * @property {String} suffix = [] 默认： "", 后缀文字
	 * @property {String} suffix-icon = [] 默认： "", 输入框内后缀图标
	 * @property {String} suffix-icon-color = [] 默认： "", 默认使用主题图标
	 * @property {String} title = [] 默认： "", 左边标题。
	 * @property {String} title-font-size = [xxs/xs/s/n/g/lg/xl] 默认： "n",同类的字号,xxs,xs,s,n,g,lg,xl
	 * @property {Number|String} font-size = [xxs/xs/s/n/g/lg/xl/任意数字] 默认： "n",同类的字号,xxs,xs,s,n,g,lg,xl，也可以是数字单位rpx
	 * @property {String} align = [left|center|right] 默认： "", 输入框文字对齐方式。left,center,right
	 * @property {Boolean} clear = [false|true] 默认： false, 显示清除图标。
	 * @property {String} color = [] 默认： primary, 主题色名称
	 * @property {String} bg-color = [grey-lighten-5|white] 默认： grey-lighten-5, 输入框背景色。
	 * @property {String} border-color = [] 默认： "", 输入框边框类型主题颜色名称。
	 * @property {Boolean} border-bottom = [false|true] 默认： true, 是否显示下划线
	 * @property {String} text-color = [black|primary] 默认： black, 输入框文字颜色。
	 * @property {String} placeholder = [] 默认： 请输入, 占位文字
	 * @property {Boolean} vertical = [false|true] 默认： false, 是否上下排列
	 * @property {Number} round = [] 默认： 2, 输入框圆角。
	 * @property {Boolean} showIndent = [] 默认： true, 是否输入框内部两边缩进
	 * @property {Number} bg-round = [] 默认： 0, 整体框圆角。
	 * @property {Number} bg-shadow = [] 默认： 0, 整体框投影。
	 * @property {String} bg-theme = [] 默认：white, 整体框背景
	 * @property {Boolean} flat = [] 默认： false, 是否去除所有边框
	 * @property {Number|String} height = [] 默认： 68, 
	 * @property {String} name = [] 默认：''，提交表单时的的字段名称标识
	 * @property {String} prefixp-text = [] 默认：''，输入框内前缀文字
	 * @property {String} placeholder-class = [] 默认：''，点位符的自定义类。
	 * @property {Array} padding = [] 默认：[32,12]，左右，上下内间距。
	 * @property {Function} click 点击输入框时触发发的函数。
	 * @property {Function} clear 清空时触发携带相关数据
	 * @property {Function} input 输入时触发携带相关数据
	 * @example <tm-input ></tm-input>
	 * 
	 */
	import tmSheet from "@/tm-vuetify/components/tm-sheet/tm-sheet.vue"
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	export default {
		components:{tmSheet,tmIcons},
		name:"tm-input",
		props: {
			//提交表单时的的字段名称
			name:{
				type:String,
				default:''
			},
			prefixpText:{
				type:String,
				default:''
			},
			flat: {
				type: Boolean,
				default: false
			},
			//是否输入框内部两边缩进。默认是
			showIndent:{
				type:Boolean,
				default:true
			},
			maxlength: {
				type: Number,
				default: -1
			},
			black: {
				type:Boolean|String,
				default:null
			},
			//是否显示聚焦状态
			focusShow: {
				type:Boolean|String,
				default:false
			},
			titleFontSize:{
				type:String,
				default:'n',//同类的字号,xxs,xs,s,n,g,lg,xl
			},
			height:{
				type:Number|String,
				default:68
			},
			// 校验规则函数。
			verify: {
				type: Function,
				default: ()=>{
					return (val) => {
						return {
							check: val?.length <= 0 ? false : true,
							text: "必填项不能为空。"
						};
					}
				}
			},
			titleClass: {
				type: String,
				default: 'text-grey-darken-4'
			},
			// 是否是必填。如果必填写将会触发基础的校验，不能为空。
			required: Boolean,
			adjustPosition: Boolean,
			autoFocus: Boolean,
			confirmType: String,
			disabled: Boolean,
			password: Boolean,
			inputType: {
				type: String,
				default: 'text'
			},
			value: {
				type: String|Number,
				default: ''
			},
			// 右边外层后缀图标。
			rightIcon: {
				type: String,
				default: ''
			},
			// 输入框内部前缀图标。
			prefixpIcon: {
				type: String,
				default: ''
			},
			prefixpIconColor: {
				type: String,
				default: ''
			},
			// 左边外层图标。
			leftIcon: {
				type: String,
				default: ''
			},
			// 后缀文字
			suffix: {
				type: String,
				default: ''
			},
			// 输入框后缀图标
			suffixIcon: {
				type: String,
				default: ''
			},
			suffixIconColor:{
				type: String,
				default: ''
			},
			// 左边标题。
			title: {
				type: String,
				default: ''
			},
			fontSize:{
				type:Number|String,
				default:'n'
			},
			// 输入框文字对齐方式。left,center,right
			align: {
				type: String,
				default: 'left'
			},
			// 显示清除图标。
			clear: Boolean,
			// 主题色名称。
			color: {
				type: String,
				default: 'primary'
			},
			//输入框背景色。grey-lighten-5
			bgColor: {
				type: String,
				default: ''
			},
			// 输入框边框类型主题颜色名称。
			borderColor: {
				type: String,
				default: ''
			},
			// 是否显示下划线
			borderBottom: {
				type: Boolean,
				default: true
			},
			// text输入框文字颜色。
			textColor: {
				type: String,
				default: 'black'
			},
			placeholder: {
				type: String,
				default: "请输入"
			},
			placeholderClass:{
				type:String,
				default:'text-grey-lighten-1'
			},
			// 是否上下排列输入框。
			vertical: Boolean,
			round:{
				type:Number|String,
				default:2
			},
			bgRound:{
				type:Number|String,
				default:0
			},
			bgShadow:{
				type:Number|String,
				default:0
			},
			bgTheme:{
				type:String,
				default:'white'
			},
			//获取焦点。
			focus:{
				type:Boolean,
				default:false
			},
			padding:{
				type:Array,
				default:()=>{
					return [32,12];
				}
			},
			// 跟随主题色的改变而改变。
			fllowTheme:{
				type:Boolean|String,
				default:true
			}
		},
		data() {
			return {
				showError: false,
				errorText: "请正确填写",
				FOCUS_Auto:false,
				isFocus:false,
			};
		},
		computed: {
			_required(){
				return this.required
			},
			height_rpx:function(){
				return this.height;
			},
			font_size:function () {
				
				let font = {
					'xxs':'20rpx',
					'xs':'22rpx',
					's':'24rpx',
					'm':'26rpx',
					'n':'28rpx',
					'g':'32rpx',
					'lg':'36rpx',
					'xl':'40rpx'
				}
				if(typeof this.fontSize=='string') return font[this.fontSize];
				return this.fontSize+'rpx';
			},
			title_size:function () {
				let font = {
					'xxs':'20rpx',
					'xs':'22rpx',
					's':'24rpx',
					'm':'26rpx',
					'n':'28rpx',
					'g':'32rpx',
					'lg':'36rpx',
					'xl':'40rpx'
				}
				if(typeof this.titleFontSize=='string') return font[this.titleFontSize];
				return this.titleFontSize+'rpx';
			},
			focus_fs:{
				get:function(){
					return this.FOCUS_Auto;
				},
				set:function(val){
					this.FOCUS_Auto = val;
				}
			},
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
			valueLen:function(){
				// 为了兼容ios不能使用this.valdata.length.
				let p = String(this.valdata);
				return p?.split('').length||0 ;
			},
			valdata:{
				get:function(){
					return this.value;
				},
				set:function(val){
					this.$emit('input', val)
					this.$emit('update:value', val)
					if (this._required) {
						this.$nextTick(function(){
							this.verifyInput();
						})
					}
				}
			}
		},
		mounten(){
			this.FOCUS_Auto = this.focus;
		},
		methods: {
			onclickInput(e){
				this.$emit('click',e)
			},
			input(e) {
				this.valdata = e.target.value;
			},
			// 校验是否通过。
			verifyInput() {
				
				let verify = this.verify.bind(this, this.valdata||'');
				verify = verify.call(this,this.valdata||'')
				if(typeof verify ==='function'){
					verify = verify.call(this,this.valdata||'')
				}
				
				if (typeof verify !== 'object') verify = {};
				this.showError = !(verify.check??true);
				this.errorText = verify.text??"";
				return verify.check??true;
			},
			//清除校验显示 的内容。
			clearVerify() {
				this.showError = false;
				this.errorText = "";
			},
			blur(e) {
				this.isFocus=false;
				this.$emit('blur', e)
			},
			focusFun(e){
				this.isFocus=true;
				this.$emit('focus',e)
			},
			clearVal(e){
				this.valdata ="";
				this.$emit('clear', this.valdata)
			}
		},

	}
</script>

<style lang="scss" scoped>
	.tm-input {

		.tm-input-center {
			width: 100%;
			.tm-input-center-wk{
				transition: all 0.2s;
			}
			.tm-input-center-input {
				border: none;
				background: none;
				box-shadow: 0;
				width: 100%;
				
			}
		}

		.tm-input-left {
			flex-shrink: 0;
			height: 100%;
			
			min-width: 80rpx;
			padding-right: 24rpx;
		}

		.tm-input-col {
			.tm-input-left {
				max-width: inherit;
				padding-right: 0;
			}

			.tm-input-center {

				.tm-input-center-input {

					height: 76upx;

				}
			}
		}

		.tm-input-right {
			height: 100%;
			// width: 300upx;
		}
	}
</style>
