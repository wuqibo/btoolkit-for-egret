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
<<<<<<< HEAD
		private receiveEvent: Function;
=======
>>>>>>> 3b0cd78e7aae72c1f81b44ec34f98248415baae1

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
<<<<<<< HEAD
=======
<<<<<<< HEAD
				this.socket.writeBytes(bytes, 0, bytes.bytesAvailable);
				this.socket.flush();
=======
>>>>>>> d7bef314aa04134b4515b01fa5f91e95bb85aa56
				let protocols = new SocketProtocol<T>();
				protocols.id = protocolId;
				protocols.data = data;
				this.socket.writeUTF(JSON.stringify(protocols));
<<<<<<< HEAD
=======
>>>>>>> 3b0cd78e7aae72c1f81b44ec34f98248415baae1
>>>>>>> d7bef314aa04134b4515b01fa5f91e95bb85aa56
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
<<<<<<< HEAD
			if (this.connectErrCallback) {
				this.connectErrCallback();
=======
			if(this.connectErrCallback){
				this.connectErrCallback();
			}
		}

		private onReceiveMsg(): void {
			var msg = this.socket.readUTF();
			console.log("收到服务器消息:" + msg);
			let protocols: SocketProtocol<any> = JSON.parse(msg);
			try {
				this.dispatchEvent(protocols);
			} catch (error) {
				console.error("网络事件：" + protocols.id + "-处理错误");
<<<<<<< HEAD
=======
>>>>>>> 3b0cd78e7aae72c1f81b44ec34f98248415baae1
>>>>>>> d7bef314aa04134b4515b01fa5f91e95bb85aa56
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