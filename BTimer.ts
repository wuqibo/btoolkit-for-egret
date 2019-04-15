module btoolkit {
	export class BTimer {

		private onTimerCallback: Function;
		private onFinishCallback: Function;
		private timer: egret.Timer;

		/**
		 * 每隔几秒执行方法（注意判断回调时对象是否仍然存在,可保存返回对象后配合stop()使用,times为0表示不断循环）
		 */
		public static start(delay: number, times: number, onTimerCallback: Function, onFinishCallback?: Function): BTimer {
			let bTimer = new BTimer(delay, times, onTimerCallback, onFinishCallback);
			return bTimer;
		}

		public constructor(delay: number, times: number, onTimerCallback: Function, onFinishCallback?: Function) {
			this.onTimerCallback = onTimerCallback;
			this.onFinishCallback = onFinishCallback;
			this.timer = new egret.Timer(delay * 1000, times);
			this.timer.addEventListener(egret.TimerEvent.TIMER, () => {
				if (this.onTimerCallback) {
					this.onTimerCallback();
				}
			}, this);
			this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
				if (this.onFinishCallback) {
					this.onFinishCallback();
				}
			}, this);
			this.timer.start();
		}

		public stop(): void {
			if (this.onTimerCallback) {
				this.timer.removeEventListener(egret.TimerEvent.TIMER, this.onTimerCallback, this);
			}
			if (this.onFinishCallback) {
				this.timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onFinishCallback, this);
			}
			this.timer.stop();
		}

	}
}