module btoolkit {
	export class MD5 {
		/**
		 * MD5加密
		 */
		public static encrypt(input: string): string {
			return CryptoJS.MD5(input).toString();
		}
	}
}