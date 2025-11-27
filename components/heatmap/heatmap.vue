<template>
	<view class="contribution-heatmap pa-24">
		<view class="header">
			<view class="title">
				<view v-if="false" style="color: #7e7e7f">数据范围:</view>
				<view>{{ dataRangeYears }}</view>
			</view>
			<view class="controls">
				<tm-stepper v-model="currentYear" :width="220" :height="48" :min="1999" :max="2099" :shadow="0" :round="2" color="light-blue" @change="changeYear"></tm-stepper>
			</view>
		</view>

		<view class="heatmap-container">
			<view class="weeks">
				<view class="week-label" v-for="week in weeks" :key="week">{{ week }}</view>
			</view>
			<view class="heatmap-content">
				<view class="months" :style="[calcContentStyle]">
					<view class="month-label" v-for="month in monthLabels" :key="month.index">
						{{ month.name }}
					</view>
				</view>
				<view class="days-container" :style="[calcContentStyle]">
					<view
						v-for="(day, index) in displayDays"
						:key="index"
						class="day-cell"
						:style="{ backgroundColor: getDayColor(day) }"
						@click="handleDayClick(day, index)"
					></view>
				</view>
			</view>
		</view>

		<view class="footer">
			<view class="releases-count">
				<text>累计 {{ calcAllYearCount }} 篇</text>
				<text>丨</text>
				<text>本年 {{ calcCurrentYearCount }} 篇</text>
			</view>
			<view class="legend">
				<text class="legend-text">少</text>
				<view v-for="(color, index) in intensityColors" :key="index" class="day-cell legend-day-cell" :style="{ backgroundColor: color }"></view>
				<text class="legend-text">多</text>
			</view>
		</view>
	</view>
</template>

