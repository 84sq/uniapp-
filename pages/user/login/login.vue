<template>
	<view class="body">
		<view class="container">
			<view class="uninput">
				<input @input="inputuname" @blur="getUser" placeholder="请输入用户名" type="text" />
			</view>
			<view class="pswinput">
				<input @input="inputpsw" placeholder="请输入密码" type="safe-password" />
			</view>
		</view>
		<view class="btn">
			<button type="primary" @click="login()">登录</button>
		</view>
		<view class="nologin" @click="gotoNoLogin">
			<text style="color: blue;"> 若无账号，前去注册</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: "",
				password: "",
				dbUname: "",
				dbPsw: "",
			}
		},
		onLoad() {
			this.getUser()
		},
		methods: {
			login: function() {
				let that = this;
				uni.getStorage({
					key: 'userLogin',
					success: function(res) {
						that.dbUname = res.data[0].username;
						that.dbPsw = res.data[0].password;
					},
					fail: (err) => {
						console.log(err);
					}
				});
				if (that.dbUname == that.username && that.dbPsw == that.password) {
					uni.showToast({
						title: '登录成功',
						duration: 2000
					})
					setTimeout(function(e) {

						uni.switchTab({
							url: '../../tabbar/mine/mine'
						});
					}, 2000)

				} else if (that.dbUname != that.username || that.dbPsw != that.password) {
					uni.showToast({
						title: '用户名或密码错误',
						duration: 2000,
						icon: 'error'
					})
				}
			},
			getUser: function(e) {
				uniCloud.callFunction({
					name: 'getUserByUsername',
					data: {
						"username": this.username
					},
					success: (event) => {
						uni.setStorage({
							key: 'userLogin',
							data: event.result.data,
							success(e) {
								console.log(e)
							}
						});
					}
				});

			},
			inputuname: function(e) {
				this.username = e.detail.value;
				// console.log(this.username)
			},
			inputpsw: function(e) {
				this.password = e.detail.value;
				// console.log(this.password)
			},
			gotoNoLogin: function(e) {
				uni.navigateTo({
					url: '/pages/user/no_login/no_login'
				})
			}
		}
	}
</script>

<style>
	@import '@/lib/css/login.css';
</style>
