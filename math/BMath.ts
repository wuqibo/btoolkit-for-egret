module btoolkit.math {
	export class BMath {

		public static floorToString(value: number, decimals: number = 0): string {
			if (decimals == 0) {
				return Math.floor(value) + "";
			} else {
				let pointOffset: number = Math.pow(10, decimals);
				let a = value * pointOffset;
				let b = Math.floor(a);
				let c = b / pointOffset;
				return c.toFixed(decimals);
			}
		}

		public static random(min: number, max: number): number {
			return min + Math.random() * (max - min);
		}
	}
}