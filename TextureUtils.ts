module btoolkit {
	export class TextureUtils {

        /**
		 * 下载网络图片（返回参数：egret.Texture）
		 */
		public static downloadTexture(url: string, onFinish: Function): void {
			let imgLoader: egret.ImageLoader = new egret.ImageLoader();
			imgLoader.crossOrigin = "anonymous";//跨域请求
			imgLoader.once(egret.Event.COMPLETE, (e: egret.Event) => {
				if (e.currentTarget && e.currentTarget.data) {
					let tex = new egret.Texture();
					tex.bitmapData = e.currentTarget.data;
					onFinish(tex);
				}else{
					onFinish(null);
				}
			}, this);
			imgLoader.load(url);
		}

        /**
		 * 图片(egret.Bitmap)转Base64
		 */
		public static bitmapToBase64(bitmap: egret.Bitmap, addImageHead: boolean = false): string {
			let renderTexture: egret.RenderTexture = new egret.RenderTexture();
			renderTexture.drawToTexture(bitmap, new egret.Rectangle(0, 0, bitmap.width, bitmap.height));
			let imageBase64 = renderTexture.toDataURL("image/jpeg");
			if (addImageHead) {
				return imageBase64;
			} else {
				let arr = imageBase64.split(',');
				return arr[1];
			}
		}

		/**
		 * Base64转图片(egret.Bitmap)
		 */
		public static base64ToBitmap(data: string): egret.Bitmap {
			let bitmap = new egret.Bitmap(this.base64ToTexture(data));
			return bitmap;
		}

		/**
		 * Base64转图片(egret.Bitmap)
		 */
		public static base64ToTexture(data: string): egret.Texture {
			let img = new Image();
			if (data.substr(0, 5) == "data:") {
				img.src = data;
			} else {
				img.src = "data:image/jpg;base64," + data;
			}
			let texture = new egret.Texture();
			texture.bitmapData = new egret.BitmapData(img);
			return texture;
		}

		/**
		 * 切割瓦片
		 * @srcBm 源图
		 * @maxCol 横向列数
         * @maxRow 纵向行数
         * @startPos 从第几张位置开始切(包含该位置)
         * @pieceNum 切多少张
         * @width tile宽度
         * @height tile高度
		 */
		public static cutTile(srcBitmap: egret.Bitmap, maxCol: number, maxRow: number, startPos: number, pieceNum: number, width: number, height: number): egret.Texture[] {
			var rect: egret.Rectangle = new egret.Rectangle();
			var cutCount: number = 0;
			var textureList: egret.Texture[] = [];
			for (var i = 0; i < maxRow; i++) {
				for (var j = 0; j < maxCol; j++) {
					if ((i * maxCol + j >= startPos) && cutCount <= pieceNum) {
						var renderTexture = new egret.RenderTexture();
						rect.x = j * width;
						rect.y = i * height;
						rect.width = width;
						rect.height = height;
						if (renderTexture.drawToTexture(srcBitmap, rect) == false) {
							console.error("cutTile >> cut error");
							return null;
						} else {
							textureList.push(renderTexture);
							cutCount++;
						}
					} else {
						return textureList;
					}
				}
			}
			return textureList;
		}
	}
}