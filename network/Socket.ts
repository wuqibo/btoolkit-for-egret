module btoolkit.network {
	export class Socket extends egret.DisplayObject {

		private socket: egret.WebSocket;
		private static instance: Socket;
		public get isConnected() {
			return this.socket.connected;
		}
		private connectedCallback: Function;
		private connectErrCallback: Function;
		private disconnectedCallback: Function;
		private receiveEvent: Function;

		public static getInstance(): Socket {
			if (!this.instance) {
				this.instance = new Socket();
			}
			return this.instance;
		}

		private constructor() {
			super();
			this.socket = new egret.WebSocket();
			this.socket.type = egret.WebSocket.TYPE_BINARY;//以二进制传输(默认为字符串)
			this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMsg, this);
			this.socket.addEventListener(egret.Event.CONNECT, this.onConnected, this);
			this.socket.addEventListener(egret.Event.CLOSE, this.onDisconnected, this);
			this.socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onIOError, this);
		}

		/**
		* 开始连接服务器
		*/
		public connect(serverIP: string, serverPort: number, connectedCallback: Function, connectErrCallback: Function, disconnectedCallback: Function): void {
			if (this.socket.connected) return;
			this.connectedCallback = connectedCallback;
			this.connectErrCallback = connectErrCallback;
			this.disconnectedCallback = disconnectedCallback;
			this.socket.connect(serverIP, serverPort);
		}

		/**
		* 断开服务器
		*/
		public disconnect(): void {
			if (this.socket.connected) {
				this.socket.close();
			}
		}

		/**
		 * 注册消息回调(返回数据类型：egret.ByteArray)
		 */
		public setReceiveEvent(callback: Function): void {
			this.receiveEvent = callback;
		}

		/**
		 * 发送Socket消息（先调用addProtocolListener()方法监听回调）
		 */
		public sendBytes(bytes: egret.ByteArray): void {
			if (this.socket.connected) {
				this.socket.writeBytes(bytes, 0, bytes.bytesAvailable);
				this.socket.flush();
			} else {
				console.error("Socket未建立连接");
			}
		}

		private onConnected(): void {
			console.log("Socket已连接");
			if (this.connectedCallback != null) {
				this.connectedCallback();
			}
		}

		private onIOError(): void {
			console.log("IO出错");
			if (this.connectErrCallback) {
				this.connectErrCallback();
			}
		}

		private onDisconnected(): void {
			console.log("Socket已断开");
			if (this.disconnectedCallback != null) {
				this.disconnectedCallback();
			}
		}

		private onReceiveMsg(): void {
			let bytes = new egret.ByteArray();
			this.socket.readBytes(bytes);
			if(this.receiveEvent){
				this.receiveEvent(bytes);
			}
		}
	}
}