module btoolkit.components {
	/**
	 * 外部设置progressBarIndex和thumbIndex
	 */
	export class BSlider extends eui.Group {

		public maxProgressBarWidth = 500;
		public progressBarIndex = 1;
		public thumbIndex = 2;
		public progress = 0;
		private progress_bar: eui.Image;
		private thumb: eui.Image;
		private touchPreviousX = 0;
		private onProgressChange: Function;

		protected childrenCreated(): void {
			super.childrenCreated();
			this.progress_bar = this.getChildAt(this.progressBarIndex) as eui.Image;
			this.thumb = this.getChildAt(this.thumbIndex) as eui.Image;
			BComponent.setTargetAnchorToCenter(this.thumb);
			this.setProgress((this.thumb.x - this.progress_bar.x) / this.maxProgressBarWidth);
			this.thumb.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onThumbBegin, this);
			this.thumb.addEventListener(egret.TouchEvent.TOUCH_END, this.onThumbEnd, this);
			this.thumb.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onThumbEnd, this);
			this.thumb.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onThumbEnd, this);
		}

		private onThumbBegin(e: egret.TouchEvent): void {
			this.touchPreviousX = e.stageX;
			this.parent.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onThumbDrag, this);
		}

		private onThumbEnd(e: egret.TouchEvent): void {
			this.parent.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onThumbDrag, this);
		}

		private onThumbDrag(e: egret.TouchEvent): void {
			let delta = e.stageX - this.touchPreviousX;
			this.touchPreviousX = e.stageX;
			this.thumb.x += delta;
			if (this.thumb.x < this.progress_bar.x) {
				this.thumb.x = this.progress_bar.x;
			} else if (this.thumb.x > this.progress_bar.x + this.maxProgressBarWidth) {
				this.thumb.x = this.progress_bar.x + this.maxProgressBarWidth;
			}
			this.progress_bar.width = this.thumb.x - this.progress_bar.x;
			this.progress = this.progress_bar.width / this.maxProgressBarWidth;
			if (this.onProgressChange) {
				this.onProgressChange(this.progress);
			}
		}

        /**
		 * 设置初始进度（0-1）
		 */
		public setProgress(progress: number): void {
			this.progress = progress;
			if (this.progress < 0) {
				this.progress = 0;
			} else if (this.progress > 1) {
				this.progress = 1;
			}
			this.progress_bar.width = this.maxProgressBarWidth * this.progress;
			this.thumb.x = this.progress_bar.x + this.progress_bar.width;
			if (this.onProgressChange) {
				this.onProgressChange(this.progress);
			}
		}

        /**
		 * 返回参数：进度（0-1）
		 */
		public setProgressChangeEvent(onProgressChange: Function): void {
			this.onProgressChange = onProgressChange;
		}

	}
}