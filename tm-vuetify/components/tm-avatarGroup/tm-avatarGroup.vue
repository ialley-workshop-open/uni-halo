<template>
	<view class="tm-avatarGroup">
		<view :class="[`pl-${posX}`]">
			<slot></slot>
			
		</view>
	</view>
</template>

<script>

export default {
	name: 'tm-avatarGroup',
	props:{
		posX:{
			type:Number,
			default:30
		}
	},
	data() {
		return {
			
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
				if (item.$options.name === 'tm-avatar') {
					item.setConfigStyle({
						'margin-left':`-${t.posX}rpx`
					})
				}
			});
			
		}
	}
};
</script>

<style lang="scss"></style>
