<template>
	<view class="tm-groupButton  " :class="[`mx-${margin[0]}`,`my-${margin[1]}`]">
		<view class="overflow fulled "  :class="[`round-${round}`]">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	/**
	 * 按钮组
	 * @param {Number} round = [] 默认4，圆角
	 * @param {Number} margin = [] 默认 [0,24] 上下间距
	 * @param {Number} active-color = [] 默认 primary 点按激活的颜色主题
	 * @property {Function} change 点按按钮选中时的触发，返回当前索引值。
	 */
	export default {
		name:"tm-groupButton",
		props: {
			round: {
				type: Number|String,
				default: 4
			},
			margin: {
				type: Array,
				default: ()=>[0,24]
			},
			activeColor: {
				type: String,
				default: 'primary'
			},
		},
		data() {
			return {
				activeIndex:null,
			};
		},
		mounted() {
			this.$nextTick(function(){
				this.inits();
			})
		},
		updated(){
			this.$nextTick(function () {
				this.inits();
			})
		},
		methods: {
			inits() {
				let t = this;
				let ch = [];
				// #ifndef H5
				ch = this.$children;
				// #endif
				// #ifdef H5
				ch = this.$children[0].$children[0].$children;
				// #endif
				ch.forEach((item, index) => {
					if (item.$options.name === 'tm-button') {
						let str = '';
						if(index==0){
							str = ' round-l-'+t.round+' round-r-0'
						}else if(index==ch.length-1){
							str = ' round-r-'+t.round+' round-l-0'
						}else{
							str = ' round-l-0 round-r-0'
						}
						item.customClass_puted=" ma-0 "+str;
						item.customDense_puted=true;
						item.onclick=function(){
							t.colorDefault();
							item.$emit('click',...arguments)
							t.$emit('change',index)
							t.activeIndex=index;
							item.color_tmeme = t.activeColor
						}
						if(index!==0){
							item.setConfigStyle('border-l-1')
						}
					}
				});
				
			},
			colorDefault(){
				let t = this;
				let ch = [];
				// #ifndef H5
				ch = this.$children;
				// #endif
				// #ifdef H5
				ch = this.$children[0].$children[0].$children;
				// #endif
				ch.forEach((item, index) => {
					if (item.$options.name === 'tm-button') {
						item.color_tmeme = item.theme
					}
				});
			}
		}
	}
</script>

<style lang="scss">

</style>
