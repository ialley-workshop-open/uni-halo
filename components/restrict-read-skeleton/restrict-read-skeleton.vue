<script>
export default {
  name: 'restrict-read-skeleton',
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    hover: {
      type: Boolean,
      default: false
    },
    buttonText: {
      type: String,
      default: '刷新'
    },
    buttonColor: {
      type: String,
      default: '#07c160'
    },
    buttonSize: {
      type: String,
      default: 'normal', // 'small', 'normal', 'large'
      validator: value => ['small', 'normal', 'large'].includes(value)
    },
    lines: {
      type: Number,
      default: 4,
      validator: value => value >= 1 && value <= 6
    },
    skeletonColor: {
      type: String,
      default: '#f5f5f5'
    },
    skeletonHighlight: {
      type: String,
      default: '#e8e8e8'
    },
    animationDuration: {
      type: Number,
      default: 1.5
    },
    showButton: {
      type: Boolean,
      default: true
    },
    tipText: {
      type: String,
      default: '' // 默认不显示提示文字
    },
    tipColor: {
      type: String,
      default: '#666666' // 提示文字颜色
    },
    tipSize: {
      type: Number,
      default: 24 // 提示文字大小，单位rpx
    }
  },
  methods: {
    handleRefresh() {
      this.$emit('refresh');
    },
    onTouchStart() {
      this.$emit('touchstart');
    },
    onTouchEnd() {
      this.$emit('touchend');
    }
  }
};
</script>

<template>
  <!-- 骨架屏容器 -->
  <view class="container">
    <!-- 骨架屏内容 -->
    <view class="skeleton" v-if="loading">
      <!-- 内容区域 -->
      <view class="skeleton-body">
        <view
            v-for="(item, index) in Array(lines).fill(0)"
            :key="index"
            class="skeleton-line"
            :class="{
            'short': index === lines - 2,
            'shorter': index === lines - 1
          }"
          :style="{
            background: `linear-gradient(90deg, ${skeletonColor} 25%, ${skeletonHighlight} 50%, ${skeletonColor} 75%)`,
            animationDuration: `${animationDuration}s`
          }">
        </view>
      </view>
    </view>

    <!-- 实际内容 -->
    <view v-else>
      <slot></slot>
    </view>

    <!-- 提示文字和按钮容器 -->
    <view v-if="showButton" class="button-container">
      <!-- 提示文字 -->
      <text 
        v-if="tipText" 
        class="tip-text"
        :style="{
          color: tipColor,
          fontSize: tipSize + 'rpx'
        }"
      >{{ tipText }}</text>
      
      <!-- 按钮 -->
      <button
        class="overlay-button"
        :class="[buttonSize, { 'button-hover': hover }]"
        hover-class="none"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
        @click="handleRefresh"
        :style="{ backgroundColor: buttonColor }"
      >
        {{ buttonText }}
      </button>
    </view>
  </view>
</template>

<style scoped lang="scss">
/* 容器样式 */
.container {
  position: relative;
  width: 100%;
  min-height: 200rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
  }
}

/* 骨架屏样式 */
.skeleton {
  width: 100%;
  height: 100%;
  padding: 30rpx;

  &-body {
    margin: 20rpx 0;
  }

  &-line {
    height: 32rpx;
    background-size: 400% 100%;
    border-radius: 8rpx;
    margin-bottom: 20rpx;
    animation: skeleton-loading 1.5s ease infinite;

    &.short {
      width: 70%;
    }

    &.shorter {
      width: 50%;
    }
  }
}

/* 按钮容器样式 */
.button-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

/* 提示文字样式 */
.tip-text {
  margin-bottom: 20rpx;
  text-align: center;
  line-height: 1.4;
}

/* 按钮样式 */
.overlay-button {
  position: relative; // 改为相对定位
  transform: none; // 移除transform
  color: white;
  border-radius: 50rpx;
  padding: 0 40rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:active {
    transform: scale(0.95); // 简化active状态的transform
  }

  &.small {
    height: 60rpx;
    line-height: 60rpx;
    font-size: 24rpx;
    padding: 0 30rpx;
  }

  &.large {
    height: 100rpx;
    line-height: 100rpx;
    font-size: 32rpx;
    padding: 0 50rpx;
  }
}

.button-hover {
  transform: translateY(-4rpx); // 简化hover状态的transform
  box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.15);
}

/* 骨架屏动画 */
@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>
