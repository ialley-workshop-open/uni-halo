<template>
	<view v-if="show" class="tm-tags d-inline-block " :class="[dense?'':'ma-10',
	size == 'xs' ? 'tm-tags-xs' : '',aniOpen?'showClose':''
	]">
		<view
			@click="$emit('click',$event)"
			class="tm-tags-item relative  flex-center "
			:class="[
				size == 'xs' ? 'px-6 py-2 text-size-xxs' : '',
				size == 's' ? 'px-10 py-4 text-size-xs' : '',
				size == 'n' ? 'px-15 py-6 text-size-s' : '',
				size == 'm' ? 'px-15 py-6 text-size-s' : '',
				size == 'g' ? 'px-24 py-8 text-size-n' : '',
				size == 'lg' ? 'px-32 py-8 text-size-n' : '',
				color_tmeme,black_tmeme?'bk':'',
				model !== 'model' ? model : '',
				`round-${rounded ? 24 : round}`,
				`shadow-${model == 'fill' ? shadow : 0}`
			]"
		>
			<view   v-if="showClose" :class="[color_tmeme,black_tmeme?'bk':'',aniOn?'aniOn':'']" class="tm-tags-close   flex-center border-white-a-2 rounded ">
				<view @click.stop="closeTags" style="transform: scale(0.7);">
					<tm-icons color="white" dense name="icon-times" :size="22"></tm-icons>
				</view>
			</view>
			<slot></slot>
		</view>
	</view>
</template>

<script>
/**
 * 纸片(标签)
 * @property {String} size = [xs|s|n|m|g|lg] ,默认：n，大小。
 * @property {String} color = [] ,默认：primary,主题色。
 * @property {String|Number} round = [] ,默认：2,圆角。
 * @property {String|Number} shadow = [] ,默认：4,投影。
 * @property {Boolean} rounded = [] ,默认：false,是否半圆
 * @property {String} model = [text|outlined|fill] ,默认：outlined，样式，如果背景填充模式model为空即可。
 * @property {Boolean} show-close = [] ,默认：false，是否显示关闭
 * @property {Boolean} ani-on = [] ,默认：false，是否开启抖动动画（关闭图标的）
 * @property {Boolean} dense = [] ,默认：false，是否去除边距间隙
 * @property {Function} close 关闭时触发。
 */
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	export default {
		components:{tmIcons},
	name: 'tm-tags',
	props: {
		size: {
			type: String,
			default: 'n' // xs|s|n|m|g|lg
		},
		color: {
			type: String,
			default: 'primary'
		},
		round: {
			type: String | Number,
			default: 2
		},
		shadow: {
			type: String | Number,
			default: 4
		},
		rounded: {
			type: Boolean,
			default: false
		},
		model: {
			type: String,
			default: 'outlined' //text|outlined|fill
		},
		showClose: {
			type: Boolean,
			default: false
		},
		// 是否打开关闭的抖动动画
		aniOn: {
			type: Boolean|String,
			default: false
		},
		black: {
			type: Boolean|String,
			default: null
		},
		dense:{
			type:Boolean|String,
			default:false
		},
		// 跟随主题色的改变而改变。
		fllowTheme:{
			type:Boolean|String,
			default:true
		}
	},
	computed: {
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
		closeSize: function() {
			if (this.size == 'xs') return 20;
			if (this.size == 's') return 20;
			if (this.size == 'n') return 22;
			if (this.size == 'm') return 24;
			if (this.size == 'g') return 24;
			if (this.size == 'lg') return 24;
		}
	},
	data() {
		return {
			show: true,
			aniOpen:false,
		};
	},
	methods: {
		closeTags() {
			let t = this;
			if(this.aniOpen) return;
			this.aniOpen=true;
			uni.$tm.sleep(250).then(()=>{
				t.show = false;
				t.aniOpen = false;
				t.$emit('close');
			})
			
		}
	}
};
</script>

<style lang="scss" scoped>
.tm-tags {
	&.tm-tags-xs{
		// #ifdef H5
		transform: scale(0.8);
		// #endif
	}
	&.showClose{
		animation:showClose 0.3s linear ;
	}
	.tm-tags-close {
		position: absolute;
		right: -10rpx;
		top: -20rpx;
		width: 32rpx;
		height: 32rpx;
		line-height: 0;
		vertical-align: middle;
		&.aniOn{
			animation:doudong 0.5s linear infinite;
		}
		
	}
}
@keyframes showClose {
	0%{
		transform: scale(1);
		opacity: 1;
	}
	100%{
		transform: scale(0.1);
		opacity: 0;
	}
}

@keyframes doudong {
	0%{
		transform: rotate(-3deg) translateX(4rpx) translateY(4rpx);
	}
	25%{
		transform: rotate(0deg) translateX(-4rpx) translateY(-4rpx);
	}
	50%{
		transform: rotate(0deg) translateX(0rpx) translateY(-4rpx);
	}
	75%{
		transform: rotate(0deg) translateX(0rpx) translateY(4rpx);
	}
	100%{
		transform: rotate(-3deg) translateX(4rpx) translateY(4rpx);
	}
}
</style>
