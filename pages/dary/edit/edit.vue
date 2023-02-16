<template>
	<view class="content-bg">
		<view class="dary-date flex-row from" v-if="darydate">
			<view class="day">{{darydate.day}}</view>
			<view class="up-down flex-column">
				<view class="week">{{darydate.month}}月</view>
				<view class="year-month">{{darydate.year}}年</view>
			</view>
		</view>
		<view class="dary-title">
			<input type="text" v-model="title" auto-height placeholder="今日城院标题!" />
		</view>
		<view class="dary-text">
			<textarea type="text" v-model="content" auto-height placeholder="记录今日的城院日记鸭!"></textarea>
		</view>
		<view class="locationMessage">
			<text style="font-size: 35rpx; color: blue; " v-if="locations">@ </text>
			<text style="color: royalblue;">{{locations}}</text>
		</view>
		<view class="images" v-for="(item , i) in imaging" :key="i">
			<image :src="item" style="margin: 10rpx; border: 3rpx solid #ccc; width: 100%;"></image>
		</view>
		<view class="videos" v-if="video">
			<video :src="video" style="width: 100%; height: 300rpx;"></video>
		</view>
		<view class="audios" v-if="audio">
			<audio :src="audio" controls :name="audioName" :poster="audio_bg" style="width: 100%;"></audio>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				audio_bg: '../../../static/audio.png',
				daryid: "",
				content: "",
				title: "",
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
			}
		},
		onLoad(opt) {
			console.log('编辑的id' + opt.daryid);
			this.getDateById(opt.daryid);

		},
		methods: {
			getDateById: function(_id) {
				console.log("----数据加载中----");
				uniCloud.callFunction({
					name: "getDaryById",
					data: {
						"daryid": _id
					},
					success: (e) => {
						this.title = e.result.data[0].title;
						this.content = e.result.data[0].content;
						this.daryid = e.result.data[0]._id;
						this.darydate = e.result.data[0].darydate;
						this.video = e.result.data[0].video;
						this.imaging = e.result.data[0].imaging;
						this.audio = e.result.data[0].audio;
						this.audioName = e.result.data[0].audioName;
						this.locations = e.result.data[0].locations;

					}
				})
			}
		},
		onNavigationBarButtonTap() {
			console.log("--------编辑操作操作--------");
			uniCloud.callFunction({
				name: 'editDary',
				data: {
					"daryid": this.daryid,
					"title": this.title,
					"content": this.content

				},
				success: (e) => {
					uni.showToast({
						title: '修改成功了yo~',
						duration: 2000
					});
					setTimeout(function(){
						uni.switchTab({
							url: '/pages/tabbar/index/index'
						})
					},2000)
				},
				fail: (err) => {
					console.log(err)
				}
			})
		},
	}
</script>

<style>
	@import '@/lib/css/add.css';
</style>
