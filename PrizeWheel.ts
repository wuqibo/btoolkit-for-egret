module btoolkit {
	export class PrizeWheel {

		private group: eui.Group;
		private agent: egret.DisplayObject = new egret.DisplayObject();
		private canDecelerationListen = false;
		private canDeceleration = false;
		private angleOffset: number;
		private stopAngle = 0;
		private stopRounds = 1;
		private decelA = 0;
		private maxSpeed = 0;
		private onStopped: Function;

		public constructor(group: eui.Group, angleOffset: number = 0) {
			this.group = group;
			this.angleOffset = angleOffset;
		}

        /**
		 * 开始旋转
		 * @accelerateDuration:加速时间（秒）
		 * @maxSpeed:最高速度
		 */
		public startRotate(accelerateDuration: number, maxSpeed: number): void {
			this.canDecelerationListen = false;
			this.canDeceleration = false;
			this.maxSpeed = maxSpeed;
			this.agent.x = 0;
			egret.Tween.get(this.agent).to({ x: maxSpeed }, accelerateDuration * 1000, egret.Ease.sineIn);
			this.group.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
		}

		/**
		 * 停止旋转
		 * @stopAngle:停止时的角度
		 * @rounds:减速期所用的圈数
		 */
		public stopRotate(stopAngle: number, rounds: number, onStopped: Function): void {
			this.stopAngle = stopAngle;
			this.stopRounds = rounds;
			this.onStopped = onStopped;
			this.canDecelerationListen = true;
		}

		private onEnterFrame(): void {
			let speed = this.agent.x;
			this.group.rotation += speed;
			if (!this.canDeceleration) {
				if (this.canDecelerationListen) {
					let currSpeedAbs = Math.abs(speed);
					let includedAngle = this.getToTargetIncludedAngle();
					if (includedAngle > -currSpeedAbs && includedAngle < currSpeedAbs) {
						this.group.rotation -= speed * 0.5;
						let s = this.stopRounds * 360 + includedAngle;//停止所用总路程
						this.decelA = Math.pow(currSpeedAbs, 2) / (2 * s);
						this.canDeceleration = true;
					}
				}
			} else {
				if (this.maxSpeed > 0) {
					this.agent.x -= this.decelA;
					if (this.agent.x < 0) {
						this.agent.x = 0;
						this.onStopRotate();
					}
				} else {
					this.agent.x += this.decelA;
					if (this.agent.x > 0) {
						this.agent.x = 0;
						this.onStopRotate();
					}
				}
			}
		}

		private onStopRotate(): void {
			this.group.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
			if (this.onStopped) {
				this.onStopped();
			}
		}

		private getToTargetIncludedAngle(): number {
			let angle = 0;
			if (this.maxSpeed > 0) {
				let currAngle = this.getCurrAngle();
				while (this.stopAngle < currAngle) {
					currAngle -= 360;
				}
				angle = this.stopAngle - currAngle;
			}
			else {
				let currAngle = this.getCurrAngle();
				while (currAngle < this.stopAngle) {
					currAngle += 360;
				}
				angle = currAngle - this.stopAngle;
			}
			while (angle > 360) {
				angle -= 360;
			}
			return angle;
		}

		private getCurrAngle(): number {
			let angle = this.group.rotation - this.angleOffset;
			while (angle < 0) {
				angle += 360;
			}
			return angle;
		}

		private sineIn(t: number, b: number, c: number, d: number): number {
			return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
		}

	}
}