module btoolkit.network {
	export class Socket extends egret.DisplayObject {

		private socket: egret.WebSocket = new egret.WebSocket();
		private static instance: Socket;

		public static getInstance(): Socket {
			if (!this.instance) {
				this.instance = new Socket();
			}
			return this.instance;
		}

		/**
		* 开始连接服务器
		*/
		public connect(serverIP: string, serverPort: number): void {
			if (this.socket.connected) return;
			this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMsg, this);
			this.socket.addEventListener(egret.Event.CONNECT, this.onConnected, this);
			this.socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onIOError, this);
			this.socket.addEventListener(egret.Event.CLOSE, this.onDisconnected, this);
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
				let protocol = new SocketProtocol<T>();
				protocol.id = protocolId;
				protocol.data = data;
				this.socket.writeUTF(JSON.stringify(protocol));
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
			let protocol: SocketProtocol<any> = JSON.parse(msg);
			try {
				this.dispatchEvent(protocol);
			} catch (error) {
				console.error("网络事件：" + protocol.id + "-处理错误");
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