module btoolkit.components {
	export class BButtonGroup extends eui.Group {

		public index = 0;
		public autoAnchorToCenter = true;
		public canScale: boolean = true;
		public scaleRatio = 0.96;
		private onClick: Function;
		private defaultScaleX: number;
		private defaultScaleY: number;
		private isChildrenCreated = false;
		private onParamsPreparedCallback: Function;

		public constructor() {
			super();
			this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.scaleChange, this);
			this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchUp, this);
			this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.scaleResume, this);
			this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.scaleResume, this);
			this.addEventListener(egret.Event.ENTER_FRAME, this.paramsListen, this);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.isChildrenCreated = true;
		}

		private paramsListen(): void {
			if (this.width > 0 && this.isChildrenCreated) {
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
			//继承eui.Group需要再次判断touchEnabled，继承eui.Button则不需要
			if (this.touchEnabled) {
				if (this.canScale) {
					this.scaleX = this.defaultScaleX * this.scaleRatio;
					this.scaleY = this.defaultScaleY * this.scaleRatio;
				}
			}
		}

		private onTouchUp(): void {
			if (this.touchEnabled) {
				if (this.onClick != null) {
					this.onClick(this.index);
				}
				this.scaleResume();
			}
		}

		private scaleResume(): void {
			//继承eui.Group需要再次判断touchEnabled，继承eui.Button则不需要
			if (this.touchEnabled) {
				this.scaleX = this.defaultScaleX;
				this.scaleY = this.defaultScaleY;
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
	}
}