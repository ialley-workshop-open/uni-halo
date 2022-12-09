<template>
	<view
		class="tm-more relative"
		:style="{
			height: downOpen ? 'auto !important' : `${hs + 40}px`,
			paddingBottom: (downOpen && isRemovBar == false) || (show && !isRemovBar) ? '30px' : 0
		}"
	>
		<view class="tm-more-content"><slot></slot></view>
		<view v-if="!downOpen&&show&&showMask" :class="[black_tmeme?'bl':'']" class="tm-more-maskbody absolute"></view>
		<view
			@click="openMore"
			v-if="(!downOpen || isRemovBar == false) && show"
			:class="[bgColor,'text-'+iconColor,black_tmeme?'bk':'']"
			class="tm-more-mask absolute text-align-center text-size-s text-grey flex-center"
			
		>
			<slot name="more" :data="downOpen">
				<view class="fulled-height flex-center">
					<text>{{downOpen?openLabel:label}}</text>
					<view class="tm-more-btn px-24" :class="[downOpen?'on':'']">
						<tm-icons :size="24" :color="iconColor" name="icon-angle-down"></tm-icons>
					</view>
					
				</view>
				
			</slot>
		</view>
	</view>
</template>

<script>
	/**
	 * 展开更多
	 * @property {Number} maxHeight = [] 默认：100，限定多高时展示更多按钮,单位upx
	 * @property {Boolean} disabled = [] 默认：false,是否禁用，禁用后无法展开更多
	 * @property {Boolean} showMask = [] 默认：false,是否显示内容遮罩。
	 * @property {Boolean} open = [] 默认：false,需要open.sync，是否展开更多，可不必填此。此值主要是用来手动控制展开和关闭。
	 * @property {Boolean} isRemovBar = [] 默认：false,打开后，是否隐藏展开更多
	 * @property {String} icon-color = [] 默认：grey,展开更多的图标颜色。
	 * @property {String} bg-color = [] 默认：white,展开更多的背景颜色。
	 * @property {String} label = [] 默认：展开阅读更多,更多的提示文字。
	 * @property {String} open-label = [] 默认：收缩阅读更多,更多的提示文字。
	 * @property {Function} click 点击展开更多时触发。
	 * @property {Function} change 展开更多变换时触发。
	 */
import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	export default {
		components:{tmIcons},
	name: 'tm-more',
	props: {
		// 限定多高时展示更多按钮。
		maxHeight: {
			type: Number,
			default: 100
		},
		disabled: {
			type: Boolean,
			default: false
		},
		black: {
			type: Boolean|String,
			default: null
		},
		// 是否默认打开.可使用open.sync双向绑定。
		open: {
			type: Boolean,
			default: false
		},
		// 打开后，是否隐藏展开更多
		isRemovBar: {
			type: Boolean,
			default: false
		},

		iconColor: {
			type: String,
			default: 'grey'
		},
		// 展开更多 的背景色彩。
		bgColor: {
			type: String,
			default: 'white'
		},
		label:{
			type: String,
			default: '展开阅读更多'
		},
		openLabel:{
			type: String,
			default: '收缩阅读更多'
		},
		showMask:{
			type: Boolean|String,
			default: false
		}
	},
	watch: {
		open: function() {
			this.downOpen = this.open;
		}
	},
	data() {
		return {
			downOpen: false,
			show: true
		};
	},
	mounted() {
		this.$nextTick(function(){
			this.downOpen = this.open;
			this.getRect()
		})
	},
	updated() {
		this.getRect()
	},
	computed: {
		hs: function() {
			return uni.upx2px(this.maxHeight) || 100;
		},
		black_tmeme: function() {
			if (this.black !== null) return this.black;
			return this.$tm.vx.state().tmVuetify.black;
		}
	},
	methods: {
		getRect(){
			let t = this;
			t.$Querey('.tm-more-content',t,0).then(syninfo=>{
				if (syninfo[0].height - 40 <= t.hs) {
					t.show = false;
				}
			}).catch(e => {});
		},
		openMore() {
			this.$emit('click');
			if (this.disabled) return;
			this.downOpen = !this.downOpen;
			this.$emit('change', this.downOpen);
			this.$emit('update:open', this.downOpen);
		}
	}
};
</script>

<style lang="less" scoped>
.tm-more {
	overflow: hidden;
	
	.tm-more-content {
		overflow: hidden;
		
	}
	.tm-more-maskbody{
		
		height: calc(100% - 40px);
		bottom: 40px;
		z-index: 10;
		width: 100%;
		background-image: linear-gradient(rgba(255,255,255,0) ,rgba(255,255,255,1));
		&.bl{
			background-image: linear-gradient(rgba(0,0,0,0) 30%,rgba(0,0,0,1)) !important;
		}
	}
	.tm-more-mask {
		bottom: 0;
		width: 100%;
		height: 40px;
		z-index: 10;
		.tm-more-btn{
			&.on{
				transition: all 0.35s;
				transform: rotate(180deg);
			}
		}
	}
}
</style>
