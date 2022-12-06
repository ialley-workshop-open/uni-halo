import FyShowModal from './showModal.js'

export default class Fy{
	/**
	 * @author 大雄
	 * @Date 2021年7月1日20:49:58
	 * @description 二次封装showModel
	*/
	static showModal({ title = "提示",  content = "提示内容",  showCancel = true, backbutton = false, cancelText = "取消",  cancelColor = "#000000",  confirmText = "确定",  confirmColor = '#3CC51F', complete = false  } = {}) {
	    return new Promise((resolve, reject) => {
			// #ifdef APP-PLUS
			if (this.get_app_platform() === 'android') { // android的使用自定义的模态框
				new FyShowModal({ title, content, showCancel, backbutton, cancelText, cancelColor, confirmText, confirmColor,
					success(res) {
						if (res.confirm) {resolve(res) } else { reject(res) }
					},
					fail(err){
						this.uniShowModal({ title, content, showCancel,  cancelText,  cancelColor,  confirmText,  confirmColor, complete }).then((res)=>resolve(res)).catch(err=>reject(err))
					}
				}).show();
			} else { // ios直接用原生的
				return this.uniShowModal({ title, content, showCancel,  cancelText,  cancelColor,  confirmText,  confirmColor, complete }).then((res)=>resolve(res)).catch(err=>reject(err))
			}
			// #endif
			// #ifndef APP-PLUS
			return this.uniShowModal({ title, content, showCancel,  cancelText,  cancelColor,  confirmText,  confirmColor, complete }).then((res)=>resolve(res)).catch(err=>reject(err))
			// #endif
	    })
	}

	// 原生showModal
	static uniShowModal({ title,  content,  showCancel,  cancelText,  cancelColor,  confirmText,  confirmColor, complete  }) {
		return new Promise((resolve, reject) => {
			let appPlatform = null;
			// #ifdef APP-PLUS
			if (this.get_app_platform() === 'android' && showCancel) { // android的确认按钮在左边，需要统一到右边
				appPlatform = 'android';
				var tempConfirmText = confirmText;
				var tempConfirmColor = confirmColor;
				confirmText = cancelText;
				cancelText = tempConfirmText;
				confirmColor = cancelColor;
				cancelColor = tempConfirmColor;
			}
			// #endif
		    uni.showModal({ title, content, showCancel, cancelText, cancelColor, confirmText, confirmColor,
		        success(res){
		            if (complete) {
		                resolve(res);
		            } else if (res.confirm) {
		                appPlatform === 'android' ? reject(res) : resolve(res)
		            } else {
						appPlatform === 'android' ? resolve(res) : reject(res)
		            }
		        },
		        fail(err){ reject(err) }
		    })
		})
	}

	/**
	 * @description 获取app平台(android | ios)
	 * */
	static get_app_platform() {
		// #ifndef APP-PLUS
		this.showModal({ content: '仅支持app' });
		// #endif
		// #ifdef APP-PLUS
		return plus.os.name.toLowerCase(); 
		// #endif
	}
}
