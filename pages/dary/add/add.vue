<template>
	<view class="content-bg">
		<view class="dary-date flex-row from">
			<view class="day">{{from.darydate.day}}</view>
			<view class="up-down flex-column">
				<view class="week">{{from.darydate.year}}年</view>
				<view class="year-month"> {{from.darydate.month}}月 </view>
			</view>
		</view>
		<view class="dary-title">
			<input v-model="from.title" auto-height placeholder="今日城院标题!不能超过20个字哦~" maxlength="20" />
		</view>
		<view class="dary-text">
			<textarea style="width: 100%;" v-model="from.content" placeholder="记录今日的城院日记鸭!" maxlength="200"></textarea>
		</view>
		<view class="locationMessage">
			<text style="color: royalblue;">{{from.locations}}</text>
		</view>
		<view class="add-image flex-row">
			<view class="imge" v-for="(item , i) in from.imaging" :key="i" @longpress="removeImage(i)">
				<image :src="item" @click="previewImag(i)">
				</image>
			</view>
			<image @click="addImage" :src="images"></image>
		</view>
		<view class="columnLine"></view>
		<view class="operation flex-row">
			<view class="icon-text flex-column" @click="addVideo">
				<image src="@/static/video.png" style="width: 50rpx;height: 50rpx;"></image>
				<text>添加视频</text>
			</view>
			<view class="icon-text flex-column" @click="addAudio">
				<image src="@/static/audio.png" style="width: 50rpx;height: 50rpx;"></image>
				<text>添加音频</text>
			</view>
			<view class="icon-text flex-column" @click="getLocations">
				<image src="@/static/location.png" style="width: 50rpx;height: 50rpx;"></image>
				<text>添加定位</text>
			</view>
		</view>
		<view class="columnLine"></view>
		<view class="operation-result flex-column">
			<video :src="from.video" style="width: 100%; height: 300rpx; padding: 10rpx;" v-if="from.video"></video>
			<audio :src="from.audio" controls :name="from.audioName" :poster="audio_bg" style=" margin: 10rpx;"
				v-if="from.audio"></audio>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				audio_bg: '../../../static/audio.png',
				images: "../../../static/img-bg.png",
				from: {
					content: "",
					title: "",
					userId: "",
					darydate: {
						year: "",
						month: "",
						day: ""
					},
					imaging: [],
					video: "",
					audio: "",
					audioName: "",
					locations: ""
				},
			}
		},
		methods: {
			addImage: function(e) {
				uniCloud.chooseAndUploadFile({
					type: 'image',
					//文件数量，默认9
					count: 9,
					//文件类型，压缩, 'compressed'或者原图
					sizeType: ['original'],
					//文件来源 相册or相机
					sourceType: ['album','camera'],
					// extension: ['.png','.jpg']
				}).then(res => {
					console.log("--------------res------------------");
					console.log(res);
					var img = ""
					img = res.tempFiles[0].url;
					this.from.imaging.push(img);
					// this.imaging = res.tempFiles[i]
				}).catch(err => {
					console.log("--------------err------------------");
					console.log(err)
				})
			},
			previewImag: function(index) {
				console.log("--------------previewImag------------------");
				console.log(index);
				uni.previewImage({
					urls: this.from.imaging,
					current: index,
					success: function(e) {
						console.log(e)
					}
				})
				console.log("--------------有执行到这里------------------");
			},
			removeImage: function(index) {
				var that = this;
				uni.showActionSheet({
					itemList: ['删除图片'],
					success: function(e) {
						if (e.tapIndex == 0) {
							//splice(位置,要删除的数量)
							that.from.imaging.splice(index, 1);
						}
					}
				})

			},
			addVideo: function(e) {
				console.log("点击了添加视频")
				uniCloud.chooseAndUploadFile({
					type: 'video',
					camera: 'back',
					compressed: false,
					//文件来源 相册or相机
					sourceType: ['album', 'camera']
				}).then(res => {
					console.log("--------------添加视频res------------------");
					console.log(res);
					// var video1 = ""
					// video1 = res.tempFiles[0].url;
					// this.from.video.push(video1);
					this.from.video = res.tempFiles[0].url;
					// this.imaging = res.tempFiles[i]
					console.log(res.tempFiles[0].url);
				}).catch(err => {
					console.log("--------------添加视频err------------------");
					console.log(err)
				})
			},

			addAudio: function(e) {
				console.log("点击了添加音频")
				uniCloud.chooseAndUploadFile({
					type: 'all'
				}).then(res => {
					console.log("--------------添加音频res------------------");
					console.log(res);
					this.from.audio = res.tempFiles[0].url;
					this.from.audioName = res.tempFiles[0].name;
					console.log(res.tempFiles[0].url);
				}).catch(err => {
					console.log("--------------添加音频err------------------");
					console.log(err)
				})
			},
			getLocations: function(e) {
				console.log("=====点击了获取位置=====")
				uni.getLocation({
					type: 'wgs84',
					fail: (e) => {
						console.log("======fail====getLocation========")
						console.log(e)
					},
					success: (e) => {
						console.log("=======getLocation========")
						console.log(e)
						uni.chooseLocation({
							success: (e) => {
								console.log("=======chooseLocation========")
								console.log(e)
								this.from.locations = e.address
							}
						})
					}
				})

			}
		},
		onLoad() {
			console.log("--------------当前日期-------------------");
			let date = new Date();
			var years = date.getFullYear();
			var months = date.getMonth() + 1;
			var days = date.getDate();
			this.from.darydate.year = years;
			this.from.darydate.month = months;
			this.from.darydate.day = days;
			let that = this;
			uni.getStorage({
				key: 'userLogin',
				success: function(res) {
					that.from.userId = res.data[0]._id
				},
				fail: (err) => {
					console.log(err);
				}
			});
		},
		onNavigationBarButtonTap(e) {
			console.log("--------添加操作--------");
			uniCloud.callFunction({
				name: "addDary",
				data: this.from,
				success: (e) => {
					console.log("---成功添加日记---" + JSON.stringify(e));
					uni.showToast({
						title: "城院日记添加成功啦~",
						duration: 2000
					});
					setTimeout(function() {
						uni.switchTab({
							url: '/pages/tabbar/index/index',
						})
					}, 2000)
				}
			})
		},
	}
</script>

<style>
	@import '@/lib/css/add.css';
</style>
