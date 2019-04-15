module btoolkit.components {
	export class BButtonRect extends eui.Rect {

		public autoAnchorToCenter = true;
		public canScale: boolean = false;
		public scaleRatio = 0.96;
		private onPress: Function;
		private onRepress: Function;
		private onClick: Function;
		private defaultScaleX: number;
		private defaultScaleY: number;
		private onParamsPreparedCallback: Function;

		public constructor() {
			super();
			this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.scaleChange, this);
			this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchUp, this);
			this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.scaleResume, this);
			this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.scaleResume, this);
			this.addEventListener(egret.Event.ENTER_FRAME, this.paramsListen, this);
		}

		private paramsListen(): void {
			if (this.width > 0) {
				this.removeEventListener(egret.Event.ENTER_FRAME, this.paramsListen, this);
				this.defaultScaleX = this.scaleX;
				this.defaultScaleY = this.scaleY;
				if (this.autoAnchorToCenter) {
					BComponent.setTargetAnchorToCenter(this);
				}
				this.onParamsPrepared();
				if (this.onParamsPreparedCallback) {
					this.onParamsPreparedCallback();
				}
			}
		}

		private scaleChange(): void {
			if (this.canScale) {
				this.scaleX = this.defaultScaleX * this.scaleRatio;
				this.scaleY = this.defaultScaleY * this.scaleRatio;
			}
			if(this.onPress){
				this.onPress();
			}
		}

		private onTouchUp(): void {
			if (this.onClick != null) {
				this.onClick();
			}
			this.scaleResume();
		}

		private scaleResume(): void {
			if (this.canScale) {
				this.scaleX = this.defaultScaleX;
				this.scaleY = this.defaultScaleY;
			}
			if(this.onRepress){
				this.onRepress();
			}
		}

		protected onParamsPrepared(): void { }

		/**
		 * 在该组件执行onParamsPrepared()方法后调用
		 */
		public setParamsPreparedCallback(callback: Function): void {
			this.onParamsPreparedCallback = callback;
		}

		/**
		 * 点击放开时回调，无参数
		 */
		public setClickEvent(onClick: Function): void {
			this.onClick = onClick;
		}

		/**
		 * 按下和放开的回调
		 */
		public setPressAndRepressEvent(onPress: Function,onRepress: Function): void {
			this.onPress = onPress;
			this.onRepress = onRepress;
		}
	}
}