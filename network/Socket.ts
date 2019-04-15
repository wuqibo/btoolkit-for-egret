module btoolkit.network {
	export class Socket extends egret.DisplayObject {

		private socket: egret.WebSocket;
		private static instance: Socket;

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
		public connect(serverIP: string, serverPort: number): void {
			if (this.socket.connected) return;
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
		 * 发送Socket消息，接收使用:SocketManager.getInstance().addEventListener(SocketProtocol.ReceiveMsg,(e:SocketProtocol<any>)=>{},this);
		 */
		public send<T>(protocolId: number, data: T): void {
			if (this.socket.connected) {
				let protocols = new SocketProtocol<T>();
				protocols.id = protocolId;
				protocols.data = data;
				this.socket.writeUTF(JSON.stringify(protocols));
			} else {
				console.error("Socket未建立连接");
			}
		}

		onConnected(): void {
			console.log("Socket已连接");
		}

		onIOError(): void {
			console.log("IO出错");
		}

		onReceiveMsg(): void {
			var msg = this.socket.readUTF();
			console.log("收到服务器消息:" + msg);
			let protocols: SocketProtocol<any> = JSON.parse(msg);
			try {
				this.dispatchEvent(protocols);
			} catch (error) {
				console.error("网络事件：" + protocols.id + "-处理错误");
			}
		}

		onDisconnected(): void {
			console.log("Socket已断开");
		}
	}

	export class SocketProtocol<T> extends egret.Event {
		public static ReceiveMsg = "ReceiveSocketMsg";
		public id: number;
		public data: T;
		public constructor() {
			super(SocketProtocol.ReceiveMsg);
		}
	}
}