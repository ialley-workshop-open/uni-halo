<template>
	<view @click="onclick" class=" tm-checkbox " :class="[dense?'':'pa-20',inline?'d-inline-block ':'fulled']">
		<view class="flex-start fulled">
			
			<slot name="default" :checkData="{label:label,checked:changValue}" :on="onclick">
				<view :style="{width: sizes.wk,height: sizes.wk}" class="tm-checkbox-boey  relative d-inline-block"
				:class="[black?'bk':'','flex-shrink mr-10 ',
				changValue?'ani':'',
				changValue?color_tmeme+' border-'+(borderColor||color_tmeme)+'-a-1':'border-'+(borderColor||color_tmeme)+'-a-1',
				disabled?'grey-lighten-2 border-grey-lighten-1-a-1':'',
				round==='rounded'?'rounded':'round-'+round]"
				>
					<view :class="[changValue?'ani_toMaxToMin_on':'']" class="absolute flex-center" style="width: 100%;height: 100%;">
						<tm-icons dense v-show="model === 'normal'" :size="sizes.gou" :color="disabled?'opacity-5 white':'white'"  :name="changValue?icon:' '"></tm-icons>
						<view v-show="model === 'round'&&changValue" class=" rounded d-inline-block" 
						:class="[disabled?'opacity-5 white':'white']" 
						:style="{width: sizes.yuan,height: sizes.yuan}"></view>
					</view>
				</view>
			</slot>
			
			<view v-if="label" :class="[black?'bk':'','px-10  ','flex-start fulled']" :style="{minHeight: sizes.wk}" class=" tm-checkbox-boey-label ">
				<view class="flex-center fulled-height ">
					<slot name="label" :label="{label:label,checked:changValue}">
						<text class=" text-size-n">{{label}}</text>
					</slot>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 单选框
	 * @description 可以单独或者在tm-groupradio中使用。
	 * @property {Boolean} value = [true|false] 如果想双向绑定需要value.snyc等同v-model。推荐v-model.
	 * @property {Function} input 等同value.snyc和v-model和change
	 * @property {Function} change 变化是会返回 {index,checked,value:name携带的数据}
	 * @property {Boolean} disabled = [true|false] 默认false,禁用
	 * @property {String} color = [primary|blue] 默认primary,主题色名称。
	 * @property {String} border-color = [] 默认 '',边线主题色，默认同color可不填。
	 * @property {String} model = [normal|round] 默认normal, 内部：normal打勾，round:内部为圆点
	 * @property {String} icon = [icon-check] 默认icon-check,自定义选中时的图标。
	 * @property {String|Number} round = [2|rounded] 默认2, 圆角，rounded时即圆形。
	 * @property {String|Number} size = [] 默认32, 大小单位upx
	 * @property {String|Boolean} dense = [true|false] 默认false,  是否去除外间隙。
	 * @property {String} label = [] 默认"",  文右边显示的选项文字
	 * @property {String|Boolean} black = [true|false] 默认false,  暗黑模式
	 * @property {String|Boolean} inline = [true|false] 默认false,  是否内联模式
	 * @property {String | Array | Object | Number} name = [] 默认 "",  选中时携带的自定义数据，会通过change带回。
	 * @example <tm-radio v-model="checked" label="按个计算"></tm-radio>
	 */
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	export default {
		components:{tmIcons},
		name:'tm-radio',
		model:{
			prop: 'value',
			event: 'input'
		},
		props:{
			//是否内联模式
			inline:{
				type:Boolean,
				default:true
			},
			// 禁用。
			disabled:Boolean,
			// 使用时：:checked.sync 需要带sync
			value:Boolean,
			color:{
				type:String,
				default:'primary'
			},
			borderColor: {
				type: String,
				default: ''
			},
			// 内部：normal打勾，round:内部为圆点
			model:{
				type:String,
				default:'round'
			},
			// 自定义选中时的图标。
			icon:{
				type:String,
				default:'icon-check'
			},
			// 外部形状：== rounded时即圆形。
			round:{
				type:String|Number,
				default:'rounded'
			},
			// 单位upx
			size:{
				type:String|Number,
				default:38
			},
			// 是否去除外间隙。
			dense:{
				type:Boolean|String,
				default:false
			},
			// 名称。
			label:{
				type:String,
				default:''
			},
			black:{
				type:Boolean|String,
				default:false
			},
			name:{
				type:String|Array|Object|Number,
				default:''
			},
			// 跟随主题色的改变而改变。
			fllowTheme:{
				type:Boolean|String,
				default:true
			}
			
		},
		data() {
			return {
				
			};
		},
		mounted() {
			
		},
		watch:{
			value:function(newval,oldval){
				if(newval !== oldval){
					this.change();
				}
			}
		},
		computed:{
			color_tmeme:function(){
				if(this.$tm.vx.state().tmVuetify.color!==null&&this.$tm.vx.state().tmVuetify.color && this.fllowTheme){
					return this.$tm.vx.state().tmVuetify.color;
				}
				return this.color;
			},
			changValue:{
				get:function(){
					
					return this.value;
				},
				set:function(newValue){
					this.$emit('input',newValue )
					// 如果不想用v-model. 直接使用value,需要:value.sync
					this.$emit('update:value',newValue )
				}
			},
	
			sizes:function(){
				return {
					wk:uni.upx2px(this.size)+'px',
					gou:uni.upx2px(this.size/3*2)+'px',
					yuan:uni.upx2px(this.size/2)+'px',
				}
			}
		},
		methods: {
			
			onclick(e){
				let t= this;
				if(this.disabled) return;
				
				this.changValue = true;
				
			},
			change() {
				let box = [];
				let selfIndex;
				let __uid = this._uid;
				let t = this;
				function findchild(p,index){
					let preat = p;
					if(preat.$options?.name==='tm-radio'){
						
						if(preat._uid!==__uid){
							
							if(preat.changValue===true && preat.changValue === t.changValue){
								
								preat.changValue = false;
							}
							
						}else if(preat._uid===__uid){
							
							box.push({index:index,name:preat.name,checked:preat.changValue})
							selfIndex = index;
						}
					}else{
						if(preat.$children.length>0){
							preat.$children.forEach(item=>{
								findchild(item,index++);
							})
						}
					}
				};
				let preat = this.$tm.getParentAls('tm-groupradio', this.$parent);
				
				// 如果不在tm-groupradio里面将不作反选。并且始终为true.
				if(preat){
					findchild(preat,0);
					t.$emit('change',{index:selfIndex,checked:t.changValue,name:t.name});
					preat.change(box)
				}else{
					this.$emit('change',{index:0,checked:this.changValue,name:this.name});
				}
				
			}
		},
	}
</script>

<style lang="scss" scoped>
.tm-checkbox{
	vertical-align: middle;
	.tm-checkbox-boey,.tm-checkbox-boey-label{
		vertical-align: middle;
	}
	.ani {
		animation: ani 0.2s  linear;
	}
	.ani_toMaxToMin_on {
		animation: ani_toMaxToMin_on 0.35s  linear;
	}
	
	@keyframes ani_toMaxToMin_on {
		0% {
			transform: scale(0.7);
			opacity:0.7;
		}
	
		50% {
			transform: scale(1.5)
		}
	
		100% {
			transform: scale(1);
			opacity:1;
		}
	}
	@keyframes ani {
		0% {
			transform: scale(0.9)
		}
	
		50% {
			transform: scale(1.1)
		}
	
		100% {
			transform: scale(0.9)
		}
	}
}
</style>
