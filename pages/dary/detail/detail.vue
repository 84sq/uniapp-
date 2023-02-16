<template>
	<view class="content-bg">
		<view class="user-message">
			<view class="dary-title"> {{from.title}}</view>
			<view class="dary-detail">
				<text> {{from.content}}</text>
			</view>
			<view class="images flex-row">
				<view v-for="(item , i) in from.imaging" :key="i">
					<image @click="previewImag(i)" :src="item"
						style="margin: 10rpx; border: 3rpx solid #ccc; width: 200rpx; height: 200rpx;"></image>
				</view>
			</view>
			<view class="locationMessage">
				<text style="font-size: 35rpx; color: blue; " v-if="from.locations">@ </text>
				<text>{{from.locations}}</text>
			</view>
			<view class="videos" v-if="from.video">
				<video :src="from.video" style="width: 100%; height: 300rpx;"></video>
			</view>
			<view class="audios" v-if="from.audio">
				<audio :src="from.audio" controls :name="from.audioName" :poster="audio_bg"
					style="width: 100%;"></audio>
			</view>
			<view class="bottom flex-row" v-if="from.darydate">
				<view class="dary-date">{{from.darydate.year}}年{{from.darydate.month}}月{{from.darydate.day}}日</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				video_show: true,
				audio_show: true,
				audio_bg: '../../../static/audio.png',
				from: {}
			}
		},
		onLoad(opt) {
			console.log('编辑的id' + opt.daryid);
			this.getDateById(opt.daryid);
			uni.setStorage({
				key: 'daryid',
				data: opt.daryid,
				success: function() {
					console.log('success');
				}
			});
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
						console.log(e.result);
						console.log(e.result.data[0].title);
						this.from = e.result.data[0];
					}
				})
			},
			previewImag: function(index) {
				uni.previewImage({
					urls: this.from.imaging,
					current: index,
					success: function(e) {
						console.log("打开预览了")
					}
				})
			}

		},
		onNavigationBarButtonTap: function(_id) {
			uni.getStorage({
				key: 'daryid',
				success: function(res) {
					console.log(res.data);
					_id = res.data;
				}
			});
			uni.showActionSheet({
				itemList: ['编辑', '删除'],
				success: function(res) {
					if (res.tapIndex == 0) {
						console.log("点击了编辑的按钮");
						uni.navigateTo({
							url: '/pages/dary/edit/edit?daryid=' + _id
						})
					} else if (res.tapIndex == 1) {
						console.log("执行删除操作");
						uni.showModal({
							title: '确定要删除日记吗？',
							content: '删除后不可恢复',
							success: function(res) {
								if (res.confirm) {
									uniCloud.callFunction({
										name: 'daryDel',
										data: {
											"daryid": _id
										},
										success: (e) => {
											console.log(e);
										}
									})
									uni.showToast({
										title: '删除成功',
										duration: 2000
									});
									setTimeout(function() {
										uni.switchTab({
											url: '/pages/tabbar/index/index'
										}, 2000)
									})
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}
						});


					} else {
						console.log("取消")
					}
				},
				fail: function(err) {
					console.log(err)
				}
			})
		}
	}
</script>

<style>
	@import url('@/lib/css/detail.css');
</style>
