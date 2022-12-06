export const CheckNetWork = () => {
	let _text = ''
	uni.getNetworkType({
		success: (res) => {
			switch (res) {
				case '2g':
				case '3g':
					_text = '当前网络较慢，请稍等...'
					break;
				case 'none':
					_text = '啊偶，您的网络似乎断开啦~'
					break;
			}
			if (_text) {
				uni.$eShowModal({
					title: '提示',
					content: _text,
					showCancel: false,
					cancelColor: '#999999',
					confirmText: '知道啦',
					confirmColor: '#03a9f4'
				}).then(res => {}).catch(err => {})
			}
		}
	})
}
