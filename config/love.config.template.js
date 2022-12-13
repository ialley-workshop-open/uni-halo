/**
 * 恋爱日记配置
 */
export default {
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

	timeTitle: '这是我们一起走过的', // 恋爱时间标题
	loveStartDate: '2022-05-20 13:14:20', // 恋爱开始时间 

	// 恋爱日记首页导航（除了 key 以外都可以修改）
	nav: [{
			key: 'journey',
			use: true,
			iconImageUrl: 'https://b.925i.cn/uni_halo_love/diandian.png',
			title: '关于我们',
			desc: '我们一起度过的那些经历'
		},
		{
			key: 'album',
			use: true,
			iconImageUrl: 'https://b.925i.cn/uni_halo_love/diandian.png',
			title: '恋爱相册',
			desc: '定格了我们的那些小美好'
		},
		{
			key: 'list',
			use: true,
			iconImageUrl: 'https://b.925i.cn/uni_halo_love/diandian.png',
			title: '恋爱清单',
			desc: '你我之间的约定我们都在努力实现'
		},
	],

	// 关于我们：支持富文本内容
	journey: `
		    <p>有一只马，它的邻居是一只驴。</p><p>有一天，马和驴都被主人牵到外面晒太阳，马和驴聊起了天。</p><p>马说：“我叫马，你呢？”</p><p>驴说：“我叫驴。（哄小宝贝睡觉的甜甜睡前故事）”</p><p>马说：“为什么我俩的名字不一样呢？”</p><p>驴说：“因为我和你不一样。”</p><p>马说：“我们俩什么地方不一样呢？”</p><p>驴说：“我身材小巧，而你却比较粗壮，不如我耐看。”马看了看比自已矮小很多的驴，认为驴说的话有点道理。</p><p>马说：“我们俩除了身材不一样，还有什么不同呢？”</p><p>驴说：“我们俩的声音不一样，我的声音多动听呀！”说着驴伸长脖子叫了两声。“不信，你也叫两声试试。”马也伸长脖子嘶鸣了两声，的确和驴的声音有点不同，马不好意思地低下了头。</p><p>过了一会儿，马又说：“我们俩除了身材和声音不一样外，还有什么不同呢？”</p><p>驴说：“我的步伐多么优雅呀。”说着，驴迈开蹄子走了两步，“而你呢，却昂首阔步，一点儿也不优雅，（如何哄女朋友睡觉的睡前故事爱情浪漫）不信你走两步试试。”</p><p>马听驴这么一说，就高昂着头走了两步，旋即，马飞奔了起来，转了一圈回来后，驴得意地说：“怎么样，我没说错罢，你就是急性子，和优雅不沾边。”马听了驴的话，有点感到惭愧。</p><p>最后，马又鼓起勇气说：“我们俩还有什么不同呢？”</p><p>驴说：“我的家庭意识比你强，主人抽我一鞭子，我就跟着主人回家，而你呢？恐怕不会吧……”</p><p>马还没有来得及回答，马和驴的主人同时来到了马和驴的身边。只见驴的主人抽了驴一鞭子后，驴乖乖地跟着主人回家了。马把这一切都看在了眼里，它为自已和驴的诸多不同而感到惭愧，只见马的主人也抽了马一鞭子，马犹豫了一下，终于象驴一样乖乖地跟着主人回了家。</p><p>一个伯乐站在远处看到了这一幕后，叹口气离开了。</p>
	`,
	// 恋爱相册
	albumKeyName: '恋爱相册', // 对应后台的图库分组名称
	// 恋爱清单
	loveList: {
		useApi: false, // 是否启用api接口
		api: '', // api 接口（如果使用api接口的方式，则下方的data可以留空，但是api接口必须按照对应的数据格式返回）
		data: [{
				index: 0, // 序号
				finish: true, // 是否已完成
				title: '偷偷记录对方熟睡的模样', // 事件名称
				desc: '偷偷观察对方熟睡的模样，记录下来', // 事件描述
				detail: {
					start: '2022年05月20日', // 计划开始时间
					desc: '偷偷观察对方熟睡的模样，记录下来', // 事件详细描述
					end: '每天', // 完成时间，
					moment: '', // 完成瞬间的记录
					other: '', // 其他说明
				}
			}, {
				index: 1,
				finish: false,
				title: '陪对方过生日',
				desc: '陪对方一起过生日',
				detail: {
					start: '2023年05月20日',
					desc: '陪对方一起过生日，他和我的生日',
					end: '',
					moment: '',
					other: '他 生日5月20日 我生日9月25日',
				}
			},
			{
				index: 2,
				finish: false,
				title: '一起去旅行',
				desc: '一起来一场说走就走的旅行，希望去的是大理',
				detail: {
					start: '',
					desc: '',
					end: '',
					moment: '一起来一场说走就走的旅行，希望去的是大理',
					other: '',
				}
			},
			{
				index: 3,
				finish: false,
				title: '一起穿情侣装逛街',
				desc: '一起穿情侣装逛街',
				detail: {
					start: '',
					desc: '',
					end: '',
					moment: '',
					other: '',
				}
			},
			{
				index: 4,
				finish: false,
				title: '一起看日出',
				desc: '一起看日出',
				detail: {
					start: '',
					desc: '',
					end: '',
					moment: '',
					other: '',
				}
			},
			{
				index: 5,
				finish: false,
				title: '一起看日落',
				desc: '一起看日落',
				detail: {
					start: '',
					desc: '',
					end: '',
					moment: '',
					other: '', // 其他说明
				}
			},
			{
				index: 6,
				finish: false,
				title: '一起买菜、做饭、刷碗',
				desc: '一起买菜、做饭、刷碗',
				detail: {
					start: '',
					desc: '',
					end: '',
					moment: '',
					other: '',
				}
			}
		],
	}
}
