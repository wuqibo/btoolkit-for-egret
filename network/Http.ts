module btoolkit.network {
	export class Http {
		
		/**
		 * 跨域访问：服务器配置：在response里添加
		 * response.setHeader("Access-Control-Allow-Origin", "*"); 
		 */

		public static timeout = 5;
		private url: string = "";

		public static newInstance(): Http {
			var httpManager = new Http();
			return httpManager;
		}

		/**
		 * 仅下载文本文件（任何后缀名），succeedCallback返回参数any，errorCallback返回无参数
		 */
		public loadText(url: string, succeedCallback: Function, errorCallback: Function = null): void {
			this.url = url;
			var request = new egret.HttpRequest();
			request.once(egret.Event.COMPLETE, (e: egret.Event) => {
				succeedCallback(request.response);
			}, null);
			request.once(egret.IOErrorEvent.IO_ERROR, (e: egret.IOErrorEvent) => {
				console.error("IOError(" + this.url + "): " + e);
				if (errorCallback != null) {
					errorCallback();
				}
			}, null);
			request.open(url, egret.HttpMethod.GET);
			request.send();
		}

		/**
		* Http的GET方式访问，succeedCallback返回参数any，errorCallback返回无参数
		*/
		public get(url: string, succeedCallback: Function, errorCallback: Function = null): void {
			this.url = url;
			var request = new egret.HttpRequest();
			request.responseType = egret.HttpResponseType.TEXT;
			request.open(url, egret.HttpMethod.GET);
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			request.addEventListener(egret.Event.COMPLETE, (e: egret.Event) => {
				succeedCallback(request.response);
			}, this);
			request.addEventListener(egret.IOErrorEvent.IO_ERROR, (e: egret.IOErrorEvent) => {
				console.error("IOError(" + this.url + "): " + e);
				if (errorCallback != null)
					errorCallback();
			}, this);
			request.send();
		}

		/**
		* Http的POST方式访问，succeedCallback返回参数any，errorCallback返回错误参数（e:egret.IOErrorEvent）
		*/
		public post(url: string, params: { [key: string]: Object }, succeedCallback: Function, errorCallback: Function = null): void {
			this.url = url;
			var request = new egret.HttpRequest();
			request.timeout = Http.timeout * 1000;
			request.responseType = egret.HttpResponseType.TEXT;
			request.open(url, egret.HttpMethod.POST);
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			request.addEventListener(egret.Event.COMPLETE, (e: egret.Event) => {
				succeedCallback(request.response);
			}, this);
			request.addEventListener(egret.IOErrorEvent.IO_ERROR, (e: egret.IOErrorEvent) => {
				console.error("IOError(" + this.url + "): " + e);
				if (errorCallback != null)
					errorCallback(e);
			}, this);
			var paramsStr = "";
			if (params != null) {
				for (var key in params) {
					paramsStr += ("&" + key + "=" + params[key]);
				}
			}
			paramsStr = paramsStr.substr(1, paramsStr.length);
			request.send(paramsStr);
		}
	}
}