<template>
	<view class="tm-actionSheet ">
		<tm-poup @change="toogle" ref="pop" v-model="showpop" height="auto" :black="black_tmeme" :bg-color="black_tmeme ? 'grey-darken-6' : 'grey-lighten-4'">
			<view class="tm-actionSheet-title pa-32 pb-32 relative " :class="[black_tmeme ? 'grey-darken-5' : 'white']">
				<view class="text-size-n text-align-center">{{ title }}</view>
				<view class="tm-actionSheet-close  rounded flex-center absolute" :class="black_tmeme ? 'grey-darken-4' : 'grey-lighten-3'">
					<tm-icons @click="close" name="icon-times" size="24" :color="black_tmeme ? 'white' : 'grey'"></tm-icons>
				</view>
			</view>
			<view>
				<slot>
					<tm-grouplist shadow="5" round="4">
						<tm-listitem
							:black="black_tmeme"
							@click="onclick(index, item)"
							v-for="(item, index) in actions"
							:key="index"
							:title="item[rangKey]"
							:label="item['label'] ? item['label'] : ''"
							:right-icon="item['rightIcon'] ? item['rightIcon'] : 'icon-angle-right'"
						></tm-listitem>
					</tm-grouplist>
				</slot>
			</view>
			<view style="height: 50upx"></view>
		</tm-poup>
	</view>
</template>

<script>
/**
 * 动作面板
 * @description 动作面板,从底部弹出的操作菜单。
 * @property {Boolean} black = [true|false] 默认：false，暗黑模式
 * @property {Boolean} value = [true|false] 默认：false，显示菜单，推荐使用v-model,使用value.sync达到双向绑定。
 * @property {String} title = [] 默认：'请操作',弹出层的标题。
 * @property {Array} actions = [] 默认：[],格式见文档，操作数组。
 * @property {String} rang-key = [title] 默认：title,actions对象数组时，自定义标题键。
 * @property {Boolean} click-close = [true|false] 默认：true,点击项目时，是否自动关闭弹层。
 * @property {Function} change 点击项目时触发,返回：{index:项目索引,data:actions的对象数据}
 * @property {Function} input 弹层显示和隐藏时，将会触发。
 * @example <tm-actionSheet @change="test" v-model="show" :actions="[{title:'说明文档',label:'这是说明文件的资料信息'},{title:'新建文件夹'}]"></tm-actionSheet>
 */

import tmGrouplist from '@/tm-vuetify/components/tm-grouplist/tm-grouplist.vue';
import tmListitem from '@/tm-vuetify/components/tm-listitem/tm-listitem.vue';
import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';
import tmPoup from '@/tm-vuetify/components/tm-poup/tm-poup.vue';
export default {
	components: { tmGrouplist, tmListitem, tmIcons, tmPoup },
	name: 'tm-actionSheet',
	model: {
		prop: 'value',
		event: 'input'
	},
	props: {
		value: {
			type: Boolean,
			default: false
		},
		black: {
			type: Boolean,
			default: null
		},
		title: {
			type: String,
			default: '操作栏'
		},
		// 数组格式。
		/*
			{
				title:"标题",
				label:"项目说明文字",
				rightIcon:"",//右边图标。
			}
			*/
		actions: {
			type: Array,
			default: () => {
				return [];
			}
		},
		// 自定义标题键key.
		rangKey: {
			type: String,
			default: 'title'
		},
		// 点击项目时，是否关闭弹层
		clickClose: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			showpop: false
		};
	},
	mounted() {
		this.showpop = this.value;
	},
	watch: {
		value: function(val) {
			this.showpop = val;
		}
	},
	computed: {
		black_tmeme: function() {
			if (this.black !== null) return this.black;
			return this.$tm.vx.state().tmVuetify.black;
		}
	},
	methods: {
		close() {
			this.$refs.pop.close();
		},
		toogle(e) {
			let t = this;
			if (e) {
				this.$nextTick(function() {
					if (this.showpop != this.value) {
						this.showpop = this.value;
					}
				});
			}
			this.$emit('input', e);
			this.$emit('update:value', e);
		},
		onclick(index, item) {
			if (this.clickClose === true) {
				this.$refs.pop.close();
				this.$emit('change', {
					index: index,
					data: item
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.tm-actionSheet-title {
	.tm-actionSheet-close {
		top: 32upx;
		right: 32upx;
		width: 50upx;
		height: 50upx;
	}
}
</style>
