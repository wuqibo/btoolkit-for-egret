module btoolkit.math {
	export class Line {

		public k: number;
		public b: number;
		public x1: number;
		public y1: number;
		public x2: number;
		public y2: number;
		public radian: number;

		public constructor(x1: number, y1: number, x2: number, y2: number) {
			this.x1 = x1;
			this.y1 = y1;
			this.x2 = x2;
			this.y2 = y2;
			this.k = (y2 - y1) / (x2 - x1);
			this.b = y1 - this.k * x1;
			this.radian = Math.atan2(y2 - y1, x2 - x1);
		}

		public Line(x1: number, y1: number, radian: number) {
			this.x1 = x1;
			this.y1 = y1;
			this.x2 = this.x1 + Math.cos(radian);
			this.y2 = this.y1 + Math.sin(radian);
			this.k = (this.y2 - this.y1) / (this.x2 - this.x1);
			this.b = y1 - this.k * x1;
			this.radian = radian;
		}

		public getX(y: number): number {
			return (y - this.b) / this.k;
		}

		public getY(x: number): number {
			return this.k * x + this.b;
		}
	}
}