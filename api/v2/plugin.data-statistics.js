/**
 * Halo 数据看板插件
 * @link https://www.halo.run/store/apps/app-rtnbbgfk
 */
import {
	getPersonalToken
} from '@/utils/token.js'
import HttpHandler from '@/common/http/request.js'
import qs from 'qs'

import {
	getAppConfigs
} from '@/config/index.js'

export default {
	/**
	* 获取图表统计数据
	* @description - 标签、分类、文章发布趋势、评论活跃用户、获取热门文章top10 
	*/
	getChartData: () => {
		return HttpHandler.Get(`/apis/api.data.statistics.xhhao.com/v1alpha1/chart/data`,{})
	},
	/**
	* 获取Github配置信息 
	*/
	getGithubConfig:()=>{
		return HttpHandler.Get('/apis/api.data.statistics.xhhao.com/v1alpha1/github/config',{})
	},
	/**
	* 获取 Uptime Kuma 状态页面数据
	*/
	getUptimeStatus:()=>{
		return HttpHandler.Get('/apis/api.data.statistics.xhhao.com/v1alpha1/github/config',{})
	}
}