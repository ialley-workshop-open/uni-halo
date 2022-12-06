<template>
	<view>
		<view class="r-canvas-component" :style="{width:canvas_width/scale+'px',height:canvas_height/scale+'px'}" :class="{'hidden':hidden}">
			<canvas class="r-canvas" v-if="canvas_id" :canvas-id="canvas_id" :id="canvas_id" :style="{width:canvas_width+'px',height:canvas_height+'px','transform': `scale(${r_canvas_scale})`}"></canvas>
		</view>
	</view>
</template>

<script>
	import rCanvasJS from "./r-canvas.js"
	export default {
		mixins:[rCanvasJS]
	}
</script>
<style>
.r-canvas{
	transform-origin: 0 0;
}
.r-canvas-component{
	overflow: hidden;
}
.r-canvas-component.hidden{
	position: fixed;
	top:-5000upx;
}
</style>
