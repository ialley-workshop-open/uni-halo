<template>
	<view class="tm-swiperListItem fulled overflow absolute" 
	:style="{ 
		height: itemHeight + 'rpx',
		top:scroll_data.scroll.top+(scroll_data.index)*itemHeight+'rpx' 
		}">
		<view class="fulled fulled-height"><slot></slot></view>
	</view>
</template>

<script>
export default {
	name: 'tm-swiperListItem',
	props: {
		scroll: {
			type: Object,
			default: () => ({
				scroll: {
					showNum: 1, //当前视图内可容纳的条数
					totalSum: 40, //总条数
					topIndex: 0 //顶部位置条目的索引
				},
				index: 0 //当前索引。
			})
		},
		itemHeight: {
			type: Number,
			default: 100
		}
	},
	data() {
		return {
			show: false //是否渲染本条目。
		};
	},

	watch: {
		scroll: {
			deep: true,
			handler(val) {
				this.setShow();
			}
		}
	},
	computed: {
		scroll_data() {
			return this.scroll 
		}
	},
	created() {
		this.setShow();
	},
	methods: {
		setShow() {
			if (this.scroll.index == this.scroll.scroll.topIndex) {
				this.show = true;
				return;
			}
			let shown = 3; //前后三条可以显示+上视图内的。
			let min = this.scroll.scroll.topIndex - shown;
			min = min <= 0 ? 0 : min;
			let max = this.scroll.scroll.topIndex + shown + this.scroll.scroll.showNum;

			if (this.scroll.index >= min && this.scroll.index <= max) {
				this.show = true;
			} else {
				this.show = false;
			}
		}
	}
};
</script>

<style lang="scss"></style>
