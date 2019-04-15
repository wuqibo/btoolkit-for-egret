module btoolkit {
	export class BUtils {
        /**
         * Date格式化
         */
        public static dateFormat(date: Date): string {
            let newDate = new Date(date.toString())
            let textStr = newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getDate();
            textStr += " " + newDate.getHours() + ":" + newDate.getMinutes() + ":" + newDate.getSeconds();
            return textStr;
        }

		/**
         * 复制到系统剪贴板
         */
		public static copyToSystemClipboard(content: string): void {
			let copy = document.createElement("input");
			copy.value = content;
			document.body.appendChild(copy);
			copy.select();
			copy.setSelectionRange(0, copy.value.length), document.execCommand('Copy');
			document.body.removeChild(copy);
		}

		/**
         * 获取时间戳（单位：秒）
         */
        public static getTimeStamp(): number {
            let timeStamp = Date.now() - new Date(1970, 1, 1, 0, 0, 0, 0).getMilliseconds();
            return Math.round(timeStamp / 1000);
        }
	}
}