<script>
import tmStepper from '@/tm-vuetify/components/tm-stepper/tm-stepper.vue';
export default {
	name: 'Heatmap',
	components: {
		tmStepper
	},
	props: {
		year: {
			type: Number,
			default: () => new Date().getFullYear()
		},
		chartData: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			weeks: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
			intensityColors: [
				'#ebedf0', // 无贡献
				'#dbeafe', // 1-2次
				'#93c5fd', // 3-4次
				'#3b82f6', // 5-6次
				'#1e40af' // 7次以上
			],
			displayDays: [],
			showTooltip: null,
			currentYear: '1900',
			currentYearData: []
		};
	},
	computed: {
		dataRangeYears() {
			const arr = this.chartData;
			const dateField = 'name';

			if (!arr || !Array.isArray(arr) || arr.length === 0) {
				return { minDate: null, maxDate: null };
			}

			// 提取所有有效日期
			const validDates = arr
				.map((item) => {
					if (item && item[dateField]) {
						const date = new Date(item[dateField]);
						return isNaN(date.getTime()) ? null : date;
					}
					return null;
				})
				.filter((date) => date !== null);

			if (validDates.length === 0) {
				return { minDate: null, maxDate: null };
			}

			// 找到最小和最大日期
			const minDate = new Date(Math.min(...validDates.map((date) => date.getTime())));
			const maxDate = new Date(Math.max(...validDates.map((date) => date.getTime())));

			const result = {
				minDate: this.formatDate(minDate),
				maxDate: this.formatDate(maxDate)
			};

			return `${result.minDate} 至 ${result.maxDate}`;
		},
		// 计算内容宽度
		calcContentStyle() {
			const rowCount = Math.ceil(this.displayDays.length / 7);
			const singleWidth = 36;
			return {
				width: rowCount * singleWidth + 'rpx'
			};
		},
		//累计的发文次数
		calcAllYearCount() {
			return this.chartData.reduce((acc, cur) => {
				return acc + cur.total;
			}, 0);
		},
		// 统计当前年累计的发文次数
		calcCurrentYearCount() {
			return this.currentYearData.reduce((acc, cur) => {
				return acc + cur.total;
			}, 0);
		},
		monthLabels() {
			const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
			const labels = [];

			if (this.displayDays.length === 0) return labels;

			// 计算每个格子的总宽度（包括间距）
			const cellTotalWidth = 15 + 1.5 * 2; // width + margin * 2

			let currentMonth = -1;
			let monthStartWeek = 0;

			// 遍历所有周
			const totalWeeks = Math.ceil(this.displayDays.length / 7);

			for (let week = 0; week < totalWeeks; week++) {
				// 找到这一周的第一个有效日期
				let weekMonth = -1;
				for (let day = 0; day < 7; day++) {
					const dayIndex = week * 7 + day;
					if (dayIndex < this.displayDays.length && this.displayDays[dayIndex].date) {
						weekMonth = this.displayDays[dayIndex].date.getMonth();
						break;
					}
				}

				// 如果找到了有效月份
				if (weekMonth !== -1) {
					// 如果是新的月份
					if (weekMonth !== currentMonth) {
						// 如果不是第一个月份，先计算前一个月份的宽度
						if (currentMonth !== -1) {
							const weeksInMonth = week - monthStartWeek;
							const width = weeksInMonth * cellTotalWidth;
							labels.push({
								name: months[currentMonth],
								width: width,
								marginLeft: monthStartWeek === 0 ? 0 : 2,
								index: currentMonth
							});
						}

						currentMonth = weekMonth;
						monthStartWeek = week;
					}
				}
			}

			// 处理最后一个月份
			if (currentMonth !== -1) {
				const weeksInMonth = totalWeeks - monthStartWeek;
				const width = weeksInMonth * cellTotalWidth;
				labels.push({
					name: months[currentMonth],
					width: width,
					marginLeft: monthStartWeek === 0 ? 0 : 2,
					index: currentMonth
				});
			}

			return labels;
		}
	},
	watch: {
		year: {
			immediate: true,
			handler(newYear) {
				this.generateDisplayData(newYear);
			}
		},
		chartData: {
			deep: true,
			handler(newData) {
				this.mergeContributionData(newData);
			}
		}
	},
	created() {
		this.filterAndSetCurrentYearData(this.year);
	},
	methods: {
		filterAndSetCurrentYearData(year) {
			this.currentYear = year;
			this.currentYearData = this.chartData.filter((x) => x.name.includes(this.currentYear));
			this.generateDisplayData(year);
		},
		generateDisplayData(year) {
			const startDate = new Date(year, 0, 1);
			const endDate = new Date(year, 11, 31);
			const days = [];

			// 计算第一周的偏移量（确保周一开始）
			let firstDay = startDate.getDay();
			firstDay = firstDay === 0 ? 6 : firstDay - 1; // 将周日(0)转换为6，周一(1)转换为0

			// 添加空白填充，使第一周从周一开始
			for (let i = 0; i < firstDay; i++) {
				days.push({ date: null, count: 0 });
			}

			// 生成一年的日期
			let currentDate = new Date(startDate);
			while (currentDate <= endDate) {
				// 默认无贡献
				days.push({
					date: new Date(currentDate),
					count: 0
				});
				currentDate.setDate(currentDate.getDate() + 1);
			}

			this.displayDays = days;
			this.mergeContributionData(this.currentYearData);
		},
		mergeContributionData(contributionData) {
			if (!contributionData || contributionData.length === 0) return;

			// 将传入的数据合并到显示数据中
			const dataMap = new Map();
			contributionData.forEach((item) => {
				const dateStr = this.formatDate(item.date);
				dataMap.set(dateStr, item.total);
			});

			this.displayDays.forEach((day) => {
				if (day.date) {
					const dateStr = this.formatDate(day.date);
					if (dataMap.has(dateStr)) {
						day.count = dataMap.get(dateStr);
					}
				}
			});
		},
		formatDate(date) {
			date = new Date(date);
			// 将日期格式化为 YYYY-MM-DD
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			return `${year}-${month}-${day}`;
		},
		formatDisplayDate(date) {
			// 将日期格式化为中文显示格式
			const year = date.getFullYear();
			const month = date.getMonth() + 1;
			const day = date.getDate();
			return `${year}年${month}月${day}日`;
		},
		getDayColor(day) {
			if (day.count === 0) return this.intensityColors[0];
			if (day.count <= 2) return this.intensityColors[1];
			if (day.count <= 4) return this.intensityColors[2];
			if (day.count <= 6) return this.intensityColors[3];
			return this.intensityColors[4];
		},
		getTooltipText(day) {
			if (!day.date) return '无数据';

			const dateStr = this.formatDisplayDate(day.date);
			if (day.count === 0) {
				return `${dateStr}: 发布 0 篇文章`;
			} else {
				return `${dateStr}: 发布 ${day.count} 篇文章`;
			}
		},
		handleDayClick(day, index) {
			uni.showToast({
				icon: 'none',
				title: this.getTooltipText(day)
			});
		},
		changeYear(value) {
			this.filterAndSetCurrentYearData(value);
			this.$emit('year-change', value);
		}
	}
};
</script>

