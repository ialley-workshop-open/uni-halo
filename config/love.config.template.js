/**
 * 恋爱日记配置
 */
export default {
	photoKeyName: '情侣相册', // 对应后台的图库分组名称
	waveImageUrl: 'https://b.925i.cn/uni_halo/uni_halo_about_wave.gif', // 波浪图片地址
	bgImageUrl: 'https://b.925i.cn/uni_halo_love/love_bg1.png', // 背景图片
	loveImageUrl: 'https://b.925i.cn/uni_halo_love/like.png', // 爱心图片

	boy: {
		name: '未知男主',
		avatar: 'https://b.925i.cn/uni_halo_love/love_boy.png',
		birthday: '2022-09-25', // 生日
	},
	girl: {
		name: '未知女主',
		avatar: 'https://b.925i.cn/uni_halo_love/love_girl.png',
		birthday: '2022-07-25', // 生日
	},
	loveStartDate: '2022-05-20 13:14:20', // 恋爱开始时间 
	timeTitle: '这是我们一起走过的',
	// 恋爱清单
	loveList: [{
			index: 1, // 序号
			finish: true, // 是否已完成
			title: '陪对方过生日', // 事件名称
			desc: '陪对方一起过生日', // 事件描述
			moment: '很难忘的一次生日，他陪我我陪他反正就是很难忘', // 完成瞬间的记录
		},
		{
			index: 2,
			finish: false,
			title: '一起去旅行',
			desc: '一起来一场说走就走的旅行，希望去的是大理',
			moment: '',
		},
		// 更多...
	],
}
