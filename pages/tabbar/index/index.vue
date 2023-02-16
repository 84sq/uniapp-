<template>
	<view class="body-content">
		<view class="user-title">
			<view class="user-image">
				<image :src="userImage ? userImage : defaulImage" @click="changeImage"></image>
			</view>
			<view class="nologinDisplay" @click="gotoLoginOrRegister" v-if="!userId">
				<view class="nologin">请前去登录或注册 ></view>
			</view>
			<view class="user-message" v-if="user">
				<view class="nickname">{{user.nickname}}</view>
				<view class="sign">
					<text>
						{{user.sign}}
					</text>
				</view>
			</view>
		</view>
		<scroll-view class="scrolly" scroll-y>
			<view class="dary-list" v-for="(item,i) in daryList" :key="i">
				<view class="dary-item" @click="daryDtail(item._id)">
					<view class="dary-image" v-if="item.imaging">
						<image :src="item.imaging[0] ? item.imaging[0] : images"></image>
					</view>
					<view class="item-right">
						<view class="dary-title">
							<view class="title">{{item.title}}</view>
							<view class="dary-content">
								<text>
									{{item.content}}
								</text>
							</view>
							<view class="dary-date" v-if="item.darydate">
								{{item.darydate.year}}-{{item.darydate.month}}-{{item.darydate.day}}
							</view>
						</view>

					</view>
				</view>
				<view class="operation flex-row">
					<view class="dary-operation">
						<view class="operation-item" @click="goodLike(item._id, item.goodState)">
							<view class="icon">
								<image :src="item.goodState ? good_select : good_image"></image>
							</view>
							<view class="text">点赞</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<view class="btn" @click="add">
			<image src="@/static/add.png"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				images: "../../../static/good.png",
				defaulImage: "../../../static/panda.png",
				daryList: [],
				user: [],
				userId: "",
				userImage: "",
				good_image: "../../../static/good.png",
				good_select: "../../../static/good-select.png"

			}
		},
		onLoad() {
			this.getDate();
		},
		onShow() {
			this.getDate();
		},
		methods: {
			daryDtail: function(_id) {
				uni.navigateTo({
					url: '../../dary/detail/detail?daryid=' + _id
				});

			},
			gotoLoginOrRegister: function(e) {
				uni.navigateTo({
					url: '/pages/user/login/login'
				})
			},
			goodLike: function(_id, goodState) {
				goodState = !goodState;
				uniCloud.callFunction({
					name: 'updateGoodState',
					data: {
						"diaryId": _id,
						"goodState": goodState
					},
					success: (e) => {
						this.getDate();
					}
				})
			},
			add: function(e) {
				if (this.userId == "") {
					uni.showToast({
						title: '请先进行登录',
						duration: 2000,
						icon: 'error'
					})
					setTimeout(function(e) {
						uni.navigateTo({
							url: '/pages/user/login/login'
						})
					}, 1500)
				} else {
					uni.navigateTo({
						url: '/pages/dary/add/add'
					})
				}

			},
			getDate: function(_id) {
				let that = this;
				uni.getStorage({
					key: 'userLogin',
					success: function(res) {
						// _id = res.data[0]._id
						that.userId = res.data[0]._id
					},
					fail: (err) => {
						console.log(err);
					}
				});
				uniCloud.callFunction({
					name: "getDary",
					data: {
						"userId": that.userId
					},
					success: (e) => {
						that.daryList = e.result.data;
					},
					fail: (err) => {
						console.log(err);
					}
				});

				uniCloud.callFunction({
					name: 'getUserById',
					data: {
						"userId": that.userId
					},
					success: (e) => {
						this.userId = e.result.data[0]._id;
						this.user = e.result.data[0];
						this.userImage = e.result.data[0].userImage
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			changeImage: function() {
				uni.showActionSheet({
					itemList: ['更换头像'],
					success: (e) => {
						if (e.tapIndex == 0) {
							uniCloud.chooseAndUploadFile({
								type: 'image',
							}).then(res => {
								console.log(res);
								this.userImage = res.tempFiles[0].url
								uniCloud.callFunction({
									name: 'updateUserImage',
									data: {
										"userId": this.userId,
										"userImage": this.userImage
									},
									success: (e) => {
										console.log('success')
									},
									fail: (err) => {
										console.log(err)
									}
								})
							}).catch(err => {
								console.log("--------------err------------------");
								console.log(err)
							})
						} else {
							console.log('取消了')
						}
					}
				})
			}
		}
	}
</script>

<style>
	@import '@/lib/css/indexStyle.css';
</style>
