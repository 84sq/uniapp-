<template>
	<view class="content">
		<view class="userBg" >
			<view class="user-title" :style="{backgroundImage: 'url(' + userBg + ')'}" v-if="userBg">
				<view class="user-image">
					<image :src="userImage ? userImage : defaultImage "></image>
				</view>
				<view class="nologinDisplay" @click="gotoLoginOrRegister" v-if="!userId">
					<view class="nologin text-color">请前去登录或注册 ></view>
				</view>
				<view class="user-message" v-if="userId">
					<view class="nickname text-color">{{nickname}}</view>
					<view class="sign text-color">
						<text>{{sign}}</text>
					</view>
					<view class="statistics flex-row text-color">
						<view class="dary-sum">
							<text>日记</text>
							<text style="padding-left: 20rpx;font-weight: 600;">{{diaryCount}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="operation-list flex-row" @click="goodLikeList">
			<view class="icon-text flex-column">
				<text>{{userId ? goodCount : 0}}</text>
				<text>点赞</text>
			</view>
		</view>
		<view class="columnLine"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				defaultImage: "../../../static/panda.png",
				userId: "",
				username: "",
				nickname: "",
				sign: "",
				userImage: "",
				diaryCount: "",
				goodCount: "",
				goodState: "",
				userBg: "../../../static/bg.png"
			}
		},
		onShow() {
			this.getDate();
		},
		methods: {
			gotoLoginOrRegister: function(e) {
				uni.navigateTo({
					url: '/pages/user/login/login'
				})
			},
			getDate: function(){
				let that = this;
				uni.getStorage({
					key: 'userLogin',
					success: function(res) {
						that.userId = res.data[0]._id
					},
					fail: (err) => {
						console.log(err);
					}
				});
				uniCloud.callFunction({
					name: 'getUserById',
					data: {
						"userId" : that.userId
					},
					success: (e) => {
						that.userId = e.result.data[0]._id;
						that.username = e.result.data[0].username;
						that.nickname = e.result.data[0].nickname;
						that.sign = e.result.data[0].sign;
						that.userImage = e.result.data[0].userImage;
						that.userBg = that.userImage;
						
					},
					fail: (err) => {
						console.log(err)
					}
				});
				uniCloud.callFunction({
					name: 'getDaryCount',
					data:{
						"userId" : that.userId
					},
					success: (e) => {
						that.diaryCount = e.result.total
					},
					fail: (err) => {
						console.log(err)
					}
				});
				uniCloud.callFunction({
					name: 'getGoodStateCount',
					data: {
						"userId" : that.userId,
						"goodState" : true
					},
					success: (e) => {
						that.goodCount = e.result.total
					}
				})
			},
			goodLikeList: function(e){
				uni.navigateTo({
					url: '/pages/user/goodLike/goodLike?userId=' + this.userId
				})
			}
		},
		onNavigationBarButtonTap:function(e){
			uni.showActionSheet({
				itemList:['更换账户','退出'],
				success: (e) => {
					if(e.tapIndex == 0){
						uni.navigateTo({
							url: '/pages/user/login/login'
						})
					}else if(e.tapIndex == 1){
						uni.clearStorage();
						location.reload();
					}
				}
			})
		}
	}
</script>

<style>
	@import '@/lib/css/mine.css';
	
</style>
