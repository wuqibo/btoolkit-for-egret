module btoolkit.components {
	export class FramesPlayer extends eui.Image {

		private textures: egret.Texture[] = [];
		public framesCount = 0;
		public currFrameIndex = 0;
		public fps = 12;
		private timer: egret.Timer;
		private delay = 0;

        /**
		 * 开始设置动画属性
		 * @textureName：已经预加载过的(xxx.res.json里配置的)图片名称
		 */
		public setAnimation(texture: egret.Texture, colCount: number, rowCount: number, fps: number = 6, autoPlay: boolean = true): void {
			let srcBitmap: egret.Bitmap = new egret.Bitmap(texture);
			let frameCount = colCount * rowCount;
			let frameWidth = srcBitmap.width / colCount;
			let frameHeight = srcBitmap.height / rowCount;
			this.textures = btoolkit.TextureUtils.cutTile(srcBitmap, colCount, rowCount, 0, frameCount, frameWidth, frameHeight);
			if (this.textures && this.textures.length > 0) {
				this.fps = fps;
				this.delay = 1000 / this.fps;
				this.currFrameIndex = 0;
				this.framesCount = this.textures.length;
				this.texture = this.textures[this.currFrameIndex];
				this.width = frameWidth;
				this.height = frameHeight;
				//锚点移动到中心
				let originX = this.x;
				let originY = this.y;
				this.anchorOffsetX = this.width * 0.5;
				this.anchorOffsetY = this.height * 0.5;
				this.x = originX;
				this.y = originY;
				if (autoPlay) {
					this.play();
				}
			}
		}

        /**
		 * 开始播放
		 */
		public playFromFrame(frameIndex: number): void {
			this.currFrameIndex = frameIndex;
			this.play();
		}

		/**
		 * 开始播放
		 */
		public play(): void {
			if (!this.isTexturesReady()) {
				return;
			}
			if (!this.timer) {
				this.timer = new egret.Timer(this.delay);//TODO:Engine5.2.16循环设为0时不起作用
				this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
			}
			this.timer.start();
		}

		/**
		 * 停止播放
		 */
		public stop(): void {
			if (!this.isTexturesReady()) {
				return;
			}
			if (this.timer) {
				this.timer.stop();
			}
		}

		private onTimer(): void {
			this.texture = this.textures[this.currFrameIndex];
			this.currFrameIndex++;
			if (this.currFrameIndex > this.textures.length - 1) {
				this.currFrameIndex = 0;
			}
		}

		private isTexturesReady(): boolean {
			if (!this.textures || this.textures.length == 0) {
				console.error("序列图尚未准备好，请调用setAnimation()方法设置");
				return false;
			}
			return true;
		}

	}
}