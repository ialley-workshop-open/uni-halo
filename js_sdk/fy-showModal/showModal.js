/**
 * @description 替换android app的uni.showModal
 */

let modalIntance = null;
export class fyShowModal {
	constructor(options = {}) {
		modalIntance = this;
		
		this.modalControl = null; // 模态框句柄
		this.cancelModel = null;
		this.confirmModel = null;

		const { screenHeight, screenWidth } = uni.getSystemInfoSync();

		this.modalPaddingTop = 12; // modal顶部的内边距
		this.titleHeight = 34; // 标题的高度
		this.contentHeight = 60; // 内容得高度
		this.contentPaddingBottom = 10; // 内容的底部内边距
		this.footerHeight = 50; // 底部按钮的高度

		const modalHeight = this.modalPaddingTop + this.contentPaddingBottom + this.titleHeight + this.contentHeight + this.footerHeight; // 模态框内容高度

		this.screenHeight = screenHeight;
		this.modalWidth = options.contentWidth || screenWidth * 0.82; // 模态框内容宽度
		this.modalHeight = modalHeight; // 模态框内容高度
		this.modalLeft = (screenWidth - this.modalWidth) / 2; // 模态框距离左边距离
		this.modalTop = (screenHeight / 2) - (modalHeight / 2) - 30; // 模态框距离顶部距离
		this.titleTop = this.modalPaddingTop + this.modalTop; // title距离顶部的距离
		this.contentTop = this.modalPaddingTop + this.modalTop + this.titleHeight; // content距离顶部的距离
		this.contentLeft = this.modalLeft + (this.modalWidth * 0.1);
		this.contentWidth = this.modalWidth * 0.8; // 内容的宽度
		this.footerBorderTop = this.contentPaddingBottom + this.contentTop + this.contentHeight; // footer的边线距离顶部的距离
		this.buttonWidth = this.modalWidth/2;
		
		// 物理返回键是否关闭弹框
		this.backbutton = Boolean(options.backbutton);
		
		let opacity = options.opacity || 0.6; // mask透明度
		let modal_title = options.title || '提示'; // 标题
		let model_content = options.content || '提示内容'; // 提示内容
		let maskClick = typeof options.maskClick === 'undefined' ? false : options.maskClick; // 是否可以点击mask关闭模态框
		let cancelText = options.cancelText || '取消';
		let confirmText = options.confirmText || '确定';
		let cancelColor = options.cancelColor || '#000000';
		let confirmColor = options.confirmColor || '#3CC51F';
		let showCancel = typeof options.showCancel === 'undefined' ? true : options.showCancel; // 是否显示取消按钮
		let align = options.align || 'center'; // 内容对齐方向
		let successFn = () => {};
		let failFn = () => {};
		this.success = options.success || successFn; // 成功返回模态框
		this.fail = options.fail || failFn; // 失败返回模态框

		//#ifdef APP-PLUS
		this.creatView({ height: `${this.screenHeight}px`, top: 0 }, opacity, maskClick, { 'title': modal_title, 'content': model_content, cancelText, confirmText, confirmColor, cancelColor, showCancel, align });
		//#endif
	}
	//生成提示框view
	creatView(style, opa, maskClick, modelInfo) {
		try {
			style = { left: '0px', width: '100%', ...style };
			let view = new plus.nativeObj.View('FyShowModalView', style);
			view.draw([
				{ tag: 'rect', id: 'modal', color: `rgba(0,0,0,${opa})`, position: { top: '0px', left: '0px', width: '100%', height: '100%' } },
				{ tag: 'rect', id: 'content', color: `rgb(255,255,255)`, rectStyles: { borderWidth: '0px', radius: '8px' }, position: { top: this.modalTop+'px', left: this.modalLeft+'px', width: this.modalWidth+'px', height: this.modalHeight + 'px' } },

				{ tag: 'font', id: 'title', text: modelInfo.title, textStyles: { size: '18px', weight: 'bold', color: '#000000' }, position: { top: this.titleTop+'px', left: this.modalLeft+'px', width: this.modalWidth+'px', height: this.titleHeight+'px' } },

				{ tag: 'font', id: 'text', text: modelInfo.content, textStyles: { size: '15px', color: '#666', whiteSpace: 'normal', align: modelInfo.align }, position: { top: this.contentTop+'px', left: this.contentLeft+'px', width: this.contentWidth+'px', height: this.contentHeight+'px' } },

				{ tag: 'rect', id: 'line', color: '#efeff1', position: { top: this.footerBorderTop+'px', left: this.modalLeft+'px', width: this.modalWidth+'px', height: '1px' } },
				{ tag: 'rect', id: 'line2', color: '#efeff1', position: { top: this.footerBorderTop+'px', left: '50%', width: modelInfo.showCancel ? '1px' : '0px', height: modelInfo.showCancel ? this.footerHeight+'px' : '0px' } }
			]);

			// 取消按钮
			if (modelInfo.showCancel) {
				let viewCancel = new plus.nativeObj.View('FyShowModalCancel', { width: this.buttonWidth+'px', height: this.footerHeight+'px', top: this.footerBorderTop + 'px', left: this.modalLeft+'px' });
				viewCancel.draw([
					{ tag: 'rect', id: 'cancelBackground', color: `rgba(255,255,255,0)`, rectStyles: { borderWidth: '0px', radius: '8px' }, position: { top: '0px', left: '0px', width: '100%', height: '100%' } },
					{ tag: 'font', id: 'cancel', text: modelInfo.cancelText, textStyles: { color: modelInfo.cancelColor, size: '16px' } },
				]);
				viewCancel.addEventListener('click', (e) => {
					viewconfirm.drawRect({ color: 'rgba(255,255,255,0)', borderWidth: '0px', radius: '8px' }, {}, 'confirmBackground');
					viewCancel.drawRect('#efeff1', {top:'0px',left:'0px',width:'100%',height:'100%'}, 'cancelBackground');
					this.success({ confirm: false, cancel: true, mask: false })
					this.hide();
				}, false);
				viewCancel.addEventListener('touchstart', (e)=>{
					viewconfirm.drawRect({ color: 'rgba(255,255,255,0)', borderWidth: '0px', radius: '8px' }, {}, 'confirmBackground');
					viewCancel.drawRect({ color: '#efeff1', borderWidth: '0px', radius: '8px' }, {top:'0px',left:'0px',width:'100%',height:'100%'}, 'cancelBackground');
				})
				this.cancelModel = viewCancel;
			}

			// 确认
			let viewconfirm = new plus.nativeObj.View('FyShowModalConfirm', { width: modelInfo.showCancel ? this.buttonWidth+'px' : this.modalWidth+'px', height: this.footerHeight+'px', top: this.footerBorderTop + 'px', left: modelInfo.showCancel ? '50%' : this.modalLeft+'px' });
			// 绘制确认
			viewconfirm.draw([
				{ tag: 'rect', id: 'confirmBackground', color: `rgba(255,255,255,0)`, rectStyles: { borderWidth: '0px', radius: '8px' }, position: { top: '0px', left: '0px', width: '100%', height: '100%' } },
				{ tag: 'font', id: 'confirm', text: modelInfo.confirmText, textStyles: { color: modelInfo.confirmColor, size: '16px' } },
			]);
			// 点击确认
			viewconfirm.addEventListener('click', (e) => {
				if (this.cancelModel) {
					this.cancelModel.drawRect({ color: 'rgba(255,255,255,0)', borderWidth: '0px', radius: '8px' }, {}, 'cancelBackground');
				}
				viewconfirm.drawRect('#efeff1', {top:'0px',left:'0px',width:'100%',height:'100%'}, 'confirmBackground');
				this.success({ confirm: true, cancel: false, mask: false })
				this.hide();
			}, false);
			viewconfirm.addEventListener('touchstart', (e)=>{
				if (this.cancelModel) {
					this.cancelModel.drawRect({ color: 'rgba(255,255,255,0)', borderWidth: '0px', radius: '8px' }, {}, 'cancelBackground');
				}
				viewconfirm.drawRect({ color: '#efeff1', borderWidth: '0px', radius: '8px' }, {top:'0px',left:'0px',width:'100%',height:'100%'}, 'confirmBackground');
			})

			//点击蒙布
			if (maskClick) {
				view.addEventListener('click', (e) => {
					this.success({ confirm: false, cancel: true, mask: true })
					this.hide();
					if (this.cancelModel) {
						this.cancelModel.drawRect({ color: 'rgba(255,255,255,0)', borderWidth: '0px', radius: '8px' }, {}, 'cancelBackground');
					}
					viewconfirm.drawRect({ color: 'rgba(255,255,255,0)', borderWidth: '0px', radius: '8px' }, {}, 'confirmBackground');
				}, false);
			} else {
				view.addEventListener('click', (e) => {
					if (this.cancelModel) {
						this.cancelModel.drawRect({ color: 'rgba(255,255,255,0)', borderWidth: '0px', radius: '8px' }, {}, 'cancelBackground');
					}
					viewconfirm.drawRect({ color: 'rgba(255,255,255,0)', borderWidth: '0px', radius: '8px' }, {}, 'confirmBackground');
				}, false);
			}
			this.modalControl = view;
			this.confirmModel = viewconfirm;
		} catch(err) {
			this.fail(err);
		}
	}
	// 显示模态框
	show() {
		this.modalControl.show();
		if (this.cancelModel) {
			this.cancelModel.show();
		}
		this.confirmModel.show();
		
		if (this.backbutton) {
			plus.key.addEventListener('backbutton', this.handlerBackButton);
		}
	}
	// 关闭模态框
	hide() {
		if (this.backbutton) {
			plus.key.removeEventListener('backbutton', this.handlerBackButton);
		}
		this.modalControl.clear();
		if (this.cancelModel) {
			this.cancelModel.clear();
		}
		this.confirmModel.clear();
	}
	// 物理返回键方法
	handlerBackButton() {
		try {
			modalIntance && modalIntance.success({ confirm: false, cancel: true, mask: false })
			modalIntance && modalIntance.hide();
		} catch(err) {
			console.error(err)
		}
	}
}

export default fyShowModal;
