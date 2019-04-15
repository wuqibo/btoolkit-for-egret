module btoolkit.components {
	/**
	 * 控件用于拖入exml文件里编辑复用，故在exml里设置skinName标签
	 */
	export class BComponent extends eui.Component {

		public autoAnchorToCenter = false;
		public showScaleX = 1;
		public showScaleY = 1;
		private isSkinComleted = false;
		private isChildrenCreated = false;
		private onParamsPreparedCallback: Function;

		public constructor() {
			super();
			this.scaleX = 0;
			this.scaleY = 0;
			this.addEventListener(egret.Event.COMPLETE, this.onSkinComleted, this);
			this.addEventListener(egret.Event.ENTER_FRAME, this.paramsListen, this);
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		}

		private onSkinComleted(): void {
			this.isSkinComleted = true;
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.isChildrenCreated = true;
		}

		private paramsListen(): void {
			if (this.width > 0 && this.isSkinComleted && this.isChildrenCreated) {
				this.removeEventListener(egret.Event.ENTER_FRAME, this.paramsListen, this);
				this.scaleX = this.showScaleX;
				this.scaleY = this.showScaleY;
				if (this.autoAnchorToCenter) {
					BComponent.setTargetAnchorToCenter(this);
				}
				this.onParamsPrepared();
				if (this.onParamsPreparedCallback) {
					this.onParamsPreparedCallback();
				}
			}
		}

		public static setTargetAnchorToCenter(target: egret.DisplayObject) {
			let originX = target.x;
			let originY = target.y;
			let originAnchorX = target.anchorOffsetX;
			let originAnchorY = target.anchorOffsetY;
			target.anchorOffsetX = target.width * 0.5;
			target.anchorOffsetY = target.height * 0.5;
			target.x += (target.anchorOffsetX - originAnchorX) * target.scaleX;
			target.y += (target.anchorOffsetY - originAnchorY) * target.scaleX;
		}

		protected onParamsPrepared(): void { }
		protected onAddToStage(): void { }
		protected onRemoveFromStage(): void { }

		/**
		 * 在该组件执行onParamsPrepared()方法后调用
		 */
		public setParamsPreparedCallback(callback: Function): void {
			this.onParamsPreparedCallback = callback;
		}

	}
}