<template>
	<view class="tm-pagination flex-center">
		<view v-if="tal" class="flex-start flex-wrap flex-between fulled">

			<tm-button :fllowTheme="false" :shadow="4" :icon-size="24"
				:font-color="nowIndex==1||disabled?'grey':color_tmeme" :black="black_tmeme" @click="tv_pre"
				:disabled="nowIndex==1||disabled" theme="white" :item-class="round?'rounded':''" block height="64" width="64"
				icon="icon-angle-left"></tm-button>


			<block v-for="(item,index) in items  " :key="index">

				<tm-button :fllowTheme="false" :shadow="4" :disabled="disabled" :black="black_tmeme"
					:theme="item==nowIndex?color_tmeme:'white'" @click="clicPages(item)" block
					:item-class="round?'rounded':''" height="64" width="64">
					{{item}}
				</tm-button>
			</block>


			<tm-button :fllowTheme="false" :shadow="4" :icon-size="24"
				:font-color="nowIndex==tal||disabled?'grey':color_tmeme" :black="black_tmeme" theme="white"
				@click="tv_next" :disabled="nowIndex==tal||disabled?true:false" :item-class="round?'rounded':''" block
				height="64" width="64" icon="icon-angle-right">
			</tm-button>
		</view>
	</view>
</template>

<script>
	/**
	 * 分页
	 * @property {Function} change 页面改变时触发。
	 * @property {Number} page = [] 默认：1当前页码，必须使用page.sync
	 * @property {Number} total-visible = [] 默认：5最大可见页数
	 * @property {Number} total = [] 默认：0总条数。
	 * @property {Number} size = [] 默认：8每页的数量。
	 * @property {Boolean} round = [] 默认：false,是否圆形按钮。
	 * @property {Boolean} black = [] 默认：false,是否暗黑模式
	 * @property {Boolean} disabled = [] 默认：false,禁用
	 * @property {String} color = [] 默认：primary,选中的主题色
	 * @example <tm-pagination :page.sync="page" :total="100"></tm-pagination>
	 */
	import tmButton from "@/tm-vuetify/components/tm-button/tm-button.vue"
	export default {
		components: {
			tmButton
		},
		name: "tm-pagination",
		props: {
			total: {
				type: Number,
				default: 0
			},
			// 最大可见按钮数量。
			totalVisible: {
				type: Number,
				default: 5
			},
			// 当前页码。需要page.sync同步。
			page: {
				type: Number,
				default: 1
			},
			// 每页的数量 。
			size: {
				type: Number,
				default: 10
			},
			// 是否圆形按钮。
			round: {
				type: Boolean,
				default: false
			},
			// 是否暗黑模式
			black: {
				type: Boolean | String,
				default: null
			},
			// 主题色
			color: {
				type: String,
				default: 'primary'
			},
			disabled: {
				type: Boolean,
				default: false
			},
			// 跟随主题色的改变而改变。
			fllowTheme: {
				type: Boolean | String,
				default: true
			}
		},
		watch: {
			page: function(val) {
				this.init()
			}
		},
		computed: {
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			},
			color_tmeme: function() {
				if (this.$tm.vx.state().tmVuetify.color !== null && this.$tm.vx.state().tmVuetify.color && this
					.fllowTheme) {
					return this.$tm.vx.state().tmVuetify.color;
				}
				return this.color;
			},
			//总共的页码。
			tal: function() {
				if (this.total <= this.size) return 1;
				let isInt = this.total % this.size;
				let ds = this.total / this.size;

				return isInt == 0 ? Math.floor(ds) : Math.floor(ds) + 1;
			},
			items: function() {
				
				const totalVisible = parseInt(this.totalVisible, 10)<=5?5:parseInt(this.totalVisible, 10);
				if(this.tal<=totalVisible){
					return this.range(1, this.tal)
				}
				if (totalVisible === 0) {
					return []
				}

				const maxLength = Math.min(
					Math.max(0, totalVisible) || this.tal,
					Math.max(0, this.maxButtons) || this.tal,
					this.tal
				)

				if (this.tal <= maxLength) {
					return this.range(1, this.tal)
				}

				const even = maxLength % 2 === 0 ? 1 : 0
				const left = Math.floor(maxLength / 2)
				const right = this.tal - left + 1 + even

				if (this.page > left && this.page < right) {
					const firstItem = 1
					const lastItem = this.tal
					const start = this.page - left + 2
					const end = this.page + left - 2 - even
					const secondItem = start - 1 === firstItem + 1 ? 2 : '...'
					const beforeLastItem = end + 1 === lastItem - 1 ? end + 1 : '...'

					return [1, secondItem, ...this.range(start, end), beforeLastItem, this.tal]
				} else if (this.page === left) {
					const end = this.page + left - 1 - even
					return [...this.range(1, end), '...', this.tal]
				} else if (this.page === right) {
					const start = this.page - left + 1
					return [1, '...', ...this.range(start, this.tal)]
				} else {
					return [
						...this.range(1, left),
						'...',
						...this.range(right, this.tal),
					]
				}
			},
		},
		data() {
			return {
				nowIndex: 1,
				maxButtons: 0,
			};
		},
		mounted() {
			let t = this;

			this.$Querey('.tm-pagination').then(res => {
				let w = res[0].width;
				t.maxButtons = Math.floor((w - uni.upx2px(20)) / uni.upx2px(64))

			})
		},
		methods: {
			clicPages(index) {
				if (index == '...') return;
				this.$emit('input', index)
				this.$emit('update:page', index)
				this.$emit('prev')
				this.$emit('change',index)

			},
			tv_pre() {
				this.$emit('input', this.page - 1)
				this.$emit('update:page', this.page - 1)
				this.$emit('prev')
				this.$emit('change',this.page - 1)
				
			},
			tv_next() {
				this.$emit('input', this.page + 1)
				this.$emit('update:page', this.page + 1)
				this.$emit('next')
				this.$emit('change',this.page + 1)
				
			},

			range(from = 1, to) {
				const range = []

				from = from > 0 ? from : 1

				for (let i = from; i <= to; i++) {
					range.push(i)
				}

				return range
			},

			init() {
				this.nowIndex = null;
				uni.$tm.sleep(100).then(() => (this.nowIndex = this.page))
			},

		},
	}
</script>

<style lang="scss">

</style>
