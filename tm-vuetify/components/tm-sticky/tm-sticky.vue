<template>

	<view
		class="tm-sticky fulled"
		:class="[model_val]"
		:style="{
			top: model_val == 'top' || model_val == 'static' ? `${top_val}px` : 'auto',
			bottom: model_val == 'bottom' ? `${top_val}px` : 'auto'
		}"
	>
		<slot></slot>
	</view>


</template>

<script>
/**
 * 粘性布局
 * @property {String|Number} top = [] 当悬浮时的的偏移量，当model=bottom时，为底部偏移量，单位px
 * @property {String} model = [static|top|bottom] 固定的位置
 * @example <tm-sticky ></tm-sticky>
 */
export default {
	name: 'tm-sticky',
	props: {
		top: {
			type: String | Number,
			default: 0
		},
		model: {
			type: String,
			default: 'static' //static,top,bottom
		}
	},
	destroyed() {
		uni.$off('onPageScroll');
	},
	
	computed:{
		top_val:function(){
			return this.top;
		},
		model_val:function(){
			let p = this.model;
			// #ifndef H5
			if(this.model=='static' && this.istrueStic==false){
				return 'top';
			}
			// #endif
			return p;
		},
		istrueStic:function(){
			if(this.nowScrollTop <= this.eleTop){
				return true;
			}
			return false;
		}
	},
	mounted() {
		let t= this;
		uni.$on('onPageScroll', e => {
			t.nowScrollTop = e.scrollTop;
			
		});
		this.$nextTick(async function(){
			let p = await this.$Querey('.tm-sticky').catch(e=>{})
			this.eleTop = p[0].top;
		})
	},
	data() {
		return {
			nowScrollTop: 0,
			eleTop:0
		};
	}
};
</script>

<style lang="scss" scoped>
.tm-sticky {
	&.static {
		position: sticky;
		position: -webkit-sticky;
	}
	&.top {
		position: fixed;
		top: 0;
		z-index: 301;
	}
	&.bottom {
		position: fixed;
		bottom: 0;
		z-index: 301;
	}

	z-index: 300;
}
</style>