<style scoped>
.contribution-heatmap {
	box-sizing: border-box;
	width: 100%;
	background-color: #fff;
	border-radius: 12rpx;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.12), 0 2rpx 4rpx rgba(0, 0, 0, 0.24);
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.title {
	font-size: 24rpx;
	font-weight: 500;
	color: #000;
	border: 2rpx solid #ebedf0;
	border-radius: 10rpx;
	padding: 8rpx 12rpx;
}

.controls {
	display: flex;
	align-items: center;
	gap: 30rpx;
}

.year-selector {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.year-btn {
	background: none;
	border: none;
	cursor: pointer;
	color: #0969da;
	font-size: 28rpx;
	padding: 8rpx 16rpx;
	border-radius: 6rpx;
}

.year-btn:hover {
	background-color: #f6f8fa;
}

.year-display {
	font-size: 28rpx;
	font-weight: 600;
	min-width: 120rpx;
	text-align: center;
}

.legend {
	display: flex;
	align-items: center;
	gap: 2rpx;
	font-size: 24rpx;
	border: 2rpx solid #ebedf0;
	border-radius: 10rpx;
	padding: 8rpx 3rpx;
}

.legend-text {
	margin: 0 10rpx;
}
.legend-day-cell {
	width: 24rpx!important;
	height: 24rpx!important; 
}
.heatmap-container {
	display: flex;
	padding-bottom: 20rpx;
}

.weeks {
	margin-top: -2rpx;
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	margin-right: 10rpx;
	padding-top: 48rpx;
}

.week-label {
	font-size: 24rpx;
	color: #7e7e7f;
	height: 30rpx;
	line-height: 30rpx;
	margin-bottom: 6rpx;
	text-align: right;
}

.months {
	width: 100%;
	display: flex;
	margin-bottom: 10rpx;
}

.month-label {
	flex: 1;
	flex-shrink: 0;
	font-size: 24rpx;
	color: #7e7e7f;
	text-align: center;
}

.heatmap-content {
	display: flex;
	flex-direction: column;
	overflow-x: auto;
}

.days-container {
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	height: 252rpx; /* 7行 * 30rpx + 7行 * 6rpx间距 */
}

.day-cell {
	width: 32rpx;
	height: 32rpx;
	border-radius: 4rpx;
	margin: 3rpx;
	background-color: #ebedf0;
	position: relative;
}

.footer {
	margin-top: 12rpx;
	font-size: 24rpx;
	color: #586069;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.releases-count{
	display: flex;
	gap: 0 6rpx;
	box-sizing: border-box;
	border: 2rpx solid #ebedf0;
	border-radius: 10rpx;
	padding: 8rpx 12rpx;
	font-size: 24rpx;
}
</style>
