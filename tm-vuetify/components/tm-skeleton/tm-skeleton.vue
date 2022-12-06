<template>
	<view class="tm-skeleton fulled">
		<view v-if="model=='card'">
			<view :class="[`round-${round}`,$tm.vx.state().tmVuetify.black ? 'black bk' : '',color]" class=" tm-skeleton-card"></view>
			<view :class="[`round-${round}`,$tm.vx.state().tmVuetify.black ? 'black bk' : '',color]" class="tm-skeleton-item  my-24"></view>
			<view :class="[`round-${round}`,$tm.vx.state().tmVuetify.black ? 'black bk' : '',color]" class="tm-skeleton-item  my-24" style="width: 60%;"></view>
			<view :class="[`round-${round}`,$tm.vx.state().tmVuetify.black ? 'black bk' : '',color]" class="tm-skeleton-item  my-24" style="width: 30%;"></view>
		</view>
		<view v-if="model=='cardActions'">
			<view :class="[`round-${round}`,$tm.vx.state().tmVuetify.black ? 'black bk' : '',color]" class=" tm-skeleton-card"></view>
			<view :class="[`round-${round}`,$tm.vx.state().tmVuetify.black ? 'black bk' : '',color]" class="tm-skeleton-item  my-24"></view>
			<view :class="[`round-${round}`,$tm.vx.state().tmVuetify.black ? 'black bk' : '',color]" class="tm-skeleton-item  " ></view>
			<view class="flex-between">
				<view :class="[`round-${round}`,$tm.vx.state().tmVuetify.black ? 'black bk' : '',color]" class="tm-skeleton-item  my-24" style="width: 40%;"></view>
				<view :class="[`round-${round}`,$tm.vx.state().tmVuetify.black ? 'black bk' : '',color]" class="tm-skeleton-item  my-24" style="width: 15%;"></view>
			</view>
		</view>
		<view v-if="model=='list'">
			<view :class="[`round-${round}`,$tm.vx.state().tmVuetify.black ? 'black bk' : '',color]" class="tm-skeleton-item  my-24" style="width: 60%;"></view>
			<view :class="[`round-${round}`,$tm.vx.state().tmVuetify.black ? 'black bk' : '',color]" class="tm-skeleton-item  my-24" ></view>
			<view :class="[`round-${round}`,$tm.vx.state().tmVuetify.black ? 'black bk' : '',color]" class="tm-skeleton-item  my-24" ></view>
			<view :class="[`round-${round}`,$tm.vx.state().tmVuetify.black ? 'black bk' : '',color]" class="tm-skeleton-item  my-24" style="width: 30%;"></view>
		</view>
		<view v-if="model=='listAvatr'" class="flex-top-start">
			<view style="width: 100rpx;height: 100rpx;" :class="[$tm.vx.state().tmVuetify.black ? 'black bk' : '',color]" class="rounded  flex-shrink mr-32"></view>
			<view class="fulled">
				<view :class="[`round-${round}`,$tm.vx.state().tmVuetify.black ? 'black bk' : '',color]" class="tm-skeleton-item  mb-24" style="width: 60%;"></view>
				<view :class="[`round-${round}`,$tm.vx.state().tmVuetify.black ? 'black bk' : '',color]" class="tm-skeleton-item  my-24" ></view>
				<view :class="[`round-${round}`,$tm.vx.state().tmVuetify.black ? 'black bk' : '',color]" class="tm-skeleton-item  my-24" ></view>
				<view :class="[`round-${round}`,$tm.vx.state().tmVuetify.black ? 'black bk' : '',color]" class="tm-skeleton-item  my-24" style="width: 30%;"></view>
			</view>
		</view>
		<view v-if="model=='grid'" class="flex-top-start flex-wrap">
				<view v-for="(item,index) in 16" :key="index" style="width: 25%;">
					<view :class="[`round-${round}`,$tm.vx.state().tmVuetify.black ? 'black bk' : '',color]" class="tm-skeleton-item  ma-12" style="height: 80rpx;"></view>
				</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 骨架加载器
	 * @property {String} model = [card|cardActions|list|listAvatr|grid] 默认card类型
	 * @property {Number} round = [] 默认6，圆角
	 * @property {String} color = [] 默认grey-lighten-3，背景色
	 */
	export default {
		name:"tm-skeleton",
		props:{
			model:{
				type:String,
				default:'card',//card,cardActions,list,listAvatr,listAvatr,grid
			},
			round:{
				type:Number|String,
				default:6
			},
			color:{
				type:String,
				default:'grey-lighten-3'
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
.tm-skeleton{
	animation: ssy 1s ease infinite;
	.tm-skeleton-card{
		height: 300rpx;
	}
	.tm-skeleton-item{
		height: 40rpx;
		
	}
}
@keyframes ssy{
	0%{
		opacity: 0.4;
	}
	50%{
		opacity: 1;
	}
	100%{
		opacity: 0.4;
	}
}
</style>
