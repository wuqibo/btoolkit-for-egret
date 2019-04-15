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

		private onConnected(): void {
			console.log("Socket已连接");
			if (this.connectedCallback != null) {
				this.connectedCallback();
			}
		}

		private onIOError(): void {
			console.log("IO出错");
			if(this.connectErrCallback){
				this.connectErrCallback();
			}
		}

		private onReceiveMsg(): void {
			var msg = this.socket.readUTF();
			console.log("收到服务器消息:" + msg);
			let protocol: SocketProtocol<any> = JSON.parse(msg);
			try {
				this.dispatchEvent(protocol);
			} catch (error) {
				console.error("网络事件：" + protocol.id + "-处理错误");
			}
		}

		private onDisconnected(): void {
			console.log("Socket已断开");
			if (this.disconnectedCallback != null) {
				this.disconnectedCallback();
			}
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