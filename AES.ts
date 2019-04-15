module btoolkit {
	export class AES {

		private static readonly key = "fANqOtuGLXmeKRz0dVctf25fI7wo4o40";
		private static readonly iv = "7MAIlToRV5uGDB40";

		/**
		* AES加密
		*/
		public static encrypt(input: string, key?: string): string {
			if(!input){
				return input;
			}
			if(!key){
				key = AES.key;
			}
			var _input = CryptoJS.enc.Utf8.parse(input);
			var _key = CryptoJS.enc.Utf8.parse(key);
			var _iv = CryptoJS.enc.Utf8.parse(AES.iv);
			var encrypted = CryptoJS.AES.encrypt(_input, _key, { iv: _iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
			return encrypted.ciphertext;
		}

		/**
		* AES解密
		*/
		public static decrypt(input: string, key?: string): string {
			if(!input){
				return input;
			}
			if(!key){
				key = AES.key;
			}
			var _input = CryptoJS.enc.Utf8.parse(input);
			var _key = CryptoJS.enc.Utf8.parse(key);
			var _iv = CryptoJS.enc.Utf8.parse(AES.iv);
			var decrypted = CryptoJS.AES.decrypt(_input, _key, { iv: _iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
			return decrypted.toString(CryptoJS.enc.Utf8);
		}
	}
}